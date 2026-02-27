'use client'

import { useEffect, useState, useMemo } from 'react'
import { VoteApiClient, ApiSuccess, CreateElectionRequest, UpdateElectionRequest, Election, ElectionStatus, DEFAULT_API_BASE_URL, ApiError } from '../api/api'
import StatsSection from '../components/admin_panel/statsSection'
import TicketsSection from '../components/admin_panel/ticketsSection'
import CreateElectionSection from '../components/admin_panel/createElectionSection'
import ElectionsListSection from '../components/admin_panel/electionsListSection'

type GetStatsData = {
	total_tickets: number
	redeemed_tickets: number
	voters: number
	votes: number
}
type PostTicketsData = {
	count: number
	ticket_keys: string[]
}
type GetElectionsData = {
	elections: Election[]
}

export default function AdminPanel() {
	const adminApi = useMemo(
		() =>
			new VoteApiClient({
				baseUrl: DEFAULT_API_BASE_URL,
				adminKey: process.env.NEXT_PUBLIC_ADMIN_KEY,
				fetchImpl: fetch.bind(globalThis),
			}),
		[],
	)

	const [stats, setStats] = useState<ApiSuccess<GetStatsData> | null>(null)
	const [elections, setElections] = useState<ApiSuccess<GetElectionsData> | null>(null)

	useEffect(() => {
		refreshStats()
		refreshElections()
	}, [])

	const refreshStats = async () => {
		const data = await adminApi.getStats()
		if (data.success) setStats(data)
	}

	const refreshElections = async () => {
		const data = await adminApi.getElections()
		if (data.success) setElections(data)
	}

	const handleCreateTickets = async (count: number): Promise<ApiSuccess<PostTicketsData> | ApiError> => {
		const res = await adminApi.createTickets(count)
		if (res.success) {
			await refreshStats()
		}
		return res
	}

	const handleCreateElection = async (formData: { title: string; description: string; starts_at: string; ends_at: string; options: string[] }) => {
		if (!formData.title || !formData.starts_at || !formData.ends_at) {
			alert('Заполните название и даты!')
			return
		}
		const notEmptyOptions = formData.options.filter(option => option.trim() !== '').map(option => ({ label: option.trim() }))
		if (notEmptyOptions.length === 0) {
			alert('Добавьте хотя бы один вариант ответа!')
			return
		}
		const formatDate = (dateStr: string) => dateStr.replace('T', ' ') + ':00'
		const body: CreateElectionRequest = {
			title: formData.title,
			description: formData.description,
			starts_at: formatDate(formData.starts_at),
			ends_at: formatDate(formData.ends_at),
			options: notEmptyOptions,
			status: 'scheduled',
		}
		const res = await adminApi.createElection(body)
		if (res.success) {
			alert(`Голосование создано, ID = ${res.election_id}`)
			await refreshElections()
		} else {
			alert(`Error: ${res.error}`)
		}
	}

	const fetchResults = async (electionId: number) => {
		return await adminApi.getResults(electionId)
	}

	const fetchOptions = async (electionId: number) => {
		return await adminApi.getOptions(electionId)
	}

	const handleAddOption = async (electionId: number, label: string) => {
		if (!label.trim()) return
		const res = await adminApi.createOptions(electionId, { label })
		if (res.success) {
			await refreshElections()
			alert('Вариант добавлен')
		} else {
			alert(`Error: ${res.error}`)
		}
	}

	const handleUpdateElectionStatus = async (electionId: number, newStatus: ElectionStatus) => {
		const election = elections?.elections.find(e => e.id === electionId)
		if (!election) return
		const body: UpdateElectionRequest = {
			title: election.title,
			starts_at: election.starts_at,
			ends_at: election.ends_at,
			status: newStatus,
			description: election.description,
		}
		const res = await adminApi.updateElection(electionId, body)
		if (res.success) {
			alert('Статус голосования обновлен')
			await refreshElections()
		} else {
			alert(`Error: ${res.error}`)
		}
	}

	const handleUpdateElectionDates = async (electionId: number, startsAt: string, endsAt: string) => {
		const election = elections?.elections.find(e => e.id === electionId)
		if (!election) return
		const formatDate = (dateStr: string) => dateStr.replace('T', ' ') + ':00'
		const body: UpdateElectionRequest = {
			title: election.title,
			starts_at: formatDate(startsAt),
			ends_at: formatDate(endsAt),
			status: election.status,
			description: election.description,
		}
		const res = await adminApi.updateElection(electionId, body)
		if (res.success) {
			alert('Время проведения голосования обновлено')
			await refreshElections()
		} else {
			alert(`Error: ${res.error}`)
		}
	}

	return (
		<div className="min-h-screen bg-background text-text-bright">
			<div className="max-w-md mx-auto p-4 space-y-6">
				<h1 className="text-2.5xl font-bold mb-4 ml-2">Админ‑панель</h1>

				<StatsSection stats={stats} />

				<TicketsSection handleCreateTickets={handleCreateTickets} />

				<CreateElectionSection handleCreateElection={handleCreateElection} />

				<ElectionsListSection
					elections={elections}
					fetchResults={fetchResults}
					fetchOptions={fetchOptions}
					onAddOption={handleAddOption}
					onUpdateStatus={handleUpdateElectionStatus}
					onUpdateDates={handleUpdateElectionDates}
				/>
			</div>
		</div>
	)
}
