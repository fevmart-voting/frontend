import React from 'react';
import { Election, ApiSuccess } from '../../api/admin/api';
import ElectionItem from './electionItem';

interface ElectionsListSectionProps {
  elections: ApiSuccess<{ elections: Election[] }> | null;
  openResultsId: number | null;
  openEditId: number | null;
  editStartsAt: string;
  editEndsAt: string;
  setEditStartsAt: (value: string) => void;
  setEditEndsAt: (value: string) => void;
  handleUpdateElectionDates: (electionId: number) => Promise<void>;
  viewResults: (electionId: number) => Promise<void>;
  viewOptions: (electionId: number) => Promise<void>;
  electionResults: Record<number, ApiSuccess<{ results: any[]; total_votes: number }>>;
  electionOptions: Record<number, ApiSuccess<{ options: any[] }>>;
  handleAddOption: (electionId: number, label: string) => Promise<void>;
  handleUpdateElectionStatus: (electionId: number, status: string) => Promise<void>;
}

export default function ElectionsListSection(props: ElectionsListSectionProps) {
  const {
    elections,
    openResultsId,
    openEditId,
    editStartsAt,
    editEndsAt,
    setEditStartsAt,
    setEditEndsAt,
    handleUpdateElectionDates,
    viewResults,
    viewOptions,
    electionResults,
    electionOptions,
    handleAddOption,
    handleUpdateElectionStatus,
  } = props;

  if (!elections) {
    return (
      <section className="bg-dark-2 p-4 rounded-xl border border-border-dark-2">
        <h2 className="text-xl font-semibold mb-2">Текущие голосования</h2>
        <p className="text-red-400">Ошибка загрузки</p>
      </section>
    );
  }

  return (
    <section className="bg-dark-2 p-4 rounded-xl border border-border-dark-2">
      <h2 className="text-xl font-semibold mb-2">Текущие голосования</h2>
      <div className="space-y-3">
        {elections.elections.map((el) => (
          <ElectionItem
            key={el.id}
            election={el}
            openResultsId={openResultsId}
            openEditId={openEditId}
            editStartsAt={editStartsAt}
            editEndsAt={editEndsAt}
            setEditStartsAt={setEditStartsAt}
            setEditEndsAt={setEditEndsAt}
            handleUpdateElectionDates={handleUpdateElectionDates}
            viewResults={viewResults}
            viewOptions={viewOptions}
            electionResults={electionResults}
            electionOptions={electionOptions}
            handleAddOption={handleAddOption}
            handleUpdateElectionStatus={handleUpdateElectionStatus}
          />
        ))}
      </div>
    </section>
  );
}