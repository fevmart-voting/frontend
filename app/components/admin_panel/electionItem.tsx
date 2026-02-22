import React from 'react';
import { Election, ElectionOption, VoteResultRow, ApiSuccess } from '../../api/admin/api';
import StatusDropdown from './statusDropdown';

interface ElectionItemProps {
  election: Election;
  openResultsId: number | null;
  openEditId: number | null;
  editStartsAt: string;
  editEndsAt: string;
  setEditStartsAt: (value: string) => void;
  setEditEndsAt: (value: string) => void;
  handleUpdateElectionDates: (electionId: number) => Promise<void>;
  viewResults: (electionId: number) => Promise<void>;
  viewOptions: (electionId: number) => Promise<void>;
  electionResults: Record<number, ApiSuccess<{ results: VoteResultRow[]; total_votes: number }>>;
  electionOptions: Record<number, ApiSuccess<{ options: ElectionOption[] }>>;
  handleAddOption: (electionId: number, label: string) => Promise<void>;
  handleUpdateElectionStatus: (electionId: number, status: string) => Promise<void>;
}

export default function ElectionItem({
  election,
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
}: ElectionItemProps) {
  // Проверяем, открыта ли панель результатов для выбранного голосования
  const showResults = openResultsId === election.id;
  // Проверяем, открыта ли панель редактирования для выбранного голосования
  const showEdit = openEditId === election.id;

  return (
    <div className="bg-dark p-3 rounded border border-border-dark-2">
      <div className="flex justify-between items-start">
        <h3 className="font-bold">{election.title}</h3>
        <StatusDropdown
          electionId={election.id}
          currentStatus={election.status}
          isOpen={election.is_open}
          onStatusChange={handleUpdateElectionStatus}
        />
      </div>

      <div className="flex gap-2 mt-2">
        <button
          onClick={() => viewResults(election.id)}
          className="text-xs bg-bright-01 px-2 py-1 rounded"
        >
          результаты
        </button>
        <button
          onClick={() => viewOptions(election.id)}
          className="text-xs bg-bright-01 px-2 py-1 rounded"
        >
          редактировать
        </button>
      </div>

      {showResults && electionResults[election.id] && (
        <div className="mt-2 text-sm border-t border-bright-01 pt-2">
          <strong>Результаты:</strong>
          {electionResults[election.id].results.map((r: VoteResultRow) => (
            <div key={r.option_id} className="flex justify-between">
              <span>{r.label}</span>
              <span>{r.votes} ({r.percent.toFixed(1)}%)</span>
            </div>
          ))}
          <p className="text-right text-bright-01">
            Всего: {electionResults[election.id].total_votes}
          </p>
        </div>
      )}

      {showEdit && electionOptions[election.id] && (
        <div className="mt-2 text-sm border-t border-bright-01 pt-2">
          <div className="mb-2">
            <strong>Изменить даты:</strong>
            <div className="flex flex-col gap-1 mt-1">
              <input
                type="datetime-local"
                value={editStartsAt}
                onChange={(e) => setEditStartsAt(e.target.value)}
                className="text-xs bg-dark border border-border-bright-01 rounded px-1 py-0.5"
              />
              <span className="text-xs self-center">—</span>
              <input
                type="datetime-local"
                value={editEndsAt}
                onChange={(e) => setEditEndsAt(e.target.value)}
                className="text-xs bg-dark border border-border-bright-01 rounded px-1 py-0.5"
              />
              <div className="flex gap-1 mt-1">
                <button
                  onClick={() => handleUpdateElectionDates(election.id)}
                  className="text-xs bg-secondary text-dark px-2 py-1 rounded"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>

          <div>
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
        </div>
      )}
    </div>
  );
}