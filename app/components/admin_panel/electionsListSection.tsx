import React from 'react';
import { Election, ApiSuccess } from '../../api/admin/api';
import ElectionItem from './electionItem';
import { VoteApiClient } from '../../api/admin/api';
import { AdminApiHandlers } from '@/app/admin_panel/page';

interface ElectionsListSectionProps {
  elections: ApiSuccess<{ elections: Election[] }> | null;
  handlers: AdminApiHandlers
  adminApi: VoteApiClient
}

export default function ElectionsListSection({
  elections,
  adminApi,
  handlers
}: ElectionsListSectionProps) {


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
				{elections.elections.map(el => (
					<ElectionItem
						key={el.id}
						election={el}
            handlers={handlers}
						adminApi={adminApi}
					/>
				))}
			</div>
		</section>
	)
}