import type { TopicData } from './types';

export const topic43Data: TopicData = {
  id: "u4t11",
  title: "Service Assurance",
  moduleName: "Unit IV: SDN, Network Observability, and Advanced Network Management",
  context: {
    prerequisites: ["Service Ordering", "Alarm Management", "FCAPS Process"],
    dependentTopics: ["Overview of Network Slicing via ONAP Framework"],
    nextSteps: "Study Network Slicing via ONAP Framework to see how service assurance principles extend to slice-level SLA monitoring in 5G networks.",
    rfcReferences: [
      { name: "ITU-T Y.1731", relevance: "OAM functions and mechanisms for Ethernet-based networks — defines performance monitoring (delay, loss, jitter) for end-to-end service assurance." },
      { name: "RFC 2544", relevance: "Benchmarking Methodology for Network Interconnect Devices — defines packet loss, latency, and throughput test procedures for SLA verification." },
      { name: "TM Forum TMF628", relevance: "Performance Management API — standardises KPI collection, threshold monitoring, and performance report generation for managed services." },
      { rfc: "RFC 5357", title: "Two-Way Active Measurement Protocol (TWAMP)", summary: "Standard for measuring round-trip delay and packet loss between network devices — enables proactive SLA monitoring with precision timestamping.", url: "https://www.rfc-editor.org/rfc/rfc5357" },
      { rfc: "RFC 7011", title: "IPFIX Specification", summary: "IP Flow Information Export protocol — provides per-flow traffic metrics for passive SLA monitoring and bandwidth accounting.", url: "https://www.rfc-editor.org/rfc/rfc7011" },
      { rfc: "RFC 8639", title: "Subscription to YANG Notifications", summary: "YANG-Push streaming telemetry for continuous SLA metric collection — enables real-time detection of SLA breaches as they occur.", url: "https://www.rfc-editor.org/rfc/rfc8639" }
    ]
  },
  storytelling: {
    analogy: "A Quality Control Department for Delivered Services",
    story: "Service assurance is the quality control department that continuously checks whether every delivered service still meets its SLA after provisioning. Fault Management detects network element failures. Service Assurance goes deeper: it monitors the end-to-end customer experience. Is VPN customer A getting their committed 100 Mbps? Is the RTT for their video conferencing service below 150 ms? Is packet loss on the business-critical SAP traffic below 0.1%? A router can be perfectly healthy in FCAPS terms while a customer's service is degraded — because a capacity bottleneck three hops away, unrelated to any alarm, is dropping their packets. Service assurance closes this gap by combining synthetic traffic probes (active measurement — inject test packets and measure), passive monitoring (flow telemetry, performance counters from actual customer traffic), Y.1731/RFC 2544 OAM, and SLA breach detection algorithms. The goal: detect a brewing SLA breach and proactively remediate it before the customer notices or files a support ticket — transforming the operator from a reactive break-fix shop into a proactive service guardian.",
    reflectiveQuestions: [
      "How can a service be SLA-breaching while all network elements report as healthy in the FCAPS fault management system?",
      "What is the difference between reactive service assurance and predictive service assurance, and what tooling enables the shift?",
      "How do synthetic probes differ from passive flow monitoring for SLA verification, and when should each be used?"
    ],
    technicalConnection: "Service assurance toolchain: (1) Proactive probing — Y.1731 (Ethernet OAM), BFD, IP SLA, TWAMP inject synthetic test traffic to measure delay, jitter, and loss end-to-end. (2) Passive monitoring — IPFIX/NetFlow sample customer traffic and measure per-flow QoS metrics. (3) SLA correlation engine — maps network KPIs (interface utilisation, error rate, latency) to service impact models. (4) Breach detection — compares real-time measurements against contracted SLA thresholds with configurable breach hysteresis windows. (5) Automated remediation — triggers NETCONF configuration changes, SR traffic engineering reroutes, or escalation tickets when breach is imminent. TM Forum TMF640 (Service Activation Testing API) and TMF641 (Service Order API) complement TMF628 (Performance Management) in the assurance lifecycle."
  },
  mathModelling: {
    need: "A managed services provider monitors 200 enterprise VPN customers, each with a contracted SLA of 99.9% monthly uptime and maximum 150ms RTT. The assurance team must choose between three monitoring strategies: reactive (alarm-driven), scheduled proactive (probe every 5 minutes), or continuous predictive (streaming telemetry + ML anomaly detection). The constraint: SLA breach detection must occur before the customer notices degradation (goal: detect within 60 seconds of breach onset). Monthly SLA compliance report must be 100% accurate. Engineering budget: $200K/year for tooling.",
    equation: "DECISION CONSTRAINT: Breach detection latency ≤ 60 seconds from onset. SLA compliance measurement accuracy ≥ 99.9% (no missed breaches in monthly report). Coverage: all 200 customers. Annual tooling cost ≤ $200K.",
    technicalDetails: "Reactive (alarm-driven only): Detection occurs when a network element raises a fault alarm. Average MTTD = 2.5 minutes (half of a 5-minute polling interval). During the 2.5-minute detection window the customer's SLA is being violated without visibility. Monthly SLA report accuracy: ~85% (breaches caused by degradation without alarm are missed). Fails both constraints. Cost: $0 incremental (NMS already in place). Scheduled Proactive Probing (Y.1731 probes every 5 minutes per customer): Detection latency = up to 5 minutes (probe interval). Better than reactive but still fails the 60-second constraint. SLA report accuracy: 95% (captures sustained breaches, misses transient sub-5-minute events). Cost: $80K/year (IP SLA probe infrastructure). Continuous Predictive (streaming telemetry + ML): gNMI streaming at 1-second intervals for 200 customer paths. ML anomaly detection identifies degradation patterns (rising latency trend, increasing jitter variance) 30-120 seconds before breach threshold is crossed. Detection latency: <30 seconds from onset. SLA report accuracy: 99.95% (sub-second telemetry misses nothing material). Cost: $180K/year (telemetry pipeline + ML platform). Meets both constraints within budget.",
    explanation: [
      { term: "Reactive Alarm-Driven Assurance", meaning: "Adopted for internal infrastructure monitoring where SLA requirements are loose (99% monthly) and cost minimisation is prioritised. Completely inadequate for enterprise SLA commitments with financial penalty clauses. Appropriate as a supplementary layer (alarm escalation) in a tiered assurance architecture, not as the primary assurance mechanism." },
      { term: "Scheduled Proactive Probing (5-minute Y.1731)", meaning: "Adopted when the engineering budget cannot support streaming telemetry infrastructure but SLA requirements are moderate (99.9% uptime, >5 minute breach detection acceptable). Standard approach for legacy managed service providers. Improves over reactive-only by proactively measuring customer service quality, but the 5-minute probe interval means sub-5-minute breaches are invisible." },
      { term: "Continuous Predictive Assurance (Recommended)", meaning: "Adopted when enterprise SLAs carry financial penalty clauses and the operator wants to shift from reactive to proactive operations. Streaming telemetry at 1-second intervals eliminates the detection latency gap. ML anomaly detection predicts breaches 30-120 seconds before they cross the contractual threshold, enabling proactive remediation. $180K/year cost is justified by avoiding a single SLA penalty event (typically $50K-$500K for enterprise connectivity SLAs)." }
    ],
    advantages: [
      "Sub-30-second breach detection via streaming telemetry satisfies the 60-second detection constraint with a 50% margin",
      "ML anomaly detection enables proactive remediation before the SLA threshold is crossed — preventing the breach rather than just detecting it",
      "99.95% SLA report accuracy eliminates financial disputes — the operator has irrefutable telemetry evidence for every monthly SLA report"
    ],
    limitations: [
      "Reactive alarm-driven assurance is adopted for internal IT networks where SLA requirements are loose and cost is the primary constraint",
      "Scheduled probing is adopted for operators with moderate SLA commitments (99.9%, >5-minute tolerance) and constrained tooling budgets",
      "Some operators use synthetic probing only for SLA measurement and reserve streaming telemetry for performance optimisation, keeping the two functions on separate toolchains"
    ]
  },
  activities: {
    level1: "Define the difference between Fault Management and Service Assurance. Give two examples where a network is fault-free (no FCAPS alarms active) but a customer's SLA is being violated. Explain the root cause in each example.",
    level2: "Draw a service assurance architecture diagram showing: Y.1731 probes injecting test traffic, passive IPFIX flow collection, SLA correlation engine, breach detection module, and automated remediation via SR traffic engineering. Label the data flow between each component.",
    level3: "A customer's 100 Mbps VPN SLA allows a maximum of 43.8 minutes downtime per month (99.9% availability). In October, the following SLA-degrading events were measured: 8-minute latency breach (RTT >150ms), 12-minute packet loss event (>0.1%), 5-minute complete outage. Calculate: (a) total SLA-impacting minutes, (b) actual monthly availability percentage, (c) whether the SLA was breached.",
    level4: "Research Y.1731 (ITU-T MEG, MEP, CC, DM, LM) and IP SLA (Cisco) as service assurance probing technologies. Compare them across: measurement type (active vs passive), metrics measured, vendor support, and cost. Recommend one for a multi-vendor enterprise WAN with 50 customer sites."
  },
  projects: {
    scope: "Build a service assurance monitoring system for 10 simulated enterprise VPN customers using Python and a time-series database.",
    objectives: [
      "Implement synthetic probe simulation: generate latency, jitter, and packet loss measurements every 30 seconds per customer, simulating normal and degraded conditions",
      "Implement SLA breach detection: raise an alert when RTT exceeds 150ms for more than 60 consecutive seconds, or packet loss exceeds 0.1% for more than 30 seconds",
      "Generate a monthly SLA compliance report per customer showing: total monitored time, SLA-impacting minutes, achieved availability percentage, and breach events with timestamps"
    ],
    deliverables: [
      "Python service assurance engine with configurable SLA thresholds per customer and real-time breach alerting",
      "InfluxDB (or CSV) time-series storage of all probe measurements with customer ID and timestamp indexing",
      "Monthly SLA compliance report for all 10 simulated customers in JSON or PDF format, including availability percentage and breach event log"
    ]
  },
  questions: [
    {
      q: "What is the fundamental difference between Fault Management and Service Assurance in a managed services context?",
      a: "Fault Management detects failures in individual network elements — a router interface going down, a process crashing, a hardware fault. It operates on the network element level using SNMP traps, NETCONF notifications, and FCAPS alarm management. A network element can be perfectly healthy (no FCAPS alarms) while a customer's service is degraded. Service Assurance monitors the end-to-end customer service experience by measuring service-level KPIs: RTT, packet loss, throughput, jitter, and availability from the customer's perspective. It uses active probes (synthetic traffic injected end-to-end), passive flow telemetry, and SLA correlation to determine whether the contracted service quality is being delivered. Fault Management answers 'is the equipment working?' Service Assurance answers 'is the customer experiencing the service they paid for?' Both are necessary: Fault Management provides early warning of infrastructure problems; Service Assurance provides the definitive view of customer impact.",
      type: "Conceptual"
    },
    {
      q: "What is proactive service assurance and how does it differ from reactive assurance?",
      a: "Reactive service assurance: the operator detects an SLA breach after it has already occurred, typically via a customer complaint or an alarm that triggered too late. The response is break-fix: diagnose the cause, remediate, and notify the customer after the fact. The customer has already experienced degradation and may be filing a support ticket or calculating penalty credits. Proactive service assurance: the operator uses predictive analytics (anomaly detection on streaming telemetry) to identify degradation trends — rising latency, increasing jitter variance, slowly climbing packet loss — before the SLA threshold is crossed. Automated remediation (SR traffic engineering reroute, additional capacity allocation, VNF scaling) is triggered in response to the predicted breach, resolving the issue before the customer notices. Proactive assurance requires: sub-second telemetry streams (gNMI), ML models trained on historical degradation patterns, and automated orchestration actions. The business benefit: zero customer-reported SLA incidents and zero penalty credit exposure.",
      type: "Conceptual"
    },
    {
      q: "A customer has a 99.99% monthly SLA (4-nines). In November (30 days = 43,200 minutes), the SLA was degraded for 3 separate events: 4 minutes, 1 minute, and 2 minutes. Calculate the actual availability percentage and whether the 99.99% SLA was met.",
      a: "Total SLA-impacting minutes = 4 + 1 + 2 = 7 minutes. Maximum allowable downtime for 99.99% in 30 days = (1 - 0.9999) × 43,200 = 0.0001 × 43,200 = 4.32 minutes. Actual availability = (43,200 - 7) / 43,200 × 100 = 43,193 / 43,200 × 100 = 99.9838%. Since 99.9838% < 99.99% (4-nines), the SLA was breached. The customer exceeded the 4.32-minute downtime allowance by 7 - 4.32 = 2.68 minutes. Most SLA contracts trigger a service credit for the breach: typically 10-25% of the monthly recurring charge per SLA tier breached.",
      type: "Numerical"
    },
    {
      q: "How can a customer's VPN service be SLA-breaching while all network elements in the path report as healthy in the NMS fault management system?",
      a: "Several scenarios cause service degradation without triggering FCAPS alarms: (1) Congestion without alarms — an interface at 92% utilisation causes 3-5% random packet loss (measurable impact on TCP throughput and latency jitter) but is below the 95% utilisation alarm threshold. The interface is 'healthy' in fault management but the customer's SAP traffic is experiencing significant degradation. (2) Microbursts — traffic bursts of 1-10 milliseconds duration fill interface buffers and cause packet drops that are statistically negligible in 5-minute counter polling (appearing as normal error rates) but cause visible TCP retransmissions and latency spikes to the customer. (3) BGP routing sub-optimality — a route change 3 hops away causes the customer's traffic to traverse a longer path with higher base RTT, but all elements on both paths report as UP. (4) QoS mis-marking — customer traffic is misclassified from premium to best-effort queue after a configuration change in a transit domain, causing it to be dropped first during congestion events. No alarm is raised because the interface is operational.",
      type: "Analytical"
    },
    {
      q: "What are Y.1731 Ethernet OAM continuity checks (CC) and delay measurement (DM), and how are they used for service assurance?",
      a: "Y.1731 (ITU-T G.8013) defines Ethernet Operations, Administration, and Maintenance (OAM) mechanisms for Ethernet transport networks. Continuity Check (CC): MEPs (Maintenance End Points) at each end of a monitored service segment exchange CCMs (Continuity Check Messages) at a configurable rate (10ms to 10 minutes). If 3.5 consecutive CCMs are missed, the remote MEP is declared down and an alarm is raised. Provides sub-50ms fault detection for Ethernet services. Used for: detecting LSP failures, ETH-CFM path continuity, verifying that a customer's service path is end-to-end active. Delay Measurement (DM): DMM/DMR (Delay Measurement Message/Reply) frames are injected on-demand or periodically to measure one-way and two-way frame delay, delay variation (jitter), and frame loss ratio between MEPs. These measurements are the primary input to the SLA assurance engine — comparing measured RTT against the contracted 150ms threshold and measured packet loss against the contracted 0.1% threshold. Y.1731 probes are hardware-timestamped at the NIC level (nanosecond precision), making them far more accurate than software-based IP SLA probes for SLA measurement purposes in high-speed transport networks.",
      type: "Conceptual"
    }
  ],
  virtualLab: {
    description: "You are defining SLA monitoring policies for an enterprise VPN service. The SLA requires detecting latency threshold breaches within 30 seconds. Your task: find the maximum probe interval that meets this detection latency target. Adjust the probe interval and the number of customers monitored. The chart shows average detection latency (probe interval / 2) — find the interval where detection time stays under your 30-second SLA target. Determine how probing 500 customers at this interval affects total monitoring traffic.",
    interpretation: "Detection latency = probe interval / 2 on average (a breach can occur right after a probe or just before the next one). At 60-second intervals, detection latency is 30 seconds — exactly at the SLA boundary. At 5-minute intervals, latency is 150 seconds — 5x over the target. To meet a 30-second detection SLA, probe intervals cannot exceed 60 seconds. For 500 customers, this means 500 probes per minute — manageable for a single monitoring server. But for sub-5-second detection requirements, only streaming telemetry (push model) can deliver the needed latency. Use this lab to set your probe interval budget per SLA class.",
    parameters: [
      { id: "interval", name: "Probe Interval (s)", min: 1, max: 300, default: 60, step: 5, unit: " s" },
      { id: "customers", name: "Customers Monitored", min: 10, max: 500, default: 100, step: 10, unit: "" }
    ],
    generateData: (params) => {
      const maxInterval = params.interval || 60;
      const pts: Array<{ x: number; y: number }> = [];
      for (let x = 1; x <= maxInterval; x += 5) {
        const avgDetectionLatency = x / 2;
        pts.push({ x, y: parseFloat(avgDetectionLatency.toFixed(1)) });
      }
      return pts;
    },
    labels: { x: "Probe Interval (s)", y: "Avg Detection Latency (s)" }
  }
};
