import type { TopicData } from './types';

export const topic18Data: TopicData = {
  id: "u2t6",
  title: "RESTCONF",
  moduleName: "Unit II: Model-Driven Management and Protocols",
  context: {
    prerequisites: ["NETCONF Operation Commands", "YANG Data Model Details Explanation"],
    dependentTopics: ["Alarm Management", "Network Virtualization", "RESTCONF Protocol Concept"],
    nextSteps: "Study RESTCONF Protocol Concept (detailed) and RESTCONF Operation via Postman for hands-on REST API interaction with YANG-modelled devices."
  },
  storytelling: {
    analogy: "A REST API Front-End for the NETCONF Configuration Database",
    story: "RESTCONF is to NETCONF what a REST API is to a database — it exposes the same YANG-modelled data over HTTP/HTTPS instead of SSH/XML, making it accessible to web developers, mobile apps, and cloud platforms that speak JSON natively. Instead of XML RPC messages over SSH, RESTCONF uses HTTP verbs: GET retrieves configuration or state data, PUT replaces a resource entirely, POST creates a new resource, PATCH merges partial changes, DELETE removes a resource. The YANG data model is mapped to a URL hierarchy — /restconf/data/ietf-interfaces:interfaces/interface=eth0 is the URL for the interface named 'eth0'. JSON or XML encoding is negotiated via HTTP Accept headers. RESTCONF does not have transactions or candidate datastores by default — it operates directly on the running datastore, making it simpler but less safe than NETCONF for complex multi-step configurations.",
    reflectiveQuestions: [
      "Why does RESTCONF lack the candidate datastore that NETCONF provides, and what risks does this introduce?",
      "When would you choose RESTCONF over NETCONF for a network management application?",
      "How does RESTCONF's YANG URL mapping work — how are module name and container path reflected in the resource URL?"
    ],
    technicalConnection: "RESTCONF (RFC 8040): HTTP methods: GET (read config or state), PUT (full replace of a resource), POST (create a new resource), PATCH (merge partial changes, RFC 8072 YANG Patch for ordered operations), DELETE (remove a resource). Base URL: /restconf/. Data resource root: /restconf/data/. Specific resource: /restconf/data/{module-name}:{top-level-container}/{list-key}. Operations resource: /restconf/operations/{module-name}:{rpc-name}. Transport: HTTPS only. Media types: application/yang-data+json, application/yang-data+xml. YANG library: GET /restconf/yang-library-version. No candidate datastore — all writes target running datastore directly. Authentication: HTTP Basic, OAuth2, or TLS client certificates."
  },
  mathModelling: {
    need: "A DevOps team building a cloud-native network orchestration platform must choose a northbound API protocol to expose network configuration and state to application developers. The platform manages 50 virtual network functions (VNFs). Developers are familiar with REST APIs, use Python Requests and JavaScript Fetch for tooling, and require JSON responses. The constraint: API integration must take under 1 day per developer, no proprietary SDKs, and the API must be compatible with standard HTTP tooling (Postman, curl, OpenAPI).",
    equation: "DECISION CONSTRAINT: Developer integration time ≤ 1 day. No proprietary SDKs or clients required. Must return JSON (not XML). Must support GET, POST, PUT, PATCH, DELETE semantics. Must work with standard HTTP tooling. Decision: NETCONF / RESTCONF / proprietary REST API / gRPC+Protobuf.",
    technicalDetails: "NETCONF: XML-over-SSH protocol with its own session model. Developer integration: requires a NETCONF client library (ncclient for Python, no native browser support). Integration time: 2–3 days to understand NETCONF operations, XML encoding, and session management. Not compatible with Postman or standard HTTP tooling. Rejected: violates 1-day integration and HTTP tooling constraints. RESTCONF (RFC 8040 — Recommended): HTTP-based protocol mapping NETCONF datastores to REST resources. Supports JSON (application/yang-data+json). Standard HTTP verbs: GET (get-config), POST (create), PUT (replace), PATCH (merge), DELETE (remove). Works natively with Postman, curl, Python Requests, JavaScript Fetch. Developer integration: 2–4 hours (standard REST experience transfers directly). WHY BEST: Meets all constraints. Proprietary REST API: Some vendors expose a custom REST API for configuration (e.g., Cisco ACI REST API, F5 iControl REST). Not YANG-modelled — responses are vendor-specific JSON schemas. Integration time: 1–3 days per vendor (learning proprietary schema). Switching NMS vendors requires full API rewrite. gRPC + Protobuf: High-performance binary protocol used for streaming telemetry (gNMI Subscribe). Not HTTP/REST — requires gRPC client library and Protobuf schema compilation. Developer integration: 3–5 days. Not compatible with Postman or curl. Appropriate for telemetry streaming, not REST-style configuration.",
    explanation: [
      { term: "NETCONF", meaning: "RFC 6241 XML-over-SSH. WHY REJECTED: Requires NETCONF client library (ncclient), no browser support, incompatible with Postman/curl. XML encoding is verbose and harder to read than JSON for application developers. Integration time: 2–3 days. WHEN ADOPTED: Correct for NMS-to-device (southbound) automation where transactional commit/rollback is required — NETCONF is the gold standard for device configuration, but inappropriate as a northbound API for application developers." },
      { term: "RESTCONF (Recommended)", meaning: "RFC 8040 HTTP-based YANG access. GET/POST/PUT/PATCH/DELETE map to NETCONF operations. Returns JSON (application/yang-data+json). Works with Postman, curl, Python Requests. Developer integration: 2–4 hours for any developer with REST experience. WHY BEST: All four constraints met. Standard tooling works out of the box. YANG-modelled responses are self-describing via the YANG schema. Nokia NSP, Cisco NSO, and Ericsson ENM all expose RESTCONF northbound APIs for orchestration integration." },
      { term: "Proprietary REST API", meaning: "Vendor-specific JSON schemas over HTTP. WHY REJECTED: Integration knowledge is vendor-specific and non-transferable. Switching NMS vendors requires full API client rewrite. No YANG schema available for automated code generation. WHEN ADOPTED: Acceptable when the entire orchestration stack is single-vendor (e.g., Cisco ACI with its proprietary REST API) and the team has no plans to introduce alternative vendors." },
      { term: "gRPC + Protobuf", meaning: "Binary protocol requiring client library and Protobuf schema compilation. WHY REJECTED FOR THIS CASE: Not HTTP/REST, incompatible with Postman/curl, integration time 3–5 days. WHEN ADOPTED: Best-in-class for high-frequency telemetry streaming (gNMI Subscribe at 1-second intervals), where binary encoding efficiency is worth the tooling investment. Complementary to RESTCONF: RESTCONF for configuration, gNMI for telemetry." }
    ],
    advantages: [
      "RESTCONF reuses the existing REST ecosystem — Postman collections, OpenAPI documentation, curl scripts, and HTTP load balancers all work without modification",
      "JSON responses from RESTCONF are human-readable, directly consumable by JavaScript front-ends without parsing overhead, and compatible with standard JSON schema validation tools",
      "RESTCONF is YANG-modelled — every resource path corresponds to a YANG node, making the API self-documenting and enabling automated client code generation from YANG models"
    ],
    limitations: [
      "NETCONF is adopted southbound (NMS to device) where transactional commit/rollback and candidate datastore semantics are required — RESTCONF does not support confirmed-commit",
      "Proprietary REST APIs are adopted only in locked-in single-vendor deployments where no multi-vendor interoperability is required and the vendor's tooling is the primary integration point",
      "gRPC is adopted for telemetry collection alongside RESTCONF for configuration — the two are complementary: RESTCONF for read/write configuration, gNMI for high-frequency streaming state"
    ]
  },,
  activities: {
    level1: "Map each RESTCONF HTTP method to its NETCONF RPC equivalent: GET ↔ get/get-config, PUT ↔ edit-config replace, POST ↔ edit-config create, PATCH ↔ edit-config merge, DELETE ↔ edit-config delete. For each pair, state one key difference in behaviour or capability.",
    level2: "Given a YANG module 'ietf-interfaces' with prefix 'if', write the RESTCONF URLs for: (a) listing all interfaces, (b) retrieving the interface named 'GigabitEthernet0/0', (c) creating a new interface named 'Loopback0', (d) deleting interface 'Loopback0'. Identify the HTTP method and expected HTTP status code for each.",
    level3: "An NMS must configure 240 devices in a 2-minute window using RESTCONF, sending 3 operations per device. Calculate the required R_api. If each device responds in 50 ms, what is the minimum parallelism P (concurrent requests) required to achieve this rate?",
    level4: "Using Postman or curl, connect to a RESTCONF-enabled device or sandbox (e.g., Cisco DevNet Always-On Sandbox). Send a GET request to /restconf/data/ietf-interfaces:interfaces with Accept: application/yang-data+json. Then send a PATCH request to change one interface's description. Capture and display the JSON response and HTTP status codes."
  },
  projects: {
    scope: "Build a RESTCONF-based network inventory and configuration management dashboard that reads device state and applies configuration changes via HTTP API calls.",
    objectives: [
      "Implement a Python requests-based RESTCONF client that authenticates to 3 simulated devices and retrieves interface inventory via GET /restconf/data/ietf-interfaces:interfaces",
      "Parse the JSON response and display interface names, admin status, oper status, and IP addresses in a structured report",
      "Implement a configuration change workflow: PATCH to update interface descriptions, PUT to replace an interface IP address, DELETE to remove a secondary IP",
      "Measure actual R_api by timing 50 sequential GET requests and calculating ops/s. Compare against R_api = N_ops / T_window formula"
    ],
    deliverables: [
      "Python RESTCONF client script with documented get_interfaces(), patch_description(), put_address(), and delete_address() functions",
      "Interface inventory report showing all retrieved interface data in table format",
      "HTTP request/response log for each operation type (GET, PUT, PATCH, DELETE) with status codes",
      "R_api measurement: theoretical vs empirical for sequential and 5-parallel-request configurations"
    ]
  },
  questions: [
    {
      q: "How does RESTCONF map YANG data model paths to URL resources?",
      a: "RESTCONF maps the YANG data hierarchy to a URL path under the /restconf/data/ root. The mapping rules are: (1) the top-level module name and its top-level container form the first path segment: /restconf/data/{module-name}:{container-name}; (2) nested containers become additional path segments: /restconf/data/ietf-interfaces:interfaces; (3) list instances are accessed by their key value using an equals sign: /restconf/data/ietf-interfaces:interfaces/interface=eth0 (where 'name' is the key leaf); (4) multiple keys are comma-separated: /restconf/data/module:list=key1,key2; (5) deeper nesting continues appending path segments. For YANG RPCs, the URL is /restconf/operations/{module-name}:{rpc-name}, invoked via HTTP POST with a JSON body containing the input parameters. For notifications, the URL is /restconf/streams/{stream-name}/events using Server-Sent Events.",
      type: "Conceptual"
    },
    {
      q: "Why does RESTCONF not support the candidate datastore, and what best practices mitigate this limitation?",
      a: "RFC 8040 explicitly states that RESTCONF targets only the running datastore (and optionally startup) because RESTCONF is designed as a simple, stateless RESTful interface — adding candidate datastore support would require session-state management (maintaining which candidate belongs to which HTTP session), fundamentally conflicting with HTTP's stateless design. Mitigation strategies: (1) use YANG Patch (RFC 8072) which allows multiple edit operations to be sent in a single PATCH request body, reducing the window where only partial changes are applied; (2) implement application-level transaction logic — read current state, compute full desired state, apply as a single PUT replacing the entire subtree; (3) use RESTCONF only for simple, single-resource changes and NETCONF for complex multi-step transactional configurations; (4) implement compensating transactions — if a subsequent RESTCONF call fails, issue explicit DELETE/PATCH calls to undo the previously successful changes; (5) use RESTCONF read operations (GET) for monitoring and NETCONF for configuration changes, leveraging both protocols' strengths.",
      type: "Analytical"
    },
    {
      q: "An NMS must configure 300 devices in a 5-minute window, sending 4 RESTCONF operations per device. Each device responds in 40 ms. Calculate: (a) required R_api, (b) minimum parallelism P, (c) total operations.",
      a: "(a) Total operations = 300 × 4 = 1200. Time window = 5 × 60 = 300 seconds. Required R_api = 1200 / 300 = 4 ops/s. (b) Maximum sequential rate per device = 1 / 0.040 = 25 ops/s. Since 4 ops/s < 25 ops/s, P = 1 (single stream is sufficient). However, since different devices are independent, the NMS should use P = ceil(1200 / (300 × 25)) = ceil(0.16) = 1 parallel thread per device group. In practice, P = 4-8 parallel workers across devices is recommended to handle variable response times. (c) Total = 1200 operations as calculated above.",
      type: "Numerical"
    },
    {
      q: "What is the difference between HTTP PUT and HTTP PATCH in RESTCONF, and when should each be used?",
      a: "PUT in RESTCONF replaces the entire resource at the specified URL with the supplied data body. The request body must contain a complete, valid representation of the resource. Any existing child nodes not included in the PUT body are deleted. Use PUT for: full resource synchronisation where you know the complete desired state; replacing an entire interface configuration including all sub-parameters; idempotent operations where the same PUT always produces the same result regardless of prior state. PATCH in RESTCONF merges the supplied data into the existing resource — only the specified fields are updated, and unmentioned fields retain their current values. YANG Patch (RFC 8072) extends PATCH with an ordered list of operations (create, delete, merge, replace, remove) in a single request, enabling more complex atomic changes. Use PATCH for: targeted updates (change only the description of an interface without affecting other parameters); adding a leaf value without knowing or sending the full resource; minimising payload size by sending only changed data.",
      type: "Conceptual"
    },
    {
      q: "How does RESTCONF handle errors, and how do error responses differ from NETCONF rpc-error?",
      a: "RESTCONF maps errors to standard HTTP status codes: 400 Bad Request (invalid JSON/XML or malformed request), 401 Unauthorized (authentication failure), 403 Forbidden (insufficient permissions), 404 Not Found (resource path not found — e.g., interface name doesn't exist), 405 Method Not Allowed (e.g., DELETE on a mandatory node), 409 Conflict (create on existing resource, equivalent to NETCONF data-exists), 412 Precondition Failed (ETag/Last-Modified mismatch in conditional requests), 422 Unprocessable Entity (YANG validation failure — type error, range violation, must constraint failure), 500 Internal Server Error (device-side processing failure). The response body contains a YANG-structured error object: { 'ietf-restconf:errors': { error: [{ error-type, error-tag, error-path (YANG path to the failing node), error-message }] } }. Compared to NETCONF rpc-error which is XML with error-type, error-tag, error-app-tag, error-severity, error-info, error-message — RESTCONF uses HTTP status codes for routing/filtering and a JSON error body for details.",
      type: "Analytical"
    }
  ],
  virtualLab: {
    description: "Vary API operation count and time window to observe RESTCONF API throughput (ops/sec). Demonstrates how RESTCONF scales with HTTP/1.1 vs HTTP/2 connection reuse. A multiplier of 6 is applied for HTTP/2 (connection multiplexing reduces per-request overhead by ~6×).",
    interpretation: "HTTP/2 multiplexing dramatically improves RESTCONF throughput for high-frequency polling — at 1,000 operations per 10 seconds, HTTP/2 delivers ~600 effective ops/sec vs ~100 for HTTP/1.1. This is why modern RESTCONF servers (Nokia NSP, Cisco NSO 6.x) mandate HTTP/2 for NBI connections in high-scale orchestration environments. For low-frequency configuration operations (< 10 ops/sec), HTTP/1.1 is sufficient.",
    parameters: [
      { id: "ops", name: "API Operations", min: 10, max: 1000, default: 100, step: 10, unit: "" },
      { id: "window", name: "Time Window", min: 1, max: 60, default: 10, step: 1, unit: " s" }
    ],
    generateData: (params) => {
      const maxOps = params.ops || 100;
      const window = params.window || 10;
      const pts: Array<{ x: number; y: number }> = [];
      for (let o = 10; o <= maxOps; o += 10) {
        const throughput = o / window;
        pts.push({ x: o, y: parseFloat(throughput.toFixed(2)) });
      }
      return pts;
    },
    labels: { x: "API Operations", y: "Throughput (ops/s)" }
  }
};
