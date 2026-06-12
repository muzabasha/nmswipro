import type { TopicData } from './types';

export const topic28Data: TopicData = {
  id: "u3t6",
  title: "NMS FM NBI Flow",
  moduleName: "Unit III: Alarm Lifecycle Management",
  context: {
    prerequisites: ["NMS NBI Interface", "Alarm Management"],
    dependentTopics: ["REST API Concept"],
    nextSteps: "Study REST API Concept to understand the underlying API architecture that carries the FM NBI flow data between the NMS and OSS systems.",
    rfcReferences: [
      { rfc: "RFC 5277", title: "NETCONF Event Notifications", summary: "Defines notification streaming from NE to EMS/NMS.", url: "https://www.rfc-editor.org/rfc/rfc5277" },
      { rfc: "RFC 8040", title: "RESTCONF Protocol", summary: "Event stream subscription for alarm notification delivery.", url: "https://www.rfc-editor.org/rfc/rfc8040" },
      { rfc: "TM Forum TMF642", title: "Alarm Management API", summary: "Defines FM NBI flow alarm payload schema and webhook delivery.", url: "https://www.tmforum.org/resources/specification/tmf642-alarm-management-api-rest-specification-r19-0-0/" },
      { rfc: "RFC 1215", title: "Convention for Defining Traps", summary: "Defines trap PDU format for NE-to-EMS alarm notification.", url: "https://www.rfc-editor.org/rfc/rfc1215" },
      { rfc: "RFC 3416", title: "SNMPv2 Protocol Operations", summary: "INFORM PDU for reliable trap delivery with acknowledgment.", url: "https://www.rfc-editor.org/rfc/rfc3416" },
      { rfc: "AMQP 1.0 (ISO/IEC 19464)", title: "Advanced Message Queuing Protocol", summary: "Message bus for asynchronous NBI alarm streaming.", url: "https://www.iso.org/standard/64955.html" }
    ]
  },
  storytelling: {
    analogy: "An Emergency Alert Notification Pipeline",
    story: "The FM NBI Flow is an emergency alert notification pipeline — the automated chain of processes that moves a fault event from its moment of detection deep in the network all the way to the operator's screen, the ticketing system, and the customer notification system in under 30 seconds. Think of it like the pipeline that carries a 999 emergency call: the caller's phone detects a problem and transmits it; the telecommunications network routes it to the right emergency centre; the dispatcher receives and logs the call; the right responder (ambulance, fire, police) is dispatched; the incident management system records the event for audit. In networking, the equivalent pipeline works like this: A network element (NE) — a router, switch, or optical transponder — detects a hardware or software fault condition (card failure, link loss-of-signal, CPU overload, BGP hold-timer expiry). The NE generates an SNMP TRAP or a NETCONF notification encoding the fault details (alarm type, severity, affected object, timestamp). The EMS (Element Management System) receives the notification from the NE via its southbound interface, normalises it from vendor-specific format to a canonical alarm schema, and forwards it to the NMS via the NMS's southbound interface (SBI). The NMS Fault Management module receives the normalised alarm, runs it through the correlation and RCA pipeline, creates a correlated alarm record in the alarm database, and raises the correlated alarm event. The NMS FM NBI publishes the alarm event northbound via its REST API — either as a webhook POST to registered OSS callback URLs, or as a message published to a JMS/AMQP queue. The OSS (ServiceNow, Remedy, Jira) receives the alarm event, creates a trouble ticket, assigns it to the appropriate NOC team, and sends an SMS/email notification to the on-call engineer. Each hop in this pipeline adds latency. The FM NBI flow design optimises each stage to minimise the total end-to-end detection-to-action delay — the metric that determines how quickly a fault causes a degraded user experience versus how quickly it is repaired.",
    reflectiveQuestions: [
      "If the NETCONF notification transport (SSH/TCP) introduces higher latency than SNMP TRAP (UDP), when is NETCONF notification preferred despite the latency penalty?",
      "What happens to the FM NBI flow if the NMS is temporarily unavailable — how should the EMS buffer alarms to prevent data loss?",
      "How would you design the FM NBI flow to support SLA-based prioritisation — ensuring that alarms affecting high-priority enterprise customers are forwarded to the OSS faster than alarms affecting residential customers?"
    ],
    technicalConnection: "FM NBI Flow implementation stages: (1) NE → EMS: SNMP TRAPv2 over UDP port 162, or NETCONF <notification> over SSH port 830, or RESTCONF event stream over HTTPS. (2) EMS → NMS (SBI): proprietary vendor protocol (e.g., Ericsson OSS-J API, Nokia NPO REST), or standard TMF642 SBI, or SNMP re-trap. (3) NMS processing: alarm normalisation → correlation → RCA → alarm database write. (4) NMS → OSS (NBI): TMF642 REST webhook POST with alarm JSON payload, or AMQP/Kafka topic publish for high-volume streaming. (5) OSS → Ticketing: ServiceNow Event Management API, Jira Issue API, Remedy REST API. Latency budget allocation: NE trap generation < 1 s, EMS normalisation < 2 s, NMS correlation < 3 s, NBI delivery < 5 s. Total target: < 30 s end-to-end."
  },
  mathModelling: {
    need: "A tier-1 operator's NMS Fault Management (FM) system must deliver alarm notifications to four external consumers via its NBI: a BSS ticketing system, an AI ops platform, a dashboard, and a regulatory compliance logger. The FM NBI receives 500 alarms per minute during peak outage events. Each consumer has a different SLA: BSS ticketing < 30 seconds, AI platform < 5 seconds, dashboard < 2 seconds, compliance logger < 60 seconds. The NBI must serve all four consumers simultaneously without any consumer's SLA violation affecting others.",
    equation: "DECISION CONSTRAINT: BSS < 30 s, AI platform < 5 s, dashboard < 2 s, compliance logger < 60 s. Must handle 500 alarms/minute burst. Consumer SLA violations must not cascade (one slow consumer must not block others). Must support at-least-once delivery to compliance logger (zero alarm loss). Decision: Synchronous push / Event queue per consumer / Publish-subscribe bus / Priority-tiered queue.",
    technicalDetails: "Synchronous Push: NMS pushes each alarm synchronously to all four consumers before processing the next alarm. Processing rate: limited by slowest consumer. If BSS ticketing takes 25 seconds to acknowledge, NMS is blocked for 25 seconds per alarm — cannot process 500/minute. Dashboard SLA (2 s) violated whenever BSS is slow. Event Queue per Consumer (isolated queues): Each consumer has its own alarm queue. NMS writes to all 4 queues in < 1 ms per alarm. Each consumer reads from its own queue at its own pace. Burst handling: queue absorbs the 500/minute peak — no consumer blocks another. Compliance logger queue is persistent (disk-backed, at-least-once delivery). Dashboard queue is in-memory (low latency). Publish-Subscribe Bus (Kafka — Recommended): NMS publishes alarms to a Kafka topic. Each consumer subscribes with its own consumer group. Dashboard consumer: Kafka consumer with 0 ms offset lag target — processes in real time (< 500 ms end-to-end). AI platform: consumer with < 1 s processing SLA. BSS and compliance: consumers with relaxed latency. Kafka provides: per-consumer offset management, replay (compliance logger can replay missed alarms), burst absorption. Priority-tiered Queue: Alarms prioritised by severity — P1 alarms delivered first to all consumers regardless of queue depth. Complexity: requires priority classification at ingest. Useful for BSS ticketing (only P1/P2 alarms generate tickets).",
    explanation: [
      { term: "Synchronous Push", meaning: "NMS blocks on each consumer acknowledgement. WHY REJECTED: Slowest consumer (BSS at 25 s) blocks all others — dashboard SLA (2 s) violated on every alarm when BSS is slow. Cannot process 500 alarms/minute when each alarm requires up to 25 seconds. WHEN ADOPTED: Acceptable for very low alarm rates (< 1 alarm/minute) and two consumers with similar latency requirements — e.g., lab NOC dashboards." },
      { term: "Per-Consumer Event Queue", meaning: "Each consumer has an isolated queue. NMS writes < 1 ms per alarm. Dashboard processes in < 2 s; BSS in < 30 s; compliance in < 60 s — all independently. WHY ADEQUATE: Meets all SLA constraints. Simpler to implement than Kafka. Limitation: no replay capability for compliance logger — if the compliance service restarts, missed alarms are lost from the in-memory queue. WHEN ADOPTED: Small deployments with 2–3 consumers and moderate alarm rates (< 100/minute)." },
      { term: "Publish-Subscribe Bus — Kafka (Recommended)", meaning: "NMS publishes to Kafka topic. Each consumer group independently reads at its own pace. Dashboard consumer: real-time (< 500 ms). AI platform: < 1 s. Compliance: persistent Kafka topic (retention 30 days) — at-least-once delivery, replay on restart. Burst: Kafka absorbs 500/minute peaks without backpressure to NMS. WHY BEST: Only option that provides at-least-once delivery to compliance logger and replay capability. Industry standard for large-scale NMS NBI: Nokia NSP, Ericsson OSS/EOI, and Huawei iMaster NCE all use Kafka for alarm distribution." },
      { term: "Priority-tiered Queue", meaning: "P1/P2 alarms prioritised ahead of P3/P4 in each consumer queue. Ensures BSS ticketing and dashboard receive critical alarms first during storms. WHY SUPPLEMENTARY: Addresses priority inversion (P3 storm blocking P1 delivery) but does not solve the fundamental synchronous blocking problem. WHEN ADOPTED: Added as a priority classification layer on top of the Kafka-based pub-sub architecture — P1 alarms go to a dedicated high-priority Kafka partition consumed first by dashboard and AI platform." }
    ],
    advantages: [
      "Kafka publish-subscribe isolates consumer SLAs completely — a BSS system taking 25 seconds to process an alarm does not delay the dashboard or AI platform by even 1 millisecond",
      "Persistent Kafka topic with 30-day retention provides at-least-once delivery to the compliance logger — alarms are never lost even if the compliance service is offline for days",
      "Consumer group offset management allows the AI platform to process alarms in real time while the compliance logger processes at its own pace — without any coordination between consumers"
    ],
    limitations: [
      "Per-consumer event queues are adopted for small-scale NMS deployments (< 100 alarms/minute, 2–3 consumers) where Kafka cluster operational overhead is not justified",
      "Synchronous push is adopted for lab/test environments where alarm volume is very low and all consumers are local services with < 100 ms response time",
      "Priority queuing is adopted as an additional layer within the Kafka architecture for environments with alarm storm scenarios — it does not replace the pub-sub architecture but enhances alarm delivery ordering"
    ]
  },
  activities: {
    level1: "Draw a block diagram of the FM NBI flow with all five stages: NE, EMS (SBI), NMS Fault Management, NMS NBI, and OSS Ticketing. For each stage, label: the protocol used (SNMP/NETCONF/REST), the direction of data flow (push vs pull), the data format (trap/JSON/XML), and the typical latency.",
    level2: "For a mobile network, describe how an LTE eNodeB hardware failure flows through the FM NBI pipeline. Specify: (a) what fault the eNB detects and what trap it sends, (b) how the EMS processes and normalises it, (c) how the NMS correlates it with alarms from adjacent cells, (d) what the NBI alarm JSON payload looks like (write a sample JSON object), and (e) how the OSS creates a P1 incident ticket.",
    level3: "An FM NBI flow has latencies: L_ne = 1.5 s, L_ems = 4 s, L_nms = 8 s, L_nbi = 2.5 s. Calculate: (a) L_e2e, (b) which stage is the bottleneck, (c) if NMS latency is halved by optimising the correlation rules, what is the new L_e2e and improvement percentage.",
    level4: "Design a high-availability FM NBI flow architecture that handles NMS unavailability. Specify: (a) how the EMS buffers alarms during NMS downtime (circular buffer vs persistent queue), (b) maximum buffer duration before alarms are dropped, (c) alarm replay protocol when NMS recovers, and (d) how the NBI guarantees at-least-once delivery to the OSS for Critical alarms."
  },
  projects: {
    scope: "Build an end-to-end FM NBI flow simulation with all four stages — NE alarm generator, EMS normaliser, NMS correlation engine, and OSS webhook receiver — and measure end-to-end latency for different alarm loads.",
    objectives: [
      "Implement a Python-based NE alarm generator that produces SNMP TRAP-equivalent event objects with configurable fault types and timestamps",
      "Implement an EMS normaliser that transforms vendor-specific alarm objects to a canonical schema and queues them for NMS processing",
      "Implement an NMS correlation engine and TMF642-compatible webhook dispatcher, measuring processing time at each stage; implement an OSS webhook receiver that logs receipt time"
    ],
    deliverables: [
      "Complete four-stage FM NBI flow simulator in Python with configurable alarm generation rate and fault injection scenarios",
      "Latency measurement report: mean and 95th-percentile latency per stage and end-to-end for alarm loads of 10, 50, and 200 events/minute",
      "Bottleneck analysis identifying the dominant latency stage under each load scenario and three specific optimisation recommendations"
    ]
  },
  questions: [
    {
      q: "Describe the complete FM NBI flow from fault detection at the network element to ticket creation in the OSS.",
      a: "The FM NBI flow proceeds in five stages: (1) NE Detection: the network element detects a fault condition (hardware failure, protocol timeout, threshold crossing) and generates an alarm notification. For SNMP, this is a TRAPv2c PDU sent over UDP to the EMS's trap receiver. For NETCONF, it is a <notification> message over an SSH subscription. (2) EMS Processing: the EMS receives the vendor-specific notification, translates it to a canonical alarm format (alarm type, severity, affected object, timestamp, additional text), and forwards it to the NMS via the SBI (southbound interface). (3) NMS Fault Management: the NMS receives the normalised alarm, enriches it with topology context from the CMDB, runs the correlation engine to group it with related alarms, runs the RCA engine to identify the root cause if it is a new independent fault, creates an alarm record in the alarm database, and raises the alarm event. (4) NMS NBI: the NMS publishes the alarm event northbound — either by POSTing a JSON payload to registered OSS webhook URLs (push), or by publishing to an AMQP/Kafka topic. (5) OSS Ticketing: the OSS receives the alarm event, evaluates SLA priority, creates a trouble ticket in the ITSM system (ServiceNow, Remedy), assigns it to the appropriate NOC queue, and triggers notifications (SMS, email, paging) to the on-call engineer.",
      type: "Conceptual"
    },
    {
      q: "Why is SNMP TRAP considered unreliable for fault notification and what mechanisms address this?",
      a: "SNMP TRAPs are sent over UDP, which provides no delivery guarantee — if the UDP datagram is lost due to network congestion, buffer overflow, or NMS overload, the trap is silently discarded and never retransmitted. The NE has no knowledge that the trap was not received. This is a critical limitation for fault management: a lost trap means a fault event is silently missing from the NMS alarm database. Mechanisms that address this: (1) SNMP INFORM: an enhancement to TRAP where the sender retains the message until it receives an acknowledgement (GetResponse PDU) from the receiver. If no acknowledgement arrives within a timeout, the sender retransmits up to a configurable retry count. This provides reliable delivery over UDP at the cost of additional processing and retransmission overhead. (2) NETCONF <notification> over TCP/SSH: TCP's reliable, ordered delivery ensures notification delivery without application-layer retry logic — the fault of the EMS disappearing causes a TCP connection reset, prompting the NE to reconnect and retransmit any missed notifications using event stream replay. (3) EMS-side alarm polling: EMS platforms complement trap reception with periodic SNMP polling to detect missed traps — if a device's alarm status changes between polls without a corresponding trap in the queue, the EMS generates the missed alarm from poll data.",
      type: "Analytical"
    },
    {
      q: "An FM NBI flow has: L_ne = 2 s, L_ems = 5 s, L_nms = 10 s, L_nbi = 3 s. Find L_e2e and the bottleneck stage. If NMS latency is reduced to 4 s, what is the new L_e2e?",
      a: "Original L_e2e = L_ne + L_ems + L_nms + L_nbi = 2 + 5 + 10 + 3 = 20 seconds. The bottleneck stage is NMS (L_nms = 10 s), contributing 50% of total latency. After NMS optimisation (L_nms = 4 s): New L_e2e = 2 + 5 + 4 + 3 = 14 seconds. Improvement = (20 − 14) / 20 × 100 = 30% reduction in end-to-end latency. The new bottleneck becomes EMS at 5 seconds. To further reduce L_e2e below 10 seconds, EMS processing must also be optimised — for example, by pre-normalising traps using lookup tables rather than dynamic parsing.",
      type: "Numerical"
    },
    {
      q: "How does the FM NBI flow change when the NMS must handle 500 alarms per minute during a major network storm?",
      a: "During an alarm storm (500+ alarms/minute), each stage of the FM NBI flow is stressed differently: NE stage: trap generation rate is hardware-accelerated and rarely the bottleneck, but if 500 traps/minute exceed the EMS's UDP receive buffer, traps start dropping. EMS stage: normalisation becomes a throughput bottleneck — serial processing must be replaced with a multi-threaded alarm normalisation pipeline. The EMS must also implement alarm storm detection and forward a 'storm-in-progress' meta-alarm to the NMS. NMS stage: this is typically the most stressed — the correlation engine processes each alarm against all active alarms and topology data; under 500 alarms/minute, correlation rules must be optimised and the alarm processing thread pool must be sized appropriately. Storm suppression should activate to reduce the effective alarm rate. NBI stage: webhook delivery volume spikes — the NMS must rate-limit OSS notifications to prevent overwhelming consumer systems. A message queue (Kafka/AMQP) decouples NMS publishing rate from OSS consumption rate. OSS stage: bulk ticket creation must be throttled; duplicate detection must be implemented to prevent multiple tickets for the same root cause. A well-designed FM NBI flow handles storm conditions through backpressure, buffering, rate limiting, and storm suppression at each stage.",
      type: "Analytical"
    },
    {
      q: "What is the difference between the SBI (southbound interface) and the NBI (northbound interface) in the NMS FM flow?",
      a: "In the FM NBI flow, the SBI and NBI are mirror interfaces on opposite sides of the NMS: The SBI (southbound interface) faces toward the network elements and EMS layer below the NMS. It receives alarms (pull via SNMP polling or push via SNMP TRAP/NETCONF notification) from the EMS and directly managed NEs. The SBI speaks the protocols of the managed elements: SNMP (UDP/161, 162), NETCONF (SSH/830), RESTCONF (HTTPS/443), CLI scripting. The NBI (northbound interface) faces toward the OSS and BSS systems above the NMS. It exposes processed, correlated alarm data and network information to consumers. The NBI speaks standardised, business-layer protocols: REST/JSON (TMF OpenAPI), AMQP/Kafka for event streaming. The NMS sits between these two interfaces — it translates raw, vendor-specific, high-volume alarm events from the SBI into structured, correlated, business-meaningful alarm records published via the NBI. This architectural separation ensures that OSS systems are completely isolated from southbound protocol complexity, and that the NMS can evolve its southbound protocol support (adding YANG models, new vendors) without affecting the NBI contract seen by OSS consumers.",
      type: "Conceptual"
    }
  ],
  virtualLab: {
    description: "You are architecting an alarm processing pipeline with multiple consumers (dashboard, BSS ticketing, email). Your task: determine the queue depth growth when a slow consumer (e.g., BSS at 100/min) cannot keep up with the alarm arrival rate (500/min). Adjust the arrival rate and the consumer processing rate. The chart shows queue depth over time — estimate how long until the slow consumer's queue overflows its buffer. See why isolated Kafka topics prevent a slow consumer from blocking real-time dashboard updates.",
    interpretation: "When arrival (500/min) exceeds a slow consumer's processing rate (100/min), the queue grows by 400 alarms/minute — reaching 4,000 in 10 minutes. Meanwhile, the dashboard consumer processing at 500/min stays at depth 0. Without per-consumer queue isolation, synchronous push blocks all consumers when any one is slow — the dashboard would be delayed by the same 10 minutes. This is the fundamental architectural reason for Kafka topics: each consumer reads at its own pace without affecting others.",
    parameters: [
      { id: "arrivalRate", name: "Alarm Arrival Rate (/min)", min: 10, max: 1000, default: 100, step: 10, unit: "/min" },
      { id: "processingRate", name: "Consumer Processing Rate (/min)", min: 10, max: 1000, default: 50, step: 10, unit: "/min" }
    ],
    generateData: (params) => {
      const arrival = params.arrivalRate || 100;
      const processing = params.processingRate || 50;
      const pts: Array<{ x: number; y: number }> = [];
      for (let t = 1; t <= 20; t++) {
        const depth = Math.max(0, (arrival - processing) * t);
        pts.push({ x: t, y: depth });
      }
      return pts;
    },
    labels: { x: "Time (min)", y: "Queue Depth (alarms)" }
  }
};
