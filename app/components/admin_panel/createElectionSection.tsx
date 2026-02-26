'use client';

import { AdminApiHandlers } from '@/app/admin_panel/page';
import React, { useState } from 'react';

interface CreateElectionSectionProps {
  handlers: AdminApiHandlers
}

export default function CreateElectionSection({ handlers:{handleCreateElection, ...handlers} }: CreateElectionSectionProps) {
  const [newElection, setNewElection] = useState({
    title: '',
    description: '',
    starts_at: '',
    ends_at: '',
    options: [''],
  });

  const removeOptionField = (index: number) => {
    if (newElection.options.length > 1) {
      setNewElection({
        ...newElection,
        options: newElection.options.filter((_, i) => i !== index),
      });
    }
  };

  const onSubmit = async () => {
    await handleCreateElection(newElection);
  };

  return (
    <section className="bg-dark-2 p-4 rounded-xl border border-border-dark-2">
      <h2 className="text-xl font-semibold mb-2">Новое голосование</h2>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Название"
          value={newElection.title}
          onChange={(e) => setNewElection({ ...newElection, title: e.target.value })}
          className="w-full px-3 py-2 rounded bg-dark border border-border-bright-01 text-text-bright"
        />
        <textarea
          placeholder="Описание (необязательно)"
          value={newElection.description}
          onChange={(e) => setNewElection({ ...newElection, description: e.target.value })}
          className="w-full px-3 py-2 rounded bg-dark border border-border-bright-01 text-text-bright"
          rows={2}
        />

        <div className="space-y-2">
          <div>
            <label className="block text-sm text-bright-02 mb-1">Начало голосования</label>
            <input
              type="datetime-local"
              value={newElection.starts_at}
              onChange={(e) => setNewElection({ ...newElection, starts_at: e.target.value })}
              className="w-full px-3 py-2 rounded bg-dark border border-border-bright-01 text-text-bright"
            />
          </div>
          <div>
            <label className="block text-sm text-bright-02 mb-1">Конец голосования</label>
            <input
              type="datetime-local"
              value={newElection.ends_at}
              onChange={(e) => setNewElection({ ...newElection, ends_at: e.target.value })}
              className="w-full px-3 py-2 rounded bg-dark border border-border-bright-01 text-text-bright"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-bright-02">Варианты ответов</label>
          {newElection.options.map((opt, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder={`Вариант ${idx + 1}`}
                value={opt}
                onChange={(e) => {
                  const updated = [...newElection.options];
                  updated[idx] = e.target.value;
                  setNewElection({ ...newElection, options: updated });
                }}
                className="flex-1 px-3 py-2 rounded bg-dark border border-border-bright-01 text-text-bright"
              />
              {newElection.options.length > 1 && (
                <button
                  onClick={() => removeOptionField(idx)}
                  className="text-red-400 text-xl leading-none px-2"
                  title="Удалить вариант"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => setNewElection({ ...newElection, options: [...newElection.options, ''] })}
            className="text-sm text-secondary underline"
          >
            Добавить вариант
          </button>
        </div>

        <button
          onClick={onSubmit}
          className="w-full bg-secondary text-dark font-bold py-2 px-3 rounded"
        >
          Создать голосование
        </button>
      </div>
    </section>
  );
}