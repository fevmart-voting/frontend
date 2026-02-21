import React from 'react';
import { Election, ElectionOption, VoteResultRow, ApiSuccess } from '../../api/admin/api';
import StatusDropdown from './statusDropdown';

interface ElectionItemProps {
  election: Election;
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
  electionResults: Record<number, ApiSuccess<{ results: VoteResultRow[]; total_votes: number }>>;
  electionOptions: Record<number, ApiSuccess<{ options: ElectionOption[] }>>;
  handleAddOption: (electionId: number, label: string) => Promise<void>;
  handleUpdateElectionStatus: (electionId: number, status: string) => Promise<void>;
}

export default function ElectionItem({
  election,
  editingElectionId,
  editStartsAt,
  editEndsAt,
  setEditStartsAt,
  setEditEndsAt,
  startEditDates,
  handleUpdateElectionDates,
  setEditingElectionId,
  viewResults,
  selectedElection,
  electionResults,
  electionOptions,
  handleAddOption,
  handleUpdateElectionStatus,
}: ElectionItemProps) {
  return (
    <div className="bg-dark p-3 rounded border border-border-dark-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold">{election.title}</h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap pt-2">
            {editingElectionId === election.id ? (
              <>
                <input
                  type="datetime-local"
                  value={editStartsAt}
                  onChange={(e) => setEditStartsAt(e.target.value)}
                  className="text-xs bg-dark border border-border-bright-01 rounded px-1 py-0.5 w-36"
                />
                <span>—</span>
                <input
                  type="datetime-local"
                  value={editEndsAt}
                  onChange={(e) => setEditEndsAt(e.target.value)}
                  className="text-xs bg-dark border border-border-bright-01 rounded px-1 py-0.5 w-36"
                />
                <button
                  onClick={() => handleUpdateElectionDates(election.id)}
                  className="text-xs bg-secondary text-dark px-2 py-1 rounded"
                >
                  Сохранить
                </button>
                <button
                  onClick={() => setEditingElectionId(null)}
                  className="text-xs bg-bright-01 px-2 py-1 rounded"
                >
                  Отмена
                </button>
              </>
            ) : (
              <>
                <p className="text-xs">с {election.starts_at} по {election.ends_at}</p>
                <button
                  onClick={() => startEditDates(election)}
                  className="text-xs text-secondary underline"
                  title="Редактировать даты"
                >
                  выбрать время проведения
                </button>
              </>
            )}
          </div>
        </div>

        <StatusDropdown
          electionId={election.id}
          currentStatus={election.status}
          isOpen={election.is_open}
          onStatusChange={handleUpdateElectionStatus}
        />
      </div>

      <div className="flex gap-2 mt-2 flex-wrap">
        <button
          onClick={() => viewResults(election.id)}
          className="text-xs bg-bright-01 px-2 py-1 rounded"
        >
          результаты
        </button>
      </div>

      {selectedElection === election.id && electionResults[election.id] && (
        <div className="mt-2 text-sm border-t border-bright-01 pt-2">
          <strong>Результаты:</strong>
          {electionResults[election.id].results.map((r: VoteResultRow) => (
            <div key={r.option_id} className="flex justify-between">
              <span>{r.label}</span>
              <span>{r.votes} ({r.percent.toFixed(1)}%)</span>
            </div>
          ))}
          <p className="text-right text-bright-01">Всего: {electionResults[election.id].total_votes}</p>
        </div>
      )}

      {selectedElection === election.id && electionOptions[election.id] && (
        <div className="mt-2 text-sm border-t border-bright-01 pt-2">
          <strong>Варианты:</strong>
          <ul className="list-disc list-inside">
            {electionOptions[election.id].options.map((opt: ElectionOption) => (
              <li key={opt.id}>{opt.label}</li>
            ))}
          </ul>
          <div className="flex gap-1 mt-2">
            <input
              type="text"
              placeholder="Новый вариант"
              id={`opt-${election.id}`}
              className="flex-1 px-2 py-1 text-sm rounded bg-dark border border-border-bright-01"
            />
            <button
              onClick={() => {
                const input = document.getElementById(`opt-${election.id}`) as HTMLInputElement;
                handleAddOption(election.id, input.value);
                input.value = '';
              }}
              className="bg-secondary text-dark px-3 py-1 text-sm rounded"
            >
              Добавить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}