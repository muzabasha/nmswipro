import type { TopicData } from './types';

export const topic4Data: TopicData = {
  id: "u1t4",
  title: "FCAPS Process",
  moduleName: "Unit I: Introduction to Network Management and Frameworks",
  context: {
    prerequisites: ["EMS and NMS Architecture", "Basic Network Management Concepts"],
    dependentTopics: ["NMS SBI and NBI", "SNMP Concepts & Evolution"],
    nextSteps: "Explore how SNMP implements FCAPS functions at the protocol level, mapping traps to Fault Management and GET/SET operations to Configuration and Performance Management."
  },
  storytelling: {
    analogy: "Managing a Fleet of Delivery Trucks",
    story: "FCAPS is the ISO framework for network management — think of it as running a professional fleet of delivery trucks. Fault Management is the breakdown service: when a truck stops working, you detect it immediately via GPS tracking, dispatch a repair crew, and log the incident. Configuration Management is the fleet registry: every truck's load capacity, assigned routes, fuel type, and cargo manifest is recorded and kept up to date — no unauthorised modifications allowed. Accounting Management is the billing office: every mile driven, every kilogram carried, and every customer delivery is metered so invoices are accurate and revenue isn't lost. Performance Management is the operations dashboard: average delivery speeds, fuel efficiency per route, and on-time delivery percentages are tracked against KPIs so the fleet manager can identify underperforming drivers or overloaded routes. Security Management is the gated depot: only authorised drivers with valid credentials can start a truck, all cargo is sealed and tamper-evident, and access logs track who entered the depot at what time. Without FCAPS, operating a telecom network is like running a delivery company with no GPS, no vehicle records, no driver logs, and no invoicing system — sheer chaos at scale.",
    reflectiveQuestions: [
      "Which FCAPS function would you use to detect a router interface that keeps cycling between up and down states (link flapping)?",
      "How does Accounting Management in mobile networks (CDR generation) differ from traditional fixed-line billing?",
      "Why is Security Management increasingly critical in modern SDN/NFV environments where the control plane is software-based?"
    ],
    technicalConnection: "FCAPS maps directly to NMS modules: Fault Management → Alarm Management System (AMS) with ticketing integration; Configuration Management → Configuration Management Database (CMDB) and automated provisioning via NETCONF/YANG; Accounting Management → Mediation servers and Billing/Charging Systems (OCS/OFCS); Performance Management → PM data collection agents, KPI calculation engines, and dashboards; Security Management → AAA servers (RADIUS/Diameter), role-based access control (RBAC), encryption policies, and audit logging."
  },
  mathModelling: {
    need: "To model network availability as a function of fault detection and resolution time — the core performance metric for Fault Management and the basis of SLA commitments.",
    equation: "A = \\frac{MTBF}{MTBF + MTTR} \\times 100\\%",
    technicalDetails: "\\( A \\) is network availability expressed as a percentage. \\( MTBF \\) (Mean Time Between Failures) is the average operating time between successive failures, measured in hours — a property of hardware reliability and network design quality. \\( MTTR \\) (Mean Time To Repair) is the average time from fault detection to full restoration, in hours — directly controlled by Fault Management efficiency: detection speed, alarm accuracy, ticketing automation, and engineer response time. Five-nines availability (99.999%) allows only 5.26 minutes of downtime per year, which means MTTR must be kept below 5.26 minutes assuming one failure per year. Fault Management's primary KPI is reducing MTTR through automated fault detection, rapid ticket creation, and guided resolution playbooks.",
    explanation: [
      { term: "A", meaning: "Network availability expressed as a percentage" },
      { term: "MTBF", meaning: "Mean Time Between Failures — average uptime between fault events (hours)" },
      { term: "MTTR", meaning: "Mean Time To Repair — average time from fault detection to restoration (hours)" }
    ],
    advantages: [
      "Simple, universally understood industry-standard metric directly tied to SLA commitments and penalty clauses",
      "Clearly separates hardware reliability (MTBF) from operational efficiency (MTTR), enabling targeted improvement actions"
    ],
    limitations: [
      "Does not capture partial degradation — a cell operating at 50% capacity counts as fully available",
      "Assumes all failures are equally impactful; a core router failure and a single base station failure are treated identically"
    ],
    simulation: {
      description: "Adjust MTBF and the maximum MTTR value to see how availability changes as MTTR increases from 1 hour up to the selected maximum. The curve shows how quickly availability degrades with slower repair times.",
      parameters: [
        { id: "mtbf", name: "MTBF (hours)", min: 100, max: 10000, default: 2000, step: 100, unit: " hrs" },
        { id: "mttr", name: "MTTR (hours)", min: 1, max: 48, default: 4, step: 1, unit: " hrs" }
      ],
      generateData: (params) => {
        const mtbf = params.mtbf || 2000;
        const maxMttr = params.mttr || 4;
        const pts: Array<{ x: number; y: number }> = [];
        for (let mttrVal = 1; mttrVal <= maxMttr; mttrVal++) {
          const availability = (mtbf / (mtbf + mttrVal)) * 100;
          pts.push({ x: mttrVal, y: parseFloat(availability.toFixed(4)) });
        }
        return pts;
      },
      labels: { x: "MTTR (hrs)", y: "Availability (%)" }
    }
  },
  activities: {
    level1: "Define each letter in FCAPS — Fault, Configuration, Accounting, Performance, Security Management — and give one concrete real-world example of each from a mobile network operator's daily operations (e.g., which NMS screen or tool is used for each).",
    level2: "Map each FCAPS function to a specific NMS module, tool, or system. For example: Fault → alarm management/ticketing system; Configuration → CMDB and NETCONF provisioning; Accounting → CDR mediation and billing; Performance → KPI dashboard; Security → RBAC and AAA server. Explain the data flow for each mapping.",
    level3: "Calculate network availability for MTBF = 5000 hours and MTTR = 2 hours. Express the answer as a percentage to 4 decimal places. Then determine the maximum MTTR in minutes that would achieve 99.999% availability given MTBF = 5000 hours. Show your algebraic working.",
    level4: "Design a complete FCAPS management plan for a university campus network with 50 access switches, 5 distribution routers, and a 1 Gbps internet uplink. For each FCAPS function, specify: KPIs to monitor, tools to use, escalation procedure, and an automation rule (if applicable)."
  },
  projects: {
    scope: "Design an FCAPS monitoring and management dashboard concept for a hypothetical ISP serving 50,000 broadband subscribers with a mixed fibre and 4G LTE network.",
    objectives: [
      "Define at least 3 measurable KPIs for each FCAPS area and specify target thresholds that would trigger alerts",
      "Propose at least 2 automation rules each for Fault Management (auto-ticketing, auto-rollback) and Configuration Management (change validation, backup scheduling)",
      "Calculate SLA-based availability targets: determine the maximum allowable MTTR for 99.9%, 99.99%, and 99.999% availability given representative MTBF values"
    ],
    deliverables: [
      "FCAPS KPI definition table: 3 KPIs per function with target value, warning threshold, and critical threshold",
      "Automation rule specification document: at least 2 rules per function with trigger condition, action, and rollback procedure",
      "Availability calculation report: MTTR limits for three SLA tiers with supporting calculations and a sensitivity analysis chart"
    ]
  },
  questions: [
    {
      q: "What does each letter in FCAPS stand for, and what is the primary goal of each management function?",
      a: "F — Fault Management: detect, isolate, and resolve network faults rapidly to minimise service downtime. C — Configuration Management: maintain an accurate inventory of all network elements and their configurations; control changes through a structured change management process. A — Accounting Management: collect usage data (CDRs, flow records) to enable accurate billing, quota enforcement, and revenue assurance. P — Performance Management: collect, store, and analyse network KPIs (throughput, latency, error rates, utilisation) to ensure QoS targets are met and to identify degradation before it causes outages. S — Security Management: enforce access control, authentication, authorisation, and audit logging to protect network elements and customer data from unauthorised access or attacks.",
      type: "Conceptual"
    },
    {
      q: "Differentiate between Fault Management and Performance Management — when does a performance issue become a fault?",
      a: "Fault Management deals with discrete, binary events: a network element or service is either working or not. A fault is a condition that directly causes service interruption — a link going down, a process crashing, a hardware failure. Alarms are raised immediately and tracked until resolved. Performance Management deals with continuous, gradual degradation: metrics like latency, packet loss, throughput, and error rates are collected over time and compared against thresholds. A performance issue exists when a metric crosses a warning threshold but service continues. A performance issue becomes a fault when the degradation is severe enough to cause an SLA breach or service interruption — at that point, a fault alarm is generated and Fault Management processes take over. In practice, many faults are first detected by Performance Management (e.g., rising error rate) before the link fully fails.",
      type: "Conceptual"
    },
    {
      q: "Calculate network availability for MTBF = 8000 h and MTTR = 8 h. Then recalculate for MTTR = 1 h.",
      a: "Case 1 (MTTR = 8 h): A = 8000 / (8000 + 8) × 100% = 8000 / 8008 × 100% ≈ 99.9001%. Case 2 (MTTR = 1 h): A = 8000 / (8000 + 1) × 100% = 8000 / 8001 × 100% ≈ 99.9875%. Reducing MTTR from 8 hours to 1 hour improves availability from approximately 99.90% to 99.99%, demonstrating the direct impact of Fault Management efficiency on SLA attainment.",
      type: "Numerical"
    },
    {
      q: "How does Configuration Management prevent fault cascades during network changes?",
      a: "Configuration Management prevents fault cascades through: (1) Change Management Process — all configuration changes must pass a pre-change validation (syntax check, conflict detection) and be approved before execution, preventing misconfiguration-induced faults; (2) CMDB Baseline — the CMDB holds a known-good configuration baseline; automated compliance checks detect drift between running config and baseline, flagging unauthorised changes; (3) Pre-change backup — configurations are automatically backed up before any change, enabling rapid rollback if the change causes a fault; (4) Change windows — changes are scheduled during low-traffic periods with defined rollback criteria; (5) Impact analysis — the CMDB's topology data allows pre-change impact modelling, identifying which services would be affected if a given element is modified. Together these controls ensure that configuration changes, which cause a significant proportion of network outages, are executed safely with full reversibility.",
      type: "Analytical"
    },
    {
      q: "What is the relationship between Accounting Management and QoS policies in a mobile network?",
      a: "Accounting Management and QoS are tightly linked in mobile networks: (1) Usage metering — Accounting collects CDRs (Call Detail Records) and data session records including QoS class, volume, duration, and time-of-day. These feed into both billing and QoS policy decisions; (2) Policy enforcement — in LTE/5G, the PCRF/PCF uses accounting data to enforce data quotas. When a subscriber reaches their data cap, the PCRF instructs the P-GW/UPF to reclassify their traffic to a lower QoS class (throttling); (3) QoS-based charging — different service classes (voice, video, best-effort data) are charged at different rates, requiring the accounting system to track QoS markers per flow; (4) SLA reporting — Accounting data is used to verify that QoS commitments in SLAs (e.g., guaranteed bit rate for enterprise customers) were actually delivered, linking performance metrics to financial accountability.",
      type: "Conceptual"
    }
  ],
  virtualLab: {
    description: "This lab demonstrates the relationship between MTTR (Mean Time To Repair) and network availability. Set your MTBF (hardware reliability) and observe how availability degrades as MTTR increases from 1 hour up to the selected maximum. The curve shows why reducing MTTR through automated fault detection and rapid response is critical to SLA compliance.",
    interpretation: "As MTTR decreases (faster fault detection and resolution), network availability approaches 100% asymptotically. Even small reductions in MTTR at low values have a disproportionately large impact on availability. For example, cutting MTTR from 8 h to 1 h with MTBF = 2000 h improves availability from ~99.60% to ~99.95%. This demonstrates the critical value of automated fault detection, intelligent alarm correlation, and pre-configured resolution playbooks in meeting five-nines SLAs.",
    parameters: [
      { id: "mtbf", name: "MTBF (hrs)", min: 100, max: 10000, default: 2000, step: 100, unit: " hrs" },
      { id: "mttr", name: "MTTR (hrs)", min: 1, max: 100, default: 4, step: 1, unit: " hrs" }
    ],
    generateData: (params) => {
      const mtbf = params.mtbf || 2000;
      const maxMttr = params.mttr || 4;
      const pts: Array<{ x: number; y: number }> = [];
      for (let x = 1; x <= maxMttr; x++) {
        const availability = (mtbf / (mtbf + x)) * 100;
        pts.push({ x, y: parseFloat(availability.toFixed(4)) });
      }
      return pts;
    },
    labels: { x: "MTTR (hrs)", y: "Availability (%)" }
  }
};
