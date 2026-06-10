export interface ProjectData {
  id: string;
  unit: number;
  title: string;
  objective: string;
  outcome: string;
  cos: number[];
  setup: string;
  instructions: string;
  deliverables: string[];
  tools: string[];
}

export const projects: ProjectData[] = [
  // ── Unit I: Introduction to Network Management (15 projects) ──
  {
    id: "p1", unit: 1,
    title: "Multi-Threaded SNMP Poller with Auto-Discovery Engine",
    objective: "Build a concurrent SNMP polling engine that auto-discovers network devices and collects real-time MIB variables across multiple threads.",
    outcome: "Master high-performance SNMP polling, thread-safe MIB walks, and device fingerprinting for large-scale networks.",
    cos: [1, 3, 4],
    setup: "A virtual lab with 10+ emulated SNMP-enabled devices (routers, switches, servers) using GNS3/EVE-NG. Ubuntu 22.04 host with net-snmp and Java/Python SDK.",
    instructions: "Implement a discovery phase using SNMPv2c community sweeps on subnets. For each discovered device, spawn a worker thread that polls a configurable MIB subtree (e.g., interfaces, system). Store results in a time-series DB (InfluxDB). Handle SNMP timeouts, retries, and backpressure. Expose a REST API to query current/ historical values. Add a web dashboard showing per-device health and poll latency.",
    deliverables: ["Source code with multithreaded poller and auto-discovery", "Docker Compose setup for the full stack (poller + DB + API + UI)", "Performance benchmark report (polls/sec vs thread count)", "Documentation of MIB subtree configurations supported"],
    tools: ["Python/Java", "net-snmp / SNMP4J", "InfluxDB / TimescaleDB", "Grafana", "Docker"]
  },
  {
    id: "p2", unit: 1,
    title: "Custom MIB Compiler and Interactive Browser",
    objective: "Develop a tool that parses SMIv1/v2 MIB modules into an internal representation and provides an interactive tree browser with search and live value lookup.",
    outcome: "Deep understanding of MIB structure, SMI syntax, OID tree navigation, and cross-MIB dependency resolution.",
    cos: [1, 2, 3],
    setup: "Collection of 50+ standard (RFC1213, IF-MIB, SNMPv2-MIB) and private enterprise MIB files. Linux environment with ANTLR or PyParsing for grammar development.",
    instructions: "Write a lexer/parser for SMIv1/v2 that constructs an AST. Resolve IMPORT dependencies across MIB modules. Build an OID tree with textual conventions, object types, traps, and compliance statements. Create an interactive TUI or web browser that lets users search by name/OID, view object metadata, and trigger SNMP GET/GETNEXT queries for live values. Support MIB module upload and validation.",
    deliverables: ["MIB compiler with SMIv1/v2 grammar", "Interactive browser with search and live SNMP query", "Test suite with 20+ MIB modules", "User guide with examples of adding custom MIBs"],
    tools: ["Python (PyParsing/ANTLR)", "net-snmp library", "Flask/FastAPI", "React frontend (optional)"]
  },
  {
    id: "p3", unit: 1,
    title: "SNMPv3 Security Analyzer and Audit Toolkit",
    objective: "Create a security auditing tool that tests SNMPv3 configurations across devices, detects weak auth/priv settings, and recommends hardened policies.",
    outcome: "Expert-level understanding of SNMPv3 USM, VACM, key localization, and cryptographic profile assessment in production networks.",
    cos: [1, 3, 4],
    setup: "10+ SNMPv3-enabled devices with varied security levels (noAuthNoPriv, authNoPriv, authPriv). Wireshark for traffic inspection. Lab network with isolated management VLAN.",
    instructions: "Develop a scanner that probes each device's SNMPv3 engine ID, supported security levels, and authentication/privacy protocols. Attempt dictionary attacks on weak community-to-USM mappings. Verify VACM view access controls by walking restricted subtrees. Generate a device-by-device security report scoring auth strength, encryption usage, and exposure. Recommend specific snmpd.conf hardening directives.",
    deliverables: ["SNMPv3 security scanner with probe modules", "Risk assessment report with CVE references", "Hardening playbook generator (Ansible)", "Python library for SNMPv3 security testing"],
    tools: ["Python", "pysnmp / snmpclitools", "Wireshark / tshark", "Ansible", "OpenSSL for crypto verification"]
  },
  {
    id: "p4", unit: 1,
    title: "RMON Probe Implementation for Traffic Analysis",
    objective: "Implement a software-based RMON probe that monitors Ethernet traffic, computes RMON MIB group statistics (statistics, history, alarm, host), and exposes data via SNMP.",
    outcome: "Hands-on understanding of RMON MIB groups, remote monitoring standards, and real-time traffic metric extraction.",
    cos: [1, 2, 3, 4],
    setup: "Linux host with two NICs (one mirrored port from a switch). tcpdump/libpcap for packet capture. Basic network topology with clients generating HTTP, DNS, and ICMP traffic.",
    instructions: "Use libpcap to capture packets promiscuously. Implement RMON etherStatsTable and historyControlTable by computing octets, packets, broadcast/multicast rates, CRC errors, and collision counts from raw frames. Implement hostTable tracking MAC-layer conversations. Expose collected data through a minimal SNMP agent (agent subagent) serving RMON MIB objects. Integrate with the alarm group to trigger SNMP traps on threshold breaches.",
    deliverables: ["RMON probe application with libpcap integration", "SNMP agent serving RMON MIB groups 1-3", "Real-time Grafana dashboard of RMON metrics", "Performance analysis of probe overhead vs traffic load"],
    tools: ["C/Python", "libpcap", "net-snmp agent libraries", "Grafana", "tcpreplay for load testing"]
  },
  {
    id: "p5", unit: 1,
    title: "FCAPS Compliance Verification Framework",
    objective: "Build an automated framework that audits network infrastructure against FCAPS (Fault, Configuration, Accounting, Performance, Security) maturity criteria and generates compliance scores.",
    outcome: "Comprehensive ability to map real network management operations to the FCAPS model and identify gaps in operational maturity.",
    cos: [2, 4, 5],
    setup: "Multi-vendor lab with Cisco, Juniper, and Linux devices. Existing NMS tools (Nagios, Cacti, RANCID) for baseline metrics. Python automation environment.",
    instructions: "Define a questionnaire and automated test catalog covering each FCAPS domain (e.g., fault detection latency, config backup frequency, accounting log integrity, performance baseline deviation, security ACL coverage). Build probes that execute these tests via SNMP, NETCONF, and CLI scraping. Score each domain 0-100% and produce a radar chart. Generate a gap analysis with prioritized remediation steps. Support periodic re-audits with trend reporting.",
    deliverables: ["FCAPS compliance engine with automated probes", "Web dashboard showing radar charts and trends", "Audit report generator (PDF)", "Remediation playbook templates"],
    tools: ["Python", "SNMP/NETCONF libraries", "Apache ECharts / Chart.js", "WeasyPrint / ReportLab", "Ansible"]
  },
  {
    id: "p6", unit: 1,
    title: "Network Topology Discovery Engine via SNMP",
    objective: "Develop a topology mapper that walks SNMP MIBs (dot1dBase, ipRouteTable, lldpMIB) across discovered devices and constructs a real-time layer-2/layer-3 topology graph.",
    outcome: "Deep knowledge of SNMP MIB-based neighbor discovery, graph algorithms for topology rendering, and multi-layer network mapping.",
    cos: [1, 3, 5],
    setup: "GNS3 network with 15+ devices (switches, routers) running OSPF and STP. Each device configured with SNMPv2c/v3 and LLDP.",
    instructions: "Implement a seed-based discovery algorithm: start from a seed device, walk dot1dTpFdbTable and ipRouteTable to find neighbors, then recurse. Parse CDP/LLDP MIB tables for direct adjacency. Handle multi-vendor OID differences via a driver system. Detect loops and avoid revisiting. Build a graph with device icons, link labels (speed, VLAN), and real-time status indicators. Export GraphML and SVG.",
    deliverables: ["Topology discovery engine with SNMP crawling", "Interactive topology viewer with zoom/pan/layout", "GraphML export for external tools", "Comparison report with manual topology documentation"],
    tools: ["Python", "networkx", "SNMP libraries (pysnmp)", "pyvis / Cytoscape.js", "GNS3/EVE-NG"]
  },
  {
    id: "p7", unit: 1,
    title: "SNMP Trap Receiver with Multi-Stage Correlation Engine",
    objective: "Build a high-throughput SNMP trap receiver that correlates related traps across time, source, and type to reduce noise and identify composite incidents.",
    outcome: "Master SNMP notification handling, trap filtering, temporal correlation rules, and de-duplication in real-time event pipelines.",
    cos: [1, 3, 4, 5],
    setup: "Linux server (trap receiver). 5+ simulated device types generating traps (linkDown, authFailure, coldStart, enterprise-specific) at varying rates (10-500 traps/sec).",
    instructions: "Implement an SNMPv2c/v3 trap listener on port 162 using raw sockets. Decode and normalize incoming traps into a canonical event schema. Build a rule-based correlation engine: window-based (e.g., 5 linkDown traps in 10 sec from same device → linkFlap incident), topological (downstream device traps → root cause inference), and suppression (known maintenance window filtering). Store correlated events in Elasticsearch. Provide a real-time console for trap flood visualization.",
    deliverables: ["High-performance trap receiver with SNMP decoding", "Correlation engine with configurable rules (YAML)", "Elasticsearch storage with Kibana dashboards", "Load test report at 1000+ traps/sec sustained"],
    tools: ["Python/Go", "Elasticsearch + Kibana", "snmptrapd integration", "Kafka/RabbitMQ for buffering", "Locust for load testing"]
  },
  {
    id: "p8", unit: 1,
    title: "Historical Performance Metrics Collector with Trending",
    objective: "Create an SNMP-based historical data collector that polls key performance indicators from network devices, stores them in a time-series DB, and predicts trends using statistical models.",
    outcome: "Ability to design long-term performance monitoring systems with anomaly-aware data collection and forecasting capabilities.",
    cos: [1, 3, 4, 5],
    setup: "10+ emulated network devices with variable traffic patterns. Linux server with 500GB+ storage for historical data. Python data science stack.",
    instructions: "Define a configurable polling profile (interval, OIDs, device groups) stored in PostgreSQL. Build a scheduler that adjusts polling frequency based on metric volatility (dynamic polling). Implement data interpolation for missing samples and outlier rejection. Store in InfluxDB with retention policies. Apply STL decomposition and Holt-Winters forecasting on stored data to detect seasonal patterns and predict future utilization. Surface predictions with confidence bands in Grafana.",
    deliverables: ["Adaptive polling collector with scheduler", "Time-series data pipeline with data cleaning", "Forecasting engine with STL/Holt-Winters", "Grafana dashboards with prediction overlays", "Accuracy evaluation across 30+ metrics"],
    tools: ["Python", "InfluxDB / TimescaleDB", "Grafana", "statsmodels / Prophet", "PostgreSQL"]
  },
  {
    id: "p9", unit: 1,
    title: "SNMP-Based SLA Monitoring and Verification System",
    objective: "Design and implement an SLA monitoring framework that measures, verifies, and reports on service-level agreements using SNMP-collected metrics from customer-facing network segments.",
    outcome: "Practical expertise in translating SLA contracts to measurable MIB objects, threshold-based compliance tracking, and penalty calculation.",
    cos: [1, 3, 4, 5],
    setup: "Emulated MPLS/VPN network with 5 customer sites. Each site has CE routers with SNMPv3 enabled. Traffic generators producing variable loads.",
    instructions: "Define SLA parameters (latency < 50ms, availability > 99.9%, throughput > 1Gbps, packet loss < 0.1%) as computable MIB expressions. Implement a polling engine that measures these at configurable intervals. Compute rolling compliance windows (hourly, daily, monthly). Generate SLA violation events when thresholds are breached. Build a verification module that cross-checks SNMP values with active probes (ICMP, iperf). Produce monthly SLA reports with penalty calculations.",
    deliverables: ["SLA parameter definition language and parser", "Compliance monitoring engine with threshold evaluation", "Active-probe cross-verification module", "Monthly SLA report generator (PDF)", "Real-time SLA compliance dashboard"],
    tools: ["Python", "SNMP4J/pysnmp", "iperf3 / mtr", "PostgreSQL + Grafana", "ReportLab / WeasyPrint"]
  },
  {
    id: "p10", unit: 1,
    title: "Multi-Vendor Configuration Backup and Versioning System",
    objective: "Develop a backup engine that automatically archives device configurations via SNMP (config MIBs), tracks revisions, and performs differential analysis between versions.",
    outcome: "Understanding of device configuration storage via SNMP, configuration management best practices, and change-impact analysis.",
    cos: [1, 3, 4],
    setup: "Mix of Cisco IOS, Juniper JUNOS, and Linux netconf-enabled devices in GNS3. Central backup server with version control (Git). Daily config changes simulated via scripts.",
    instructions: "For SNMP-enabled devices, retrieve configs via the dot11configMIB or CISCO-CONFIG-MAN-MIB. For NETCONF devices, use <get-config>. Store each backup as a text file in a Git repository with device name and timestamp as commit metadata. Implement a diff engine that highlights syntactic and semantic changes (e.g., access-list rule added, BGP neighbor removed). Generate impact analysis: 'this change affects 3 customer VPNs'. Build a restore verification: validate config syntax before deploying.",
    deliverables: ["Multi-protocol backup collector (SNMP + NETCONF + CLI)", "Git-based revision control with rich commit metadata", "Semantic diff analysis engine", "Restore validation sandbox", "Dashboard showing backup coverage and freshness"],
    tools: ["Python", "GitPython", "SNMP/NETCONF libraries", "Jinja2 for config parsing", "GNS3"]
  },
  {
    id: "p11", unit: 1,
    title: "Real-Time Network Mapping with LLDP/CDP via SNMP",
    objective: "Build a dynamic network map that discovers and visualizes layer-2 adjacencies by polling LLDP and CDP MIBs across devices, updating in real time as topology changes.",
    outcome: "Proficiency in LLDP/CDP MIB object usage, event-driven topology updates, and real-time network visualization techniques.",
    cos: [1, 3, 5],
    setup: "GNS3 lab with 10+ switches in a spanning-tree topology. LLDP enabled globally. A script introduces link failures and recoveries every 30 seconds.",
    instructions: "Discover initial topology by polling lldpRemTable and cdpCacheTable from each device. Create a graph with devices as nodes and adjacencies as edges. Subscribe to SNMP traps (lldpRemTableChange, cdpCacheChange) for event-driven updates. When a trap arrives, re-poll only the affected device's neighbor tables. Update the visualization in real time with animation (links turning red on failure, green on recovery). Support manual layout and auto-layout modes.",
    deliverables: ["LLDP/CDP polling engine with event-driven updates", "Real-time topology visualizer with animated transitions", "Change log recording all topology events", "Performance comparison: polling vs event-driven approaches"],
    tools: ["Python", "LLDP-MIB / CDP-MIB", "D3.js / vis.js", "WebSocket for real-time updates", "GNS3"]
  },
  {
    id: "p12", unit: 1,
    title: "SNMP Anomaly Detection System Using Statistical and ML Methods",
    objective: "Design an anomaly detection pipeline that processes SNMP time-series data, applies statistical and machine learning models to identify deviations, and triggers automated responses.",
    outcome: "Ability to combine network management data collection with modern anomaly detection techniques for proactive network operations.",
    cos: [1, 3, 4, 5],
    setup: "14-day SNMP data archive from 10 devices (50+ metrics). Linux server with GPU support for ML models. Python ML stack (scikit-learn, PyTorch).",
    instructions: "Ingest historical SNMP data and extract features (mean, variance, entropy, autocorrelation) per metric per sliding window. Implement statistical detectors: Z-score, moving average deviation, CUSUM. Train an unsupervised autoencoder on normal traffic patterns; flag reconstruction error above threshold. Build an ensemble detector that combines statistical and ML signals. Implement automated response: when anomaly score exceeds threshold, trigger an SNMP set to reconfigure a device or send an alert. Evaluate precision/recall on a labeled test set.",
    deliverables: ["Feature extraction pipeline from SNMP data", "Statistical detector suite (Z-score, CUSUM, MA)", "Autoencoder-based ML anomaly detector", "Automated response handler module", "Evaluation report with ROC curves"],
    tools: ["Python", "scikit-learn / PyTorch", "pandas / numpy", "InfluxDB", "Grafana"]
  },
  {
    id: "p13", unit: 1,
    title: "EMS-NMS Integration Simulator with Multi-Vendor Abstraction",
    objective: "Create a simulation platform where multiple Element Management Systems (EMS) report to a unified NMS, abstracting vendor-specific interfaces into a common model.",
    outcome: "Real-world understanding of EMS-NMS hierarchy, mediation layers, vendor abstraction, and northbound interface design.",
    cos: [2, 4, 5],
    setup: "3 simulated EMS systems (Cisco, Huawei, Nokia) each managing 5-10 virtual devices. Each EMS exposes a different interface: SNMP, REST, and CLI. Common NMS server.",
    instructions: "Implement three EMS simulators that generate alarm, performance, and inventory data in their native format. Build a mediation layer with adapters that normalize each EMS's data into a common information model (based on TMForum SID). Create the NMS that receives normalized data via a northbound REST API. Implement data aggregation: show consolidated alarm view, unified inventory, and cross-EMS performance comparison. Handle EMS connectivity loss with buffering and replay.",
    deliverables: ["Three EMS simulators with distinct interfaces", "Mediation layer with pluggable adapters", "Unified NMS with consolidated views", "Adapter SDK for adding new vendors", "Integration test harness"],
    tools: ["Python/Java", "Flask/FastAPI", "Docker for EMS containers", "PostgreSQL", "Apache Kafka for mediation bus"]
  },
  {
    id: "p14", unit: 1,
    title: "SNMP MIB Walker with Differential Change Analysis",
    objective: "Build an intelligent MIB walker that periodically scans OID subtrees across devices, stores baselines, and computes differential reports highlighting changes in configuration, performance, or state.",
    outcome: "Advanced SNMP bulk-data retrieval techniques, change management automation, and delta-based monitoring strategies.",
    cos: [1, 3, 4],
    setup: "5-8 network devices with diverse SNMP agents. Automated change injector making random configuration/state changes every few minutes. Large MIB subtree for performance testing.",
    instructions: "Implement GETBULK with adaptive max-repetitions to walk large MIB tables efficiently. For each device/OID combination, maintain a hash-based baseline in a local database. On each subsequent walk, compute a semantic diff: detect added/deleted/modified rows, value changes, and counter resets. Classify changes (cosmetic, threshold-crossing, state-transition) and assign severity. Generate a human-readable change report with before/after values. Support scheduled walks and on-demand walk for specific OIDs.",
    deliverables: ["Per-device MIB walker with adaptive GETBULK", "Baseline storage and hash comparison engine", "Semantic change classifier and severity assigner", "Differential report generator", "Scheduled walk manager"],
    tools: ["Python/Go", "net-snmp / gosnmp", "SQLite / PostgreSQL", "cron / APScheduler", "Jinja2 for reports"]
  },
  {
    id: "p15", unit: 1,
    title: "Network Inventory Management System with SNMP Discovery",
    objective: "Develop a comprehensive inventory management system that discovers, tracks, and reports hardware and software assets across a network using SNMP MIB exploration.",
    outcome: "Mastery of inventory MIBs (entityMIB, entPhysical), asset lifecycle tracking, and integration with ITSM tools for configuration management databases (CMDB).",
    cos: [1, 3, 4, 5],
    setup: "20+ emulated devices each with unique serial numbers, firmware versions, slot configurations, and module types. CMDB database server (PostgreSQL).",
    instructions: "Walk entPhysicalTable, entLogicalTable, and vendor-specific chassis MIBs to discover physical entities (chassis, modules, ports, power supplies). Build a normalized asset model with categories, dependencies, and location hierarchy. Track lifecycle events: discovered, verified, updated, retired. Implement a reconciliation engine that compares discovered inventory with the existing CMDB and flags discrepancies. Provide search, filter, and export (CSV, Excel, JSON). Add a predictive alert for EOL/EOS components.",
    deliverables: ["SNMP inventory discovery engine", "Asset lifecycle management module", "CMDB reconciliation and discrepancy reporter", "Search/filter/export UI", "EOL/EOS prediction and alerting module"],
    tools: ["Python", "entityMIB processing", "PostgreSQL", "React for UI", "Apache POI / openpyxl for export"]
  },

  // ── Unit II: Model-Driven Management (15 projects) ──
  {
    id: "p16", unit: 2,
    title: "Custom YANG Module Compiler and Semantic Validator",
    objective: "Build a compiler that parses YANG 1.1 modules, constructs an abstract syntax tree, validates semantic constraints, and generates multiple output formats (schema tree, UML, documentation).",
    outcome: "Deep understanding of YANG syntax, type system, constraints (must/when), and module compilation pipeline.",
    cos: [2, 4],
    setup: "Linux environment with 30+ real YANG modules from IETF (ietf-interfaces, ietf-routing) and OpenConfig. Python development stack.",
    instructions: "Write a YANG 1.1 parser (using lark/ANTLR grammar) that produces an AST. Implement semantic validation: type range checks, leafref path resolution, must-expression XPath evaluation, unique constraint, and feature/if-feature propagation. Build a symbol table for module imports and include dependencies. Generate outputs: interactive HTML schema tree (like yang-explorer), UML class diagram (PlantUML), and Markdown documentation. Handle circular imports gracefully.",
    deliverables: ["YANG 1.1 parser with AST builder", "Semantic validator passing 95%+ of Cisco YANG test suite", "Multi-format output generator (HTML, UML, MD)", "20 YANG modules passing validation", "Performance benchmark on large modules (>5000 lines)"],
    tools: ["Python", "lark/ANTLR", "PlantUML", "Jinja2", "pyang for cross-validation"]
  },
  {
    id: "p17", unit: 2,
    title: "NETCONF Session Manager with Candidate Datastore Orchestration",
    objective: "Create a NETCONF session manager that orchestrates multiple concurrent NETCONF sessions, manages candidate datastores, and implements a commit-review-rollback workflow across devices.",
    outcome: "Mastery of NETCONF session lifecycle, datastore operations, confirmed-commit workflows, and transactional configuration management.",
    cos: [2, 4],
    setup: "5-10 virtual devices (Cisco CSR1000v / Juniper vMX) with NETCONF enabled. Python environment with ncclient. Linux server.",
    instructions: "Implement a session pool manager that opens and authenticates NETCONF sessions (SSH) to target devices. For each device, manage the candidate datastore lifecycle: <lock>, <edit-config> (candidate), <validate>, <commit> (with confirmed-commit timeout), and <discard-changes>. Implement a multi-device transaction: apply configuration to all devices, roll back all if any device fails validation. Add support for <get-config> with subtree filtering and XPATH. Expose a REST API for external orchestration.",
    deliverables: ["NETCONF session pool manager", "Candidate datastore orchestration with confirmed-commit", "Multi-device transactional workflow engine", "REST API for external integration", "Failure recovery and rollback test suite"],
    tools: ["Python", "ncclient / libnetconf2", "Flask/FastAPI", "Redis for session state", "Docker for device emulation"]
  },
  {
    id: "p18", unit: 2,
    title: "RESTCONF API Gateway with Caching and Transformation",
    objective: "Design a RESTCONF API gateway that sits between NMS applications and network devices, providing caching, request transformation, load balancing, and protocol bridging.",
    outcome: "Expertise in RESTCONF semantics, HTTP caching strategies, API gateway patterns, and multi-vendor RESTCONF implementation differences.",
    cos: [2, 4, 5],
    setup: "3 different NETCONF/RESTCONF servers (Cisco, Juniper, and a custom netopeer2 instance). Nginx as baseline comparison. Go/Python on Ubuntu.",
    instructions: "Implement a reverse proxy that translates incoming RESTCONF requests (RFC 8040) to backend device endpoints. Support the full RESTCONF operation set: GET/POST/PUT/PATCH/DELETE on {api}/data and {api}/operations. Implement response caching using ETag and Last-Modified headers. Add request transformation layer: convert between JSON and XML payloads, normalize yang-data structures, inject auth headers. Provide rate limiting per device and connection pooling. Benchmark against direct device access.",
    deliverables: ["RESTCONF gateway with full RFC 8040 compliance", "Response caching engine with cache invalidation", "Request/response transformation middleware", "Rate limiter and connection pool", "Performance benchmarks vs direct access"],
    tools: ["Go / Python", "FastAPI", "Redis caching", "Docker", "locust / vegeta for load testing"]
  },
  {
    id: "p19", unit: 2,
    title: "YANG-to-UI Dynamic Form Generator",
    objective: "Build a system that reads YANG module definitions and automatically generates interactive HTML forms for configuration editing, complete with field validation and constraint enforcement.",
    outcome: "Ability to create generic, schema-driven network management UIs that adapt to any YANG module without custom coding.",
    cos: [2, 4],
    setup: "10 diverse YANG modules (with choice, when, must, leaf-list, containers). Modern browser environment. Node.js/Python backend.",
    instructions: "Parse YANG modules to extract data structure, types, ranges, patterns, default values, and constraints. Map YANG types to HTML input controls (e.g., uint8 → number input with min/max, enumeration → select dropdown, boolean → toggle, leafref → dropdown populated from target). Implement dynamic visibility: when a 'when' expression references another field, show/hide controls reactively. Validate input against YANG constraints (range, pattern, mandatory) in real-time. Generate JSON/YANG-compliant output payload for NETCONF/RESTCONF submission.",
    deliverables: ["YANG module parser extracting form metadata", "Dynamic HTML form renderer with reactive constraints", "Real-time validation engine (client + server)", "YANG output serializer for NETCONF/RESTCONF", "Test with 10 diverse YANG modules"],
    tools: ["TypeScript/React", "Python (Flask)", "ANTLR / pyang", "JSON Schema", "react-hook-form / Formik"]
  },
  {
    id: "p20", unit: 2,
    title: "Multi-Vendor NETCONF Compliance Tester",
    objective: "Develop a compliance test suite that verifies whether a NETCONF server implementation correctly adheres to RFC 6241 and vendor-specific YANG model expectations.",
    outcome: "Comprehensive understanding of NETCONF protocol conformance, capability advertisement, error handling, and cross-vendor interoperability testing.",
    cos: [2, 4],
    setup: "NETCONF servers from 3+ vendors (Cisco, Juniper, Nokia) plus open-source (Netopeer, sysrepo). Test orchestration server.",
    instructions: "Define a test specification language (YAML/JSON) that describes NETCONF operations with expected outcomes. Implement test engine: for each test case, open NETCONF session, examine <hello> capabilities, execute operation, and assert response. Cover all mandatory RFC 6241 operations: <get>, <get-config>, <edit-config>, <lock>, <unlock>, <close-session>, <kill-session>. Validate error responses match RFC semantics. For YANG-specific tests, verify that all RPCs, notifications, and data nodes behave as declared. Generate a vendor-compliance matrix.",
    deliverables: ["NETCONF compliance test engine", "100+ test cases covering RFC 6241 mandatory operations", "YANG model behavioral test suite", "Vendor-compliance matrix report", "Extensible test case definition format"],
    tools: ["Python", "ncclient / libnetconf2", "pytest", "Docker (vendor images)", "Allure / pytest-html for reporting"]
  },
  {
    id: "p21", unit: 2,
    title: "YANG Datastore Synchronization Engine",
    objective: "Create a synchronization engine that continuously aligns the running configuration across multiple devices to a desired state defined by a YANG data model, detecting and resolving drift automatically.",
    outcome: "Deep understanding of configuration drift, desired-state management, YANG datastore operations, and automated remediation workflows.",
    cos: [2, 4, 5],
    setup: "5-10 devices with initial configurations. A drift injector script that randomly modifies device configs. Central policy server with desired-state YANG models.",
    instructions: "Define desired state as YANG-encoded JSON files per device. Implement a reconciliation loop: periodically fetch <running> from each device, compare against desired state using recursive YANG path diffing. For each drift: determine if auto-remediation is safe (state-affecting vs purely config). Generate drift reports with per-device compliance percentage. For auto-remediation, push corrective <edit-config> operations. Implement dry-run mode. Surface drift trends over time.",
    deliverables: ["Desired-state YANG configuration definitions", "Drift detection engine with recursive diff", "Auto-remediation module with safety classification", "Drift trend dashboard with compliance scoring", "Dry-run vs actual-run comparison reports"],
    tools: ["Python", "ncclient", "yangson / pyangbind", "PostgreSQL + TimescaleDB", "Grafana"]
  },
  {
    id: "p22", unit: 2,
    title: "YANG-Based Intent Validation System",
    objective: "Design an intent validation framework that takes high-level operator intents expressed as YANG constraints and verifies network state satisfies them in real time.",
    outcome: "Expert knowledge of intent-based networking concepts, YANG constraint expression, invariant verification, and intent lifecycle management.",
    cos: [2, 4, 6],
    setup: "Produced network state from 5 devices (routing table, interface state, ACLs). Intent definition repository. Python with constraint-solving libraries.",
    instructions: "Define an intent language built on YANG 'must' expressions and custom xpath predicates (e.g., 'all CE interfaces with vrf CUSTOMER_A must have QoS policy GOLD applied'). Build a constraint compiler that translates intents into computable predicates. Implement a verification engine: fetch live state via NETCONF <get>, evaluate each intent predicate, and report pass/fail with evidence. For failed intents, compute minimal corrective actions using a SAT/smt solver. Support intent lifecycle: activate, deactivate, supersede, and version.",
    deliverables: ["YANG-based intent definition language", "Constraint compiler (intent → predicates)", "Live state verification engine", "SAT-based corrective action generator", "Intent lifecycle management dashboard"],
    tools: ["Python", "Z3-Py SMT solver", "yangson", "ncclient", "NetworkX"]
  },
  {
    id: "p23", unit: 2,
    title: "NETCONF Notification Broker and Event Distribution System",
    objective: "Build a scalable notification broker that receives NETCONF YANG-push and event notifications, filters/routes them, and delivers to multiple subscribers with guaranteed delivery.",
    outcome: "In-depth knowledge of NETCONF event notifications, YANG-push subscriptions, publish-subscribe patterns, and notification reliability.",
    cos: [2, 4, 5],
    setup: "NETCONF servers configured with YANG-push subscriptions. Multiple notification consumers (UI, logger, analyzer). Kafka/RabbitMQ for brokering.",
    instructions: "Implement a NETCONF notification receiver that creates <create-subscription> streams for YANG-push and event notifications. Normalize incoming notifications into a canonical event format. Implement a topic-based filter: subscribers (UI dashboards, SIEM, logger) register interest in specific XPath-filtered streams. Deliver notifications via WebSocket to live UIs and via persistent queue for analyzers. Support replay: new subscribers receive last N historical notifications. Test with 10,000 notifications/second and measure end-to-end latency.",
    deliverables: ["NETCONF notification collector with YANG-push support", "Topic-based routing and filtering engine", "WebSocket and persistent queue delivery", "Notification replay and guaranteed delivery module", "Throughput and latency benchmark report"],
    tools: ["Python/Java", "Kafka / RabbitMQ", "Spring WebFlux / FastAPI", "WebSocket", "Prometheus + Grafana for monitoring"]
  },
  {
    id: "p24", unit: 2,
    title: "RESTCONF Performance Benchmark Suite",
    objective: "Develop a comprehensive benchmark tool that measures RESTCONF server performance across GET/POST/PUT/PATCH/DELETE operations, payload sizes, concurrent connections, and data model complexity.",
    outcome: "Practical understanding of RESTCONF scalability characteristics, HTTP overhead analysis, and performance optimization techniques for northbound interfaces.",
    cos: [2, 4],
    setup: "3 RESTCONF server implementations (Cisco, Juniper, Netopeer). Dedicated benchmark server with 16+ CPU cores, 32GB RAM. 10GbE network.",
    instructions: "Create a parameterized benchmark harness that generates RESTCONF requests with controlled variables: payload size (1KB to 10MB), concurrent connections (1-500), request mix (read-heavy, write-heavy, balanced), data model complexity (flat vs deeply nested). Measure latency percentiles (p50, p95, p99), throughput (req/sec), and error rates. Implement warm-up and steady-state phases. Generate comparison reports across server types and configurations. Detect performance cliffs and resource contention points.",
    deliverables: ["Configurable RESTCONF benchmark harness", "Parameter sweep execution engine", "Latency/throughput report generator with charts", "Server comparison matrix highlighting bottlenecks", "Performance tuning recommendations per vendor"],
    tools: ["Python/Go", "k6 / locust / vegeta", "FFmpeg/HTTP libraries", "matplotlib/plotly", "Prometheus node_exporter for server metrics"]
  },
  {
    id: "p25", unit: 2,
    title: "YANG Module Dependency Resolver and Impact Analyzer",
    objective: "Build a tool that analyzes YANG module dependency graphs, detects circular dependencies, computes impact zones when a module changes, and suggests safe update order.",
    outcome: "Deep understanding of YANG module relationships, revision management, semantic versioning, and impact analysis in model-driven networks.",
    cos: [2, 4],
    setup: "YANG module repository with 50+ modules including revision history (ietf, openconfig, custom). Python environment with network/graph libraries.",
    instructions: "Parse all YANG modules in a repository to extract import/include/include-type dependencies. Build a directed dependency graph. Implement cycle detection using Tarjan's algorithm; report strongly connected components. Track revision history per module and compute semantic version impact: major (backward-incompatible augment/delete), minor (new nodes), patch (description changes). When a module revision changes, compute the impact zone: all dependent modules that need revalidation or update. Suggest topological update order. Generate a visual dependency graph with impact highlighting.",
    deliverables: ["YANG dependency graph builder with revision tracking", "Cycle detection with SCC reporting", "Semantic impact analyzer (major/minor/patch)", "Impact zone computation for module updates", "Interactive dependency visualization with impact overlay"],
    tools: ["Python", "NetworkX / Graphviz", "pyang / yanglint", "D3.js / vis-network", "Flask"]
  },
  {
    id: "p26", unit: 2,
    title: "Configuration Drift Detection via NETCONF with Remediation Playbooks",
    objective: "Create an automated system that continuously monitors device configuration drift using periodic NETCONF <get-config> comparisons and generates Ansible remediation playbooks.",
    outcome: "Practical skills in continuous compliance monitoring, automated remediation generation, and closed-loop network configuration management.",
    cos: [2, 4, 5],
    setup: "5+ production-like devices with NETCONF access. Git repository with approved baseline configs. Ansible automation server. Python environment.",
    instructions: "Periodically fetch running configurations from devices via NETCONF. Compare against approved baselines stored in Git using structured YANG-path diff (not text diff). Classify drifts: allowed (pre-approved changes), warning (unapproved but non-critical), critical (security/compliance violation). For critical drifts, automatically generate an Ansible playbook that reverts the drifted portions. Implement a human-in-the-loop approval workflow: playbook is generated and staged, operator reviews and approves, then executed. Report drift metrics over time.",
    deliverables: ["NETCONF-based configuration fetcher with baseline comparison", "YANG-path drift classifier (allowed/warning/critical)", "Automatic Ansible playbook generator for remediation", "Human-in-the-loop approval workflow", "Drift trend dashboard with compliance KPIs"],
    tools: ["Python + Ansible", "ncclient", "GitPython", "AWX/Ansible Tower", "Django/Flask for workflow UI"]
  },
  {
    id: "p27", unit: 2,
    title: "NETCONF over SSH Tunneling Proxy with Multi-Hop Support",
    objective: "Build a secure tunneling proxy that routes NETCONF traffic through multiple hops (jump hosts) to reach devices in isolated management networks, with session multiplexing and encryption.",
    outcome: "Understanding of NETCONF transport security, SSH tunneling, jump host patterns, and session management in segmented network environments.",
    cos: [2, 4],
    setup: "3-tier network: NMS → jump host → management network → devices. SSH access through tiers. Test with Netopeer/ sysrepo devices in isolated Docker networks.",
    instructions: "Implement a SOCKS5-aware proxy that accepts NETCONF connections (TCP 830) on the NMS side, routes them through a chain of SSH jump hosts, and terminates at the target device. Support session multiplexing: multiple NETCONF sessions share a single SSH tunnel to reduce overhead. Implement automatic reconnection and session persistence. Add TLS wrapping option for NETCONF-over-TLS (RFC 7589). Provide connection pooling and health checking for each tunnel link. Measure and minimize added latency.",
    deliverables: ["Multi-hop SSH tunneling proxy for NETCONF", "Session multiplexing and connection pooling", "TLS-wrapping option (RFC 7589)", "Tunnel health monitoring and auto-reconnect", "Latency overhead benchmark vs direct connection"],
    tools: ["Go / Python", "paramiko / golang.org/x/crypto/ssh", "Docker", "Prometheus for tunnel metrics", "Grafana"]
  },
  {
    id: "p28", unit: 2,
    title: "YANG Data Model Visualization and Diff Tool",
    objective: "Develop an interactive visualizer that renders YANG data models as hierarchical tree diagrams and computes visual diffs between model revisions.",
    outcome: "Ability to visualize complex YANG schema hierarchies, understand model evolution, and communicate structural changes effectively.",
    cos: [2, 4],
    setup: "10+ YANG module pairs (original vs revised) from IETF and OpenConfig. Modern web browser. Python/Node.js backend.",
    instructions: "Parse YANG modules into a structured tree representation preserving nodes, types, constraints, and narrative descriptions. Render as an interactive collapsible tree with icons for different node types (container, list, leaf, leafref, choice). For diff mode, align two model revisions by schema path and color-code: green (added), red (removed), yellow (modified), gray (unchanged). Show inline tooltips with old/new values for changed nodes. Support export as SVG or PNG. Handle large models (5000+ nodes) with virtual scrolling.",
    deliverables: ["YANG-to-tree visualization renderer", "Interactive collapsible tree with node-type icons", "Two-panel diff view with color-coded changes", "Detailed change tooltip (old vs new)", "SVG/PNG export + virtual scrolling for large models"],
    tools: ["TypeScript/React", "D3.js / vis-network", "Python (pyang) for parsing", "WebWorker for large model processing", "html-to-image for export"]
  },
  {
    id: "p29", unit: 2,
    title: "Network Service Orchestration via RESTCONF with State Management",
    objective: "Design and implement a service orchestrator that provisions complex multi-device network services (e.g., L3VPN, ACL policy) using RESTCONF, managing operational state across the service lifecycle.",
    outcome: "Full-stack understanding of service orchestration, state management, idempotent provisioning, and service lifecycle operations using RESTCONF.",
    cos: [2, 4, 5, 6],
    setup: "6 NETCONF/RESTCONF-capable devices (3 PE, 3 CE). Service definitions in YANG (L3VPN service model). Orchestrator server with PostgreSQL.",
    instructions: "Define service templates (L3VPN, QoS policy, ACL set) that map to YANG data models on multiple devices. Implement an orchestrator that accepts a service request via REST API, decomposes it into per-device RESTCONF operations, and executes them in dependency order. Track service state: init → provisioning → active → modifying → decommissioning. Implement rollback: if any device operation fails, undo completed operations. Support service discovery: reconcile actual device state with desired service state. Provide service health monitoring.",
    deliverables: ["Service template engine with YANG mapping", "Multi-device RESTCONF orchestrator with dependency ordering", "Service lifecycle state machine with rollback", "Service-to-device state reconciliation", "Service health dashboard"],
    tools: ["Python", "requests / httpx for RESTCONF", "PostgreSQL for state", "Celery for async workflows", "React for service management UI"]
  },
  {
    id: "p30", unit: 2,
    title: "YANG Schema-Based Configuration Auditing and Policy Enforcement",
    objective: "Create an auditing engine that validates device configurations against organizational policies expressed as YANG constraints and enforces compliance through automated remediation.",
    outcome: "Practical expertise in policy-as-code for network configuration, YANG constraint-based validation, and automated compliance enforcement.",
    cos: [2, 4, 5],
    setup: "10 devices with diverse configurations. Organizational policy document (hardened NIST standards mapped to YANG paths). Python audit server.",
    instructions: "Express organization policies as YANG 'must' expressions or structured rules that reference specific YANG paths (e.g., 'must(./auth/key-chain != \"default\"')). Build an audit engine that fetches device configs via NETCONF and evaluates each policy rule, producing pass/fail with evidence. For failed policies, compute the minimal corrective edit-config and route for approval. Support policy sets (profiles) per device role (core-router vs access-switch). Generate executive summary reports with compliance scores and trend analysis.",
    deliverables: ["YANG constraint-based policy definition format", "Config audit engine with per-rule pass/fail evaluation", "Automated corrective action generator", "Role-based policy profiles", "Compliance dashboard with trend reports"],
    tools: ["Python", "yangson / libyang", "ncclient", "PostgreSQL", "Grafana"]
  },

  // ── Unit III: Alarm Lifecycle Management (15 projects) ──
  {
    id: "p31", unit: 3,
    title: "Real-Time Alarm Correlation Engine with Graph-Based Root Cause Analysis",
    objective: "Build a correlation engine that ingests real-time alarms from network devices, correlates related events using a dependency graph, and performs root cause analysis to identify the origin of failures.",
    outcome: "Mastery of alarm correlation techniques, graph-based RCA algorithms, and real-time event processing in large-scale networks.",
    cos: [4, 5],
    setup: "GNS3 network with 20+ devices. Fault injector generating correlated failures (link down → OSPF adjacencies lost → BGP sessions dropped). Kafka event bus.",
    instructions: "Maintain a device dependency graph (physical, logical, service) built from topology discovery. Ingest alarms (SNMP traps, syslog) into a Kafka stream. Implement a correlation window processor that groups temporally adjacent alarms. Apply graph-based algorithms: compute reachability from each alarm's source in the dependency graph to identify common ancestors (potential root causes). For each correlated group, assign a root cause (the most fundamental alarm) and suppress derivative alarms. Store correlated incidents in Elasticsearch for forensics.",
    deliverables: ["Alarm ingestion pipeline with Kafka", "Dependency graph constructor from topology data", "Window-based alarm grouping engine", "Graph-based root cause analysis algorithm", "Incident dashboard with drill-down to raw alarms"],
    tools: ["Python/Java", "Kafka", "Elasticsearch + Kibana", "Neo4j / NetworkX", "Grafana"]
  },
  {
    id: "p32", unit: 3,
    title: "Root Cause Analysis Using Graph-Based Algorithms with Topology Awareness",
    objective: "Develop an advanced RCA engine that uses multiple graph algorithms (BFS, PageRank, random walk) over a weighted dependency graph to pinpoint failure root causes with confidence scoring.",
    outcome: "Expertise in applying graph theory, centrality measures, and probabilistic inference to network alarm analysis and fault localization.",
    cos: [4, 5],
    setup: "Complex network topology with redundancy (dual-homed, mesh). Historical alarm data with labeled root causes for 100+ incidents. Python graph analysis stack.",
    instructions: "Build a weighted dependency graph where nodes are network entities and edge weights represent dependency strength (derived from traffic flow data or operator input). Implement multiple RCA algorithms: BFS from alarm leaves to find common ancestor, personalized PageRank to identify influential nodes, random walk with restart to simulate fault propagation. For each algorithm, produce a ranked list of probable root causes with confidence scores. Combine results using an ensemble method (weighted voting). Evaluate against labeled historical incidents.",
    deliverables: ["Weighted dependency graph construction engine", "Multi-algorithm RCA engine (BFS, PageRank, RWR)", "Ensemble confidence scoring module", "Labeled incident dataset with 100+ cases", "Accuracy comparison across algorithms and ensemble"],
    tools: ["Python", "NetworkX / igraph", "scikit-learn", "Neo4j graph database", "matplotlib / seaborn for analysis"]
  },
  {
    id: "p33", unit: 3,
    title: "Alarm Storm Detection and Automated Mitigation System",
    objective: "Design a real-time system that detects alarm storms (sudden surge of alarms), classifies storm types, and executes automated mitigation actions to protect operators and infrastructure.",
    outcome: "Deep understanding of alarm storm characteristics, detection algorithms, throttling strategies, and automated network protect mechanisms.",
    cos: [4, 5],
    setup: "High-frequency alarm generator (1000+ alarms/sec). Simulated large-scale network (50+ devices). Time-series database with 30 days of historical alarm data.",
    instructions: "Characterize alarm storms using historical data: define thresholds for rate-of-change (e.g., 5x baseline for 60 seconds). Implement real-time storm detection: sliding window rate counter with exponential moving average baseline. Classify storms: hardware failure cascade, configuration roll-out storm, network attack, or external trigger. Implement automated mitigation: ingress rate limiting on alarm sources, automated ticket creation, targeted alarm suppression with scope boundaries, and operator alert with storm summary. Evaluate detection latency vs false positives.",
    deliverables: ["Storm detection engine with adaptive baselines", "Storm classifier (hardware/config/attack/external)", "Automated mitigation action engine with safety checks", "Operator console with active storm visualization", "Detection accuracy and latency benchmark report"],
    tools: ["Python/Go", "Apache Flink / Kafka Streams", "InfluxDB / TimescaleDB", "Grafana", "Elasticsearch"]
  },
  {
    id: "p34", unit: 3,
    title: "Multi-Layer Alarm Suppression Framework with Scope and Severity Awareness",
    objective: "Build a configurable alarm suppression framework that applies suppression rules at multiple layers (device, network, service) based on topology, severity, and operational context.",
    outcome: "Comprehensive knowledge of alarm suppression techniques, scope-based filtering, maintenance mode management, and suppression audit trails.",
    cos: [4, 5],
    setup: "Alarm stream generator producing 200+ alarm types. Maintenance schedule database. Device topology with 30+ nodes and 5 service definitions.",
    instructions: "Implement a multi-layer suppression engine: Layer 1 (device-level) — suppress alarms from devices in maintenance mode; Layer 2 (network-level) — suppress derivative alarms when root cause is known; Layer 3 (service-level) — suppress alarms for degraded but non-critical services. Each layer evaluates scope (device, subnet, service), severity filter (only suppress below critical), and time window. Maintain a suppression audit trail: what was suppressed, by which rule, operator override available. Support dry-run mode showing what would be suppressed.",
    deliverables: ["Three-layer suppression engine with configurable rules", "Maintenance mode scheduler and integration", "Suppression audit trail with operator override", "Dry-run mode with would-be-suppressed preview", "Effectiveness report (alarm reduction percentage)"],
    tools: ["Python", "Kafka / Redis", "PostgreSQL", "React for suppression rule editor", "Prometheus for suppression metrics"]
  },
  {
    id: "p35", unit: 3,
    title: "Alarm Lifecycle Management System with IT Ticketing Integration",
    objective: "Create a complete alarm lifecycle management platform that tracks each alarm from creation through investigation, escalation, resolution, and closure, integrated with a ticketing system.",
    outcome: "End-to-end understanding of alarm lifecycle phases, escalation policies, ticket-to-alarm correlation, and operational workflow management.",
    cos: [4, 5],
    setup: "Alarm generator (SNMP traps + syslog). Ticketing system API (JIRA/ServiceNow mock). PostgreSQL database. React frontend.",
    instructions: "Define alarm lifecycle states: Raised → Acknowledged → Investigating → Escalated → Resolved → Closed. Implement state machine with transition rules (e.g., only unacknowledged alarms can be escalated after 15 min). Auto-create tickets in the ticketing system when alarm severity is Critical or above. Link tickets to alarms bidirectionally. Implement escalation policies: if alarm stays in Investigating for >30 min, escalate to Tier-2. Provide SLA tracking: time-to-acknowledge, time-to-resolve per severity. Build a lifecycle timeline view for each alarm with all state transitions and operator actions.",
    deliverables: ["Alarm lifecycle state machine with transition rules", "Ticketing system integration (auto-create, link, update)", "Escalation policy engine with timer-based triggers", "SLA tracking and breach notification module", "Alarm timeline view with filterable event history"],
    tools: ["Python/Java", "PostgreSQL", "JIRA/ServiceNow REST API mock", "React + Material-UI", "Camunda / Temporal for workflow"]
  },
  {
    id: "p36", unit: 3,
    title: "ML-Based Alarm Severity Prediction and Reclassification",
    objective: "Develop a machine learning model that predicts the appropriate severity level for incoming alarms based on historical patterns, device context, and current network state, enabling dynamic reclassification.",
    outcome: "Ability to apply supervised learning to alarm management, feature engineering from network telemetry, and online model inference for operations.",
    cos: [4, 5],
    setup: "6 months of historical alarm data with labeled severity (critical/major/minor/warning), 50,000+ records. Feature store (PostgreSQL). Python ML stack.",
    instructions: "Engineer features from alarm metadata: source device role, alarm type, historical frequency from same source, time of day, day of week, current network health score (from telemetry), related active incidents count. Train multi-class classifiers (Random Forest, XGBoost, LightGBM) to predict severity. Handle class imbalance (critical alarms are rare). Implement online inference: when a new alarm arrives, predict severity before it enters the lifecycle system. Compare predicted vs operator-assigned severity, log discrepancies. Implement a feedback loop: operator corrections retrain the model periodically.",
    deliverables: ["Feature engineering pipeline from alarm and context data", "Multi-class severity prediction model(s)", "Online inference microservice", "Discrepancy tracking and feedback collection", "Model performance dashboard with confusion matrix"],
    tools: ["Python", "scikit-learn / XGBoost", "PostgreSQL / Feature Store", "MLflow", "FastAPI"]
  },
  {
    id: "p37", unit: 3,
    title: "Geographic Alarm Visualization with GIS Integration",
    objective: "Build a geographic information system (GIS) visualization layer that plots network alarms on a map with real-time updates, cluster-based views, and heat maps based on alarm density and severity.",
    outcome: "Integration of network management with geospatial visualization, large-scale real-time mapping, and location-aware alarm analytics.",
    cos: [4, 5],
    setup: "Network with devices spread across 5 simulated geographic sites (lat/lon coordinates). GPS coordinate database. Leaflet/Mapbox frontend. Real-time alarm stream.",
    instructions: "Maintain a device inventory with geographic coordinates. Build a real-time alarm-to-map rendering pipeline: WebSocket delivers alarm events to the browser, which updates markers on a Leaflet/Mapbox map. Implement alarm clustering: at zoom-out levels, cluster nearby alarms into a single marker showing count and worst severity. Use heatmaps for alarm density overlay. Add layers: show fiber routes between sites colored by utilization. Click a marker to see alarm details and link to the alarm lifecycle timeline. Support temporal playback: replay alarm history at 10x speed.",
    deliverables: ["GIS mapping engine with device location database", "Real-time alarm marker updates via WebSocket", "Adaptive clustering and heatmap overlay", "Site-to-site fiber route visualization", "Temporal alarm history playback feature"],
    tools: ["JavaScript/React", "Leaflet / Mapbox GL", "WebSocket / Socket.io", "Python (Flask) backend", "PostGIS"]
  },
  {
    id: "p38", unit: 3,
    title: "Time-Series Alarm Forensics and Investigation Platform",
    objective: "Create a forensics platform that enables operators to query, visualize, and analyze historical alarm data alongside correlated network metrics to investigate past incidents.",
    outcome: "Expertise in time-series analysis for alarm forensics, interactive querying, correlation of alarms with performance data, and incident reconstruction.",
    cos: [4, 5],
    setup: "30+ days of historical alarm data in InfluxDB. Correlated performance metrics (CPU, memory, interface utilization) from same period. Python data analysis stack.",
    instructions: "Build a time-series query engine that allows operators to select a time range, device, alarm type, and severity filter. Visualize alarm frequency as bar/heatmap overlays on a timeline. Implement one-click correlation: select a time window around a critical alarm and overlay relevant performance metrics (e.g., CPU spike before interface down alarm). Support event reconstruction: given an incident ID, replay the alarm sequence with metrics in a synchronized timeline player. Add bookmarking and annotation capabilities for collaborative investigation. Export investigation reports.",
    deliverables: ["Time-series alarm and metrics query engine", "Synchronized multi-pane timeline visualization", "One-click alarm-to-metric correlation", "Incident reconstruction player with replay controls", "Investigation bookmark/annotation and report export"],
    tools: ["Python", "InfluxDB / TimescaleDB", "Grafana / plotly", "React + D3.js", "Jupyter notebooks for analysis scripts"]
  },
  {
    id: "p39", unit: 3,
    title: "Cross-Domain Alarm Aggregation and Normalization Gateway",
    objective: "Develop a gateway that ingests alarms from multiple domains (IP network, optical, power, virtual infrastructure), normalizes them into a common schema, and provides unified query and correlation.",
    outcome: "Practical experience in multi-domain network management, alarm normalization, schema mapping, and federated alarm correlation.",
    cos: [4, 5, 6],
    setup: "4 simulated domain managers: SNMP-based IP NMS, optical EMS (REST API), VMware vCenter (alarms), and custom IoT sensor gateway. PostgreSQL central DB.",
    instructions: "Define a canonical alarm model with fields: id, source, domain, type, severity, timestamp, summary, details, affected_entities. Build domain adapters that poll each domain's alarm API and transform to the canonical model. Handle semantics: map domain-specific severity levels to a unified 5-level scale. Implement cross-domain correlation: define rules linking alarms across domains (e.g., optical signal degrade → IP link flap → VM migration). Provide a unified alarm search and filter API. Generate cross-domain impact reports showing cascading effects.",
    deliverables: ["Canonical alarm model with extensible schema", "4 domain adapters with bidirectional mapping", "Cross-domain correlation rule engine", "Unified alarm query API with federation", "Cross-domain impact report generator"],
    tools: ["Python/Java", "PostgreSQL", "Apache Camel / Kafka Connect", "REST API design", "Docker Compose for multi-domain simulation"]
  },
  {
    id: "p40", unit: 3,
    title: "Alarm Quality Metrics and Continuous Improvement Dashboard",
    objective: "Build a dashboard that measures alarm quality metrics (accuracy, timeliness, uniqueness, actionability) and provides continuous improvement recommendations to reduce alarm noise.",
    outcome: "Understanding of alarm management maturity models, data quality assessment for operational data, and KPI-driven operations improvement.",
    cos: [4, 5],
    setup: "3 months of alarm and incident data with operator feedback (useful vs irrelevant). PostgreSQL with TimescaleDB. Grafana for visualization.",
    instructions: "Define and compute alarm quality KPIs: Accuracy (alarm confirmed by real incident), Timeliness (delay between occurrence and alarm generation), Uniqueness (duplicate ratio), Actionability (alarms leading to operator action), Noise Score (inverse of actionability). Build ETL pipeline that processes raw alarm data and computes daily KPI values per device, per alarm type, per severity. Implement trend analysis: which devices/alarms have improving/worsening quality. Generate recommendations: 'Device X has 90% duplicate rate — consider adjusting debounce interval'. Track improvement over time.",
    deliverables: ["Alarm quality KPI computation engine", "ETL pipeline for daily KPI aggregation", "Trend analysis with forecast (improving/stable/declining)", "Automated recommendation generator with action links", "Quality improvement tracking dashboard"],
    tools: ["Python", "TimescaleDB / PostgreSQL", "dbt for transformations", "Grafana", "Apache Superset"]
  },
  {
    id: "p41", unit: 3,
    title: "Intelligent Alarm Deduplication Engine with Fingerprinting",
    objective: "Design a deduplication engine that identifies duplicate alarms by computing fuzzy fingerprints based on alarm attributes and temporal proximity, reducing operational noise without losing critical information.",
    outcome: "Expert knowledge of deduplication strategies, fuzzy matching algorithms, fingerprinting techniques, and noise reduction in alarm management.",
    cos: [4, 5],
    setup: "Alarm feed with 30%+ duplicate rate. Duplicate types: exact (same attributes), temporal (same source, same type, within 5 min), cardinality (multiple similar sources). Python environment.",
    instructions: "Define duplicate classes: Exact match (identical OID/summary/source), Temporal (same OID/source within configurable window), Contextual (different OID, same source, same root cause — related to correlation). For exact/temporal, use a fast hash-based matcher. For contextual, compute a fingerprint: [device, alarm_type, hash of affected_entity] using MinHash/LSH for approximate matching. Maintain a deduplication window: when a duplicate is detected, increment occurrence counter on the original alarm rather than creating a new one. Measure noise reduction rate and false-positive suppression. Provide operator visibility: show suppressed duplicates count per original alarm.",
    deliverables: ["Multi-class deduplication engine (exact/temporal/contextual)", "MinHash/LSH fingerprinting for fuzzy matching", "Deduplication window manager with counter tracking", "Noise reduction and false-positive measurement", "Operator console showing suppressed duplicates"],
    tools: ["Python", "Redis for window state", "datasketch (MinHash LSH)", "Prometheus for metrics", "Grafana"]
  },
  {
    id: "p42", unit: 3,
    title: "Real-Time Alarm Notification Routing and Escalation Engine",
    objective: "Build a smart notification router that delivers alarms to the right operator (or team) based on alarm attributes, operator skills, shift schedules, and current workload, with automatic escalation.",
    outcome: "Practical understanding of notification routing, duty scheduling, escalation policies, and alert fatigue management in NOC operations.",
    cos: [4, 5],
    setup: "Operator database with skills, team assignments, shift patterns. Alarm generator. Multiple notification channels (email, SMS, Slack/Teams webhook).",
    instructions: "Define notification policies: alarm_type → routing_rule (team, channel, cooldown). Implement operator availability: check shift calendar, if on leave → route to backup. For urgent alarms (Critical), implement escalation: if not acknowledged within T1 minutes, escalate to Tier-2, if still unacknowledged after T2 minutes, page on-call manager. Implement throttle: identical alarm notifications are batched (summarized) rather than sent individually. Track operator acknowledgment response times. Provide a dashboard showing current operator load and pending alarms.",
    deliverables: ["Notification policy engine with rule matching", "Shift calendar and operator availability module", "Multi-channel notification dispatcher (email/SMS/chat)", "Escalation timer with multi-tier escalation chain", "Operator load and acknowledgment dashboard"],
    tools: ["Python/Go", "Redis for timer management", "Twilio / SendGrid API", "Slack/Teams webhook", "React for operator management UI"]
  },
  {
    id: "p43", unit: 3,
    title: "Alarm Impact Analysis for Service Assurance",
    objective: "Develop an impact analysis engine that, given an alarm, computes which services, customers, and SLAs are affected, generating a service impact assessment in real time.",
    outcome: "Ability to map network alarms to business service impact, enabling service-centric operations and SLA-aware incident management.",
    cos: [4, 5],
    setup: "Service model mapping 10 business services to underlying network resources (devices, links, VNFs). Real-time alarm stream. Customer-to-service database.",
    instructions: "Build a service model that defines how network resources compose into services (e.g., 'Gold VPN Service' → {PE1, PE2, link-1, QOS-profile}). When an alarm arrives, traverse the service model to find all services that depend on the affected resource. For each impacted service, compute: affected customers, SLA breach probability (if alarm severity ≥ Major), estimated recovery time based on historical MTTR for similar alarms. Generate a service impact card: '2 services impacted, 15 customers affected, SLA breach risk: HIGH'. Push to NOC dashboard and notify customer account managers.",
    deliverables: ["Service model builder with resource-to-service mapping", "Real-time impact assessment engine on alarm arrival", "SLA breach probability calculator using historical MTTR", "Service impact card generator and dashboard", "Customer notification template engine"],
    tools: ["Python", "Neo4j / NetworkX for service model", "PostgreSQL", "React for impact dashboard", "Prometheus + Grafana"]
  },
  {
    id: "p44", unit: 3,
    title: "Predictive Alarm Analytics Using Multivariate Time-Series Forecasting",
    objective: "Create a predictive analytics system that uses multivariate time-series models to forecast future alarm rates and types, enabling proactive capacity planning and anomaly preemption.",
    outcome: "Application of advanced time-series forecasting to alarm management, enabling shift from reactive to proactive network operations.",
    cos: [4, 5, 6],
    setup: "1 year of alarm data with associated performance metrics (traffic, CPU, memory). Python data science stack. GPU for deep learning models (optional).",
    instructions: "Aggregate alarm counts by type, severity, and source device into regular time-series (15-min buckets). Include exogenous features: traffic volume, day-of-week, business hours, maintenance windows. Train multivariate forecasting models: Vector AutoRegression (VAR), Temporal Convolutional Network (TCN), and Transformer-based time-series model. Forecast alarm rates for the next 24 hours with prediction intervals. When predicted rate exceeds historical P95, trigger a proactive check: 'Alarm rate for InterfaceDown on core-router predicted to spike at 14:00 — suggest pre-emptive maintenance'. Evaluate forecast accuracy using MAPE, MASE.",
    deliverables: ["Alarm aggregation and feature engineering pipeline", "Multivariate forecast models (VAR, TCN, Transformer)", "24-hour forecast with prediction intervals", "Proactive alert generator based on forecast anomalies", "Forecast accuracy comparison report"],
    tools: ["Python", "Prophet / statsmodels", "PyTorch / TensorFlow", "InfluxDB", "MLflow for experiment tracking"]
  },
  {
    id: "p45", unit: 3,
    title: "Multi-Tenant Alarm Management Platform with RBAC",
    objective: "Design a multi-tenant alarm management system where multiple customers (enterprises, service providers) share a common NMS infrastructure but see only their own alarms, with role-based access control.",
    outcome: "Architecture and implementation of multi-tenant systems, data isolation strategies, role-based access, and tenant-aware alarm processing.",
    cos: [4, 5, 6],
    setup: "3 simulated tenant networks, each with 10 devices. Tenant isolation database. PostgreSQL with row-level security. React for management UI.",
    instructions: "Design a tenant model: each tenant has its own device inventory, users, roles, and alarm data. Implement data isolation using PostgreSQL Row-Level Security (RLS) — every alarm table row has a tenant_id. Build a tenant-aware alarm pipeline: when an alarm arrives, determine tenant from device association and tag accordingly. Implement RBAC: admin (all tenants), operator (assigned tenant, read-acknowledge-resolve), viewer (read-only). Provide tenant-scoped dashboards: each tenant sees only their alarms, devices, and metrics. Support cross-tenant views for admin. Measure isolation overhead.",
    deliverables: ["Multi-tenant alarm ingestion pipeline", "PostgreSQL RLS implementation for data isolation", "RBAC model with admin/operator/viewer roles", "Tenant-scoped dashboards and self-service UI", "Isolation overhead benchmark report"],
    tools: ["Python/Java", "PostgreSQL (RLS)", "Keycloak / Auth0 for RBAC", "React", "Docker Compose for multi-tenant simulation"]
  },

  // ── Unit IV: SDN and Advanced Network Management (15 projects) ──
  {
    id: "p46", unit: 4,
    title: "Custom SDN Controller for Traffic Engineering with OpenFlow",
    objective: "Implement a custom SDN controller using a framework (Ryu/ONOS/POX) that dynamically manages flow tables to optimize traffic engineering objectives (congestion avoidance, load balancing, QoS).",
    outcome: "Deep hands-on experience with SDN controller architecture, OpenFlow protocol, flow table management, and traffic engineering algorithms.",
    cos: [4, 6],
    setup: "Mininet network with 10+ OpenFlow switches and 20+ hosts. Ryu controller (Python) or ONOS. Traffic generators (iperf, D-ITG).",
    instructions: "Implement a custom controller module that discovers network topology (LLDP packets via PacketIn). Build a traffic engineering module: using link utilization statistics from port stats, compute load-balanced paths using ECMP or weighted-cost multi-path. Dynamically install flow entries (via FlowMod) with idle/hard timeouts to redirect traffic away from congested links. Implement fast failover: when link failure detected, compute backup paths and install replacement flows within 50ms. Provide a REST API for external path queries. Evaluate throughput improvement and failover convergence time.",
    deliverables: ["Custom SDN controller with topology discovery and TE", "Dynamic flow programming with load balancing", "Fast failover module (<50ms convergence)", "REST API for path query and flow visualization", "Performance evaluation (throughput, latency, failover time)"],
    tools: ["Python", "Ryu / POX / ONOS", "Mininet", "OpenFlow 1.3", "iperf / D-ITG"]
  },
  {
    id: "p47", unit: 4,
    title: "OpenFlow Switch Implementation (User-Space Software Switch)",
    objective: "Build a user-space OpenFlow switch implementation that handles packet forwarding, flow table matching, and controller communication according to the OpenFlow specification.",
    outcome: "Comprehensive understanding of OpenFlow pipeline, flow table architecture, match-action paradigm, and asynchronous message handling in SDN data planes.",
    cos: [4, 6],
    setup: "Linux environment with DPDK for fast packet processing. OpenFlow 1.3 specification document. Mininet for test topology. Wireshark for OF message inspection.",
    instructions: "Implement core OpenFlow 1.3 switch functionality: flow table (with priority-based matching, wildcards, counters), group table, meter table, and port management. Support match fields: in_port, eth_src/dst, eth_type, ip_src/dst, tcp_src/dst. Support actions: OUTPUT, SET_FIELD, GOTO_TABLE, METER, DROP. Implement OpenFlow channel (TCP/TLS) for controller communication: handle PacketIn, FlowMod, PortStatus, and RoleRequest. Connect to a real controller (Ryu) and pass the standard OpenFlow compliance test suite. Measure forwarding performance (packets/sec) with and without DPDK.",
    deliverables: ["User-space OpenFlow 1.3 switch implementation", "Flow table with multi-field matching and actions", "OpenFlow channel with controller communication", "Successful interoperability with Ryu controller", "Performance benchmarks (throughput, latency, table lookups/sec)"],
    tools: ["C/Python", "DPDK (optional)", "OpenFlow 1.3 spec", "Mininet / Ryu", "OFSEC / Stanford compliance tests"]
  },
  {
    id: "p48", unit: 4,
    title: "Network Slicing Orchestrator for 5G Service-Based Architecture",
    objective: "Design and implement a network slicing orchestrator that provisions end-to-end 5G network slices across RAN, transport, and core, managing slice lifecycle and resource isolation.",
    outcome: "Expertise in 5G network slicing concepts, NSSMF/NSMF architecture, slice lifecycle management, and multi-domain resource orchestration.",
    cos: [4, 6],
    setup: "OpenAirInterface or UERANSIM for 5G core/RAN simulation. Linux namespace-based virtualization for isolated slice resources. Kubernetes for CNF deployment.",
    instructions: "Define slice templates (eMBB, URLLC, mMTC) with resource requirements, latency budgets, and QoS profiles. Implement slice lifecycle: instantiate (create isolated network + compute resources), activate (configure CNF/PNF), monitor (slice KPIs), terminate (release resources). For RAN slicing, configure OAI with per-slice scheduler weights. For core slicing, deploy independent AMF/SMF/UPF instances per slice. For transport, configure VLAN/MPLS-TP isolation. Provide a slice dashboard showing per-slice resource usage, SLA compliance (latency, throughput), and health status. Implement admission control to prevent resource overcommit.",
    deliverables: ["End-to-end slice template definitions (eMBB/URLLC/mMTC)", "Slice lifecycle orchestrator with resource isolation", "RAN/Core/Transport slice configuration automation", "Slice SLA monitoring dashboard", "Admission control and resource overcommit prevention"],
    tools: ["Python", "OpenAirInterface / UERANSIM", "Kubernetes + Kubespray", "Linux TC / iproute2", "Prometheus + Grafana"]
  },
  {
    id: "p49", unit: 4,
    title: "Intent-Based Networking Compiler and Verification Engine",
    objective: "Build a high-level intent compiler that translates business-level intents (expressed in natural language or structured YAML) into network configurations, verifies them against constraints, and deploys them via SDN/NETCONF.",
    outcome: "Full-stack understanding of intent-based networking, natural language processing for intents, formal verification, and intent-to-config compilation.",
    cos: [4, 6],
    setup: "SDN controller (ONOS) and NETCONF-enabled devices. Python NLP stack (spaCy, transformers). SMT solver (Z3). Intent repository (PostgreSQL).",
    instructions: "Design an intent language covering common operations: connectivity (A can reach B), isolation (A cannot reach B), QoS (traffic class X gets Y bandwidth), and availability (service must survive 1 failure). Implement a parser that supports both structured YAML and a controlled natural language interface (using spaCy for entity extraction). Compile intents to a mix of OpenFlow rules (for SDN devices) and NETCONF configurations (for traditional devices). Use Z3 SMT solver to verify that no two intents conflict and all are satisfiable given network capacity. Provide intent lifecycle (create, verify, deploy, monitor, deactivate).",
    deliverables: ["Intent language definition (YAML + controlled NL)", "Intent parser with NLP entity extraction", "Intent-to-config compiler (OpenFlow + NETCONF)", "Z3-based conflict detection and satisfiability checker", "Intent lifecycle management dashboard"],
    tools: ["Python", "spaCy / transformers", "Z3-Py", "ONOS / Ryu", "ncclient"]
  },
  {
    id: "p50", unit: 4,
    title: "NFV MANO Orchestrator with VNF Lifecycle Management",
    objective: "Design and implement a simplified NFV Management and Orchestration (MANO) system that manages Virtual Network Function descriptors, lifecycle, scaling, and healing according to ETSI NFV standards.",
    outcome: "Deep understanding of ETSI NFV MANO architecture, VNFD/NSD modeling, lifecycle management, auto-scaling, and fault recovery in virtualized networks.",
    cos: [4, 6],
    setup: "OpenStack or Docker swarm for VIM. 5 VNF packages (e.g., vRouter, vFirewall, vDPI) packaged as VM images or containers. Python orchestrator.",
    instructions: "Implement NFVO and VNFM components according to ETSI NFV-MANO SOL001/SOL002. Parse VNF Descriptors (VNFD) and NS Descriptors (NSD) in TOSCA/YANG. Implement VNF lifecycle: instantiate (allocate VIM resources, configure VNF), scale-out/in (add/remove VNF instances based on load), heal (detect failure, restart/replace VNF), terminate (release resources). Implement NS lifecycle: compose multiple VNFs into a network service graph with VL and CP connections. Monitor VNF resource usage and trigger auto-scaling when CPU > 80% for 5 min. Generate NFV alarms for VNF failures.",
    deliverables: ["NFVO and VNFM with ETSI NFV MANO interfaces", "VNFD/NSD parser (TOSCA/YANG)", "VNF lifecycle management (instantiate/scale/heal/terminate)", "Auto-scaling policy engine", "NFV alarm generation and dashboard"],
    tools: ["Python", "OpenStack / Docker SDK", "TOSCA parser (tosca-parser)", "Prometheus + Grafana", "RabbitMQ for VNFM-NFVO messaging"]
  },
  {
    id: "p51", unit: 4,
    title: "Network Telemetry Collector with gRPC and Streaming Data Pipeline",
    objective: "Build a high-throughput network telemetry collector that receives streaming telemetry data via gRPC from network devices (model-driven telemetry), normalizes it, and feeds it into a real-time analytics pipeline.",
    outcome: "Practical expertise in gRPC-based telemetry collection, YANG-push subscriptions, data normalization, and large-scale streaming data pipelines.",
    cos: [4, 6],
    setup: "gRPC telemetry sources (simulated Cisco MDT, Juniper JTI). Kafka for streaming. Linux server with high-bandwidth NIC. Docker Compose for pipeline components.",
    instructions: "Implement a gRPC server that supports dial-in mode (device pushes telemetry) and dial-out mode (collector subscribes). Handle YANG-push encoding (GPB, JSON, serialized GPB). Normalize telemetry from different vendors into a common schema. Implement batching and backpressure: batch telemetry samples into Kafka messages every 500ms, handle slow consumers with Kafka topic-based backpressure. Support telemetry replay: store raw telemetry in Parquet for later analysis. Measure pipeline throughput (samples/sec, msg/sec) and end-to-end latency from device to dashboard.",
    deliverables: ["gRPC telemetry collector (dial-in + dial-out)", "Multi-vendor telemetry normalizer (Cisco, Juniper, Huawei)", "Kafka-based streaming pipeline with batching", "Telemetry replay and Parquet storage module", "Throughput and latency benchmark report"],
    tools: ["Python/Go", "gRPC / protobuf", "Kafka", "Parquet / Arrow", "Prometheus"]
  },
  {
    id: "p52", unit: 4,
    title: "SDN Security Monitoring Application with Traffic Anomaly Detection",
    objective: "Develop a security application for SDN controllers that monitors network traffic via flow statistics, detects anomalies (DDoS, port scan, data exfiltration), and dynamically installs mitigation flows.",
    outcome: "Integration of SDN programmability with network security operations, flow-based anomaly detection, and automated threat response.",
    cos: [4, 6],
    setup: "Mininet network with Ryu/ONOS controller. Attack traffic generators (hping3, slowloris, Scapy). Network with 100+ simulated hosts.",
    instructions: "Implement a security monitoring module that periodically requests flow statistics (OFPFlowStatsRequest) from switches. Compute features per switch/port: packets/sec, bytes/sec, flow count, entropy of src/dst IPs, TCP SYN-to-ACK ratio. Train/configure anomaly detection thresholds: entropy drop < threshold → potential DDoS, single IP with many dst ports → port scan. When anomaly detected, install reactive flow entries to: rate-limit suspect traffic to 1% bandwidth, redirect to a scrubbing VM, or drop blacklisted IPs. Send SDN security alert (northbound REST notification). Measure detection time and false-positive rate.",
    deliverables: ["Flow statistics collector and feature extraction engine", "Anomaly detection module (DDoS/scan/exfiltration)", "Automated mitigation flow installation", "Security alert API with northbound integration", "Detection accuracy and response time evaluation"],
    tools: ["Python", "Ryu / ONOS REST API", "Scapy / hping3", "InfluxDB + Grafana", "Mininet"]
  },
  {
    id: "p53", unit: 4,
    title: "Service Function Chaining Orchestrator with Traffic Steering",
    objective: "Design and implement a Service Function Chaining (SFC) orchestrator that composes network services by steering traffic through an ordered sequence of virtual network functions (VNFs).",
    outcome: "Expertise in SFC architecture, NSH encapsulation, traffic steering policies, and dynamic VNF insertion in SDN/NFV environments.",
    cos: [4, 6],
    setup: "Mininet + Docker (VNFs as containers). Ryu/ONOS with SFC extensions. Wireshark for NSH header inspection. Traffic generators.",
    instructions: "Define service chains as ordered lists of VNFs (e.g., firewall → DPI → load balancer). Implement a classifier that matches traffic (by 5-tuple) and steers it through the chain using NSH encapsulation or flow-based redirecting. For NSH approach, use OVS with NSH patches to encapsulate packets. For flow-based approach, install flow entries on each switch along the path to redirect traffic. Implement dynamic update: insert a new VNF into an active chain without dropping existing flows (hitless insertion). Monitor chain latency and detect VNF failure — automatically bypass failed VNF. Provide SFC management REST API.",
    deliverables: ["SFC classifier and chain definition manager", "Traffic steering engine (NSH or flow-based)", "Dynamic VNF insertion (hitless update)", "VNF failure detection and chain bypass", "SFC management API and dashboard"],
    tools: ["Python", "OVS + NSH patches", "Ryu / ONOS", "Docker for VNFs", "Mininet"]
  },
  {
    id: "p54", unit: 4,
    title: "Network Analytics Pipeline with ML Integration for Root Cause Prediction",
    objective: "Build an end-to-end network analytics pipeline that ingests telemetry data, computes real-time metrics, and uses machine learning to predict potential failures before they occur.",
    outcome: "Full-stack network analytics implementation: data collection, stream processing, ML inference, and proactive alerting for predictive operations.",
    cos: [4, 6],
    setup: "Telemetry data from 20 devices (CPU, memory, interface errors, temperature). Kafka for streaming. ML model training environment. Grafana dashboard.",
    instructions: "Build a streaming analytics pipeline: telemetry → Kafka → Flink/Samza processor → feature store (Redis) → ML inference → prediction store (PostgreSQL). Engineer features: rolling window statistics (mean, std-dev, trend, seasonality) per metric. Train ML models (Random Forest, XGBoost, LSTM) on historical data with labels: 'device_failed' (hardware failure within next 24h), 'interface_flap', 'degraded_performance'. Implement online inference: each telemetry batch triggers feature computation and model scoring. When failure probability > threshold, generate predictive incident. Add SHAP explanations to predictions. Measure prediction lead time and accuracy.",
    deliverables: ["Telemetry ingestion and stream processing pipeline", "Feature engineering for failure prediction", "ML model training with failure classification", "Online inference with SHAP explanations", "Predictive incident dashboard with lead-time metrics"],
    tools: ["Python/Java", "Kafka + Kafka Streams / Flink", "scikit-learn / XGBoost / PyTorch", "SHAP / Lime", "Redis + PostgreSQL + Grafana"]
  },
  {
    id: "p55", unit: 4,
    title: "SLA Monitoring with Real-Time Dashboards and Predictive Breach Detection",
    objective: "Create a comprehensive SLA monitoring platform that tracks service level indicators (SLIs) in real time, computes SLO compliance, and predicts potential SLA breaches before they occur.",
    outcome: "Deep understanding of SLI/SLO/SLA definitions, real-time compliance monitoring, burn-rate alerts, and predictive breach detection using time-series analysis.",
    cos: [4, 5, 6],
    setup: "Service telemetry from 5 customer-facing services. Prometheus as metrics source. 12 months of historical SLI data for baseline modeling. Grafana for dashboards.",
    instructions: "Define SLIs (latency, availability, throughput, error rate) at service and customer level. Implement real-time SLO compliance computation: sliding window (24h, 7d, 30d) for each SLO. Implement burn-rate alerting: if error budget is being consumed at >2x the expected rate, alert before SLO is violated. Build predictive breach detection: using historical patterns and current burn rate, forecast time-to-SLO-breach. Add multi-pane dashboards: executive (SLA health per customer), operational (per-service SLIs with anomaly overlay), and predictive (forecast vs budget). Generate monthly SLA reports with breach analysis.",
    deliverables: ["SLI collection and SLO compliance engine", "Error budget tracking and burn-rate alerting", "Predictive breach detection with lead-time estimation", "Multi-pane SLA dashboards (executive, operational, predictive)", "Monthly SLA report generator with breach analysis"],
    tools: ["Python/Go", "Prometheus + Thanos", "Grafana", "PostgreSQL", "statsmodels / Prophet"]
  },
  {
    id: "p56", unit: 4,
    title: "Multi-Domain SDN Federation with Inter-Domain Service Orchestration",
    objective: "Design an SDN federation framework that interconnects multiple SDN domains (each with its own controller) and enables end-to-end service orchestration across domain boundaries.",
    outcome: "Advanced understanding of SDN federation architectures, inter-domain communication, policy-based peering, and cross-domain service provisioning.",
    cos: [4, 6],
    setup: "3 separate Mininet networks each with independent Ryu/ONOS controllers. Inter-domain links. Distributed database for state sharing. Python orchestrator.",
    instructions: "Implement a federation layer where each domain controller exposes a northbound interface for cross-domain requests. Define an inter-domain service request protocol: domain A requests a path through domain B with bandwidth, latency, and coloring constraints. Implement inter-domain path computation using hierarchical PCE pattern: each domain computes internal feasible segments, federated orchestrator stitches them. Handle policy: each domain defines export/import policies (e.g., 'export only customer-facing links, not internal backbone'). Provide end-to-end service visibility: dashboard showing per-domain segments, total latency, and per-domain resource contribution.",
    deliverables: ["Multi-domain SDN federation framework", "Inter-domain service request protocol", "Hierarchical PCE path computation across domains", "Policy-based link export/import configuration", "End-to-end multi-domain service visibility dashboard"],
    tools: ["Python", "Ryu / ONOS", "Mininet", "Redis for distributed state", "Docker Compose"]
  },
  {
    id: "p57", unit: 4,
    title: "Intent Translation and Formal Verification Engine for Network Policies",
    objective: "Build an engine that translates high-level network policies (security, QoS, availability) into formal logic, verifies them using model checking, and deploys verified configurations.",
    outcome: "Expertise in formal methods applied to networking, model checking, SAT/SMT-based verification, and verified policy deployment.",
    cos: [4, 6],
    setup: "Network model in Python (abstract topology with capacities). SMT solver (Z3). NETCONF and OpenFlow target environments. Real policy documents from campus/enterprise.",
    instructions: "Define a policy language covering common constraints: reachability, waypoint (traffic must pass through Firewall_A), isolation (VLAN10 cannot reach VLAN20), and capacity (link utilization < 80%). Translate policies into SMT logic: each network device state is a set of variables, forwarding behavior is a set of constraints, policies are additional constraints. Use Z3 to check satisfiability of the combined system. If satisfiable, extract a model (wire values) and compile to device-specific configurations (OpenFlow flows or NETCONF edits). If unsatisfiable, produce a minimal unsatisfiable core showing conflicting policies. Add traffic generation: simulate random traffic and verify forwarding matches policy intent.",
    deliverables: ["Network policy language definition and parser", "SMT-based model checker (Z3 integration)", "Minimal unsatisfiable core reporter for conflicts", "Verification-to-config compiler (OpenFlow + NETCONF)", "Traffic simulation and forwarding verification module"],
    tools: ["Python", "Z3-Py", "NetworkX", "ncclient + Ryu", "pytest for verification tests"]
  },
  {
    id: "p58", unit: 4,
    title: "Virtual Network Function Lifecycle Manager with Health Monitoring",
    objective: "Build a VNF lifecycle manager that handles the complete lifecycle of virtual network functions including onboarding, instantiation, scaling, updating, healing, and termination with comprehensive health monitoring.",
    outcome: "Deep practical knowledge of VNF lifecycle management, health monitoring, Graceful shutdown, rolling upgrades, and auto-healing in NFV environments.",
    cos: [4, 6],
    setup: "Docker Swarm or Kubernetes cluster. 5 sample VNFs (vRouter, vFW, vLB, vDPI, vProbe). Prometheus for health monitoring. Python VNFM.",
    instructions: "Implement VNF lifecycle: Onboard (upload VNFD package and artifact), Instantiate (deploy on K8s with computed resources), Configure (apply initial config via Netconf/day-1 operations), Scale (horizontal/vertical based on load metrics), Update (rolling update of VNF software with zero traffic loss), Heal (detect health failure via Prometheus alert, restart or migrate VM/container), Terminate (graceful shutdown, de-register from services). Implement health monitoring: probe VNFs via SNMP/HTTP health endpoints, track CPU/memory/connections, compute health score. Generate VNF lifecycle events as alarms. Measure scaling convergence time and heal MTTR.",
    deliverables: ["VNF lifecycle manager covering 7 phases", "Health monitoring engine with health score computation", "Auto-scaling and auto-healing with configurable policies", "Rolling update with zero traffic loss", "VNF lifecycle alarm generation and dashboard"],
    tools: ["Python", "Kubernetes API / Docker SDK", "Prometheus + AlertManager", "ncclient for VNF config", "Grafana"]
  },
  {
    id: "p59", unit: 4,
    title: "Network Observability Platform with eBPF-Based Deep Packet Inspection",
    objective: "Design a network observability platform that uses eBPF (extended Berkeley Packet Filter) to capture and analyze network packets in the Linux kernel, providing deep visibility without application modification.",
    outcome: "Cutting-edge skills in eBPF programming, kernel-level network observability, real-time flow analysis, and low-overhead packet inspection.",
    cos: [4, 6],
    setup: "Linux 5.10+ kernel with BCC/libbpf. eBPF development environment. Traffic generators producing HTTP, DNS, TCP, and custom protocols. Grafana for visualization.",
    instructions: "Write eBPF programs attached to XDP and tc hooks that capture packet headers and compute flow statistics (5-tuple, packet count, byte count, inter-arrival time, TCP flags). Use BPF maps (hashmaps, per-CPU arrays) to store flow state efficiently. Implement a userspace agent that periodically reads BPF maps and exports metrics via Prometheus or Kafka. Build higher-level observability features: TCP connection tracking with latency distributions, DNS query monitoring without pcap library, and HTTP request/response size distributions. Measure overhead: compare CPU/memory of eBPF-based monitoring vs traditional libpcap. Provide a rich Grafana dashboard.",
    deliverables: ["eBPF programs for XDP/tc packet capture", "Flow state BPF maps with per-CPU efficiency", "Userspace observability agent with Prometheus export", "DNS/TCP/HTTP-level monitoring modules", "Performance overhead report (CPU/memory vs libpcap)"],
    tools: ["C (eBPF)", "BCC / libbpf", "Python (userspace agent)", "Prometheus + Grafana", "iperf / wrk for load generation"]
  },
  {
    id: "p60", unit: 4,
    title: "Cloud-Native NMS Platform with Kubernetes-Native Microservices Architecture",
    objective: "Design and implement a cloud-native Network Management System as a set of Kubernetes-native microservices, with service discovery, auto-scaling, health checks, and declarative configuration.",
    outcome: "Full-stack experience building cloud-native network management platforms, combining K8s patterns, microservices design, and NMS domain logic.",
    cos: [4, 6],
    setup: "Kubernetes cluster (minikube/k3s). Docker registry. 8+ microservices: discovery, polling, alarm, inventory, telemetry, notification, API gateway, UI. Helm for packaging.",
    instructions: "Design microservice boundaries aligning with NMS domains: discovery-service (SNMP crawling), polling-service (scheduled metric collection), alarm-service (trap reception + correlation), inventory-service (device + topology storage), telemetry-service (gRPC streaming), notification-service (alert routing), api-gateway (REST/GraphQL). Each service: stateless (state in PostgreSQL/Redis), exposes health/liveness/readiness probes, auto-scales based on CPU/custom metrics, registers with K8s service discovery. Implement graceful degradation: if alarm-service fails, polling-service continues and queues events. Use Helm to deploy all services with configurable resource limits. Include a comprehensive observability stack (Prometheus + Loki + Tempo).",
    deliverables: ["8 microservice NMS platform on Kubernetes", "Helm charts for deployment with configurable parameters", "Service mesh (Istio/Linkerd) integration for mTLS", "Graceful degradation and fault isolation test suite", "Full observability stack (metrics, logs, traces) dashboard"],
    tools: ["Go/Python/Node.js", "Kubernetes + Helm", "Docker", "PostgreSQL + Redis", "Prometheus + Loki + Tempo + Grafana"]
  },
];
