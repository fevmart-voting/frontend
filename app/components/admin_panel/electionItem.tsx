import React, { useState } from 'react'
import { Election, ElectionOption, VoteResultRow, ApiSuccess, VoteApiClient } from '../../api/admin/api'
import { AdminApiHandlers } from '@/app/admin_panel/page'

import dynamic from 'next/dynamic'

const StatusDropdown = dynamic(() => import('./statusDropdown'), { ssr: false })

interface ElectionItemProps {
	election: Election
	adminApi: VoteApiClient
  handlers: AdminApiHandlers
}

export default function ElectionItem({ election, handlers, adminApi }: ElectionItemProps) {
	const fetchResults = async (electionId: number) => {
		return await adminApi.getResults(electionId)
	}

	const fetchOptions = async (electionId: number) => {
		return await adminApi.getOptions(electionId)
	}

	// Состояния для открытия панелей
	const [isResultsOpen, setIsResultsOpen] = useState(false)
	const [isEditOpen, setIsEditOpen] = useState(false)

	// Состояния для загруженных данных
	const [results, setResults] = useState<ApiSuccess<{ results: VoteResultRow[]; total_votes: number }> | null>(null)
	const [options, setOptions] = useState<ApiSuccess<{ options: ElectionOption[] }> | null>(null)

	// Состояния для полей дат
	const [editStartsAt, setEditStartsAt] = useState(election.starts_at.replace(' ', 'T').slice(0, 16))
	const [editEndsAt, setEditEndsAt] = useState(election.ends_at.replace(' ', 'T').slice(0, 16))

	const handleResultsClick = async () => {
		if (!isResultsOpen && !results) {
			const data = await fetchResults(election.id)
			if (data.success) {
				setResults(data)
			} else {
				alert(`Error`)
				return
			}
		}
		setIsResultsOpen(!isResultsOpen)
	}

	const handleEditClick = async () => {
		if (!isEditOpen && !options) {
			const data = await fetchOptions(election.id)
			if (data.success) {
				setOptions(data)
			} else {
				alert(`Error`)
				return
			}
		}
		setIsEditOpen(!isEditOpen)
	}

	const handleSaveDates = async () => {
		await handlers.handleUpdateElectionDates(election.id, editStartsAt, editEndsAt)
		setIsEditOpen(false)
	}

	const handleCancelEdit = () => {
		setIsEditOpen(false)
		setEditStartsAt(election.starts_at.replace(' ', 'T').slice(0, 16))
		setEditEndsAt(election.ends_at.replace(' ', 'T').slice(0, 16))
	}

	return (
		<div className="bg-dark p-3 rounded border border-border-dark-2">
			<div className="flex justify-between items-start">
				<h3 className="font-bold">{election.title}</h3>
				<StatusDropdown
					electionId={election.id}
					currentStatus={election.status}
					isOpen={election.is_open}
					onStatusChange={handlers.handleUpdateElectionStatus}
				/>
			</div>

			<div className="flex gap-2 mt-2">
				<button
					onClick={handleResultsClick}
					className="text-xs bg-bright-01 px-2 py-1 rounded">
					результаты
				</button>
				<button
					onClick={handleEditClick}
					className="text-xs bg-bright-01 px-2 py-1 rounded">
					редактировать
				</button>
			</div>

			{isResultsOpen && results && (
				<div className="mt-2 text-sm border-t border-bright-01 pt-2">
					<strong>Результаты:</strong>
					{results.results.map(r => (
						<div
							key={r.option_id}
							className="flex justify-between">
							<span>{r.label}</span>
							<span>
								{r.votes} ({r.percent.toFixed(1)}%)
							</span>
						</div>
					))}
					<p className="text-right text-bright-01">Всего: {results.total_votes}</p>
				</div>
			)}

			{isEditOpen && options && (
				<div className="mt-2 text-sm border-t border-bright-01 pt-2">
					<div className="mb-2">
						<strong>Изменить даты:</strong>
						<div className="flex flex-col gap-1 mt-1">
							<input
								type="datetime-local"
								value={editStartsAt}
								onChange={e => setEditStartsAt(e.target.value)}
								className="text-xs bg-dark border border-border-bright-01 rounded px-1 py-0.5"
							/>
							<span className="text-xs self-center">—</span>
							<input
								type="datetime-local"
								value={editEndsAt}
								onChange={e => setEditEndsAt(e.target.value)}
								className="text-xs bg-dark border border-border-bright-01 rounded px-1 py-0.5"
							/>
							<div className="flex gap-1 mt-1">
								<button
									onClick={handleSaveDates}
									className="text-xs bg-secondary text-dark px-2 py-1 rounded">
									Сохранить
								</button>
								<button
									onClick={handleCancelEdit}
									className="text-xs bg-bright-01 px-2 py-1 rounded">
									Отмена
								</button>
							</div>
						</div>
					</div>

					<div>
						<strong>Варианты:</strong>
						<ul className="list-disc list-inside">
							{options.options.map(opt => (
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
									const input = document.getElementById(`opt-${election.id}`) as HTMLInputElement
									handlers.handleAddOption(election.id, input.value)
									input.value = ''
								}}
								className="bg-secondary text-dark px-3 py-1 text-sm rounded">
								Добавить
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
