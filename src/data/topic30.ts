import type { TopicData } from './types';

export const topic30Data: TopicData = {
  id: "u3t8",
  title: "REST API Commands and Operation Flow",
  moduleName: "Unit III: Alarm Lifecycle Management",
  context: {
    prerequisites: ["REST API Concept"],
    dependentTopics: ["ONF TAPI Overview", "Network Function Virtualization (NFV) Concepts (VIM, VNFM, NFVO)"],
    nextSteps: "Study ONF TAPI Overview to see how REST API operation flows are standardised specifically for optical/transport network management in the TAPI framework.",
    rfcReferences: [
      { rfc: "RFC 7231", title: "HTTP/1.1 Semantics and Content", summary: "HTTP methods (GET, POST, PUT, PATCH, DELETE) and their idempotency semantics.", url: "https://www.rfc-editor.org/rfc/rfc7231" },
      { rfc: "RFC 5789", title: "PATCH Method for HTTP", summary: "Defines partial resource updates.", url: "https://www.rfc-editor.org/rfc/rfc5789" },
      { rfc: "RFC 7807", title: "Problem Details for HTTP APIs", summary: "Standard error response format.", url: "https://www.rfc-editor.org/rfc/rfc7807" },
      { rfc: "RFC 8288", title: "Web Linking", summary: "Link header for pagination in REST APIs.", url: "https://www.rfc-editor.org/rfc/rfc8288" },
      { rfc: "RFC 7240", title: "Prefer Header for HTTP", summary: "Client preferences for asynchronous processing (202 Accepted).", url: "https://www.rfc-editor.org/rfc/rfc7240" },
      { rfc: "RFC 6585", title: "Additional HTTP Status Codes", summary: "429 Too Many Requests for rate limiting.", url: "https://www.rfc-editor.org/rfc/rfc6585" }
    ]
  },
  storytelling: {
    analogy: "HTTP Verbs as CRUD Database Operations",
    story: "REST API commands are five database operations mapped to HTTP verbs — and once you understand this mapping, every REST API becomes immediately readable and predictable regardless of what domain it manages. GET maps to SQL SELECT: it reads data from the server without changing anything. The NMS alarm query GET /alarmManagement/v4/alarm?severity=critical returns the current list of critical alarms exactly as a SELECT would return rows from a database table. POST maps to SQL INSERT: it creates a new resource. POST /alarmManagement/v4/alarm/acknowledgement with a JSON body creates a new acknowledgement record for the specified alarm; the server responds with 201 Created and a Location header pointing to the new acknowledgement resource. PUT maps to REPLACE: it completely overwrites an existing resource with the provided representation. PATCH maps to UPDATE: it applies partial changes — send only the fields you want to change, the server merges them into the existing record. DELETE maps to DELETE: it removes a resource and returns 204 No Content. The operation flow for a complete NMS alarm management session looks like this: the OSS client first authenticates by POSTing to the OAuth token endpoint to obtain a Bearer token (T_auth time). It then sends GET /alarmManagement/v4/alarm with the Bearer token in the Authorization header and query parameters filtering by severity and state. The NMS validates the token, queries the alarm database, serialises the result to JSON, and returns 200 OK with an array of alarm objects and pagination metadata in the Link response header. If the result set is large (thousands of alarms), the client follows the Link header's 'next' URL to retrieve subsequent pages. For each Critical alarm, the client sends PATCH /alarmManagement/v4/alarm/{id} to acknowledge it. When a fault is resolved, the client sends DELETE or PATCH with state=CLEARED to close the alarm. This predictable, verb-driven flow is what makes REST APIs self-documenting and easy to test with tools like curl, Postman, or Python requests.",
    reflectiveQuestions: [
      "Why is POST considered non-idempotent while PUT is idempotent, and what practical NMS issue does this distinction prevent?",
      "When the NMS NBI returns a 202 Accepted response (rather than 200 OK) for a PATCH operation on an alarm, what does this communicate to the OSS client?",
      "How should an OSS client handle a 429 Too Many Requests response from the NMS NBI — what retry strategy minimises both delay and server load?"
    ],
    technicalConnection: "NMS NBI operation flow: (1) Auth: POST /oauth2/token with client_credentials grant → receive access_token (JWT, 1-hour expiry). (2) Query: GET /alarmManagement/v4/alarm?severity=critical&state=unacknowledged&limit=100 → 200 OK + Link: <...?page=2>; rel=next. (3) Paginate: follow Link headers until no 'next' link. (4) Acknowledge: PATCH /alarmManagement/v4/alarm/{id} body: {\"ackState\":\"acknowledged\",\"ackUserId\":\"noc01\"}. (5) Clear: PATCH /alarmManagement/v4/alarm/{id} body: {\"perceivedSeverity\":\"cleared\"}. Tools: curl for CLI testing; Postman for GUI testing; Python requests library; OpenAPI Generator for automatic client SDK generation from OAS 3.0 spec."
  },
  mathModelling: {
    need: "A network orchestration team is designing the REST API interaction flow for a self-service VPN provisioning portal. A customer submits a VPN creation request — the portal must validate the request, reserve resources in IPAM, configure the NMS, and create a billing record in SAP. The entire end-to-end flow must complete within 30 seconds (interactive response time). If any step fails, all completed steps must be rolled back. Decision: synchronous sequential API calls / asynchronous job pattern / saga pattern / two-phase commit.",
    equation: "DECISION CONSTRAINT: End-to-end VPN creation < 30 seconds. Rollback must be automatic on any step failure. Must handle partial failure (e.g., NMS config succeeds but SAP billing fails). Must return a job ID to the customer immediately if provisioning exceeds 30 seconds. Decision: Synchronous Sequential / Async Job / Saga Pattern / Two-Phase Commit.",
    technicalDetails: "Synchronous Sequential: POST to IPAM → POST to NMS → POST to SAP in sequence. IPAM: 1 s. NMS: 8 s (NETCONF provisioning). SAP: 3 s. Total: 12 s — within the 30-second target if all succeed. On failure at SAP step: NMS config must be manually rolled back — no automatic mechanism. Partial failure risk: high. Asynchronous Job Pattern (Recommended for long flows): Portal returns job ID immediately (< 500 ms). Backend worker executes IPAM → NMS → SAP sequentially. Customer polls GET /jobs/{id} for status. Job timeout: 30 seconds. If NMS takes > 25 s (abnormal), the 30-second synchronous target is met via polling. Rollback: job worker tracks completed steps and reverses them on failure. Saga Pattern (Recommended for reliability): Each step is a local transaction with a compensating transaction: IPAM reserve → if SAP fails, IPAM release. NMS config → if SAP fails, NMS delete. Each service implements its own compensating API. Rollback: automatic — the saga orchestrator calls compensating APIs in reverse order. No two-phase commit required. Two-Phase Commit (2PC): Distributed atomic transaction. Locks all resources (IPAM, NMS, SAP) during prepare phase — guarantees all-or-nothing. But: 2PC is not supported by NMS RESTCONF or SAP REST APIs — requires distributed transaction coordinator. Performance: holding locks during NMS 8-second provisioning blocks other operations. Not suitable for external APIs.",
    explanation: [
      { term: "Synchronous Sequential API Calls", meaning: "POST to each backend in sequence. WHY INSUFFICIENT: On SAP failure after NMS success, rollback is manual — engineer must issue a DELETE to NMS manually. No automatic rollback. Suitable only for idempotent single-step operations (e.g., updating an interface description via one RESTCONF PATCH). WHEN ADOPTED: For simple, single-step operations where partial failure is not possible (no multi-system coordination required)." },
      { term: "Asynchronous Job Pattern (Recommended for long flows)", meaning: "Portal returns job ID immediately. Background worker executes the multi-step flow. Customer polls for status. WHY RECOMMENDED: Decouples the 30-second response target from the actual provisioning time. If NMS takes 25 s (abnormal but possible), the customer gets a job ID in < 500 ms and polls to completion. Worker tracks completed steps for rollback. Widely used: Nokia NSP provisioning APIs return job IDs for all operations > 5 seconds." },
      { term: "Saga Pattern (Recommended for reliability)", meaning: "Each step has a compensating transaction. Orchestrator calls forward steps; on failure, calls compensating steps in reverse. WHY BEST FOR RELIABILITY: Automatic rollback without 2PC. Each service owns its rollback logic — no distributed transaction coordinator. Combines with async job pattern: the saga is executed by the background job worker. WHEN ADOPTED: Multi-system provisioning flows (VPN, service, network slice) where each backend system must be kept consistent with the others on failure." },
      { term: "Two-Phase Commit (2PC)", meaning: "Distributed atomic transaction with prepare+commit phases. WHY REJECTED: NMS RESTCONF and SAP REST do not support 2PC protocol — they are not transaction-aware participants. Holding locks during NMS 8-second provisioning blocks other provisioning operations. WHEN ADOPTED: Databases (PostgreSQL, MySQL) within the portal's own backend for ensuring IPAM reservation records and job state are updated atomically — 2PC within the portal's internal database, not across external APIs." }
    ],
    advantages: [
      "Async job + saga pattern provides automatic rollback on any step failure — the provisioning portal never leaves a customer in a half-provisioned state regardless of which backend system fails",
      "Returning a job ID immediately (< 500 ms) meets the interactive response time expectation even for 30-second provisioning flows — the customer receives real-time status updates via polling without blocking",
      "Saga compensating transactions are owned by each backend service — the portal orchestrator does not need to know the internal details of IPAM rollback or NMS rollback, making the integration loosely coupled"
    ],
    limitations: [
      "Synchronous sequential calls are adopted for single-system, single-step REST operations (PATCH one resource) where partial failure is not possible",
      "2PC is adopted within the portal's internal database (PostgreSQL) to ensure job state and audit log records are updated atomically — not across external API systems",
      "Pure polling (no saga) is adopted when the backend systems do not expose compensating APIs — the portal tracks completed steps and the NOC rolls back manually using documented runbooks"
    ]
  },
  activities: {
    level1: "Write out the complete HTTP request and expected response for each of the five REST operations (GET, POST, PUT, PATCH, DELETE) targeting an NMS alarm resource. Include: HTTP method and URL, Authorization header, request body (where applicable), expected HTTP status code, and response body format.",
    level2: "Trace the complete operation flow for an NOC engineer who: (1) queries all Critical alarms for a specific device, (2) acknowledges each Critical alarm with their user ID, (3) adds a diagnostic note to the most recent alarm, and (4) clears the alarms after the fault is repaired. Write out each API call in curl format.",
    level3: "An NMS database has 3,750 alarms. The OSS client requests them with page_size=150. Each API call takes 80 ms. Calculate (a) number of pages, (b) last page record count, (c) total retrieval time in seconds.",
    level4: "Design a pagination implementation for an NMS NBI using cursor-based pagination (as opposed to offset pagination). Specify: how the cursor is generated (last seen alarm ID + timestamp), how it is included in the Link header, how the server uses it to query the next page consistently, and why cursor-based pagination is more reliable than offset-based during concurrent alarm creation."
  },
  projects: {
    scope: "Build a complete NMS alarm lifecycle management client application that uses all five REST operations to query, acknowledge, annotate, escalate, and clear alarms, with full pagination support and error handling.",
    objectives: [
      "Implement a Python NMS NBI client that authenticates via OAuth 2.0, queries alarms with complex filter combinations (severity + state + device + time range), and handles all paginated result sets using Link header navigation",
      "Implement alarm lifecycle operations: acknowledge (PATCH), add annotation (POST to sub-resource), escalate severity (PATCH), and clear (PATCH with perceivedSeverity=cleared)",
      "Implement comprehensive error handling: token refresh on 401, exponential backoff retry on 429 and 503, structured error logging for 400 and 500 responses"
    ],
    deliverables: [
      "Python NMS NBI client library with documented functions for each alarm lifecycle operation, OAuth token management, and automatic pagination",
      "Integration test suite demonstrating all five REST operations against a mock NMS server, with assertion checks on status codes, response schemas, and pagination",
      "Performance benchmark: measure total retrieval time for 1000 alarms using page sizes of 25, 50, 100, and 200; identify optimal page size for minimum total time"
    ]
  },
  questions: [
    {
      q: "Describe the complete REST API operation flow for an OSS system that needs to retrieve and acknowledge all Critical alarms from an NMS NBI.",
      a: "Step 1 — Authentication: POST /oauth2/token with grant_type=client_credentials, client_id, and client_secret in the request body. Receive access_token (JWT) and token_type=Bearer. Store the token for subsequent requests. Step 2 — Query First Page: GET /alarmManagement/v4/alarm?severity=critical&state=unacknowledged&limit=100 with Authorization: Bearer {token}. NMS validates token, queries database, returns 200 OK with JSON array of up to 100 alarm objects and a Link header containing the URL for the next page. Step 3 — Pagination: Check the Link header for rel=next. If present, issue another GET to the next URL. Repeat until no next link is returned. Accumulate all alarm objects across pages. Step 4 — Acknowledge: For each retrieved alarm with state=unacknowledged, send PATCH /alarmManagement/v4/alarm/{id} with body {\"ackState\":\"acknowledged\", \"ackUserId\":\"oss_system_01\", \"ackTime\":\"2025-01-15T10:30:00Z\"}. NMS returns 200 OK with the updated alarm object. Step 5 — Token Refresh: If a 401 Unauthorized is received during processing (token expired), repeat step 1 to obtain a new token and retry the failed request.",
      type: "Conceptual"
    },
    {
      q: "Why is POST not idempotent while PUT is idempotent, and what problem does this distinction solve?",
      a: "POST creates a new resource each time it is called — calling POST /alarm twice creates two alarm records. This non-idempotency is intentional for creation operations where duplicate resources are undesirable. If a network fault causes the OSS client to POST an alarm acknowledgement twice without knowing the first call succeeded, the NMS would create two acknowledgement records — causing duplicate audit log entries and potential confusion. PUT, by contrast, replaces the entire resource with the provided representation — calling PUT /alarm/{id} multiple times with the same body always results in the same resource state, regardless of how many times it is called. This idempotency is critical for retry safety: if a PATCH acknowledgement request times out and the OSS client retries it, the NMS correctly processes it (idempotently marking the alarm as acknowledged) without creating duplicate state changes. The practical NMS implication: use PATCH (idempotent in NMS context) for alarm state transitions to support safe retries; avoid POST for state-change operations on existing alarms to prevent duplication on network retries.",
      type: "Analytical"
    },
    {
      q: "An NMS has 2,500 alarms. Page size is 75 per request. Each request takes 65 ms. Calculate total pages and total retrieval time.",
      a: "Total pages: P_pages = ⌈N_records / P_size⌉ = ⌈2500 / 75⌉ = ⌈33.33⌉ = 34 pages. Last page record count: 2500 − (33 × 75) = 2500 − 2475 = 25 records on the final page. Total retrieval time: 34 pages × 65 ms = 2,210 ms = 2.21 seconds. If page size is increased to 250: pages = ⌈2500/250⌉ = 10 pages, time = 10 × 65 = 650 ms. Larger page sizes reduce total retrieval time at the cost of larger individual response payloads — each 250-alarm response takes longer to serialise and transmit, potentially increasing individual T_rest beyond 65 ms. The optimal page size must be benchmarked for the specific NMS deployment.",
      type: "Numerical"
    },
    {
      q: "What is the purpose of the HTTP Link header in paginated NMS NBI responses and how should the OSS client use it?",
      a: "The HTTP Link header (defined in RFC 8288) provides navigation URLs for paginated API responses, avoiding the need for the OSS client to construct pagination URLs itself. A typical NMS NBI response includes: Link: </alarmManagement/v4/alarm?page=3&limit=100>; rel=\"next\", </alarmManagement/v4/alarm?page=1&limit=100>; rel=\"prev\", </alarmManagement/v4/alarm?page=7&limit=100>; rel=\"last\", </alarmManagement/v4/alarm?page=1&limit=100>; rel=\"first\". The OSS client should: (1) Parse the Link header from every paginated response. (2) Check for rel=next — if present, issue a GET to the next URL to retrieve the subsequent page. (3) Repeat until no rel=next link is present, indicating the final page. (4) Optionally use rel=last to determine total page count (and combined with X-Total-Count header, calculate total record count). This Link-header-driven pagination is preferred over URL parameter construction because the server controls the exact pagination cursor — the client doesn't need to know whether pagination uses offset, cursor, or keyset pagination internally. It is also more robust for cursor-based pagination where the cursor is opaque to the client.",
      type: "Conceptual"
    },
    {
      q: "How should an OSS client handle a 429 Too Many Requests response from the NMS NBI?",
      a: "A 429 Too Many Requests response means the OSS client has exceeded its allocated rate limit on the NMS NBI. The response should include a Retry-After header specifying the number of seconds before the client may retry. The OSS client should implement an exponential backoff strategy: (1) On first 429: pause for the Retry-After value (or a default minimum of 5 seconds if no Retry-After header is present). (2) On subsequent 429 responses: double the wait time — 10 s, 20 s, 40 s — up to a maximum ceiling (e.g., 300 seconds). (3) Add randomised jitter (±10% of the wait time) to prevent multiple OSS clients from synchronising their retries and creating a thundering-herd problem when the rate limit window resets. (4) Log each 429 with the timestamp, endpoint, and wait time for capacity planning analysis — frequent 429s indicate the rate limit allocation is too low for the OSS's operational requirements. (5) Alert the NMS operations team if 429 responses persist beyond 3 retry cycles, as this may indicate the NMS is under abnormal load or the OSS has a polling loop defect causing excessive API calls.",
      type: "Analytical"
    }
  ],
  virtualLab: {
    description: "You are designing a multi-step provisioning workflow where the UI must return a response within 30 seconds to avoid user timeouts. Your task: determine whether synchronous execution can meet this target or if an async job pattern is required. Adjust the number of provisioning steps and the average step duration. The chart shows elapsed time as steps complete — find the step count where synchronous execution crosses the 30-second threshold and async becomes mandatory.",
    interpretation: "A 4-step flow averaging 3 s per step completes in 12 s — well within 30 s. But a 6-step flow at 5 s per step reaches exactly 30 s — any abnormal step duration pushes it over. The key operational rule: use synchronous flows only when the total worst-case time (steps × max_step_duration) is under 15 s (50% headroom). Above that, use the async job pattern where the UI immediately returns a job ID and the NMS polls for completion. This handles abnormal step durations gracefully and eliminates user-facing timeouts.",
    parameters: [
      { id: "steps", name: "Provisioning Steps", min: 1, max: 10, default: 4, step: 1, unit: "" },
      { id: "stepTimeS", name: "Avg Step Time", min: 1, max: 15, default: 3, step: 1, unit: " s" }
    ],
    generateData: (params) => {
      const maxSteps = params.steps || 4;
      const stepTime = params.stepTimeS || 3;
      const pts: Array<{ x: number; y: number }> = [];
      for (let s = 1; s <= maxSteps; s++) {
        pts.push({ x: s, y: s * stepTime });
      }
      return pts;
    },
    labels: { x: "Steps Completed", y: "Elapsed Time (s)" }
  }
};
