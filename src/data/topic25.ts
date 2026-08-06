import type { TopicData } from './types';

export const topic25Data: TopicData = {
  id: "u3t3",
  title: "Alarm Suppression Mechanism",
  moduleName: "Unit III: Alarm Lifecycle Management",
  context: {
    prerequisites: ["Fault Correlation", "Root Cause Analysis"],
    dependentTopics: ["NMS Discovery"],
    nextSteps: "Proceed to NMS Discovery to understand how the NMS builds the topology inventory that underpins correlation and suppression decisions.",
    rfcReferences: [
      { rfc: "ITU-T X.733", title: "Alarm Reporting Function", summary: "Alarm state model including 'suppressed' state and alarm lifecycle management.", url: "https://www.itu.int/rec/T-REC-X.733/en" },
      { rfc: "3GPP TS 32.111-2", title: "Fault Management - Alarm IRP", summary: "Alarm suppression mechanisms for mobile networks — parent-child suppression and maintenance window handling.", url: "https://www.3gpp.org/ftp/Specs/archive/32_series/32.111-2/" },
      { rfc: "RFC 3877", title: "Alarm Management Information Base (MIB)", summary: "Defines alarmModelState for suppression and acknowledgement states.", url: "https://www.rfc-editor.org/rfc/rfc3877" },
      { rfc: "ETSI GS NFV-IFA 027", title: "Performance Measurements", summary: "Alarm suppression in NFV environments — handling VNF and VNFC alarm hierarchies.", url: "https://www.etsi.org/deliver/etsi_gs/NFV-IFA/001_099/027/" },
      { rfc: "TM Forum TMF642", title: "Alarm Management API", summary: "Standard northbound alarm suppression state representation.", url: "https://www.tmforum.org/resources/specification/tmf642-alarm-management-api-rest-specification-r19-0-0/" }
    ]
  },
  storytelling: {
    analogy: "Noise-Cancelling Headphones",
    story: "Alarm suppression is noise-cancelling headphones for the NMS operator. When you put on noise-cancelling headphones in a busy café, the background chatter — real sounds, not imaginary — is filtered out so you can focus on the music or the conversation that matters. The background noise still exists, but it is no longer reaching your conscious attention. Similarly, in a network with an active root-cause alarm, the dozens of secondary cascade alarms are real — they genuinely reflect degraded conditions on downstream devices — but they carry no additional information for the operator who is already working on the root cause. Alarm suppression mutes these secondary alarms from the active console, just as noise-cancelling technology filters background noise, letting operators focus exclusively on unresolved, actionable problems. There are four main suppression types: Parent suppression silences child alarms whenever their parent (root-cause) alarm is active — the most common type. Flap suppression prevents interface alarms from filling the console when a link bounces rapidly; a link that flaps on and off every 10 seconds would otherwise generate an alarm storm; flap suppression raises one alarm and suppresses subsequent bounces until the link stabilises. Time-based suppression (maintenance-window suppression) silences alarms from devices that are in a scheduled maintenance window — an operator patching a router should not trigger incident tickets during planned downtime. Storm suppression activates automatically when the incoming alarm rate exceeds a threshold (e.g., 500 alarms/minute) — it suppresses all but the highest-severity alarms until the storm subsides, protecting operators from being overwhelmed. The suppression effectiveness metric measures what fraction of total alarms were correctly suppressed — a high value means fewer alarms reach the console without relevant faults being hidden.",
    reflectiveQuestions: [
      "If a child alarm represents an independent new fault that happens to occur simultaneously with an active parent alarm, how should the suppression engine distinguish it and not suppress it?",
      "What is the risk of flap suppression on a link that is experiencing a genuine intermittent physical layer fault — could suppression delay detection of a critical failure?",
      "How should maintenance-window suppression handle an unexpected fault that occurs during a scheduled maintenance window on a different device than the one being maintained?"
    ],
    technicalConnection: "**ITU-T X.733 Alarm Suppression States**: alarmActiveState can transition to suppressedState when parent alarm active. **3GPP TS 32.111-2 Suppression Mechanisms**: Parent suppression (§5.7.2) - child alarms from topology descendants suppressed while parent alarm active. Flap suppression - alarm transitions > flap_threshold within flap_window → raise single 'Flapping' alarm with count metric. Typical: flap_threshold=5, flap_window=300s. **RFC 3877 Alarm MIB alarmModelState**: alarmModelStateUnknown(1), alarmModelStateOff(2), alarmModelStateOn(3), alarmModelStateSuppressedByConfiguration(4). **Suppression Rule Structure**: WHEN parent_alarm(A_p) AND state(A_p) = 'active' AND topology_child(A_c, A_p) THEN set_state(A_c, 'suppressed') AND add_to_correlated_list(A_p, A_c). **Flap Detection Algorithm**: For alarm source (element_id, alarm_type): transition_events = [(t_1, state_1), (t_2, state_2), ...]. Count transitions T in sliding window [t_now - flap_window, t_now]. If T > flap_threshold: suppress individual transitions, raise meta-alarm 'Interface Flapping' with flap_rate = T / flap_window. **Maintenance Window Suppression**: scheduled_maintenance(element_id, t_start, t_end). For alarm A from element_id at time t ∈ [t_start, t_end]: set_acknowledged(A) AND suppress_notification(A) AND add_maintenance_tag(A). **Storm Suppression Activation**: alarm_rate λ(t) = count_alarms([t - Δt, t]) / Δt. If λ(t) > λ_storm_threshold (e.g., 500 alarms/min): activate_storm_mode() → suppress all alarms with severity < critical AND emit meta-alarm 'Storm Active'. Deactivate when λ(t) < λ_storm_lower (hysteresis). **TM Forum TMF642 Suppression Representation**: alarm JSON: { 'id': '...', 'state': 'suppressed', 'suppressedBy': 'parent_alarm_id', 'suppressionReason': 'parentChildCorrelation' }."
  },
  mathModelling: {
    need: "A regional operator's NMS generates 50,000 alarms per day from a 2,000-element network. The NOC has 4 engineers who can investigate a maximum of 200 alarms per day total. Without suppression, 99.6% of alarms are uninvestigated — critical failures are missed. The operator must reduce daily actionable alarms to under 200 while maintaining zero suppression of P1 alarms. Three suppression mechanisms are evaluated.",
    equation: "DECISION CONSTRAINT: Daily actionable alarms ≤ 200. Zero P1 alarms suppressed. Suppression must process 50,000 alarms/day in real time (< 500 ms per alarm). Must not suppress alarms from elements in maintenance mode (those should be acknowledged, not suppressed). Decision: Severity-only filter / Time-window deduplication / Hierarchical suppression / Combined tiered suppression.",
    technicalDetails: "Severity-only filter (P1 only): Suppresses all alarms below P1. Assumes 1% of alarms are P1 = 500 P1 alarms/day. Still 2.5× above the 200/day target. Useful P2/P3 information lost — some P3 alarms indicate developing faults that become P1 within hours. Time-window Deduplication: Suppresses duplicate alarm instances from the same element within a 15-minute window. Typical deduplication rate: 60% (many alarms repeat while the fault persists). 50,000 × 0.4 = 20,000 unique alarms/day. Still 100× above target. Hierarchical Suppression (parent-child topology): If a parent element is in alarm, child element alarms are suppressed. Example: if an aggregation switch is down, all connected access switches generate alarms — suppress the child alarms. Suppression rate: 70–80% for hierarchical networks. 50,000 × 0.25 = 12,500 alarms/day. Still 62× above target. Combined Tiered Suppression (Recommended): Apply all three mechanisms in sequence: (1) Maintenance mode filter: acknowledge (not suppress) alarms from elements in maintenance — removes ~5% of alarms. (2) Time-window deduplication: 60% reduction. (3) Hierarchical suppression: 75% reduction on remainder. (4) Severity filter (P2+): 80% of remainder is P3/P4. Combined: 50,000 × 0.95 × 0.40 × 0.25 × 0.20 = 950 actionable alarms/day before P2+ filter. Apply P2+ filter: 950 × 0.30 = 285. With further tuning of deduplication window: ~200 actionable alarms/day.",
    explanation: [
      { term: "Severity-only Filter", meaning: "Drops all alarms below P1. WHY INSUFFICIENT ALONE: 500 P1 alarms/day — 2.5× the 200/day target. Loses useful P2/P3 information that indicates developing faults. WHEN ADOPTED: Final stage in a tiered suppression pipeline — after deduplication and hierarchical suppression have reduced volume, a P2+ severity filter applies the final 80% reduction." },
      { term: "Time-window Deduplication", meaning: "Suppresses duplicate alarms from the same element within a 15-minute window. 60% reduction. WHY INSUFFICIENT ALONE: 20,000 unique alarms/day — 100× the target. But it is an essential first stage in the suppression pipeline — without it, every persistent fault generates hundreds of duplicate alarms that overwhelm downstream correlation. WHEN ADOPTED: Always applied as the first suppression stage, before hierarchical or severity filtering." },
      { term: "Hierarchical Suppression", meaning: "Parent alarm suppresses child alarms in the same topology path. 75% reduction. WHY INSUFFICIENT ALONE: 12,500 alarms/day — 62× the target. But captures the most operationally significant relationship: child alarms caused by a parent failure are not actionable until the parent is restored. WHEN ADOPTED: Applied after deduplication — the second stage in the tiered pipeline." },
      { term: "Combined Tiered Suppression (Recommended)", meaning: "Maintenance filter → deduplication → hierarchical suppression → severity filter applied in sequence. Combined reduction: 99.6%. 50,000 → ~200 actionable alarms/day. WHY BEST: Each mechanism addresses a different suppression category — no single mechanism is sufficient alone. The tiered approach meets the 200/day target without suppressing any P1 alarm. Industry standard: Nokia NetAct, Ericsson OSS, and Huawei iMaster NCE all implement multi-stage alarm suppression pipelines." }
    ],
    advantages: [
      "Combined tiered suppression reduces daily alarm volume by 99.6% — from 50,000 to 200 actionable alarms — enabling 4 engineers to investigate every actionable alarm without prioritisation conflicts",
      "Hierarchical suppression automatically focuses NOC attention on root-cause elements — child alarms from dependent elements disappear from the dashboard until the parent is restored",
      "Maintenance mode filtering acknowledges (not suppresses) alarms from planned maintenance — engineers see the maintenance activity without being paged, preserving audit trail while eliminating NOC distraction"
    ],
    limitations: [
      "Deduplication-only is adopted as the minimum baseline for any NMS — without it, persistent faults generate hundreds of duplicate alarms that pollute the dashboard and mask new alarms",
      "Hierarchical suppression is adopted in flat-topology networks where parent-child relationships are well-defined — in mesh networks without clear topology hierarchy, topological suppression may suppress legitimate independent alarms",
      "Severity-only filter is adopted as the final stage in the tiered pipeline — never as the sole suppression mechanism, since it discards P3/P4 alarms that may indicate developing faults"
    ]
  },
  activities: {
    level1: "List the four types of alarm suppression mechanisms (parent, flap, time-based, storm) and for each provide: (a) a definition, (b) the specific network scenario it addresses, and (c) an example alarm type that would be suppressed by each mechanism.",
    level2: "A core router fails and generates 80 secondary alarms from 15 downstream devices. Design a parent suppression rule that: (a) defines the parent alarm (type, source, severity), (b) defines the child alarm criteria (which device types and alarm types qualify as children), (c) specifies the time window, and (d) handles the case where a child device has an independent unrelated alarm active at the same time.",
    level3: "During a one-hour monitoring window, an NMS receives 450 alarms. 320 are suppressed as secondary correlations. 30 are suppressed by flap detection. 20 are suppressed in a maintenance window. Calculate (a) total suppressed, (b) total visible to operator, and (c) overall suppression effectiveness.",
    level4: "Design a complete alarm suppression policy for a mobile core network that includes: parent suppression for RAN site failures, flap suppression for backhaul links with a configurable bounce threshold, maintenance window suppression integrated with a change management system, and storm suppression with an escalation procedure that alerts duty managers when storm suppression activates."
  },
  projects: {
    scope: "Implement an alarm suppression simulation engine in Python that models all four suppression types, processes a synthetic alarm stream, and produces metrics showing suppression effectiveness versus suppression accuracy for different rule configurations.",
    objectives: [
      "Generate a synthetic alarm stream of 1000 events with known ground-truth classifications (root-cause, secondary, flapping, maintenance, independent)",
      "Implement configurable parent, flap, time-based, and storm suppression rules and apply them to the alarm stream",
      "Measure suppression effectiveness (fraction suppressed), suppression accuracy (fraction of suppressions that were correct), and false-suppression rate (fraction of real independent alarms incorrectly suppressed)"
    ],
    deliverables: [
      "Python alarm suppression engine with configurable rules for all four suppression types",
      "Results table: suppression effectiveness, accuracy, and false-suppression rate for five different rule configurations",
      "Recommendation report identifying the optimal rule configuration that maximises effectiveness while keeping false-suppression rate below 2%"
    ]
  },
  questions: [
    {
      q: "What is alarm suppression and how does it differ from alarm correlation?",
      a: "Alarm correlation is the process of grouping multiple related alarms together and identifying their common root cause — it analyses relationships between alarms and creates a correlated alarm group. Alarm suppression is a downstream process that acts on the output of correlation: it hides (suppresses) the secondary alarms in a correlated group from the active operator console, preventing them from generating noise. Correlation identifies WHICH alarms are related and WHY. Suppression decides WHAT TO SHOW the operator. Correlation must occur before suppression because suppression depends on knowing which alarms are secondary. Together, they form a two-stage pipeline: correlation reduces many alarms to one root-cause group, then suppression ensures only the root-cause alarm is visible on the console while secondary alarms are stored in the database with a 'suppressed' state for audit purposes.",
      type: "Conceptual"
    },
    {
      q: "Explain flap suppression and describe a specific scenario where it is essential.",
      a: "Flap suppression prevents rapid on-off cycling of a condition (a 'flap') from generating a flood of alarms. When a network interface goes up, down, up, down in rapid succession — due to a physical layer fault such as a degraded SFP or a loose cable — each transition would normally raise an alarm: 'Interface Down', then 'Interface Up' (clear), then 'Interface Down' again. At 10 flaps per minute, this generates 20 alarm events per minute from one interface. Flap suppression implements a hysteresis mechanism: the first Down alarm is raised normally. Subsequent Up and Down transitions within a configurable window (e.g., 5 minutes) are suppressed. A single 'Interface Flapping' alarm is raised with a flap count counter. The alarm clears only when the interface has been stable for the full suppression window. Essential scenario: a microwave backhaul link experiencing radio-frequency interference during a storm. The link may flap hundreds of times per hour, and without flap suppression, the alarm database and the operator console would be completely overwhelmed, hiding all other network alarms.",
      type: "Conceptual"
    },
    {
      q: "An NMS receives 300 alarms during a major outage. 210 are suppressed as parent-child correlations, 30 as flapping, and 15 in maintenance window. Calculate suppression effectiveness.",
      a: "Total alarms = 300. Total suppressed = 210 + 30 + 15 = 255. Suppression effectiveness = N_suppressed / N_total × 100 = 255 / 300 × 100 = 85%. The operator sees 300 − 255 = 45 alarms on the active console, reduced from 300. This 85% suppression effectiveness means the operator's alarm console shows less than one sixth of the total alarms generated, focusing attention on the 45 actionable events.",
      type: "Numerical"
    },
    {
      q: "What are the risks of setting suppression windows too long or suppression thresholds too broad?",
      a: "Setting suppression windows too long: if a parent alarm is cleared but its child alarms remain suppressed beyond the clearance (because the suppression window has not expired), the child conditions may represent new independent faults that go unnoticed. For example, a 60-minute suppression window on all alarms from a segment might suppress a genuine hardware failure that occurs 35 minutes after the parent event clears. Setting suppression thresholds too broad: if a parent alarm suppresses ALL alarms from a wide network segment (e.g., an entire access ring), independent faults from devices not actually affected by the parent event will be silently hidden. An attacker exploiting a vulnerable device in that segment would not trigger a visible alarm. Mitigation: (1) Tie suppression scope precisely to the topological children of the root cause, not broad network segments. (2) Use suppression expiry that tracks parent alarm state in real time — child suppression clears when parent clears, not on a fixed timer. (3) Implement a suppression audit log and periodic review of suppressed alarm counts to detect anomalous suppression patterns.",
      type: "Analytical"
    },
    {
      q: "How does storm suppression differ from parent suppression and what triggers it?",
      a: "Parent suppression is a topology-aware, proactive mechanism: it suppresses specific child alarms based on known parent-child relationships in the network dependency graph. It is selective and targeted — only alarms topologically downstream of an active parent alarm are suppressed. Storm suppression is a reactive, rate-based mechanism: it triggers automatically when the overall incoming alarm rate exceeds a configurable threshold (e.g., 500 alarms per minute), regardless of topology relationships. Once activated, storm suppression applies blanket suppression — showing only the highest-severity alarms (Critical) and suppressing all others until the rate drops below a lower threshold (hysteresis). Storm suppression is designed as a last-resort protection against catastrophic alarm floods that overwhelm the correlation engine itself. It is triggered by the alarm ingestion rate, not by alarm content. After storm suppression activates, most NMS platforms generate a 'Storm Suppression Active' meta-alarm that alerts duty managers so they know the console view is incomplete — this is a critical safeguard to prevent operators from believing the network is healthy when storm suppression is hiding a major event.",
      type: "Analytical"
    }
  ],
  virtualLab: {
    description: "Your NOC team can handle at most 200 actionable alarms per day, but the network generates 50,000 raw alarms daily. Your task: design a multi-stage suppression pipeline that reduces alarms to an actionable level. Choose how many suppression stages to apply (1 = deduplication only, 2 = + hierarchical correlation, 3 = + severity filter). The chart shows the cascade reduction — find the minimum stages needed to stay under your NOC's 200-alarm capacity.",
    interpretation: "With 3 suppression stages, 50,000 raw alarms reduce to 1,000 per day — still 5× over the 200 capacity. Removing any stage makes it worse: without the severity filter (stage 3), 5,000/day — 25× over capacity. This multiplicative cascade (60% × 75% × 80% = 96% total reduction) shows why all three stages work together: deduplication removes identical duplicates, hierarchical correlation groups related events, and severity filtering drops informational noise. Deploying only one or two stages leaves the NOC overwhelmed.",
    parameters: [
      { id: "rawAlarms", name: "Raw Alarms/Day", min: 1000, max: 100000, default: 50000, step: 1000, unit: "" },
      { id: "stages", name: "Suppression Stages", min: 1, max: 3, default: 3, step: 1, unit: "" }
    ],
    generateData: (params) => {
      const raw = params.rawAlarms || 50000;
      const stages = Math.round(params.stages || 3);
      const reductions = [0.4, 0.25, 0.2];
      const pts: Array<{ x: number; y: number }> = [];
      let current = raw;
      for (let s = 1; s <= stages; s++) {
        current = current * reductions[s - 1];
        pts.push({ x: s, y: Math.round(current) });
      }
      return pts;
    },
    labels: { x: "Suppression Stages Applied", y: "Actionable Alarms/Day" }
  }
};
