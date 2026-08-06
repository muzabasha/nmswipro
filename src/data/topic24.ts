import type { TopicData } from './types';

export const topic24Data: TopicData = {
  id: "u3t2",
  title: "Root Cause Analysis",
  moduleName: "Unit III: Alarm Lifecycle Management",
  context: {
    prerequisites: ["Fault Correlation"],
    dependentTopics: ["Alarm Suppression Mechanism", "NMS Discovery"],
    nextSteps: "Study Alarm Suppression Mechanism to understand how identified root causes are used to mute downstream symptomatic alarms and streamline the operator alarm console.",
    rfcReferences: [
      { rfc: "ITU-T X.733", title: "Alarm Reporting Function", summary: "Root cause indication in alarm reports — defines how symptomatic alarms reference their root cause.", url: "https://www.itu.int/rec/T-REC-X.733/en" },
      { rfc: "ITU-T M.3400", title: "TMN Management Functions", summary: "TMN management functions including fault localization and RCA procedures for telecommunication networks.", url: "https://www.itu.int/rec/T-REC-M.3400/en" },
      { rfc: "3GPP TS 32.111-2", title: "Fault Management - Alarm IRP", summary: "Alarm correlation and root cause analysis for mobile networks — topology-based RCA algorithms.", url: "https://www.3gpp.org/ftp/Specs/archive/32_series/32.111-2/" },
      { rfc: "RFC 6241", title: "NETCONF Protocol", summary: "Used for topology data retrieval in RCA graph traversal operations.", url: "https://www.rfc-editor.org/rfc/rfc6241" },
      { rfc: "ETSI GS NFV-IFA 007", title: "Architecture of the Or-Vi Reference Point", summary: "NFV RCA architecture — defines fault management functions and dependency modeling for VNFs.", url: "https://www.etsi.org/deliver/etsi_gs/NFV-IFA/001_099/007/" }
    ]
  },
  storytelling: {
    analogy: "Forensic Investigation at a Crime Scene",
    story: "Root Cause Analysis in network management is forensic investigation applied to fault data. The alarm console is the crime scene — it contains many clues — timestamps, affected objects, topology relationships, performance metrics, event sequences — but the investigator (the RCA engine) must separate the suspect (the root cause) from the witnesses (secondary symptomatic alarms) and the bystanders (unrelated concurrent alarms). Just as a forensic investigator does not arrest the first person found at the crime scene, a well-designed RCA engine does not simply flag the first alarm received as the root cause. Instead, it builds a chain of evidence: topology-based analysis traces the alarm dependency graph from every symptomatic alarm back up the network hierarchy toward the point of origin — the device or link whose failure explains all the downstream symptoms. Temporal analysis examines timestamps to identify which alarm preceded all others — the earliest alarm in a correlated group is the strongest candidate for root cause. Codebook-based matching compares the alarm pattern against a library of known fault signatures: 'pattern of OSPF-neighbour-down + BGP-session-drop + interface-down from devices in the same segment' matches known signature #47: 'aggregation-layer power failure'. Machine learning RCA models, trained on thousands of historical incidents, assign probability scores to candidate root causes, surfacing the most likely explanation. The quality of the RCA engine is measured by its accuracy — how often it correctly identifies the true root cause — and its false-positive rate — how often it points at the wrong device. In a tier-1 telecom, an RCA engine with 90% accuracy prevents thousands of misdirected repair dispatches per year, saving millions in operational costs.",
    reflectiveQuestions: [
      "In a large network with hundreds of simultaneous alarms from multiple failures, how does the RCA engine determine whether to build one fault group or multiple independent groups?",
      "Why might temporal ordering of alarms be unreliable as the sole RCA method, and what happens if NE clocks are not synchronised via NTP?",
      "How should an RCA system handle a 'known unknown' — a fault pattern that doesn't match any codebook entry and hasn't been seen in training data?"
    ],
    technicalConnection: "**ITU-T X.733 §7.2.1.2 Root Cause Indication**: correlatedNotifications attribute contains list of alarm IDs sharing same root cause. **ITU-T M.3400 TMN RCA Functions**: Fault Localization (§6.2.3.1) - identifies faulty resource from symptom reports. **3GPP TS 32.111-2 RCA Algorithm**: Topology Traversal - for alarm A from node v: compute ancestor_set U = {u ∈ V | path_exists(u → v) ∧ alarm_active(u) ∧ timestamp(u) < timestamp(A)}. Root cause candidate: u* = argmax_{u ∈ U} [descendant_count(u) × severity_weight(u) / hop_distance(u,v)]. **ETSI NFV-IFA 007 VNF RCA**: Fault dependency model - VNF instance failure ← VNFC failure ← VM failure ← hypervisor failure ← physical host failure. RCA traverses this hierarchy. **Confusion Matrix Metrics**: Accuracy = (TP+TN)/(TP+TN+FP+FN). Precision = TP/(TP+FP) - fraction of identified root causes that are correct. Recall = TP/(TP+FN) - fraction of true root causes that were identified. F1-score = 2×(Precision×Recall)/(Precision+Recall) - harmonic mean. **Codebook Matching**: Pattern library P with signatures. For incoming alarm set A: score_i = jaccard_similarity(A, pattern_i.signature) × pattern_i.confidence. Select pattern with max score if score > threshold_match. **ML-Based RCA (GNN)**: Graph Neural Network processes topology graph G=(V,E,X) where X are node features (alarm type, severity, timestamp). Node embedding: h_v^(k+1) = σ(W^(k) × [h_v^(k) || AGGREGATE({h_u^(k) | u ∈ N(v)})]). Output layer: P(v is root cause) = softmax(MLP(h_v^(K))). Training: cross-entropy loss on labelled historical incidents. **RFC 6241 Topology Retrieval**: NETCONF get-config source='running' filter subtree='/ietf-network-topology:networks' returns topology graph for RCA traversal."
  },
  mathModelling: {
    need: "A mobile operator's 5G NR network experiences a major service degradation: 450 cells go out of service simultaneously. The alarm management system receives 3,200 alarms in 2 minutes. The NOC must identify the single root cause within 5 minutes to restore service. Post-incident review shows that the failure originated at a single midhaul IP router — all 450 cells were backhauled through it. Decision: manual NOC investigation / event correlation + topology traversal / automated RCA engine / AI-based RCA.",
    equation: "DECISION CONSTRAINT: Root cause identified within 5 minutes of first alarm. Must handle 3,200 alarms in < 60 seconds. Root cause must be the single network element failure (not a symptom alarm). Must generate a structured incident ticket automatically. Decision: Manual NOC / Topology Traversal RCA / Automated RCA Engine / AI-based RCA.",
    technicalDetails: "Manual NOC Investigation: Engineers manually inspect alarm dashboard, filter by location, check topology maps. Average RCA time: 15–25 minutes for a 450-cell failure with 3,200 alarms — 3–5× over the 5-minute target. Topology Traversal RCA (Recommended): Algorithm traverses the network topology graph starting from alarming cells. Finds the common ancestor node (midhaul router) that is an alarm source shared by all 450 cells. Traversal: O(N log N) for N=450 cells and depth-5 topology — completes in < 2 seconds. Root cause identified: 90 seconds after first alarm (60-second correlation window + 30-second traversal). Incident ticket auto-generated with: root cause element, affected cell list, estimated subscriber impact (450 cells × average 500 subscribers = 225,000 affected). Automated RCA Engine (Moogsoft, IBM AIOps): SaaS RCA tools using pre-trained ML models. Integration time: 3–6 months. Accuracy: 85–90% on known failure patterns. Novel failures: 60–70% accuracy. Processing: near-real-time. AI-based RCA (custom GNN): Highest accuracy (92–95%) on trained failure patterns. Requires 12+ months of labelled incident data. Development: 6–12 months. Not available now.",
    explanation: [
      { term: "Manual NOC Investigation", meaning: "Engineers inspect alarm dashboard and topology maps manually. WHY REJECTED: Average RCA time 15–25 minutes for a 450-cell failure — 3–5× over the 5-minute target. At 3,200 alarms in 2 minutes, manual filtering is impractical. WHEN ADOPTED: Used for novel, complex failure scenarios not covered by automated RCA rules — the automated system escalates to NOC with a candidate root cause list, and the engineer makes the final determination." },
      { term: "Topology Traversal RCA (Recommended)", meaning: "Graph traversal from symptom alarms to common ancestor. 450 cells → shared midhaul router in < 2 seconds. Root cause identified within 90 seconds. Incident ticket auto-generated. WHY BEST: Meets the 5-minute target. Deterministic — same failure always produces the same result. Zero false positives from topology errors (topology database is kept current via NMS discovery). Widely deployed: Nokia NetAct RCA, Ericsson OSS RCA, and Huawei iMaster NCE all use topology-aware RCA engines." },
      { term: "Automated RCA Engine (SaaS ML)", meaning: "Pre-trained ML models (Moogsoft, IBM AIOps). 85–90% accuracy. Near-real-time. WHY SECONDARY: 3–6 month integration time. Novel failures (new equipment types) reduce accuracy to 60–70%. False positives require NOC validation — adding 2–3 minutes to the RCA process. WHEN ADOPTED: Supplement to topology traversal for ambiguous failure scenarios where topology alone cannot identify the root cause (e.g., software bugs that generate atypical alarm patterns)." },
      { term: "AI-based RCA (custom GNN)", meaning: "92–95% accuracy on trained patterns. But requires 12+ months of labelled data and 6–12 months development. WHY NOT YET: Insufficient labelled data. Development timeline exceeds the business requirement for a solution within 3 months. WHEN ADOPTED: Long-term goal after topology traversal RCA generates 12+ months of labelled incidents — GNN trained on this data can handle novel failures not expressible as topology rules." }
    ],
    advantages: [
      "Topology traversal RCA identifies the single root-cause element from 3,200 alarms in under 90 seconds — meeting the 5-minute business constraint with 3× margin",
      "Auto-generated incident tickets include the affected cell list and estimated subscriber impact (225,000 in this case) — enabling immediate customer communication without NOC investigation",
      "Deterministic topology traversal produces the same result every time for the same failure — unlike ML-based approaches, there are no confidence scores or false-positive risks for well-modelled failure patterns"
    ],
    limitations: [
      "SaaS ML RCA is adopted as a supplement for ambiguous failures where topology traversal cannot unambiguously identify the root cause — the two approaches are complementary",
      "Manual NOC investigation is retained for novel failure scenarios escalated by the automated system — engineers make the final determination when the automated confidence is below a threshold",
      "Custom AI RCA is adopted as the long-term evolution after 12 months of labelled data from the topology traversal engine enables model training with sufficient coverage of the operator's specific failure catalogue"
    ]
  },
  activities: {
    level1: "Define the four components of a confusion matrix (TP, TN, FP, FN) in the context of RCA, and give a real-world example of each. For example, what does a False Positive mean operationally — which engineer is dispatched to which device, and what do they find when they arrive?",
    level2: "Construct a topology dependency graph for a three-tier network (core, distribution, access) where a distribution switch fails. Trace the RCA algorithm's steps: (1) list all alarming devices, (2) traverse the dependency graph upward from each alarm, (3) identify the common upstream node, and (4) state the root-cause alarm with supporting evidence.",
    level3: "An RCA engine produces the following results over 500 test incidents: TP=380, TN=85, FP=25, FN=10. Calculate (a) accuracy, (b) precision, (c) recall, and (d) F1-score. Identify the most pressing weakness and suggest one specific improvement.",
    level4: "Design a codebook with five fault signatures for a campus network. Each signature should include: alarm pattern (list of alarm types and their source devices), topology condition (e.g., all source devices connected to same switch), temporal condition (all alarms within N seconds), and the mapped root cause with confidence score."
  },
  projects: {
    scope: "Develop an RCA evaluation framework that tests three RCA algorithms — topology-only, temporal-only, and combined topology+temporal — against a dataset of simulated network incidents, producing a confusion matrix and performance metrics for each.",
    objectives: [
      "Generate a synthetic dataset of 200 network incidents with ground-truth root causes, using a configurable network topology model with 30 nodes",
      "Implement three RCA algorithms: pure topology traversal, pure temporal ordering, and combined topology+temporal with configurable weights",
      "Evaluate each algorithm using accuracy, precision, recall, and F1-score; identify which algorithm performs best and under what network conditions"
    ],
    deliverables: [
      "Python RCA evaluation framework with incident generator, three algorithm implementations, and confusion matrix calculator",
      "Performance comparison table: accuracy, precision, recall, F1-score for all three algorithms across 200 test incidents",
      "Analysis report identifying the top three failure modes of each algorithm and recommending a hybrid approach for production deployment"
    ]
  },
  questions: [
    {
      q: "What are the four methods used in RCA engines and what are the strengths of each?",
      a: "Topology-based RCA traverses the network dependency graph from each symptomatic alarm upward to find the first common ancestor node — the device whose failure explains all downstream symptoms. Strength: works reliably for topologically simple cascade failures. Temporal-based RCA ranks candidates by alarm timestamp — the device that raised the earliest alarm in a correlated group is considered the likely root cause. Strength: fast and requires no topology data, works well when NE clocks are well-synchronised. Codebook-based RCA compares the active alarm pattern against a library of known fault signatures. Strength: deterministic and explainable; ideal for known recurring fault types. ML-based RCA uses statistical models (decision trees, neural networks, Bayesian networks) trained on historical incident data to assign probability scores to candidate root causes. Strength: handles novel alarm combinations and improves over time. Production RCA engines combine all four methods — topology and temporal analysis produce a candidate list, codebook matching scores candidates, and ML provides probabilistic ranking.",
      type: "Conceptual"
    },
    {
      q: "Why is NTP synchronisation critical for temporal-based RCA, and what errors can arise without it?",
      a: "Temporal-based RCA relies on alarm timestamps to determine which fault event preceded all others — the assumption being that the earliest alarm is most likely the root cause. If network elements have unsynchronised clocks, timestamps become unreliable: a secondary alarm from a device with a clock running 5 minutes ahead may appear to have occurred before the actual root-cause event, causing the RCA engine to misidentify a downstream victim as the root cause. For example, if Core-Router-X fails at 10:00:00 UTC but has no NTP sync and its clock shows 09:55:00, while Distribution-Switch-Y (which is actually a victim) has a correct clock showing 10:00:05, the temporal RCA engine will incorrectly conclude that Switch-Y failed first. The result is a false root-cause attribution — a repair team is dispatched to Switch-Y while Core-Router-X continues to fail. NTP synchronisation to a stratum-1/2 source with accuracy better than 100 ms is a minimum requirement for reliable temporal RCA.",
      type: "Analytical"
    },
    {
      q: "An RCA system is evaluated on 400 incidents: TP=300, TN=60, FP=30, FN=10. Calculate accuracy, precision, and recall.",
      a: "Total = TP + TN + FP + FN = 300 + 60 + 30 + 10 = 400. Accuracy = (TP + TN) / Total = (300 + 60) / 400 = 360 / 400 = 0.90 = 90%. Precision = TP / (TP + FP) = 300 / (300 + 30) = 300 / 330 = 0.909 = 90.9%. Recall = TP / (TP + FN) = 300 / (300 + 10) = 300 / 310 = 0.968 = 96.8%. The system has high recall (rarely misses the real root cause) but moderate precision (about 9% of root-cause attributions are incorrect). The primary improvement target is reducing false positives — tightening topology constraints or raising the confidence threshold for root-cause attribution.",
      type: "Numerical"
    },
    {
      q: "Describe the end-to-end RCA pipeline in an NMS from alarm reception to root-cause alarm presentation.",
      a: "The RCA pipeline processes alarms in a multi-stage flow: (1) Alarm Reception — raw SNMP traps and NETCONF notifications arrive at the NMS southbound interface and are queued. (2) Normalisation — vendor-specific alarm formats are translated to a canonical alarm schema (alarm type, source object, severity, timestamp, additional text). (3) Topology Enrichment — the normalised alarm is enriched with topology context: which devices and links are upstream/downstream of the alarm source, fetched from the CMDB or topology service. (4) Correlation Grouping — the correlation engine groups the new alarm with existing active alarms that share a common topology ancestor within the time window. (5) RCA Evaluation — for each correlated group, the RCA engine runs topology traversal, codebook matching, and ML scoring to rank candidate root causes. (6) Root-Cause Alarm Creation — the highest-scored candidate is elevated as the root-cause alarm with confidence percentage and supporting evidence listed. (7) Console Presentation — the root-cause alarm appears on the active alarm console; secondary alarms are displayed as a collapsed group beneath it. Total pipeline latency in a well-optimised system: under 5 seconds from alarm receipt to console presentation.",
      type: "Conceptual"
    },
    {
      q: "How does ML-based RCA differ from codebook-based RCA, and when should each be used?",
      a: "Codebook-based RCA uses a manually authored library of known fault patterns — each entry maps a specific combination of alarm types, source devices, and topology conditions to a labelled root cause. It is deterministic, transparent, and fast. It works excellently for well-understood, recurring fault types (e.g., spanning tree topology changes, BGP route flapping, hardware fan failures) where patterns are stable. Limitation: cannot handle patterns not in the codebook; requires ongoing manual maintenance as the network evolves. ML-based RCA uses algorithms (random forests, gradient boosting, LSTM networks) trained on historical incident data with labelled root causes. It can handle novel alarm combinations, learns from new incidents automatically, and provides confidence scores. It works best when a large labelled historical dataset is available (thousands of incidents) and when fault patterns are complex or variable. Limitation: requires labelled training data, is a black box (hard to explain decisions), and may hallucinate root causes for rare fault types with few training examples. Best practice: use codebook for known failure modes (fast, explainable) and ML as a fallback for unknown patterns, combining both in an ensemble with human review for low-confidence results.",
      type: "Analytical"
    }
  ],
  virtualLab: {
    description: "You are designing a network topology to minimise root cause analysis (RCA) convergence time. Your task: determine how topology depth impacts the time needed to traverse the affected element graph during an outage. Adjust the number of affected cells and the topology depth. The target RCA completion time is 5 minutes (300,000 ms). Find the maximum topology depth that keeps traversal time under this target for your network size.",
    interpretation: "With 450 affected cells at depth 5, traversal completes in under 2 seconds — well within the 5-minute target. But at depth 8, the same 450 cells take 3.6 seconds — still fast, but the complexity grows linearly. The real cost is at larger scales: 10,000 cells at depth 8 would take 80 seconds — still acceptable. This is why flat IP topologies with 2-3 aggregation tiers are recommended: they bound traversal time regardless of network size, enabling RCA convergence within seconds even for large outage scenarios.",
    parameters: [
      { id: "cells", name: "Affected Cells", min: 10, max: 500, default: 100, step: 10, unit: "" },
      { id: "depth", name: "Topology Depth", min: 1, max: 10, default: 5, step: 1, unit: "" }
    ],
    generateData: (params) => {
      const maxCells = params.cells || 100;
      const depth = params.depth || 5;
      const pts: Array<{ x: number; y: number }> = [];
      for (let c = 10; c <= maxCells; c += 10) {
        const hops = c * depth;
        const timeMs = hops / 1000 * 1000;
        pts.push({ x: c, y: parseFloat(timeMs.toFixed(1)) });
      }
      return pts;
    },
    labels: { x: "Affected Cells", y: "Traversal Time (ms)" }
  }
};
