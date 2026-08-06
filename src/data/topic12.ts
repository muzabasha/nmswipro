import type { TopicData } from './types';

export const topic12Data: TopicData = {
  id: "u1t12",
  title: "SNMP Limitations and Operators Requirement",
  moduleName: "Unit I: Introduction to Network Management and Frameworks",
  context: {
    prerequisites: ["SNMP TRAPS", "SNMP Concepts & Evolution", "SNMP Architecture"],
    dependentTopics: ["YANG Evolution & Background", "Introduction to Model-Driven Management"],
    nextSteps: "Study YANG Evolution & Background and then the NETCONF Protocol Concept — both of which were designed specifically to address the SNMP limitations catalogued in this topic.",
    rfcReferences: [
      { rfc: "RFC 3535", title: "IAB Network Management Workshop", summary: "The landmark 2003 document that formally catalogued operator requirements unmet by SNMP — the direct motivation for NETCONF and YANG development.", url: "https://www.rfc-editor.org/rfc/rfc3535" },
      { rfc: "RFC 4741", title: "NETCONF Protocol (original)", summary: "The first NETCONF RFC (2006), developed directly in response to the RFC 3535 operator requirements to address SNMP's configuration limitations.", url: "https://www.rfc-editor.org/rfc/rfc4741" },
      { rfc: "RFC 6241", title: "NETCONF Protocol (revised)", summary: "The current NETCONF standard with candidate datastore and transactional commit/rollback that resolves SNMP's partial-configuration problem.", url: "https://www.rfc-editor.org/rfc/rfc6241" },
      { rfc: "RFC 7011", title: "IPFIX — IP Flow Information Export", summary: "Defines streaming flow export, one of the operator requirements (streaming telemetry) that SNMP polling could not satisfy.", url: "https://www.rfc-editor.org/rfc/rfc7011" }
    ]
  },
  storytelling: {
    analogy: "An Aging Telephone Exchange Managing a Smart City",
    story: "Imagine trying to manage a modern smart city — autonomous vehicles, IoT sensors, real-time traffic management, emergency response coordination — using a 1970s rotary-dial telephone exchange. It technically 'works' for basic calls, but it cannot handle the volume, the speed, the automation, or the security requirements of a modern city. SNMP is the network equivalent: designed in 1988 for managing a few hundred routers with megabit links, it technically still functions in 2024 — but operators managing 5G networks with 100,000+ elements, zero-touch provisioning requirements, and millisecond-precision streaming telemetry hit fundamental architectural walls. The 1970s exchange cannot be 'upgraded' to handle autonomous vehicles — its core design is simply incompatible with the requirement. Similarly, SNMP's pull-only polling model cannot deliver streaming telemetry; its non-transactional SET operations cannot safely configure complex multi-step changes; its SMI type system cannot express the rich data models needed for NFV and SDN; and its SNMPv1/v2c community string security cannot protect management traffic in zero-trust environments. RFC 3535 (2003) documented these operator requirements formally, leading directly to the development of NETCONF (RFC 4741, 2006) and YANG (RFC 6020, 2010).",
    reflectiveQuestions: [
      "Why does SNMP's pull-based polling model fail fundamentally for streaming telemetry use cases in 5G networks?",
      "How does the lack of transactional semantics in SNMP SET lead to partial configuration failures that can cause network outages?",
      "What specific operator requirements in RFC 3535 could not be satisfied by extending SNMP — requiring a new protocol entirely?"
    ],
    technicalConnection: "RFC 3535 (Overview of IAB Network Management Workshop, 2003) documents operator requirements that SNMP cannot satisfy: **(1) Transaction Semantics**: SNMP SET is atomic per OID, not per transaction. Multi-step config (e.g., BGP neighbor addition: set neighbor IP, set neighbor AS, set address-family, activate) cannot be rolled back on failure. NETCONF <edit-config> with test-option=test-then-set validates entire change, rolls back on error. **(2) Datastore Distinctions**: SNMP has no concept of candidate config vs running config. Operator cannot stage changes for validation without applying them. NETCONF RFC 6241 §8.3: candidate datastore (staged changes), running datastore (active config), startup (boot config). Operations: <lock target=\"candidate\">, <edit-config target=\"candidate\">, <validate>, <commit>. Atomic commit: all changes or none. **(3) SMI Type Limitations**: SMI (RFC 2578) types: INTEGER, Integer32, Unsigned32, Counter32/64, Gauge32, TimeTicks, OCTET STRING, OBJECT IDENTIFIER. Cannot express: decimal64 (e.g., 10.5 dBm), union (multiple type choices), leafref (referential integrity), must/when constraints. Example failure: SNMP cannot enforce \"if VLAN tagging enabled, then VLAN ID must be present\" without custom agent code. YANG can: must \"./vlan-tagging or not(./vlan-id)\". **(4) Streaming Telemetry**: SNMP is pull-only. 1Hz polling of 5000 devices = 5000 GET requests/second. NETCONF RFC 8639 (YANG-Push) subscriptions: device streams metrics at configured interval (on-change or periodic) over persistent SSH session. gNMI (gRPC Network Management Interface): bidirectional streaming, subscriptions, encoding efficiency (Protobuf vs XML). **(5) Configuration Complexity**: SNMP SET for 5G network slice (20+ parameters across AMF/SMF/UPF) requires 20+ individual SET PDUs. No atomicity guarantee. NETCONF <edit-config> XML payload contains entire slice config in one RPC, validated as a unit. **(6) SNMPv1/v2c Security**: community string cleartext. Wireshark can capture full device config. SNMPv3 adds USM/VACM but complexity deterred adoption (only 40% of NEs support SNMPv3 by 2024). NETCONF mandates SSH (RFC 6242), TLS (RFC 7589), or HTTPS transport. Authentication via SSH pubkey, TLS cert, or NETCONF-over-HTTPS username/password."
  },
  mathModelling: {
    need: "A major mobile operator is evaluating whether to migrate their NMS from SNMP-based management to NETCONF/YANG. The current SNMP-based NMS manages 80,000 NEs across 4 technology domains. The migration decision is driven by: 15 configuration-related outages in the past year (estimated $4M total impact), inability to support zero-touch provisioning for 5G SA rollout, and a pending PCI-DSS audit that flagged SNMPv2c community strings. Three paths are evaluated: SNMP upgrade to v3 only, parallel deployment of NETCONF alongside SNMP, or full NETCONF/YANG migration.",
    equation: "DECISION CONSTRAINT: Zero-touch provisioning for 5G SA must be operational within 6 months. Configuration-related outage rate must be reduced by >80%. PCI-DSS SNMP security finding must be remediated within 90 days. Total migration budget: $12M over 3 years.",
    technicalDetails: "SNMP to SNMPv3 only: Fixes PCI-DSS finding (90 days, $800K). Zero impact on configuration outage rate — SNMP SET remains non-transactional. Zero-touch provisioning remains impossible — SNMP cannot model 5G SA network slice configurations. Fails 2 of 3 constraints. Parallel NETCONF deployment: Deploy NETCONF alongside existing SNMPv3 for configuration; retain SNMP for monitoring. New 5G NEs onboarded to NETCONF only. Legacy NEs gradually migrated. ZTP enabled for 5G SA within 6 months. Configuration outages reduced by 85% (transactional commits). Budget: $8M over 3 years within the $12M envelope. Dual-stack management plane increases NMS complexity during transition. Full NETCONF/YANG migration: All 80K NEs migrated to NETCONF within 18 months. Maximum benefit but: 15,000 legacy NEs require expensive firmware upgrades ($3M incremental). Timeline risk — 18 months for legacy NE migration exceeds the 6-month ZTP requirement for 5G SA.",
    explanation: [
      { term: "SNMPv3 Only Upgrade", meaning: "Adopted when the sole driver is security compliance and there is no business case for configuration automation. Appropriate for operators with stable legacy networks who are not deploying 5G SA. Fails all three strategic constraints in this scenario." },
      { term: "Parallel NETCONF + SNMPv3 Deployment (Recommended)", meaning: "Adopted by most operators in the real world — the pragmatic migration path. New devices are NETCONF-only; legacy devices remain SNMP for monitoring but use NETCONF for configuration where supported. 5G SA ZTP enabled within 6 months. Outage reduction target met via NETCONF transactions on new equipment. PCI-DSS remediated via SNMPv3. Stays within $12M budget." },
      { term: "Full NETCONF/YANG Migration", meaning: "Adopted as the end-state target with a 3-5 year horizon. Some operators set this as a hard strategy with a legacy device end-of-support date. Not feasible as an immediate response due to legacy firmware upgrade costs and the 18-month timeline vs 6-month ZTP requirement." }
    ],
    advantages: [
      "Parallel deployment fixes the most urgent constraint (ZTP for 5G SA) within 6 months without waiting for legacy migration",
      "Transactional NETCONF commits on new NEs immediately reduce the configuration outage rate for the rapidly growing 5G network",
      "SNMPv3 for legacy NEs satisfies PCI-DSS within 90 days — the security finding is addressed independently of the migration timeline"
    ],
    limitations: [
      "SNMPv3 only is adopted by operators with zero 5G roadmap who need only a security fix",
      "Full migration is adopted when the operator sets a hard legacy end-of-support date and is willing to invest in device upgrades to accelerate the timeline",
      "Some operators take a 'greenfield NETCONF, brownfield SNMP forever' approach where legacy NEs are never migrated"
    ]
  },

  activities: {
    level1: "List 5 specific technical limitations of SNMP and pair each with a concrete operator requirement it fails to meet. Present your answer as a table with columns: Limitation | Technical Detail | Operator Requirement Violated.",
    level2: "Explain the 'partial configuration' problem in SNMP using a concrete example: configuring BGP peering on a router requires 8 SET operations (AS number, neighbor IP, route policy, timers, etc.). Describe what happens if operation 5 fails, and contrast this with how NETCONF's candidate datastore + commit solves the problem.",
    level3: "Calculate P_fail for k = 5 steps at p = 0.03. Then for k = 15 steps at the same p. Calculate the ratio of risks. What does this tell you about the safety of applying large configuration changes via SNMP compared to small ones?",
    level4: "Read RFC 3535 Section 2 ('Operator Requirements'). Identify and summarise the top 5 operator requirements listed. For each requirement, identify whether it is addressed by NETCONF, YANG, SNMPv3, or remains unaddressed."
  },
  projects: {
    scope: "Conduct a comprehensive SNMP vs NETCONF capability comparison study to inform a hypothetical NMS platform selection decision for a next-generation 5G operator.",
    objectives: [
      "Document 8 specific SNMP technical limitations with quantitative or technical evidence (not just assertions)",
      "Map each limitation to the NETCONF, YANG, or streaming telemetry capability that resolves it",
      "Calculate configuration failure risk for k = 5, 10, 20-step changes at p = 0.01, 0.02, and 0.05"
    ],
    deliverables: [
      "SNMP limitations analysis document: 8 limitations with technical depth and operational impact assessment",
      "SNMP vs NETCONF/YANG comparison table: limitation → NETCONF capability → RFC reference",
      "Configuration failure risk analysis report with a risk heat-map showing P_fail across k and p values"
    ]
  },
  questions: [
    {
      q: "List 5 major technical limitations of SNMP that motivated the development of NETCONF and YANG.",
      a: "(1) No transaction support: SNMP SET operations are non-atomic. A multi-step configuration change that fails midway leaves the device in a partially configured, inconsistent state with no automatic rollback. (2) Security weaknesses: SNMPv1 and SNMPv2c transmit community strings in cleartext in every PDU, making them trivially interceptable. (3) Limited data model expressiveness: SMI supports only 8 base types with 2 constraint mechanisms — insufficient for expressing complex configuration data with relationships, conditional logic, and precise validation rules. (4) Pull-only model: SNMP requires the NMS to poll for data; it cannot push streaming telemetry to subscribers, introducing monitoring latency proportional to the polling interval. (5) Designed for monitoring, not configuration: SNMP's SET operation lacks the validation, locking, and commit/rollback semantics needed for safe automated large-scale provisioning in production networks.",
      type: "Conceptual"
    },
    {
      q: "What is the 'partial configuration' problem in SNMP and how does NETCONF's transaction model solve it?",
      a: "The partial configuration problem: SNMP SET PDUs are individually processed by the agent — there is no grouping of multiple SETs into a single atomic operation. If a configuration change requires 10 SET operations (e.g., configuring an OSPF area: area ID, type, authentication, cost, timers, interface assignments, redistribution, summarisation, stub flag, default-cost), and the agent crashes or a timeout occurs after operation 6, the device has applied only operations 1–6. The remaining operations 7–10 were never applied, leaving the device in an inconsistent partial state that may cause routing loops or service disruption. NETCONF solves this with the candidate datastore model: the NMS locks the candidate datastore, sends all configuration changes as a single edit-config RPC (which can contain hundreds of operations), the server validates all changes against YANG models without applying them, and then a commit RPC atomically applies all changes to the running datastore simultaneously. If any operation fails validation, the entire edit is rejected before any change touches the live configuration. If a commit fails mid-way, NETCONF's confirmed-commit mechanism triggers an automatic rollback to the pre-change state.",
      type: "Analytical"
    },
    {
      q: "Calculate P_fail for k = 8 steps and p_set = 0.05. Is this an acceptable risk level for production network configuration?",
      a: "P_fail = 1 - (1 - 0.05)^8 = 1 - 0.95^8 = 1 - 0.6634 = 0.3366 = 33.66%. An 8-step configuration change has a 33.66% probability of partial failure at 5% per-step failure rate. This is completely unacceptable for production use. Even at a very low per-step failure rate of 1% (p = 0.01): P_fail = 1 - 0.99^8 = 1 - 0.9227 = 7.73% — still nearly 1-in-13 configuration changes partially failing. For context, a typical BGP peering configuration involves 8–15 SET operations, and a large-scale provisioning job may require hundreds. This analysis definitively demonstrates why transactional configuration management (NETCONF commit/rollback) is mandatory for automated production network operations.",
      type: "Numerical"
    },
    {
      q: "Why did operator requirements for streaming telemetry fundamentally require a new protocol rather than an extension to SNMP?",
      a: "SNMP's core architecture is built on a request-response polling model over UDP: the NMS must send a GET request to receive data. There is no mechanism in the SNMP protocol for an agent to autonomously push data to a subscriber at a configurable rate. Adding streaming to SNMP would require fundamental redesign of the protocol — replacing UDP with TCP or QUIC, adding subscription management (what data, what interval, what encoding), buffering for missed updates, and back-pressure mechanisms. This is essentially a new protocol. Furthermore, 5G telemetry requirements include: sub-second sampling intervals (impractical with polling overhead), gRPC binary encoding for efficiency (incompatible with SNMP BER encoding), OpenConfig or YANG data models (incompatible with MIB OID trees), and TLS/mTLS transport security (SNMP uses UDP with USM). gRPC/gNMI (gNMI = gRPC Network Management Interface) was specifically designed to meet these requirements — it provides dial-in (NMS subscribes to device) and dial-out (device pushes to NMS) streaming telemetry with YANG-modelled data, gRPC transport, and configurable sampling intervals down to milliseconds.",
      type: "Analytical"
    },
    {
      q: "What is RFC 3535 and why is it historically significant in network management?",
      a: "RFC 3535 (May 2003), titled 'Overview of the 2002 IAB Network Management Workshop', documents the findings of an IETF workshop that gathered telecom operators to formally articulate their requirements for the next generation of network management protocols. It is historically significant because it represents the first time operator requirements were rigorously documented as the starting point for protocol design — rather than having protocol designers decide what operators needed. The workshop identified that operators found SNMP SET too dangerous for configuration, CLI scripting too fragile, and existing management systems too vendor-specific and non-interoperable. The requirements documented in RFC 3535 directly shaped the design of NETCONF (RFC 4741, 2006): transactional configuration with commit/rollback, candidate datastore, configuration locking, and YANG data models. Without RFC 3535, NETCONF may have been designed to satisfy protocol designers rather than operators — making it another technically correct but practically abandoned standard.",
      type: "Conceptual"
    }
  ],
  virtualLab: {
    description: "You are designing an automated provisioning workflow for a 50-step device configuration. Your task: compare the risk of partial configuration failure under SNMP's non-transactional SET model vs NETCONF's atomic commit. Adjust the number of config steps and the per-step failure probability. The chart shows the cumulative probability that at least one step fails — NETCONF reduces this to the per-step failure probability regardless of complexity. Find the step count where SNMP risk becomes operationally unacceptable for your SLA.",
    interpretation: "At just 2% per-step failure, a 10-step SNMP-based change has an 18% chance of partial failure — meaning one in five maintenance windows risks leaving the device in an inconsistent state. At 5% per-step, an 8-step change has a 34% failure probability. This is why production-grade automation mandates NETCONF: its candidate datastore + commit atomicity collapses all k steps into one atomic transaction. Regardless of whether your change has 5 steps or 50, P_fail under NETCONF equals p_set of a single step. Use this lab to calculate the risk exposure of your current SNMP-based automation and build the business case for NETCONF migration.",
    parameters: [
      { id: "steps", name: "Config Steps (k)", min: 1, max: 30, default: 10, step: 1, unit: "" },
      { id: "pset", name: "Per-step Failure %", min: 1, max: 20, default: 2, step: 1, unit: " %" }
    ],
    generateData: (params) => {
      const maxK = params.steps || 10;
      const p = (params.pset || 2) / 100;
      const pts: Array<{ x: number; y: number }> = [];
      for (let k = 1; k <= maxK; k++) {
        const pfail = (1 - Math.pow(1 - p, k)) * 100;
        pts.push({ x: k, y: parseFloat(pfail.toFixed(2)) });
      }
      return pts;
    },
    labels: { x: "Configuration Steps (k)", y: "Partial Failure Probability (%)" }
  }
};
