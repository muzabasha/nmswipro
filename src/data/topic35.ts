import type { TopicData } from './types';

export const topic35Data: TopicData = {
  id: "u4t3",
  title: "Key Concepts of Network Observability",
  moduleName: "Unit IV: SDN, Network Observability, and Advanced Network Management",
  context: {
    prerequisites: ["SDN Architecture and Concept", "FCAPS Process"],
    dependentTopics: [
      "Network Observability vs Network Monitoring",
      "Importance of Network Observability for Business"
    ],
    nextSteps: "Study Network Observability vs Network Monitoring to understand the precise distinctions between reactive monitoring and proactive observability, and when each approach applies.",
    rfcReferences: [
      { name: "OpenTelemetry Specification", relevance: "Unified standard for metrics, logs, and traces collection — the three pillars of modern observability with vendor-agnostic data models." },
      { rfc: "RFC 5424", title: "Syslog Protocol", summary: "Standard for structured logging format — defines message format, facility codes, severity levels, and structured data elements for network observability.", url: "https://www.rfc-editor.org/rfc/rfc5424" },
      { rfc: "RFC 6241", title: "NETCONF Protocol", summary: "Network Configuration Protocol used for telemetry data collection — enables YANG-modelled data retrieval via get/get-config RPCs.", url: "https://www.rfc-editor.org/rfc/rfc6241" },
      { rfc: "RFC 8639", title: "Subscription to YANG Notifications", summary: "Defines YANG-Push mechanism for streaming telemetry — network devices push metric, log, and event data to subscribers continuously.", url: "https://www.rfc-editor.org/rfc/rfc8639" },
      { name: "gRPC Network Management (gNMI)", relevance: "High-frequency telemetry streaming protocol — enables 1-second granularity push from network devices to observability platforms with YANG-modelled data." },
      { name: "W3C Trace Context", relevance: "Standard for distributed trace context propagation — traceparent and tracestate headers enable end-to-end request tracing across network service chains." }
    ]
  },
  storytelling: {
    analogy: "The Difference Between a Thermometer and a Full Medical Diagnosis",
    story: "Traditional network monitoring is like checking a thermometer — it tells you one thing: the temperature. Is the network up? What is the current CPU utilisation? What is the bandwidth on this interface? The thermometer gives you a number, and if the number is abnormal, you know something is wrong. But it cannot tell you why the fever exists, what organ is failing, what the causal chain is, or what will happen next. Network observability is a full medical diagnosis: instead of one measurement, you have a complete clinical picture from multiple data sources working together. Logs are the patient's medical history — they tell you what happened, in sequence, with timestamps: 'at 14:32:05, BGP session to peer 10.1.1.1 dropped; at 14:32:07, 450 flows were rerouted.' Metrics are the vital signs monitored continuously — heart rate (packet rate), blood pressure (queue depth), temperature (CPU/memory): they show trends, baselines, and anomalies. Traces follow the blood flow through every organ system — distributed traces follow a single network request from the client through the load balancer, through the firewall, through the application server, through the database, capturing the latency at each hop. Together, these three pillars — Metrics, Logs, and Traces (the MLT framework) — enable operators to answer questions that monitoring alone cannot: not just 'is something wrong?' but 'what exactly is wrong, why, what is the blast radius, and what will fix it?' Observability shifts the paradigm from reactive alert-driven operations (something broke, now investigate) to proactive, evidence-based operations (the system's internal state is fully understood from external data alone, enabling prediction and prevention). This definition — understanding internal system state from external outputs — comes from control theory, where a system is said to be 'observable' if its internal state can be fully determined from its outputs.",
    reflectiveQuestions: [
      "A network has 100% uptime metrics for 30 days but users complain of slow performance. How does observability (specifically traces) reveal what monitoring misses in this scenario?",
      "Why are logs insufficient alone for network observability — what critical questions can only be answered by combining logs, metrics, AND traces?",
      "How does the concept of 'high cardinality' in observability data (millions of unique trace IDs, user IDs, request IDs) challenge traditional monitoring tools designed for low-cardinality metrics like CPU percentage?"
    ],
    technicalConnection: "The three observability pillars in practice: Metrics — Prometheus scrapes time-series metrics from exporters (node_exporter, SNMP exporter, NAPALM) every 15s; PromQL queries like rate(interface_in_octets[5m]) compute per-interface throughput. Logs — structured JSON logs from network devices are forwarded to Elasticsearch via Logstash or Fluent Bit; Kibana visualises log aggregations and full-text searches. Traces — OpenTelemetry SDK instruments applications to inject W3C TraceContext headers; Jaeger receives spans via gRPC and reconstructs the complete request trace with per-service latency breakdowns. Together these form the LGTM stack: Loki (logs), Grafana (visualisation), Tempo (traces), Mimir (metrics)."
  },
  mathModelling: {
    need: "To quantify the effectiveness of observability data by measuring the signal-to-noise ratio (SNR) of the telemetry stream. A high SNR means most collected data is useful for diagnosis; a low SNR means the system is overwhelmed with irrelevant noise (spurious alerts, redundant logs, low-value metrics) that delays root-cause identification.",
    equation: "SNR_{obs} = 10 \\log_{10}\\left(\\frac{S_{useful}}{S_{noise}}\\right)",
    technicalDetails: "Borrowed from communications engineering, SNR in the observability context measures the ratio of actionable observability signal (log entries that correlate with real events, metrics that deviate meaningfully from baseline, traces that expose real latency contributors) to noise (repetitive heartbeat logs, polling metrics that never change, orphaned traces). The unit is decibels (dB). If \\( S_{useful} = 1000 \\) useful events/minute and \\( S_{noise} = 100 \\) noise events/minute: \\( SNR = 10 \\log_{10}(1000/100) = 10 \\times 1 = 10 \\) dB. If noise doubles to 200: \\( SNR = 10 \\log_{10}(1000/200) = 10 \\times 0.699 = 7 \\) dB. A 3 dB drop in SNR (halving the signal-to-noise ratio) represents a significant degradation in the operator's ability to find relevant signals in the data. AIOps systems use SNR-like filtering to suppress noise — alert fatigue (operators ignoring alerts because 90% are noise) is the observability equivalent of SNR below 0 dB.",
    explanation: [
      { term: "SNR_{obs}", meaning: "Observability signal-to-noise ratio in decibels (dB) — higher values indicate a cleaner, more actionable telemetry stream" },
      { term: "S_{useful}", meaning: "Rate of useful, actionable observability signals — log entries and metrics that genuinely reflect system state changes" },
      { term: "S_{noise}", meaning: "Rate of noise — redundant, low-value, or spurious observability data that does not contribute to diagnosis" },
      { term: "10 \\log_{10}", meaning: "Logarithmic scaling that converts power ratios to decibels — each 10 dB increase represents a 10x improvement in signal quality" }
    ],
    advantages: [
      "Provides a quantitative metric for observability pipeline quality — enabling teams to measure the impact of log filtering, alert tuning, and sampling strategies",
      "Motivates intelligent sampling (head-based and tail-based trace sampling) that selectively retains high-value signals while discarding routine healthy-state data",
      "Directly correlates with operational efficiency: high-SNR observability reduces mean time to diagnose (MTTD) because operators spend less time filtering noise"
    ],
    limitations: [
      "Defining 'useful' vs 'noise' is subjective and context-dependent — a heartbeat log is noise during normal operations but critical signal during a connectivity investigation",
      "SNR measurement itself requires instrumentation to classify signals — creating a bootstrapping problem for new observability deployments",
      "Does not capture signal completeness — a system could have high SNR but miss entire categories of failures if important telemetry sources are not instrumented"
    ],
    simulation: {
      description: "Adjust the useful signal rate and noise level to observe how observability SNR changes. This models the trade-off between comprehensive telemetry collection (which increases both signal and noise) and targeted telemetry (which filters noise but risks missing signals).",
      parameters: [
        { id: "useful_signal", name: "Useful Signal Rate", min: 100, max: 10000, default: 1000, step: 100, unit: " events/min" },
        { id: "noise", name: "Noise Level", min: 1, max: 100, default: 20, step: 1, unit: " events/min" }
      ],
      generateData: (params: Record<string, number>): Array<{ x: number; y: number }> => {
        const useful_signal = params.useful_signal || 1000;
        const noise = params.noise || 20;
        const pts: Array<{ x: number; y: number }> = [];
        for (let x = 1; x <= noise; x += 1) {
          const snr = 10 * Math.log10(useful_signal / x);
          pts.push({ x, y: parseFloat(snr.toFixed(2)) });
        }
        return pts;
      },
      labels: { x: "Noise Level", y: "SNR (dB)" }
    }
  },
  activities: {
    level1: "Define the three pillars of network observability — Metrics, Logs, and Traces — and for each pillar provide: (a) a precise definition, (b) two specific examples from a network operations context, (c) one tool commonly used to collect that pillar's data, and (d) a question that pillar uniquely answers that the other two pillars cannot.",
    level2: "A network operations team is investigating why a web application experienced a 3-second latency spike for all users in a specific geographic region at 14:32:05 UTC. Describe step-by-step how they would use all three observability pillars together to diagnose the root cause. What specific metric anomaly would trigger the investigation? What logs would they correlate? What trace would they examine to pinpoint the slow component?",
    level3: "Calculate SNR_obs for three observability pipeline configurations: (a) S_useful=5000, S_noise=500; (b) S_useful=5000, S_noise=5000; (c) S_useful=1000, S_noise=10. For each, explain what the SNR value means operationally and which configuration would cause alert fatigue.",
    level4: "Deploy a Prometheus + Grafana + Jaeger observability stack using Docker Compose. Instrument a simple Python Flask web service with OpenTelemetry. Generate synthetic load and then deliberately introduce a slow database query. Demonstrate that: (a) the Prometheus metric shows latency increase, (b) application logs capture the slow query, (c) the Jaeger trace pinpoints exactly which database call caused the latency. Measure time to diagnose with vs without traces."
  },
  projects: {
    scope: "Design and implement a complete observability stack for a simulated 3-tier web application running on Docker, demonstrating that all three observability pillars provide richer diagnostic capability than monitoring alone.",
    objectives: [
      "Deploy Prometheus for metrics, Loki for logs, and Jaeger for distributed traces, integrated with Grafana for unified visualisation across all three pillars",
      "Instrument a Python Flask application with OpenTelemetry SDK to emit traces, structured logs, and custom metrics simultaneously for the same business transactions",
      "Inject 5 different fault scenarios (high CPU, slow DB, network packet loss, memory leak, application exception) and measure MTTD using observability vs monitoring-only approaches",
      "Calculate SNR for the observability pipeline by classifying collected telemetry events as actionable signal vs noise, and tune sampling rates to maximise SNR"
    ],
    deliverables: [
      "Docker Compose file defining the complete LGTM (Loki, Grafana, Tempo, Mimir) or PLG (Prometheus, Loki, Grafana) + Jaeger stack",
      "Instrumented Flask application code with OpenTelemetry SDK for all three pillars",
      "MTTD comparison table: 5 fault scenarios × monitoring-only vs full observability diagnosis times",
      "SNR analysis report: before and after telemetry tuning, with a graph of SNR vs sampling rate trade-off"
    ]
  },
  questions: [
    {
      q: "Define the three pillars of network observability and explain why all three are necessary.",
      a: "The three pillars are Metrics, Logs, and Traces. Metrics are time-series numerical measurements sampled at regular intervals (CPU utilisation every 15s, interface throughput every 1s, queue depth every 5s). They show trends, baselines, and anomalies across the full infrastructure. Logs are timestamped text or structured records of discrete events (BGP state change, interface status change, authentication failure, configuration change). They provide sequential context and human-readable detail about what happened and when. Traces are end-to-end records of a single transaction's journey through multiple system components, capturing per-hop latency, errors, and attributes. They reveal where within a complex distributed system a problem manifests. All three are necessary because each answers different questions: metrics answer 'what is happening across the whole system?', logs answer 'what discrete events occurred and in what sequence?', and traces answer 'why is this specific transaction slow or failing?' Without metrics, you cannot detect anomalies at scale. Without logs, you cannot reconstruct event sequences for root cause analysis. Without traces, you cannot attribute latency or failures to specific services in a microservices or multi-vendor network.",
      type: "Conceptual"
    },
    {
      q: "How does the control-theory definition of 'observability' apply to network management?",
      a: "In control theory (Kalman, 1960), a system is observable if its complete internal state can be determined from its external outputs alone, without needing to open the system. Applied to network management: a network is observable if operators can fully understand its internal state — which flows are active, where congestion is developing, what configuration is applied, why a specific transaction is slow — purely from the telemetry data the network emits (metrics, logs, traces), without needing to SSH into individual devices or perform disruptive diagnostics. Traditional monitoring fails this test: knowing that CPU is 90% on a router does not tell you what process is causing it, what traffic is driving it, or whether a configuration change from 3 hours ago is the root cause. Full observability — where logs, metrics, and traces together expose the complete internal state — means an operator can reconstruct exactly what was happening inside any system component at any point in time from the stored telemetry alone. This is the design goal of tools like Honeycomb, Grafana, and the OpenTelemetry project.",
      type: "Analytical"
    },
    {
      q: "Calculate SNR_obs for S_useful=2000 events/min and S_noise=50 events/min. What does this value indicate?",
      a: "SNR_obs = 10 × log₁₀(S_useful / S_noise) = 10 × log₁₀(2000 / 50) = 10 × log₁₀(40) = 10 × 1.602 = 16.02 dB. This indicates a high-quality observability stream: for every 1 noise event, there are 40 useful signal events. Operators working with this telemetry stream will find relevant diagnostic data quickly with minimal noise filtering. For context: SNR of 20 dB means 100:1 signal-to-noise ratio (excellent), 10 dB means 10:1 (good), 0 dB means 1:1 (severe alert fatigue), negative dB means noise exceeds signal (operationally untenable). An SNR of 16 dB is characteristic of a well-tuned observability pipeline with appropriate sampling rates and log filtering.",
      type: "Numerical"
    },
    {
      q: "What is high-cardinality observability data and why does it matter for network diagnosis?",
      a: "High-cardinality data contains attributes with millions of unique values — for example, customer_id, trace_id, session_id, source_ip, request_url. In traditional monitoring tools (SNMP, Nagios), all metrics are low-cardinality: CPU per device, bandwidth per interface — a fixed, small set of dimensions. High-cardinality observability means you can ask: 'Show me all network flows for customer_id=A7829 that experienced latency > 100ms in the last 5 minutes from source subnet 10.50.x.x.' This query requires filtering a telemetry stream by multiple high-cardinality dimensions simultaneously — something that RRD-based or SNMP-based monitoring systems cannot do because they pre-aggregate data and discard individual event attributes. Tools like Honeycomb, ClickHouse-backed Grafana Tempo, and Elasticsearch are designed specifically for high-cardinality queries. In network management, high-cardinality enables per-flow, per-customer, per-application SLA tracking rather than just per-device averages — transforming network operations from infrastructure-centric to service-centric.",
      type: "Conceptual"
    },
    {
      q: "What is 'alert fatigue' in the context of observability SNR, and what are two technical strategies to address it?",
      a: "Alert fatigue occurs when the observability pipeline generates so many alerts — the vast majority being false positives, duplicates, or low-priority noise — that operators begin ignoring them systematically. When every operator action starts with 'probably another false alarm', critical real alerts are missed in the noise, causing outage delays. This is the operational manifestation of low or negative SNR. Two technical strategies: First, alert deduplication and correlation — AIOps platforms (Moogsoft, BigPanda) group related alerts from multiple systems that share a common root cause into a single actionable incident, reducing 100 correlated alerts to 1. This directly improves SNR by consolidating signal. Second, dynamic baseline alerting — instead of static thresholds (alert if CPU > 90%), anomaly detection algorithms compute dynamic baselines from historical data (Prophet, ARIMA, Isolation Forest) and alert only when behaviour deviates statistically significantly from the expected pattern. This eliminates false positives from expected load patterns (daily peaks, weekly cycles) while catching genuine anomalies. Google SRE teams target a maximum alert false-positive rate of 15% to maintain operator engagement.",
      type: "Analytical"
    }
  ],
  virtualLab: {
    description: "Your NOC is flooded with verbose debug-level logs and unsampled traces that are drowning out actionable signals. Your task: determine the maximum acceptable noise level to maintain an observability SNR above 10 dB (the minimum for effective diagnosis). Adjust the useful signal rate and the noise level. The chart shows SNR degradation — find the noise threshold where SNR drops below 10 dB and fix your logging verbosity and sampling strategy to stay above it.",
    interpretation: "With 1,000 useful signal events/min, 20 noise events/min gives SNR ~17 dB — good. Moving from 5 noise to 20 costs 6 dB of SNR, making diagnosis 4x harder. The target SNR > 10 dB means noise should not exceed 10% of the useful signal rate. In practice, achieve this through: structured logging (INFO/WARN/ERROR only; DEBUG disabled in production), adaptive trace sampling (collect traces only for requests > 200 ms or errors), and alert suppression rules that group similar alerts. Use this lab to set your observability pipeline's noise budget.",
    parameters: [
      { id: "useful_signal", name: "Useful Signal Rate", min: 100, max: 10000, default: 1000, step: 100, unit: " events/min" },
      { id: "noise", name: "Noise Level", min: 1, max: 100, default: 20, step: 1, unit: " events/min" }
    ],
    generateData: (params: Record<string, number>): Array<{ x: number; y: number }> => {
      const useful_signal = params.useful_signal || 1000;
      const noise = params.noise || 20;
      const pts: Array<{ x: number; y: number }> = [];
      for (let x = 1; x <= noise; x += 1) {
        const snr = 10 * Math.log10(useful_signal / x);
        pts.push({ x, y: parseFloat(snr.toFixed(2)) });
      }
      return pts;
    },
    labels: { x: "Noise Level", y: "SNR (dB)" }
  }
};
