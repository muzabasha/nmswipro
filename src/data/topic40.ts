import type { TopicData } from './types';

export const topic40Data: TopicData = {
  id: "u4t8",
  title: "Applying Analytics on Observability Data with AI/ML and Prediction Methods",
  moduleName: "Unit IV: SDN, Network Observability, and Advanced Network Management",
  context: {
    prerequisites: ["Data Collection and Storage for Network Observability"],
    dependentTopics: ["Overview of Service Orchestration"],
    nextSteps: "Study Overview of Service Orchestration to understand how AIOps predictions and analytics directly drive automated service lifecycle decisions — connecting the intelligence layer to the orchestration action layer.",
    rfcReferences: [
      { name: "ISO/IEC 22989", relevance: "AI Concepts and Terminology — foundational definitions for AI/ML concepts including supervised/unsupervised learning, feature engineering, and model validation for AIOps applications." },
      { name: "ISO/IEC 23053", relevance: "Framework for AI Systems Using Machine Learning — ML lifecycle management covering data preparation, model training, evaluation, deployment, and monitoring." },
      { name: "Prophet Time Series Library", relevance: "Meta's open-source forecasting model — decomposes time-series into trend, seasonality, and holiday components for capacity planning and anomaly detection." },
      { name: "PyOD Library", relevance: "Python Outlier Detection library — implements Isolation Forest, COPOD, ECOD, and LOF algorithms for multivariate network anomaly detection." },
      { name: "LSTM Autoencoders", relevance: "Sequence-based anomaly detection for time-series network telemetry — learns normal behavioural patterns and detects deviations in sequential data." },
      { name: "MLflow Specification", relevance: "ML model lifecycle management platform — experiment tracking, model versioning, and deployment registry for production AIOps model pipelines." }
    ]
  },
  storytelling: {
    analogy: "A Predictive Maintenance System for Aircraft Engines",
    story: "Modern commercial aircraft engines are equipped with hundreds of sensors monitoring vibration, temperature, fuel consumption, and metal particle content in oil — collecting terabytes of data per flight. Engineers do not wait for an engine to fail before servicing it; predictive maintenance ML models analyse sensor data trends and alert maintenance crews weeks before a component is likely to fail — identifying a bearing that is developing microscopic cracks from a subtle vibration signature change long before any human mechanic could notice it. This is exactly what AIOps (Artificial Intelligence for IT Operations) does for network infrastructure. A network with 1,000 devices generating continuous telemetry has patterns in that data that are invisible to human operators reviewing dashboards: a 3% gradual memory growth trend on a core router that will trigger an OOM crash in 6 hours; a BGP prefix count that is growing 2% per week and will exceed the route table limit in 45 days; a subtle correlation between CPU spikes on a specific VNF and transaction failures on an e-commerce application that are 8 seconds apart — the VNF processing delay manifesting as application timeouts. ML algorithms find these patterns with superhuman consistency and speed. Anomaly detection algorithms (Isolation Forest for multivariate outliers, LSTM autoencoders for sequence anomalies, Prophet for time-series with seasonality) learn normal behaviour from 90 days of baseline data and then continuously compare current behaviour against learned patterns — alerting when the deviation exceeds a statistically meaningful threshold. Capacity forecasting (ARIMA for stationary time series, Facebook Prophet for seasonal data with trend components, Holt-Winters for exponential smoothing with trend and seasonality) projects when a link will reach saturation given current growth trends — enabling network engineers to submit capacity upgrade orders 6-8 weeks before the saturation date, which aligns with typical procurement and deployment lead times. Root cause analysis via graph neural networks and causal inference identifies which specific change or event in the network's causal graph caused an observed anomaly — automatically correlating a BGP policy change deployed at 09:47 with application latency spikes detected at 09:52 across 23 services, even though no human noticed the connection. These models continuously learn from labelled incident data, improving accuracy with each new event the operations team resolves.",
    reflectiveQuestions: [
      "An LSTM anomaly detection model was trained on summer traffic patterns and deployed in winter. It generates hundreds of false alarms during the holiday peak traffic season. What does this illustrate about the maintenance requirements of AIOps models in production?",
      "How do you validate that a root-cause analysis ML model is actually identifying true root causes rather than correlations that happen to co-occur in the training data?",
      "What are the ethical and operational implications of giving an AIOps system the authority to automatically implement the remediation actions it recommends, without human approval?"
    ],
    technicalConnection: "Anomaly detection in production: Prometheus Alertmanager with ARIMA-based anomaly detection (via prometheus-anomaly-detector); Meta's Prophet library for seasonality-aware forecasting; PyOD (Python Outlier Detection) library with Isolation Forest, COPOD, ECOD algorithms for multivariate network metric anomaly detection. Root cause analysis: Microsoft's Project Bonsai for causal inference; Moogsoft and BigPanda use graph-based correlation to cluster related alerts; Anodot and Lightrun use ML-driven anomaly detection with automatic root cause identification. MLOps pipeline: ML models trained on historical observability data (stored in the data lake from the previous topic) using platforms like MLflow (experiment tracking), Kubeflow (training orchestration), or AWS SageMaker; inference deployed as microservices consuming real-time telemetry from Kafka."
  },
  mathModelling: {
    need: "To measure the accuracy of time-series forecast models used for capacity planning and anomaly detection. MAPE (Mean Absolute Percentage Error) quantifies how far model predictions deviate from actual values on average — a critical metric for validating whether a model is reliable enough for production capacity planning decisions.",
    equation: "MAPE = \\frac{1}{n} \\sum_{i=1}^{n} \\left| \\frac{A_i - F_i}{A_i} \\right| \\times 100\\%",
    technicalDetails: "MAPE is the average of absolute percentage errors across \\( n \\) time steps. \\( A_i \\) is the actual measured value at time step \\( i \\) and \\( F_i \\) is the forecast value. For capacity planning, a MAPE below 10% is considered 'excellent', 10-20% 'good', 20-30% 'acceptable', above 30% 'poor'. Example: a Prophet model forecasts link utilisation for 5 hours: actual=[45, 48, 52, 50, 55]%, forecast=[43, 50, 49, 53, 52]%. MAPE = (1/5) × (|45-43|/45 + |48-50|/48 + |52-49|/52 + |50-53|/50 + |55-52|/55) × 100 = (1/5) × (4.44 + 4.17 + 5.77 + 6.00 + 5.45)% = (1/5) × 25.83% = 5.17% — an excellent result. A forecast model with MAPE < 10% enables reliable capacity upgrade scheduling; MAPE > 25% means the model's uncertainty is too high for procurement decisions. Anomaly detection models are evaluated differently (precision, recall, F1 score) because they produce binary outputs rather than continuous forecasts.",
    explanation: [
      { term: "MAPE", meaning: "Mean Absolute Percentage Error — average percentage deviation of forecasts from actual values; lower is better" },
      { term: "n", meaning: "Number of time steps in the evaluation window — longer windows provide more statistically reliable MAPE estimates" },
      { term: "A_i", meaning: "Actual measured value at time step i (e.g., measured link utilisation at hour i)" },
      { term: "F_i", meaning: "Forecast value predicted by the model for time step i (e.g., Prophet's prediction for link utilisation at hour i)" }
    ],
    advantages: [
      "MAPE is interpretable in percentage terms — a network engineer immediately understands that 5% MAPE means forecasts are typically within 5% of actual values",
      "Scale-independent — valid for comparing forecast accuracy across metrics with different units and magnitudes (bandwidth in Gbps vs CPU in %)",
      "Enables model selection: comparing MAPE across ARIMA, Prophet, and LSTM forecasters on historical data to choose the best model for production"
    ],
    limitations: [
      "MAPE is undefined when A_i = 0 (division by zero) — a problem for metrics that legitimately reach zero (idle interfaces, maintenance windows)",
      "MAPE penalises under-forecasts and over-forecasts asymmetrically when values are near zero vs large — sMAPE (Symmetric MAPE) or MAE are better for such distributions",
      "A good MAPE on training data does not guarantee good MAPE on future data — overfitting to seasonal patterns (e.g., trained on normal weeks, deployed during holiday traffic) causes MAPE to spike"
    ],
    simulation: {
      description: "Model how MAPE grows as forecast error percentage increases across time steps. This illustrates how a systematic forecast bias compounds over multiple time steps.",
      parameters: [
        { id: "actual", name: "Actual Value (baseline)", min: 10, max: 200, default: 100, step: 10, unit: "" },
        { id: "forecast_error", name: "Forecast Error (%)", min: 1, max: 50, default: 10, step: 1, unit: "%" }
      ],
      generateData: (params: Record<string, number>): Array<{ x: number; y: number }> => {
        const forecast_error = params.forecast_error || 10;
        const pts: Array<{ x: number; y: number }> = [];
        for (let x = 1; x <= 10; x++) {
          const error = (forecast_error / 100) * x;
          const mape = error * 100;
          pts.push({ x, y: parseFloat(mape.toFixed(2)) });
        }
        return pts;
      },
      labels: { x: "Time Step", y: "MAPE (%)" }
    }
  },
  activities: {
    level1: "Define and distinguish three AI/ML techniques used in AIOps: anomaly detection (Isolation Forest, LSTM autoencoder), time-series forecasting (ARIMA, Prophet), and root cause analysis (causal inference, graph neural networks). For each: (a) the type of input data, (b) the type of output produced, (c) a specific network use case, and (d) the evaluation metric used to measure model quality.",
    level2: "Trace the lifecycle of an AIOps prediction from data collection to action: beginning with raw interface utilisation telemetry at 1 Hz, through the data preprocessing step (normalisation, feature engineering), through the Prophet forecast model, through the alert generation and enrichment step, to the final human or automated remediation action. Identify where false positives can enter the pipeline and how they are filtered.",
    level3: "Calculate MAPE for the following 6-step forecast sequence: Actual=[100, 105, 98, 112, 107, 115], Forecast=[95, 110, 100, 108, 110, 120]. Show the absolute percentage error at each step and the final average. Is this model acceptable for capacity planning?",
    level4: "Using Python and the Facebook Prophet library, train a forecasting model on 90 days of synthetic hourly network utilisation data (with daily and weekly seasonality patterns). Evaluate the model on a 14-day holdout period using MAPE. Compare Prophet's MAPE against a simple ARIMA(2,1,2) model on the same dataset. Generate a capacity saturation forecast: predict the date when the link will exceed 80% utilisation given the growth trend."
  },
  projects: {
    scope: "Build a production-ready AIOps analytics pipeline that processes historical network observability data to deliver anomaly detection, capacity forecasting, and automated root-cause correlation for a 50-device network.",
    objectives: [
      "Deploy Isolation Forest anomaly detection on multivariate network metrics (CPU, memory, bandwidth, error rate) using PyOD, with a 90-day training window and real-time scoring against incoming Prometheus metrics",
      "Train Facebook Prophet models for capacity forecasting on each of 50 interfaces' bandwidth utilisation time-series, generating 30-day ahead forecasts with confidence intervals",
      "Implement a causal correlation engine that identifies which network configuration changes (detected from logs) are statistically correlated with subsequent metric anomalies within a configurable time window",
      "Evaluate model accuracy with MAPE (forecasting) and F1 score (anomaly detection) against labelled fault injection test cases, achieving MAPE < 15% and F1 > 0.75"
    ],
    deliverables: [
      "Python AIOps pipeline code: data preprocessing, Isolation Forest anomaly scorer, Prophet forecaster, and causal correlation engine with documented API",
      "Model evaluation report: MAPE vs time horizon for 3 forecasting models (Prophet, ARIMA, Holt-Winters), F1 precision/recall for anomaly detection across 10 injected fault types",
      "Capacity planning dashboard: Grafana panels showing current utilisation, Prophet forecast with 95% confidence interval, and projected saturation date for each of 50 interfaces",
      "AIOps architecture diagram: data flow from Kafka → feature engineering → model inference → alert enrichment → Grafana/PagerDuty"
    ]
  },
  questions: [
    {
      q: "What is AIOps and what are the three primary ML capabilities it provides for network operations?",
      a: "AIOps (Artificial Intelligence for IT Operations, coined by Gartner) applies machine learning and data analytics to IT operations data — logs, metrics, traces, events — to augment and partially automate the work that human operators would otherwise do. The three primary capabilities: First, anomaly detection — ML models (Isolation Forest, LSTM autoencoders, seasonal decomposition) learn the normal behaviour patterns of network metrics from historical data and continuously compare current behaviour against the learned baseline, raising alerts when deviation exceeds a statistically meaningful threshold. This detects subtle issues invisible to static threshold alerting — a 3% weekly memory growth rate is flagged by an anomaly detector but generates no alert in a system that only alerts at 90% memory. Second, capacity forecasting — time-series models (Prophet, ARIMA, Holt-Winters) project future resource consumption based on historical growth trends and seasonal patterns, predicting when links, CPU, or flow tables will reach capacity — enabling proactive upgrades before SLA-breaching saturation occurs. Third, root cause analysis and alert correlation — graph-based and causal inference algorithms automatically identify relationships between events (change deployed at 09:47 → BGP flap at 09:52 → application latency at 09:53) and cluster thousands of correlated alerts from multiple sources into a single actionable incident — reducing alert fatigue and mean time to diagnose.",
      type: "Conceptual"
    },
    {
      q: "How does an LSTM autoencoder detect anomalies in network time-series data?",
      a: "An LSTM (Long Short-Term Memory) autoencoder is a neural network architecture consisting of an encoder LSTM that compresses a time window of network metrics into a fixed-size latent representation, and a decoder LSTM that attempts to reconstruct the original time window from the compressed representation. During training (on 60-90 days of normal operation data), the autoencoder learns to reconstruct normal patterns with low reconstruction error — BGP-stable, CPU-stable, bandwidth-following-daily-patterns time series are reproduced accurately. During inference, when an anomalous pattern appears (unusual CPU spike combined with new BGP route instability and increased error rates), the autoencoder's decoder cannot reconstruct this unfamiliar pattern accurately, producing high reconstruction error. The anomaly score is the reconstruction error: when it exceeds the 99th percentile of training-time reconstruction errors, an alert is generated. The advantage over simple threshold alerting: the LSTM captures temporal dependencies (patterns unfolding over minutes) and multivariate correlations (simultaneous anomalies across multiple metrics are more anomalous than single-metric deviations) that per-metric thresholds miss. The limitation: LSTM autoencoders require significant training data (60+ days), GPU for training, and periodic retraining when network behaviour changes significantly (new applications, topology changes).",
      type: "Analytical"
    },
    {
      q: "Calculate MAPE for Actual=[80, 85, 90, 88, 92] and Forecast=[76, 88, 87, 91, 95]. Is this acceptable for capacity planning?",
      a: "Step-by-step: |80-76|/80 = 4/80 = 0.050 = 5.0%; |85-88|/85 = 3/85 = 0.0353 = 3.53%; |90-87|/90 = 3/90 = 0.0333 = 3.33%; |88-91|/88 = 3/88 = 0.0341 = 3.41%; |92-95|/92 = 3/92 = 0.0326 = 3.26%. Sum = 5.0 + 3.53 + 3.33 + 3.41 + 3.26 = 18.53%. MAPE = 18.53% / 5 = 3.71%. This is excellent (below 10% threshold) and is highly acceptable for capacity planning. At this accuracy level, the model can reliably predict link saturation dates with enough precision for procurement decisions — a 3.71% error on a 90% utilisation forecast means the predicted date is approximately 3.7 days off for a link growing at 1% per day.",
      type: "Numerical"
    },
    {
      q: "What is Facebook Prophet and why is it particularly well-suited for network capacity forecasting?",
      a: "Facebook Prophet (open-source, Python/R) is a time-series forecasting library that models time series as the sum of three components: trend (piecewise linear or logistic growth), seasonality (Fourier series approximation of daily, weekly, and annual cycles), and holidays/special events (user-defined changepoints). It is well-suited for network capacity forecasting for several reasons: First, network traffic exhibits strong multi-level seasonality — daily business-hour peaks, weekly weekday vs weekend patterns, and annual patterns (fiscal quarter end, holiday seasons) — which Prophet models natively without manual decomposition. Second, Prophet handles missing data and outliers robustly (it uses a robust fitting procedure that is not distorted by a few anomalous days), which is critical for network data that has maintenance windows and holiday dips. Third, Prophet automatically detects changepoints — abrupt trend changes caused by network events like a new customer activation or a major application deployment — and adjusts forecasts accordingly. Fourth, Prophet generates uncertainty intervals at user-specified confidence levels (80%, 95%) — critical for capacity planning where the upper confidence bound (not just the point forecast) determines the upgrade trigger date. The practical workflow: train Prophet on 180 days of hourly interface utilisation, generate 90-day ahead forecasts, find the date when the upper 95% confidence bound crosses 80% utilisation — that date minus 45 days (procurement lead time) is the order deadline.",
      type: "Analytical"
    },
    {
      q: "What is the difference between alert correlation and root cause analysis in AIOps, and how does each reduce mean time to diagnose?",
      a: "Alert correlation addresses the alert flood problem: when a core router fails, it triggers dozens of correlated alerts — BGP down, OSPF adjacency down, ICMP unreachable from 50 devices, interface down, SLA breach for 30 customers — all caused by the same single root cause. Without correlation, the operator faces 80+ alerts and must manually identify that they all point to one device. Alert correlation algorithms (graph-based clustering, temporal correlation windows, topology-aware grouping) automatically group all related alerts into a single incident card, reducing 80 alerts to 1 actionable incident. This reduces MTTD from 'operator notices and correlates alerts' (10-30 minutes) to immediate. Root cause analysis goes further: it identifies which specific event, change, or component caused the incident in the first place — not just which component failed, but why it failed. Causal inference techniques analyse the temporal sequence of events leading up to the incident (a BGP configuration change was deployed at T-5 minutes, a firmware upgrade was applied at T-8 minutes) and compute causal probability scores for each candidate root cause. Graph neural networks analyse the network topology causal graph to determine which single failure can explain all observed symptoms. Together, correlation + RCA reduces MTTR by eliminating both the 'find the right alert' phase and the 'identify root cause' phase — the two longest phases of incident resolution.",
      type: "Analytical"
    }
  ],
  virtualLab: {
    description: "Explore how forecast error percentage translates to MAPE across multiple time steps. Adjust the baseline actual value and the systematic forecast error percentage to understand accuracy thresholds. In practice, a consistent systematic error (bias) is worse than random error because it compounds — this simulation shows how MAPE grows when error is proportional to the time step.",
    interpretation: "When forecast error grows proportionally with time (as modelled here), MAPE increases linearly — typical of models that underestimate a consistent growth trend. At 10% error, MAPE at time step 5 is 50% — far above the 15% acceptable threshold for capacity planning. Real forecast models (Prophet, ARIMA) exhibit neither perfectly linear nor perfectly random error patterns, but MAPE provides the aggregate accuracy metric needed to make a go/no-go deployment decision. The key insight: for capacity planning, acceptable MAPE (< 10-15%) requires models that are retrained regularly as network growth patterns evolve.",
    parameters: [
      { id: "actual", name: "Actual Value (baseline)", min: 10, max: 200, default: 100, step: 10, unit: "" },
      { id: "forecast_error", name: "Forecast Error (%)", min: 1, max: 50, default: 10, step: 1, unit: "%" }
    ],
    generateData: (params: Record<string, number>): Array<{ x: number; y: number }> => {
      const forecast_error = params.forecast_error || 10;
      const pts: Array<{ x: number; y: number }> = [];
      for (let x = 1; x <= 10; x++) {
        const error = (forecast_error / 100) * x;
        const mape = error * 100;
        pts.push({ x, y: parseFloat(mape.toFixed(2)) });
      }
      return pts;
    },
    labels: { x: "Time Step", y: "MAPE (%)" }
  }
};
