import type { TopicData } from './types';

export const topic23Data: TopicData = {
  id: "u3t1",
  title: "Fault Correlation",
  moduleName: "Unit III: Alarm Lifecycle Management",
  context: {
    prerequisites: ["Alarm Management", "EMS and NMS Architecture"],
    dependentTopics: ["Root Cause Analysis", "Alarm Suppression Mechanism"],
    nextSteps: "Proceed to Root Cause Analysis to understand how correlated alarms are traced back to a single origin device or condition in the network topology.",
    rfcReferences: [
      { rfc: "ITU-T X.733", title: "Alarm Reporting Function", summary: "Defines alarm correlation concepts and event-condition-action (ECA) rules for alarm grouping in TMN systems.", url: "https://www.itu.int/rec/T-REC-X.733/en" },
      { rfc: "ITU-T X.736", title: "Security Alarm Reporting Function", summary: "Specifies security alarm correlation and propagation mechanisms in managed networks.", url: "https://www.itu.int/rec/T-REC-X.736/en" },
      { rfc: "3GPP TS 32.111-2", title: "Fault Management - Alarm Integration Reference Point", summary: "Mobile network alarm correlation standards — defines parent-child alarm relationships and correlation ratios.", url: "https://www.3gpp.org/ftp/Specs/archive/32_series/32.111-2/" },
      { rfc: "RFC 5424", title: "The Syslog Protocol", summary: "Structured data format used in multi-vendor alarm correlation logging.", url: "https://www.rfc-editor.org/rfc/rfc5424" },
      { rfc: "ETSI GS NFV-IFA 027", title: "Performance Measurements", summary: "NFV fault correlation in virtualised environments — topology-aware correlation for VNFs.", url: "https://www.etsi.org/deliver/etsi_gs/NFV-IFA/001_099/027/" }
    ]
  },
  storytelling: {
    analogy: "A Medical Diagnostician Linking Symptoms to Disease",
    story: "Fault correlation is like a senior physician who examines 20 different symptoms — fever, cough, fatigue, chest X-ray infiltrates, elevated white blood cell count — and recognises them all as manifestations of a single underlying disease rather than 20 separate conditions requiring 20 separate treatments. Before fault correlation existed in NMS platforms, network operations centres faced exactly this problem: a single core switch failure would generate dozens of simultaneous alarms. Every router connected to that switch would report 'BGP Neighbor Down'. Every LSP traversing that switch would report 'MPLS Path Broken'. Every monitoring probe would report 'Packet Loss Exceeds Threshold'. Without correlation, an operator staring at 50+ alarms had no clear starting point — each alarm looked equally urgent. With fault correlation, the NMS analyses the topological relationships between alarming objects. It recognises that all 50 alarms originate from devices whose network path passes through a single node: Core-Switch-X. The correlation engine groups these 50 alarms into one correlated group, elevates the root-cause alarm — 'Core Switch X: Hardware Failure' — to the top of the alarm console, and marks the 49 others as 'correlated secondary'. The operator now sees one problem to solve, not fifty. The correlation ratio — how many raw alarms collapse into how few correlated alarms — is the key metric of a correlation engine's effectiveness. A good correlation engine achieves ratios of 10:1 or higher during major outages, turning alarm floods into actionable single-point fault notifications.",
    reflectiveQuestions: [
      "If a core router goes down and generates 80 secondary alarms, what is the minimum information the correlation engine needs from the network topology to correctly group all 80 alarms under one root-cause event?",
      "How does the correlation engine distinguish between two simultaneous independent failures (two separate root causes) versus one failure generating two cascading alarm waves?",
      "What risks arise from an over-aggressive correlation engine that suppresses alarms too eagerly — and how can these risks be mitigated?"
    ],
    technicalConnection: "Fault correlation is implemented in the NMS using a combination of topology graphs (stored in a graph database or CMDB), alarm dependency rules (if alarm A is active and alarm B arrives from a downstream device, B is correlated to A), and temporal proximity windows (alarms within a configurable time window — typically 30–120 seconds — are candidates for correlation). Correlation rules are expressed as event-condition-action (ECA) rules or as graph pattern matching. Tools: Netcool/Impact (IBM), NetBrain, Zabbix correlation rules, Prometheus alerting rules with inhibit_rules. The Alarm Correlation Engine sits between the alarm normalisation layer and the alarm console, processing every incoming normalised alarm event in real time."
  },
  mathModelling: {
    need: "A national backbone operator receives 8,000 raw alarms per hour during a major transmission outage. The NOC has 6 engineers. A single fibre cut at a hub site generates: 1 physical-layer alarm + 12 SDH/OTN path alarms + 40 downstream IP link alarms + 200 dependent service alarms = 253 alarms from one root cause. The NOC must correlate these into a single actionable event and identify the root cause within 3 minutes of the fibre cut occurring. Decision: no correlation / rule-based topological correlation / codebook correlation / AI-based correlation.",
    equation: "DECISION CONSTRAINT: Root cause identified within 3 minutes of first alarm. Actionable alarm count ≤ 30 per hour reaching NOC. Zero root-cause alarms suppressed. Correlation must process 8,000 alarms/hour in real time (< 1 second latency per alarm). Decision: No Correlation / Rule-Based Topological / Codebook / AI-Based.",
    technicalDetails: "No Correlation: All 8,000 alarms/hour reach the NOC. 253 alarms from a single fibre cut arrive simultaneously — engineers cannot identify the root cause within 3 minutes (typically requires 15–20 minutes of manual investigation). Root cause identification time: 15–20 minutes. Rule-Based Topological Correlation (Recommended): Correlation rules use network topology (which links share which physical fibres). Rule: 'IF >5 alarms arrive from topology cluster X within T_window=60 seconds, THEN emit one parent alarm (root cause candidate) and suppress dependent alarms.' Result: 253 alarms → 1 actionable alarm within 60 seconds of first alarm. Processing time: 2 ms per alarm — handles 8,000/hour in real time. Root cause ID: < 90 seconds. Codebook Correlation: Pre-defined alarm patterns mapped to known failure scenarios. Fast lookup (hash table). But: requires exhaustive codebook maintenance — every new network element type and failure mode must be manually added. Coverage: 70–80% of known failure types. Novel failures (new equipment, unexpected failure modes) not in the codebook generate uncorrelated alarm floods. AI-Based Correlation (Graph Neural Network): Learns topology-aware correlation patterns from historical data. Handles novel failure modes not seen in training. But: requires 18 months of labelled incident data. Training time: 2–4 weeks. Inference: 15–50 ms per alarm — meets real-time constraint. Not available yet (insufficient labelled data).",
    explanation: [
      { term: "No Correlation", meaning: "All alarms forwarded directly to NOC. WHY REJECTED: 253 alarms from a single fibre cut overwhelm the NOC. Root cause identification: 15–20 minutes — exceeds the 3-minute target. WHEN ADOPTED: In test/lab environments where all alarms are of interest for debugging network behaviour, or when the alarm volume is very low (< 10 alarms/hour) and correlation overhead is not justified." },
      { term: "Rule-Based Topological Correlation (Recommended)", meaning: "Topology-aware rules group alarms from the same physical path or dependency cluster. 253 alarms → 1 parent alarm within 60 seconds. Root cause ID: < 90 seconds — well within 3-minute target. Processing: 2 ms per alarm — handles 8,000/hour in real time. WHY BEST: Meets all constraints. Widely deployed in production NMS platforms (Nokia NetAct, Ericsson OSS, Netcracker OMC). Rule maintenance: network topology changes (new fibres, new nodes) require rule updates — typically 30 minutes per change." },
      { term: "Codebook Correlation", meaning: "Pre-defined patterns matched against alarm sequences. Fast (hash lookup). WHY INSUFFICIENT: Coverage limited to 70–80% of known failure types — novel failures generate uncorrelated floods. Codebook maintenance burden grows with network complexity. WHEN ADOPTED: Used as a supplement to topological correlation for known failure patterns that are faster to match via codebook lookup than topology traversal (e.g., common card failures with fixed alarm signatures)." },
      { term: "AI-Based Correlation (GNN)", meaning: "Learns correlation patterns from historical incidents. Handles novel failures. Inference: 15–50 ms — meets real-time constraint. WHY NOT YET ADOPTED: Requires 18 months of labelled incident data. Current dataset is insufficient. WHEN ADOPTED: After 18 months of topological correlation operation (which labels incidents), GNN model trained on labelled data progressively replaces manual rule maintenance — starting with the most common failure patterns." }
    ],
    advantages: [
      "Topological correlation reduces 253 alarms from a single fibre cut to 1 actionable parent alarm, cutting root cause identification time from 15 minutes to under 90 seconds",
      "Rule-based correlation processes 8,000 alarms per hour at 2 ms per alarm — fully real-time, with zero backlog accumulation during the worst-case transmission outage scenarios",
      "Parent alarm enrichment (attaching the correlated child alarm list and topology context) gives the engineer a complete failure picture in the first notification — no manual investigation of child alarms required"
    ],
    limitations: [
      "Codebook correlation is adopted as a supplement for known failure signatures that are faster to match via hash lookup than topology traversal — it handles 70% of common failure types with zero topology processing",
      "AI-based correlation is adopted after 18 months of labelled data from the rule-based engine — the rule engine is the prerequisite for training data generation, not the system it replaces",
      "No correlation is retained for test environments and lab NOC dashboards where full alarm visibility is needed for network behaviour analysis and equipment qualification"
    ]
  },
  activities: {
    level1: "List five types of secondary alarms that a single core router failure would generate in a typical enterprise network. For each, identify which directly connected device or protocol would raise the alarm and explain why it is a secondary (symptomatic) alarm rather than the root cause.",
    level2: "Draw a network topology with one core switch connected to four edge routers, each with two downstream hosts. A failure of the core switch generates alarms from all four routers and eight hosts. Group these alarms into a single correlated alarm tree, identifying the root-cause alarm at the top and all secondary alarms beneath it with their dependency relationships.",
    level3: "A network experiences an alarm storm: 150 raw alarms arrive in 45 seconds. The correlation engine has an efficiency of 75%. Calculate (a) the number of correlated alarm groups, (b) the correlation ratio, and (c) the percentage reduction in alarms presented to the operator.",
    level4: "Design a correlation rule set for a three-tier network (core, distribution, access). Define at least four ECA (event-condition-action) rules that handle: (a) core link failure cascading to distribution layer, (b) distribution switch failure cascading to access, (c) OSPF neighbour-down caused by interface failure, and (d) BGP session drop caused by IGP route withdrawal. Specify the topology condition and time window for each rule."
  },
  projects: {
    scope: "Build a fault correlation prototype using Python and a graph data structure to simulate a network topology, inject raw alarm events, and output correlated alarm groups with root-cause identification.",
    objectives: [
      "Model a 20-node network topology as a directed graph using NetworkX, with node types: core, distribution, access, and endpoint",
      "Implement a rule-based correlation engine that groups alarms by topological proximity and temporal window (configurable 30–120 seconds)",
      "Measure and report the correlation ratio for three simulated fault scenarios: single-point failure, dual failure, and cascading failure"
    ],
    deliverables: [
      "Python correlation engine source code with topology model, alarm injector, and correlation rule processor",
      "Three test scenario reports showing raw alarms, correlated groups, root-cause identification, and correlation ratios",
      "Performance analysis comparing correlation latency (time from last alarm to correlated output) for alarm storms of 50, 100, and 200 events"
    ]
  },
  questions: [
    {
      q: "What is fault correlation in NMS, and why is it essential during a major network outage?",
      a: "Fault correlation is the NMS process of analysing multiple incoming alarms and grouping those that share a common root cause, presenting operators with one root-cause alarm instead of many symptomatic alarms. During a major network outage — for example, a core router failure — dozens or hundreds of secondary alarms are generated simultaneously from every device that depended on the failed router: BGP-neighbour-down, OSPF-route-lost, interface-down, path-unreachable, SLA-violation. Without correlation, operators face an alarm flood that hides the real problem. With correlation, the engine uses topology data, temporal proximity, and dependency rules to group all secondary alarms under the single root-cause event, dramatically reducing operator cognitive load and accelerating diagnosis and repair.",
      type: "Conceptual"
    },
    {
      q: "Explain the three primary techniques used in fault correlation engines: topology-based, temporal-based, and rule-based correlation.",
      a: "Topology-based correlation analyses the physical and logical network topology graph to identify alarms from devices that are topologically dependent on a common upstream node. If Router-A, Router-B, and Router-C all connect through Switch-X and all three raise 'Neighbour-Down' simultaneously, topology analysis identifies Switch-X as the common dependency. Temporal-based correlation groups alarms that arrive within a configurable time window (e.g., 30–120 seconds) — the assumption is that alarms occurring close together in time are likely related to the same event. Rule-based correlation uses pre-authored ECA (event-condition-action) rules: 'IF alarm type = BGP-Neighbour-Down arrives from multiple routers AND all downstream of same core switch AND within 60 seconds THEN create correlated group with root cause = core-switch-failure'. Production systems combine all three techniques for maximum accuracy.",
      type: "Conceptual"
    },
    {
      q: "A network alarm storm produces 120 raw alarms. The correlation engine has an efficiency of 80%. Calculate the number of correlated alarm groups and the correlation ratio.",
      a: "Using the model: N_correlated = N_raw × (1 − η/100 + 0.1) = 120 × (1 − 0.80 + 0.1) = 120 × 0.30 = 36 correlated groups. Correlation ratio R_c = N_raw / N_correlated = 120 / 36 = 3.33. This means 120 individual alarms are condensed into 36 actionable alarm groups — a 70% reduction in alarm count presented to operators. In a real storm scenario, individual groups may have very different sizes; the ratio of 3.33 is an average.",
      type: "Numerical"
    },
    {
      q: "What is the risk of an over-aggressive correlation engine, and how would you detect that it is masking real independent faults?",
      a: "An over-aggressive correlation engine groups too many alarms under a single root cause, potentially hiding independent simultaneous failures. For example, if two separate hardware failures occur at the same time, an over-aggressive engine might attribute both to one root cause, delaying repair of the second fault. Detection methods: (1) Monitor the 'suppressed secondary alarms' list for alarms from devices that are NOT topologically downstream of the attributed root cause — these indicate incorrect grouping. (2) Track correlation accuracy retrospectively by comparing engine-attributed root causes against post-incident RCA reports. (3) Set a maximum group size threshold — if a single correlation group exceeds, say, 30 alarms, flag it for manual review. (4) Implement time-bounded correlation: if a correlated alarm persists longer than the root cause duration, break it out into an independent alarm. Tuning the temporal window and topology radius parameters is key to balancing false-positive correlation against alarm storm reduction.",
      type: "Analytical"
    },
    {
      q: "How does fault correlation interact with the alarm lifecycle — specifically, what happens to a correlated secondary alarm when its root-cause alarm is cleared?",
      a: "In the alarm lifecycle, a secondary alarm that has been correlated to a root-cause alarm enters a 'correlated-suppressed' state: it is acknowledged in the NMS database but not displayed on the active alarm console. When the root-cause alarm is cleared — either because the fault is repaired or because the NMS receives a clearing event (SNMP cold-start trap, NETCONF notification with alarm severity = cleared, or manual operator clearance) — the NMS re-evaluates all correlated secondary alarms. If the network has recovered (secondary symptoms have also cleared), the secondary alarms are cleared automatically in cascade. If any secondary alarm persists after root-cause clearance — indicating the secondary condition has become an independent fault — it is promoted to active status and presented to the operator as a new standalone alarm. This lifecycle management ensures that cleared root causes do not leave orphaned secondary alarms silently active in the database.",
      type: "Analytical"
    }
  ],
  virtualLab: {
    description: "Vary raw alarm volume and correlation efficiency to observe actionable alarms reaching the NOC. A single fibre cut generating 253 alarms at 97% efficiency becomes 1 actionable alarm. The chart shows how correlation efficiency translates to NOC workload reduction.",
    interpretation: "At 70% efficiency with 100 raw alarms, 30 actionable alarms reach the NOC — at the edge of the 30/hour target. At 97% efficiency, only 3 actionable alarms remain. This demonstrates why correlation rule tuning to 95%+ efficiency is essential for high-volume NOC environments, and why even small improvements in efficiency (e.g., from 90% to 97%) have a large impact on NOC workload.",
    parameters: [
      { id: "raw", name: "Raw Alarms", min: 10, max: 200, default: 100, step: 10, unit: "alarms" },
      { id: "efficiency", name: "Correlation Efficiency", min: 10, max: 99, default: 70, step: 5, unit: "%" }
    ],
    generateData: (params) => {
      const raw = params.raw || 100;
      const maxEff = params.efficiency || 70;
      const pts: Array<{ x: number; y: number }> = [];
      for (let e = 10; e <= maxEff; e += 5) {
        pts.push({ x: e, y: parseFloat((raw * (1 - e / 100)).toFixed(1)) });
      }
      return pts;
    },
    labels: { x: "Correlation Efficiency (%)", y: "Actionable Alarms" }
  }
};
