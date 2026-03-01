import React from 'react'
import { Election, ApiSuccess } from '../../api/api'
import ElectionItem from './electionItem'

interface ElectionsListSectionProps {
	elections: ApiSuccess<{ elections: Election[] }> | null
	fetchResults: (electionId: number) => Promise<any>
	fetchOptions: (electionId: number) => Promise<any>
	onAddOption: (electionId: number, label: string) => Promise<void>
	onUpdateStatus: (electionId: number, status: string) => Promise<void>
	onUpdateDates: (electionId: number, startsAt: string, endsAt: string) => Promise<void>
}

export default function ElectionsListSection({ elections, fetchResults, fetchOptions, onAddOption, onUpdateStatus, onUpdateDates }: ElectionsListSectionProps) {
	if (!elections) {
		return (
			<section className="bg-dark-2 p-4 rounded-xl border border-border-dark-2">
				<h2 className="text-xl font-semibold mb-2">Текущие голосования</h2>
				<p className="text-red-400">Ошибка загрузки</p>
			</section>
		)
	}

	return (
		<section className="bg-dark-2 p-4 rounded-xl border border-border-dark-2">
			<h2 className="text-xl font-semibold mb-2">Текущие голосования</h2>
			<div className="space-y-3">
				{elections.elections.map(el => (
					<ElectionItem
						key={el.id}
						election={el}
						fetchResults={fetchResults}
						fetchOptions={fetchOptions}
						onAddOption={onAddOption}
						onUpdateStatus={onUpdateStatus}
						onUpdateDates={onUpdateDates}
					/>
				))}
			</div>
		</section>
	)
}
