'use client'

import React, { useState } from 'react'
import { ApiSuccess } from '../../api/api'
import QrGenratorInPDF from '../../helpers/qrGenInPDF'

type PostTicketsData = { count: number; ticket_keys: string[] }

interface TicketsSectionProps {
	handleCreateTickets: (count: number) => Promise<ApiSuccess<PostTicketsData> | { success: false; error: string }>
}

export default function TicketsSection({ handleCreateTickets }: TicketsSectionProps) {
	const [ticketCount, setTicketCount] = useState(100)
	const [createdTickets, setCreatedTickets] = useState<ApiSuccess<PostTicketsData> | null>(null)

	const onCreateClick = async () => {
		const result = await handleCreateTickets(ticketCount)
		if (result.success) {
			setCreatedTickets(result)
		} else {
			alert(`Error: ${result.error}`)
		}
	}

	return (
		<section className="bg-dark-2 p-4 rounded-xl border border-border-dark-2">
			<h2 className="text-xl font-semibold mb-2">Тикеты</h2>
			<div className="flex flex-col gap-2 mb-3">
				<input
					type="number"
					min="1"
					value={ticketCount}
					onChange={e => setTicketCount(parseInt(e.target.value) || 1)}
					className="w-full px-2 py-1 rounded bg-dark border border-border-bright-01 text-text-bright"
				/>
				<button
					onClick={onCreateClick}
					className="w-full bg-secondary text-dark font-bold py-2 px-3 rounded">
					Создать тикеты
				</button>
			</div>

			{createdTickets && (
				<div className="mt-3 border-t border-border-bright-01 pt-3">
					<div className="flex items-center justify-between mb-2">
						<p className="text-sm">Создано {createdTickets.count} тикетов:</p>
						<button
							onClick={() => setCreatedTickets(null)}
							className="text-red-400 text-xl leading-none px-2"
							title="Закрыть">
							✕
						</button>
					</div>
					<button
						onClick={() => QrGenratorInPDF(createdTickets.ticket_keys)}
						className="w-full bg-bright text-dark font-bold py-2 px-3 rounded">
						Скачать QR-коды (PDF)
					</button>
				</div>
			)}
		</section>
	)
}
