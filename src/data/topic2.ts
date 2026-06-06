import type { TopicData } from './types';

export const topic2Data: TopicData = {
  id: "u1t2",
  title: "eTOM and TMN Framework",
  moduleName: "Unit I: Introduction to Network Management and Frameworks",
  context: {
    prerequisites: ["Understanding of Mobile Network", "Basic Telecom Operations Knowledge"],
    dependentTopics: ["EMS and NMS Architecture", "FCAPS Process"],
    nextSteps: "Study how EMS and NMS architecture implements the hierarchical management model defined by TMN."
  },
  storytelling: {
    analogy: "A Corporation's Organizational Chart",
    story: "TMN (Telecommunications Management Network) is like a corporation's organisational chart: at the top is the Business Management Layer (CEO level — billing, SLAs, and business strategy), then the Network Management Layer (COO — an end-to-end network view across all technologies), then the Element Management Layer (department managers — each managing one technology domain), and finally the Network Element Layer (the workers — actual routers, base stations, and switches). eTOM (enhanced Telecom Operations Map) is the business process framework that defines exactly what tasks each layer performs — like a corporate procedures manual that tells every employee their role. Together, they ensure that when a cell tower fails at 2 AM, the right alarm escalates automatically through EML to NML, triggers a work order in the BSS, and reaches the on-call engineer without any manual phone calls. Without this hierarchy, a telecom operator with thousands of network elements would face an unmanageable flood of raw events with no structure for resolution.",
    reflectiveQuestions: [
      "Why does TMN use a layered architecture instead of a flat management system?",
      "How does eTOM help a telecom operator run billing and fault management from the same framework?",
      "What would happen if all management layers directly accessed network elements without the EML tier?"
    ],
    technicalConnection: "TMN defines 5 management layers: Business Management Layer (BML), Network Management Layer (NML), Element Management Layer (EML), Network Element Layer (NEL), and the Q Adaptor Layer (QAL). Standard interfaces connect them: Q3 (between NE and EMS), F (craft terminal), and X (inter-operator). eTOM organises telecom business processes into three process areas — Operations (OPS, including FCAPS), Strategy Infrastructure & Product (SIP), and Enterprise Management (EM) — and maps these to TMN layers."
  },
  mathModelling: {
    need: "To model management overhead and evaluate how many network elements each EMS can efficiently manage before polling latency becomes unacceptable.",
    equation: "M = \\frac{N_{\\text{elements}}}{C_{\\text{ems}}} \\cdot T_{\\text{poll}}",
    technicalDetails: "\\( M \\) is the total management overhead time in seconds to complete one full polling cycle of all network elements. \\( N_{\\text{elements}} \\) is the total number of managed network elements (e.g., base stations, routers). \\( C_{\\text{ems}} \\) is the EMS concurrency capacity — the number of elements it can poll simultaneously via parallel SNMP sessions or NETCONF connections. \\( T_{\\text{poll}} \\) is the time in seconds to retrieve one element's full set of KPIs. If \\( M \\) exceeds the desired polling interval (e.g., 15 minutes = 900 s), the EMS cannot sustain real-time monitoring and must either scale out or reduce polling scope.",
    explanation: [
      { term: "M", meaning: "Total management overhead time in seconds for one full polling cycle" },
      { term: "N_{\\text{elements}}", meaning: "Total number of managed network elements" },
      { term: "C_{\\text{ems}}", meaning: "EMS concurrency: number of elements polled in parallel" },
      { term: "T_{\\text{poll}}", meaning: "Polling time per element in seconds" }
    ],
    advantages: [
      "Helps correctly dimension EMS servers — determines required concurrency to meet a target polling interval",
      "Identifies bottlenecks in the management plane before they cause monitoring gaps"
    ],
    limitations: [
      "Does not account for event-driven (SNMP TRAP) notifications, which reduce reliance on polling",
      "Assumes uniform polling intervals for all elements; in practice, critical nodes are polled more frequently"
    ],
    simulation: {
      description: "Adjust the number of network elements and EMS concurrency to observe how polling overhead (M) scales. Poll time is fixed at 2 seconds per element. The curve shows overhead as element count grows from 1 to the selected maximum.",
      parameters: [
        { id: "elements", name: "Network Elements", min: 10, max: 500, default: 100, step: 10, unit: "" },
        { id: "concurrency", name: "EMS Concurrency", min: 1, max: 50, default: 10, step: 1, unit: "" }
      ],
      generateData: (params) => {
        const maxElements = params.elements || 100;
        const conc = params.concurrency || 10;
        const tPoll = 2; // seconds
        const pts: Array<{ x: number; y: number }> = [];
        for (let x = 1; x <= maxElements; x += Math.max(1, Math.floor(maxElements / 50))) {
          const overhead = (x / conc) * tPoll;
          pts.push({ x, y: parseFloat(overhead.toFixed(2)) });
        }
        return pts;
      },
      labels: { x: "Network Elements", y: "Overhead Time (s)" }
    }
  },
  activities: {
    level1: "Draw the 5-layer TMN pyramid and label each layer (BML, NML, EML, NEL, QAL) with its primary function, a real-world example system, and the interface it uses to communicate with adjacent layers.",
    level2: "Map the five FCAPS functions (Fault, Configuration, Accounting, Performance, Security Management) to the appropriate TMN layers and identify which eTOM process area each belongs to (OPS, SIP, or EM).",
    level3: "Calculate the management overhead M for 200 network elements, EMS concurrency of 20, and a poll time of 5 seconds per element. If you need to reduce M to under 60 seconds, what concurrency value is required?",
    level4: "Research how a real operator-grade OSS product (e.g., Ericsson OSS-RC / ENM, Nokia NetAct, or Huawei U2000) implements the eTOM framework. Identify which eTOM process groups are supported and write a one-page summary."
  },
  projects: {
    scope: "Model the TMN management hierarchy for a hypothetical telecom operator with three technology domains: 4G LTE RAN (Ericsson), 5G NR RAN (Nokia), and IP/MPLS Core (Cisco).",
    objectives: [
      "Define the Network Elements, EMS instances, NMS layer, and BSS/OSS layers with element counts for each domain",
      "Map eTOM process areas (OPS, SIP, EM) to specific operational tasks in each TMN layer",
      "Estimate management overhead for each EMS domain using the given formula and identify which domain is the bottleneck"
    ],
    deliverables: [
      "TMN layer diagram showing element counts, EMS systems, NMS, and BSS with all interface labels (Q3, X, F)",
      "eTOM process mapping table linking each eTOM Level 2 process to its corresponding TMN layer and responsible system",
      "Management overhead analysis report comparing overhead per domain and recommending concurrency settings"
    ]
  },
  questions: [
    {
      q: "What are the five layers of the TMN model and what is the primary responsibility of each?",
      a: "The five TMN layers are: (1) Business Management Layer (BML) — handles billing, SLA management, business planning, and revenue assurance at the CEO/CFO level; (2) Network Management Layer (NML) — provides an end-to-end view of the network, manages cross-domain services and network-wide KPIs; (3) Element Management Layer (EML) — manages a single-vendor or single-technology domain, translating domain-specific events into standardised formats for the NML; (4) Network Element Layer (NEL) — the actual physical or virtual network devices (base stations, routers, switches); (5) Q Adaptor Layer (QAL) — provides protocol adaptation for legacy or non-standard network elements that do not natively support Q3 interface.",
      type: "Conceptual"
    },
    {
      q: "What are the three process areas of eTOM and what types of processes does each contain?",
      a: "The three eTOM process areas are: (1) Operations (OPS) — day-to-day operational processes including Fulfillment (service provisioning), Assurance (fault management, performance monitoring, SLA management), and Billing (usage metering and invoice generation); (2) Strategy, Infrastructure & Product (SIP) — longer-term planning processes including strategy and commit, infrastructure lifecycle management, and product lifecycle management; (3) Enterprise Management (EM) — enterprise-wide support processes including financial management, human resources, legal management, and corporate governance.",
      type: "Conceptual"
    },
    {
      q: "Calculate the management overhead M for N = 300 network elements, EMS concurrency C = 15, and poll time T = 3 seconds.",
      a: "Using M = (N / C) × T: M = (300 / 15) × 3 = 20 × 3 = 60 seconds. This means the EMS completes one full polling cycle in 60 seconds, which is acceptable for a 5-minute polling interval but may need optimisation if near-real-time (< 30 s) monitoring is required.",
      type: "Numerical"
    },
    {
      q: "Why is the X interface used between different operators while the Q interface is used internally within one operator's network?",
      a: "The Q interface (specifically Q3) is a well-defined ITU-T standard interface designed for communication between management layers within a single operator's management domain — e.g., between a network element and its EMS, or between EMS and NMS. It carries detailed internal operational data. The X interface is specifically designed for inter-operator communication — connecting the NML of one operator to the NML (or BML) of another. It is designed with security boundaries in mind, exposing only the information necessary for inter-domain coordination (e.g., interconnection SLAs, inter-carrier fault notifications) without revealing internal topology or configuration details.",
      type: "Analytical"
    },
    {
      q: "What is the key difference between eTOM and ITIL in a telecom context?",
      a: "eTOM (TM Forum's enhanced Telecom Operations Map) is a telecom-specific business process framework that maps processes to the TMN management hierarchy and covers the full telecom business lifecycle from network operations to billing. It was designed by and for telecommunications service providers. ITIL (IT Infrastructure Library) is a broader IT service management framework applicable to any IT organisation — covering incident management, change management, and service desk processes. In practice, many telecom operators use eTOM for their network-facing OSS processes and ITIL for their IT infrastructure management, mapping ITIL incident management to eTOM's Assurance process area. eTOM is more granular in RAN/Core operations, while ITIL provides more structured governance for IT-layer processes.",
      type: "Conceptual"
    }
  ],
  virtualLab: {
    description: "This lab simulates how EMS management overhead scales with the number of network elements at different concurrency levels. Poll time is fixed at 2 seconds per element. Increase the number of NEs and adjust concurrency to see how overhead is controlled. The plot shows overhead (in seconds) as NE count steps from 10 up to the selected maximum.",
    interpretation: "As the number of NEs grows, management overhead rises linearly unless EMS concurrency is increased proportionally. Doubling concurrency halves the overhead. This drives the architectural need for hierarchical EMS→NMS management — each EMS handles only its domain, keeping its NE count manageable, while the NMS aggregates across all EMS instances without direct element polling.",
    parameters: [
      { id: "nes", name: "Network Elements", min: 10, max: 500, default: 100, step: 10, unit: "" },
      { id: "conc", name: "Concurrency", min: 1, max: 50, default: 10, step: 5, unit: "" }
    ],
    generateData: (params) => {
      const maxNes = params.nes || 100;
      const conc = params.conc || 10;
      const tPoll = 2;
      const pts: Array<{ x: number; y: number }> = [];
      for (let x = 10; x <= maxNes; x += 10) {
        const overhead = (x / conc) * tPoll;
        pts.push({ x, y: parseFloat(overhead.toFixed(2)) });
      }
      return pts;
    },
    labels: { x: "NEs", y: "Overhead (s)" }
  }
};
