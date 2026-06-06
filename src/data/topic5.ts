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
    technicalConnection:
      "SBI protocols include SNMPv1/v2c/v3 (RFC 1157/1901/3414), NETCONF (RFC 6241), RESTCONF (RFC 8040), gRPC/gNMI (OpenConfig), and CLI/SFTP for legacy devices. NBI protocols include REST/HTTPS (JSON/XML), SOAP/XML (legacy OSS), TMF OpenAPIs (TM Forum Open Digital Architecture), and CORBA (legacy Telco OSS). The NBI abstracts raw device data into service-level objects, hiding protocol heterogeneity from application consumers. The SBI bandwidth and polling strategy directly determine how fresh the data exposed on the NBI can be.",
  },

  mathModelling: {
    need:
      "To model NMS polling throughput on the SBI — determining how long it takes to complete one full poll cycle across all managed devices, and whether it fits within the required monitoring interval (typically 15 minutes for performance data).",
    equation:
      "T_{poll} = \\frac{N_{devices} \\times S_{PDU}}{B_{sbi}}",
    technicalDetails:
      "\\( T_{poll} \\) is the total time (in seconds) required to complete one polling cycle across all managed devices. \\( N_{devices} \\) is the number of managed devices, \\( S_{PDU} \\) is the average PDU size per device query (bytes), and \\( B_{sbi} \\) is the SBI link bandwidth in bytes per second. For a 15-minute monitoring interval, \\( T_{poll} \\) must be less than 900 seconds. If it exceeds this, the NMS cannot deliver current performance data within the SLA window — a design failure. This model assumes sequential polling; in practice, NMS platforms parallelise polls across multiple threads to reduce \\( T_{poll} \\).",
    explanation: [
      { term: "T_{poll}", meaning: "Total polling cycle duration (seconds)" },
      { term: "N_{devices}", meaning: "Number of managed devices in the network" },
      { term: "S_{PDU}", meaning: "Average SNMP/NETCONF PDU size per device poll (bytes)" },
      { term: "B_{sbi}", meaning: "SBI link bandwidth available for management traffic (bytes/s)" },
    ],
    advantages: [
      "Clearly defines the boundary between the management plane and the network plane, simplifying system design",
      "Enables vendor-agnostic NMS solutions through standard NBI APIs (TMF OpenAPI, REST), decoupling OSS from device specifics",
      "The SBI abstraction allows the NMS to add support for new device protocols without changing the NBI",
      "The NBI enables role-based access control — OSS applications receive only the data they are authorised to consume",
    ],
    limitations: [
      "SBI bandwidth becomes a bottleneck as device count scales into thousands — a 1 Mbps SBI cannot sustain sub-minute polling for 1000+ devices",
      "Legacy SBI protocols (SNMPv1/v2c, CLI) lack security (no encryption, plaintext community strings) and streaming capabilities",
      "NBI versioning is complex — changes to the NBI API can break multiple OSS applications simultaneously",
      "The abstraction at the NBI can hide important device-level detail that operators need for troubleshooting",
    ],
    simulation: {
      description:
        "Vary the number of managed devices to observe how poll cycle time grows linearly with device count on a fixed SBI bandwidth of 1 Mbps. The red dashed line at 900 seconds marks the 15-minute SLA boundary.",
      parameters: [
        { id: "devices", name: "Managed Devices", min: 10, max: 1000, default: 200, step: 10, unit: "" },
        { id: "pduSize", name: "PDU Size", min: 100, max: 2000, default: 500, step: 100, unit: " bytes" },
      ],
      generateData: (params) => {
        const maxDevices = params.devices || 200;
        const pduSize = params.pduSize || 500;
        const bandwidth = 1_000_000 / 8; // 1 Mbps in bytes/s = 125000 bytes/s
        const pts: Array<{ x: number; y: number }> = [];
        for (let x = 10; x <= maxDevices; x += 10) {
          const pollTime = (x * pduSize) / bandwidth;
          pts.push({ x, y: parseFloat(pollTime.toFixed(3)) });
        }
        return pts;
      },
      labels: { x: "Devices", y: "Poll Cycle Time (s)" },
    },
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
      "Adjust the number of managed devices and the SBI bandwidth to observe how poll cycle time responds. The graph plots poll cycle time (seconds) vs. number of devices for the selected bandwidth. Use this to determine the minimum bandwidth needed to maintain a given monitoring interval.",
    interpretation:
      "As device count grows, poll cycle time increases linearly — doubling the devices doubles the time. Upgrading SBI bandwidth reduces cycle time proportionally: a 10× bandwidth increase produces a 10× reduction in poll cycle time. This demonstrates why high-capacity, dedicated management networks (out-of-band management) are necessary for large-scale NMS deployments targeting sub-minute monitoring intervals.",
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
