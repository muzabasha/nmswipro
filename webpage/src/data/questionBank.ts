import type { QuestionBankItem } from './types';

export const questionBank: Record<string, QuestionBankItem[]> = {
  "1": [
    {
      id: "qb-1-1",
      type: "Scenario-based",
      marks: 10,
      question: "A mid-sized ISP is deploying a new NMS to manage 5000 devices across 20 Points of Presence. The network comprises routers, switches, firewalls, and servers from 5 different vendors. As the NMS architect, design an FCAPS-based management framework for this ISP. Describe what components you would include under each FCAPS domain and explain how the framework addresses multi-vendor heterogeneity.",
      scheme: "FCAPS definition and context (2 marks)\nFault Management component design (2 marks)\nConfiguration Management design (2 marks)\nAccounting/Performance/Security components (2 marks)\nMulti-vendor integration strategy (2 marks)",
      solution: "FCAPS framework addresses five management domains: Fault Management would include an SNMP-based alarm collector with trap receivers, a correlation engine to suppress duplicate alarms from different vendors, and a ticketing system integrated with the NOC dashboard. Configuration Management would use a centralised configuration repository with version control, automated backup for each device type, and NETCONF/YANG-based rollback capabilities where supported. Accounting Management would track bandwidth usage per customer with RADIUS integration and generate billing reports. Performance Management would deploy polling at 5-minute intervals for CPU/memory/interface utilisation, with historical trending using RRD databases. Security Management would implement RBAC, audit logging of all NMS actions, and SNMPv3 with encryption. Multi-vendor heterogeneity is addressed through an abstraction layer that normalises vendor-specific MIBs and syslog formats into a common event taxonomy, allowing the NOC to manage all devices through unified dashboards regardless of underlying vendor."
    },
    {
      id: "qb-1-2",
      type: "Scenario-based",
      marks: 10,
      question: "A large enterprise network experienced a complete outage due to a misconfiguration pushed simultaneously to 200 core switches. Postmortem revealed that the NMS had no configuration validation or rollback capability. Propose a Configuration Management strategy using FCAPS principles that would have prevented this outage. Include specific mechanisms for configuration validation, change approval workflows, and automated rollback procedures.",
      scheme: "Configuration Management fundamentals in FCAPS (2 marks)\nConfiguration validation mechanisms (2 marks)\nChange approval workflow design (2 marks)\nAutomated rollback procedures (2 marks)\nPreventive controls to avoid mass configuration errors (2 marks)",
      solution: "A robust Configuration Management strategy under FCAPS would include three layers of protection. First, pre-deployment validation: before any configuration is applied, it must pass syntax checking, semantic validation (does the ACL reference a non-existent VLAN?), and impact analysis (simulate the change on a staging device). Second, a staged rollout with a change approval workflow: proposed configuration is submitted through a change management system with risk classification, approved by a senior engineer, scheduled in a maintenance window, and deployed to a pilot device first. If the pilot succeeds, the change proceeds to 10% then 100%. Third, automated rollback: the NMS retains the last-known-good configuration for each device. If the change causes link flaps or CPU spikes, the NMS automatically reverts within 60 seconds. These mechanisms would have caught the error, limited blast radius, and recovered the network within minutes."
    },
    {
      id: "qb-1-3",
      type: "Problem Solving",
      marks: 10,
      question: "An NMS must poll 2000 SNMP-enabled devices every 5 minutes. Each device has 150 OIDs to poll, and each SNMP GET request-response carries an average payload of 120 bytes. Calculate: (a) The total network bandwidth consumed by SNMP polling per hour. (b) The polling load per device in requests per second. (c) If SNMP traps generate an additional 500 events per hour with 256 bytes each, calculate the total monthly bandwidth consumption (30 days). Show all calculations.",
      scheme: "Formula for polling bandwidth (2 marks)\nPart (a) calculation with units (3 marks)\nPart (b) calculation (2 marks)\nPart (c) with trap inclusion (3 marks)",
      solution: "(a) Each device: 150 OIDs. Requests per poll = 150. Polls per hour = 60/5 = 12. Total requests/hr = 2000 x 150 x 12 = 3,600,000. Each = 120 bytes. Bandwidth/hr = 3,600,000 x 120 = 432,000,000 bytes = 412 MB/hr. In bits: 412 x 8 = 3296 Mb/hr = 0.915 Mbps avg. (b) Per device: 150 requests per 300s = 150/300 = 0.5 req/s. (c) Traps: 500/hr x 256 = 128,000 bytes/hr = 0.122 MB/hr. Monthly trap = 0.122 x 24 x 30 = 87.84 MB. Monthly polling = 412 x 24 x 30 = 296,640 MB = 289.7 GB. Total monthly = 289.79 GB."
    },
    {
      id: "qb-1-4",
      type: "Industry Oriented",
      marks: 10,
      question: "Several large ISPs are transitioning from SNMP-based management to streaming telemetry (gNMI/gRPC). Compare SNMP and streaming telemetry across: (a) Data transport model (pull vs push), (b) Efficiency for large-scale networks, (c) Data modelling flexibility, (d) Security mechanisms, and (e) Real-world adoption trends at Google, AT&T, and Cisco. Recommend for a tier-2 ISP with 10,000 devices.",
      scheme: "Pull vs push comparison (2 marks)\nScalability and efficiency (2 marks)\nData modelling comparison (2 marks)\nSecurity and industry adoption (2 marks)\nRecommendation (2 marks)",
      solution: "(a) SNMP uses pull model with request overhead and stale data. Streaming telemetry uses push model, streaming data at configured intervals or on-change, eliminating polling. (b) At 10,000 devices, SNMP polling consumes significant bandwidth even at 5-min intervals (~900 Mbps). Streaming telemetry reduces bandwidth via protobuf-encoded gRPC streams, achieving sub-second freshness. (c) SNMP MIBs require RFC approvals for extensions. YANG supports augmentation and modularity. (d) SNMPv3 USM/VACM is complex; many still use SNMPv2c. gNMI enforces TLS by default. (e) Google B4, AT&T Domain 2.0, and Cisco IOS-XR all use streaming telemetry as primary collection. Recommendation: hybrid approach — SNMPv3 for legacy, gNMI on newer devices, targeting 80% telemetry coverage within 2 years."
    },
    {
      id: "qb-1-5",
      type: "Critical Thinking",
      marks: 10,
      question: "The OSI Network Management framework and TMN have coexisted for decades. Critically analyse why TMN has seen limited adoption in enterprise IT networks despite its comprehensive architecture, while SNMP-based management dominates. What lessons from TMN's layered architecture could improve modern cloud-scale NMS design?",
      scheme: "OSI framework strengths/limitations (2 marks)\nTMN layered architecture analysis (2 marks)\nLimited adoption reasons (3 marks)\nApplicable TMN concepts (3 marks)",
      solution: "SNMP dominates due to simplicity, low cost, and ubiquitous support. TMN's five-layer architecture is theoretically comprehensive but practically complex. Limited adoption: (1) TMN assumes telecom-grade dedicated management networks (x.25/SS7), prohibitively expensive for IT; (2) Q3 interfaces are complex; SNMP's simplicity won; (3) TMN designed for static networks, not dynamic IP/cloud. Lessons: Element-to-Network Management separation mirrors SDN; Service-to-Business alignment anticipates intent-based networking. Cloud-scale NMS benefits from TMN's hierarchical management applied to multi-region Kubernetes — each cluster as 'element', global orchestrator handles cross-cluster 'network management'."
    },
    {
      id: "qb-1-6",
      type: "Scenario-based",
      marks: 10,
      question: "A university campus network with 5000 users and 2000 devices is implementing RMON for proactive fault detection. The team needs to decide between RMON1 (9 groups) and RMON2 (application-layer groups). Design a deployment strategy covering probe placement, RMON group selection for campus threats, and threshold configuration for abnormal traffic detection.",
      scheme: "RMON1 vs RMON2 differences (2 marks)\nProbe placement strategy (2 marks)\nRMON group selection (3 marks)\nThreshold framework (3 marks)",
      solution: "RMON2 adds IP/application-layer visibility essential for campus threats like DNS amplification or P2P traffic. Probe placement: one probe at internet gateway, one at each building distribution uplink, optionally on wireless controller uplink. Groups: Statistics (byte/packet/error counts), History (hourly/daily trending), Alarm (critical — thresholds on 'broadcast >20%'), Event (logs alarms), Host Top N (top talkers for anomaly detection), Protocol Distribution (application mix). Thresholds: rising at 70%, falling at 40% with hysteresis to prevent flapping. CRC errors >1% on any port triggers alarm. Email traps for cross-building violations, SNMP traps to NMS for all events."
    },
    {
      id: "qb-1-7",
      type: "Critical Thinking",
      marks: 10,
      question: "SNMPv3 introduced USM and VACM to address SNMPv1/v2c weaknesses. Despite these, adoption remains below 30%. Critically analyse: (a) Operational barriers preventing adoption, (b) Whether security benefits justify migration for a 5000-device network, (c) Alternative approaches to secure management data collection.",
      scheme: "SNMPv3 security features (2 marks)\nOperational barriers (3 marks)\nCost-benefit for migration (3 marks)\nAlternative approaches (2 marks)",
      solution: "(a) Barriers: USM requires synchronised credentials across all devices — major key management problem. Many devices lack SNMPv3 encryption hardware support. Configuration complexity — from single community string to users, auth/privacy protocols, MIB views across thousands of devices. (b) For 5000 devices, cost often exceeds benefit if management network is physically isolated. SNMPv3 justified when: devices accessible from untrusted networks, regulatory compliance (PCI-DSS), or management-plane attack risk is high. (c) Alternatives: dedicated management VLAN with ACLs; SSH tunneling for SNMP; management proxy terminating SNMP and re-encrypting via TLS; or bypass SNMP entirely with NETCONF/SSH or gNMI/TLS."
    },
    {
      id: "qb-1-8",
      type: "Problem Solving",
      marks: 10,
      question: "Design a MIB for a smart switch with 48 RJ45 + 4 SFP+ uplink ports. Each port needs: operational status, speed, duplex, CRC errors, packets, bytes. System needs: CPU, memory, temperature, uptime. (a) Design the MIB tree with OID assignments. (b) Calculate total OIDs needed. (c) Explain how a manager walks the MIB to discover all ports automatically.",
      scheme: "MIB tree structure (3 marks)\nOID count calculation (3 marks)\nMIB walk mechanism (2 marks)\nImplementation considerations (2 marks)",
      solution: "(a) OID tree: root .1.3.6.1.4.1 (enterprises), private number 99999. sysInfo (1) with cpuUtil(.1), memUtil(.2), temperature(.3), upTime(.4). portTable (2) with portEntry (1) indexed by portIndex(1-52). Each entry: portIndex(.1), operStatus(.2), speed(.3), duplex(.4), crcErrors(.5), packets(.6), bytes(.7). (b) 4 system OIDs + 52 ports x 6 = 312 + 3 table definitions = 319 OIDs. (c) Manager sends GetNext from .1.3.6.1.4.1.99999.2.1.1. Agent returns first portIndex. Repeated GetNext walks all columns and rows. When GetNext returns outside portTable, enumeration complete. Allows automatic discovery of any port count."
    },
    {
      id: "qb-1-9",
      type: "Industry Oriented",
      marks: 10,
      question: "A multinational corporation must ensure its NMS complies with GDPR. The NMS collects IP addresses, traffic patterns, configurations, and login logs from 50,000 employees across 12 countries. Identify privacy risks in each FCAPS domain and propose a framework including data minimisation, retention policies, and breach notification.",
      scheme: "GDPR requirements for NMS (2 marks)\nPrivacy risks per FCAPS domain (3 marks)\nData minimisation and retention (3 marks)\nBreach notification framework (2 marks)",
      solution: "Fault: alarm logs contain IP addresses — pseudonymise after correlation. Configuration: configs may contain RADIUS secrets and credentials — store encrypted, audit all access. Accounting: CDRs contain communication patterns — strict 90-day retention, purpose limitation. Performance: traffic patterns could reveal behaviour — use aggregates only. Security: login logs contain user IDs — document as Article 30 processing activity. Framework: embed DPIA in change management; enforce privacy-by-design at probe level; automated purging with legal hold overrides; integrate with corporate breach notification system triggering 72-hour notification per Article 33 for any NMS security event involving personal data."
    },
    {
      id: "qb-1-10",
      type: "Scenario-based",
      marks: 10,
      question: "You are a consultant for a hospital network that suffered a ransomware attack through their NMS. Attackers exploited default SNMP community strings on 200 medical devices. Design a Security Management framework under FCAPS addressing: (a) Management plane hardening, (b) Management traffic anomaly detection, (c) Incident response for NMS compromise, (d) Recovery and lessons learned.",
      scheme: "Management plane hardening (2.5 marks)\nAnomaly detection (2.5 marks)\nIncident response (2.5 marks)\nRecovery and improvement (2.5 marks)",
      solution: "(a) Enforce SNMPv3 AES-256/SHA-512 across all devices; dedicated management VLAN with strict ACLs; disable SNMP write on medical devices; credential rotation every 90 days. (b) Management-plane IDS profiling normal SNMP patterns; alerts on SNMP writes from unknown IPs or bulk OID walks outside windows; SIEM logging; brute-force detection via behavioural analytics. (c) Integrate NMS alerts into IR playbook; automate containment via SDN controller; preserve NMS logs as forensic evidence; notify if PHI exposed (HIPAA). (d) Offline NMS backups; clean restore, not in-place cleanup; post-incident review; quarterly security baseline updates; tabletop exercises simulating NMS compromise."
    },
    {
      id: "qb-1-11",
      type: "Critical Thinking",
      marks: 10,
      question: "SNMP traps are UDP-based and unreliable. Critically evaluate: (a) Trap reliability mechanisms (including informs), (b) Scalability of informs vs traps in a 10,000-device network, (c) Alternative reliable event notification approaches, (d) Whether traps remain relevant in the streaming telemetry era.",
      scheme: "Trap vs Inform reliability (2.5 marks)\nScalability at 10K devices (2.5 marks)\nAlternative mechanisms (2.5 marks)\nRelevance of traps (2.5 marks)",
      solution: "(a) SNMPv1/v2c traps are fire-and-forget UDP. Informs add acknowledgement and retransmission but require manager-side state tracking. (b) At 10,000 devices, informs impose significant state overhead — NMS handles 50K traps/hr but caps at ~5K informs/hr due to retransmission queues. (c) Alternatives: syslog with TLS/TCP; NETCONF notifications (SSH-based); message queue (Kafka) with replay; webhooks/HTTP/2; gNMI streaming. (d) Traps remain relevant for legacy coverage but are supplanted by telemetry. Recommendation: traps for legacy, gNMI/NETCONF notifications for all new deployments."
    },
    {
      id: "qb-1-12",
      type: "Problem Solving",
      marks: 10,
      question: "An NMS monitors 3000 devices via SNMP at 3-minute intervals, 80 OIDs each, 80-byte responses, over a 1 Gbps dedicated link. (a) Calculate utilisation percentage. (b) With 20% annual growth, when will utilisation reach 80%? (c) Propose three strategies keeping utilisation below 50% for 5 years with bandwidth savings.",
      scheme: "Utilisation calculation (3 marks)\nGrowth projection (3 marks)\nStrategies with savings (4 marks)",
      solution: "(a) Requests/hr: 3000 x 20 x 80 = 4,800,000. Bytes/hr: 4,800,000 x 80 = 384,000,000 = 106,667 B/s = 0.853 Mbps = 0.085% of 1 Gbps. Real overhead ~2-3x = 0.25%. (b) Year 5: 3000 x 1.2^5 = 7465 devices. Utilisation = 0.085% x 7465/3000 = 0.212% — still negligible. Real constraint is NMS processing, not bandwidth. (c) (1) GetBulk reduces requests 90%. (2) Adaptive polling — critical every minute, non-critical every 15 minutes, reduces average 40%. (3) Streaming telemetry on 50% of devices eliminates polling for those. All well within 50% headroom."
    },
    {
      id: "qb-1-13",
      type: "Industry Oriented",
      marks: 10,
      question: "ServiceNow and BMC Helix are dominant ITSM platforms integrating with NMS. Compare across: (a) CMDB integration with NMS discovery, (b) Event management and alarm correlation, (c) Workflow automation for incident-to-change, (d) Cloud-native scalability. Provide a selection framework.",
      scheme: "CMDB integration (2.5 marks)\nEvent management (2.5 marks)\nWorkflow automation (2.5 marks)\nSelection framework (2.5 marks)",
      solution: "(a) ServiceNow CMDB excels with ITOM discovery reconciliation; richer NMS connectors (SolarWinds, Nagios, PRTG). BMC Helix CMDB integrates with BMC Discovery and third-party federation. (b) ServiceNow Event Management provides AIOps deduplication and topological correlation. BMC Helix Operations offers similar with TrueSight integration. ServiceNow event-to-incident conversion is more mature. (c) ServiceNow Flow Designer offers low-code event-to-incident-to-change automation. BMC Helix Control-M requires more custom development. ServiceNow ITIL out-of-box workflows reduce implementation time. (d) Both cloud-native — ServiceNow single instance, BMC Helix Kubernetes microservices. Selection: ServiceNow for ITSM modernisation; BMC Helix for deep BMC tool integration. Key criteria: existing ITSM, connectors needed, AIOps maturity, timeline."
    },
    {
      id: "qb-1-14",
      type: "Critical Thinking",
      marks: 10,
      question: "FCAPS was standardised in the 1980s. Assess whether it remains valid for SDN, NFV, cloud, and intent-based systems. Which layers need rethinking? What new dimensions should be added?",
      scheme: "FCAPS original context (2 marks)\nStrengths still relevant (2 marks)\nLimitations for modern networks (3 marks)\nProposed extensions (3 marks)",
      solution: "FCAPS remains conceptually useful but falls short in four areas. (1) SDN decouples control/data planes — traditional fault isolation fails; needs 'Control Plane Management'. (2) NFV elasticity — Configuration Management must handle template instantiation, not just device configs. (3) Cloud makes element management meaningless; must add 'Service Management'. (4) Intent-based systems need 'Policy Management' spanning all FCAPS layers. Proposed extensions: add 'Orchestration Management' (NFV/SDN lifecycle) and 'Policy Management' (intent translation). Rename Accounting to 'Business Management' (SLA/cost analytics). Revised framework: FCPOPS — Fault, Configuration, Policy, Orchestration, Performance, Security."
    },
    {
      id: "qb-1-15",
      type: "Scenario-based",
      marks: 10,
      question: "A telecom operator's NMS uses SNMPv2c with community string 'public' on 15,000 network elements. A security audit shows external attackers can read sensitive configs. Design a phased migration to SNMPv3: (a) Phased rollout with risk mitigation, (b) Credential management for 15,000 devices, (c) Backward compatibility during transition, (d) Validation and rollback procedures.",
      scheme: "Phased migration strategy (2.5 marks)\nCredential management (2.5 marks)\nBackward compatibility (2.5 marks)\nValidation and rollback (2.5 marks)",
      solution: "Phase 1 (Pilot — 1 month): 200 devices across vendors. Configure SNMPv3 SHA-512/AES-256. Validate connectivity while keeping v2c. Criteria: 100% reachable via v3, no CPU increase. Phase 2: Deploy HashiCorp Vault for automated credential generation, rotated every 90 days. Phase 3 (Bulk — 3 months): Enable v3 on 5,000 devices/month via automation. Keep v2c restricted to management VLAN. Phase 4 (Hardening — 2 months): Disable v2c on 80% of devices. For 20% lacking v3 support, deploy SNMP proxy (v3 to v2c locally). Validation: daily connectivity reports. Rollback: if device shows SNMP loss for >4 hours, auto-revert to v2c."
    },
  ],
  "2": [
    {
      id: "qb-2-1",
      type: "Scenario-based",
      marks: 10,
      question: "A cloud data centre operator managing 50,000 bare-metal servers and 20,000 virtual switches needs to adopt model-driven management. Compare YANG/NETCONF against existing SNMP-based management for this environment. Design a YANG model hierarchy for managing a top-of-rack switch with VLAN, ACL, QoS, and routing configurations. Justify your choice of YANG data node types (containers, lists, leaf-lists).",
      scheme: "YANG/NETCONF vs SNMP comparison (2 marks)\nYANG model hierarchy (3 marks)\nData node type justification (3 marks)\nDeployment considerations (2 marks)",
      solution: "YANG/NETCONF wins: (1) Transaction safety — atomic full config via edit-config vs individual SNMP SETs; (2) Data modelling flexibility — lists with keys model ports naturally, augmentations add vendor extensions; (3) Operational data — get retrieves config+state in one response. YANG model: module 'tor-switch' with container 'system' (hostname, DNS leaf-list), list 'interfaces' keyed by 'name' (mtu, enabled, description), list 'vlan' (vlan-id, member-interfaces leaf-list), container 'routing' (static-routes), list 'acl'. Containers for singleton, lists for multi-instance, leaf-lists for unordered sets. Deployment: read-only YANG for state alongside SNMP first, then write-enable on less critical groups."
    },
    {
      id: "qb-2-2",
      type: "Scenario-based",
      marks: 10,
      question: "You are designing a YANG model for an L3 VPN service provider. The model must capture: customer VPN endpoints, MPLS labels, BGP route targets/route distinguishers, and QoS profiles. Create a YANG module structure showing how containers, lists, and leaf-references model relationships. Explain multi-tenancy handling and how different customers cannot see each other's configurations.",
      scheme: "YANG module structure (3 marks)\nContainer/list/leaf-ref usage (2 marks)\nMulti-tenancy model (2 marks)\nAccess control and isolation (3 marks)",
      solution: "Module 'vpn-service': container with list 'customers' keyed by 'customer-id', containing 'customer-name' and list 'vpns' keyed by 'vpn-name'. Each VPN: 'route-distinguisher', list 'route-targets', container 'qos-profile'. Container 'endpoints' with list 'ce-device' keyed by 'ce-name', leafref to customer CE, leaf 'vpn-reference' leafref to vpns/vpn-name. Multi-tenancy: NACM path-based restrictions — each domain accesses only their customer subtree. 'when' statements conditionalise schema per customer. Data isolation: path-based NACM denying access to customers[customer-id != $USER-customer]. get-config filters strip restricted subtrees per user."
    },
    {
      id: "qb-2-3",
      type: "Problem Solving",
      marks: 10,
      question: "A network operator pushes VLAN config to 500 switches via NETCONF. Each edit-config takes 2.5 seconds. (a) Calculate total sequential time. (b) With 10 concurrent sessions, calculate new total and identify bottlenecks. (c) Design a batched approach with session reuse (5s overhead per 50-device batch) and calculate time savings.",
      scheme: "Sequential time calculation (2 marks)\nParallel execution analysis (3 marks)\nBottleneck identification (2 marks)\nBatched approach with calculation (3 marks)",
      solution: "(a) Sequential: 500 x 2.5 = 1250s = 20.83 min. (b) 10 parallel: 50 rounds x (2.5 + 0.5 overhead) = 150s = 2.5 min. Bottleneck: NMS connection handling — beyond 50-100 concurrent sessions, OS limits on file descriptors cause diminishing returns. (c) Batch 50 with session reuse (pre-established sessions eliminate TCP/SSH handshake). 10 batches x (5s + 2.5s) = 75s = 1.25 min. Session reuse reduces per-switch time from 2.5s to ~1s (without connection setup)."
    },
    {
      id: "qb-2-4",
      type: "Industry Oriented",
      marks: 10,
      question: "OpenConfig is an operator-driven initiative for vendor-neutral YANG models. Critically assess: (a) How OpenConfig differs from native vendor YANG, (b) Operational benefits of standardising on OpenConfig for multi-vendor networks, (c) Adoption challenges, (d) Whether OpenConfig can replace vendor-native models entirely.",
      scheme: "OpenConfig vs native YANG (2.5 marks)\nOperational benefits (2.5 marks)\nAdoption challenges (2.5 marks)\nCompleteness assessment (2.5 marks)",
      solution: "(a) OpenConfig models 'desired state' — what network should do, not how vendor implements. Consistently structured across vendors. (b) Benefits: single management stack across vendors; identical operational state paths; simplified training; reduced vendor lock-in. (c) Challenges: coverage gaps (advanced routing, MPLS-TE); vendor translation bugs; migration cost. (d) OpenConfig covers 70-80% of common use cases (interfaces, BGP, QoS) but can't replace native for advanced features. Best practice: OpenConfig-first with native fallback for platform-specific needs."
    },
    {
      id: "qb-2-5",
      type: "Critical Thinking",
      marks: 10,
      question: "NETCONF uses SSH with transactions; RESTCONF uses HTTP with REST. Critically compare: (a) Transaction semantics and rollback, (b) Performance and message overhead, (c) Programming model complexity, (d) Use case suitability. Provide a decision tree.",
      scheme: "Transaction/rollback comparison (2.5 marks)\nPerformance analysis (2.5 marks)\nDeveloper experience (2.5 marks)\nDecision tree (2.5 marks)",
      solution: "(a) NETCONF: lock-edit-validate-commit with confirmed-commit for two-phase. RESTCONF: atomic per-resource but no multi-op transaction. NETCONF wins for critical changes. (b) NETCONF XML overhead 1.5-2x. RESTCONF over HTTP/2 offers multiplexing and header compression. (c) RESTCONF wins — HTTP verbs, JSON, familiar REST patterns. NETCONF requires XML, namespaces, SSH libraries. (d) Decision tree: Device config with transactions -> NETCONF. Service orchestration APIs -> RESTCONF. End-user portals -> RESTCONF. Monitoring -> RESTCONF. Bootstrap -> NETCONF."
    },
    {
      id: "qb-2-6",
      type: "Scenario-based",
      marks: 10,
      question: "A provider migrating CE routers from CLI to YANG/NETCONF. 30% of 5000 routers lack NETCONF support. Design migration: (a) Device compatibility assessment, (b) Proxy for non-NETCONF devices, (c) YANG coverage checklist, (d) Rollback plan.",
      scheme: "Device compatibility (2 marks)\nProxy architecture (3 marks)\nYANG coverage validation (2 marks)\nRollback mechanisms (3 marks)",
      solution: "(a) Inventory with OS version: IOS 12.x lacks NETCONF; IOS-XE 16+/IOS-XR 6+/JunOS 14+ support. (b) Config gateway terminates NETCONF, translates to CLI for legacy devices. Exposes YANG model, maintains desired state cache with periodic reconciliation. (c) Map each CLI command to YANG path. Extend model for missing paths via exec operations. Stage on 10% first. (d) confirmed-commit with 10-minute auto-rollback. For proxy devices: diff-based rollback pushing previous CLI config on failure."
    },
    {
      id: "qb-2-7",
      type: "Problem Solving",
      marks: 10,
      question: "A YANG module defines 1000 ACL entries with 20 leafs each. (a) Calculate XML payload for NETCONF edit-config (15 bytes/leaf, 40 bytes XML markup). (b) JSON for RESTCONF (25 bytes JSON overhead). (c) Transmission time over 100 Mbps with 20% overhead. (d) Propose two optimisations.",
      scheme: "XML size (2.5 marks)\nJSON size (2.5 marks)\nTransmission time (2.5 marks)\nOptimisations (2.5 marks)",
      solution: "(a) XML: 1000 x 20 x (15+40) = 1,100,000 bytes = 1.05 MB. (b) JSON: 1000 x 20 x (15+25) = 800,000 bytes = 781 KB (26% smaller). (c) XML+SSH: 1.05 x 1.2 = 1.26 MB. At 100 Mbps: 1.26 x 8 / 100 = 0.101s = 101ms. JSON+HTTP: 0.781 x 1.2 = 0.937 MB. At 100 Mbps: 937 x 8 / 100 = 75ms. Both sub-second — bottleneck is device parsing, not network. (d) (1) Use YANG defaults — omit unchanged leafs. If 8/20 have defaults, payload reduces 40%. (2) Use merge sending only changed entries (typically 5-10%)."
    },
    {
      id: "qb-2-8",
      type: "Industry Oriented",
      marks: 10,
      question: "Cisco, Juniper, and Huawei have proprietary YANG models even for common features. Analyse challenges for multi-vendor networks. Evaluate how RFC 8525 (YANG Library) and RFC 8528 (Schema Mount) help. Propose architecture using yangcatalog.org and OpenConfig for vendor-neutral mgmt.",
      scheme: "Multi-vendor challenges (2 marks)\nRFC 8525/8528 utility (3 marks)\nYangcatalog.org role (2 marks)\nVendor-neutral architecture (3 marks)",
      solution: "Challenges: different module names for equivalent features (Cisco vs Juniper vs Huawei); different data organisation; different defaults — identical patches produce different results. RFC 8525 lets NMS query supported modules/versions, enabling automatic adaptation. RFC 8528 mounts remote device schema as extensions. Architecture: YANG Schema Registry (yangcatalog.org) stores vendor-to-OpenConfig mappings. NMS targets OpenConfig paths; YANG Translator converts to vendor-specific. On new device, retrieve YANG library, match to yangcatalog entries, download mapping rules. Write-once automation across any YANG-compliant device."
    },
    {
      id: "qb-2-9",
      type: "Critical Thinking",
      marks: 10,
      question: "Evaluate whether YANG's modelling paradigm is sufficient for intent-based networking. (a) Can YANG express business-level intent ('99.99% availability for gold')? (b) Network-wide invariants ('no routing loops')? (c) What aspects require extensions beyond YANG?",
      scheme: "Business-level intent (3 marks)\nNetwork-wide invariants (3 marks)\nLimitations and extensions (4 marks)",
      solution: "(a) YANG can model declarative service specs — container 'vpn-sla' with 'availability-target' decimal-fraction range 0.99-0.9999. Must constraint validates gold >=0.9999. But translating to device configs needs external controller. (b) Must/when operates on single device — can't express cross-device invariants. Workaround: model entire topology in one YANG datastore (SDN approach) with must checking disjoint path IDs. (c) Extensions needed: temporal ('9AM-5PM guarantee'), probabilistic ('P99 <50ms'), cross-device (path disjointness), optimisation (minimise cost). These need IETF ALTO, constraint solvers, or intent controllers above YANG."
    },
    {
      id: "qb-2-10",
      type: "Scenario-based",
      marks: 10,
      question: "A large enterprise deploys NETCONF for zero-touch provisioning of new branch routers. Design a YANG model for bootstrap config (mgmt IP, DNS, NTP, NETCONF access, full config URL). Explain how ZTP uses copy-config and delete-config for lifecycle management.",
      scheme: "YANG bootstrap model (3 marks)\nZTP process flow (3 marks)\nNETCONF lifecycle operations (2 marks)\nSecurity considerations (2 marks)",
      solution: "YANG module 'ztp-bootstrap': container 'bootstrap' with mgmt-ip, mgmt-mask, default-gateway, leaf-list dns-servers, ntp-servers, container 'netconf-access' (users list keyed by username: ssh-key, privilege-level), leaf 'full-config-url'. ZTP flow: (1) DHCP with Option 43 -> bootstrap URL. (2) Download bootstrap XML. (3) edit-config:target=running. (4) NETCONF to NMS. (5) copy-config running->startup. (6) Managed state. Decom: delete-config:target=startup. Upgrade: copy-config to backup. Security: CMS-signed bootstrap data (RFC 8572), validated server cert, rotate credentials after full management established."
    },
    {
      id: "qb-2-11",
      type: "Critical Thinking",
      marks: 10,
      question: "A network engineer argues RESTCONF's lack of transactions makes it unsuitable for critical config changes. Evaluate: (a) RESTCONF PATCH/PUT vs NETCONF transaction model, (b) How ETags provide optimistic concurrency, (c) Application-level transaction pattern using RESTCONF, (d) Scenarios where NETCONF is irreplaceable.",
      scheme: "Transaction semantics (2.5 marks)\nETags and concurrency (2.5 marks)\nApplication-level pattern (2.5 marks)\nNETCONF-irreplaceable scenarios (2.5 marks)",
      solution: "(a) RESTCONF PATCH is atomic per-resource but unvalidated. NETCONF has explicit validate-before-apply. No multi-resource transactions in RESTCONF. (b) ETags: GET -> ETag, PATCH with If-Match. If config changed, 412 Precondition Failed. Prevents lost updates but no rollback. (c) Pattern: GET config (record ETag) -> PATCH to candidate -> POST validate -> POST commit?confirmed=300. POST cancel-commit for rollback. Requires candidate datastore support. (d) NETCONF irreplaceable when: multiple subtrees must change atomically; validation before running datastore; explicit locking; regulatory two-phase commit audit trails."
    },
    {
      id: "qb-2-12",
      type: "Problem Solving",
      marks: 10,
      question: "DevOps team uses RESTCONF for CI/CD to 100 devices. Each: GET(50ms), PATCH(200ms), verify GET(50ms). 50ms RTT. (a) Total sequential time. (b) With HTTP/2 multiplexing (50 concurrent streams, 5 concurrent device ops). (c) Architecture reducing to under 30 seconds.",
      scheme: "Sequential time (3 marks)\nHTTP/2 parallel time (3 marks)\nSub-30s architecture (4 marks)",
      solution: "(a) Per device: GET=150ms, PATCH=300ms, verify=150ms = 600ms. 100 devices = 60s. (b) HTTP/2 with 5 concurrent ops per device: per batch of 5 devices in parallel = max(GET,PATCH,verify) = 300ms. 100/5=20 batches x 300ms = 6s. (c) Architecture: HTTP/2 with 20 concurrent streams; 20 parallel devices per batch. GET->PATCH->verify = 300ms per batch. 5 batches x 300ms = 1.5s + overhead = ~5s. Use pre-established HTTP/2 connection pools."
    },
    {
      id: "qb-2-13",
      type: "Industry Oriented",
      marks: 10,
      question: "Compare AT&T Domain 2.0 and Verizon SDN-NFV transformations: (a) Role of YANG/NETCONF, (b) Scale and automation achieved, (c) Lessons learned, (d) Adoption strategy for mid-sized operators.",
      scheme: "YANG/NETCONF role (2.5 marks)\nScale and metrics (2.5 marks)\nLessons learned (2.5 marks)\nAdoption strategy (2.5 marks)",
      solution: "(a) AT&T ECOMP (later ONAP) used YANG for VNF descriptors and service templates. Verizon used YANG/NETCONF for underlay automation and OpenConfig for multi-vendor. (b) AT&T migrated 100K+ NFs, automated 80% of changes, saved $2.5B Capex. Verizon automated 20K+ configs, reduced provisioning from weeks to hours, 95% error reduction. (c) Start read-only before write; standardise on OpenConfig first; invest in YANG schema testing; build model-driven verification pipeline. (d) Path for mid-sized: operational state on one vendor (6 months); read-write interface/VLAN (12 months); 80% YANG-driven in 24 months; focus on top-20 change types (90% of changes)."
    },
    {
      id: "qb-2-14",
      type: "Scenario-based",
      marks: 10,
      question: "A monitoring tool collects state from 10,000 devices via NETCONF get (50 KB each). (a) Bandwidth and daily storage if polled every 30 min. (b) Design YANG subscription model (RFC 5277) reducing bandwidth 80% — specify paths and intervals. (c) Compare periodic polling vs event-driven subscription for interface flap detection.",
      scheme: "Bandwidth/storage calculation (3 marks)\nSubscription model design (4 marks)\nReliability comparison (3 marks)",
      solution: "(a) Daily: 50 KB x 48 = 2.34 MB/device. 10,000 = 22.85 GB/day. Bandwidth: 2.17 Mbps avg. (b) Subscribe 'interfaces/statistics' at 5s, 'system/processes' at 60s, 'routing-state' at 300s. On-change for 'oper-status'. Push model reduces daily to ~4 GB with on-change optimisation. (c) Periodic 30-min polling misses most flaps (2s flap undetected). On-change detects immediately but risks buffer overflow during storms. Hybrid: on-change + periodic 5-min reconciliation for missed events."
    },
    {
      id: "qb-2-15",
      type: "Critical Thinking",
      marks: 10,
      question: "YANG defines config (true) and state (false). Critically analyse: (a) Arguments for/against separate datastores, (b) How NMDA (RFC 8342) addresses this, (c) Implications for NMS developers, (d) Whether config/state distinction remains relevant for telemetry and intent-based systems.",
      scheme: "Separate vs combined arguments (3 marks)\nNMDA explanation (2.5 marks)\nDeveloper implications (2.5 marks)\nModern relevance (2 marks)",
      solution: "(a) For: state should not conflate with intended config. Mixing causes ambiguity on read-back. Against: developers query two datastores, doubling complexity. (b) NMDA introduces 'operational' datastore merging config+state — config=true shows applied config (or best approximation), config=false shows actual state. 'Running' holds only intended config. Single get-data returns complete picture. (c) Query operational for monitoring/troubleshooting. Running for backup/audit. Publish intent to running, verify against operational — difference = drift. (d) Distinction more important for intent systems — they compare desired (config) with observed (operational). Telemetry increases importance as streams carry operational, models carry config."
    },
  ],
  "3": [
    {
      id: "qb-3-1",
      type: "Scenario-based",
      marks: 10,
      question: "A tier-1 ISP's NOC receives 50,000 alarms/day from 20,000 devices — 70% are duplicates. Design correlation/suppression reducing to 15,000 actionable alarms/day. Describe temporal, topological, and event pattern rules, suppression windows, root cause vs symptom ID with BGP and link flap examples.",
      scheme: "Alarm classification (2 marks)\nTemporal correlation (2 marks)\nTopological correlation (2 marks)\nRoot cause identification (2 marks)\nBGP/link flap examples (2 marks)",
      solution: "Stage 1 — Normalise, deduplicate within 5s. Stage 2 — (a) Temporal: same device alarms within 60s grouped. BGP down followed by route withdrawals -> BGP is root cause. (b) Topological: adjacency graph. Link down on Router-A -> RC on A, symptom on Router-B. (c) Pattern: 'LinkFlap' up-down-up within 10s -> single 'Flapping' alarm with count. Suppression: once RC confirmed, suppress symptoms for 30 min. BGP: session down = RC; suppress route withdrawal, next-hop unreachable, IGP metric alarms for 15 min. Link flap: after 5 flaps in 60s, escalate Critical, suppress individual events. Result: 50K -> 15K (70% reduction)."
    },
    {
      id: "qb-3-2",
      type: "Scenario-based",
      marks: 10,
      question: "CLOS topology with 100 leaf, 8 spine switches. A spine fails triggering alarms from all 100 leaves. Design hierarchical aggregation that: (a) Identifies spine as single RC, (b) Suppresses 100 leaf symptoms, (c) Generates impact report, (d) Auto-escalates if traffic drops exceed 12.5%.",
      scheme: "Hierarchical aggregation (2.5 marks)\nRoot cause identification (2.5 marks)\nImpact report (2.5 marks)\nEscalation logic (2.5 marks)",
      solution: "(a) Topology graph: spines parent to leaves via BGP. 100 BGP-down alarms within 10s counting common neighbour (spine IP). Probe spine SNMP/ICMP; if unreachable, confirmed. (b) All leaf-to-spine BGP alarms = 'symptom'. Suppression rule: 'Spine-3 RC active, suppress all referencing Spine-3.' (c) Report: 'Spine-3 FAILURE — 100 leaves — 80 Gbps lost — 12.5% fabric reduction.' Attached to RC alarm. (d) 8 spines, one fails = 12.5%. Rule: affected leaves x (capacity/spines) >10% of total -> escalate. Leaf traffic >20% drop -> page L3 immediately."
    },
    {
      id: "qb-3-3",
      type: "Problem Solving",
      marks: 10,
      question: "NMS processes 100,000 alarms/hour through normalisation(5ms), enrichment(10ms), correlation(15ms), storage(5ms) on 8-core server. (a) Minimum processing time with perfect parallelisation. (b) CPU utilisation if each step uses 10,000 cycles/alarm at 3 GHz. (c) Scaling strategy for 500,000 alarms/hour.",
      scheme: "Processing time (3 marks)\nCPU utilisation (3 marks)\nScaling architecture (4 marks)",
      solution: "(a) Pipeline: 35ms/alarm. 100K x 0.035 = 3500 CPU-s. With 8 cores: 437.5s = 7.3 min. (b) Clock cycles: 4 steps x 10K = 40K/alarm. 100K/hr x 40K = 4x10^9 cycles/hr. Server cap: 8 x 3GHz x 3600s = 8.64x10^13 cycles/hr. Utilisation: 0.0046% — IO bound, not CPU. (c) For 500K/hr: 500K x 0.035 = 17,500 CPU-s = 36.5 min on 8 cores — feasible. Scale: 3-node cluster partitioned by device group, Kafka with 6 partitions, each node 8 consumer threads. Duplicate to secondary partition for resilience. Handles 500K+/hr with <1s latency."
    },
    {
      id: "qb-3-4",
      type: "Industry Oriented",
      marks: 10,
      question: "A bank's NMS experiences alarm storms during trading — 200,000+ alarms in 10 minutes overwhelm the dashboard. Design anti-storm: (a) Detection criteria, (b) Throttling preserving critical alarms, (c) Rate-limiting algorithm with burst tolerance, (d) Post-storm replay.",
      scheme: "Storm detection (2.5 marks)\nSeverity-based throttling (2.5 marks)\nRate-limiting algorithm (2.5 marks)\nPost-storm procedures (2.5 marks)",
      solution: "(a) Monitor rate over 60s window. Baseline: mean+5sigma of prior 24h. Storm when rate exceeds baseline for 30s. Secondary: new-to-RC ratio >20:1 indicates correlation failure. (b) Three-tier: Critical/High always pass. Medium 100/min/device then queue. Low/Warning 10/min then drop. During storm: Medium to 20/min, Low to 0. Throttled alarms to 'storm buffer'. (c) Token bucket per device group: 1000 tokens, refill 100/s (storm 20/s). Critical = 0 tokens, others = 1. Spike of 200 alarms uses 200 of 1000 — no throttle. Only sustained spikes deplete bucket. (d) When rate < threshold for 5 min, replay storm buffer at 500/min through correlation. Generate summary: duration, raw alarms, unique RCs post-correlation, missed criticals."
    },
    {
      id: "qb-3-5",
      type: "Critical Thinking",
      marks: 10,
      question: "Compare rule-based, codebook, Bayesian, and ML correlation for: (a) RC accuracy, (b) Adaptability to changes, (c) Cost at 100K alarms/day, (d) Explainability. Recommend approach for greenfield NMS with 12-month rollout.",
      scheme: "Rule-based analysis (2 marks)\nCodebook analysis (2 marks)\nBayesian/ML analysis (2 marks)\nCost/explainability (2 marks)\nRecommendation (2 marks)",
      solution: "(a) Rule: high for known failures, zero for unknown. Codebook: accurate for pre-enumerated. Bayesian: good with incomplete evidence. ML: >90% with sufficient data but FP risk. (b) Rule: poor — manual updates needed. Codebook: moderate — regeneration needed. Bayesian: moderate — priors need re-estimation. ML: excellent — retrain on new data. (c) All <100ms at 100K/day. Real cost: rules need 2-3 FTE; ML needs 1 data scientist + 0.5 FTE. (d) Rule: fully explainable. ML: black-box. Recommendation: rules months 1-6 (top-20 scenarios). Parallel codebook months 3-9. ML months 6-12 in shadow mode. After >95% agreement for 3 months, promote ML to primary with rules fallback."
    },
    {
      id: "qb-3-6",
      type: "Scenario-based",
      marks: 10,
      question: "An MSP monitors 50 enterprise customers from a central NOC. Each has different severity definitions, escalation, and reporting. Design multi-tenant alarm management: (a) Map customer severities to canonical scale, (b) Per-customer escalation with SLA targets, (c) Tenant-isolated dashboards with NOC-wide visibility.",
      scheme: "Canonical severity mapping (3 marks)\nPer-customer escalation (3 marks)\nMulti-tenant data isolation (2 marks)\nConfiguration model (2 marks)",
      solution: "(a) Canonical: Critical(P1-10min), Major(P2-30min), Minor(P3-2h), Warning(P4-8h), Info(P5). Each customer provides severity mapping table. Pipeline applies mapping on receipt. (b) Escalation state machines per canonical severity: time-to-respond, time-to-resolve, path. Customer-A P1: Notify (0 min) -> engineer (10 min) -> IT manager (60 min). Engine runs on 1-min tick. (c) Each alarm tagged with tenant_id. Database partition key = tenant_id. NOC-wide dashboards show aggregates; drill-down requires tenant scope. Operators have role-based tenant access lists. Data access middleware injects tenant_id restrictions per user."
    },
    {
      id: "qb-3-7",
      type: "Problem Solving",
      marks: 10,
      question: "Alarms: weekdays 9AM-5PM: 200/hr, weekdays 5PM-9AM: 50/hr, weekends: 30/hr. Each 35ms processing. (a) Peak load in alarms/s and required CPU for 8 cores. (b) If engineers handle 20 investigations/hr and 10% need investigation, staffing needed? (c) Staffing schedule minimising overstaffing.",
      scheme: "Peak load calculation (3 marks)\nEngineer capacity (3 marks)\nStaffing schedule (4 marks)",
      solution: "(a) Peak: 200/hr = 0.056/s. Processing: 0.056 x 0.035 = 0.00196 CPU-s/s. With 8 cores: 0.0245%. Trivial. (b) 10% of 200 = 20/hr peak. One engineer exactly covers peak. Off-peak 5/hr, weekend 3/hr. Real-world: need redundancy. Use 2 engineers peak (50% capacity each). (c) Day 8AM-6PM: 2 on-site, 1 standby. Evening 6PM-11PM: 1 on-site (5/hr). Night 11PM-8AM: 1 on-call. Weekend: 1 on-call. Total: 3 FTE + 2 part-time = ~4 FTEs for 24/7."
    },
    {
      id: "qb-3-8",
      type: "Industry Oriented",
      marks: 10,
      question: "An e-commerce company's Black Friday outage was buried among 50,000 alerts. Design AI-driven alarm prioritisation: (a) Business impact score (1-100), (b) Adaptation to business context, (c) False positive reduction via ML. Include feature engineering and model architecture.",
      scheme: "Business impact scoring (3 marks)\nContext-adaptive prioritisation (3 marks)\nFalse positive reduction (2 marks)\nFeature engineering (2 marks)",
      solution: "(a) Score = f(affected_customers, revenue_at_risk, service_criticality, severity, historical_impact). XGBoost predicts P1 incident probability within 30min. Score = prob x 100. Features: device type, alarm type, severity, time/day, customer tier, device role, rate in last 5min. (b) Business context vector: {event:'black_friday', traffic:'5x_normal', critical_services:['payment']}. Model receives as features. Weekly retraining with NOC feedback. (c) Random forest on historical true/false positives. Features: type, vendor, time since maintenance, environment. <30% TP prob -> noise queue. Achieves 60-80% FP reduction, >99% TP capture."
    },
    {
      id: "qb-3-9",
      type: "Critical Thinking",
      marks: 10,
      question: "Alarm noise ratio is typically 70-90%. Analyse causes in multi-vendor networks. Propose 'clean alarm strategy' to <30% noise: (a) Device-level, (b) Network-level, (c) Organisational, (d) Is 100% clean realistic?",
      scheme: "Device-level fixes (2.5 marks)\nNetwork-level (2.5 marks)\nOrganisational (2.5 marks)\nRealistic target (2.5 marks)",
      solution: "(a) Device: baseline 2 weeks, set at baseline+3sigma. Jitter poll start times. 30s hold-down for rebooted devices. (b) Network: shift to predictive (trends, not absolutes). Maintenance schedule integration. Encode device role in rules. (c) Organisational: 'alarm quality' KPI incentivising reduction. Quarterly cleanup — justify alarms >6 months or disable. (d) 100% unrealistic — zero noise means missed genuine faults. Target: noise <=25%, false negative <=0.1%. Small 5-10% noise provides safety margin."
    },
    {
      id: "qb-3-10",
      type: "Scenario-based",
      marks: 10,
      question: "Static severity: core=Critical, distribution=Major, access=Minor. Fibre cut drops 300 access routers (50K business customers) showing 'Minor'. Design dynamic severity considering: affected customers, SLA tier, time of day, service impact. Provide formula and examples.",
      scheme: "Customer count mapping (2 marks)\nSLA tier weighting (2 marks)\nTime-based (2 marks)\nService impact (2 marks)\nFormula/examples (2 marks)",
      solution: "S = min(100, base_S x C_w x T_w x SLA_w x Svc_w). base_S (100/70/40). C_w = log10(customers x premium_multiplier). T_w: business=1.5. SLA_w: Gold=2.0, Silver=1.5. Svc_w: VoIP=2.0, VPN=1.5. Example 1 (fibre cut, 30K customers, 40% gold, business): base=40. C_w=log10(42,000)=4.62. T_w=1.5. S=min(100, 40x4.62x1.5)=100 (Critical). Example 2 (single core, 50 customers, off-peak): base=100. C_w=log10(50)=1.7. S=min(100,170)=100. Example 3 (single access, 2 customers, off-peak): base=40. C_w=log10(2)=0.3. S=min(100,12)=12, floored to 40 (Minor)."
    },
    {
      id: "qb-3-11",
      type: "Problem Solving",
      marks: 10,
      question: "Monthly: 3M alarms, 600K processed (70% auto-cleared), 180K need investigation (8 min each), 10% escalated (45 min), 2% become CRs (4 hrs). (a) Monthly engineer-hours. (b) Annual cost at $45/hr. (c) Automation reducing human investigation 60% and ROI with $150K investment.",
      scheme: "Engineer-hours (3 marks)\nAnnual cost (2 marks)\nAutomation improvements (3 marks)\nROI analysis (2 marks)",
      solution: "(a) Investigation: 180,000 x 8 min = 24,000 hrs. Escalations: 18,000 x 45 min = 13,500 hrs. CRs: 3,600 x 4 = 14,400 hrs. Total: 51,900 hrs/month = 324 FTEs. (b) Annual: 51,900 x $45 x 12 = $28,026,000. (c) Automation: ML 90% auto-clear; runbooks for top-10 (50% escalation reduction); auto-remediation 30% CRs. New: investigation=4,000, escalations=1,125, CRs=1,680. Total=6,805 hrs/month. New annual = $3,674,700. Savings = $24,351,300. ROI = 162x. Payback <1 month."
    },
    {
      id: "qb-3-12",
      type: "Industry Oriented",
      marks: 10,
      question: "ITIL incident/problem/change management for NMS alarm workflows. Design integration: (a) Alarm-to-incident mapping, (b) Incident-to-problem promotion triggers, (c) Problem-to-change workflow, (d) ITIL compliance KPIs for NOC dashboard.",
      scheme: "Alarm-to-incident mapping (2.5 marks)\nIncident-to-problem (2.5 marks)\nProblem-to-change (2.5 marks)\nITIL KPIs (2.5 marks)",
      solution: "(a) Each correlated alarm auto-creates incident via ITSM API. Mapping: type->category, device->CI, severity->priority, timestamp->opened_at. Same RC grouped under meta-incident. (b) Promotion: >10 same-type incidents in 7 days; >48h unresolved; operator flagged. Problem inherits all incident details. (c) Known Error with permanent fix generates Change Request with risk_level, implementation/rollback plans, category. (d) KPIs: Incident -> MTTR, Reopen Rate, SLA Breach %. Problem -> Incident Ratio (>1:5). Change -> Success Rate, Emergency Ratio. Dashboard with RAG thresholds. Alert manager on red for >1 hour."
    },
    {
      id: "qb-3-13",
      type: "Scenario-based",
      marks: 10,
      question: "Three-region cloud provider (US-East, EU-West, AP-Southeast) with local NMS. Cross-region latency causes alarm storms. Design distributed alarm management: (a) Local correlation, (b) Global aggregation, (c) Distributed consensus preventing duplicate RCs, (d) Eventual consistency with conflict resolution.",
      scheme: "Local correlation (2 marks)\nGlobal aggregation (2 marks)\nDistributed consensus (3 marks)\nEventual consistency (3 marks)",
      solution: "(a) Each region runs independent correlation. Publishes Kafka topic with top-10 RCs. (b) Global NMS subscribes to all topics. Cross-region correlation at service level: US-East 'BGP to EU-West down' + EU-West 'BGP to US-East down' -> single 'Cross-region BGP failure'. (c) Raft-based etcd. Region creates key 'rc/{fault_hash}' with 300s TTL. If succeeds -> owns RC. If fails -> symptoms of existing RC. fault_hash = resources + failure_type + timestamp_window. (d) Alarm state reconciliation every 60s. Last-writer-wins based on timestamp. Region A says 'alarm-123: cleared T1', Region B says 'active T2>T1' -> active. Ensures reactivation never lost."
    },
    {
      id: "qb-3-14",
      type: "Critical Thinking",
      marks: 10,
      question: "Evaluate business case for proactive vs reactive fault management for medium enterprise (2000 devices). (a) Technical requirements, (b) Investment, (c) MTTR/downtime reduction, (d) Whether proactive eliminates reactive entirely.",
      scheme: "Technical requirements (2.5 marks)\nInvestment analysis (2.5 marks)\nMTTR reduction (2.5 marks)\nProactive vs reactive (2.5 marks)",
      solution: "(a) Needs: sub-minute push telemetry; 4-week baselines; anomaly detection (moving avg + 3sigma or isolation forest); trend-based predictive alerts. (b) Telemetry $50K, ML $80K, staffing $225K/yr. Year 1: $355K. (c) Reactive MTTR: 4.5h. Proactive: 1.5h. Downtime from 20h/yr to 5h/yr. Value: 15h x $50K/h = $750K/yr. (d) Proactive doesn't eliminate reactive — some faults instantaneous (fibre cut, power fail). 20-30% false positives need investigation. Use proactive primary + reactive safety net: reduces downtime 70-80%."
    },
    {
      id: "qb-3-15",
      type: "Industry Oriented",
      marks: 10,
      question: "5G network slicing introduces cross-domain alarms (RAN, Transport, Core, MANO). Design alarm correlation framework: (a) Cross-domain aggregation, (b) Slice-aware RC analysis per type (eMBB, URLLC, mMTC), (c) Hierarchical correlation model, (d) Scalability for nationwide (100+ slices, 500K+ elements).",
      scheme: "Cross-domain aggregation (2.5 marks)\nSlice-aware RC analysis (2.5 marks)\nHierarchical model (2.5 marks)\nScalability (2.5 marks)",
      solution: "(a) Per-domain collectors (RAN, Transport, Core, MANO). Each normalises, intra-domain correlates, publishes to Kafka with affected_slice_ids. Global correlator stitches using slice_id. (b) Each slice has type/SLOs/dependency graph. URLLC high latency: RAN +5ms, Transport queue depth, Core +2ms. Walk graph — transport deviation p<0.01 -> RC at 80% confidence. (c) Layer 1 (Element): device faults. Layer 2 (Domain): element -> domain RC. Layer 3 (Slice): domain RCs -> slice RC via topology. Reduces from O(N^2) to O(N_element + N_domain + N_slice). (d) 5-10 parallel instances per domain (geo partitioned). Apache Flink + Redis for state. Kafka backpressure for 1000x spikes. Tested: 2M alarms/min on 20 servers."
    },
  ],
  "4": [
    {
      id: "qb-4-1",
      type: "Scenario-based",
      marks: 10,
      question: "A data centre operator with 5000 switches in CLOS topology migrates from SNMP to SDN. Design management plane: (a) How controller replaces element-by-element config, (b) Fault tolerance when controller is SPOF, (c) Network-wide vs per-device monitoring, (d) Zero-downtime migration strategy.",
      scheme: "Controller configuration (2.5 marks)\nController fault tolerance (2.5 marks)\nNetwork-wide monitoring (2.5 marks)\nMigration strategy (2.5 marks)",
      solution: "(a) Controller holds centralised network model. Intent expressed to controller, which computes flows and pushes via OpenFlow/gNMI. Reduces from 5000 ops to API calls. Transaction log enables rollback. (b) 3-node cluster (ONOS Raft). Standby takes over in 3s. Switches retain flows (fail-secure). OOB mgmt network as last resort. (c) Controller has per-flow stats. Export aggregated by service/tenant — not per-device. Richer data, fewer endpoints. (d) Phase 1: observer mode. Phase 2: path computation only. Phase 3: write on non-critical pod. Phase 4: full failover with SNMP read-only fallback for 6 months."
    },
    {
      id: "qb-4-2",
      type: "Scenario-based",
      marks: 10,
      question: "5G operator deploys slicing for eMBB (100 Mbps), URLLC (<5ms), mMTC (1000 devices/cell). Design slice management: (a) SLO-to-resource mapping, (b) YANG-based real-time SLA monitoring, (c) Dynamic resource reallocation between slices, (d) Predictive SLO breach alarming.",
      scheme: "SLO-to-resource mapping (2.5 marks)\nYANG monitoring (2.5 marks)\nDynamic reallocation (2.5 marks)\nPredictive alerting (2.5 marks)",
      solution: "(a) eMBB: 60% PRBs, 100 Mbps transport, dedicated UPF. URLLC: mini-slot, priority queuing <1ms/hop, co-located UPF. mMTC: extended coverage, 10 Mbps aggregate, DB shard per 100K devices. YANG templates. (b) YANG subscriptions: eMBB throughput at 1s, URLLC latency-p99 at 100ms, mMTC connected-devices at 5s. Compliance <95% over 5min = warning. <90% over 1min = critical. (c) Orchestrator every 30s: if URLLC uses 30% PRBs while eMBB at 95% with drops -> shift. Shared pool: each has guaranteed minimum + 20% shared. (d) Holt-Winters forecasting. eMBB: if forecast <100 Mbps within 60 min (95% conf) -> alert with TTB. URLLC: 1-min window. mMTC: 4-hour window. Operator triggers augmentation before breach."
    },
    {
      id: "qb-4-3",
      type: "Critical Thinking",
      marks: 10,
      question: "SDN centralises intelligence, creating tension with distributed IP networking. Evaluate whether centralised management is more manageable or introduces new challenges: (a) Simplicity arguments, (b) New failure modes, (c) Southbound bottleneck, (d) Hybrid approaches balancing trade-offs.",
      scheme: "Centralised benefits (2 marks)\nNew failure modes (3 marks)\nSouthbound scalability (2 marks)\nHybrid approaches (3 marks)",
      solution: "(a) Simplicity: single complete view, network-wide intent config, single northbound API. Reduces NOC cognitive load. (b) New failure modes: (1) Controller brain — buggy controller misconfigures entire network. (2) Controller-switch connectivity loss. (3) Multi-controller inconsistency. (4) Security blast radius. (c) 5000 switches x 2 stats/s = 10K/s — ONOS handles 100K/s. Bottleneck: PACKET_IN during flash crowds. Mitigation: proactive installation, rate-limiting. (d) Hybrid: (1) Hierarchical — leaf per pod, global root. (2) Distributed SDN. (3) IS-IS for fast recovery, SDN for optimisation. Recommendation: SDN for policy/service, distributed protocols for fast recovery."
    },
    {
      id: "qb-4-4",
      type: "Problem Solving",
      marks: 10,
      question: "SDN controller manages 200 OpenFlow switches (8000 TCAM each). PACKET_IN for each new flow. (a) If 500,000 new flows/s, PACKET_IN rate per switch. (b) Each PACKET_IN = 50µs + FLOW_MOD + PACKET_OUT. CPU load in cores at 3 GHz (15K cycles/op). (c) Proactive covering top 80% — recalculate. (d) With Poisson lambda=500K/s, probability response exceeds 10ms?",
      scheme: "PACKET_IN rate (2 marks)\nCPU load (3 marks)\nProactive installation (2.5 marks)\nQueueing analysis (2.5 marks)",
      solution: "(a) 500K/200 = 2500 PACKET_IN/s/switch = 2.86 Mbps — feasible. (b) Per flow: 50+50+20=120µs = 360K cycles. Total: 500K x 360K = 180x10^9 cycles/s. 1 core = 3x10^9. Required: 60 cores. Must use proactive. (c) Pre-install top-20 (80%). Reactive: 100K/s. Load: 100K x 360K = 36x10^9 = 12 cores + 1 proactive. Total ~13 cores. Use 2 controllers (8 cores each). (d) lambda=100K/s, mu=8333/s/core. 13 cores: total mu=108,333. rho=0.923. M/M/13: avg response = 396µs. P(T>10ms) ≈ e^(-8333x0.01) = e^(-83.33) = essentially zero."
    },
    {
      id: "qb-4-5",
      type: "Industry Oriented",
      marks: 10,
      question: "Google B4, Microsoft SWAN, and Facebook Edge Fabric use SDN for WAN backbone. Analyse from management perspective: (a) Device-centric to service-centric shift, (b) Telemetry infrastructure, (c) Failure recovery at scale, (d) Lessons for tier-2 operators.",
      scheme: "Service-centric management (2.5 marks)\nTelemetry infrastructure (2.5 marks)\nFailure recovery (2.5 marks)\nApplicable lessons (2.5 marks)",
      solution: "(a) B4 manages 'flow groups' (app classes) vs individual router QoS. SWAN manages 'service demands'. Edge Fabric manages 'peering sessions' as entities. (b) B4: Billion-node at 1s, 30d retention. SWAN: central traffic matrix (100K endpoints, 5min). Edge Fabric: BGP sampling. All custom — off-the-shelf couldn't scale. (c) B4: hierarchical control, BFD <50ms detection, <500ms recovery. SWAN: two-phase commit, pre-computed alternate paths. Edge Fabric: route health injection. (d) Lessons: service-centric abstraction; central traffic matrix from SNMP; pre-compute alternate paths for top-10 failures; time-series DB (InfluxDB) for 500 routers x 500 metrics at 30s."
    },
    {
      id: "qb-4-6",
      type: "Scenario-based",
      marks: 10,
      question: "Financial trading firm requires <50µs latency. Design observability: (a) Measure latency at µs granularity without overhead, (b) Detect micro-bursts sub-ms congestion, (c) Real-time telemetry to SDN controller for path optimisation, (d) Deterministic latency alerts (SLO: <50µs, warning at 40µs).",
      scheme: "Microsecond measurement (2.5 marks)\nMicro-burst detection (2.5 marks)\nReal-time telemetry (2.5 marks)\nDeterministic alerting (2.5 marks)",
      solution: "(a) In-band Network Telemetry (INT) — switches insert nanosecond timestamps into data packets. Receiver extracts per-hop latency. PTP-synchronised clocks. No separate probes. (b) FPGA taps at aggregation points. Capture every packet timestamp + queue depth. Sliding 1ms window — queue >50% for >10µs = micro-burst. Report every 100ms. (c) Kafka publish with <100µs delay. Controller subscribes, recomputes paths in <50µs using pre-computed alternates. (d) Histogram dashboard (50µs buckets). Alert: if any 1s window >0.1% packets exceed 40µs (warning) or 50µs (critical). Direct API call to automated trading controller — machine response required for 50µs."
    },
    {
      id: "qb-4-7",
      type: "Critical Thinking",
      marks: 10,
      question: "Network observability goes beyond monitoring. Evaluate the shift: (a) Monitoring vs observability differences, (b) High-cardinality data architecture, (c) Cost-benefit for mid-size enterprises, (d) Business observability integration (revenue, customer satisfaction).",
      scheme: "Monitoring vs observability (2.5 marks)\nData architecture (2.5 marks)\nCost-benefit analysis (2.5 marks)\nBusiness observability (2.5 marks)",
      solution: "(a) Monitoring: pre-defined thresholds, known-unknowns. Observability: explore unknown-unknowns without pre-defined queries. Monitoring='what broke', observability='why behaving this way'. (b) Need: high-cardinality (millions of flow keys), multi-tag (20+ dimensions), columnar store (ClickHouse). 500 routers x 2000 metrics x 10s = 86.4M pts/day = 3.5 GB/day. Annual: 1.3 TB — single ClickHouse node ($200/mo). (c) Observability premium ~$100K/yr (1 FTE). Benefit: 50% faster MTTR ($50K) + reduced downtime ($100K). Net $50K/yr benefit. For >1000 devices or >$10K/hr downtime, clearly justified. (d) Correlate telemetry with business: 'link 75% utilisation affecting 2500 gold customers generating $12,500/hr revenue.' Enables impact-based prioritisation. CRM/billing enrichment at query time."
    },
    {
      id: "qb-4-8",
      type: "Problem Solving",
      marks: 10,
      question: "Observability platform collects flows from 1000 routers, 50,000 flows/s at 1.2 KB each. (a) Total ingestion rate and daily storage. (b) With 1:1000 sampling, 25% unique flows, effective daily storage. (c) Three-tier storage design (hot/warm/cold) with retention and latency. (d) Monthly cloud cost: hot $0.023/GB SSD, warm $0.01/GB HDD, cold $0.001/GB Glacier.",
      scheme: "Ingestion/storage (2.5 marks)\nSampling/dedup (2.5 marks)\nTiered storage (2.5 marks)\nCloud cost (2.5 marks)",
      solution: "(a) Raw: 1000 x 50,000 x 1.2 KB = 60 GB/s = 480 Gbps. Daily: 5.18 PB/day. Impossible without sampling. (b) 1:1000 sampling: 50 flows/s per router = 60 MB/s = 0.48 Gbps. Daily: 5.184 TB. 25% unique: 1.296 TB/day. Feasible. (c) Hot (7 days): 9.07 TB, NVMe SSD, 1ms. Warm (60 days): 1-hour summaries, 500 GB, HDD, 50ms. Cold (12 months): 5-min rollups, 2 TB, Glacier, 5min retrieval. (d) Hot: 9.07 TB x 1024 x $0.023 = $213. Warm: 500 x $0.01 = $5. Cold: 2 TB x 1024 x $0.001 = $2. Total: ~$220/month."
    },
    {
      id: "qb-4-9",
      type: "Scenario-based",
      marks: 10,
      question: "SD-WAN connects 200 branches to 3 DCs and 2 clouds. Design management framework: (a) Centralised policy for application-aware routing, (b) Underlay link monitoring and failover, (c) Zero-touch branch deployment, (d) Centralised security with distributed enforcement.",
      scheme: "Policy model (2.5 marks)\nLink monitoring (2.5 marks)\nZero-touch deployment (2.5 marks)\nSecurity management (2.5 marks)",
      solution: "(a) YANG app-groups (critical/business/best-effort) with SLA profiles (latency/loss/jitter). Controller translates to per-branch routing. (b) BFD 50ms + active probing. gNMI telemetry from edges. If MPLS latency exceeds threshold, steer to best link <1s. (c) Branch boots, DHCP Option 43 -> bootstrap server -> controller IP -> IPsec tunnel -> full config via NETCONF (routing, security, local internet breakout). (d) Security policies per app-group defined centrally. Distributed FW enforcement at edges. YANG container 'security-policy' with rules (app-group, source, dest, action). Pushed via NETCONF to all edges. Central visibility, wire-speed local enforcement."
    },
    {
      id: "qb-4-10",
      type: "Industry Oriented",
      marks: 10,
      question: "ONAP is the leading open-source NFV orchestration platform. Analyse its management architecture: (a) Multi-domain service orchestration, (b) Role of YANG models in service design, (c) Closed-loop automation for fault remediation, (d) Production deployment challenges vs vendor alternatives.",
      scheme: "Service orchestration (2.5 marks)\nYANG models in ONAP (2.5 marks)\nClosed-loop automation (2.5 marks)\nDeployment challenges (2.5 marks)",
      solution: "(a) ONAP has SDC (Service Designer) and SO (Orchestrator). SO decomposes service into domain-level requests to SDN-C/APP-C. TOSCA + YANG service templates. (b) YANG defines VNF descriptors, network models, service models. Stored in model catalog. Used by SO/SDN-C to generate device configs. 'Design once, deploy anywhere.' (c) DCAE collects telemetry, Policy Framework evaluates, executes remediation via SO. Example: vCPU >90% for 5 min -> Policy triggers scale-out. On success, update policy. On failure, escalate. (d) Challenges: complexity (10+ components, $500K+ K8s infra); each VNF needs custom YANG/TOSCA (weeks); community release breaking changes; vendor alternatives (Cisco NSO, Juniper Paragon) offer faster time-to-value but vendor lock-in."
    },
    {
      id: "qb-4-11",
      type: "Critical Thinking",
      marks: 10,
      question: "IETF ALTO and SDN controllers both optimise network usage. Compare: (a) ALTO abstracted views vs SDN direct control, (b) Which preserves operator autonomy, (c) Deployment complexity and adoption barriers, (d) Are they complementary or competing?",
      scheme: "ALTO vs SDN approach (2.5 marks)\nOperator autonomy (2.5 marks)\nDeployment complexity (2.5 marks)\nComplementary vs competing (2.5 marks)",
      solution: "(a) ALTO provides advisory network/cost maps to applications — informational. SDN directly installs flow entries — imperative. (b) ALTO preserves autonomy — operator controls maps, can hide information. SDN requires delegating control to controller (running operator policies). For guiding behaviour without full control, ALTO preferred. (c) ALTO: deploy server + integrate clients. Simple, no data plane changes. Low adoption because app developers don't see network benefits. SDN: requires OpenFlow switches, controller cluster, significant migration. Higher adoption because operators see direct control benefits. (d) Complementary. Use SDN for intra-domain TE and policy enforcement; ALTO for selective info to partner apps/CDN for cross-domain optimisation."
    },
    {
      id: "qb-4-12",
      type: "Problem Solving",
      marks: 10,
      question: "Enterprise uses both legacy SNMP NMS (5000 devices, 5-min, 150 OIDs) and SDN controller (500 switches, 1s, 200 flows). (a) Total daily data volume for both. (b) With NMS in RDBMS (3x compression) and SDN in TSDB (10x), 90-day storage. (c) Unified data lake architecture for cross-correlation queries with estimated latency.",
      scheme: "Daily data volume (3 marks)\nStorage with compression (3 marks)\nUnified data lake (4 marks)",
      solution: "(a) NMS: 5000 x 150 x 288 polls/day = 216M pts/day x 50 bytes = 10.8 GB/day. SDN: 500 x 200 x 86,400 = 8.64B pts/day x 20 bytes = 172.8 GB/day. (b) NMS: 10.8/3 x 90 = 324 GB. SDN: 172.8/10 x 90 = 1.56 TB. Total ~1.9 TB. One medium server. (c) ClickHouse with columns: (timestamp, device_id, metric_name, metric_value, source, tags). Query: 'SELECT device_id, metric_value WHERE metric_name IN ('ifInErrors','flow_drop_rate') AND timestamp BETWEEN T-5min AND T GROUP BY device_id HAVING flow_drop_rate >0 AND ifInErrors >100'. Latency: ClickHouse scans 1.9 TB at 200 MB/s = ~3s full scan. With partitioning on (timestamp, device_id), <500ms."
    },
    {
      id: "qb-4-13",
      type: "Industry Oriented",
      marks: 10,
      question: "ETSI NFV MANO defines VNFM vs NFVO vs VIM roles. Compare management responsibilities and how they interact with existing NMS for hybrid physical+virtual networks. Propose integration architecture minimising management silos.",
      scheme: "VNFM/NFVO/VIM roles (3 marks)\nNMS interaction (3 marks)\nIntegration architecture (4 marks)",
      solution: "(a) NFVO: orchestrates services across VNFs and physical; global resource inventory; service lifecycle. VNFM: manages individual VNF lifecycle (instantiation, scaling, healing); FCAPS at VNF level. VIM: manages virtualised infra (compute/storage/network); NFVI PoP control. (b) NMS monitors physical via SNMP. VNFM reports VNF health to NMS via RESTCONF. NFVO provides service view. Challenge: NMS sees physical server high CPU but has no VNF awareness on that server. (c) Unified Management Bus (Kafka) connecting NMS, VNFM, NFVO, VIM. Common format (CloudEvents JSON). Topology Aggregator builds unified graph: physical -> hypervisors -> VNFs -> services. When physical alarm arrives, aggregator identifies affected VNFs/services, generates enriched alarms. Eliminates physical-virtual silo."
    },
    {
      id: "qb-4-14",
      type: "Critical Thinking",
      marks: 10,
      question: "Intent-based networking promises 'state what you want, not how'. Critically evaluate maturity: (a) Required components (intent translation, validation, assurance), (b) Whether existing YANG/NETCONF/SDN are sufficient, (c) Role of closed-loop assurance, (d) Does IBN eliminate NOC engineers or shift skills?",
      scheme: "IBN components (2.5 marks)\nTechnology sufficiency (2.5 marks)\nClosed-loop assurance (2.5 marks)\nNOC impact (2.5 marks)",
      solution: "(a) IBN needs: intent translation (business->policy), policy distribution (via NETCONF/SDN), assurance (verify actual = intent), remediation (auto-correct). (b) YANG can model intended state (vpn-sla with latency leafs). NETCONF pushes. SDN enforces. But missing: high-level intent language, simulation engine, real-time assurance telemetry. Vendors (Cisco Catalyst Center, Juniper Apstra) fill this gap. YANG/NETCONF/SDN necessary but not sufficient. (c) Closed-loop is most critical: deploy -> monitor -> compare -> remediate. Without this, IBN is just config automation. Loop makes it self-correcting. (d) IBN shifts skills from CLI to policy design. L1/L2 tasks automated (50-70% reduction). Senior engineers become 'intent architects'. Reduces headcount but demands automation/policy expertise."
    },
    {
      id: "qb-4-15",
      type: "Scenario-based",
      marks: 10,
      question: "Service provider plans fully automated NMS for 5G core. Must support: zero-touch VNF instantiation, closed-loop auto-scaling, cross-domain orchestration, intent-based SLA management. Design comprehensive architecture using ONAP, ETSI NFV MANO, MEF LSO: (a) Order-to-fulfilment automation, (b) Closed-loop for VNF degradation, (c) Multi-vendor VNF integration, (d) Evolution path from semi-automated to fully automated.",
      scheme: "Service lifecycle automation (2.5 marks)\nClosed-loop assurance (2.5 marks)\nMulti-vendor integration (2.5 marks)\nEvolution path (2.5 marks)",
      solution: "(a) BSS order -> MEF LSO Sonata -> ONAP SDC (TOSCA+YANG) -> SO decomposes -> NFVO dispatches to VNFM (VNF) and SDN-C (connectivity) -> VIM provisions. All steps tracked via distributed tracing. No human touch. (b) DCAE collects VNF KPIs at 1s -> Policy evaluates (vCPU >80% for 5 min) -> triggers scale-out -> VNFM deploys new instance -> SDN-C updates LB -> DCAE verifies. If fails, escalate. (c) Vendor VNF Package (ETSI SOL001/004): VNFD TOSCA, YANG config model, LCM scripts. ONAP SDC validates. VNF Validation Framework tests: instantiate, configure, monitor, scale, terminate. Only validated VNFs enter catalog. (d) Evolution: Year 1 — ONAP + VIM, manual VNF lifecycle. Year 2 — automate day-0/1 config via YANG. Year 3 — close assurance loop (auto scale/heal). Year 4 — intent-based SLA (auto-optimise). Year 5 — autonomous operations (predict, schedule maintenance, escalate only novel situations)."
    },
  ],
};