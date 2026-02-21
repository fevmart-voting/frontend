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
import QrGenratorInPDF from '../helpers/qrGenInPDF';

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

  const [stats, setStats] = useState<ApiSuccess<GetStatsData> | null>(null);
  const [elections, setElections] = useState<ApiSuccess<GetElectionsData> | null>(null);
  const [ticketCount, setTicketCount] = useState(100);
  const [createdTickets, setCreatedTickets] = useState<ApiSuccess<PostTicketsData> | null>(null);
  const [selectedElection, setSelectedElection] = useState<number | null>(null);
  const [electionResults, setElectionResults] = useState<Record<number, ApiSuccess<GetElectionResultData>>>({});
  const [electionOptions, setElectionOptions] = useState<Record<number, ApiSuccess<GetElectionOptionsData>>>({});

  const [editingElectionId, setEditingElectionId] = useState<number | null>(null);
  const [editStartsAt, setEditStartsAt] = useState('');
  const [editEndsAt, setEditEndsAt] = useState('');

  const [newElection, setNewElection] = useState({
    title: '',
    description: '',
    starts_at: '',
    ends_at: '',
    options: [''],
  });

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

  const removeOptionField = (index: number) => {
    if (newElection.options.length > 1) {
      setNewElection({
        ...newElection,
        options: newElection.options.filter((_, i) => i !== index),
      });
    }
  };

  const handleAddOption = async (electionId: number, label: string) => {
    if (!label.trim()) return;
    const res = await adminApi.createOptions(electionId, { label });
    if (res.success) {
      refreshElections();
      alert('Вариант добавлен');
      const optRes = await adminApi.getOptions(electionId);
      if (optRes.success) {
        setElectionOptions((prev) => ({ ...prev, [electionId]: optRes }));
      }
    } else {
      alert(`Error: ${res.error}`);
    }
  };

  const viewResults = async (electionId: number) => {
    if (selectedElection === electionId) {
      setSelectedElection(null);
      return;
    }
    if (!electionResults[electionId]) {
      const res = await adminApi.getResults(electionId);
      if (res.success) {
        setElectionResults((prev) => ({ ...prev, [electionId]: res }));
      } else {
        alert(`Error: ${res.error}`);
        return;
      }
    }
    if (!electionOptions[electionId]) {
      const res = await adminApi.getOptions(electionId);
      if (res.success) {
        setElectionOptions((prev) => ({ ...prev, [electionId]: res }));
      } else {
        alert(`Error: ${res.error}`);
        return;
      }
    }
    setSelectedElection(electionId);
  };

  const startEditDates = (el: Election) => {
    const starts = el.starts_at.replace(' ', 'T').slice(0, 16);
    const ends = el.ends_at.replace(' ', 'T').slice(0, 16);
    setEditStartsAt(starts);
    setEditEndsAt(ends);
    setEditingElectionId(el.id);
  };

  const handleUpdateElectionDates = async (electionId: number) => {
    if (!editStartsAt || !editEndsAt) return;
    const election = elections?.elections.find(e => e.id === electionId);
    if (!election) return;
    const formatDate = (dateStr: string) => dateStr.replace('T', ' ') + ':00';
    const body: UpdateElectionRequest = {
      title: election.title,
      starts_at: formatDate(editStartsAt),
      ends_at: formatDate(editEndsAt),
      status: election.status,
      description: election.description,
    };
    const res = await adminApi.updateElection(electionId, body);
    if (res.success) {
      alert('Время проведения голосования обновлено');
      refreshElections();
      setEditingElectionId(null);
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
      setEditingElectionId(null);
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
          downloadQrPdf={QrGenratorInPDF}
        />

        <CreateElectionSection
          newElection={newElection}
          setNewElection={setNewElection}
          handleCreateElection={handleCreateElection}
          removeOptionField={removeOptionField}
        />

        <ElectionsListSection
          elections={elections}
          editingElectionId={editingElectionId}
          editStartsAt={editStartsAt}
          editEndsAt={editEndsAt}
          setEditStartsAt={setEditStartsAt}
          setEditEndsAt={setEditEndsAt}
          startEditDates={startEditDates}
          handleUpdateElectionDates={handleUpdateElectionDates}
          setEditingElectionId={setEditingElectionId}
          viewResults={viewResults}
          selectedElection={selectedElection}
          electionResults={electionResults}
          electionOptions={electionOptions}
          handleAddOption={handleAddOption}
          handleUpdateElectionStatus={handleUpdateElectionStatus}
        />
      </div>
    </div>
  );
}