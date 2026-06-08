import type { TopicData } from './types';

export const topic29Data: TopicData = {
  id: "u3t7",
  title: "REST API Concept",
  moduleName: "Unit III: Alarm Lifecycle Management",
  context: {
    prerequisites: ["NMS NBI Interface", "RESTCONF"],
    dependentTopics: ["REST API Commands and Operation Flow", "ONF TAPI Overview"],
    nextSteps: "Study REST API Commands and Operation Flow to understand the specific HTTP verb semantics, request/response structures, and operation sequences used when consuming the NMS NBI REST API.",
    rfcReferences: [
      { rfc: "RFC 7231", title: "HTTP/1.1 Semantics and Content", summary: "Defines GET, POST, PUT, DELETE, PATCH methods and status codes.", url: "https://www.rfc-editor.org/rfc/rfc7231" },
      { rfc: "RFC 6749", title: "OAuth 2.0 Authorization Framework", summary: "Standard for REST API authentication.", url: "https://www.rfc-editor.org/rfc/rfc6749" },
      { rfc: "RFC 8259", title: "JSON Data Interchange Format", summary: "Standard payload format for REST APIs.", url: "https://www.rfc-editor.org/rfc/rfc8259" },
      { rfc: "RFC 7235", title: "HTTP Authentication", summary: "Bearer token authentication for stateless REST APIs.", url: "https://www.rfc-editor.org/rfc/rfc7235" },
      { rfc: "RFC 3986", title: "URI Generic Syntax", summary: "RESTful resource identification via URIs.", url: "https://www.rfc-editor.org/rfc/rfc3986" },
      { rfc: "OpenAPI Specification 3.0", title: "OpenAPI Specification", summary: "Standard for documenting REST APIs — widely used for NMS NBI documentation.", url: "https://spec.openapis.org/oas/v3.0.0" }
    ]
  },
  storytelling: {
    analogy: "A Standardised Menu System for Restaurants",
    story: "REST (Representational State Transfer) is the architectural style that powers the modern internet, and understanding it is essential for anyone who works with NMS northbound interfaces, OSS integration, or cloud-based network management. Every REST API is like a restaurant menu: it lists exactly what you can order (endpoints — the URLs that identify resources), what format the food comes in (JSON or XML — the data representation format), what actions you can take (HTTP methods — GET to read, POST to create, PUT to replace, PATCH to update, DELETE to remove), and what to expect back (HTTP status codes — 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Internal Server Error). When you walk into a restaurant, you don't walk into the kitchen and start cooking yourself — you interact through a defined interface: the menu and the waiter. REST APIs work exactly the same way: you interact with resources (alarms, devices, interfaces, services) through a defined interface (HTTP methods and URLs) without needing to know anything about how the server stores, processes, or retrieves the data internally. A fundamental REST constraint is statelessness: each API call is completely self-contained — just as a restaurant doesn't remember your previous visits (you always have to order fresh, not say 'the usual'), each REST request must carry all the information needed to fulfil it — authentication credentials, query parameters, request body — with no reliance on server-side session state. This statelessness is what makes REST APIs infinitely scalable: any server instance can handle any request without needing shared session state. Additional REST constraints: uniform interface (resources are identified by URLs), client-server separation (client and server evolve independently), cacheability (GET responses can be cached), layered system (the client doesn't know if it's talking to the origin server or a proxy). The NMS NBI REST API exposes alarms, topology, performance data, and configuration operations following all these principles, enabling any standards-compliant OSS client to integrate without custom development.",
    reflectiveQuestions: [
      "Why does REST's statelessness constraint make it more scalable than SOAP or session-based XML-RPC for NMS NBI use cases?",
      "When would you choose WebSocket over REST for NMS alarm consumption, and what are the trade-offs?",
      "How does the Richardson Maturity Model (Level 0 through Level 3: HATEOAS) apply to the design quality of an NMS NBI REST API?"
    ],
    technicalConnection: "REST is an architectural style, not a protocol. REST APIs use HTTP/1.1 or HTTP/2 as the transport. Media type: application/json (default for NMS APIs). Authentication: Authorization header with Bearer token (OAuth 2.0) or Basic auth (for simple cases). Idempotency: GET, PUT, DELETE are idempotent (calling multiple times has the same effect as calling once); POST is not idempotent. NMS NBI REST example: GET https://nms.operator.com/api/v4/alarm?severity=critical&state=unacknowledged — returns JSON array of critical unacknowledged alarms. Content-Type: application/json. HTTP/2 multiplexing allows multiple API calls on a single TCP connection, reducing connection overhead for high-frequency NBI consumers. OpenAPI Specification (OAS 3.0) is used to document and publish the NMS NBI REST API contract."
  },
  mathModelling: {
    need: "A network automation team is designing the API layer for a new self-service network portal that allows enterprise customers to provision MPLS VPNs, retrieve interface statistics, and submit fault tickets. The portal must serve 500 concurrent enterprise users and integrate with 4 backend systems: NMS (Nokia NSP), IPAM (IP address management), ticketing (ServiceNow), and billing (SAP). The API must be consumable by web browsers (JavaScript Fetch) and mobile apps without proprietary SDKs. Decision: SOAP Web Services / REST API / GraphQL / gRPC.",
    equation: "DECISION CONSTRAINT: Must be consumable by JavaScript Fetch and mobile apps (no SDK). Must integrate with 4 backend systems without custom integration code per system. Must support 500 concurrent users. Response time < 2 seconds for all read operations. Must support partial updates (PATCH) for VPN configuration. Decision: SOAP / REST / GraphQL / gRPC.",
    technicalDetails: "SOAP Web Services: XML-based RPC protocol with WSDL. Browser consumption: requires a SOAP client library — not native to JavaScript Fetch. Response time: XML parsing overhead adds 200–500 ms vs JSON. Integration with 4 backends: each backend requires a SOAP adapter — high integration cost. Not suitable for mobile apps without SDK. REST API (Recommended): Standard HTTP verbs (GET, POST, PUT, PATCH, DELETE) with JSON responses. JavaScript Fetch and mobile HTTP libraries consume natively — zero SDK. 500 concurrent users: horizontal scaling via stateless architecture (REST is inherently stateless). PATCH support: partial VPN config updates without replacing the full resource. 4 backend integration: each backend exposes its own REST API (NMS: RESTCONF, IPAM: proprietary REST, ServiceNow: REST, SAP: REST) — the portal's API aggregates them without custom adapters. Response time: JSON parse < 5 ms vs XML 200–500 ms. GraphQL: Single endpoint, client specifies exact fields needed. Reduces over-fetching for mobile apps. But: requires GraphQL server implementation — 3–4 months additional development. Not native to NMS systems (requires a translation layer from YANG/RESTCONF to GraphQL schema). gRPC: Binary protocol, highest throughput. Not consumable by JavaScript Fetch (gRPC-Web required — additional proxy layer). Not suitable for browser-native consumption without additional infrastructure.",
    explanation: [
      { term: "SOAP Web Services", meaning: "XML-RPC with WSDL contract. WHY REJECTED: Not consumable by JavaScript Fetch natively. XML overhead (200–500 ms per response) violates the 2-second read response target for high-volume endpoints. WHEN ADOPTED: Enterprise integrations with SAP or legacy billing systems that expose only SOAP/XML APIs — the portal includes a SOAP adapter for SAP billing while using REST for all other integrations." },
      { term: "REST API (Recommended)", meaning: "Standard HTTP + JSON. Zero SDK requirement — Fetch and all mobile HTTP clients work natively. Stateless design scales horizontally to 500+ concurrent users without session affinity. PATCH for partial updates. 4 backend integrations: each backend's native REST API is aggregated by the portal's API gateway. WHY BEST: Meets all five constraints simultaneously. REST is the standard for network automation portals across all major vendors (Nokia, Cisco, Ericsson, Juniper all expose REST NBIs)." },
      { term: "GraphQL", meaning: "Query language with single endpoint. Reduces mobile over-fetching. WHY SECONDARY: 3–4 months additional development to implement GraphQL server and translate YANG/RESTCONF models to GraphQL schema. WHEN ADOPTED: After REST API is in production and mobile app analytics show that over-fetching (downloading unused fields) is causing measurable performance issues — GraphQL is added as an optimization layer on top of the REST backend." },
      { term: "gRPC", meaning: "Binary protocol, highest throughput, native streaming. WHY REJECTED FOR BROWSER: Not consumable by JavaScript Fetch without gRPC-Web proxy layer (additional infrastructure). WHEN ADOPTED: Server-to-server integrations between the portal backend and NMS backend (e.g., portal backend → Nokia NSP gNMI interface for telemetry streaming) — not as the portal's external-facing API." }
    ],
    advantages: [
      "REST's stateless architecture enables horizontal scaling to 500+ concurrent users without session affinity requirements — new API server instances can be added without any configuration changes",
      "Standard HTTP verbs (GET, POST, PUT, PATCH, DELETE) provide a uniform interface across all 4 backend integrations — the portal's API gateway uses the same integration pattern regardless of backend",
      "JSON responses are natively parsed by JavaScript and all mobile platforms without parsing libraries — eliminating SDK dependencies for enterprise customers and reducing app bundle sizes"
    ],
    limitations: [
      "SOAP adapters are adopted for backend systems (SAP billing) that do not expose REST APIs — the portal's API gateway includes a SOAP-to-JSON translation layer for these legacy backends",
      "GraphQL is adopted as an optimization layer after REST is in production when mobile analytics show over-fetching causing performance issues on 3G/4G connections",
      "gRPC is adopted for internal server-to-server streaming integrations (portal backend to NMS telemetry) where binary encoding efficiency and streaming are required and browser compatibility is not a concern"
    ]
  },
  activities: {
    level1: "List the five HTTP methods used in REST APIs (GET, POST, PUT, PATCH, DELETE) and for each: (a) the equivalent SQL/CRUD operation, (b) whether it is idempotent, (c) the typical HTTP success response code, and (d) a concrete NMS alarm API example using that method.",
    level2: "Design a RESTful URL structure for an NMS alarm API that exposes: (a) a collection of all alarms, (b) a single alarm by ID, (c) the list of alarms for a specific device, (d) alarm statistics (counts by severity), and (e) the acknowledgement operation on a specific alarm. Follow REST URL naming conventions (nouns, not verbs, plural resource names).",
    level3: "An NMS REST API has: T_auth = 8 ms (local JWT validation), T_db = 45 ms (indexed alarm query), T_serial = 12 ms (JSON marshalling). Calculate T_rest. If the database adds a full-text search feature that increases T_db by 80 ms, what is the new T_rest and which component now dominates?",
    level4: "Implement a Python REST API client that authenticates to an NMS NBI (mock), queries all Critical alarms with state=UNACKNOWLEDGED, handles pagination (follow Link header to retrieve all pages), and outputs a structured summary report: total count, top 5 affected devices, and alarm age distribution."
  },
  projects: {
    scope: "Design and implement a complete NMS NBI REST API following REST architectural constraints and OpenAPI Specification 3.0 documentation, with authentication, pagination, error handling, and performance testing.",
    objectives: [
      "Design an OpenAPI 3.0 specification for a 10-endpoint NMS alarm and topology REST API, covering alarms, devices, interfaces, and statistics resources",
      "Implement the API in Python/FastAPI or Node.js/Express with OAuth 2.0 JWT authentication, input validation, and proper HTTP status code responses",
      "Conduct performance testing: measure T_auth, T_db, and T_serial for typical alarm query operations under 1, 10, and 50 concurrent clients"
    ],
    deliverables: [
      "OpenAPI 3.0 YAML specification for the NMS NBI REST API with all endpoint definitions, schemas, and security requirements",
      "Implemented REST API server with mock alarm database, JWT authentication middleware, and pagination support",
      "Performance test report: response time breakdown (T_auth + T_db + T_serial) for each endpoint under three concurrency levels"
    ]
  },
  questions: [
    {
      q: "What are the six REST architectural constraints defined by Roy Fielding and how do they apply to NMS NBI design?",
      a: "Roy Fielding defined six REST constraints in his 2000 doctoral dissertation: (1) Client-Server separation: the NMS server handles alarm storage and processing; OSS clients handle presentation and business logic — they evolve independently without affecting each other. (2) Statelessness: each API request from an OSS client must contain all information needed to process it (authentication token, query parameters) — the NMS server maintains no session state between requests, enabling horizontal scaling. (3) Cacheability: GET /alarm responses can be cached by the client or intermediary proxy for a configurable TTL, reducing NMS server load for frequently-queried static data. (4) Uniform Interface: all NMS resources (alarms, devices, links) are identified by URLs using consistent naming; interactions use standard HTTP methods; responses use standard content types (JSON). (5) Layered System: the OSS client does not need to know whether it is talking directly to the NMS server or through a load balancer, API gateway, or caching proxy — each layer is transparent. (6) Code on Demand (optional): the NMS could return JavaScript code that the client executes to render alarm visualisations, though this constraint is rarely applied in NMS contexts.",
      type: "Conceptual"
    },
    {
      q: "What is the difference between PUT and PATCH in REST and how are they used in an NMS alarm API?",
      a: "PUT performs a full replacement of a resource: the client sends the complete new representation of the resource, and the server replaces the existing resource entirely. If the client omits any fields in the PUT body, those fields are set to null or default values in the stored resource. In an NMS alarm API, PUT is rarely used for alarms (alarms are read-only with limited writable fields) but might be used to replace a complete alarm annotation or assignment record. PATCH performs a partial update: the client sends only the fields it wants to change, and the server merges the changes into the existing resource without affecting unchanged fields. PATCH is the correct method for alarm management operations: PATCH /alarm/{id} with body {\"ackState\": \"acknowledged\", \"ackUserId\": \"noc_engineer_01\"} updates the acknowledgement state without changing the alarm's severity, type, or timestamp. Both PUT and PATCH are idempotent in the NMS context: applying the same acknowledgement operation multiple times produces the same result (the alarm remains acknowledged). The key difference: use PATCH for incremental state transitions in alarm lifecycle (unacknowledged → acknowledged → cleared); use PUT only when replacing entire resource records.",
      type: "Conceptual"
    },
    {
      q: "Calculate the REST API response time where T_auth = 10 ms, T_db = 60 ms, T_serial = 15 ms. If caching eliminates T_db for 70% of requests, what is the average response time?",
      a: "Without caching: T_rest = T_auth + T_db + T_serial = 10 + 60 + 15 = 85 ms. With caching (70% of requests served from cache, T_db = 0 for those): Average T_db = 0.70 × 0 + 0.30 × 60 = 18 ms. Average T_rest = T_auth + Average T_db + T_serial = 10 + 18 + 15 = 43 ms. Caching reduces average response time from 85 ms to 43 ms — a 49% improvement. The 30% of uncached requests still take 85 ms (cache misses), but the average significantly improves. This calculation demonstrates why response caching (e.g., Redis caching of frequently-queried alarm statistics) is one of the highest-ROI NMS NBI performance optimisations.",
      type: "Numerical"
    },
    {
      q: "What HTTP status codes should an NMS NBI REST API return for five different scenarios, and what do they communicate to the OSS client?",
      a: "200 OK: the request was successful and the response body contains the requested data — returned for successful GET requests (alarm list, device inventory). 201 Created: a new resource was successfully created — returned for POST requests that create a new manual alarm or annotation; the response should include a Location header with the URL of the created resource. 400 Bad Request: the client sent an invalid request — malformed JSON, invalid query parameter value (e.g., severity=UNKNOWN), or missing required field; the response body should contain an error code and human-readable message explaining what was wrong. 401 Unauthorized: the request lacks valid authentication credentials — the Bearer token is missing, expired, or has an invalid signature; the client must re-authenticate and obtain a new token. 404 Not Found: the specified resource does not exist — GET /alarm/99999 when alarm ID 99999 is not in the database; the OSS should not retry without changing the request. 500 Internal Server Error: the NMS server encountered an unexpected error processing the request — database unavailable, correlation engine crash; the OSS client should retry with exponential backoff and notify the NMS team. 429 Too Many Requests: the client has exceeded the rate limit — included when rate limiting is implemented.",
      type: "Conceptual"
    },
    {
      q: "Why is statelessness a requirement for REST APIs, and how does it affect the design of NMS NBI authentication?",
      a: "Statelessness means the NMS API server maintains no session state between successive API calls from the same OSS client. Each request is processed independently, as if it were the first and only request. This is a requirement because: (1) Horizontal scalability — any server instance in a load-balanced pool can handle any request; there is no need for sticky sessions or shared session storage, which would create a single point of failure and a scaling bottleneck. (2) Fault tolerance — if one server instance fails, the next request from the OSS is routed to a healthy instance without any session data loss. (3) Simplicity — the server does not need to manage session expiry, session storage, or session invalidation logic. For NMS NBI authentication, statelessness means session cookies cannot be used. Instead, JWT (JSON Web Tokens) are used: the OAuth 2.0 authorisation server issues a signed JWT token containing the client's identity and permissions. The OSS includes this token in every request's Authorization header. The NMS API server validates the token's signature and expiry on every request (T_auth) without querying any shared session store. The token has a fixed expiry (e.g., 1 hour) after which the OSS must request a new token. This design is stateless, scalable, and cryptographically secure.",
      type: "Analytical"
    }
  ],
  virtualLab: {
    description: "Vary concurrent user count and average request processing time to observe total portal API throughput (requests/second). Demonstrates why stateless REST architecture scales linearly with server instances while stateful architectures hit concurrency limits.",
    interpretation: "At 500 concurrent users each making 1 request every 2 seconds, the portal needs 250 requests/second throughput. At 50 ms average processing time per request, a single server handles 20 requests/second — requiring 13 server instances. Adding a 14th instance provides headroom for traffic spikes. This illustrates why REST stateless design (allowing any server to handle any request) is essential for elastic horizontal scaling.",
    parameters: [
      { id: "users", name: "Concurrent Users", min: 10, max: 1000, default: 100, step: 10, unit: "" },
      { id: "processingMs", name: "Avg Processing Time", min: 10, max: 500, default: 50, step: 10, unit: " ms" }
    ],
    generateData: (params) => {
      const maxUsers = params.users || 100;
      const procMs = params.processingMs || 50;
      const pts: Array<{ x: number; y: number }> = [];
      for (let u = 10; u <= maxUsers; u += 10) {
        const rps = 1000 / procMs;
        const serversNeeded = Math.ceil(u / (rps * 2));
        pts.push({ x: u, y: serversNeeded });
      }
      return pts;
    },
    labels: { x: "Concurrent Users", y: "Servers Needed" }
  }
};
