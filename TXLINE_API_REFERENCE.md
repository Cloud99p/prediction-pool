# TxLINE API Reference

**Official Documentation:** https://txline.txodds.com/documentation  
**OpenAPI Spec:** https://txline.txodds.com/docs/docs.yaml  
**GitHub Examples:** https://github.com/txodds/tx-on-chain

---

## Base URLs

| Environment | URL |
|-------------|-----|
| **Mainnet** | `https://txline.txodds.com/api` |
| **Devnet** | `https://txline-dev.txodds.com/api` |

---

## Authentication

All API requests require two headers:

```http
Authorization: Bearer <JWT_TOKEN>
X-Api-Token: <API_TOKEN>
```

### Getting JWT

```bash
curl -X POST https://txline.txodds.com/auth/guest/start
```

**Response:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9..."
}
```

**JWT expires after 30 days.**

---

## Fixtures Endpoints

### Get Fixtures Snapshot

```http
GET /api/fixtures/snapshot
```

**Query Parameters:**
- `competitionId` (optional) - Filter by competition ID
- `startEpochDay` (optional) - Filter by start date

**Example:**
```bash
curl -H "Authorization: Bearer <JWT>" \
     -H "X-Api-Token: <TOKEN>" \
     "https://txline.txodds.com/api/fixtures/snapshot?competitionId=72"
```

**Response:**
```json
[
  {
    "FixtureId": 18172379,
    "CompetitionId": 72,
    "Competition": "World Cup",
    "Participant1": "USA",
    "Participant2": "Bosnia & Herzegovina",
    "Participant1IsHome": true,
    "StartTime": 1782950400000,
    "Ts": 1782889200000
  }
]
```

---

### Get Fixture Updates

```http
GET /api/fixtures/updates/{epochDay}/{hourOfDay}
```

**Path Parameters:**
- `epochDay` - Days since Unix epoch
- `hourOfDay` - Hour (0-23)

**Example:**
```bash
curl -H "Authorization: Bearer <JWT>" \
     -H "X-Api-Token: <TOKEN>" \
     "https://txline.txodds.com/api/fixtures/updates/20085/15"
```

---

### Get Fixture Validation (Merkle Proof)

```http
GET /api/fixtures/validation?fixtureId={id}&timestamp={ts}
```

**Query Parameters:**
- `fixtureId` (required) - Fixture ID to validate
- `timestamp` (optional) - Unix timestamp in ms

**Example:**
```bash
curl -H "Authorization: Bearer <JWT>" \
     -H "X-Api-Token: <TOKEN>" \
     "https://txline.txodds.com/api/fixtures/validation?fixtureId=18172379"
```

---

## Odds Endpoints

### Get Odds Snapshot

```http
GET /api/odds/snapshot/{fixtureId}
```

**Path Parameters:**
- `fixtureId` - Fixture ID

**Query Parameters:**
- `asOf` (optional) - Historical snapshot timestamp (ms)

**Example:**
```bash
curl -H "Authorization: Bearer <JWT>" \
     -H "X-Api-Token: <TOKEN>" \
     "https://txline.txodds.com/api/odds/snapshot/18172379"
```

**Response:**
```json
[
  {
    "FixtureId": 18172379,
    "MessageId": "1835883510:00003:000161-10021-stab",
    "Ts": 1782930000715,
    "Bookmaker": "TXLineStablePriceDemargined",
    "BookmakerId": 10021,
    "SuperOddsType": "OVERUNDER_PARTICIPANT_GOALS",
    "MarketParameters": "line=2.5",
    "PriceNames": ["over", "under"],
    "Prices": [1694, 2442],
    "Pct": ["59.032", "40.950"]
  }
]
```

**Market Types:**
- `OVERUNDER_PARTICIPANT_GOALS` - Over/Under goals
- `ASIANHANDICAP_PARTICIPANT_GOALS` - Asian handicap
- `1X2` - Match winner (if available)

---

### Get Live Odds Updates

```http
GET /api/odds/updates/{fixtureId}
```

**Path Parameters:**
- `fixtureId` - Fixture ID

**Example:**
```bash
curl -H "Authorization: Bearer <JWT>" \
     -H "X-Api-Token: <TOKEN>" \
     "https://txline.txodds.com/api/odds/updates/18172379"
```

---

### Get Historical Odds

```http
GET /api/odds/updates/{epochDay}/{hourOfDay}/{interval}
```

**Path Parameters:**
- `epochDay` - Days since Unix epoch
- `hourOfDay` - Hour (0-23)
- `interval` - 5-minute interval (0-11)

**Query Parameters:**
- `fixtureId` (optional) - Filter by fixture

**Example:**
```bash
curl -H "Authorization: Bearer <JWT>" \
     -H "X-Api-Token: <TOKEN>" \
     "https://txline.txodds.com/api/odds/updates/20085/15/0"
```

---

### Get Odds Validation (Merkle Proof)

```http
GET /api/odds/validation?messageId={id}&ts={timestamp}
```

**Query Parameters:**
- `messageId` (required) - Message ID from odds response
- `ts` (required) - Timestamp

**Example:**
```bash
curl -H "Authorization: Bearer <JWT>" \
     -H "X-Api-Token: <TOKEN>" \
     "https://txline.txodds.com/api/odds/validation?messageId=1835883510:00003:000161-10021-stab&ts=1782930000715"
```

---

## Scores Endpoints

### Get Scores Snapshot

```http
GET /api/scores/snapshot/{fixtureId}
```

**Path Parameters:**
- `fixtureId` - Fixture ID

**Query Parameters:**
- `asOf` (optional) - Historical snapshot timestamp (ms)

**Example:**
```bash
curl -H "Authorization: Bearer <JWT>" \
     -H "X-Api-Token: <TOKEN>" \
     "https://txline.txodds.com/api/scores/snapshot/18172379"
```

**Response:**
```json
[
  {
    "FixtureId": 18172379,
    "Seq": 1,
    "Ts": 1782950400000,
    "GameState": "1H",
    "HomeScore": 1,
    "AwayScore": 0,
    "Basketball": {...}, // If basketball
    "Football": {...}    // If football
  }
]
```

**Game States:**
- `NS` - Not Started
- `1H` - First Half
- `HT` - Half Time
- `2H` - Second Half
- `FT` - Full Time
- `Q1`, `Q2`, `Q3`, `Q4` - Quarters (basketball/football)

---

### Get Live Scores Updates

```http
GET /api/scores/updates/{fixtureId}
```

**Path Parameters:**
- `fixtureId` - Fixture ID

**Example:**
```bash
curl -H "Authorization: Bearer <JWT>" \
     -H "X-Api-Token: <TOKEN>" \
     "https://txline.txodds.com/api/scores/updates/18172379"
```

---

### Get Historical Scores

```http
GET /api/scores/historical/{fixtureId}
```

**Path Parameters:**
- `fixtureId` - Fixture ID

**Note:** Only available for fixtures started between 2 weeks and 6 hours ago.

**Example:**
```bash
curl -H "Authorization: Bearer <JWT>" \
     -H "X-Api-Token: <TOKEN>" \
     "https://txline.txodds.com/api/scores/historical/18172379"
```

---

### Get Scores Stat Validation (3-Level Merkle Proof)

```http
GET /api/scores/stat-validation?fixtureId={id}&seq={seq}&statKey={key}
```

**Query Parameters:**
- `fixtureId` (required) - Fixture ID
- `seq` (required) - Sequence number
- `statKey` (required) - Stat key (e.g., 1 = Participant 1 Score)
- `statKey2` (optional) - Second stat key
- `statKeys` (optional) - Comma-separated list (V2 mode)

**Example:**
```bash
curl -H "Authorization: Bearer <JWT>" \
     -H "X-Api-Token: <TOKEN>" \
     "https://txline.txodds.com/api/scores/stat-validation?fixtureId=18172379&seq=401&statKey=1"
```

**Response:**
```json
{
  "summary": {
    "fixtureId": 18172379,
    "updateStats": {
      "updateCount": 10,
      "minTimestamp": 1782950400000,
      "maxTimestamp": 1782957600000
    },
    "eventStatsSubTreeRoot": "0x..."
  },
  "subTreeProof": [...],
  "mainTreeProof": [...],
  "statToProve": {
    "statKey": 1,
    "statValue": 2
  },
  "eventStatRoot": "0x...",
  "statProof": [...]
}
```

---

## SSE Streaming Endpoints

### Odds Stream

```http
GET /api/odds/stream
```

**Query Parameters:**
- `fixtureId` (optional) - Filter by fixture

**Headers:**
```http
Accept: text/event-stream
Cache-Control: no-cache
Authorization: Bearer <JWT>
X-Api-Token: <TOKEN>
```

**Example:**
```bash
curl -H "Authorization: Bearer <JWT>" \
     -H "X-Api-Token: <TOKEN>" \
     -H "Accept: text/event-stream" \
     "https://txline.txodds.com/api/odds/stream"
```

**SSE Message Format:**
```
id: 1782930000:00001
event: odds_update
data: {"FixtureId":18172379,"MarketType":"OVERUNDER_2.5","Prices":[1694,2442]}
```

---

### Scores Stream

```http
GET /api/scores/stream
```

**Query Parameters:**
- `fixtureId` (optional) - Filter by fixture

**Headers:**
```http
Accept: text/event-stream
Cache-Control: no-cache
Authorization: Bearer <JWT>
X-Api-Token: <TOKEN>
```

**Example:**
```bash
curl -H "Authorization: Bearer <JWT>" \
     -H "X-Api-Token: <TOKEN>" \
     -H "Accept: text/event-stream" \
     "https://txline.txodds.com/api/scores/stream"
```

**SSE Message Format:**
```
id: 1782930000:00001
event: score_update
data: {"FixtureId":18172379,"GameState":"1H","HomeScore":1,"AwayScore":0}
```

---

## Stat Key Reference

### Football (Soccer)

| Key | Statistic |
|-----|-----------|
| 1 | Participant 1 Total Score |
| 2 | Participant 2 Total Score |
| 3 | Participant 1 Total Touchdowns |
| 4 | Participant 2 Total Touchdowns |
| 5 | Participant 1 Total Field Goals |
| 6 | Participant 2 Total Field Goals |

### Basketball

| Key | Statistic |
|-----|-----------|
| 1 | Participant 1 Total Score |
| 2 | Participant 2 Total Score |
| 3 | Participant 1 Total Fouls |
| 4 | Participant 2 Total Fouls |
| 5 | Participant 1 Total Personal Fouls |
| 7 | Participant 1 Total Blocks |
| 9 | Participant 1 Total Rebounds |
| 11 | Participant 1 Total Free Throws Made |
| 13 | Participant 1 Total 2-Points Made |
| 15 | Participant 1 Total 3-Points Made |

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid value for: header Authorization"
}
```

### 401 Unauthorized
```json
{
  "error": "Authorization failed: Invalid or expired guest JWT"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied: Invalid API token or insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Fixture not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Error details"
}
```

---

## Rate Limits

| Tier | Delay | Rate Limit |
|------|-------|------------|
| **Free (Service Level 1)** | 60 seconds | Standard |
| **Paid Tiers** | Real-time | Higher limits |

---

## Competition IDs

| Competition | ID |
|-------------|-----|
| FIFA World Cup | 72 |
| International Friendlies | 430 |
| UEFA Champions League | (varies) |
| English Premier League | (varies) |

---

## Code Examples

### TypeScript - Get Fixtures

```typescript
import axios from 'axios';

const client = axios.create({
  baseURL: 'https://txline.txodds.com',
  headers: {
    'Authorization': `Bearer ${jwt}`,
    'X-Api-Token': apiToken,
  },
});

// Get fixtures
const fixtures = await client.get('/api/fixtures/snapshot', {
  params: { competitionId: 72 },
});

// Get odds
const odds = await client.get('/api/odds/snapshot/18172379');

// Get scores
const scores = await client.get('/api/scores/snapshot/18172379');
```

### TypeScript - SSE Stream

```typescript
const eventSource = new EventSource(
  'https://txline.txodds.com/api/odds/stream',
  {
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'X-Api-Token': apiToken,
    },
  }
);

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Odds update:', data);
};
```

---

## References

- **Official Docs:** https://txline.txodds.com/documentation
- **OpenAPI Spec:** https://txline.txodds.com/docs/docs.yaml
- **GitHub:** https://github.com/txodds/tx-on-chain
- **Quickstart:** https://txline.txodds.com/documentation/quickstart
- **World Cup Tier:** https://txline.txodds.com/documentation/worldcup
