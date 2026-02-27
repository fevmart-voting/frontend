export const DEFAULT_API_BASE_URL = process.env.NEXT_PUBLIC_BACK_URL ?? "http://localhost:8085";


export const API_PATHS = {
  activate: "/activate",
  vote: "/vote",
  elections: "/elections",
  electionOptions: (electionId: number) => `/elections/${electionId}/options`,
  adminTickets: "/admin/tickets",
  adminElections: "/admin/elections",
  adminElection: (electionId: number) => `/admin/elections/${electionId}`,
  adminElectionOptions: (electionId: number) =>
    `/admin/elections/${electionId}/options`,
  adminStats: "/admin/stats",
  adminResults: (electionId: number) =>
    `/admin/elections/${electionId}/results`,
} as const;

export type ApiError = {
  success: false;
  error: string;
};

export type ApiSuccess<T extends Record<string, unknown>> = T & {
  success: true;
};

export type ApiResult<T extends Record<string, unknown>> =
  | ApiSuccess<T>
  | ApiError;

export type ElectionStatus = "scheduled" | "active" | "closed" | string;

export interface Election {
  id: number;
  title: string;
  description: string;
  starts_at: string; // YYYY-MM-DD HH:MM:SS
  ends_at: string; // YYYY-MM-DD HH:MM:SS
  status: ElectionStatus;
  is_open: boolean;
}

export interface ElectionOption {
  id: number;
  label: string;
}

export interface VoteResultRow {
  option_id: number;
  label: string;
  votes: number;
  percent: number;
}

export interface VoteRequest {
  election_id: number;
  option_id: number;
}

export type CreateElectionOptionInput = string;

export interface CreateElectionRequest {
  title: string;
  starts_at: string; // YYYY-MM-DD HH:MM:SS
  ends_at: string; // YYYY-MM-DD HH:MM:SS
  description?: string;
  status?: ElectionStatus;
  options?: CreateElectionOptionInput[];
}

export interface UpdateElectionRequest {
  title: string;
  starts_at: string; // YYYY-MM-DD HH:MM:SS
  ends_at: string; // YYYY-MM-DD HH:MM:SS
  status: ElectionStatus;
  description?: string;
}

export type CreateOptionsRequest = { label: string } | { labels: string[] };

export interface VoteApiClientOptions {
  baseUrl?: string;
  adminKey?: string;
  fetchImpl?: typeof fetch;
}

/**
 * Documented API client.
 *
 * Notes:
 * - Public auth: `Authorization: Bearer <voter_key>` for `/vote`.
 * - Admin auth: `X-Admin-Key: <admin_key>` for `/admin/*`.
 * - Error shape from server: `{ success: false, error: string }`.
 */
export class VoteApiClient {
  private readonly baseUrl: string;
  private readonly adminKey?: string;
  private readonly fetchImpl: typeof fetch;


  constructor(options: VoteApiClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? DEFAULT_API_BASE_URL).replace(/\/+$/, "");
    this.adminKey = options.adminKey;
    this.fetchImpl = options.fetchImpl ?? fetch;


  }

  /**
   * POST /activate?key=FIRST_KEY
   * Redeems a one-time ticket key and returns voter_key.
   */
  activate(
    ticketKey: string
  ): Promise<ApiResult<{ voter_key: string }>> {
    const path = `${API_PATHS.activate}?key=${encodeURIComponent(ticketKey)}`;
    return this.request(path, { method: "POST" });
  }

  /**
   * GET /elections
   * Returns all elections.
   */
  getElections(): Promise<ApiResult<{ elections: Election[] }>> {
    return this.request(API_PATHS.elections, { method: "GET" });
  }

  /**
   * GET /elections/{id}/options
   * Returns options for one election.
   */
  getOptions(
    electionId: number
  ): Promise<ApiResult<{ election_id: number; options: ElectionOption[] }>> {
    return this.request(API_PATHS.electionOptions(electionId), { method: "GET" });
  }

  /**
   * POST /vote
   * Auth: Authorization Bearer <voter_key>
   */
  castVote(
    voterKey: string,
    body: VoteRequest
  ): Promise<ApiResult<{ message: string }>> {
    return this.request(API_PATHS.vote, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${voterKey}`,
      },
      body: JSON.stringify(body),
    });
  }

  /**
   * POST /admin/tickets?count=123
   * Admin auth required.
   */
  createTickets(
    count: number,
    adminKey?: string
  ): Promise<ApiResult<{ count: number; ticket_keys: string[] }>> {
    return this.request(`${API_PATHS.adminTickets}?count=${count}`, {
      method: "POST",
      headers: this.adminHeaders(adminKey),
    });
  }

  /**
   * GET /admin/tickets
   * Admin auth required.
   */
  listTickets(
    adminKey?: string
  ): Promise<ApiResult<{ total: number; redeemed: number; available: number }>> {
    return this.request(API_PATHS.adminTickets, {
      method: "GET",
      headers: this.adminHeaders(adminKey),
    });
  }

  /**
   * POST /admin/elections
   * Admin auth required.
   */
  createElection(
    body: CreateElectionRequest,
    adminKey?: string
  ): Promise<ApiResult<{ election_id: number }>> {
    return this.request(API_PATHS.adminElections, {
      method: "POST",
      headers: {
        ...this.adminHeaders(adminKey),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  /**
   * PUT /admin/elections/{id}
   * Admin auth required.
   */
  updateElection(
    electionId: number,
    body: UpdateElectionRequest,
    adminKey?: string
  ): Promise<ApiResult<{ election_id: number; updated: number }>> {
    return this.request(API_PATHS.adminElection(electionId), {
      method: "PUT",
      headers: {
        ...this.adminHeaders(adminKey),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  /**
   * POST /admin/elections/{id}/options
   * Admin auth required.
   */
  createOptions(
    electionId: number,
    body: CreateOptionsRequest,
    adminKey?: string
  ): Promise<ApiResult<{ election_id: number; created: number }>> {
    return this.request(API_PATHS.adminElectionOptions(electionId), {
      method: "POST",
      headers: {
        ...this.adminHeaders(adminKey),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  /**
   * GET /admin/stats
   * Admin auth required.
   */
  getStats(
    adminKey?: string
  ): Promise<
    ApiResult<{
      total_tickets: number;
      redeemed_tickets: number;
      voters: number;
      votes: number;
    }>
  > {
    console.log(this.adminHeaders(adminKey))
    return this.request(API_PATHS.adminStats, {
      method: "GET",
      headers: this.adminHeaders(adminKey),
    });
  }

  /**
   * GET /admin/elections/{id}/results
   * Admin auth required.
   */
  getResults(
    electionId: number,
    adminKey?: string
  ): Promise<
    ApiResult<{
      election_id: number;
      results: VoteResultRow[];
      total_votes: number;
    }>
  > {
    return this.request(API_PATHS.adminResults(electionId), {
      method: "GET",
      headers: this.adminHeaders(adminKey),
    });
  }

  private adminHeaders(adminKey?: string): Record<string, string> {
    const key = adminKey ?? this.adminKey;
    if (!key) {
      throw new Error("Admin key required for admin endpoint");
    }
    return { "X-Admin-Key": key };
  }

  private async request<T extends Record<string, unknown>>(
    path: string,
    init: RequestInit
  ): Promise<ApiResult<T>> {
    const response = await this.fetchImpl(this.url(path), init);
    const raw = await response.text();

    if (!raw) {
      if (response.ok) {
        return { success: true } as ApiSuccess<T>;
      }
      return { success: false, error: `HTTP ${response.status}` };
    }

    try {
      return JSON.parse(raw) as ApiResult<T>;
    } catch (_err) {
      if (!response.ok) {
        return { success: false, error: `HTTP ${response.status}: ${raw}` };
      }
      return { success: false, error: "Invalid JSON response from server" };
    }
  }

  private url(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}
