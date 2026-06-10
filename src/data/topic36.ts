import type { TopicData } from './types';

export const topic36Data: TopicData = {
  id: "u4t4",
  title: "Network Observability vs Network Monitoring",
  moduleName: "Unit IV: SDN, Network Observability, and Advanced Network Management",
  context: {
    prerequisites: ["Key Concepts of Network Observability", "FCAPS Process"],
    dependentTopics: [
      "Importance of Network Observability for Business",
      "Techniques and Tools of Network Observability"
    ],
    nextSteps: "Study the Importance of Network Observability for Business to understand how observability translates into quantifiable business value, SLA compliance, and revenue impact — building on the operational differences established here.",
    rfcReferences: [
      { rfc: "RFC 6933", title: "Entity MIB (Version 4)", summary: "Traditional SNMP MIB for device-centric physical entity inventory — represents the pull-based monitoring approach contrasted with streaming observability.", url: "https://www.rfc-editor.org/rfc/rfc6933" },
      { rfc: "RFC 8639", title: "Subscription to YANG Notifications", summary: "YANG-Push streaming telemetry mechanism — the push-based observability approach contrasted with SNMP pull-based monitoring for high-frequency data collection.", url: "https://www.rfc-editor.org/rfc/rfc8639" },
      { name: "OpenTelemetry Protocol (OTLP)", relevance: "Modern observability data collection protocol — enables high-cardinality metrics, logs, and traces collection vs traditional SNMP/syslog monitoring with fixed OID trees." },
      { rfc: "RFC 5424", title: "Syslog Protocol", summary: "Structured logging standard — log collection for observability (structured, searchable) vs SNMP trap-based monitoring (fixed-format, event-driven).", url: "https://www.rfc-editor.org/rfc/rfc5424" },
      { name: "gNMI (gRPC Network Management Interface)", relevance: "High-cardinality telemetry streaming for observability — millions of unique time-series dimensions vs low-cardinality SNMP limited by OID tree structure." },
      { name: "W3C Trace Context", relevance: "Distributed tracing standard for service-centric observability — traces individual transactions across services vs device-centric monitoring that measures per-element health." }
    ]
  },
  storytelling: {
    analogy: "CCTV Cameras vs an Intelligent Security System with Context",
    story: "Network monitoring is CCTV — you mount cameras at predefined angles (interfaces, CPU, memory), and they record whatever is visible in those fixed fields of view. If you need to know whether the front door is open, you check the front-door camera. If something happens outside the camera's field of view, you see nothing. Monitoring answers predefined questions with predefined metrics. Network observability is an intelligent security system with facial recognition, motion context, behavioural analysis, and integrated audio — it can answer questions you did not think to ask in advance. A monitoring system tells you: 'at 14:32, interface GigE0/0 utilisation hit 95%.' An observability system tells you: 'at 14:32:05, a specific elephant flow from customer subnet 192.168.50.0/24 to the video CDN server, carrying a 4K streaming session for 2,847 users, consumed 94% of GigE0/0. This flow bypassed the QoS shaper because the DSCP marking was stripped at the CE router during the maintenance window at 13:55. Three other customers in VLAN 100 experienced TCP retransmission rates above 15% as a result.' The critical distinctions are: Monitoring is predefined and reactive — you define thresholds, you wait for violations, you respond after the fact. Observability is exploratory and proactive — you can ask arbitrary questions about system behaviour because all relevant data is collected, structured, correlated, and queryable. Monitoring is device-centric: it measures devices. Observability is service-centric and flow-centric: it measures customer experiences and individual transactions. Monitoring has low cardinality (interface, device, protocol — a few hundred time-series). Observability has high cardinality (per-flow, per-customer, per-application, per-trace — potentially millions of unique dimensions). Monitoring tells you something broke. Observability tells you what broke, why, which customers were affected, and what to do about it — often before a human customer notices.",
    reflectiveQuestions: [
      "A network monitoring dashboard shows all green lights (all devices up, bandwidth below 80%) but users are reporting 5-second login delays. How does observability explain what monitoring misses in this scenario?",
      "What are the cost implications of implementing full observability vs monitoring-only? When does the investment in observability become financially justified?",
      "How does the shift from device-centric monitoring to service-centric observability change the KPIs that a network operations team reports to senior management?"
    ],
    technicalConnection: "Monitoring tools: Nagios/Zabbix (threshold-based alerting on SNMP metrics), MRTG/RRDtool (bandwidth graphs from SNMP polling), Cisco Prime Infrastructure (device-health dashboard). Observability tools: Grafana (unified dashboarding for metrics, logs, traces), OpenTelemetry Collector (vendor-neutral telemetry pipeline), Prometheus (pull-based metrics with PromQL querying), Jaeger/Zipkin (distributed tracing), Elastic Stack (log aggregation and search), Honeycomb (high-cardinality event analytics). The distinction is architectural: monitoring tools are read-optimised for predefined queries; observability tools are exploration-optimised for arbitrary ad-hoc queries across correlated multi-pillar data."
  },
  mathModelling: {
    need: "To quantify the operational improvement from switching from monitoring-only to full observability, measured as the reduction in Mean Time To Detect (MTTD) incidents. Faster detection directly reduces customer impact duration, SLA breach probability, and remediation cost.",
    equation: "\\Delta_{MTTD} = MTTD_{monitor} - MTTD_{observe}",
    technicalDetails: "Mean Time To Detect (MTTD) is the average time from when a problem occurs to when the operations team becomes aware of it. For monitoring-only systems, MTTD depends on the polling interval: \\( MTTD_{monitor} = T_{poll}/2 + T_{alert\\_proc} \\) — on average, a problem is discovered halfway through the polling interval plus alert processing time. For a 5-minute SNMP polling cycle with 30-second alert processing: \\( MTTD_{monitor} = 150 + 30 = 180 \\) seconds. Observability systems with streaming telemetry (1-second push) and automated anomaly detection: \\( MTTD_{observe} = 0.5 + 5 = 5.5 \\) seconds (0.5s telemetry latency + 5s anomaly detection window). \\( \\Delta_{MTTD} = 180 - 5.5 = 174.5 \\) seconds improvement. The business value of this improvement equals \\( \\Delta_{MTTD} \\times R_{revenue\\_loss\\_per\\_second} \\). For an e-commerce site losing $83/second during peak hours, a 174.5-second MTTD improvement saves \\( 174.5 \\times 83 = \\$14{,}484 \\) per incident detected.",
    explanation: [
      { term: "\\Delta_{MTTD}", meaning: "MTTD improvement (seconds) — the reduction in detection time achieved by observability over monitoring" },
      { term: "MTTD_{monitor}", meaning: "Mean Time To Detect with traditional monitoring (seconds) — limited by polling interval and threshold alerting latency" },
      { term: "MTTD_{observe}", meaning: "Mean Time To Detect with observability (seconds) — enabled by streaming telemetry and automated anomaly detection" }
    ],
    advantages: [
      "Provides a direct, quantifiable business case for observability investment — MTTD improvement × revenue-loss-per-second = annual savings",
      "Highlights the compounding effect: faster detection enables faster diagnosis (MTTD improvement + MTTR improvement) multiplying total incident cost reduction",
      "Benchmarkable metric: MTTD can be measured empirically by injecting known faults and timing detection, providing ongoing validation of the observability system's effectiveness"
    ],
    limitations: [
      "MTTD improvement alone does not capture observability's value in preventing incidents entirely through trend detection and capacity forecasting",
      "Real MTTD is highly variable — it depends on fault type, time of day, operator workload, and alert queue depth; averages mask this variance",
      "Does not account for the increased complexity and operational overhead of maintaining an observability stack vs a simple monitoring system"
    ],
    simulation: {
      description: "Compare MTTD for monitoring (polling-based) vs observability (streaming telemetry) as the monitoring interval varies. Observability MTTD is fixed at a low baseline while monitoring MTTD scales with polling interval.",
      parameters: [
        { id: "poll_interval", name: "Monitoring Poll Interval (s)", min: 10, max: 600, default: 300, step: 10, unit: " s" },
        { id: "obs_latency", name: "Observability Telemetry Latency (s)", min: 1, max: 30, default: 5, step: 1, unit: " s" }
      ],
      generateData: (params: Record<string, number>): Array<{ x: number; y: number }> => {
        const poll_interval = params.poll_interval || 300;
        const obs_latency = params.obs_latency || 5;
        const pts: Array<{ x: number; y: number }> = [];
        for (let x = 10; x <= poll_interval; x += 10) {
          const mttd_monitor = x / 2 + 30;
          const mttd_observe = obs_latency;
          const delta = mttd_monitor - mttd_observe;
          pts.push({ x, y: parseFloat(Math.max(delta, 0).toFixed(1)) });
        }
        return pts;
      },
      labels: { x: "Monitoring Poll Interval (s)", y: "MTTD Improvement (s)" }
    }
  },
  activities: {
    level1: "Create a detailed comparison table of network monitoring vs network observability across 8 dimensions: purpose, data types collected, cardinality, query model (predefined vs exploratory), typical tools, typical alert mechanism, reaction posture (reactive vs proactive), and primary audience (NOC vs business stakeholder). For each dimension, explain why the difference matters in practice.",
    level2: "Scenario analysis: A financial services firm's trading platform experienced a 45-second latency spike at 09:31 AM during market open. Their monitoring dashboard showed nothing abnormal during the spike. Design the observability investigation: (a) which metrics would show the anomaly that monitoring missed, (b) which logs would reveal the event sequence, (c) what distributed trace would pinpoint the root cause, (d) what change to the monitoring system could prevent missing this next time.",
    level3: "Calculate MTTD for monitoring and observability, and compute ΔMTTD for: (a) poll_interval=60s, alert_processing=30s, obs_latency=3s; (b) poll_interval=300s, alert_processing=60s, obs_latency=5s. For each scenario, calculate the annual cost savings if each avoided incident minute saves $500.",
    level4: "Run a controlled experiment: deploy the same synthetic fault (gradual CPU memory leak reaching critical in 10 minutes) on a simulated device. Use Zabbix (monitoring) and Prometheus+Grafana (observability) in parallel. Measure: (a) MTTD for each system, (b) the minimum information provided by each system at the moment of detection, (c) how long it takes each system to provide root-cause information. Document the observability advantage quantitatively."
  },
  projects: {
    scope: "Build a side-by-side comparison of a monitoring-only system (Zabbix) and a full observability stack (Prometheus + Loki + Jaeger + Grafana) managing the same network infrastructure, demonstrating quantitative MTTD and diagnostic depth differences.",
    objectives: [
      "Deploy Zabbix monitoring and the PLG + Jaeger observability stack on the same simulated 5-device network with identical infrastructure",
      "Inject 8 fault scenarios covering all three observability pillars (metric anomaly, log event, slow trace) and measure MTTD for each system",
      "Demonstrate one fault scenario (microservice slowdown) that is invisible to monitoring but fully diagnosable via distributed traces",
      "Calculate ΔMTTD for each scenario and project annual savings based on realistic revenue-loss-per-minute estimates for the organisation type"
    ],
    deliverables: [
      "Docker Compose deployment files for both Zabbix monitoring and PLG+Jaeger observability stacks",
      "8-scenario fault injection scripts with timestamps for automated MTTD measurement",
      "MTTD comparison table and bar chart showing monitoring vs observability detection times per scenario",
      "Business case report: annual cost savings from MTTD improvement, with sensitivity analysis for different revenue-loss rates"
    ]
  },
  questions: [
    {
      q: "What is the fundamental architectural difference between network monitoring and network observability?",
      a: "Network monitoring is built around predefined, known-bad conditions: you configure a threshold (CPU > 90%, interface down, ping timeout) and the system alerts when that threshold is breached. The data model is low-cardinality (one time-series per device/metric combination) and the query model is predefined (these dashboards, these alerts, these reports were configured in advance). Network observability is built around arbitrary query capability against high-cardinality, multi-pillar telemetry: you collect metrics, logs, and traces comprehensively, structure them for correlated search, and enable operators to ask any question about system behaviour — including questions that were not anticipated when the system was deployed. The architectural difference: monitoring tools are write-optimised for threshold evaluation (test each incoming metric against configured thresholds); observability backends are read-optimised for exploratory queries (Prometheus PromQL, Elasticsearch query DSL, Jaeger TraceQL, ClickHouse SQL). Monitoring is sufficient when failure modes are well-known and limited in variety. Observability is required when failure modes are unknown, complex, involve multiple interacting services, or manifest as degraded performance rather than binary up/down states.",
      type: "Conceptual"
    },
    {
      q: "Why does device-centric monitoring fail for microservices and cloud-native network functions?",
      a: "Device-centric monitoring measures infrastructure health (CPU, memory, interface status) for individual, addressable devices with stable identities. Cloud-native network functions (CNFs) running as Kubernetes pods are ephemeral: a pod may live for 30 seconds, be rescheduled to a different node, and replaced with a new pod with a different IP address and name. Traditional SNMP polling cannot track ephemeral entities. More critically, a CNF's performance issue may manifest not in any single device's metrics but in the interaction between services: a 200ms latency spike caused by a slow DNS resolution between two pods shows normal CPU and memory on both pods, normal interface bandwidth, and normal ICMP ping responses — but users see 200ms delays. Only a distributed trace that follows the request across the DNS client, the DNS resolver pod, and the application pod reveals the 190ms delay in the DNS query. Device-centric monitoring has no visibility into inter-service communication latency, request retry behaviour, or service mesh circuit breaker activations — all of which are critical failure modes for cloud-native network services.",
      type: "Analytical"
    },
    {
      q: "Calculate ΔMTTD for poll_interval=300s, alert_processing=45s, obs_latency=4s. What is the business saving per incident if downtime costs $200/second?",
      a: "MTTD_monitor = T_poll/2 + T_alert_proc = 300/2 + 45 = 150 + 45 = 195 seconds. MTTD_observe = obs_latency = 4 seconds. ΔMTTD = MTTD_monitor - MTTD_observe = 195 - 4 = 191 seconds. Business saving per incident = ΔMTTD × revenue_loss_per_second = 191 × $200 = $38,200 saved per incident. If an organisation experiences 50 such incidents per year, annual savings = 50 × $38,200 = $1,910,000. This demonstrates why enterprise observability platforms (even at $500,000/year licensing) generate positive ROI within the first year for high-revenue operations.",
      type: "Numerical"
    },
    {
      q: "What is 'cardinality' in observability and why do monitoring tools struggle with high-cardinality data?",
      a: "Cardinality refers to the number of unique values a dimension can take. Low-cardinality: device_name has 100 values (100 devices), interface_name has 1,000 values. High-cardinality: customer_id has 1,000,000 values, trace_id has billions of unique values, source_ip has potentially 4 billion values. Traditional monitoring tools like RRDtool, Nagios, and Zabbix store one time-series per unique label combination. A time-series for CPU per device with 100 devices = 100 series (manageable). A time-series for request_latency per customer_id with 1,000,000 customers = 1,000,000 series — at 15-second intervals for 30 days, this requires petabytes of storage that RRD-based systems cannot handle. Prometheus itself warns against high-cardinality labels and recommends against using trace_ids or user_ids as labels. Observability tools that handle high cardinality (Honeycomb, ClickHouse, Elasticsearch) use column-oriented storage with compression, inverted indices, and approximate aggregation algorithms (HyperLogLog, Count-Min Sketch) to query billions of high-cardinality events in seconds. This is why observability requires different database technology than monitoring.",
      type: "Conceptual"
    },
    {
      q: "In what specific scenarios is traditional monitoring sufficient and observability unnecessary?",
      a: "Traditional monitoring is sufficient when: (1) The network consists of a small number (<50) of well-defined physical devices with stable identities and predictable failure modes (link down, hardware failure, CPU overload from known processes) — polling every 5 minutes is adequate for detecting these. (2) SLA requirements are loose (e.g., 99% uptime = 87.6 hours downtime/year allowed) — the MTTD penalty from 5-minute polling intervals is acceptable within the SLA budget. (3) All failure modes are known and enumerable — a simple router with 4 interfaces and 2 protocols has a finite, small set of possible failures that threshold alerting covers completely. (4) The budget does not justify observability infrastructure and operational expertise — deploying and maintaining Prometheus, Loki, Jaeger, and Grafana requires dedicated platform engineering effort. (5) The network does not carry microservices or cloud-native traffic where distributed tracing is the only diagnostic tool. Monitoring becomes insufficient when failure modes are unknown or complex, when services are ephemeral or distributed, when SLAs are tight (99.99% = 52 min/year), or when business units need per-customer SLA reporting rather than per-device availability statistics.",
      type: "Analytical"
    }
  ],
  virtualLab: {
    description: "You are choosing between SNMP polling and gNMI streaming telemetry for real-time performance monitoring. Your SLA requires detecting threshold breaches within 30 seconds. Your task: determine the maximum SNMP poll interval that meets this MTTD target, and compare with streaming telemetry's constant low latency. Adjust the poll interval and telemetry push latency. The chart shows the MTTD gap between polling and streaming — find where polling fails your SLA and streaming is mandatory.",
    interpretation: "At 300-second (5 min) SNMP polling, MTTD is ~180 seconds — 6x over the 30-second target. Streaming telemetry at 5-second push latency stays at 5 seconds regardless of poll interval. The linear trade-off is clear: each 10 seconds of poll interval adds 5 seconds to detection delay. The practical threshold: if your SLA requires MTTD < 30 s, SNMP polling intervals cannot exceed 60 s. Below that threshold, gNMI streaming telemetry is the only viable approach for critical SLA monitoring.",
    parameters: [
      { id: "poll_interval", name: "Monitoring Poll Interval (s)", min: 10, max: 600, default: 300, step: 10, unit: " s" },
      { id: "obs_latency", name: "Observability Telemetry Latency (s)", min: 1, max: 30, default: 5, step: 1, unit: " s" }
    ],
    generateData: (params: Record<string, number>): Array<{ x: number; y: number }> => {
      const poll_interval = params.poll_interval || 300;
      const obs_latency = params.obs_latency || 5;
      const pts: Array<{ x: number; y: number }> = [];
      for (let x = 10; x <= poll_interval; x += 10) {
        const mttd_monitor = x / 2 + 30;
        const mttd_observe = obs_latency;
        const delta = mttd_monitor - mttd_observe;
        pts.push({ x, y: parseFloat(Math.max(delta, 0).toFixed(1)) });
      }
      return pts;
    },
    labels: { x: "Monitoring Poll Interval (s)", y: "MTTD Improvement (s)" }
  }
};
