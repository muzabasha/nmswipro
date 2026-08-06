import type { TopicData } from './types';

export const topic38Data: TopicData = {
  id: "u4t6",
  title: "Techniques and Tools of Network Observability",
  moduleName: "Unit IV: SDN, Network Observability, and Advanced Network Management",
  context: {
    prerequisites: [
      "Importance of Network Observability for Business",
      "Network Observability vs Network Monitoring"
    ],
    dependentTopics: ["Data Collection and Storage for Network Observability"],
    nextSteps: "Study Data Collection and Storage for Network Observability to understand how the data produced by these five techniques is stored efficiently at scale in time-series databases, log stores, and trace backends.",
    rfcReferences: [
      { name: "gRPC Network Management (gNMI)", relevance: "Streaming telemetry protocol — high-frequency push of interface counters, BGP state, and queue depths from network devices at 1-second intervals." },
      { rfc: "RFC 7011", title: "IPFIX Specification", summary: "IP Flow Information Export protocol — standard for exporting flow telemetry data for traffic characterization, bandwidth accounting, and network analysis.", url: "https://www.rfc-editor.org/rfc/rfc7011" },
      { rfc: "RFC 3954", title: "Cisco NetFlow Version 9", summary: "NetFlow services export format — the most widely deployed flow telemetry protocol for network traffic monitoring and capacity planning.", url: "https://www.rfc-editor.org/rfc/rfc3954" },
      { name: "sFlow (RFC 3176)", relevance: "Sampled flow monitoring protocol — 1:N packet sampling for network traffic characterisation with minimal overhead on high-speed interfaces." },
      { name: "eBPF Documentation", relevance: "Extended Berkeley Packet Filter — kernel-level instrumentation for packet capture, latency tracing, and network observability without application modification." },
      { name: "OpenTelemetry Protocol (OTLP)", relevance: "Unified standard for collecting metrics, logs, and distributed traces — enables vendor-agnostic observability data ingestion and processing." }
    ]
  },
  storytelling: {
    analogy: "A Scientist's Laboratory Instrument Suite",
    story: "No single scientific instrument can characterise a material completely — you need a mass spectrometer for chemical composition, an electron microscope for surface structure, a spectrometer for optical properties, and a calorimeter for thermal behaviour. Each instrument provides a different view of the same material. Network observability follows the same principle — no single technique can provide complete network visibility. Streaming telemetry via gNMI/gRPC is the high-frequency sensor array: instead of waiting for the NMS to poll (SNMP pull model), devices push interface counters, BGP state, queue depths, and hardware health to collectors at 1-second intervals, continuously and reliably over persistent gRPC streams. No polling overhead, no missed samples, no race conditions between poll and device state change. EBPF (Extended Berkeley Packet Filter) is the analytical chemistry of networking — it instruments the Linux kernel itself with tiny programs that run at packet processing time, capturing per-packet metadata (timestamps, TCP flags, syscall latency, socket buffers) without modifying applications or adding agent overhead. Distributed tracing (OpenTelemetry, Jaeger, Zipkin) is the radioactive tracer technique in biology — a unique trace ID is injected into each request at the entry point, propagated across every service it touches, and when collected by the backend, reveals the complete anatomy of the request's journey: which service was slow, which returned an error, where retries occurred. Log aggregation (ELK Stack — Elasticsearch, Logstash, Kibana; Splunk; Grafana Loki) is the laboratory notebook — every significant event from every network element (BGP state changes, interface flaps, authentication failures, configuration changes) is sent to a centralised, searchable repository with structured fields. Flow telemetry (NetFlow v9/IPFIX from Cisco/Juniper; sFlow from Broadcom switches) samples 1 in N packets and captures their 5-tuple headers (src IP, dst IP, src port, dst port, protocol), providing traffic characterisation data — which applications are running, which clients are heaviest users, which servers are most accessed — without capturing full payloads. Together, these five techniques cover all three observability pillars: metrics (streaming telemetry, sFlow statistics), logs (log aggregation, EBPF audit events), and traces (distributed tracing, EBPF packet traces).",
    reflectiveQuestions: [
      "EBPF requires Linux kernel access on network function hosts. What are the security implications of deploying EBPF probes in a multi-tenant network environment, and how are they mitigated?",
      "Streaming telemetry (gNMI) pushes data continuously from all devices. How does this change the capacity planning for the observability collection infrastructure compared to SNMP polling?",
      "NetFlow samples 1 in 1000 packets by default. What classes of network events would be missed or distorted by this sampling, and when would full capture be required instead?"
    ],
    technicalConnection: "**gNMI (gRPC Network Management Interface)**: gRPC service NetworkManagement { rpc Subscribe(SubscribeRequest) returns (stream SubscribeResponse); }. SubscribeRequest: {subscription_list: {subscription: [{path: {elem: [{name:'interfaces'}, {name:'interface', key:{name:'GigE0/1'}}, {name:'state'}, {name:'counters'}, {name:'in-octets'}]}, mode: SAMPLE, sample_interval: 1000000000 (1s in nanoseconds)}]}, encoding: JSON_IETF}. SubscribeResponse stream: {update: {timestamp: 1642003200000000000 (nanoseconds), prefix: {elem: [{name:'interfaces'}]}, update: [{path: {elem: [{name:'interface', key:{name:'GigE0/1'}}, {name:'state'}, {name:'counters'}, {name:'in-octets'}]}, val: {uint_val: 1524879632}}]}}. **RFC 7011 IPFIX**: Message format - Message Header (version=10, length, export_time, sequence_number, observation_domain_id), Set (Template Set / Data Set). Template Record: template_id, field_count, field_specifiers (sourceIPv4Address IE=8 length=4, destinationIPv4Address IE=12 length=4, octetDeltaCount IE=1 length=8). Data Record: values matching template fields. Export every flow on timeout (active=300s, inactive=15s) or TCP FIN/RST. **RFC 3954 NetFlow v9**: Template FlowSet (FlowSet ID=0): {template_id=256, field_count=10, fields: [IN_BYTES, IN_PKTS, PROTOCOL, SRC_ADDR, DST_ADDR, SRC_PORT, DST_PORT, INPUT_SNMP, OUTPUT_SNMP, TCP_FLAGS]}. Data FlowSet (FlowSet ID=256): records matching template. **sFlow (RFC 3176)**: Sampled packet header (1:N sampling, typically N=512 or 1000). sFlow Datagram: {agent_address, sub_agent_id, sequence_number, uptime, samples: [{sample_type: FLOW_SAMPLE, sampling_rate: 512, sample_pool: 51200 (packets seen), drops: 0, input_port: 1, output_port: 2, protocol_header: <Ethernet+IP+TCP headers>}]}. Real-time (no flow cache). **eBPF bpftrace Syntax**: bpftrace -e 'tracepoint:net:netif_receive_skb { @bytes = hist(args->len); }' - histogram of packet sizes. kprobe:tcp_retransmit_skb { @retrans[comm] = count(); } - count TCP retransmissions per process. **OpenTelemetry Collector Pipeline**: receivers (otlp, prometheus, jaeger) → processors (batch, memory_limiter, attributes) → exporters (otlp, prometheus, jaeger, loki). Example config: receivers: otlp: {protocols: {grpc: {endpoint: 0.0.0.0:4317}}}. processors: batch: {timeout: 10s, send_batch_size: 1024}. exporters: prometheus: {endpoint: 0.0.0.0:8889}. **Telemetry Volume Formula**: V_tel = N × F × S_sample (bytes/second). Daily storage: V_day = V_tel × 86400. Compression ratio: Gorilla algorithm (Prometheus/VictoriaMetrics) achieves 10-20x. Effective storage: V_day / compression_ratio. **Log Aggregation with Fluent Bit**: Input: [INPUT] Name=tail, Path=/var/log/syslog, Parser=syslog-rfc5424. Filter: [FILTER] Name=grep, Match=*, Regex=message BGP. Output: [OUTPUT] Name=loki, Match=*, Host=loki, Port=3100, Labels={job='syslog',host='router-1'}."
  },
  mathModelling: {
    need: "To estimate the total data volume generated by streaming telemetry for capacity planning of the observability collection and storage infrastructure. Underestimating this leads to dropped telemetry, creating blind spots in the observability pipeline.",
    equation: "V_{tel} = N \\times F \\times S_{sample}",
    technicalDetails: "Streaming telemetry data volume is determined by: \\( N \\) — the number of telemetry sources (devices or interfaces), \\( F \\) — the sampling frequency in samples per second, and \\( S_{sample} \\) — the size of each telemetry sample in bytes. For a network with \\( N = 500 \\) devices, each reporting \\( F = 1 \\) sample per second, with each sample containing 50 counters × 8 bytes = 400 bytes of YANG-modelled data: \\( V_{tel} = 500 \\times 1 \\times 400 = 200{,}000 \\) bytes/second = 1.6 Mbps telemetry throughput. For higher-frequency telemetry (\\( F = 10 \\) samples/second for critical interfaces): \\( V_{tel} = 500 \\times 10 \\times 400 = 2{,}000{,}000 \\) bytes/second = 16 Mbps. Over 24 hours: \\( V_{day} = 200{,}000 \\times 86{,}400 = 17.28 \\) GB/day (at 1 Hz). The storage requirement for 90 days retention before downsampling: \\( 17.28 \\times 90 = 1{,}555 \\) GB \\approx 1.5 TB raw (before compression). Time-series databases compress telemetry data by 10-20x through delta encoding and Gorilla compression, reducing actual storage to 75-150 GB.",
    explanation: [
      { term: "V_{tel}", meaning: "Total telemetry data volume in bytes per second — the throughput the collection infrastructure must handle" },
      { term: "N", meaning: "Number of telemetry sources (devices, interfaces, or processes) generating streaming data" },
      { term: "F", meaning: "Sampling frequency in samples per second per source — higher F gives finer time resolution but increases volume proportionally" },
      { term: "S_{sample}", meaning: "Size of each telemetry sample in bytes — determined by the number of counters and YANG schema complexity" }
    ],
    advantages: [
      "Enables infrastructure right-sizing for observability collectors, message queues (Kafka), and storage backends before deployment",
      "Guides frequency tuning decisions: critical interfaces at 1s, access switches at 30s, historical archiving at 5m — optimising the cost-resolution trade-off",
      "Supports budget planning: storage cost = V_tel × retention_days × compression_ratio × $/GB"
    ],
    limitations: [
      "S_sample varies significantly by device vendor and YANG model — actual message sizes must be profiled from real device telemetry, not estimated",
      "Does not account for bursty telemetry — during a network event, all devices may simultaneously push state-change notifications, creating 10-100x peak volume spikes",
      "Ignores protocol overhead: gRPC/HTTP2 framing and TLS encryption add 10-20% overhead not captured in S_sample alone"
    ],
    simulation: {
      description: "Adjust the number of devices and telemetry frequency to see total data volume. This helps plan the collection infrastructure capacity needed for a real network deployment.",
      parameters: [
        { id: "devices", name: "Number of Devices", min: 10, max: 1000, default: 100, step: 10, unit: "" },
        { id: "frequency", name: "Sample Frequency (Hz)", min: 1, max: 60, default: 1, step: 1, unit: " Hz" }
      ],
      generateData: (params: Record<string, number>): Array<{ x: number; y: number }> => {
        const devices = params.devices || 100;
        const frequency = params.frequency || 1;
        const sample_size = 400;
        const pts: Array<{ x: number; y: number }> = [];
        for (let x = 10; x <= devices; x += 10) {
          const volume_bps = (x * frequency * sample_size * 8) / 1000;
          pts.push({ x, y: parseFloat(volume_bps.toFixed(1)) });
        }
        return pts;
      },
      labels: { x: "Number of Devices", y: "Telemetry Volume (kbps)" }
    }
  },
  activities: {
    level1: "Create a reference table of the five network observability techniques covered in this topic: streaming telemetry (gNMI), EBPF, distributed tracing, log aggregation, and flow telemetry. For each technique, document: protocol/technology used, data type produced (metric/log/trace), collection model (push/pull/passive), primary tool examples, and typical use case in network operations.",
    level2: "Trace the journey of a network observability event through all five techniques simultaneously: a customer's VoIP call degrades at 14:32:05. Describe what each of the five techniques captures about this event: (a) what counter changes does streaming telemetry detect, (b) what would EBPF capture at the packet level, (c) what would distributed tracing show about the SIP signalling path, (d) what log entries would be generated, (e) what NetFlow records would characterise the RTP stream.",
    level3: "Calculate V_tel in Mbps and daily storage in GB for: N=800 devices, F=2 Hz (2 samples/second), S_sample=600 bytes. Then calculate 30-day raw storage and compressed storage (assuming 15x compression ratio). Show all working.",
    level4: "Deploy an EBPF observability probe using bpftrace or the BCC toolkit on a Linux system to trace TCP retransmissions on a specific interface. Capture 5 minutes of trace data during an iperf3 session with simulated packet loss (tc netem). Correlate the EBPF TCP retransmission events with: (a) Prometheus network interface error counters, (b) iperf3 throughput degradation, (c) application-layer latency increase. Document how the three pillars together explain the observed behaviour."
  },
  projects: {
    scope: "Build a complete multi-technique observability pipeline for a 10-device simulated network, integrating streaming telemetry, flow telemetry, and log aggregation into a unified Grafana dashboard.",
    objectives: [
      "Configure gNMI streaming telemetry from 10 Cisco IOS-XE or Arista EOS devices (or emulated via gnmic simulator) to a Prometheus-compatible collector (gnmic, Telegraf)",
      "Deploy an sFlow/NetFlow collector (nfdump, ntopng, or Grafana Flowlog) to collect and visualise per-application, per-source traffic breakdown",
      "Aggregate structured logs from all 10 devices using Fluent Bit → Loki pipeline with parsing of BGP, OSPF, and interface state change events",
      "Build a unified Grafana dashboard correlating streaming telemetry counters, flow-based application breakdown, and log events on a shared timeline for root-cause investigation"
    ],
    deliverables: [
      "Docker Compose file for the complete observability pipeline: gnmic/Telegraf + Prometheus + sFlow collector + Loki + Grafana",
      "gNMI subscription configuration files for interface counters, BGP state, and CPU/memory at 10s intervals",
      "Grafana dashboard JSON export with panels for: interface utilisation heat map, top-N application bandwidth breakdown, BGP/OSPF event timeline, and combined incident investigation view",
      "Performance analysis: V_tel calculation for the deployed configuration vs theoretical model, and storage forecast for 90-day retention"
    ]
  },
  questions: [
    {
      q: "How does gNMI streaming telemetry differ from SNMP polling, and what operational advantages does it provide?",
      a: "SNMP polling uses a pull model: the NMS sends a GET request to each device on a configurable interval (typically 5-15 minutes), the device responds with current values, and the NMS records the sample. Three fundamental problems: first, the polling interval creates temporal blind spots — a 10-second burst of congestion that resolves before the 5-minute poll completes is completely invisible. Second, as the device count grows, the NMS must serially poll thousands of devices, creating a polling window where early-polled devices have data 10 minutes older than late-polled devices — a consistency problem. Third, SNMP pull puts CPU load on managed devices proportional to query frequency. gNMI streaming telemetry uses a push model: the device establishes a persistent gRPC/TLS stream to the collector and pushes telemetry samples at the configured interval — 1 second is common for critical interfaces. Advantages: sub-second resolution for detecting transient events; consistent simultaneous sampling across all devices; device-generated pushing distributes load more efficiently; structured YANG-modelled data with precise schema (no MIB ambiguities); reliable delivery via gRPC (TCP-based, no UDP drops); and the device decides when state changes warrant out-of-band notifications (ON_CHANGE subscription mode), which is far more efficient than polling.",
      type: "Conceptual"
    },
    {
      q: "What is EBPF and what makes it a powerful observability instrument for network functions running on Linux?",
      a: "EBPF (Extended Berkeley Packet Filter) allows small, verified programs to be loaded into the Linux kernel at runtime, attaching to kernel tracepoints, kprobes, XDP (eXpress Data Path), and socket filters. These programs execute in response to kernel events — packet arrival, system call, TCP state change, memory allocation — and can read kernel data structures, compute statistics, and write results to user-space maps, all without modifying applications or kernel source code. For network observability, EBPF enables: per-packet timestamping with nanosecond precision to measure kernel processing latency for individual flows; TCP retransmission tracking with flow-level granularity (not just interface-level counters); HTTP/gRPC request tracing at the kernel level without modifying applications (userspace probes can trace function calls in Go, Python, Java processes); and XDP-based packet sampling at line rate with zero kernel bypass overhead. EBPF programs are verified by the kernel verifier (termination proof, memory bounds, no dangerous operations) before loading, making them safe for production use. Cilium uses EBPF to implement Kubernetes network policies and service mesh observability without any per-pod sidecar proxy — dramatically reducing overhead compared to Istio with Envoy sidecars.",
      type: "Conceptual"
    },
    {
      q: "Calculate V_tel for N=500 devices, F=5 Hz, S_sample=350 bytes. Express in Mbps and GB/day.",
      a: "V_tel = N × F × S_sample = 500 × 5 × 350 = 875,000 bytes/second. In Mbps: 875,000 × 8 / 1,000,000 = 7 Mbps. In GB/day: 875,000 bytes/s × 86,400 s/day = 75,600,000,000 bytes/day = 75,600,000,000 / 1,073,741,824 ≈ 70.4 GB/day raw. With 15x compression ratio (Gorilla + delta encoding): effective storage = 70.4 / 15 ≈ 4.7 GB/day. For 90-day retention with downsampling (raw for 7 days, 10s resolution for 90 days): raw 7 days = 7 × 70.4 = 492.8 GB; downsampled 90 days ≈ 90 × 4.7 = 423 GB compressed. Total ≈ 916 GB ≈ 1 TB storage.",
      type: "Numerical"
    },
    {
      q: "What is distributed tracing and how does W3C TraceContext enable it across multi-vendor network services?",
      a: "Distributed tracing records the complete path of a single request through multiple services, capturing each service's processing time (a 'span') and causal relationships between spans. A trace is a directed acyclic graph of spans from the initial entry point through all downstream services back to the response. Without distributed tracing, debugging a slow microservice request requires correlating logs from multiple services by timestamp — an imprecise and time-consuming process. W3C TraceContext (RFC 7540-compliant header propagation) standardises how trace IDs are carried in HTTP requests: the 'traceparent' header carries a 16-byte trace ID and 8-byte span ID, ensuring that any service that speaks HTTP and reads/writes TraceContext headers automatically participates in the trace without vendor-specific instrumentation. For network management, this means: when a service orchestration request (ONAP SO → NFVO → VIM) generates a trace, the trace follows the request through all three components even if they use different languages and frameworks. The complete orchestration latency breakdown — 50ms in SO, 200ms in NFVO, 1200ms in VIM — is immediately visible in Jaeger without any custom log correlation. OpenTelemetry provides SDK and automatic instrumentation agents for all major languages that inject TraceContext headers transparently.",
      type: "Conceptual"
    },
    {
      q: "Compare NetFlow/IPFIX and sFlow — when would you choose each for flow telemetry?",
      a: "NetFlow (Cisco proprietary, RFC 3954) and IPFIX (IETF standard, RFC 7011 — effectively NetFlow v10) use flow-based export: the router/switch maintains a flow cache, accumulates all packets belonging to the same 5-tuple (src/dst IP, src/dst port, protocol) until the flow expires (TCP FIN/RST or timeout), then exports the aggregated flow record (total bytes, packets, start/end time, ToS, TCP flags) to a collector. This gives exact byte counts per flow but introduces cache memory overhead on the device (limited to ~100,000 concurrent flows on most platforms) and export latency (flows are exported on expiry, not in real time). sFlow (RFC 3176) uses random packet sampling: 1 in N packets (typically N=1000 or N=512) is captured at line rate and immediately forwarded as a raw packet sample to the collector — no flow state on the device. sFlow has zero flow cache memory requirement (critical for high-speed interfaces), works on any vendor's hardware, and produces data in real time. Choose NetFlow/IPFIX when: you need exact byte counts for billing or SLA reporting, flow-level visibility is required, and device memory is adequate. Choose sFlow when: the network has 40G/100G interfaces where maintaining flow caches is impractical, vendor-neutral sampling is required across a multi-vendor network, or real-time traffic visibility is more important than exact byte counts.",
      type: "Analytical"
    }
  ],
  virtualLab: {
    description: "You are designing a gNMI streaming telemetry pipeline and need to size the Kafka infrastructure. Your task: calculate the total telemetry bandwidth based on device count and sampling frequency. Each sample is 400 bytes (typical for 50 interface counters). Adjust the device count and sampling frequency. The chart shows bandwidth in kbps — find the configuration where volume stays under 10 Mbps (a single Kafka topic's comfortable limit) vs when you need distributed collectors.",
    interpretation: "At 1 Hz, 100 devices produce ~320 kbps — a single Kafka topic handles this easily. At 60 Hz with 1,000 devices, volume exceeds 100 Mbps — requiring distributed collectors, multiple Kafka partitions, and careful retention policies. The practical design: use 10-30 Hz for critical core/peering links and 1-5 Hz for access interfaces. This mixed-frequency model balances resolution against infrastructure cost. Use this lab to determine your telemetry infrastructure budget.",
    parameters: [
      { id: "devices", name: "Number of Devices", min: 10, max: 1000, default: 100, step: 10, unit: "" },
      { id: "frequency", name: "Sample Frequency (Hz)", min: 1, max: 60, default: 1, step: 1, unit: " Hz" }
    ],
    generateData: (params: Record<string, number>): Array<{ x: number; y: number }> => {
      const devices = params.devices || 100;
      const frequency = params.frequency || 1;
      const sample_size = 400;
      const pts: Array<{ x: number; y: number }> = [];
      for (let x = 10; x <= devices; x += 10) {
        const volume_kbps = (x * frequency * sample_size * 8) / 1000;
        pts.push({ x, y: parseFloat(volume_kbps.toFixed(1)) });
      }
      return pts;
    },
    labels: { x: "Number of Devices", y: "Telemetry Volume (kbps)" }
  }
};
