import type { TopicData } from './types';

export const topic2Data: TopicData = {
  id: "u1t2",
  title: "eTOM and TMN Framework",
  moduleName: "Unit I: Introduction to Network Management and Frameworks",
  context: {
    prerequisites: ["Understanding of Mobile Network", "Basic Telecom Operations Knowledge"],
    dependentTopics: ["EMS and NMS Architecture", "FCAPS Process"],
    nextSteps: "Study how EMS and NMS architecture implements the hierarchical management model defined by TMN.",
    rfcReferences: [
      { rfc: "ITU-T M.3010", title: "Principles for a Telecommunications Management Network (TMN)", summary: "The foundational ITU-T standard defining the 5-layer TMN architecture (BML, NML, EML, NEL, QAL) covered in this topic.", url: "https://www.itu.int/rec/T-REC-M.3010/en" },
      { rfc: "ITU-T M.3050", title: "Enhanced Telecom Operations Map (eTOM)", summary: "Defines the eTOM business process framework referenced in this topic, including OPS, SIP, and EM process areas.", url: "https://www.itu.int/rec/T-REC-M.3050/en" },
      { rfc: "TM Forum GB921", title: "eTOM Business Process Framework", summary: "TM Forum's official eTOM specification document, the industry standard for telecom process mapping.", url: "https://www.tmforum.org/resources/standard/gb921-etom-business-process-framework-r22-5-0/" }
    ]
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
    need: "A national telecom operator running 3 separate OSS platforms (one per technology domain: 4G, 5G, fixed-line) wants to consolidate to a single management framework. The business constraint: the new framework must support all FCAPS functions, reduce operational headcount by 20%, and be deployable within 18 months. Three framework options are under evaluation: retain separate domain OSS, implement eTOM-aligned common OSS, or adopt TM Forum ODA (Open Digital Architecture).",
    equation: "DECISION CONSTRAINT: Framework must cover Operations (OPS) + SIP + EM process areas across all 3 technology domains. Time-to-deploy ≤ 18 months. OpEx reduction target ≥ 20% within 24 months of deployment.",
    technicalDetails: "Retain separate OSS: zero migration cost but zero OpEx saving — 3 teams, 3 toolsets, 3 separate vendor support contracts. Ongoing complexity grows as 5G SA (standalone) adds a fourth domain. eTOM-aligned common OSS (e.g., Nokia NetCracker, Amdocs OSS): 12-18 month migration, 25-35% OpEx saving through process standardisation and headcount consolidation. Well-understood, widely deployed, large vendor ecosystem. TM Forum ODA: cutting-edge microservices architecture aligned with cloud-native 5G, but tooling maturity is low (2024), limited vendor implementations, 24-36 month realistic deployment timeline — exceeds the 18-month constraint.",
    explanation: [
      { term: "Retain Separate Domain OSS", meaning: "Adopted when migration risk is considered higher than ongoing operational cost. Suitable for operators with stable networks and no near-term 5G SA expansion. Fails the OpEx reduction target and increases complexity as new domains are added." },
      { term: "eTOM-Aligned Common OSS (Recommended)", meaning: "Adopted when the operator requires a proven, deployable framework within the budget and timeline constraints. eTOM (GB921) process definitions map directly to existing team roles, enabling smooth transition. Meets all three constraints: FCAPS coverage, 18-month timeline, and 20%+ OpEx reduction through consolidation." },
      { term: "TM Forum ODA", meaning: "Adopted by greenfield operators or those undergoing digital transformation with a 3-5 year horizon. Provides cloud-native scalability and intent-based automation but requires significant architectural redesign. Inappropriate when the 18-month constraint is binding." }
    ],
    advantages: [
      "eTOM provides a standard process taxonomy that maps directly to existing operator roles — minimal retraining required",
      "Large vendor ecosystem (Nokia, Ericsson, Amdocs, Huawei) means competitive tendering reduces CapEx",
      "Proven in 100+ operator deployments with documented 20-35% OpEx reduction case studies"
    ],
    limitations: [
      "Separate OSS is retained when the operator has a short-term horizon or is preparing for acquisition",
      "ODA is adopted when the operator is building a greenfield 5G-Advanced or 6G network from scratch",
      "Hybrid (eTOM processes over ODA architecture) is emerging for operators who want ODA benefits without a hard cutover"
    ]
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
    description: "You are an EMS architect designing a management system for a growing network. Your task: determine the optimal concurrency level to keep management overhead under 60 seconds as the network scales. Adjust the number of network elements and the EMS's concurrent polling threads. Each NE takes 2 seconds to poll. The chart shows total polling overhead — your goal is to find the minimum concurrency needed to stay within the target overhead for your NE count.",
    interpretation: "Management overhead grows linearly with NE count unless concurrency is increased proportionally — double the concurrency halves the overhead. For a 500-NE network with concurrency of 10, overhead is 100 seconds — over the 60-second target. Increasing concurrency to 25 brings it to 40 seconds. This directly drives the EMS→NMS hierarchy: each EMS manages a bounded domain (e.g., 200 NEs at concurrency 10 = 40 seconds overhead), while the NMS aggregates across EMS instances without direct element polling. Find the sweet spot where concurrency investment matches your scalability budget.",
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
