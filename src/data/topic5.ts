import type { TopicData } from './types';

export const topic5Data: TopicData = {
  id: "u1t5",
  title: "NMS SBI (Southbound Interface) and NBI (Northbound Interface)",
  moduleName: "Unit I: Introduction to Network Management and Frameworks",

  context: {
    prerequisites: ["EMS and NMS Architecture", "FCAPS Process"],
    dependentTopics: ["SNMP Concepts & Evolution", "Introduction to Model-Driven Management"],
    nextSteps:
      "Study SNMP, which is the most widely deployed protocol on the Southbound Interface.",
    rfcReferences: [
      { rfc: "RFC 3549", title: "Linux Netlink as an IP Services Protocol", summary: "Background on northbound/southbound interface concepts in network management systems.", url: "https://www.rfc-editor.org/rfc/rfc3549" },
      { rfc: "RFC 8040", title: "RESTCONF Protocol", summary: "Defines RESTCONF, a key NBI protocol that exposes YANG-modelled data over HTTP — the modern standard for NMS Northbound APIs.", url: "https://www.rfc-editor.org/rfc/rfc8040" },
      { rfc: "RFC 6241", title: "NETCONF Protocol", summary: "NETCONF is the primary Southbound Interface protocol for model-driven configuration management, directly relevant to SBI design.", url: "https://www.rfc-editor.org/rfc/rfc6241" },
      { rfc: "TM Forum TMF630", title: "REST API Design Guidelines", summary: "TM Forum standard for designing NMS Northbound REST APIs, ensuring consistency across OSS/BSS integrations.", url: "https://www.tmforum.org/resources/standard/tmf630-rest-api-design-guidelines-r22-5/" }
    ]
  },

  storytelling: {
    analogy: "A Smart Building's Sensor Network",
    story:
      "Think of an NMS as a smart building management system. The Southbound Interface (SBI) is the cabling that runs from sensors — temperature probes, smoke detectors, motion sensors — up to the central building controller. Each sensor speaks its own low-level protocol, and the controller must understand each of them (SNMP, NETCONF, RESTCONF, gNMI). The Northbound Interface (NBI), by contrast, is the polished dashboard exposed to building managers, security teams, and third-party facility apps. It speaks a clean, high-level language: REST APIs returning JSON, or SOAP/XML for legacy integrations. The SBI goes DOWN to physical devices; the NBI goes UP to OSS, BSS, and business applications. Without a well-defined NBI, every application developer would need to know the raw sensor protocol and the exact memory register layout of every device — pure chaos in a multi-vendor environment. The NBI acts as an abstraction layer that hides that complexity and translates it into meaningful service-level objects like 'alarm', 'topology-node', or 'performance-metric'.",
    reflectiveQuestions: [
      "Why must the SBI support multiple protocols when managing multi-vendor networks?",
      "What security risks exist at the NBI layer when exposing NMS data to external OSS/BSS systems?",
      "How does the NBI enable OSS integration without exposing raw device configurations to application developers?",
    ],
    technicalConnection: "RFC 3549 (Linux NETCONF Implementation) defines NMS interface architecture: **Southbound Interface (SBI)** manages device layer using multiple protocols: SNMPv3 (RFC 3414, USM security, AES-128 encryption, UDP/161), NETCONF (RFC 6241, SSH transport on TCP/830, YANG models per RFC 6020), RESTCONF (RFC 8040, HTTPS/443, YANG over REST), gRPC/gNMI (gRPC Network Management Interface, streaming telemetry, Protocol Buffers serialization). SBI protocol selection per device capability: legacy Cisco IOS→SNMP, modern JunOS→NETCONF, Nokia SR-OS→gNMI. **Northbound Interface (NBI)** exposes service-level APIs to OSS/BSS: TMF OpenAPIs (TMF642 Alarm Management, TMF628 Performance Management, TMF639 Resource Inventory), RESTCONF for YANG-modeled network data, SOAP/XML for legacy OSS (decreasing), GraphQL for flexible client-specified queries. NBI data model transformation: raw SNMP ifTable (RFC 2863 Interface Group MIB) → TMF639 ResourceInventory JSON: {\"id\":\"eth0\",\"resourceSpecification\":{\"@type\":\"PhysicalPort\"},\"operationalState\":\"enabled\",\"usageState\":\"active\"}. Security: NBI uses OAuth 2.0 (RFC 6749) Bearer tokens, mTLS (RFC 8446), RBAC (Role-Based Access Control per ITU-T X.812). SBI polling strategy: SNMP GETBULK (RFC 3416) with max-repetitions=N retrieves N table rows per PDU, reducing RTT overhead. For 5000 devices × 48 interfaces, GETBULK@20 requires 12 PDUs/device (576 OIDs ÷ 48 OIDs/PDU) = 60K PDUs total. At 2ms RTT: 60K × 2ms = 120 seconds collection time vs 300s window → meets constraint."
  },

  mathModelling: {
    need: "An NMS team must choose the protocol stack for the Southbound Interface (SBI) to integrate 3 device types: 500 Cisco legacy routers (IOS 15.x), 300 Ericsson 5G gNBs, and 200 Juniper MX routers (JunOS). The constraint: all devices must be polled every 5 minutes for performance counters, fault notifications must arrive in under 10 seconds, and the management network bandwidth is limited to 10 Mbps shared. The team evaluates: SNMPv3 only, NETCONF/YANG only, or a mixed SBI protocol stack.",
    equation: "DECISION CONSTRAINT: Poll cycle ≤ 300 seconds for all 1000 devices. Fault latency ≤ 10 seconds. SBI bandwidth consumption ≤ 10 Mbps. All 1000 devices must be manageable (no device exclusion).",
    technicalDetails: "SNMPv3 only: Supported by all 1000 devices. Polling 1000 devices with 500-byte PDUs at 1 Mbps = 4 seconds per cycle — well within 300s budget. Fault notification via SNMPv3 INFORMs in <1 second. BUT: legacy Cisco IOS 15.x SNMP configuration has known scalability issues above 200 concurrent sessions. NETCONF/YANG only: Not supported by Cisco IOS 15.x without upgrade. Eliminates 50% of the device fleet without a $2M IOS upgrade project. Fails device coverage constraint. Mixed SBI (SNMPv3 for legacy + NETCONF/gNMI for modern): SNMPv3 for 500 Cisco legacy routers (polling + traps). NETCONF for 300 Ericsson gNBs (transactional config). gNMI streaming for 200 Juniper MX (high-frequency telemetry). Total bandwidth: estimated 2.8 Mbps — within 10 Mbps limit.",
    explanation: [
      { term: "SNMPv3 Only", meaning: "Adopted when all devices support SNMP and the network is relatively homogeneous. Suitable for legacy-only environments. Fails when modern devices require model-driven configuration management or streaming telemetry that SNMP cannot provide." },
      { term: "NETCONF/YANG Only", meaning: "Adopted for greenfield 5G or cloud-native deployments where all devices are modern and support NETCONF. Requires all devices to have NETCONF capability — not feasible for mixed legacy environments without costly upgrades." },
      { term: "Mixed SBI Protocol Stack (Recommended)", meaning: "Adopted in real-world multi-vendor, multi-generation networks. Each protocol is used where it fits best: SNMP for legacy, NETCONF for transactional config, gNMI for streaming telemetry. Meets all constraints without requiring device upgrades. Industry standard for brownfield NMS deployments." }
    ],
    advantages: [
      "Mixed SBI covers 100% of the device fleet without requiring costly firmware/OS upgrades",
      "Each protocol is matched to its optimal use case — SNMP for legacy monitoring, NETCONF for safe configuration, gNMI for telemetry",
      "Stays within the 10 Mbps SBI bandwidth budget with estimated 2.8 Mbps total consumption"
    ],
    limitations: [
      "SNMPv3 only is appropriate when all devices are SNMP-capable and configuration complexity justifies the simplicity trade-off",
      "NETCONF only is appropriate for greenfield deployments with a committed vendor and modern equipment procurement",
      "Some operators choose gNMI only for cloud-native 5G SA networks where all NEs support OpenConfig/gNMI"
    ]
  },

  activities: {
    level1:
      "Draw an NMS architecture diagram clearly labelling the SBI and NBI. On the SBI, annotate at least three protocols (e.g., SNMP, NETCONF, gNMI). On the NBI, annotate at least two protocols (e.g., REST/HTTPS, TMF OpenAPI). Show the direction of communication — which interface goes toward devices and which goes toward OSS/BSS.",
    level2:
      "Compare SNMP (SBI) and a REST API (NBI) across four dimensions: data model (MIB OID tree vs JSON schema), security (community string vs OAuth2/TLS), real-time capability (polling vs streaming), and primary consumer (NMS internal vs external OSS application). Present your comparison as a structured table.",
    level3:
      "Calculate the poll cycle time \\( T_{poll} \\) for 500 managed devices, an average PDU size of 800 bytes, and an SBI bandwidth of 2 Mbps (= 250,000 bytes/s). Determine whether this fits within a 15-minute monitoring interval. If not, what minimum bandwidth is needed?",
    level4:
      "Design a NBI REST API for an NMS with exactly three endpoints: GET /alarms (returns active alarms with severity and source), GET /topology (returns network graph with nodes and links), and POST /config (pushes a configuration change to a device via the NMS). For each endpoint, define the HTTP method, URL, request parameters, and a sample JSON response body.",
  },

  projects: {
    scope:
      "Implement a mock NBI REST API (using Node.js/Express or Python/FastAPI) that wraps simulated SBI SNMP data for consumption by an OSS application. The system must demonstrate the full data flow from simulated device → SBI poll → NMS data model → NBI API response.",
    objectives: [
      "Define SBI protocol handling for three device types: router (SNMP), switch (NETCONF), and server (RESTCONF)",
      "Design five NBI REST API endpoints following TMF OpenAPI naming conventions",
      "Simulate and report poll cycle load calculation for varying device counts",
      "Implement basic API key authentication on the NBI to demonstrate security separation",
    ],
    deliverables: [
      "SBI protocol map documenting which protocol is used per device type and why",
      "NBI API Swagger/OpenAPI 3.0 specification with all five endpoints documented",
      "Poll cycle load analysis report comparing performance at 100, 500, and 1000 devices",
    ],
  },

  questions: [
    {
      q: "What is the functional difference between the Southbound Interface (SBI) and the Northbound Interface (NBI) in an NMS?",
      a: "The SBI connects the NMS downward to managed network devices using device-level protocols (SNMP, NETCONF, gNMI). It is responsible for collecting raw performance and fault data from devices and pushing configuration changes to them. The NBI connects the NMS upward to OSS, BSS, and third-party applications using abstracted, service-level APIs (REST, SOAP, TMF OpenAPI). The NBI hides the protocol heterogeneity of the SBI from application consumers and exposes data as structured service objects such as alarms, topology, and performance metrics.",
      type: "Conceptual",
    },
    {
      q: "Name three protocols used on the SBI and two used on the NBI in a modern NMS.",
      a: "SBI protocols: (1) SNMPv3 — polling performance counters and receiving fault traps from legacy devices; (2) NETCONF (RFC 6241) — model-driven configuration management for newer network elements; (3) gNMI/gRPC — streaming telemetry for high-frequency performance data from modern routers and switches. NBI protocols: (1) REST/HTTPS with JSON — used by OSS portals and third-party analytics applications; (2) TMF OpenAPI — standardised TM Forum APIs for Telco OSS/BSS integration (e.g., Fault Management API TMF642, Performance Management API TMF628).",
      type: "Conceptual",
    },
    {
      q: "Calculate T_poll for N = 300 devices, PDU size S = 600 bytes, and SBI bandwidth B = 512 kbps. Show all working.",
      a: "Convert bandwidth: 512 kbps = 512,000 bits/s ÷ 8 = 64,000 bytes/s. Apply the formula: T_poll = (N × S) / B = (300 × 600) / 64,000 = 180,000 / 64,000 ≈ 2.81 seconds. This is well within the 15-minute (900-second) SLA window, confirming that a 512 kbps SBI is sufficient for 300 devices with 600-byte PDUs at this polling rate.",
      type: "Numerical",
    },
    {
      q: "Why is REST API preferred over CORBA for modern NBI implementations?",
      a: "CORBA (Common Object Request Broker Architecture) was designed in the 1990s for tightly coupled, binary RPC communication and requires IDL (Interface Definition Language) compilation, complex ORB middleware, and firewall-hostile proprietary ports. REST APIs use standard HTTP/HTTPS on well-known ports, are firewall-friendly, use human-readable JSON/XML payloads, and require no special middleware. REST integrates natively with web frameworks, cloud platforms, and DevOps toolchains. Additionally, REST supports stateless interactions which improve scalability, and modern REST APIs can be documented with OpenAPI (Swagger), making them self-describing. For these reasons, the TM Forum deprecated CORBA in its Open Digital Architecture in favour of REST-based TMF OpenAPIs.",
      type: "Analytical",
    },
    {
      q: "How does RESTCONF on the SBI differ from a REST API on the NBI, even though both use HTTP?",
      a: "RESTCONF (RFC 8040) on the SBI is a protocol defined for direct NMS-to-device communication. It operates over YANG data models (RFC 7950) and maps YANG-defined configuration and operational data to HTTP methods (GET, PUT, POST, DELETE, PATCH). It targets network device agents directly and requires the device to implement a RESTCONF server. The NBI REST API, by contrast, is a custom or TMF-standardised HTTP API exposed by the NMS to OSS/BSS consumers. It uses the NMS's own data model (alarms, topology, services) rather than device YANG models. The NBI REST API abstracts and aggregates data from multiple devices, whereas RESTCONF on the SBI communicates with one device at a time in its native data model.",
      type: "Analytical",
    },
  ],

  virtualLab: {
    description:
      "You are sizing the management network for a new NMS deployment. Your task: determine the minimum SBI bandwidth needed to poll all devices within a target monitoring interval (e.g., 60 seconds). Adjust the number of managed devices and the available SBI bandwidth. Each device poll transmits a 500-byte PDU. The chart shows poll cycle time vs device count — find the bandwidth required to keep cycle time under your monitoring target.",
    interpretation:
      "Poll cycle time scales linearly with device count and inversely with bandwidth. For a 60-second monitoring target with 200 devices, you need at least 1000 kbps. At 500 devices, the same bandwidth gives 250-second cycles — missing the target by over 4 minutes. Upgrading to 5000 kbps restores it to 50 seconds. This models why large-scale NMS deployments use dedicated out-of-band management networks sized for the peak device count, not the average. Use this to size the management link for your projected 5-year device growth.",
    parameters: [
      { id: "devices", name: "Devices", min: 10, max: 1000, default: 200, step: 10, unit: "" },
      { id: "bandwidth", name: "SBI Bandwidth", min: 100, max: 10000, default: 1000, step: 100, unit: " kbps" },
    ],
    generateData: (params) => {
      const maxDevices = params.devices || 200;
      const bps = ((params.bandwidth || 1000) * 1000) / 8; // kbps → bytes/s
      const pduSize = 500; // fixed average PDU size (bytes)
      const pts: Array<{ x: number; y: number }> = [];
      for (let x = 10; x <= maxDevices; x += 10) {
        const y = (x * pduSize) / bps;
        pts.push({ x, y: parseFloat(y.toFixed(4)) });
      }
      return pts;
    },
    labels: { x: "Devices", y: "Poll Cycle Time (s)" },
  },
};
