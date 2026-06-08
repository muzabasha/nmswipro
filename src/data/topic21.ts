import type { TopicData } from './types';

export const topic21Data: TopicData = {
  id: "u2t9",
  title: "RESTCONF Protocol Concept",
  moduleName: "Unit II: Model-Driven Management and Protocols",
  context: {
    prerequisites: ["RESTCONF", "NETCONF Protocol Concept", "YANG Data Model Details Explanation"],
    dependentTopics: ["RESTCONF Operation via Postman"],
    nextSteps: "Study RESTCONF Operation via Postman to practice making live RESTCONF API calls against a YANG-modelled device."
  },
  storytelling: {
    analogy: "A REST API Gateway over the NETCONF Configuration Store",
    story: "If NETCONF is a professional database client that requires expertise in XML, SSH sessions, and RPC protocols to operate, RESTCONF is the web portal that makes the same configuration database accessible to anyone with a browser, a curl command, or a Python requests call. NETCONF was designed in 2006 for the world of network CLI scripting — powerful but demanding. RESTCONF, defined in RFC 8040 in 2017, was designed for the world of cloud APIs, DevOps pipelines, and web developers who live in JSON and HTTP. The key insight of RESTCONF is that every YANG data node — every module, container, list, and leaf — maps to a predictable, hierarchical URL path. Want to read the configuration of interface GigabitEthernet0? GET /restconf/data/ietf-interfaces:interfaces/interface=GigabitEthernet0. Want to change its description? PATCH /restconf/data/ietf-interfaces:interfaces/interface=GigabitEthernet0 with a JSON body containing only the description field. Want to create a new static route? POST /restconf/data/ietf-routing:routing/static-routes. Want to delete a VLAN? DELETE /restconf/data/ietf-vlans:vlans/vlan=100. The five HTTP methods — GET, POST, PUT, PATCH, DELETE — map directly to the five CRUD operations — Read, Create, Replace, Merge/Update, Delete — that every configuration management system needs. JSON encoding makes the request and response bodies readable without XML parsers, integrable with JavaScript frontends, processable by pandas DataFrames, and storable in MongoDB. RESTCONF RFC 8040 standardises this YANG-to-HTTP mapping so completely that any device implementing any YANG module is automatically manageable by any RESTCONF client — no custom drivers, no proprietary SDKs, no CLI screen scraping. This is the promise of model-driven management made practical.",
    reflectiveQuestions: [
      "How does RESTCONF map YANG list entries to URL paths, and what happens when a YANG list has a composite key with multiple key leaves?",
      "Why does RESTCONF use PATCH rather than PUT for partial configuration updates, and what is the difference in semantics between the two operations?",
      "How does a RESTCONF client discover what YANG modules a device supports, and why is this capability discovery important for interoperability?"
    ],
    technicalConnection: "RESTCONF (RFC 8040) URL structure: /restconf/data/{module}:{top-level-node}/{child-container}/{list-name}={key-value}/... For YANG lists with multiple keys, keys are comma-separated in the URL: /restconf/data/ietf-interfaces:interfaces/interface=GigabitEthernet0/ipv4/address=192.168.1.1,255.255.255.0. HTTP method semantics: GET (read — equivalent to NETCONF get or get-config), PUT (replace-config — replaces the entire target resource), POST (create — creates a new resource, fails if it already exists), PATCH (merge — equivalent to NETCONF edit-config with merge operation), DELETE (delete resource). YANG library discovery: GET /restconf/data/ietf-yang-library:modules-state returns a list of all supported YANG modules with their revision, features, and deviations. Errors are returned as application/yang-data+json or application/yang-data+xml with RFC 7807-style problem details including error-type, error-tag, error-app-tag, and error-message. HTTPS with TLS is mandatory — RESTCONF over HTTP is prohibited by RFC 8040."
  },
  mathModelling: {
    need: "A software team is integrating a third-party analytics platform with a Nokia NSP (Network Services Platform) to retrieve real-time interface statistics. The NSP exposes both NETCONF and RESTCONF northbound interfaces. The analytics platform is built on Python microservices with a REST-first architecture. The integration must retrieve interface stats from 500 interfaces every 30 seconds, with each response parsed into a time-series database. The constraint: total per-cycle retrieval time < 25 seconds, response format must be JSON, and no NETCONF client library can be introduced into the analytics codebase.",
    equation: "DECISION CONSTRAINT: Per-cycle retrieval time ≤ 25 seconds for 500 interfaces. Response format: JSON (not XML). Zero NETCONF client library dependencies in the analytics platform. Must support filtering (retrieve only counter leafs, not full interface config). Decision: NETCONF + ncclient / RESTCONF + Python Requests / gNMI Subscribe / SNMP bulk walk.",
    technicalDetails: "NETCONF + ncclient: Retrieves interface state using get with subtree filter. Returns XML — requires XML-to-JSON conversion in the analytics platform. Dependency: ncclient library (Python). Per-interface retrieval: 200 ms (session reuse). 500 interfaces serial: 100 seconds — exceeds 25-second limit. With 20 parallel NETCONF sessions: 5 seconds. But: introduces ncclient dependency — violates the constraint. RESTCONF + Python Requests (Recommended): GET /restconf/data/ietf-interfaces:interfaces/interface={name}/statistics with Accept: application/yang-data+json. Returns JSON natively. Python Requests library is already present (standard REST dependency). Per-request: 80 ms (HTTP keep-alive). 500 requests with 25 concurrent HTTP connections: 500/25 × 80 ms = 1,600 ms (1.6 seconds). Well within 25-second constraint. Supports field filtering via query parameter (fields=in-octets,out-octets). gNMI Subscribe: Streaming protocol — subscribes once, device pushes updates every 30 seconds. Total per-cycle overhead: near-zero (push model). But: requires gNMI client library (grpcio) — violates the no-new-library constraint unless gNMI is already present. SNMP Bulk Walk: GetBulk across ifTable. JSON not natively supported (requires SNMP-to-JSON adapter). No YANG alignment. Counter objects only (no config data). Per-walk: 3–8 seconds for 500 interfaces. Meets the time constraint but violates the JSON and YANG-alignment requirements.",
    explanation: [
      { term: "NETCONF + ncclient", meaning: "XML retrieval with subtree filtering. Requires ncclient library. Per-500-interfaces with 20 parallel sessions: ~5 seconds. WHY REJECTED: Introduces ncclient dependency (violates constraint). XML responses require an additional parsing/conversion step in the analytics platform. WHEN ADOPTED: Correct when the integration platform is an NMS tool (not an analytics platform) and NETCONF transactional semantics (candidate datastore, commit) are needed alongside state retrieval." },
      { term: "RESTCONF + Python Requests (Recommended)", meaning: "HTTP GET with application/yang-data+json. 500 requests via 25 HTTP keep-alive connections: 1.6 seconds per cycle — 15× under the 25-second budget. No new library dependencies (Requests is already present). JSON natively. Field filtering via RESTCONF query parameters reduces response payload. WHY BEST: Meets all three constraints simultaneously. Python Requests is the de facto HTTP library for Python microservices." },
      { term: "gNMI Subscribe", meaning: "Push-based streaming protocol. Near-zero per-cycle overhead once subscribed. JSON encoding available (RFC 7951). WHY REJECTED FOR THIS CASE: Requires grpcio library — a new dependency. Streaming model assumes persistent device connection — analytics platform may not maintain persistent gRPC streams reliably. WHEN ADOPTED: Best choice for telemetry streaming when grpcio is already a platform dependency or when the analytics platform supports long-lived gRPC streams (e.g., cloud-native observability platforms using OpenTelemetry)." },
      { term: "SNMP Bulk Walk", meaning: "GetBulk on ifTable. 3–8 seconds for 500 interfaces — meets time constraint. WHY REJECTED: No native JSON output (requires adapter). Not YANG-aligned (counter names differ from YANG leaf names, requiring a mapping table). No filtering — full ifTable is always returned. WHEN ADOPTED: Legacy environments where devices do not support NETCONF or RESTCONF — SNMP remains the only structured management protocol available." }
    ],
    advantages: [
      "RESTCONF returns JSON natively, eliminating the XML-to-JSON conversion step and reducing per-response processing time in the analytics pipeline",
      "HTTP keep-alive connection pooling allows 500 interface queries to complete in 1.6 seconds using 25 concurrent connections — 15× headroom under the 25-second budget",
      "RESTCONF field filtering (query parameter: fields=in-octets,out-octets) reduces response payload size by up to 80% vs full interface retrieval, halving network bandwidth usage on the management link"
    ],
    limitations: [
      "NETCONF is adopted for configuration management operations (edit-config, commit, rollback) on the same devices — RESTCONF and NETCONF are complementary, not competing",
      "gNMI Subscribe is adopted when the analytics platform already includes grpcio and the team wants push-based telemetry with sub-second sampling intervals not achievable with REST polling",
      "SNMP is adopted for legacy devices that do not expose NETCONF or RESTCONF interfaces — typically end-of-life hardware running firmware from before 2015"
    ]
  },
  activities: {
    level1: "Map each HTTP method used in RESTCONF to its NETCONF equivalent and the corresponding YANG data operation. Create a table with columns: HTTP Method, RESTCONF Semantics, NETCONF Equivalent, YANG Operation (create/replace/merge/delete). Include all five methods: GET, POST, PUT, PATCH, DELETE. Provide a concrete example URL and body for each method targeting the ietf-interfaces YANG module.",
    level2: "Given the following YANG module snippet for ietf-interfaces, construct the complete RESTCONF URLs for five operations: (a) GET all interfaces, (b) GET the configuration of interface 'eth0', (c) POST to create a new interface 'eth1' with IP 10.0.1.1/24, (d) PATCH to change the MTU of 'eth0' to 9000, (e) DELETE interface 'eth1'. Show the required HTTP headers (Content-Type, Accept) and request body for operations (c) and (d).",
    level3: "Calculate the JSON and XML payload sizes for a YANG response containing 30 fields with an average field name length of 10 characters and an average value length of 8 characters. Use the formula: S_xml = fields × (2×avgLen + 15 + valueLen) and S_json = fields × (avgLen + 8 + valueLen). Compute the encoding ratio ρ and state the percentage saving achieved by RESTCONF's JSON encoding over NETCONF's XML.",
    level4: "Write a Python script using the requests library that performs the following RESTCONF operations against a Cisco IOS-XE device (or a YANG-capable simulator): (a) GET the YANG library to discover supported modules, (b) GET all interfaces and parse the JSON response to print interface names and operational status, (c) PATCH the description field of one interface, (d) verify the change with a subsequent GET. Include error handling for HTTP 404 and 409 responses."
  },
  projects: {
    scope: "Develop a RESTCONF-based device configuration and monitoring library in Python that abstracts YANG model interactions and provides a simple API for NMS integration.",
    objectives: [
      "Implement a RESTCONF client class in Python that handles authentication (Basic Auth and token-based), YANG library discovery, and all five HTTP method operations with proper Content-Type and Accept headers",
      "Create YANG-model-specific helper functions for the ietf-interfaces, ietf-routing, and ietf-system YANG modules, providing typed Python functions for common operations (get_interfaces, set_interface_description, add_static_route)",
      "Benchmark RESTCONF JSON payload sizes against equivalent NETCONF XML payloads for the same 50-field YANG response, measuring encoding ratio, parse time, and network transfer time"
    ],
    deliverables: [
      "Python RESTCONF client library with documented class interface, all five HTTP method implementations, error handling, and retry logic",
      "YANG model helper module with typed functions for ietf-interfaces, ietf-routing, and ietf-system operations, plus unit tests using mock HTTP responses",
      "Benchmarking report comparing RESTCONF JSON vs NETCONF XML for payload size (encoding ratio), Python parse time (json.loads vs xml.etree), and end-to-end operation latency over a simulated management network"
    ]
  },
  questions: [
    {
      q: "How does RESTCONF map a YANG list with a composite key to a URL path, and what is the order of key values in the URL?",
      a: "In YANG, a list can have multiple key leaves that together uniquely identify a list entry. RESTCONF maps list entries to URL paths by appending the key values to the list name, separated by commas, in the exact order the keys are declared in the YANG 'key' statement. For example, consider a YANG list 'route-entry' with keys 'destination' and 'next-hop': the YANG definition 'key \"destination next-hop\"' results in the RESTCONF URL path component: /route-entry=192.168.1.0%2F24,10.0.0.1 (where the slash in the prefix is percent-encoded as %2F to avoid confusion with the URL path separator). The order strictly follows the YANG key statement order — swapping the values would reference a different or non-existent entry. If any key value contains characters that are URL-reserved (forward slash, comma, percent), they must be percent-encoded. This deterministic mapping from YANG list keys to URL paths is what makes RESTCONF URLs self-descriptive and allows any HTTP client to construct the correct URL for a known list entry without requiring a separate lookup step.",
      type: "Conceptual"
    },
    {
      q: "What is the semantic difference between HTTP PUT and HTTP PATCH in RESTCONF, and when should each be used?",
      a: "In RESTCONF, PUT and PATCH have different semantics corresponding to the NETCONF edit-config operations 'replace' and 'merge' respectively. HTTP PUT (replace) — replaces the entire target YANG resource with the body provided. If the target resource has child nodes not included in the PUT body, those children are deleted. If the resource does not exist, PUT creates it. This is equivalent to NETCONF edit-config with operation='replace'. Use PUT when you want to set the complete, authoritative configuration of a resource from a known-good full configuration — for example, deploying a full interface configuration from a golden template. HTTP PATCH (merge) — merges the provided body into the existing target resource. Only the leaves and containers present in the PATCH body are modified; absent nodes are untouched. This is equivalent to NETCONF edit-config with operation='merge'. Use PATCH when you want to change a single attribute (e.g., update only the description or MTU of an interface) without affecting all other configured attributes of that resource. The practical implication: an NMS performing a routine configuration push should use PATCH to make targeted changes without accidentally deleting operator-added customisations. PUT is reserved for full resource replacement, typically during initial provisioning or disaster recovery.",
      type: "Conceptual"
    },
    {
      q: "A YANG response has 40 fields with an average field name length of 12 characters and an average value length of 6 characters. Calculate S_xml, S_json, and the encoding ratio ρ.",
      a: "Given: fields (x) = 40, avgLen (L) = 12 characters, value length (v) = 6 characters. XML size: S_xml = x × (2L + 15 + v) = 40 × (2×12 + 15 + 6) = 40 × (24 + 15 + 6) = 40 × 45 = 1800 characters. JSON size: S_json = x × (L + 8 + v) = 40 × (12 + 8 + 6) = 40 × 26 = 1040 characters. Encoding ratio: ρ = S_json / S_xml = 1040 / 1800 = 0.578 (approximately). This means the JSON payload is 57.8% the size of the XML payload — a saving of 42.2%. For a NMS polling 10,000 devices every minute, if each response is 1800 bytes in XML vs 1040 bytes in JSON, the total bandwidth saving is (1800 − 1040) × 10,000 / minute = 7,600,000 bytes/minute = approximately 7.6 MB/minute or 456 MB/hour — a significant reduction in management plane bandwidth consumption over the life of the network.",
      type: "Numerical"
    },
    {
      q: "How does a RESTCONF client discover the YANG modules supported by a device, and why is this capability important for interoperability?",
      a: "A RESTCONF client discovers a device's supported YANG modules by querying the YANG library, which is itself a YANG module (ietf-yang-library, RFC 7895/8525) accessible at a well-known RESTCONF URL. The client sends: GET /restconf/data/ietf-yang-library:modules-state (RFC 7895) or GET /restconf/data/ietf-yang-library:yang-library (RFC 8525). The response is a JSON or XML document listing all YANG modules the device implements, with for each module: the module name, revision date, namespace URI, supported features (YANG 'if-feature' conditions), active deviations (vendor modifications to standard modules), and conformance type (implement or import). This capability discovery is essential for interoperability because different device vendors implement different subsets of standard YANG modules and different revisions. For example, Cisco IOS-XE may implement ietf-interfaces revision 2018-02-20 with certain deviations, while Juniper implements the same module at revision 2014-05-08. Without capability discovery, a RESTCONF client that constructs a PATCH body using a 2018-revision leaf that does not exist in the older revision will receive a 400 Bad Request error. By querying the YANG library first, the NMS can select the correct module revision and avoid using unsupported features, enabling a single RESTCONF client to manage heterogeneous multi-vendor networks.",
      type: "Conceptual"
    },
    {
      q: "Why does RFC 8040 prohibit RESTCONF over plain HTTP, and what security mechanisms does it mandate?",
      a: "RFC 8040 Section 2.1 explicitly states that RESTCONF MUST be transported over HTTPS (HTTP over TLS), and plain HTTP transport is prohibited. The reasons are: (1) Authentication exposure — RESTCONF uses HTTP Basic Authentication (username and password base64-encoded in the Authorization header). Over plain HTTP, this header is transmitted in cleartext and can be intercepted by any attacker with access to the management network, compromising device credentials. TLS encrypts the header. (2) Configuration confidentiality — RESTCONF request and response bodies contain device configurations (interface IPs, routing tables, VLAN assignments) that are sensitive operational information. Plain HTTP transmits these in cleartext; TLS provides payload encryption. (3) Integrity protection — an attacker on the management network could perform a man-in-the-middle attack on plain HTTP RESTCONF, modifying PATCH/PUT/DELETE request bodies to inject malicious configuration changes. TLS provides message integrity via HMAC. (4) Authentication of the server — TLS certificate verification ensures the RESTCONF client is communicating with the genuine device and not a spoofed server. RFC 8040 mandates TLS 1.2 as the minimum version; TLS 1.3 is recommended. In production NMS deployments, devices are provisioned with signed TLS certificates from a managed PKI, and the NMS validates the certificate chain before accepting any RESTCONF response.",
      type: "Conceptual"
    }
  ],
  virtualLab: {
    description: "Vary data field count and average field name length to observe RESTCONF JSON response size. This illustrates the impact of YANG leaf verbosity on response payload and demonstrates why field filtering is important for bandwidth-constrained management links.",
    interpretation: "A RESTCONF response for a single interface with 20 fields of average 8-character names produces ~800 bytes of JSON (plus structural overhead). Across 500 interfaces, this totals ~400 KB per polling cycle. Applying field filtering to retrieve only 4 counter fields reduces this to 80 KB — an 80% bandwidth saving. This is why RESTCONF field filtering is used in all production analytics integrations polling high-frequency telemetry.",
    parameters: [
      { id: "fields", name: "Data Fields", min: 5, max: 100, default: 20, step: 5, unit: "" },
      { id: "avgLen", name: "Avg Field Name Length", min: 3, max: 20, default: 8, step: 1, unit: " chars" }
    ],
    generateData: (params) => {
      const maxFields = params.fields || 20;
      const avgLen = params.avgLen || 8;
      const pts: Array<{ x: number; y: number }> = [];
      for (let f = 5; f <= maxFields; f += 5) {
        const bytes = f * (avgLen + 20);
        pts.push({ x: f, y: bytes });
      }
      return pts;
    },
    labels: { x: "Fields", y: "Response Size (bytes)" }
  }
};
