## Response Envelope

All JSON responses use one of these shapes:

Success:

```json
{
  "success": true,
  "...": "payload fields"
}
```

Error:

```json
{
  "success": false,
  "error": "message"
}
```

## Authentication Model

There are two independent auth flows:

1. Public voting flow

- `ticket key` (key1): one-time code
- `voter key` (key2): returned by `/activate`, then used for `/vote`
- Header for `/vote`: `Authorization: Bearer <voter_key>`

2. Admin flow

- Header preferred: `X-Admin-Key: <admin_key>`
- Also accepted: `Authorization: Bearer <admin_key>`
- Required for all `/admin/*` endpoints

## Time Format

Election date fields use SQLite datetime strings:

```txt
YYYY-MM-DD HH:MM:SS
```

Use UTC consistently in frontend and backend.

## Election Open Rule

An election is open only if:

- `status = "active"`
- current server time is between `starts_at` and `ends_at`

`GET /elections` includes `is_open` computed by this rule.

## Rate Limiting

Rate limiting is applied per IP and path:

- `POST /activate`
- `POST /vote`

When limited:

- HTTP `429`
- body: `{ "success": false, "error": "Too many requests" }`
- header: `Retry-After: 60`

## Endpoint Matrix

| Method | Path                            | Auth             | Notes                               |
| ------ | ------------------------------- | ---------------- | ----------------------------------- |
| POST   | `/activate?key=...`             | No               | Redeem ticket key -> voter key      |
| GET    | `/elections`                    | No               | List elections                      |
| GET    | `/elections/{id}/options`       | No               | List options for election           |
| POST   | `/vote`                         | Bearer voter key | Cast one vote                       |
| POST   | `/admin/tickets?count=...`      | Admin key        | Create ticket keys                  |
| GET    | `/admin/tickets`                | Admin key        | Ticket summary                      |
| POST   | `/admin/elections`              | Admin key        | Create election (+optional options) |
| PUT    | `/admin/elections/{id}`         | Admin key        | Update election                     |
| POST   | `/admin/elections/{id}/options` | Admin key        | Add option(s)                       |
| GET    | `/admin/stats`                  | Admin key        | Global stats                        |
| GET    | `/admin/elections/{id}/results` | Admin key        | Results with percentages            |

## Public Endpoints

### POST `/activate?key=FIRST_KEY`

Redeems a ticket key and returns a voter key.

Success `200`:

```json
{
  "success": true,
  "voter_key": "SECOND_KEY"
}
```

Common errors:

- `400` `key is required`
- `404` `Invalid key`
- `409` `Key already redeemed`
- `503` `Token pepper not configured`

### GET `/elections`

Success `200`:

```json
{
  "success": true,
  "elections": [
    {
      "id": 1,
      "title": "Board Election",
      "description": "2026 term",
      "starts_at": "2026-02-08 10:00:00",
      "ends_at": "2026-02-08 12:00:00",
      "status": "active",
      "is_open": true
    }
  ]
}
```

### GET `/elections/{id}/options`

Success `200`:

```json
{
  "success": true,
  "election_id": 1,
  "options": [
    { "id": 1, "label": "Option A" },
    { "id": 2, "label": "Option B" }
  ]
}
```

Common errors:

- `400` `Invalid election_id`

### POST `/vote`

Headers:

```txt
Authorization: Bearer SECOND_KEY
Content-Type: application/json
```

Body:

```json
{
  "election_id": 1,
  "option_id": 2
}
```

Success `200`:

```json
{
  "success": true,
  "message": "Vote accepted"
}
```

Common errors:

- `400` `Provide election_id and option_id` or `Invalid option`
- `401` `Invalid voter key`
- `409` `Election is not open` or `Already voted`
- `503` `Token pepper not configured`

## Admin Endpoints

### POST `/admin/tickets?count=100`

Success `201`:

```json
{
  "success": true,
  "count": 100,
  "ticket_keys": ["..."]
}
```

Validation:

- `count` must be `1..10000`

### GET `/admin/tickets`

Success `200`:

```json
{
  "success": true,
  "total": 100,
  "redeemed": 42,
  "available": 58
}
```

### POST `/admin/elections`

Body:

```json
{
  "title": "Election Title",
  "description": "Optional",
  "starts_at": "2026-02-08 10:00:00",
  "ends_at": "2026-02-08 12:00:00",
  "status": "scheduled",
  "options": ["Option A", { "label": "Option B" }]
}
```

Success `200`:

```json
{
  "success": true,
  "election_id": 12
}
```

Required fields:

- `title`
- `starts_at`
- `ends_at`

### PUT `/admin/elections/{id}`

All fields below are required except `description`:

```json
{
  "title": "Election Title",
  "description": "Optional",
  "starts_at": "2026-02-08 10:00:00",
  "ends_at": "2026-02-08 12:00:00",
  "status": "active"
}
```

Success `200`:

```json
{
  "success": true,
  "election_id": 12,
  "updated": 1
}
```

### POST `/admin/elections/{id}/options`

Body can be either:

```json
{ "label": "Option A" }
```

or

```json
{ "labels": ["Option A", "Option B"] }
```

Success `200`:

```json
{
  "success": true,
  "election_id": 12,
  "created": 2
}
```

### GET `/admin/stats`

Success `200`:

```json
{
  "success": true,
  "total_tickets": 100,
  "redeemed_tickets": 42,
  "voters": 42,
  "votes": 40
}
```

### GET `/admin/elections/{id}/results`

Success `200`:

```json
{
  "success": true,
  "election_id": 12,
  "results": [
    { "option_id": 1, "label": "Option A", "votes": 15, "percent": 60.0 },
    { "option_id": 2, "label": "Option B", "votes": 10, "percent": 40.0 }
  ],
  "total_votes": 25
}
```

### Admin Errors

For any `/admin/*` endpoint:

- `401` `Admin key required`
- `503` `Admin API key not configured`

## TypeScript Integration (`api.ts`)

Use the root `api.ts` client for frontend implementation.

Example:

```ts
import { VoteApiClient } from "./api";

const api = new VoteApiClient({ baseUrl: "http://localhost:8085" });

const activation = await api.activate(firstKey);
if (!activation.success) throw new Error(activation.error);

const voterKey = activation.voter_key;
const voteResult = await api.castVote(voterKey, {
  election_id: 1,
  option_id: 2,
});
```

Admin example:

```ts
const adminApi = new VoteApiClient({
  baseUrl: "http://localhost:8085",
  adminKey: process.env.VITE_ADMIN_KEY,
});

const stats = await adminApi.getStats();
```