import type { TopicData } from './types';

export const topic19Data: TopicData = {
  id: "u2t7",
  title: "Alarm Management",
  moduleName: "Unit II: Model-Driven Management and Protocols",
  context: {
    prerequisites: ["RESTCONF", "FCAPS Process"],
    dependentTopics: ["Fault Correlation", "NMS FM NBI Flow"],
    nextSteps: "Study Fault Correlation in Unit III to understand how alarm management feeds into root-cause analysis."
  },
  storytelling: {
    analogy: "A Hospital Emergency Triage System",
    story: "Alarm management is the hospital emergency triage system of a network. When patients (network events) arrive, triage nurses (alarm management software) categorise them by severity — Critical (code red: system down), Major (code orange: service degraded), Minor (code yellow: warning threshold crossed), Warning, and Informational. A cardiac arrest is not treated the same as a sprained ankle, just as a core router failure is not handled the same as a degraded optical signal. Alarm management handles alarm de-duplication — the same patient presenting to multiple ER entrances simultaneously — ensuring only one alarm record is raised per fault, not one per polling cycle. Alarm correlation recognises that 50 patients with the same symptoms arrived from the same accident: one root cause, not 50 independent problems. This is why a single fibre cut generates alarms on every circuit traversing that fibre — the correlation engine must identify the physical root cause and suppress the secondary alarms so operators see one clear actionable alert. Alarm suppression prevents a cascade of secondary alarms when the primary root cause is already being treated: if the core switch is down, there is no value in alerting on every downstream host that is unreachable because of it. Alarm clearing marks the alarm resolved when the underlying condition clears — a network element sends a clearing notification or the NMS detects the condition has gone. Without proper alarm management, operators face alarm storms where thousands of events flood the screen simultaneously, creating decision paralysis. The triage nurse's discipline — rapid categorisation, correlation, and prioritisation — is exactly what a well-designed alarm management module provides.",
    reflectiveQuestions: [
      "What criteria determine alarm severity in a telecom network, and who defines the mapping between fault conditions and severity levels?",
      "How does alarm de-duplication differ from alarm correlation, and why are both necessary?",
      "What is alarm suppression and under what conditions should it be applied to avoid hiding real faults?"
    ],
    technicalConnection: "ITU-T X.733 defines the alarm notification structure: alarmId (unique identifier), alarmType (communications, QoS, processing, equipment, environmental), perceivedSeverity (critical, major, minor, warning, indeterminate, cleared), probableCause (e.g., softwareError, communicationsProtocolError, lossOfSignal), specificProblem (vendor-specific detail), additionalText, managedObjectClass, managedObjectInstance, and eventTime. 3GPP TS 32.111 defines the Alarm Integration Reference Point (IRP) for mobile networks, standardising the interface between NEs and the OSS/NMS over SOAP or CORBA. An alarm lifecycle has three states: raised (alarmActiveState) → acknowledged (operator confirms awareness) → cleared (underlying fault resolved). Alarm correlation engines apply topological rules (parent–child relationships in the network graph) and temporal rules (alarms co-occurring within a time window) to group alarms to a common root cause."
  },
  mathModelling: {
    need: "A NOC at a national mobile operator receives 12,000 raw alarms per hour from 3,000 network elements during peak periods. The NOC has 8 engineers on shift. Each engineer can handle a maximum of 5 alarms per hour with full investigation and resolution. The current system floods all 12,000 alarms to the NOC dashboard without filtering — engineers are overwhelmed and critical alarms are missed. The operator must reduce actionable alarm volume to under 40 alarms per hour (5 per engineer × 8 engineers) without missing any P1 (critical) alarms.",
    equation: "DECISION CONSTRAINT: Actionable alarms reaching NOC ≤ 40 per hour. Zero P1 alarms suppressed or missed. Must process 12,000 raw alarms/hour in real time. System must add < 5 seconds of latency from alarm generation to NOC notification. Decision: No filtering / Severity threshold filter / Alarm correlation engine / AI-based anomaly detection.",
    technicalDetails: "No Filtering: All 12,000 alarms/hour reach the NOC. Engineers cannot investigate 1,500 alarms each per hour — 97% go uninvestigated. Critical failures masked by noise. Severity Threshold Filter (P1/P2 only): Filters alarms below severity P2. Assumes 8% of alarms are P1/P2 = 960 alarms/hour — still 24× above the 40/hour target. Correlation Engine (Recommended): Groups related alarms by root cause topology. A single transmission failure generates 50+ downstream alarms (cell outage, capacity alarms, handover failures). A correlation rule: 'if >10 alarms arrive from the same geographic cluster within 60 seconds, emit one parent alarm and suppress children.' Suppression rate: typically 96–98%. 12,000 × 0.97 suppression = ~360 actionable alarms/hour. Apply P1/P2 filter on top: 360 × 20% P1/P2 = 72 alarms/hour. Further tuning achieves <40. Processing latency: 60-second correlation window + 2-second engine latency = 62 seconds — marginally over the 5-second target for individual alarms but acceptable for correlated output. AI-Based Anomaly Detection: ML models score each alarm for novelty and operational impact. High accuracy but requires 6–12 months of labelled training data and ongoing model retraining. Processing latency: 0.5–2 seconds per alarm (GPU inference). Not yet production-ready at this operator (insufficient labelled data). Viable in 12 months.",
    explanation: [
      { term: "No Filtering", meaning: "All raw alarms forwarded to NOC. WHY REJECTED: 12,000 alarms/hour = 200 per minute — engineers cannot process 1,500 alarms each per hour. P1 critical alarms are buried in noise. WHEN ADOPTED: Never appropriate for a NOC managing >100 NEs. Acceptable only in a lab/test environment where all alarms are of interest for debugging." },
      { term: "Severity Threshold Filter (P1/P2 only)", meaning: "Drops all alarms below P2 severity. Reduces volume from 12,000 to ~960/hour — still 24× above the 40/hour target. WHY INSUFFICIENT: Does not address alarm storms where a single root cause generates hundreds of P1/P2 child alarms simultaneously. WHEN ADOPTED: Used as a first-pass filter in conjunction with a correlation engine — never as the sole alarm reduction mechanism in a high-volume NOC." },
      { term: "Alarm Correlation Engine (Recommended)", meaning: "Topological correlation groups related alarms from the same root cause. Suppression rule: >10 alarms from the same cluster within 60 seconds → emit one parent alarm. 97% suppression achieves <72 P1/P2 alarms/hour with P2+ filter. Further tuning to <40 is achievable. WHY BEST: Meets the volume target without suppressing any root-cause (P1) alarms. Industry standard in all major NMS platforms (Netcracker, Ericsson OSS, Nokia NetAct). 62-second correlation latency is acceptable — P1 alarms are still notified within 5 seconds as uncorrelated alarms before the engine confirms the pattern." },
      { term: "AI-Based Anomaly Detection", meaning: "ML models score alarm novelty and impact. Potential to reduce volume to <10 actionable alarms/hour by surfacing only genuinely new failure modes. WHY NOT ADOPTED NOW: Requires 6–12 months of labelled training data. Current operator data is unlabelled. Processing latency of 0.5–2 seconds per alarm meets the 5-second target. WHEN ADOPTED: After 12 months of correlation engine operation (which labels alarms by root cause), AI models can be trained on the labelled dataset and progressively replace rule-based correlation." }
    ],
    advantages: [
      "Alarm correlation reduces NOC alarm volume by 97% while ensuring every root-cause P1 alarm reaches an engineer — the NOC focuses on actionable faults, not noise",
      "Topological correlation automatically identifies when a single transmission failure causes cell outage, handover, and capacity alarms — engineers see one parent alarm instead of 50+ children, dramatically reducing MTTR",
      "Correlation rules are maintainable by NOC engineers without data science expertise — rule updates (new topology additions) take minutes, unlike ML model retraining which takes weeks"
    ],
    limitations: [
      "Severity filtering alone is adopted only as a baseline pre-filter before the correlation engine — it reduces initial alarm volume without requiring topology awareness",
      "AI anomaly detection is adopted after 12 months of labelled operational data from the correlation engine — the correlation engine is the prerequisite, not the replacement, for AI-based alarm management",
      "No filtering is never adopted in production NOC environments — it is retained only in test/lab systems where full alarm visibility is needed for network behaviour analysis"
    ]
  },,
  activities: {
    level1: "List and define the six alarm severity levels as specified in ITU-T X.733: Critical, Major, Minor, Warning, Indeterminate, and Cleared. For each severity level, give one concrete network example (e.g., Critical → core router unreachable) and state the expected operator response time target.",
    level2: "Draw a complete alarm lifecycle diagram showing the three states — Raised, Acknowledged, and Cleared — with labelled transitions. Include the events that trigger each transition: initial fault detection (Raised), operator acknowledgement action (Acknowledged), and condition clearing or manual closure (Cleared). Annotate each state with the data fields that change.",
    level3: "A network generates the following alarm counts in successive 10-second windows: 8, 12, 45, 310, 280, 15, 6. Using λ_storm = N_alarms / Δt, calculate the alarm arrival rate for each window. Identify which windows exceed a storm threshold of 20 alarms/second and state what actions the NMS should take.",
    level4: "Design alarm correlation rules for a scenario where a core switch (SW-CORE-01) fails and causes downstream alarms on 8 attached access switches. Specify: (a) the topological parent–child relationship used for correlation, (b) the temporal window within which co-occurring alarms are grouped, (c) the suppressed secondary alarms, (d) the single root-cause alarm raised to the operator, and (e) the clearing sequence when SW-CORE-01 recovers."
  },
  projects: {
    scope: "Build a prototype alarm management module in Python that ingests a stream of SNMP traps, performs severity classification, de-duplication, storm detection, and outputs a structured alarm table.",
    objectives: [
      "Implement an alarm ingestion pipeline that classifies incoming SNMP trap OIDs into ITU-T X.733 severity levels (Critical, Major, Minor, Warning, Informational) using a configurable OID-to-severity mapping table",
      "Implement alarm de-duplication using a hash of (managedObject, alarmType, probableCause) as the deduplication key, suppressing duplicate raises within a 60-second window",
      "Implement alarm storm detection using a 10-second sliding window, triggering a meta-alarm and suppression mode when the arrival rate exceeds a configurable threshold"
    ],
    deliverables: [
      "Python alarm management module with documented ingestion, classification, de-duplication, and storm detection functions",
      "OID-to-severity mapping configuration file with at least 20 entries covering common network fault OIDs",
      "Test report showing the module's behaviour against three scenarios: normal traffic (5 alarms/s), moderate burst (25 alarms/s), and simulated storm (150 alarms/s for 30 s)"
    ]
  },
  questions: [
    {
      q: "What are the six alarm severity levels defined in ITU-T X.733, and what does each indicate about the urgency of response?",
      a: "ITU-T X.733 defines six perceived severity values: (1) Critical — a severe condition that requires immediate corrective action, as the managed object is completely inoperable (e.g., a core router is down, causing complete service loss). Response: immediate, typically within minutes. (2) Major — a severe condition that requires urgent corrective action, as significant degradation of service capability has occurred (e.g., a trunk interface is down, reducing capacity by 50%). Response: urgent, within 30 minutes. (3) Minor — a non-service-affecting condition that does not require immediate action but should be corrected to prevent escalation (e.g., a high error rate approaching threshold). Response: scheduled maintenance. (4) Warning — a condition indicating a potential fault that requires observation (e.g., CPU utilisation reaching 75%). Response: monitoring. (5) Indeterminate — the severity level cannot be determined by the management system, often occurring during initial synchronisation or when an NE provides insufficient diagnostic data. Response: investigate. (6) Cleared — the alarm condition has been resolved and the managed object has returned to its normal state. This is a notification, not an active alarm. Understanding these levels is critical because NMS dashboards, escalation policies, and SLA obligations all depend on correct severity classification.",
      type: "Conceptual"
    },
    {
      q: "Describe the complete lifecycle of an alarm from the moment a fault occurs to the moment it is closed in the NMS.",
      a: "The alarm lifecycle has the following states and transitions: (1) Fault Detection — the managed network element detects an abnormal condition (e.g., an interface goes down). The NE sends an SNMP trap or NETCONF notification to the NMS. (2) Alarm Raised — the NMS receives the notification, creates an alarm record with fields: alarmId (auto-generated), eventTime (NE timestamp), managedObjectInstance (e.g., Router-A/eth0), perceivedSeverity (e.g., Major), probableCause, additionalText. The alarm enters Active state and appears on the NMS fault display with an unacknowledged indicator. (3) Alarm Acknowledged — an operator views the alarm and clicks 'Acknowledge'. This records the operator's identity and acknowledgement timestamp, and changes the alarm's acknowledged flag to true. It does not clear the alarm — it signals that a human is aware and investigating. The alarm remains Active. (4) Alarm Cleared — either the NE sends a clearing notification (perceivedSeverity = Cleared) when the fault condition resolves, or the operator manually closes the alarm after verification. The alarm transitions to Cleared state and is removed from the active alarm list. (5) Alarm Archived — cleared alarms are moved to an historical alarm log for trend analysis and SLA reporting. This complete lifecycle ensures that every fault is tracked from detection through resolution, with an auditable trail of response actions.",
      type: "Conceptual"
    },
    {
      q: "A network experiences 240 alarms in a 15-second observation window. Calculate the alarm arrival rate and determine whether a storm threshold of 10 alarms/second is exceeded.",
      a: "Given: N_alarms = 240, Δt = 15 seconds. λ_storm = N_alarms / Δt = 240 / 15 = 16 alarms/second. The threshold is 10 alarms/second. Since 16 > 10, the alarm storm threshold is exceeded. The NMS should: (1) raise a single 'Alarm Storm Detected' meta-alarm with severity Major or Critical; (2) activate storm suppression mode — individual duplicate alarms are queued but not raised to the operator display; (3) continue monitoring the rate — if the rate drops below the threshold for two consecutive windows, suppression is deactivated; (4) generate a storm report after the storm subsides, summarising the queued alarms by type, source, and probable cause for post-event analysis.",
      type: "Numerical"
    },
    {
      q: "What is the difference between alarm de-duplication and alarm correlation, and why does an NMS require both?",
      a: "Alarm de-duplication prevents the same fault from creating multiple independent alarm records. If a managed device sends a duplicate trap (due to retransmission or the NMS polling cycle detecting the same fault), de-duplication ensures only one alarm record is created and maintained. The deduplication key is typically a combination of (managedObjectInstance, alarmType, probableCause) — if a new alarm arrives with the same key as an existing active alarm, it is discarded or used to update the existing record rather than creating a new entry. Alarm correlation, in contrast, deals with multiple distinct alarm records that are causally related. After a core switch failure, dozens of genuinely different alarms arrive from different managed objects (all the connected routers, access switches, and hosts that become unreachable). Correlation uses topological rules (the connectivity graph) and temporal rules (alarms co-occurring within a defined time window) to determine that all these alarms share a single root cause and to group them under one root-cause alarm. Both mechanisms are necessary: de-duplication reduces noise from the same alarm appearing multiple times, while correlation reduces noise from multiple different alarms that are symptoms of the same underlying fault. Together they reduce the alarm volume the operator must process from hundreds to the few actionable root-cause events.",
      type: "Analytical"
    },
    {
      q: "How does alarm suppression work, and what risk does incorrect suppression configuration introduce?",
      a: "Alarm suppression is the NMS mechanism that prevents secondary alarms — those caused by a known primary fault — from being displayed to operators while the primary fault is active. It is configured using parent-child dependency rules: if alarm A (parent) is active, suppress alarm B (child) because B is a predictable consequence of A rather than an independent fault. For example, if a WAN router's uplink (parent alarm: Link Down, Critical) is down, alarms from all 200 customer CPE devices reachable only through that uplink (child alarms: CPE Unreachable, Major) are suppressed, because the CPE alarms will automatically clear when the uplink recovers. The risk of incorrect suppression configuration is masking real independent faults. If the suppression rule is too broad — for example, suppressing all alarms from a site when the site's core switch has any alarm — a genuine secondary fault on a different NE at the same site (e.g., a power failure affecting only one rack) may be hidden from operators. This can lead to service degradation that persists undetected even after the primary alarm clears. Best practice is to define suppression rules at the specific topology level (parent object → directly dependent child objects) rather than at a coarse site or domain level, and to limit the suppression window to the duration of the parent alarm plus a guard time.",
      type: "Analytical"
    }
  ],
  virtualLab: {
    description: "Vary raw alarm rate and correlation efficiency to observe how many actionable alarms reach the NOC per time window. Target is ≤ 40 alarms/hour. The simulation shows correlated alarm count as efficiency increases from 10% to the selected maximum.",
    interpretation: "At 70% correlation efficiency with 1,000 raw alarms per 10-second window (360,000/hour equivalent), the actionable count drops to 300 per window — still too high. At 97% efficiency, the count reaches 30 — below the NOC target. This illustrates why correlation rules must be tuned to 95–98% efficiency for high-volume environments, and why a combination of correlation + severity filtering is required to meet NOC capacity.",
    parameters: [
      { id: "alarms", name: "Alarms", min: 10, max: 1000, default: 100, step: 10, unit: "" },
      { id: "window", name: "Window", min: 1, max: 60, default: 10, step: 1, unit: " s" }
    ],
    generateData: (params) => {
      const rawAlarms = params.alarms || 100;
      const window = params.window || 10;
      const pts: Array<{ x: number; y: number }> = [];
      for (let eff = 10; eff <= 98; eff += 5) {
        const actionable = rawAlarms * (1 - eff / 100);
        pts.push({ x: eff, y: parseFloat(actionable.toFixed(1)) });
      }
      return pts;
    },
    labels: { x: "Correlation Efficiency (%)", y: "Actionable Alarms" }
  }
};
