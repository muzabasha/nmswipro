import type { TopicData } from './types';

export const topic39Data: TopicData = {
  id: "u4t7",
  title: "Data Collection and Storage for Network Observability",
  moduleName: "Unit IV: SDN, Network Observability, and Advanced Network Management",
  context: {
    prerequisites: ["Techniques and Tools of Network Observability"],
    dependentTopics: [
      "Applying Analytics on Observability Data with AI/ML and Prediction Methods"
    ],
    nextSteps: "Study Applying Analytics on Observability Data with AI/ML and Prediction Methods to understand how the stored observability data is transformed from raw time-series into intelligent predictions, anomaly detections, and automated root-cause analysis.",
    rfcReferences: [
      { name: "InfluxDB Line Protocol", relevance: "Time-series data format for efficient storage and compression of metrics" },
      { name: "Prometheus Exposition Format", relevance: "Metrics collection and storage format for time-series observability data" },
      { name: "OpenTelemetry Protocol (OTLP)", relevance: "Standard protocol for collecting and storing metrics, logs, and traces" },
      { name: "RFC 5424", relevance: "Syslog Protocol - structured logging format for centralized log aggregation" },
      { name: "W3C Trace Context", relevance: "Standard for distributed trace context propagation and storage" },
      { name: "Apache Parquet Format", relevance: "Columnar storage format for long-term observability data archival and analytics" }
    ]
  },
  storytelling: {
    analogy: "A Smart City Sensor Data Lake",
    story: "Imagine a smart city deploying sensors on every traffic light, bus, bridge, and utility meter — generating millions of data points per minute from thousands of sensors. The hard part is not deploying the sensors; it is building the data infrastructure that can absorb this continuous flood, store it efficiently for months, and answer arbitrary analytical queries in seconds. A network with 1,000 devices generating 1-second telemetry produces 86.4 billion data points per day. Storing these in a relational SQL database would take terabytes and queries would time out. This is why time-series databases (TSDBs) were invented specifically for this problem. InfluxDB, Prometheus, VictoriaMetrics, and TimescaleDB use three key innovations: first, Gorilla compression and delta encoding — instead of storing each absolute value (1024, 1026, 1028), they store the first value plus deltas (1024, +2, +2), and further compress using XOR between consecutive floating-point representations, achieving 10-20x compression ratios on typical network counter data. Second, time-partitioned storage — data is partitioned by time window (hourly or daily blocks), enabling queries for a specific time range to skip irrelevant partitions entirely and return results in milliseconds. Third, downsampling — raw 1-second data is automatically rolled up to 1-minute averages after 24 hours, 5-minute averages after 7 days, and hourly averages after 30 days. This keeps long-term storage manageable while preserving high-resolution data for recent incidents. For log data, Elasticsearch's inverted index enables full-text search across billions of log lines — finding all occurrences of 'BGP notification' across 1,000 devices in the last hour in under 1 second. For trace data, Jaeger's Cassandra or Elasticsearch backend stores span metadata with trace ID as the partition key, enabling O(1) trace lookup by ID regardless of total trace volume. Together, these three storage systems form the observability data lake: Prometheus/VictoriaMetrics for metrics, Elasticsearch/Loki for logs, Jaeger/Tempo for traces — each optimised for its data type and query pattern.",
    reflectiveQuestions: [
      "A network engineer queries 30 days of 1-second interface counter data for 500 interfaces. Why would this query time out in a relational database but return in 2 seconds in a time-series database like InfluxDB or VictoriaMetrics?",
      "What are the trade-offs between keeping raw 1-second telemetry vs downsampled 1-minute data for incident investigation? What types of incidents can only be diagnosed with the high-resolution raw data?",
      "How does the choice between a push-based (Prometheus Pushgateway) vs pull-based (Prometheus scrape) vs streaming (Kafka + consumer) data collection architecture affect the observability pipeline's scalability and fault tolerance?"
    ],
    technicalConnection: "Prometheus remote write protocol: Prometheus scrapes metrics and can remote-write to VictoriaMetrics, Thanos, or Cortex for long-term distributed storage beyond single-node Prometheus limits. Thanos adds: unlimited retention via object storage (S3, GCS), global query across multiple Prometheus instances, and query deduplication. InfluxDB Line Protocol: measurements are written as 'measurement_name,tag_key=tag_value field_key=field_value timestamp'. Apache Kafka acts as the observability data bus — streaming telemetry and logs are published to Kafka topics, consumed by multiple downstream processors (Prometheus remote write adapter, Elasticsearch Logstash input, Flink/Spark for real-time analytics) without coupling producers to consumers. This decoupling is essential for a resilient observability pipeline — if the storage backend is temporarily unavailable, Kafka buffers data rather than dropping it."
  },
  mathModelling: {
    need: "To calculate the total storage capacity required for an observability data lake before deployment. Underestimating storage leads to data loss or forced premature downsampling that destroys diagnostic resolution. Overestimating wastes infrastructure budget.",
    equation: "S_{total} = N \\times F \\times S_{point} \\times T_{retention}",
    technicalDetails: "Raw storage before compression: \\( S_{total} = N \\times F \\times S_{point} \\times T_{retention} \\) where all time units must be consistent. For \\( N = 1{,}000 \\) devices, \\( F = 1 \\) sample/second/device, \\( S_{point} = 16 \\) bytes per data point (8-byte timestamp + 8-byte float value, without metadata), and \\( T_{retention} = 2{,}592{,}000 \\) seconds (30 days): \\( S_{raw} = 1{,}000 \\times 1 \\times 16 \\times 2{,}592{,}000 = 41.47 \\) GB. With Gorilla compression ratio of 12x: \\( S_{compressed} = 41.47/12 \\approx 3.46 \\) GB per metric per 30 days. For 50 metrics per device: \\( 50 \\times 3.46 = 173 \\) GB total for 30 days across 1,000 devices at 1 Hz. In the simulation we simplify to: \\( S_{total\\_GB} = N \\times F \\times S_{point} \\times T_{days} \\times 86{,}400 / (1024^3) \\) — expressing retention in days rather than seconds.",
    explanation: [
      { term: "S_{total}", meaning: "Total raw storage required in bytes — before compression; actual storage is S_total divided by the compression ratio (typically 10-20x)" },
      { term: "N", meaning: "Number of data sources — devices, interfaces, or individual metrics (the most granular level)" },
      { term: "F", meaning: "Sampling frequency in samples per second — determines time resolution" },
      { term: "S_{point}", meaning: "Storage size per data point in bytes — typically 16 bytes (8-byte timestamp + 8-byte value) for TSDB columnar storage" },
      { term: "T_{retention}", meaning: "Retention period in seconds — drives the total data volume and determines when downsampling policies trigger" }
    ],
    advantages: [
      "Enables accurate storage sizing for infrastructure procurement before deployment — critical for cloud cost budgeting (S3/GCS egress and storage fees)",
      "Guides downsampling policy design: if 90-day raw retention is unaffordable, calculate the break-even point where 7-day raw + 90-day 1-minute averages fits within budget",
      "Supports capacity management alerts: when current usage reaches 80% of S_total, automatically trigger retention policy adjustments or storage expansion"
    ],
    limitations: [
      "S_point of 16 bytes is a minimum — real TSDB storage includes label metadata, index structures, and block headers that can double or triple actual storage per point",
      "Compression ratio varies significantly with data characteristics: monotonically increasing counters compress 20x; random jitter metrics may only compress 5x",
      "Does not account for log and trace storage, which can dwarf metrics storage in verbose systems — a complete observability storage plan must include all three pillars"
    ],
    simulation: {
      description: "Adjust the number of devices and retention period to calculate raw storage requirements. The simulation assumes 1 Hz sampling, 16 bytes per data point, and a 12x compression ratio to show both raw and compressed storage estimates.",
      parameters: [
        { id: "devices", name: "Number of Devices", min: 10, max: 2000, default: 100, step: 10, unit: "" },
        { id: "retention_days", name: "Retention Period (days)", min: 1, max: 365, default: 30, step: 1, unit: " days" }
      ],
      generateData: (params: Record<string, number>): Array<{ x: number; y: number }> => {
        const devices = params.devices || 100;
        const retention_days = params.retention_days || 30;
        const F = 1;
        const S_point = 16;
        const compression = 12;
        const pts: Array<{ x: number; y: number }> = [];
        for (let x = 10; x <= devices; x += 10) {
          const raw_bytes = x * F * S_point * retention_days * 86400;
          const compressed_gb = raw_bytes / compression / Math.pow(1024, 3);
          pts.push({ x, y: parseFloat(compressed_gb.toFixed(3)) });
        }
        return pts;
      },
      labels: { x: "Number of Devices", y: "Compressed Storage (GB)" }
    }
  },
  activities: {
    level1: "Compare the three storage backends in the observability data lake: time-series database (Prometheus/InfluxDB), log store (Elasticsearch/Loki), and trace store (Jaeger/Tempo). For each: (a) data type optimised for, (b) write model (push/pull/stream), (c) query language used, (d) compression technique, (e) typical retention window, and (f) one example query that the backend uniquely handles well.",
    level2: "Design a data collection pipeline for a 200-device enterprise network. Define: (a) which collection protocol (gNMI, NetFlow, syslog) feeds each storage backend, (b) how Apache Kafka is used as a buffer between collectors and storage, (c) what downsampling policy (raw resolution and duration, downsampled resolution and duration) minimises cost while preserving diagnostic capability, (d) what the total storage capacity requirement is using S_total = N × F × S_point × T_retention.",
    level3: "Calculate S_total for: N=2000 interfaces, F=1 sample/second, S_point=16 bytes, T_retention=90 days. Then calculate: (a) raw storage in GB, (b) compressed storage at 15x ratio, (c) how much is saved by downsampling after 7 days to 60-second resolution.",
    level4: "Deploy a complete observability data pipeline using Docker: gnmic (gNMI collector) → Kafka → Prometheus remote write adapter → VictoriaMetrics. Generate synthetic gNMI telemetry from a Python simulator for 50 interfaces at 1 Hz. Measure: (a) actual bytes written to VictoriaMetrics per second, (b) compression ratio achieved vs theoretical S_point=16 bytes, (c) query latency for a 24-hour range query across all 50 interfaces."
  },
  projects: {
    scope: "Design and deploy a multi-tier observability data lake for a 500-device simulated network, implementing differentiated retention policies and demonstrating efficient storage of all three observability pillars.",
    objectives: [
      "Deploy VictoriaMetrics cluster (for metrics), Elasticsearch cluster (for logs), and Jaeger with Cassandra (for traces) with appropriate resource allocation based on S_total calculations",
      "Implement a tiered retention policy: 1-second resolution for 7 days, 1-minute averages for 90 days, 1-hour averages for 2 years — using VictoriaMetrics downsampling rules",
      "Configure Apache Kafka as the central data bus receiving telemetry from all collection sources (gNMI via Telegraf, syslog via Fluent Bit, traces via OTel Collector) with appropriate topic partitioning for scalability",
      "Benchmark actual storage consumption against theoretical S_total calculation and measure compression ratios for real network counter data"
    ],
    deliverables: [
      "Infrastructure-as-Code (Docker Compose or Terraform) for the complete data lake: VictoriaMetrics + Elasticsearch + Jaeger + Kafka + collectors",
      "Retention policy configuration files with documented trade-off analysis between storage cost and diagnostic resolution",
      "Storage benchmark report: measured vs theoretical consumption, achieved compression ratios, query latency for common operational queries",
      "Data flow architecture diagram showing the complete path from telemetry source through Kafka through storage to Grafana query for each of the three observability pillars"
    ]
  },
  questions: [
    {
      q: "Why are time-series databases better suited for observability metrics than relational (SQL) databases?",
      a: "Relational databases store data in rows with arbitrary schema and use B-tree indexes optimised for point lookups and joins — not for time-range scans of millions of numerical values. For a time-range query ('get CPU utilisation for all 1,000 devices between 14:00 and 14:05') a relational DB must scan or index-seek individual rows, decompress general-purpose storage, and aggregate on-the-fly — taking minutes for large datasets. Time-series databases are designed for exactly this access pattern: data is stored in time-partitioned columnar blocks where all values for a metric are stored sequentially by time, enabling vectorised reads with SIMD instructions. Gorilla compression exploits the temporal locality of metrics (adjacent samples have similar values) for 10-20x compression vs generic algorithms. Prometheus's TSDB partitions data into 2-hour blocks that are individually compressible and queryable, with a head block in memory for recent data. For the same 30-day, 1,000-device query, a TSDB returns in under 1 second. Additionally, TSDBs natively handle the write pattern of observability (millions of small writes per second from thousands of sources simultaneously) without locking, using append-only write-ahead logs that relational DBs cannot match at this throughput.",
      type: "Analytical"
    },
    {
      q: "What is downsampling in observability storage, and why is it necessary for long-term data retention?",
      a: "Downsampling is the process of reducing the resolution of historical data by computing aggregate statistics (mean, max, min, count, percentile) over a time window and storing the aggregate instead of individual raw samples. Example: after 24 hours, replace 86,400 individual 1-second samples with 1,440 1-minute averages — reducing storage by 60x for that time period. After 7 days, replace 1-minute averages with 5-minute averages (another 5x reduction). It is necessary because raw high-resolution data is exponentially expensive to retain: 1,000 devices × 1 Hz × 16 bytes × 1 year = 500 GB of raw data, compressed to ~40 GB but still requiring significant storage for time ranges rarely queried. Downsampling preserves the trend visibility needed for capacity planning (1-hour averages over 2 years are sufficient) while discarding the sub-second precision needed only during active incident investigations (which occur in the recent past, where raw data is retained). The typical production policy: raw (1s) for 48 hours, 1-minute averages for 30 days, 5-minute averages for 1 year, 1-hour averages permanently. This is configured in VictoriaMetrics via downsampling rules and in InfluxDB via Continuous Queries or Tasks.",
      type: "Conceptual"
    },
    {
      q: "Calculate S_total for N=500 devices, F=1 Hz, S_point=16 bytes, T_retention=30 days. Show raw and compressed values.",
      a: "T_retention in seconds = 30 × 86,400 = 2,592,000 seconds. S_total raw = N × F × S_point × T_retention = 500 × 1 × 16 × 2,592,000 = 20,736,000,000 bytes = 20,736,000,000 / 1,073,741,824 ≈ 19.3 GB raw per metric. For 50 metrics per device: 50 × 19.3 = 965 GB raw. With 12x compression: 965 / 12 ≈ 80.4 GB compressed for 500 devices × 50 metrics × 30 days. This is the practical storage requirement for the metrics backend. Log storage for 500 devices at typical syslog verbosity adds another 20-50 GB/day (highly variable). Trace storage depends on sampling rate and service complexity.",
      type: "Numerical"
    },
    {
      q: "What role does Apache Kafka play in a production observability data pipeline and why is it preferred over direct-to-storage architectures?",
      a: "Apache Kafka is a distributed, durable, high-throughput message queue that acts as the central data bus in an observability pipeline. In a direct-to-storage architecture (collector writes directly to TSDB/Elasticsearch), any storage backend degradation (slow write, compaction, disk I/O saturation) propagates back to the telemetry collector — causing telemetry drops or backpressure that affects all producers simultaneously. Kafka decouples producers (telemetry collectors) from consumers (storage backends): producers write to Kafka topics at full speed; consumers read from topics at their own pace; if a consumer is temporarily unavailable, data is retained in Kafka (configurable retention, typically 24-72 hours) and consumed when the backend recovers — zero data loss. Multiple consumers can independently read the same Kafka topic simultaneously: a storage backend writes to VictoriaMetrics, a real-time analytics engine (Flink or ksqlDB) processes for anomaly detection, and a data replay tool keeps a hot cache for the last 30 minutes — all from the same telemetry stream without any coordination. Kafka's partition model enables horizontal scaling: a 1-Gbps telemetry stream is partitioned across 20 topics with 10 partitions each, consumed in parallel by 200 storage writer instances. For a 1,000-device network at 10 Hz, Kafka absorbs 40 MB/s of telemetry with zero data loss even during storage backend maintenance windows.",
      type: "Analytical"
    },
    {
      q: "How does Grafana Loki differ from Elasticsearch for log storage, and when would you choose each?",
      a: "Elasticsearch indexes every field in every log entry into an inverted index at write time — this makes any-field full-text search extremely fast (sub-second across billions of logs) but requires significant CPU, memory, and disk for index maintenance. Elasticsearch stores the full index on disk alongside the raw log data, typically tripling storage requirements. Loki (Grafana Labs) takes a fundamentally different approach: it stores logs as raw compressed streams indexed only by labels (device_name, log_level, facility) — not by log content. Queries specify labels to retrieve the relevant log stream and then apply regex or LogQL expressions to filter content. Loki is significantly cheaper (no content indexing, much lower storage), operationally simpler (no index sharding complexity), and integrates natively with Prometheus label schemes. However, Loki's content search is slower (grep-like scan of the compressed stream) and ad-hoc queries across all logs without known labels are expensive. Choose Elasticsearch when: you need full-text search across any field in milliseconds, compliance requires rich log analytics, the budget supports the infrastructure. Choose Loki when: logs are always queried by known label dimensions (device, service, severity), cost and operational simplicity are priorities, and the team is already using Prometheus + Grafana (Loki integrates natively into the same Grafana instance).",
      type: "Analytical"
    }
  ],
  virtualLab: {
    description: "Calculate compressed storage requirements for your observability data lake. Adjust the number of devices and retention period to see how storage scales. The model assumes 1 Hz sampling, 16 bytes per data point, and 12x Gorilla compression — typical for network interface counter telemetry.",
    interpretation: "Storage grows linearly with both device count and retention period. For a 100-device network at 1 Hz, 30-day retention requires less than 1 GB compressed — very manageable. But at 2,000 devices with 365-day retention, the compressed requirement approaches 80 GB, requiring capacity planning for the storage backend. Note that this covers only single-metric storage — a real deployment with 50 metrics per device multiplies this by 50. The practical takeaway is that downsampling (reducing retention at full resolution) is the most cost-effective strategy for large networks: keeping 7 days at 1 Hz and 365 days at 1-minute resolution reduces storage by 10-15x compared to full-resolution long-term retention.",
    parameters: [
      { id: "devices", name: "Number of Devices", min: 10, max: 2000, default: 100, step: 10, unit: "" },
      { id: "retention_days", name: "Retention Period (days)", min: 1, max: 365, default: 30, step: 1, unit: " days" }
    ],
    generateData: (params: Record<string, number>): Array<{ x: number; y: number }> => {
      const devices = params.devices || 100;
      const retention_days = params.retention_days || 30;
      const F = 1;
      const S_point = 16;
      const compression = 12;
      const pts: Array<{ x: number; y: number }> = [];
      for (let x = 10; x <= devices; x += 10) {
        const raw_bytes = x * F * S_point * retention_days * 86400;
        const compressed_gb = raw_bytes / compression / Math.pow(1024, 3);
        pts.push({ x, y: parseFloat(compressed_gb.toFixed(3)) });
      }
      return pts;
    },
    labels: { x: "Number of Devices", y: "Compressed Storage (GB)" }
  }
};
