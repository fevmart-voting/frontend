export const DEFAULT_API_BASE_URL = process.env.NEXT_PUBLIC_BACK_URL ?? 'http://localhost:8085'

//TODO: CHANGE VoteApiClient to VoteApiAdmin in admin_panel and its dependencies

export const API_PATHS = {
	activate: '/activate',
	vote: '/vote',
	elections: '/elections',
	electionOptions: (electionId: number) => `/elections/${electionId}/options`,
	adminTickets: '/admin/tickets',
	adminElections: '/admin/elections',
	adminElection: (electionId: number) => `/admin/elections/${electionId}`,
	adminElectionOptions: (electionId: number) => `/admin/elections/${electionId}/options`,
	adminStats: '/admin/stats',
	adminResults: (electionId: number) => `/admin/elections/${electionId}/results`,
} as const

export type ApiError = {
	success: false
	error: string
}

export type ApiSuccess<T extends Record<string, unknown>> = T & {
	success: true
}

export type ApiResult<T extends Record<string, unknown>> = ApiSuccess<T> | ApiError

export type ElectionStatus = 'scheduled' | 'active' | 'closed' | string

export interface Election {
	id: number
	title: string
	description: string
	starts_at: string // YYYY-MM-DD HH:MM:SS
	ends_at: string // YYYY-MM-DD HH:MM:SS
	status: ElectionStatus
	is_open: boolean
}

export interface ElectionOption {
	id: number
	label: string
}

export interface VoteResultRow {
	option_id: number
	label: string
	votes: number
	percent: number
}

export interface VoteRequest {
	election_id: number
	option_id: number
}

export interface VoteApiClientOptions {
	baseUrl?: string
	fetchImpl?: typeof fetch
}

/**
 * Documented API client.
 *
 * Notes:
 * - Public auth: `Authorization: Bearer <voter_key>` for `/vote`.
 * - Admin auth: `Authorization: Bearer <admin_key>` for `/admin/*`.
 * - Error shape from server: `{ success: false, error: string }`.
 */
export class VoteApiClient {
	private readonly baseUrl: string
	private readonly fetchImpl: typeof fetch

	constructor(options: VoteApiClientOptions = {}) {
		this.baseUrl = (options.baseUrl ?? DEFAULT_API_BASE_URL).replace(/\/+$/, '')
		this.fetchImpl = options.fetchImpl ?? fetch
	}

	/**
	 * POST /activate?key=FIRST_KEY
	 * Redeems a one-time ticket key and returns voter_key.
	 */
	activate(ticketKey: string): Promise<ApiResult<{ voter_key: string }>> {
		const path = `${API_PATHS.activate}?key=${encodeURIComponent(ticketKey)}`
		return this.request(path, { method: 'POST' })
	}

	/**
	 * GET /elections
	 * Returns all elections.
	 */
	getElections(): Promise<ApiResult<{ elections: Election[] }>> {
		return this.request(API_PATHS.elections, { method: 'GET' })
	}

	/**
	 * GET /elections/{id}/options
	 * Returns options for one election.
	 */
	getOptions(electionId: number): Promise<ApiResult<{ election_id: number; options: ElectionOption[] }>> {
		return this.request(API_PATHS.electionOptions(electionId), { method: 'GET' })
	}

	/**
	 * POST /vote
	 * Auth: Authorization Bearer <voter_key>
	 */
	castVote(voterKey: string, body: VoteRequest): Promise<ApiResult<{ message: string }>> {
		return this.request(API_PATHS.vote, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${voterKey}`,
			},
			body: JSON.stringify(body),
		})
	}

	async request<T extends Record<string, unknown>>(path: string, init: RequestInit): Promise<ApiResult<T>> {
		const response = await this.fetchImpl(this.url(path), init)
		const raw = await response.text()

		if (!raw) {
			if (response.ok) {
				return { success: true } as ApiSuccess<T>
			}
			return { success: false, error: `HTTP ${response.status}` }
		}

		try {
			return JSON.parse(raw) as ApiResult<T>
		} catch (_err) {
			if (!response.ok) {
				return { success: false, error: `HTTP ${response.status}: ${raw}` }
			}
			return { success: false, error: 'Invalid JSON response from server' }
		}
	}

	private url(path: string): string {
		return `${this.baseUrl}${path}`
	}
}
