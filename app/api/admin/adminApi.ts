import { VoteApiClient, ApiResult, VoteResultRow, API_PATHS, VoteApiClientOptions, ElectionStatus } from '../api'


export interface VoteApiAdminOptions extends VoteApiClientOptions {
	baseUrl?: string
	adminKey?: string
	fetchImpl?: typeof fetch
}

export type CreateElectionOptionInput = string

export interface CreateElectionRequest {
  title: string
  starts_at: string // YYYY-MM-DD HH:MM:SS
  ends_at: string // YYYY-MM-DD HH:MM:SS
  description?: string
  status?: ElectionStatus
  options?: CreateElectionOptionInput[]
}

export interface UpdateElectionRequest {
  title: string
  starts_at: string // YYYY-MM-DD HH:MM:SS
  ends_at: string // YYYY-MM-DD HH:MM:SS
  status: ElectionStatus
  description?: string
}

export type CreateOptionsRequest = { label: string } | { labels: string[] }



export class VoteApiAdmin extends VoteApiClient {
	private readonly adminKey?: string

	constructor(options: VoteApiAdminOptions = {}) {
		super(options)
		this.adminKey = options.adminKey
	}

	private adminHeaders(adminKey?: string): Record<string, string> {
		const key = adminKey ?? this.adminKey
		if (!key) {
			throw new Error('Admin key required for admin endpoint')
		}
		return { Authorization: 'Bearer ' + key }
	}

	/**
	 * GET /admin/elections/{id}/results
	 * Admin auth required.
	 */
	getResults(
		electionId: number,
		adminKey?: string,
	): Promise<
		ApiResult<{
			election_id: number
			results: VoteResultRow[]
			total_votes: number
		}>
	> {
		return this.request(API_PATHS.adminResults(electionId), {
			method: 'GET',
			headers: this.adminHeaders(adminKey),
		})
	}

	/**
	 * GET /admin/stats
	 * Admin auth required.
	 */
	getStats(adminKey?: string): Promise<
		ApiResult<{
			total_tickets: number
			redeemed_tickets: number
			voters: number
			votes: number
		}>
	> {
		console.log(this.adminHeaders(adminKey))
		return this.request(API_PATHS.adminStats, {
			method: 'GET',
			headers: this.adminHeaders(adminKey),
		})
	}

	/**
	 * POST /admin/elections/{id}/options
	 * Admin auth required.
	 */
	createOptions(electionId: number, body: CreateOptionsRequest, adminKey?: string): Promise<ApiResult<{ election_id: number; created: number }>> {
		return this.request(API_PATHS.adminElectionOptions(electionId), {
			method: 'POST',
			headers: {
				...this.adminHeaders(adminKey),
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})
	}

	/**
	 * PUT /admin/elections/{id}
	 * Admin auth required.
	 */
	updateElection(electionId: number, body: UpdateElectionRequest, adminKey?: string): Promise<ApiResult<{ election_id: number; updated: number }>> {
		return this.request(API_PATHS.adminElection(electionId), {
			method: 'PUT',
			headers: {
				...this.adminHeaders(adminKey),
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})
	}

	/**
	 * POST /admin/tickets?count=123
	 * Admin auth required.
	 */
	createTickets(count: number, adminKey?: string): Promise<ApiResult<{ count: number; ticket_keys: string[] }>> {
		return this.request(`${API_PATHS.adminTickets}?count=${count}`, {
			method: 'POST',
			headers: this.adminHeaders(adminKey),
		})
	}

	/**
	 * GET /admin/tickets
	 * Admin auth required.
	 */
	listTickets(adminKey?: string): Promise<ApiResult<{ total: number; redeemed: number; available: number }>> {
		return this.request(API_PATHS.adminTickets, {
			method: 'GET',
			headers: this.adminHeaders(adminKey),
		})
	}

	/**
	 * POST /admin/elections
	 * Admin auth required.
	 */
	createElection(body: CreateElectionRequest, adminKey?: string): Promise<ApiResult<{ election_id: number }>> {
		return this.request(API_PATHS.adminElections, {
			method: 'POST',
			headers: {
				...this.adminHeaders(adminKey),
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})
	}
}
