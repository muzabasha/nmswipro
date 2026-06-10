import type { TopicData } from './types';

export const topic27Data: TopicData = {
  id: "u3t5",
  title: "NMS NBI Interface",
  moduleName: "Unit III: Alarm Lifecycle Management",
  context: {
    prerequisites: ["NMS Discovery", "EMS and NMS Architecture"],
    dependentTopics: ["NMS FM NBI Flow", "REST API Concept"],
    nextSteps: "Study NMS FM NBI Flow to understand the end-to-end pipeline by which fault events travel from the network element through the NMS NBI to OSS ticketing and analytics systems.",
    rfcReferences: [
      { rfc: "TM Forum TMF642", title: "Alarm Management API", summary: "Standard NBI for alarm query, acknowledgment, and notification.", url: "https://www.tmforum.org/resources/specification/tmf642-alarm-management-api-rest-specification-r19-0-0/" },
      { rfc: "TM Forum TMF628", title: "Performance Management API", summary: "Standard NBI for KPI and performance data exposure.", url: "https://www.tmforum.org/resources/specification/tmf628-performance-management-api-rest-specification-r19-0-0/" },
      { rfc: "TM Forum TMF639", title: "Resource Inventory Management API", summary: "Standard NBI for topology and device inventory access.", url: "https://www.tmforum.org/resources/specification/tmf639-resource-inventory-management-api-rest-specification-r19-0-0/" },
      { rfc: "RFC 8040", title: "RESTCONF Protocol", summary: "Modern NBI implementation for YANG-modeled network data.", url: "https://www.rfc-editor.org/rfc/rfc8040" },
      { rfc: "RFC 6749", title: "OAuth 2.0 Authorization Framework", summary: "Standard authentication for NBI API security.", url: "https://www.rfc-editor.org/rfc/rfc6749" },
      { rfc: "RFC 7235", title: "HTTP Authentication", summary: "Defines Bearer token authentication used in NBI APIs.", url: "https://www.rfc-editor.org/rfc/rfc7235" }
    ]
  },
  storytelling: {
    analogy: "A Published API Contract Between the NMS and the Business Layer",
    story: "The NBI (Northbound Interface) is the contract the NMS publishes to the world above it — OSS systems, analytics platforms, ticketing tools, and customer portals. Just as a bank's API defines exactly what data third-party financial apps can access (account balance, transaction history) and what actions they can take (initiate transfer, set payment), the NMS NBI defines precisely what network management data and operations are available to upstream consumers: what alarm data can be queried (current active alarms, alarm history, alarm statistics), what topology information is accessible (network graph, device inventory, link status), what performance data can be retrieved (interface utilisation, latency, error rates), and what configuration operations can be pushed (provision a service, update a route policy). The NBI is the NMS's public face — it hides the complexity of SNMP, NETCONF, CLI, and proprietary vendor protocols behind a clean, standardised API. OSS systems — Order Management, Service Assurance, Performance Reporting — do not need to speak SNMP or understand MIB trees; they simply call the NMS NBI REST endpoint. TMF OpenAPIs (TM Forum Frameworx standards) define industry-standard NBIs for telecom OSS/BSS integration: TMF642 (Alarm Management API), TMF628 (Performance Management API), and TMF639 (Resource Inventory Management API) are the three most widely adopted in carrier-grade NMS deployments. An NMS that implements these standard APIs can integrate with any OSS product certified against the same TMF standards, dramatically reducing integration development effort.",
    reflectiveQuestions: [
      "Why is it important that the NMS NBI hides the underlying southbound protocols from the OSS — what problems would arise if the OSS needed to speak SNMP and NETCONF directly?",
      "How does implementing TMF standard APIs benefit a telco when evaluating multiple NMS vendor proposals?",
      "What security controls should be implemented on the NMS NBI to prevent unauthorised access to alarm and topology data by external consumers?"
    ],
    technicalConnection: "NMS NBI implementations: REST/JSON APIs over HTTPS (most modern deployments), SOAP/XML web services (legacy), CORBA IDL (legacy Telco OSS from the 1990s–2000s), JMS/AMQP message queuing for asynchronous event streaming. TMF OpenAPI implementations use OpenAPI Specification (OAS) 3.0 YAML/JSON definitions, enabling code generation for client SDKs. Authentication: OAuth 2.0 Bearer tokens or mTLS client certificates. Rate limiting: enforced per API client to protect NMS processing capacity. Alarm NBI endpoints: GET /alarmManagement/v4/alarm (query active alarms), GET /alarmManagement/v4/alarm/{id} (get single alarm), POST /alarmManagement/v4/alarm/{id}/acknowledge (acknowledge alarm), GET /alarmManagement/v4/alarmStatistics (summary counts by severity and type). Webhook/notification: POST to registered OSS callback URL when new alarm raised (push model) vs. OSS polling GET (pull model)."
  },
  mathModelling: {
    need: "A mobile operator is integrating its NMS (Nokia NetAct) with three northbound consumers: (1) a BSS/OSS orchestration platform, (2) a business analytics dashboard, and (3) a third-party AI operations platform. Each consumer has different requirements: the orchestration platform needs transactional configuration changes, the analytics dashboard needs high-frequency performance data (every 5 minutes for 2,000 KPIs), and the AI platform needs real-time alarm streaming. The NMS must expose a single NBI that can serve all three consumers. Decision: SOAP/XML NBI / RESTCONF NBI / gRPC streaming NBI / multi-protocol NBI.",
    equation: "DECISION CONSTRAINT: Orchestration: transactional config changes with rollback. Analytics: 2,000 KPIs every 5 minutes (JSON). AI platform: alarm streaming with < 1-second latency. All three consumers must use the same NBI endpoint. Decision: SOAP/XML / RESTCONF / gRPC / Multi-protocol NBI.",
    technicalDetails: "SOAP/XML NBI: Traditional NBI protocol (used in TM Forum standards). Orchestration: supports transactional operations. Analytics: XML responses require JSON conversion — adds latency and development overhead. AI streaming: SOAP is request-response, not streaming — AI platform must poll every second (high overhead). RESTCONF NBI: GET/PUT/PATCH for config changes. JSON natively. Analytics: HTTP polling every 5 minutes — 2,000 KPIs per poll. Streaming: server-sent events (SSE) for alarm streaming — RESTCONF extension, < 1-second latency achievable. Compatible with all three consumers. gRPC Streaming NBI: Binary protocol, streaming native. AI alarm streaming: excellent (< 100 ms). Analytics: gRPC server streaming. Orchestration: gRPC unary RPC. But: requires gRPC client in all three consumers — orchestration platform and analytics dashboard may not support gRPC. Multi-protocol NBI (Recommended): RESTCONF for orchestration and analytics (one protocol for two consumers). gRPC/gNMI streaming for AI platform (best-in-class for alarm streaming). Two protocols, three consumers — each consumer uses the protocol best suited to its requirements. NMS exposes both endpoints from the same data backend.",
    explanation: [
      { term: "SOAP/XML NBI", meaning: "Traditional TM Forum NBI. WHY REJECTED: XML encoding overhead for analytics (2,000 KPIs × XML tags: 4–8× larger payload than JSON). SOAP polling for AI streaming: 1 request/second per alarm = high orchestration overhead on NMS. WHEN ADOPTED: Legacy BSS/OSS platforms (pre-2015 vintage) that only support SOAP/XML northbound consumption — still common in tier-3 operators using vendor-supplied BSS with no REST capability." },
      { term: "RESTCONF NBI (primary for 2 of 3 consumers)", meaning: "JSON-native HTTP API. Orchestration: PUT/PATCH with YANG validation. Analytics: GET 2,000 KPIs every 5 minutes — JSON payload efficient. Alarm streaming: SSE extension provides < 1-second push delivery to AI platform. WHY FOR THESE TWO: Meets orchestration and analytics constraints. SSE for streaming is a workable solution for the AI platform but has higher latency than gRPC streaming (~500 ms vs < 100 ms)." },
      { term: "gRPC Streaming NBI (secondary for AI platform)", meaning: "Binary streaming protocol. AI alarm streaming: < 100 ms latency. Native backpressure handling for burst alarm scenarios. WHY FOR AI: The AI platform processes alarms at > 1,000/second — gRPC streaming with binary encoding is the only protocol that delivers sub-100 ms alarm notification at this rate. RESTCONF SSE can deliver ~200 alarms/second before HTTP connection overhead becomes a bottleneck." },
      { term: "Multi-protocol NBI (Recommended)", meaning: "RESTCONF for orchestration + analytics, gRPC for AI streaming. NMS exposes both from the same data model backend. WHY BEST: Each consumer uses the protocol best suited to its requirements — no compromises. Two protocols vs one adds minimal NMS complexity (both are served by the same YANG datastore). This is the standard Nokia NSP NBI architecture: RESTCONF + gNMI streaming from one platform." }
    ],
    advantages: [
      "Multi-protocol NBI allows each consumer to use the protocol best suited to its data access pattern — transactional REST for configuration, streaming gRPC for real-time alarms — without forcing compromises",
      "Both RESTCONF and gRPC are YANG-modelled — the same YANG module describes the same data regardless of the protocol used to access it, enabling consistent data governance",
      "RESTCONF analytics polling at 5-minute intervals for 2,000 KPIs generates only 800 KB of JSON per poll — well within management network bandwidth, vs SOAP XML at 4–6 MB for the same data"
    ],
    limitations: [
      "SOAP/XML NBI is retained for legacy BSS/OSS consumers that cannot be upgraded to REST — typically wrapped by an adapter layer that translates RESTCONF responses to SOAP/XML",
      "gRPC-only NBI is adopted when all consumers are cloud-native platforms with gRPC support — typically greenfield deployments where legacy consumer compatibility is not a requirement",
      "Single-protocol RESTCONF NBI is adopted when the AI platform can accept 500 ms alarm latency and the additional complexity of operating two NBI protocols is not justified"
    ]
  },
  activities: {
    level1: "List the three TMF OpenAPI standards used for NMS NBI (TMF642, TMF628, TMF639). For each, state: (a) what management domain it covers, (b) the primary data objects it exposes, and (c) two example REST endpoint operations.",
    level2: "Design the NBI architecture for an NMS that must serve four OSS consumers: a ServiceNow ticketing system, a Grafana analytics dashboard, a customer self-service portal, and a network planning tool. For each consumer, specify: the data it needs, the appropriate NBI API (TMF number), the authentication method, and whether push (webhook) or pull (polling) notifications are appropriate.",
    level3: "An NMS NBI serves 8 OSS consumers. Each consumer polls 3 API endpoints per second. Average response size is 15 KB. Calculate (a) total API call rate, (b) total NBI throughput in KB/s, and (c) total throughput in MB/min.",
    level4: "Design a complete NBI security architecture including: OAuth 2.0 token-based authentication flow (client credentials grant), role-based access control (read-only vs read-write roles with specific endpoint permissions), TLS 1.3 encryption, rate limiting policy (per-client and global), and audit logging requirements for compliance."
  },
  projects: {
    scope: "Build a mock NMS NBI REST API server implementing a subset of TMF642 Alarm Management API, serving alarm data from a simulated alarm database to multiple registered OSS clients.",
    objectives: [
      "Implement GET /alarmManagement/v4/alarm with query parameters (severity, state, startDate, endDate, limit, offset) returning JSON alarm objects conforming to the TMF642 schema",
      "Implement POST to a registered webhook URL when a new critical alarm is raised — push notification model",
      "Implement OAuth 2.0 client credentials authentication with two roles: alarm-reader (GET only) and alarm-manager (GET + acknowledge)"
    ],
    deliverables: [
      "Node.js/Express or Python/FastAPI NBI server with TMF642-compatible alarm endpoints and OAuth 2.0 token validation",
      "Client SDK in Python that authenticates, queries alarms with filters, and registers a webhook receiver",
      "Load test results showing NBI throughput (requests/second and KB/s) under simulated multi-OSS consumer load"
    ]
  },
  questions: [
    {
      q: "What is the NMS NBI and what are its primary functions in a telecom OSS/BSS architecture?",
      a: "The NMS NBI (Northbound Interface) is the standardised API layer through which the NMS exposes its data and operations to the systems above it in the management hierarchy — primarily OSS (Operations Support Systems) and BSS (Business Support Systems). Its primary functions are: (1) Alarm data access — provide current active alarms, alarm history, and alarm statistics to service assurance and ticketing systems; (2) Topology and inventory access — expose the network graph, device list, and interface inventory to network planning and configuration management tools; (3) Performance data access — provide performance counter data to analytics and reporting platforms; (4) Configuration operations — accept service provisioning requests and configuration change commands from the OSS; (5) Event notification — push real-time alarm notifications to registered OSS consumers via webhooks or message queues, eliminating the need for constant polling. The NBI abstracts the complexity of southbound protocols (SNMP, NETCONF, CLI) from the OSS, which interacts only with the clean REST/JSON API. In modern Telco deployments, the NBI implements TM Forum OpenAPI standards to ensure interoperability between NMS and OSS products from different vendors.",
      type: "Conceptual"
    },
    {
      q: "What are the TMF642, TMF628, and TMF639 APIs and which NMS function does each cover?",
      a: "TMF642 is the Alarm Management API: it standardises how alarm data is queried, acknowledged, and managed. Key operations: GET /alarm (retrieve alarms with filters), POST /alarm (create manual alarms), PATCH /alarm/{id} (acknowledge or clear), GET /alarmStatistics (summary). TMF628 is the Performance Management API: it standardises access to performance measurement data, KPI thresholds, and performance reports. Key operations: GET /performanceMeasurement (retrieve counters), GET /measurementCollection (scheduled collection results), GET /performanceIndicatorGroup (KPI definitions). TMF639 is the Resource Inventory Management API: it standardises access to the network inventory — devices, interfaces, links, logical resources. Key operations: GET /resource (query devices and interfaces), GET /resourceRelationship (topology links), POST /resource (register new resource). Together these three APIs cover the three pillars of NMS northbound data: faults (TMF642), performance (TMF628), and inventory/topology (TMF639). An OSS platform certified against all three can integrate with any compliant NMS.",
      type: "Conceptual"
    },
    {
      q: "An NMS NBI serves 12 OSS consumers each calling 4 endpoints per second with an average response of 25 KB. Calculate total NBI throughput in KB/s and MB/min.",
      a: "Total API call rate: R_api = 12 consumers × 4 calls/s = 48 calls/s. NBI throughput: T_nbi = R_api × S_response = 48 × 25 KB = 1200 KB/s. Converting to MB/min: 1200 KB/s × 60 s/min = 72,000 KB/min = 72,000 / 1024 ≈ 70.3 MB/min. The NMS NBI server's network interface must support at least 1200 KB/s (≈ 9.6 Mbps) sustained throughput for this consumer load. During alarm storms, OSS consumers may increase polling frequency, doubling or tripling R_api and the corresponding throughput requirement — making NBI server sizing with headroom critical.",
      type: "Numerical"
    },
    {
      q: "Compare the pull (polling) and push (webhook) models for OSS alarm consumption from the NMS NBI.",
      a: "Pull model (OSS polls NMS NBI): The OSS periodically sends GET /alarm requests to the NMS and retrieves the current alarm list. Advantage: simple to implement; the OSS controls the polling frequency. Disadvantage: introduces latency between alarm creation and OSS awareness (equal to the polling interval — if polling every 60 seconds, the OSS may be 60 seconds behind); generates constant load on the NBI even when no new alarms exist; not suitable for real-time SLA-based fault response. Push model (NMS sends webhook to OSS): The OSS registers a callback URL with the NMS. When a new alarm is created, the NMS immediately POSTs the alarm JSON to the registered URL. Advantage: near-zero latency (seconds); no wasted API calls when the network is healthy; supports real-time ticketing and SLA response. Disadvantage: the NMS must manage callback URLs and handle delivery failures (retry with exponential backoff if the OSS is temporarily unreachable); the OSS must expose an HTTPS endpoint to receive webhooks, which requires firewall rules. Best practice: use push (webhook) for critical and major alarms requiring real-time response; use pull (polling, 5-minute intervals) for alarm list reconciliation and reporting.",
      type: "Analytical"
    },
    {
      q: "What security controls must be implemented on the NMS NBI to protect sensitive network topology and alarm data?",
      a: "The NMS NBI handles sensitive operational data — network topology, current fault state, device inventory — that could be exploited by attackers to plan targeted attacks. Required security controls: (1) Transport encryption: TLS 1.3 for all NBI connections; no plain HTTP; enforce HSTS. (2) Authentication: OAuth 2.0 client credentials grant for machine-to-machine OSS integration; API keys as an alternative for simple integrations; mTLS (mutual TLS) client certificate authentication for highest security. (3) Authorisation (RBAC): separate roles — alarm-reader (GET only), alarm-manager (GET + acknowledge/clear), topology-reader, configuration-manager; enforce at the API gateway layer. (4) Rate limiting: per-client limits (e.g., max 100 calls/minute) to prevent a misbehaving OSS from starving other consumers; global rate limit to protect NMS server resources. (5) Input validation: validate all query parameters and request bodies against the API schema to prevent injection attacks. (6) Audit logging: log every API call with client ID, endpoint, timestamp, and response code; retain logs for security incident investigation. (7) Network segmentation: host the NBI on a dedicated management-plane network segment, not accessible from the internet.",
      type: "Analytical"
    }
  ],
  virtualLab: {
    description: "You are designing a KPI collection pipeline using RESTCONF NBI. Your task: determine whether JSON or XML encoding is needed to keep bandwidth under 10% of a 1 Mbps management link. Adjust the KPI count and polling interval. JSON is approximately 3× smaller than XML. The chart shows JSON payload size per cycle — find the polling frequency where XML would exceed your bandwidth budget while JSON stays acceptable.",
    interpretation: "At 2,000 KPIs with 5-minute intervals, JSON uses 800 KB/cycle (2.7 KB/s) — under 3% of a 1 Mbps link. XML uses 2.4 MB (8 KB/s). At 1-minute intervals, JSON uses 13 KB/s (10% of link) while XML uses 40 KB/s (32%). The practical takeaway: JSON is mandatory for polling intervals under 5 minutes. Above 5 minutes, JSON vs XML bandwidth is usually not the bottleneck — the NMS processing rate is. Use this lab to justify JSON-only encoding in your NBI integration standards.",
    parameters: [
      { id: "kpis", name: "KPI Count", min: 100, max: 5000, default: 500, step: 100, unit: "" },
      { id: "intervalMin", name: "Polling Interval (min)", min: 1, max: 60, default: 5, step: 1, unit: " min" }
    ],
    generateData: (params) => {
      const maxKpis = params.kpis || 500;
      const pts: Array<{ x: number; y: number }> = [];
      for (let k = 100; k <= maxKpis; k += 100) {
        const jsonKB = (k * 40) / 1024;
        pts.push({ x: k, y: parseFloat(jsonKB.toFixed(1)) });
      }
      return pts;
    },
    labels: { x: "KPI Count", y: "JSON Payload (KB)" }
  }
};
