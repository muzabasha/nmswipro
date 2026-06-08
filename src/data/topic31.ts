import type { TopicData } from './types';

export const topic31Data: TopicData = {
  id: "u3t9",
  title: "ONF TAPI Overview",
  moduleName: "Unit III: Alarm Lifecycle Management",
  context: {
    prerequisites: ["REST API Commands and Operation Flow", "EMS and NMS Architecture"],
    dependentTopics: ["Network Function Virtualization (NFV) Concepts (VIM, VNFM, NFVO)"],
    nextSteps: "Proceed to NFV Concepts to understand how virtualised network functions, managed via MANO, also expose standardised northbound APIs analogous to TAPI for transport network domains.",
    rfcReferences: [
      { rfc: "ONF TAPI v2.4", title: "Transport API Specification", summary: "Transport API specification — YANG models for topology, connectivity, path computation, and notifications.", url: "https://opennetworking.org/tapi/" },
      { rfc: "RFC 8040", title: "RESTCONF Protocol", summary: "Transport mechanism for TAPI YANG-modeled data over HTTP.", url: "https://www.rfc-editor.org/rfc/rfc8040" },
      { rfc: "RFC 6020", title: "YANG 1.0", summary: "Data modeling language used for TAPI topology and connectivity models.", url: "https://www.rfc-editor.org/rfc/rfc6020" },
      { rfc: "RFC 8345", title: "Network Topology Data Model", summary: "Foundation for TAPI topology representation.", url: "https://www.rfc-editor.org/rfc/rfc8345" },
      { rfc: "ITU-T G.8080", title: "Architecture for Multi-Layer Networks", summary: "Architecture for Multi-Layer and Multi-Domain Networks — aligns with TAPI service model.", url: "https://www.itu.int/rec/T-REC-G.8080/en" },
      { rfc: "OpenConfig Transport", title: "OpenConfig Transport Models", summary: "Complementary standard for device-level transport configuration alongside TAPI service-level orchestration.", url: "https://www.openconfig.net/projects/models/" }
    ]
  },
  storytelling: {
    analogy: "A Universal Electrical Socket Standard for Network APIs",
    story: "ONF TAPI (Transport API) is the universal socket standard for optical and transport network management. Think about the problem of international travel with electrical devices: every country developed its own power socket standard independently — the UK's three-pin rectangular, the US's two-pin flat, Europe's two-pin round, Australia's oblique two-pin. A traveller visiting four countries needs four different adapters because there is no universal standard. Now imagine if every country had agreed on a single socket design from the beginning — one adapter would work everywhere. This is precisely the problem TAPI solves in transport network management. Different optical transport vendors — Ciena, Infinera, Nokia, Huawei, ADVA — each developed their own proprietary management APIs for their optical networking equipment. An OSS system managing a Ciena 6500 optical switch needed one set of client libraries; managing an Infinera DTN-X required a completely different codebase; managing a Nokia 1830 required yet another integration. The ONF (Open Networking Foundation) developed TAPI (Transport API) to be the universal socket: a unified REST/JSON API specification that all transport vendors implement, enabling any OSS to manage any vendor's optical equipment with the same API calls. TAPI covers four core areas: topology and inventory (the list of nodes, links, and ports in the optical network), connectivity services (provision, modify, and delete optical paths and end-to-end circuits), path computation (request optimal paths through the optical mesh), and alarm and performance management (retrieve faults and performance counters from optical network elements). TAPI is defined using YANG data models and exposed as REST/JSON APIs over HTTPS, following the same HTTP verb semantics as any REST API. The ONF TAPI specification is maintained in YANG GitHub and versioned (currently TAPI v2.4). A network operator using TAPI-compliant controllers and OSS can mix Ciena, Infinera, and Nokia optical nodes in the same network and manage all of them with a single TAPI-based OSS application — exactly as a universal adapter works in any country.",
    reflectiveQuestions: [
      "Which TAPI domain (topology, connectivity, path computation, or alarm management) would be the most critical to implement first when deploying a new optical network OSS, and why?",
      "How does TAPI relate to OpenConfig — are they competitors or complementary standards, and what is each designed for?",
      "What challenges arise when a network operator needs to manage a mixed TAPI-compliant and non-compliant vendor environment — what adapter or translation layer would be needed?"
    ],
    technicalConnection: "TAPI architecture: TAPI-based OSS client (operator's orchestration or assurance system) → TAPI REST API (HTTPS/443) → Transport Domain Controller (TDC) or WDM controller layer → Vendor NEs (Ciena, Infinera, Nokia). Key TAPI YANG modules: tapi-common (base types and contexts), tapi-topology (network topology model), tapi-connectivity (service connectivity model), tapi-path-computation (path computation requests), tapi-notification (event/alarm notifications). TAPI REST endpoints: GET /tapi-common:context — returns the top-level context with all topology and service data. GET /tapi-topology:topology — returns optical topology. POST /tapi-connectivity:create-connectivity-service — provisions a new optical service. GET /tapi-notification:notification-subscription — subscribe to alarm events. ONF TAPI GitHub: https://github.com/OpenNetworkingFoundation/TAPI. TAPI is implemented by major optical controllers: Ciena Blue Planet MCP, Nokia WaveSuite, Infinera XTC."
  },
  mathModelling: {
    need: "A telecom operator is building a multi-domain optical transport network spanning 3 vendor domains (Ciena, Nokia, Infinera). A single end-to-end optical path must be provisioned across all three domains from a single orchestration system. Each domain has its own NMS with proprietary APIs. The constraint: the orchestration system must provision a 100 Gbps OTN path from domain A to domain C in under 5 minutes without writing vendor-specific integration code per domain. Decision: proprietary domain APIs / TAPI (Transport API) NBI / OpenROADM / NETCONF TE models.",
    equation: "DECISION CONSTRAINT: End-to-end path provisioned < 5 minutes. Zero vendor-specific integration code in the orchestration system. Must support path computation across 3 domains. Must expose connection status and performance monitoring. Decision: Proprietary Domain APIs / TAPI NBI / OpenROADM / NETCONF TE YANG.",
    technicalDetails: "Proprietary Domain APIs: Each vendor domain NMS exposes a proprietary REST or SOAP API. Integration: 3 separate API clients, 3 data model translations, 3 authentication schemes. Development: 3–6 months per vendor × 3 vendors = 9–18 months. Vendor lock-in: adding a 4th vendor (Ribbon) requires a 4th integration. Not viable within the project timeline. TAPI NBI (ONF Transport API — Recommended): TM Forum/ONF standard API for transport network abstraction. Each domain controller exposes a TAPI NBI — the orchestration system uses one API client regardless of vendor. TAPI objects: Service Interface Point (SIP), Connectivity Service, Path. A TAPI Connectivity Service request specifies: source SIP, destination SIP, capacity (100 Gbps), protection-type, latency objective. The domain controller (Ciena MCP, Nokia 1350 OMS, Infinera MCP) computes the path within its domain and returns the path endpoints for stitching. End-to-end stitching: the orchestration system sends one Connectivity Service request per domain and stitches them at the inter-domain interfaces (SIPs). Provisioning time: < 3 minutes (API processing + path computation + cross-connect programming). OpenROADM: Open standard for disaggregated ROADM (Reconfigurable Optical Add-Drop Multiplexer). Focused on open line system — not a full multi-domain orchestration API. NETCONF TE YANG (RFC 8776): YANG models for Traffic Engineering. Detailed TE data models but requires NETCONF transport — not REST. More complex than TAPI for end-to-end service provisioning.",
    explanation: [
      { term: "Proprietary Domain APIs", meaning: "Each vendor NMS has a unique API. WHY REJECTED: 9–18 months development for 3 vendors. Adding a 4th vendor adds 3–6 months more. Zero code reuse across vendors. On vendor NMS upgrade, the integration may break — requiring re-integration. WHEN ADOPTED: Only when TAPI or OpenROADM are not supported by the vendor domain controller — typically older transport equipment (pre-2018) without standards-based NBIs." },
      { term: "TAPI NBI (Recommended)", meaning: "ONF Transport API. One API client provisions across all 3 domains. TAPI Connectivity Service request specifies source SIP, destination SIP, 100 Gbps capacity. Domain controllers handle within-domain path computation. Orchestration system stitches at domain boundaries. Provisioning: < 3 minutes. WHY BEST: Zero vendor-specific code. Adding Ribbon as a 4th domain: load Ribbon's TAPI SIPs into the orchestrator — no new integration code. Used in production by Deutsche Telekom, BT, and Orange for multi-domain optical automation." },
      { term: "OpenROADM", meaning: "Open standard for disaggregated ROADM line systems. WHY INSUFFICIENT FOR THIS CASE: OpenROADM focuses on open line system (transponders, amplifiers, ROADMs) at the device level — it does not define a multi-domain service orchestration API. It is complementary to TAPI: OpenROADM for within-domain device configuration, TAPI for cross-domain service provisioning. WHEN ADOPTED: Used alongside TAPI for disaggregated optical deployments where the operator is building an open optical domain with multi-vendor components." },
      { term: "NETCONF TE YANG (RFC 8776)", meaning: "YANG models for TE topology and tunnels. More detailed than TAPI but requires NETCONF transport. WHY SECONDARY: NETCONF TE YANG is a data model, not a service API — it describes TE topology nodes and links but does not define a connectivity service abstraction like TAPI. WHEN ADOPTED: Used for within-domain TE path computation and RSVP-TE tunnel configuration in IP/MPLS domains — not for end-to-end optical service provisioning across optical domains." }
    ],
    advantages: [
      "TAPI's single API client handles all 3 vendor domains — integration development time drops from 9–18 months (proprietary) to 2–3 months (TAPI), with zero vendor-specific code",
      "TAPI's Service Interface Point abstraction hides domain-internal topology — the orchestration system does not need to know which fibres, amplifiers, or ROADMs are used within each domain",
      "Adding a 4th vendor domain requires only loading the new domain's SIPs into the orchestrator — no new integration code, because all domains use the same TAPI Connectivity Service API"
    ],
    limitations: [
      "Proprietary APIs are adopted for legacy optical domains (pre-2018 equipment) where the vendor domain controller does not support TAPI — a TAPI adapter layer translates TAPI requests to the proprietary API",
      "OpenROADM is adopted alongside TAPI for open optical disaggregated deployments — TAPI for cross-domain service orchestration, OpenROADM for within-domain device configuration",
      "NETCONF TE YANG is adopted for IP/MPLS TE path management within a domain — combined with TAPI for the optical layer, the orchestrator manages both IP and optical layers via their respective standards"
    ]
  },
  activities: {
    level1: "List the four core TAPI API domains (topology, connectivity, path computation, notification/alarm) and for each: (a) describe what it manages, (b) give the primary YANG module name, and (c) describe a specific OSS use case that would use that domain.",
    level2: "Draw the TAPI architecture stack for an operator managing a three-vendor optical network (Ciena, Infinera, Nokia). Show: the OSS layer, the TAPI REST API interface, the Transport Domain Controller (TDC) layer, the vendor-specific southbound interfaces, and the vendor optical equipment. Label each interface with its protocol and direction.",
    level3: "An operator manages 6 optical transport vendors. Custom integration for each vendor costs 70 person-days. TAPI standard integration costs 90 person-days. Calculate (a) total custom development cost, (b) TAPI-based savings, and (c) break-even vendor count (minimum N_vendors at which TAPI becomes economically justified).",
    level4: "Write a TAPI connectivity service provisioning request in JSON format for a 100G wavelength service between two optical nodes. Include: serviceType, layer, clientServiceEndpoints (source and destination topology node + port), bandwidth, and protection scheme. Document each JSON field with its TAPI YANG model definition."
  },
  projects: {
    scope: "Build a TAPI client application that connects to a mock TAPI REST server, performs topology discovery, provisions a connectivity service, monitors its alarm state, and produces an optical network inventory report.",
    objectives: [
      "Implement a Python TAPI client that authenticates via OAuth 2.0 and retrieves the optical topology from GET /tapi-common:context, parsing node, link, and port objects",
      "Implement connectivity service provisioning using POST /tapi-connectivity:create-connectivity-service and monitor the service state via GET /tapi-connectivity:get-connectivity-service-details",
      "Implement TAPI notification subscription for alarm events and process received alarm notifications into a structured fault report"
    ],
    deliverables: [
      "Python TAPI client library with documented functions for topology query, service provisioning, service status polling, and alarm notification subscription",
      "Optical network inventory report generated from TAPI topology data: node list, link list, available bandwidth per link, and current service list",
      "TAPI vs custom-API comparison analysis: development effort saved, API call count comparison, and assessment of TAPI feature coverage gaps for a specified vendor"
    ]
  },
  questions: [
    {
      q: "What is ONF TAPI and what problem does it solve in transport network management?",
      a: "ONF TAPI (Open Networking Foundation Transport API) is an open, standardised REST/JSON API specification for managing optical and transport networks. It is developed and maintained by the Open Networking Foundation. The problem it solves: optical transport vendors (Ciena, Infinera, Nokia, Huawei, ADVA) each developed proprietary management APIs for their equipment. An operator managing a multi-vendor optical network had to develop and maintain a separate custom API integration for each vendor — a high-cost, high-maintenance burden. TAPI provides a vendor-neutral API that all compliant optical controllers and SDN controllers implement, enabling a single OSS integration to manage all vendors' equipment. TAPI covers four domains: optical topology and inventory (what nodes, links, and ports exist), connectivity services (provision, modify, delete optical end-to-end paths), path computation (calculate optimal routes through the optical mesh), and alarm and performance notifications (receive fault and performance events). This enables a 'multi-vendor, single-integration' operational model in optical networks.",
      type: "Conceptual"
    },
    {
      q: "What are the primary TAPI YANG modules and what does each model?",
      a: "tapi-common: defines base data types, identities, and the top-level context object that serves as the root for all TAPI data. The context (GET /tapi-common:context) is the entry point to all TAPI data. tapi-topology: models the optical network topology — network topology objects (nodes, owned-node-edge-points representing ports, link objects representing fibres or virtual connections between nodes). Used for topology discovery and inventory reporting. tapi-connectivity: models end-to-end connectivity services — the primary provisioning interface. Defines connectivity-service objects (source/destination endpoints, layer, bandwidth, protection), end-point objects, and service state (PLANNED, ACTIVE, LOCKED). tapi-path-computation: models path computation requests — the OSS asks 'what is the best path for a 100G service from node A to node B?' and the controller responds with a path object. tapi-notification: models the event/alarm subscription and notification delivery mechanism — the OSS subscribes to specific event types (topology changes, service state changes, alarm notifications) and receives them as webhook POSTs or SSE streams.",
      type: "Conceptual"
    },
    {
      q: "An operator manages 7 optical vendors. Custom integration costs 65 person-days per vendor. TAPI integration costs 95 person-days. Calculate development savings.",
      a: "Custom development total cost: N_vendors × T_custom = 7 × 65 = 455 person-days. TAPI standard integration cost: T_standard = 95 person-days. Development savings: S_dev = 455 − 95 = 360 person-days saved. Break-even vendor count: N_break-even = T_standard / T_custom = 95 / 65 = 1.46, so TAPI is economically justified from 2 vendors onward. At 7 vendors, the savings represent 360 / 455 = 79% reduction in integration development cost. Additionally, TAPI-based integration has lower ongoing maintenance cost since a single integration codebase is maintained instead of seven separate vendor-specific codebases.",
      type: "Numerical"
    },
    {
      q: "How does TAPI's topology model represent an optical network and how is it used for alarm impact analysis?",
      a: "The TAPI topology model represents the optical network as a graph of nodes and links: Nodes (tapi-topology:node) represent optical equipment: OADMs (Optical Add-Drop Multiplexers), amplifiers, ROADMs, transponders, and OXCs. Each node has one or more node-edge-points (NEPs) representing its optical ports. Links (tapi-topology:link) represent fibres or optical connections between node-edge-points. Each link has a layer protocol (PHOTONIC_MEDIA, OTU, ODU, ETH) and capacity. Connectivity services reference the path of nodes and links they traverse. For alarm impact analysis: when an optical link or node raises an alarm (e.g., Loss of Light on a specific fibre span), the NMS uses the TAPI topology graph to traverse all connectivity services that include that link or node in their path. Each affected service is then identified as impacted. The impact list (list of affected services and their customers) is attached to the root-cause alarm, enabling the NOC to immediately understand the customer impact without manual tracing. This topology-aware alarm enrichment is one of TAPI's highest-value contributions to optical network fault management.",
      type: "Analytical"
    },
    {
      q: "Compare ONF TAPI with OpenConfig and explain how they complement each other in a modern network management architecture.",
      a: "ONF TAPI and OpenConfig are complementary standards targeting different network layers and use cases: OpenConfig focuses on IP/packet network device configuration and telemetry — it defines vendor-neutral YANG models for IP routing (BGP, OSPF, ISIS), interfaces, QoS, and MPLS, plus the gNMI (gRPC Network Management Interface) and gNOI (gRPC Network Operations Interface) protocols for configuration and operations. OpenConfig is optimised for configuring individual network devices and streaming high-frequency telemetry (CPU, interface counters, routing tables) in near-real-time. ONF TAPI focuses on transport/optical network service-layer management — it defines models for optical connectivity services, optical topology, and wavelength-level path computation. TAPI operates at the multi-device, service-path level — 'provision a 100G service from city A to city B' — rather than configuring individual device parameters. In a modern network management architecture, both are used together: OpenConfig and gNMI manage the IP router/switch layer (configuration, high-frequency telemetry), while TAPI manages the optical transport layer beneath it (wavelength services, optical topology, amplifier states). An OSS uses TAPI to provision an optical path, then uses OpenConfig via NETCONF/RESTCONF to configure the IP devices that ride that optical path.",
      type: "Analytical"
    }
  ],
  virtualLab: {
    description: "Vary domain count and provisioning time per domain to observe total end-to-end service provisioning time. Compares sequential domain provisioning (worst case) vs parallel domain provisioning (TAPI concurrent requests). TAPI supports concurrent provisioning across domains.",
    interpretation: "Sequential provisioning across 3 domains at 60s each takes 180s (3 minutes). With TAPI concurrent requests (all 3 domains provisioned in parallel), total time is max(domain times) = 60s. As domain count grows to 5, sequential takes 300s (5 minutes — at the limit). Parallel provisioning keeps total time at the slowest domain's time regardless of domain count. This illustrates why TAPI's concurrent provisioning model is essential for multi-domain deployments with strict SLA targets.",
    parameters: [
      { id: "domains", name: "Domain Count", min: 1, max: 10, default: 3, step: 1, unit: "" },
      { id: "provTimeS", name: "Provisioning Time/Domain", min: 10, max: 120, default: 60, step: 10, unit: " s" }
    ],
    generateData: (params) => {
      const maxDomains = params.domains || 3;
      const provTime = params.provTimeS || 60;
      const pts: Array<{ x: number; y: number }> = [];
      for (let d = 1; d <= maxDomains; d++) {
        pts.push({ x: d, y: d * provTime });
      }
      return pts;
    },
    labels: { x: "Domains", y: "Sequential Provisioning Time (s)" }
  }
};
