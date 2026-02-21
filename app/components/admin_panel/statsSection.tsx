import React from 'react';
import { ApiSuccess } from '../../api/admin/api';

type GetStatsData = {
  total_tickets: number;
  redeemed_tickets: number;
  voters: number;
  votes: number;
};

interface StatsSectionProps {
  stats: ApiSuccess<GetStatsData> | null;
}

export default function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="bg-dark-2 p-4 rounded-xl border border-border-dark-2">
      <h2 className="text-xl font-semibold mb-2">Статистика</h2>
      {stats ? (
        <div className="grid grid-cols-1 gap-2 text-center">
          <div className="bg-bright-01 p-2 rounded">Всего тикетов: {stats.total_tickets}</div>
          <div className="bg-bright-01 p-2 rounded">Использованые тикеты: {stats.redeemed_tickets}</div>
          <div className="bg-bright-01 p-2 rounded">Голосоющих: {stats.voters}</div>
          <div className="bg-bright-01 p-2 rounded">Голосов: {stats.votes}</div>
        </div>
      ) : (
        <p className="text-red-400">Не удалось загрузить статистику</p>
      )}
    </section>
  );
}