import React from 'react';
import { Election, ApiSuccess } from '../../api/admin/api';
import ElectionItem from './electionItem';

interface ElectionsListSectionProps {
  elections: ApiSuccess<{ elections: Election[] }> | null;
  editingElectionId: number | null;
  editStartsAt: string;
  editEndsAt: string;
  setEditStartsAt: (value: string) => void;
  setEditEndsAt: (value: string) => void;
  startEditDates: (el: Election) => void;
  handleUpdateElectionDates: (electionId: number) => Promise<void>;
  setEditingElectionId: (id: number | null) => void;
  viewResults: (electionId: number) => Promise<void>;
  selectedElection: number | null;
  electionResults: Record<number, any>;
  electionOptions: Record<number, any>;
  handleAddOption: (electionId: number, label: string) => Promise<void>;
  handleUpdateElectionStatus: (electionId: number, status: string) => Promise<void>;
}

export default function ElectionsListSection(props: ElectionsListSectionProps) {
  const {
    elections,
    ...rest
  } = props;

  return (
    <section className="bg-dark-2 p-4 rounded-xl border border-border-dark-2">
      <h2 className="text-xl font-semibold mb-2">Текущие голосования</h2>
      {!elections ? (
        <p className="text-red-400">Ошибка загрузки</p>
      ) : (
        <div className="space-y-3">
          {elections.elections.map((el) => (
            <ElectionItem key={el.id} election={el} {...rest} />
          ))}
        </div>
      )}
    </section>
  );
}