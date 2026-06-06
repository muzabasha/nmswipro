import type { TopicData } from './types';

export const topic16Data: TopicData = {
  id: "u4t3",
  title: "Data Analytics with AI/ML in Observability",
  moduleName: "Unit 4: SDN, Network Observability, and Advanced Management",
  context: {
    prerequisites: ["Topic 4.2: Network Observability vs. Monitoring", "Basic Statistics (Mean, Standard Deviation)"],
    dependentTopics: ["Topic 4.4: Service Orchestration, Assurance, and Network Slicing (ONAP)"],
    nextSteps: "Apply these automated AI decisions to drive service orchestration and closed-loop assurance in the next topic."
  },
  storytelling: {
    analogy: "The Smart Home Alarm vs. The Simple Motion Sensor",
    story: "A simple motion sensor rings the alarm whenever anything moves (traditional static threshold: alert if CPU > 90%). It triggers when the cat runs by, or when you walk in, generating constant false alarms. A smart AI home alarm learns your family's routine. It knows that you walk around at 6 PM, so it ignores that motion. But if it detects movement at 3 AM in the basement, it knows it is highly anomalous and alerts you (AI-based anomaly detection). In networks, AI/ML engines ingest streaming telemetry to learn normal daily traffic profiles (e.g., high traffic at 10 AM, low at 3 AM), replacing static alerts with dynamic statistical baselines.",
    reflectiveQuestions: ["Why do static thresholds (e.g., Alert if CPU > 85%) fail during predictable backup cycles at night?", "How does an AI engine determine if a sudden traffic spike is normal or a DDoS attack?"],
    technicalConnection: "AIOps (Artificial Intelligence for IT Operations) combines streaming telemetry observability with machine learning. It uses algorithms for dynamic baselining, anomaly detection (using Z-scores or Isolation Forests), and predictive forecasting (using LSTM or ARIMA models) to identify slow network degradations and forecast link congestion before customers are impacted."
  },
  mathModelling: {
    need: "To model the dynamic anomaly detection threshold for a streaming network metric (e.g., interface throughput) using Z-score statistical baselining.",
    equation: "z = \\frac{x - \\mu}{\\sigma}",
    technicalDetails: "The Z-score measures how many standard deviations (\\(\\sigma\\)) a current telemetry metric data point \\(x\\) is away from the historical rolling mean (\\(\\mu\\)). An observability platform calculates \\(\\mu\\) and \\(\\sigma\\) over a sliding time window (e.g., last 30 days). If the absolute value of \\(z\\) exceeds a threshold (typically \\(|z| > 3.0\\)), the metric is statistically classified as an anomaly, triggering an alert. This adapts to daily or weekly traffic shifts because the baseline (\\(\\mu\\)) slides over time, eliminating the false alarms of fixed static thresholds.",
    explanation: [
      { term: "z", meaning: "Z-score: Number of standard deviations the current value is from the mean." },
      { term: "x", meaning: "Current observed value of the telemetry metric." },
      { term: "\\mu", meaning: "Historical rolling mean of the metric over the baseline window." },
      { term: "\\sigma", meaning: "Historical rolling standard deviation, representing metric volatility." }
    ],
    advantages: ["Eliminates manual threshold configuration for thousands of interfaces.", "Adapts dynamically to normal seasonal network growth and weekly patterns."],
    limitations: ["Can fail if the baseline window contains anomalous data (e.g., a week-long outage would poison the mean)."],
    simulation: {
      description: "Vary the current metric value (x), rolling mean (μ), and standard deviation (σ) to calculate the Z-score and observe if it triggers an anomaly alert.",
      parameters: [
        { id: "metricValue", name: "Current Metric (x)", min: 0, max: 1000, default: 450, step: 10, unit: " Mbps" },
        { id: "rollingMean", name: "Rolling Mean (μ)", min: 100, max: 500, default: 300, step: 10, unit: " Mbps" },
        { id: "rollingStd", name: "Standard Dev (σ)", min: 10, max: 100, default: 50, step: 5, unit: " Mbps" }
      ]
    }
  },
  activities: {
    level1: "Teacher displays a graph showing dynamic envelope thresholds wrapping a wavy daily network traffic plot.",
    level2: "Students calculate the Z-score of a router CPU reading of 95% if the mean is 50% and standard deviation is 15%.",
    level3: "Class Exercise: Design a flowchart for a closed-loop remediation system that uses AI detection to trigger SDN routing updates.",
    level4: "Write a 150-word paper describing the limitations of ML-based forecasting models during sudden, unprecedented physical network outages."
  },
  projects: {
    scope: "Design an anomaly detection rule model.",
    objectives: ["Specify a YAML configuration for a Prometheus alert that triggers based on a Z-score calculation over a 1-hour metric history", "Define the output notification destinations"],
    deliverables: ["Prometheus alert rule descriptor", "1-page logic explanation"]
  },
  questions: [
    { q: "What is AIOps and how does it relate to network observability?", a: "AIOps stands for Artificial Intelligence for IT Operations. It applies machine learning and data analytics to observability data (metrics, logs, traces) to automate fault detection, root cause analysis, and operational tasks.", type: "Conceptual" },
    { q: "A router interface's average traffic is 600 Mbps with a standard deviation of 40 Mbps. If traffic suddenly drops to 480 Mbps, what is the Z-score, and is it anomalous if the threshold is |z| > 3?", a: "z = (480 - 600) / 40 = -120 / 40 = -3.0. Since |-3.0| = 3.0, it lies exactly on the boundary of anomaly detection, indicating a significant, highly unusual traffic dip.", type: "Numerical" },
    { q: "What is the difference between static alerting thresholds and dynamic alerting thresholds?", a: "Static thresholds alert when a metric crosses a hard limit (e.g., CPU > 90%). Dynamic thresholds alert when a metric deviates statistically from its historical baseline (e.g., z-score > 3), adapting to daily and seasonal shifts.", type: "Conceptual" },
    { q: "How can machine learning assist in capacity planning for an ISP?", a: "ML regression algorithms (like linear trend projections or time-series forecasting) analyze months of bandwidth data to predict the exact month a link will exceed 80% capacity, allowing proactive upgrades.", type: "Analytical" },
    { q: "Explain closed-loop network assurance.", a: "It is an automated lifecycle: 1) Telemetry streams data; 2) AI analyzes and detects an issue; 3) Policy engine decides a fix; 4) SDN controller applies the configuration change to repair the issue without human intervention.", type: "Conceptual" }
  ],
  virtualLab: {
    description: "AI Anomaly Detection Lab. Stream traffic metrics through a statistical parser. Adjust the Z-score threshold slider to balance detection sensitivity and false alarm rates.",
    interpretation: "A low Z-score threshold (e.g., 1.5) catches minor jitters but spikes false alarms. A high threshold (e.g., 4.0) only catches severe spikes but misses early warning indicators, illustrating the trade-off in alert tuning.",
    parameters: [
      { id: "zThreshold", name: "Z-Score Alert Threshold", min: 1.5, max: 4.5, default: 3.0, step: 0.1, unit: " standard deviations" }
    ]
  }
};
