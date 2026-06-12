export interface TopicRecap {
  takeaways: string[];
  courseOutcomes: number[];
  applicationOutcomes: string[];
  skillsImproved: string[];
}

export const recapData: Record<string, TopicRecap> = {
  /* ══════════════════════════════════════════════════════════════════════
     UNIT I — Introduction to Network Management and Frameworks
  ══════════════════════════════════════════════════════════════════════ */

  "u1t1": {
    takeaways: [
      "Mobile network architecture consists of UE, RAN, Core Network, and Management Plane",
      "Each generation (2G→5G) introduced architectural improvements in speed, latency, and IP handling",
      "4G LTE introduced all-IP flat architecture; 5G adds network slicing and edge computing",
      "Network management is essential for monitoring, configuring, and controlling network elements",
      "The NMS provides centralized visibility across heterogeneous network devices",
    ],
    courseOutcomes: [1],
    applicationOutcomes: [
      "Identify the components of a mobile network and explain their roles",
      "Distinguish between 2G, 3G, 4G, and 5G architectural differences",
      "Explain why network management is needed in modern telecommunications",
      "Describe the role of NMS in managing large-scale mobile networks",
    ],
    skillsImproved: ["Technical Vocabulary", "Systems Thinking", "Network Architecture Literacy"],
  },

  "u1t2": {
    takeaways: [
      "FCAPS defines five functional areas: Fault, Configuration, Accounting, Performance, Security",
      "Each FCAPS area addresses a specific dimension of network operations",
      "Fault management handles alarm detection and root cause analysis",
      "Performance management monitors KPIs, throughput, and quality of service",
      "FCAPS provides a structured framework for organizing NMS capabilities",
    ],
    courseOutcomes: [1],
    applicationOutcomes: [
      "Map network management tasks to the appropriate FCAPS category",
      "Design a monitoring strategy covering all five FCAPS dimensions",
      "Explain how FCAPS integrates into an enterprise NMS deployment",
    ],
    skillsImproved: ["Framework Analysis", "Operational Planning", "Structured Thinking"],
  },

  "u1t3": {
    takeaways: [
      "OSI model layers and their specific roles in data communication",
      "TCP/IP model simplifies OSI into four functional layers",
      "Each layer encapsulates data differently and uses distinct protocols",
      "Understanding layer boundaries is essential for network troubleshooting",
      "Cross-layer interactions explain how end-to-end communication works",
    ],
    courseOutcomes: [1, 2],
    applicationOutcomes: [
      "Map real-world protocols to their correct OSI/TCP-IP layers",
      "Troubleshoot network issues by isolating the failing layer",
      "Explain how encapsulation and de-encapsulation work across layers",
    ],
    skillsImproved: ["Layered Problem Solving", "Protocol Analysis", "Troubleshooting Methodology"],
  },

  "u1t4": {
    takeaways: [
      "TMN defines a hierarchical management architecture: NE → EMS → NMS → OSS",
      "Northbound interfaces connect NMS to OSS/BSS for service orchestration",
      "Southbound interfaces connect NMS to managed devices via SNMP, CLI, NETCONF",
      "The EMS-NMS-OSS hierarchy separates domain, network, and service management",
      "Interface standardization enables multi-vendor interoperability",
    ],
    courseOutcomes: [2, 5],
    applicationOutcomes: [
      "Design a management architecture using TMN hierarchy for a multi-vendor network",
      "Identify which interfaces (northbound/southbound) to use for specific management tasks",
      "Explain how EMS, NMS, and OSS collaborate in a service provider environment",
    ],
    skillsImproved: ["Architecture Design", "Interface Specification", "Multi-vendor Integration"],
  },

  "u1t5": {
    takeaways: [
      "MIB organizes management data in a hierarchical OID tree structure",
      "MIB-II (RFC 1213) defines standard objects: sysDescr, ifTable, ipRouteTable",
      "Each OID uniquely identifies a management variable on a device",
      "GET, SET, and GETNEXT operations interact with MIB objects",
      "Understanding MIB structure is fundamental to SNMP-based monitoring",
    ],
    courseOutcomes: [2],
    applicationOutcomes: [
      "Navigate MIB-II OID trees to locate specific device information",
      "Use MIB browsers to query device status and configuration",
      "Explain how MIB objects map to real device parameters",
    ],
    skillsImproved: ["Data Model Understanding", "OID Navigation", "SNMP Fundamentals"],
  },

  "u1t6": {
    takeaways: [
      "Commercial NMS tools: SolarWinds, PRTG, IBM Tivoli, HP OpenView",
      "Open-source NMS tools: Nagios, Zabbix, LibreNMS, OpenNMS",
      "Each tool has strengths in scalability, protocol support, and customization",
      "Tool selection depends on network size, budget, and feature requirements",
      "Open-source tools offer flexibility; commercial tools offer enterprise support",
    ],
    courseOutcomes: [2, 4],
    applicationOutcomes: [
      "Evaluate and select appropriate NMS tools based on organizational requirements",
      "Install and configure open-source NMS platforms for network monitoring",
      "Compare features and limitations of commercial vs open-source solutions",
    ],
    skillsImproved: ["Tool Evaluation", "Technical Decision Making", "Hands-on Configuration"],
  },

  "u1t7": {
    takeaways: [
      "SNMP architecture: Manager (NMS), Agent (device), MIB (data store)",
      "SNMPv1 used community strings for authentication (weak security)",
      "SNMPv2c added GETBULK and improved error handling",
      "SNMPv3 introduced USM (authentication + encryption) and VACM (access control)",
      "The evolution from v1 to v3 reflects growing security requirements",
    ],
    courseOutcomes: [1, 2],
    applicationOutcomes: [
      "Configure SNMP agents on network devices for monitoring",
      "Deploy SNMPv3 with authentication and encryption for secure management",
      "Explain the security trade-offs between SNMP versions",
    ],
    skillsImproved: ["Protocol Understanding", "Security Awareness", "Configuration Management"],
  },

  "u1t8": {
    takeaways: [
      "SNMP GET retrieves a specific OID value from a device",
      "SNMP GETNEXT retrieves the next OID in lexicographic order (MIB walk)",
      "SNMP SET writes a value to a writable MIB object",
      "SNMP TRAP sends unsolicited alerts from agent to manager",
      "SNMP INFORM requires acknowledgment, providing reliable notification delivery",
    ],
    courseOutcomes: [1, 3],
    applicationOutcomes: [
      "Execute SNMP commands (GET, GETNEXT, SET) to query and configure devices",
      "Configure SNMP TRAPs and INFORMs for real-time fault notification",
      "Perform MIB walks using GETNEXT to discover all available objects",
    ],
    skillsImproved: ["CLI Proficiency", "SNMP Operations", "Real-time Monitoring"],
  },

  "u1t9": {
    takeaways: [
      "SNMP CLI commands: snmpget, snmpwalk, snmpset, snmptrapd",
      "Community strings (-c) and SNMPv3 flags (-v3, -u, -a, -A, -x, -X)",
      "Practical debugging using CLI tools to verify SNMP connectivity",
      "OID format: numeric (1.3.6.1.2.1.1.1) or symbolic (SNMPv2-MIB::sysDescr)",
      "Rate limiting and timeout configurations for production environments",
    ],
    courseOutcomes: [3],
    applicationOutcomes: [
      "Use SNMP CLI tools to diagnose device connectivity and configuration issues",
      "Write scripts to automate SNMP data collection from multiple devices",
      "Parse and interpret SNMP responses for network health assessment",
    ],
    skillsImproved: ["Command-Line Operations", "Scripting Foundation", "Diagnostic Skills"],
  },

  "u1t10": {
    takeaways: [
      "RMON defines remote monitoring MIB for distributed network analysis",
      "RMON groups: Statistics, History, Alarm, Host, Matrix, Filter, Capture, Event",
      "RMON probes collect data locally and report to the NMS, reducing polling overhead",
      "RMON1 focuses on Layer 1-2; RMON2 extends to Layer 3-7",
      "RMON enables proactive threshold-based alarming and traffic analysis",
    ],
    courseOutcomes: [3],
    applicationOutcomes: [
      "Deploy RMON probes for distributed traffic monitoring",
      "Configure RMON alarms and events for threshold-based alerting",
      "Analyze RMON statistics for capacity planning and troubleshooting",
    ],
    skillsImproved: ["Distributed Monitoring", "Traffic Analysis", "Threshold Configuration"],
  },

  "u1t11": {
    takeaways: [
      "SNMP security threats: community string sniffing, MIB walking, DoS",
      "USM (User-based Security Model) provides authentication (MD5/SHA) and encryption (DES/AES)",
      "VACM (View-based Access Control) restricts which OIDs each user can access",
      "Best practices: disable SNMPv1/v2c, use SNMPv3, change default communities",
      "SNMP over TLS (STuMP) provides transport-layer security as an alternative",
    ],
    courseOutcomes: [3],
    applicationOutcomes: [
      "Harden SNMP configurations on production network devices",
      "Implement SNMPv3 authentication and encryption policies",
      "Audit SNMP security posture and remediate vulnerabilities",
    ],
    skillsImproved: ["Security Hardening", "Risk Assessment", "Policy Implementation"],
  },

  "u1t12": {
    takeaways: [
      "SNMP limitations: partial configuration support, no rollback, polling overhead",
      "RFC 3535 documented operator requirements that SNMP could not meet",
      "Configuration management needs: transactional commit, rollback, full-device config",
      "These limitations motivated the development of NETCONF/YANG",
      "The transition from SNMP to NETCFG represents a paradigm shift in network management",
    ],
    courseOutcomes: [3],
    applicationOutcomes: [
      "Articulate why modern networks are moving beyond SNMP for configuration management",
      "Identify scenarios where SNMP is sufficient vs where NETCONF is required",
      "Understand the business drivers for adopting model-driven management",
    ],
    skillsImproved: ["Critical Analysis", "Technology Evaluation", "Strategic Thinking"],
  },

  /* ══════════════════════════════════════════════════════════════════════
     UNIT II — Model-Driven Management and Protocols
  ══════════════════════════════════════════════════════════════════════ */

  "u2t1": {
    takeaways: [
      "NETCONF uses XML-based RPC for configuration retrieval and deployment",
      "Four layers: Transport (SSH/TLS), RPC, Configuration, Datastore",
      "Candidate, Running, Startup datastores enable safe configuration changes",
      "edit-config, get-config, commit, discard-changes are core RPC operations",
      "NETCONF provides transactional semantics missing from SNMP",
    ],
    courseOutcomes: [2, 4],
    applicationOutcomes: [
      "Establish NETCONF sessions to network devices for configuration management",
      "Use candidate datastore for staging and validating configuration changes",
      "Perform transactional configuration commits with rollback capability",
    ],
    skillsImproved: ["Protocol Implementation", "Transactional Thinking", "Configuration Management"],
  },

  "u2t2": {
    takeaways: [
      "YANG is a data modeling language for defining configuration and state data",
      "Container, leaf, list, leaf-list are fundamental data nodes",
      "Grouping and uses enable reusable data definitions",
      "Augment extends existing models; deviation documents non-compliance",
      "YANG models define RPCs and notifications for device interaction",
    ],
    courseOutcomes: [4],
    applicationOutcomes: [
      "Read and understand YANG models for network devices",
      "Write custom YANG models to define new configuration data structures",
      "Use YANG models to validate device configurations before deployment",
    ],
    skillsImproved: ["Data Modeling", "Schema Design", "Model-Driven Thinking"],
  },

  "u2t3": {
    takeaways: [
      "YANG data types: string, enumeration, boolean, uint32, union, identityref",
      "Constraints: must, when, range, pattern, length, mandatory",
      "Config true/false distinguishes configuration from state data",
      "Rpc and notification defines device operations and event streams",
      "Features and if-feature enable conditional model compilation",
    ],
    courseOutcomes: [4],
    applicationOutcomes: [
      "Use YANG types and constraints to enforce data validity in device configurations",
      "Identify config vs state data in YANG models for proper NETCONF operations",
      "Leverage YANG features for multi-version device compatibility",
    ],
    skillsImproved: ["Type System Understanding", "Constraint Design", "Schema Validation"],
  },

  "u2t4": {
    takeaways: [
      "pyang is the reference YANG parser and validator",
      "YANG tree diagrams provide human-readable model visualization",
      "YANG dump formats: tree, yang, hello, stub",
      "Schema mounting allows models to reference external datastores",
      "Model validation ensures consistency before device deployment",
    ],
    courseOutcomes: [4],
    applicationOutcomes: [
      "Validate YANG models using pyang for syntax and semantic correctness",
      "Generate tree diagrams to communicate model structure to stakeholders",
      "Use yang dump to convert models between formats for toolchain integration",
    ],
    skillsImproved: ["Tool Proficiency", "Model Validation", "Technical Documentation"],
  },

  "u2t5": {
    takeaways: [
      "OpenConfig provides vendor-neutral YANG models for network configuration",
      "Models cover: interfaces, BGP, OSPF, telemetry, QoS, ACLs",
      "OpenConfig models are deployed alongside vendor-native models",
      "gNMI (gRPC Network Management Interface) complements OpenConfig for streaming",
      "OpenConfig adoption enables multi-vendor configuration consistency",
    ],
    courseOutcomes: [2, 4],
    applicationOutcomes: [
      "Use OpenConfig models for multi-vendor network configuration",
      "Deploy OpenConfig-compliant devices for consistent policy enforcement",
      "Compare OpenConfig vs vendor-native models for specific use cases",
    ],
    skillsImproved: ["Vendor-Neutral Thinking", "Multi-vendor Management", "Standards Application"],
  },

  "u2t6": {
    takeaways: [
      "RESTCONF uses HTTP methods mapped to NETCONF operations",
      "GET→get-config, POST→edit-config, PUT→replace, DELETE→delete-config",
      "JSON and XML encoding of YANG-modeled data over HTTP",
      "RESTCONF provides a familiar RESTful interface for web developers",
      "Authentication via OAuth 2.0, API keys, or basic auth",
    ],
    courseOutcomes: [4],
    applicationOutcomes: [
      "Build REST APIs for network management using RESTCONF",
      "Integrate network configuration into web applications using REST APIs",
      "Implement authentication and authorization for network API access",
    ],
    skillsImproved: ["REST API Design", "Web Integration", "API Security"],
  },

  "u2t7": {
    takeaways: [
      "NETCONF capabilities exchanged during session establishment",
      "Hello exchange: client and server advertise supported YANG models",
      "Base:1.0 capability enables candidate datastore and confirmed commit",
      "Notification capability enables YANG-Push event subscriptions",
      "Writable-running, rollback-on-error are optional capabilities",
    ],
    courseOutcomes: [4],
    applicationOutcomes: [
      "Negotiate NETCONF capabilities between management systems and devices",
      "Determine device-supported features from capability exchange",
      "Design management workflows based on available NETCONF capabilities",
    ],
    skillsImproved: ["Protocol Negotiation", "Feature Detection", "Session Management"],
  },

  "u2t8": {
    takeaways: [
      "NETCONF edit-config modes: merge (default), replace, create, delete",
      "Candidate datastore: staging area for validating changes before commit",
      "Confirmed commit: automatic rollback if not confirmed within timeout",
      "discard-changes reverts candidate to running configuration",
      "copy-config enables full configuration backup and restore",
    ],
    courseOutcomes: [4],
    applicationOutcomes: [
      "Stage configuration changes in candidate datastore before production commit",
      "Use confirmed commit for safe remote configuration changes",
      "Implement configuration backup and restore workflows using copy-config",
    ],
    skillsImproved: ["Safe Configuration Practices", "Change Management", "Rollback Procedures"],
  },

  "u2t9": {
    takeaways: [
      "NETCONF notifications: event stream subscription and delivery",
      "YANG-Push: on-change and periodic subscription for streaming telemetry",
      "RFC 8639 defines YANG Notification transport over NETCONF/RESTCONF",
      "Event filtering using YANG XPath expressions",
      "Replay capability for historical event delivery",
    ],
    courseOutcomes: [4],
    applicationOutcomes: [
      "Subscribe to YANG-Push notifications for real-time network events",
      "Configure event filters to receive only relevant notifications",
      "Implement replay mechanisms for event history analysis",
    ],
    skillsImproved: ["Event-Driven Architecture", "Streaming Telemetry", "Subscription Management"],
  },

  "u2t10": {
    takeaways: [
      "NETCONF over SSH: transport selection and key management",
      "NETCONF over TLS: certificate-based authentication",
      "Connection management: session lifecycle, keep-alive, timeout",
      "Concurrent sessions and session limits on network devices",
      "Logging and auditing of NETCONF sessions for compliance",
    ],
    courseOutcomes: [4],
    applicationOutcomes: [
      "Establish secure NETCONF sessions using SSH or TLS transport",
      "Manage NETCONF session lifecycle in production environments",
      "Implement session logging for audit trails and compliance",
    ],
    skillsImproved: ["Transport Security", "Session Management", "Audit Compliance"],
  },

  /* ══════════════════════════════════════════════════════════════════════
     UNIT III — Alarm Lifecycle Management
  ══════════════════════════════════════════════════════════════════════ */

  "u3t1": {
    takeaways: [
      "Alarm lifecycle: Detection → Notification → Acknowledgment → Triage → Resolution → Closure",
      "Alarm severity levels: Critical, Major, Minor, Warning, Informational",
      "Alarm states: active, acknowledged, cleared, shelved, suppressed",
      "Root cause analysis distinguishes primary alarms from derived alarms",
      "SLA-driven escalation ensures timely response to critical faults",
    ],
    courseOutcomes: [5],
    applicationOutcomes: [
      "Manage the complete alarm lifecycle from detection to closure",
      "Classify alarms by severity and apply appropriate response procedures",
      "Implement alarm escalation workflows based on SLA requirements",
    ],
    skillsImproved: ["Incident Management", "Prioritization", "SLA Awareness"],
  },

  "u3t2": {
    takeaways: [
      "Alarm correlation: temporal, spatial, and causal analysis",
      "Alarm suppression reduces noise by hiding derived alarms",
      "Root cause identification from alarm storms using topology awareness",
      "Alarm flood management: rate limiting, grouping, deduplication",
      "Impact analysis determines which services/users are affected",
    ],
    courseOutcomes: [5],
    applicationOutcomes: [
      "Implement alarm correlation rules to identify root causes from alarm floods",
      "Configure alarm suppression to reduce operator fatigue",
      "Perform impact analysis to prioritize fault resolution efforts",
    ],
    skillsImproved: ["Root Cause Analysis", "Pattern Recognition", "Noise Reduction"],
  },

  "u3t3": {
    takeaways: [
      "FCAPS Fault Management: detection, diagnosis, correction, prevention",
      "Event vs alarm: event is the raw notification; alarm is the managed fault",
      "Alarm Shelving: temporary suppression during planned maintenance",
      "Alarm Clearing: automatic vs manual clearing based on device state",
      "Alarm history and audit trails for compliance and trending",
    ],
    courseOutcomes: [5],
    applicationOutcomes: [
      "Implement fault management workflows following FCAPS principles",
      "Use alarm shelving during maintenance windows to prevent false alarms",
      "Analyze alarm history for capacity planning and recurring fault patterns",
    ],
    skillsImproved: ["FCAPS Application", "Maintenance Planning", "Compliance Management"],
  },

  "u3t4": {
    takeaways: [
      "SNMP TRAP: unsolicited, fire-and-forget, no delivery guarantee",
      "SNMP INFORM: reliable notification with manager acknowledgment",
      "Trap forwarding and aggregation for multi-domain networks",
      "Trap filtering and severity-based routing in the NMS",
      "Notification throttling to prevent manager overload",
    ],
    courseOutcomes: [5],
    applicationOutcomes: [
      "Configure TRAP and INFORM generation on network devices",
      "Implement trap forwarding rules for distributed NMS architectures",
      "Design notification routing to ensure critical alarms reach operators",
    ],
    skillsImproved: ["Notification Design", "Reliability Engineering", "Load Management"],
  },

  "u3t5": {
    takeaways: [
      "Polling vs event-driven monitoring trade-offs",
      "Polling interval optimization: granularity vs overhead",
      "Threshold-based alarm generation from polled metrics",
      "Distributed polling: NMS → EMS → Agent hierarchy",
      "Polling gap problem: short-duration failures missed between polls",
    ],
    courseOutcomes: [5],
    applicationOutcomes: [
      "Design polling strategies balancing monitoring granularity with network overhead",
      "Configure threshold-based alarms for proactive fault detection",
      "Combine polling with TRAPs for comprehensive monitoring coverage",
    ],
    skillsImproved: ["Monitoring Strategy", "Threshold Design", "Overhead Optimization"],
  },

  "u3t6": {
    takeaways: [
      "NMS-to-NMS integration: multi-vendor alarm federation",
      "Standardized alarm APIs: TM Forum TMF642 Alarm Management API",
      "Alarm data models: ITU-T X.733, TM Forum, 3GPP alarm IRP",
      "Alarm northbound interface for OSS/BSS integration",
      "RESTful alarm APIs for modern web-based management applications",
    ],
    courseOutcomes: [4, 5],
    applicationOutcomes: [
      "Integrate multiple NMS instances for unified alarm management",
      "Implement alarm APIs for third-party system integration",
      "Design alarm data models that comply with industry standards",
    ],
    skillsImproved: ["API Integration", "Multi-system Design", "Standards Compliance"],
  },

  "u3t7": {
    takeaways: [
      "Alarm correlation algorithms: rule-based, topology-based, ML-based",
      "Temporal correlation: alarms within time windows share root cause",
      "Spatial correlation: alarms from same network segment are related",
      "Dependency correlation: cascading alarms follow dependency chains",
      "ML-based correlation: clustering and anomaly detection for pattern matching",
    ],
    courseOutcomes: [5],
    applicationOutcomes: [
      "Implement rule-based alarm correlation for known fault patterns",
      "Use topology data for spatial alarm correlation",
      "Evaluate ML-based correlation tools for complex alarm environments",
    ],
    skillsImproved: ["Algorithm Understanding", "Machine Learning Awareness", "Correlation Analysis"],
  },

  "u3t8": {
    takeaways: [
      "REST API alarm operations: GET (query), POST (acknowledge), PATCH (update)",
      "Alarm query parameters: severity, time range, source, state",
      "Pagination and filtering for large alarm datasets",
      "Webhook subscriptions for real-time alarm delivery",
      "Error handling and retry logic for alarm API consumers",
    ],
    courseOutcomes: [5],
    applicationOutcomes: [
      "Build REST API clients for alarm query and management",
      "Implement webhook receivers for real-time alarm notifications",
      "Design alarm dashboards using REST API data sources",
    ],
    skillsImproved: ["REST API Consumption", "Web Integration", "Data Visualization"],
  },

  "u3t9": {
    takeaways: [
      "Incident management: formal process for handling network faults",
      "Ticket lifecycle: creation → assignment → investigation → resolution → closure",
      "Escalation tiers: L1 (NOC) → L2 (Engineering) → L3 (Architecture)",
      "Knowledge base: documenting solutions for recurring issues",
      "Post-incident review: root cause analysis and process improvement",
    ],
    courseOutcomes: [5],
    applicationOutcomes: [
      "Implement structured incident management workflows in NOC environments",
      "Configure escalation rules and SLA-driven alerting",
      "Build knowledge bases from resolved incidents for future reference",
    ],
    skillsImproved: ["Process Management", "Workflow Design", "Continuous Improvement"],
  },

  "u3t10": {
    takeaways: [
      "NMS health monitoring: CPU, memory, disk, network utilization",
      "NMS redundancy: active-standby, active-active, geographic distribution",
      "Database management: alarm storage, archival, and retention policies",
      "Capacity planning: forecasting NMS growth requirements",
      "NMS performance metrics: alarm processing rate, API response time",
    ],
    courseOutcomes: [5],
    applicationOutcomes: [
      "Monitor NMS platform health and performance metrics",
      "Design NMS high-availability architectures for carrier-grade deployments",
      "Plan NMS capacity based on network growth projections",
    ],
    skillsImproved: ["Platform Management", "High Availability Design", "Capacity Planning"],
  },

  /* ══════════════════════════════════════════════════════════════════════
     UNIT IV — SDN, Network Observability, and Advanced Network Management
  ══════════════════════════════════════════════════════════════════════ */

  "u4t1": {
    takeaways: [
      "SDN separates control plane (logic) from data plane (forwarding)",
      "Three-layer architecture: Data Plane → Control Plane → Application Plane",
      "SDN controller is the central intelligence managing network behavior",
      "Northbound APIs expose network capabilities to applications",
      "Southbound APIs (OpenFlow, NETCONF) control network devices",
    ],
    courseOutcomes: [6],
    applicationOutcomes: [
      "Explain SDN architecture and its advantages over traditional networking",
      "Identify use cases where SDN provides clear benefits",
      "Describe how SDN controllers manage network behavior programmatically",
    ],
    skillsImproved: ["Architecture Understanding", "Programmable Networking", "Abstraction Thinking"],
  },

  "u4t2": {
    takeaways: [
      "SDN controller functions: topology discovery, path computation, policy enforcement",
      "Route computation: shortest path, constrained routing, traffic engineering",
      "Switch management: flow table programming, group tables, meter tables",
      "Rollback: reverting controller state to handle failures or bad changes",
      "Controller clustering for high availability and scalability",
    ],
    courseOutcomes: [6],
    applicationOutcomes: [
      "Deploy and configure SDN controllers for network automation",
      "Implement traffic engineering policies using controller APIs",
      "Design controller rollback strategies for fault tolerance",
    ],
    skillsImproved: ["Controller Management", "Traffic Engineering", "Fault Tolerance"],
  },

  "u4t3": {
    takeaways: [
      "ONOS: open-source SDN controller for service providers",
      "OpenDaylight: modular SDN controller based on OSGi/Karaf",
      "Controller selection criteria: scalability, protocol support, ecosystem",
      "Intent-based networking: abstracting network policies from device configuration",
      "Multi-controller architectures for large-scale deployments",
    ],
    courseOutcomes: [6],
    applicationOutcomes: [
      "Deploy and operate open-source SDN controllers",
      "Evaluate controller platforms based on deployment requirements",
      "Implement intent-based networking policies for simplified management",
    ],
    skillsImproved: ["Platform Evaluation", "Deployment Skills", "Intent-Based Thinking"],
  },

  "u4t4": {
    takeaways: [
      "OpenFlow protocol: controller-to-switch communication standard",
      "Flow tables: match fields, counters, instructions (actions)",
      "Group tables: multicast, fast failover, load balancing",
      "Meter tables: rate limiting and QoS enforcement",
      "OpenFlow versions: 1.0 → 1.3 → 1.5 with increasing capabilities",
    ],
    courseOutcomes: [6],
    applicationOutcomes: [
      "Configure OpenFlow flow tables for packet forwarding policies",
      "Implement group tables for multicast and load balancing scenarios",
      "Design QoS policies using OpenFlow meter tables",
    ],
    skillsImproved: ["Protocol Implementation", "Flow-Based Networking", "QoS Design"],
  },

  "u4t5": {
    takeaways: [
      "SDN use cases: campus networks, data centers, WAN, carriers",
      "SD-WAN: software-defined wide area networking for enterprise connectivity",
      "Network function chaining: chaining VNFs in a specific order",
      "Data center networking: leaf-spine, overlay networks, virtual switching",
      "Carrier-grade SDN: multi-domain, multi-vendor orchestration",
    ],
    courseOutcomes: [4, 6],
    applicationOutcomes: [
      "Design SDN solutions for campus, data center, and WAN environments",
      "Implement SD-WAN deployments for enterprise connectivity",
      "Plan network function chains using VNF orchestration",
    ],
    skillsImproved: ["Solution Design", "Environment Assessment", "Use Case Analysis"],
  },

  "u4t6": {
    takeaways: [
      "NFV architecture: NFVI (compute, storage, networking) → VNF → MANO",
      "VNF lifecycle: instantiation, scaling, healing, updating, termination",
      "Service chains: chaining VNFs for end-to-end service delivery",
      "NFV use cases: virtual firewalls, virtual load balancers, vBNG",
      "ETSI MANO: NFVO, VNFM, VIM functional blocks",
    ],
    courseOutcomes: [4, 6],
    applicationOutcomes: [
      "Deploy VNFs on NFVI infrastructure using MANO orchestration",
      "Design service chains combining multiple VNFs for network services",
      "Manage VNF lifecycle operations including scaling and healing",
    ],
    skillsImproved: ["NFV Operations", "Service Design", "Orchestration Skills"],
  },

  "u4t7": {
    takeaways: [
      "OpenStack as VIM: Nova (compute), Neutron (networking), Cinder (storage)",
      "Container orchestration: Kubernetes for lightweight VNF deployment",
      "Edge computing: distributing VNFs closer to end users",
      "Resource optimization: bin-packing, NUMA-aware placement",
      "Hybrid deployments: VM-based and container-based VNFs coexisting",
    ],
    courseOutcomes: [4, 6],
    applicationOutcomes: [
      "Deploy VNFs on OpenStack and Kubernetes platforms",
      "Design edge computing architectures using distributed VNFs",
      "Optimize VNF resource utilization through proper placement strategies",
    ],
    skillsImproved: ["Cloud Platform Skills", "Container Orchestration", "Edge Architecture"],
  },

  "u4t8": {
    takeaways: [
      "Network telemetry: streaming, on-change, periodic subscription models",
      "gNMI: gRPC-based network management interface for streaming telemetry",
      "gRPC: high-performance RPC framework for management plane communication",
      "Telemetry vs SNMP polling: push vs pull, granularity, overhead",
      "Time-series databases (InfluxDB, Prometheus) for telemetry storage",
    ],
    courseOutcomes: [4, 5, 6],
    applicationOutcomes: [
      "Configure streaming telemetry subscriptions on network devices",
      "Deploy gNMI/gRPC-based telemetry collection pipelines",
      "Design time-series data storage and query architectures",
    ],
    skillsImproved: ["Streaming Telemetry", "gRPC Proficiency", "Data Pipeline Design"],
  },

  "u4t9": {
    takeaways: [
      "Data collection: SNMP, streaming telemetry, log aggregation, flow data",
      "Data pipelines: ingestion → transformation → storage → visualization",
      "Visualization: dashboards, heatmaps, topology maps, trend charts",
      "Alerting: threshold-based, anomaly-based, ML-driven alert generation",
      "Data retention: hot/warm/cold storage strategies for cost optimization",
    ],
    courseOutcomes: [4, 6],
    applicationOutcomes: [
      "Build end-to-end data collection pipelines for network observability",
      "Design dashboards for real-time network health visualization",
      "Implement tiered storage strategies for long-term data retention",
    ],
    skillsImproved: ["Data Engineering", "Dashboard Design", "Storage Architecture"],
  },

  "u4t10": {
    takeaways: [
      "AI/ML in network management: anomaly detection, prediction, optimization",
      "Predictive analytics: forecasting failures before they occur",
      "Root cause analysis using ML clustering and correlation",
      "Intent-based networking: translating business intent to network config",
      "Closed-loop automation: detect → analyze → decide → act cycle",
    ],
    courseOutcomes: [6],
    applicationOutcomes: [
      "Apply ML techniques for network anomaly detection",
      "Build predictive models for network failure prediction",
      "Implement closed-loop automation for self-healing networks",
    ],
    skillsImproved: ["AI/ML Application", "Predictive Analytics", "Automation Design"],
  },

  "u4t11": {
    takeaways: [
      "Service assurance: ensuring network services meet defined SLAs",
      "SLA metrics: availability, latency, jitter, packet loss, throughput",
      "Proactive monitoring: detecting issues before customers are impacted",
      "Synthetic monitoring: active probing for service quality measurement",
      "Dashboards and reporting for SLA compliance tracking",
    ],
    courseOutcomes: [6],
    applicationOutcomes: [
      "Define and monitor SLA metrics for network services",
      "Implement synthetic monitoring for proactive service quality assurance",
      "Build SLA compliance dashboards for management reporting",
    ],
    skillsImproved: ["SLA Management", "Service Quality Monitoring", "Reporting Skills"],
  },

  "u4t12": {
    takeaways: [
      "Network slicing: creating multiple virtual networks on shared physical infrastructure",
      "ONAP framework: Design, Runtime, and Analytics for network service orchestration",
      "Service orchestration: coordinating VNFs and resources for end-to-end services",
      "Closed-loop automation: real-time monitoring and policy-driven adjustments",
      "Future trends: 5G slicing, intent-based management, AI-driven operations",
    ],
    courseOutcomes: [6],
    applicationOutcomes: [
      "Design network slice templates using ONAP modeling tools",
      "Orchestrate end-to-end network services using ONAP runtime",
      "Implement closed-loop automation for slice lifecycle management",
    ],
    skillsImproved: ["Service Orchestration", "Network Slicing", "End-to-End Design"],
  },
};
