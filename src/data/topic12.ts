import type { TopicData } from './types';

export const topic12Data: TopicData = {
  id: "u1t12",
  title: "SNMP Limitations and Operators Requirement",
  moduleName: "Unit I: Introduction to Network Management and Frameworks",
  context: {
    prerequisites: ["SNMP TRAPS", "SNMP Concepts & Evolution", "SNMP Architecture"],
    dependentTopics: ["YANG Evolution & Background", "Introduction to Model-Driven Management"],
    nextSteps: "Study YANG Evolution & Background and then the NETCONF Protocol Concept — both of which were designed specifically to address the SNMP limitations catalogued in this topic."
  },
  storytelling: {
    analogy: "An Aging Telephone Exchange Managing a Smart City",
    story: "Imagine trying to manage a modern smart city — autonomous vehicles, IoT sensors, real-time traffic management, emergency response coordination — using a 1970s rotary-dial telephone exchange. It technically 'works' for basic calls, but it cannot handle the volume, the speed, the automation, or the security requirements of a modern city. SNMP is the network equivalent: designed in 1988 for managing a few hundred routers with megabit links, it technically still functions in 2024 — but operators managing 5G networks with 100,000+ elements, zero-touch provisioning requirements, and millisecond-precision streaming telemetry hit fundamental architectural walls. The 1970s exchange cannot be 'upgraded' to handle autonomous vehicles — its core design is simply incompatible with the requirement. Similarly, SNMP's pull-only polling model cannot deliver streaming telemetry; its non-transactional SET operations cannot safely configure complex multi-step changes; its SMI type system cannot express the rich data models needed for NFV and SDN; and its SNMPv1/v2c community string security cannot protect management traffic in zero-trust environments. RFC 3535 (2003) documented these operator requirements formally, leading directly to the development of NETCONF (RFC 4741, 2006) and YANG (RFC 6020, 2010).",
    reflectiveQuestions: [
      "Why does SNMP's pull-based polling model fail fundamentally for streaming telemetry use cases in 5G networks?",
      "How does the lack of transactional semantics in SNMP SET lead to partial configuration failures that can cause network outages?",
      "What specific operator requirements in RFC 3535 could not be satisfied by extending SNMP — requiring a new protocol entirely?"
    ],
    technicalConnection: "Key SNMP limitations documented in RFC 3535 and operator feedback: (1) No transaction support — multi-step SET operations have no rollback; partial failures leave devices in inconsistent states. (2) Security weaknesses in SNMPv1/v2c — community strings in cleartext. (3) Limited SMI data types — no support for complex data structures, lists with multiple keys, or conditional constraints. (4) Pull-only model — SNMP cannot push streaming telemetry; polling introduces latency proportional to the polling interval. (5) Poor scalability for configuration — SNMP was designed for monitoring, not large-scale automated provisioning. NETCONF addresses (1), (3), (5) via transactions, YANG models, and RPC operations. gRPC/gNMI addresses (4) via streaming subscriptions. SNMPv3 addresses (2)."
  },
  mathModelling: {
    need: "To quantify the configuration failure risk of SNMP's non-transactional SET model for multi-step configuration changes, providing a mathematical justification for NETCONF's transactional approach.",
    equation: "P_{\\text{fail}}(k) = 1 - (1 - p_{\\text{set}})^k",
    technicalDetails: "When a configuration change requires \\( k \\) sequential SNMP SET operations, each having an independent failure probability \\( p_{\\text{set}} \\) (due to network loss, agent timeout, or type mismatch), the probability that at least one operation fails — leaving the device in a partially configured, inconsistent state — is \\( P_{\\text{fail}}(k) = 1 - (1-p_{\\text{set}})^k \\). SNMP has no rollback: if operation 7 of 10 fails, operations 1–6 have already been applied. NETCONF uses candidate datastore + commit: all \\( k \\) operations are staged, validated against the YANG model, and applied atomically — either all succeed or none are applied. For \\( k = 10 \\) steps and \\( p_{\\text{set}} = 0.02 \\): \\( P_{\\text{fail}} = 1 - 0.98^{10} \\approx 18.3\\% \\). Nearly 1-in-5 complex configuration changes partially fails under SNMP's model.",
    explanation: [
      { term: "P_{\\text{fail}}(k)", meaning: "Probability of at least one partial failure in a k-step configuration change" },
      { term: "k", meaning: "Number of sequential SNMP SET operations in the configuration change" },
      { term: "p_{\\text{set}}", meaning: "Per-operation failure probability (network loss, timeout, or validation error)" }
    ],
    advantages: [
      "Clearly quantifies the operational risk of SNMP's non-transactional configuration model",
      "Provides a mathematical basis for justifying migration to NETCONF/YANG in operator business cases"
    ],
    limitations: [
      "The model assumes independent failures per step; correlated failures (e.g., agent crash) affect all subsequent steps simultaneously",
      "The transition from SNMP to NETCONF/YANG requires significant operator re-training and tooling investment"
    ],
    simulation: {
      description: "Vary the number of configuration steps (k) and per-step failure probability to see how partial configuration failure risk grows with configuration complexity. This directly motivates NETCONF's transactional commit model.",
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
      labels: { x: "Config Steps (k)", y: "Partial Failure Probability (%)" }
    }
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
    description: "Vary the number of configuration steps and per-step failure probability to observe how partial configuration failure risk grows with configuration complexity under SNMP's non-transactional SET model. This directly motivates NETCONF's atomic commit/rollback approach.",
    interpretation: "Even at a low 2% per-step failure rate, a 10-step configuration change has an 18% chance of partial failure. At 5% per-step, an 8-step change has a 34% failure probability. In production networks where automated provisioning scripts routinely apply 20-50 SET operations per device, this risk is operationally unacceptable. NETCONF's candidate datastore + commit atomicity reduces the effective k to 1 (the entire change either commits or rolls back), making P_fail ≈ p_set regardless of configuration complexity.",
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
