'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  VoteApiClient,
  ApiSuccess,
  CreateElectionRequest,
  UpdateElectionRequest,
  VoteResultRow,
  ElectionOption,
  Election,
  ElectionStatus,
  DEFAULT_API_BASE_URL,
} from '../api/admin/api';
import StatsSection from '../components/admin_panel/statsSection';
import TicketsSection from '../components/admin_panel/ticketsSection';
import CreateElectionSection from '../components/admin_panel/createElectionSection';
import ElectionsListSection from '../components/admin_panel/electionsListSection';

type GetStatsData = {
  total_tickets: number;
  redeemed_tickets: number;
  voters: number;
  votes: number;
};
type PostTicketsData = {
  count: number;
  ticket_keys: string[];
};
type GetElectionsData = {
  elections: Election[];
};
type GetElectionResultData = {
  results: VoteResultRow[];
  total_votes: number;
};
type GetElectionOptionsData = {
  options: ElectionOption[];
};

export default function AdminPanel() {

  const adminApi = useMemo(() => new VoteApiClient({
    baseUrl: DEFAULT_API_BASE_URL,
    adminKey: process.env.NEXT_PUBLIC_ADMIN_KEY,
    fetchImpl: fetch.bind(globalThis),
  }), []);

  // Статистика
  const [stats, setStats] = useState<ApiSuccess<GetStatsData> | null>(null);

  // Тикеты
  const [ticketCount, setTicketCount] = useState(100);
  const [createdTickets, setCreatedTickets] = useState<ApiSuccess<PostTicketsData> | null>(null);

  // Создание нового голосвания
  const [newElection, setNewElection] = useState({
    title: '',
    description: '',
    starts_at: '',
    ends_at: '',
    options: [''],
  });

  // Список голосваний и редактирование выбранного голосования
  const [elections, setElections] = useState<ApiSuccess<GetElectionsData> | null>(null);
  const [editElectionResults, setEditElectionResults] = useState<Record<number, ApiSuccess<GetElectionResultData>>>({});
  const [editElectionOptions, setEditElectionOptions] = useState<Record<number, ApiSuccess<GetElectionOptionsData>>>({});
  
  // Два независимых состояния : редактирование и просмотр результатов
  const [openResultsId, setOpenResultsId] = useState<number | null>(null);
  const [openEditId, setOpenEditId] = useState<number | null>(null);

  // Даты начала и конца проведения (для редактирования)
  const [editElectioStartsAt, setEditElectioStartsAt] = useState('');
  const [editElectioEndsAt, setEditElectioEndsAt] = useState('');

  useEffect(() => {
    refreshStats();
    refreshElections();
  }, []);

  const refreshStats = async () => {
    const data = await adminApi.getStats();
    if (data.success) setStats(data);
  };

  const refreshElections = async () => {
    const data = await adminApi.getElections();
    if (data.success) setElections(data);
  };

  const handleCreateTickets = async () => {
    const res = await adminApi.createTickets(ticketCount);
    if (res.success) {
      setCreatedTickets(res);
      refreshStats();
    } else {
      alert(`Error: ${res.error}`);
    }
  };

  const handleCreateElection = async () => {
    if (!newElection.title || !newElection.starts_at || !newElection.ends_at) {
      alert('Заполните название и даты!');
      return;
    }
    const notEmptyOptions = newElection.options
      .filter((option) => option.trim() !== '')
      .map((option) => ({ label: option.trim() }));
    if (notEmptyOptions.length === 0) {
      alert('Добавьте хотя бы один вариант ответа!');
      return;
    }
    const formatDate = (dateStr: string) => dateStr.replace('T', ' ') + ':00';
  
    const body: CreateElectionRequest = {
      title: newElection.title,
      description: newElection.description,
      starts_at: formatDate(newElection.starts_at),
      ends_at: formatDate(newElection.ends_at),
      options: notEmptyOptions,
      status: "scheduled",
    };
    const res = await adminApi.createElection(body);

    if (res.success) {
      alert(`Голосование создано, ID = ${res.election_id}`);
      setNewElection({ title: '', description: '', starts_at: '', ends_at: '', options: [''] });
      refreshElections();
    } else {
      alert(`Error: ${res.error}`);
    }
  };

  const removeOptionFromNewElectionForm = (index: number) => {
    if (newElection.options.length > 1) {
      setNewElection({
        ...newElection,
        options: newElection.options.filter((_, i) => i !== index),
      });
    }
  };

  // Режим просмотра результатов
  const viewEletionResults = async (electionId: number) => {
    if (openResultsId === electionId) {
      setOpenResultsId(null);
      return;
    }
    if (!editElectionResults[electionId]) {
      const res = await adminApi.getResults(electionId);
      if (res.success) {
        setEditElectionResults((prev) => ({ ...prev, [electionId]: res }));
      } else {
        alert(`Error: ${res.error}`);
        return;
      }
    }
    setOpenResultsId(electionId);
  };

  // Режим редактирования
  const viewEletionOptions = async (electionId: number) => {
    if (openEditId === electionId) {
      setOpenEditId(null);
      return;
    }
    if (!editElectionOptions[electionId]) {
      const res = await adminApi.getOptions(electionId);
      if (res.success) {
        setEditElectionOptions((prev) => ({ ...prev, [electionId]: res }));
      } else {
        alert(`Error: ${res.error}`);
        return;
      }
    }
    const election = elections?.elections.find(e => e.id === electionId);
    if (election) {
      const starts = election.starts_at.replace(' ', 'T').slice(0, 16);
      const ends = election.ends_at.replace(' ', 'T').slice(0, 16);
      setEditElectioStartsAt(starts);
      setEditElectioEndsAt(ends);
    }
    setOpenEditId(electionId);
  };

  const handleAddOption = async (electionId: number, label: string) => {
    if (!label.trim()) return;
    const res = await adminApi.createOptions(electionId, { label });
    if (res.success) {
      refreshElections();
      alert('Вариант добавлен');
      const optRes = await adminApi.getOptions(electionId);
      if (optRes.success) {
        setEditElectionOptions((prev) => ({ ...prev, [electionId]: optRes }));
      }
    } else {
      alert(`Error: ${res.error}`);
    }
  };

  const handleUpdateElectionDates = async (electionId: number) => {
    if (!editElectioStartsAt || !editElectioEndsAt) return;
    const election = elections?.elections.find(e => e.id === electionId);
    if (!election) return;
    const formatDate = (dateStr: string) => dateStr.replace('T', ' ') + ':00';
    const body: UpdateElectionRequest = {
      title: election.title,
      starts_at: formatDate(editElectioStartsAt),
      ends_at: formatDate(editElectioEndsAt),
      status: election.status,
      description: election.description,
    };
    const res = await adminApi.updateElection(electionId, body);
    if (res.success) {
      alert('Время проведения голосования обновлено');
      refreshElections();
    } else {
      alert(`Error: ${res.error}`);
    }
  };

  const handleUpdateElectionStatus = async (electionId: number, newElectionStatus: ElectionStatus) => {
    const election = elections?.elections.find(e => e.id === electionId);
    if (!election) return;
    const body: UpdateElectionRequest = {
      title: election.title,
      starts_at: election.starts_at,
      ends_at: election.ends_at,
      status: newElectionStatus,
      description: election.description,
    };
    const res = await adminApi.updateElection(electionId, body);
    if (res.success) {
      alert('Статус голосования обновлен');
      refreshElections();
    } else {
      alert(`Error: ${res.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-bright">
      <div className="max-w-md mx-auto p-4 space-y-6">
        <h1 className="text-2.5xl font-bold mb-4 ml-2">Админ‑панель</h1>

        <StatsSection stats={stats} />

        <TicketsSection
          ticketCount={ticketCount}
          setTicketCount={setTicketCount}
          handleCreateTickets={handleCreateTickets}
          createdTickets={createdTickets}
          setCreatedTickets={setCreatedTickets}
        />

        <CreateElectionSection
          newElection={newElection}
          setNewElection={setNewElection}
          handleCreateElection={handleCreateElection}
          removeOptionField={removeOptionFromNewElectionForm}
        />

        <ElectionsListSection
          elections={elections}
          openResultsId={openResultsId}
          openEditId={openEditId}
          editStartsAt={editElectioStartsAt}
          editEndsAt={editElectioEndsAt}
          setEditStartsAt={setEditElectioStartsAt}
          setEditEndsAt={setEditElectioEndsAt}
          handleUpdateElectionDates={handleUpdateElectionDates}
          viewResults={viewEletionResults}
          viewOptions={viewEletionOptions}
          electionResults={editElectionResults}
          electionOptions={editElectionOptions}
          handleAddOption={handleAddOption}
          handleUpdateElectionStatus={handleUpdateElectionStatus}
        />
      </div>
    </div>
  );
}