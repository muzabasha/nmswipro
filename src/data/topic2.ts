import type { TopicData } from './types';

export const topic2Data: TopicData = {
  id: "u1t2",
  title: "EMS and NMS Architecture (SBI & NBI)",
  moduleName: "Unit 1: Introduction to Network Management",
  context: {
    prerequisites: ["Topic 1.1: Mobile Networks, eTOM, and TMN Framework", "Client-Server Architecture"],
    dependentTopics: ["The FCAPS Process", "YANG Data Model Structure Details"],
    nextSteps: "Study how FCAPS operations are implemented across these EMS-NMS interfaces in the next topic."
  },
  storytelling: {
    analogy: "The Kitchen Translator",
    story: "Imagine a busy international restaurant. The head chef (NMS) wants to manage dishes. The line cooks (Network Elements) only speak specific regional dialects. The sous-chef (EMS) is the translator. The sous-chef communicates with the line cooks in their specific dialects (Southbound Interface - SBI, using local commands) and reports up to the head chef in a single standard language (Northbound Interface - NBI, like REST or XML). This prevents the head chef from having to learn ten different dialects. In network architecture, the EMS manages specific vendor hardware and exposes a simplified, consolidated NBI to the central multi-vendor NMS.",
    reflectiveQuestions: ["What happens if the chef tries to talk directly to every cook in ten different dialects?", "Why is it important to translate local errors into a single common format?"],
    technicalConnection: "The Element Management System (EMS) manages specific elements (like gNodeBs from one vendor). Its Southbound Interface (SBI) uses protocol-specific dialects (SNMP, CLI, NETCONF) to talk to hardware. Its Northbound Interface (NBI) exposes data to the higher-level Network Management System (NMS) using standardized protocols like REST, SOAP, or SNMP Traps, allowing the NMS to orchestrate multi-vendor networks."
  },
  mathModelling: {
    need: "To model the message queuing delay at the EMS/NMS Northbound Interface under heavy alarm conditions, preventing queue overflow and high latency.",
    equation: "W_q = \\frac{\\lambda}{\\mu(\\mu - \\lambda)}",
    technicalDetails: "The EMS receives SNMP traps or telemetry from network elements and queue-buffers them for transmission over the NBI to the NMS. Using Kendall's notation for M/M/1 queuing models, the average waiting time in the queue \\(W_q\\) depends on the alarm arrival rate \\(\\lambda\\) (alarms/sec) and the NBI processing rate \\(\\mu\\) (alarms/sec). If the arrival rate \\(\\lambda\\) approaches the processing service rate \\(\\mu\\), the queuing delay approaches infinity, indicating an alarm storm that requires rate-limiting or load balancing.",
    explanation: [
      { term: "W_q", meaning: "Average queuing time of an alarm message in the EMS buffer (seconds)." },
      { term: "\\lambda", meaning: "Arrival rate: Average number of incoming alarm messages per second." },
      { term: "\\mu", meaning: "Service rate: Average number of alarms the NBI can process and transmit per second." }
    ],
    advantages: ["Helps size the buffer memory needed to prevent alarm losses during network outages.", "Determines the minimum processing speed \\(\\mu\\) required for NMS servers."],
    limitations: ["Assumes Poisson arrivals and exponential service times, which may not capture bursts (correlated alarm storms) accurately."],
    simulation: {
      description: "Adjust the alarm arrival rate (λ) and the NBI service rate (μ) to see how queue delay changes. Observe the exponential spike when λ approaches μ.",
      parameters: [
        { id: "arrivalRate", name: "Alarm Arrival Rate (λ)", min: 10, max: 90, default: 50, step: 1, unit: " alarms/s" },
        { id: "serviceRate", name: "NBI Service Rate (μ)", min: 100, max: 200, default: 120, step: 5, unit: " alarms/s" }
      ]
    }
  },
  activities: {
    level1: "Teacher displays a diagram showing the hierarchy: Router -> EMS (vendor specific) -> NMS (multi-vendor) -> OSS.",
    level2: "Students identify which interfaces represent Southbound (SBI) vs Northbound (NBI) on a diagram of a multi-vendor LTE network.",
    level3: "Group discussion: Students compare CLI vs REST APIs as SBI/NBI options and list their pros/cons.",
    level4: "Write a design proposal (150 words) explaining why an operator should deploy vendor-specific EMS servers rather than connecting all routers directly to a central NMS."
  },
  projects: {
    scope: "Draft an architecture design for a dual-vendor NMS integration.",
    objectives: ["Draw the architectural layers (Elements, EMS, NMS)", "Define the SBIs and NBIs for Vendor A (uses SNMP) and Vendor B (uses NETCONF)"],
    deliverables: ["Architecture diagram (PDF/Image)", "NBI interface API specifications in YAML (endpoints for alarms)"]
  },
  questions: [
    { q: "What is the primary difference between a Southbound Interface (SBI) and a Northbound Interface (NBI)?", a: "An SBI is used by the controller or EMS to communicate downward with physical or virtual network elements, while an NBI is used to expose data upward to higher-level orchestrators, NMS, or OSS/BSS systems.", type: "Conceptual" },
    { q: "Given an alarm arrival rate λ of 80 alarms/sec and an NBI service rate μ of 100 alarms/sec, what is the average queuing time W_q in the EMS buffer?", a: "W_q = 80 / (100 * (100 - 80)) = 80 / (100 * 20) = 80 / 2000 = 0.04 seconds or 40 milliseconds.", type: "Numerical" },
    { q: "Why does an EMS reduce the processing load on a central NMS in a large network?", a: "The EMS acts as a mediator that filters, aggregates, and correlates local alarms and telemetry, sending only high-level summarized events to the NMS instead of raw data from thousands of devices.", type: "Analytical" },
    { q: "Which protocol is commonly found on an NMS NBI for integration with OSS systems?", a: "RESTful APIs (HTTP/JSON), SOAP (XML), or SNMP Traps are commonly used for upward OSS integration.", type: "Conceptual" },
    { q: "What happens to the EMS buffer queue when the arrival rate λ exceeds the NBI transmission rate μ?", a: "The queue will grow without bound, eventually leading to buffer overflow and the loss of critical network management packets (alarm drops).", type: "Analytical" }
  ],
  virtualLab: {
    description: "M/M/1 Queue Simulator for NMS Northbound Interfaces. Observe how buffer occupancy and delay behave as the system load increases.",
    interpretation: "When the traffic intensity (λ/μ) exceeds 80%, queue length and waiting time grow non-linearly. To mitigate this in production, NMS systems employ thread pools, message brokers (like Kafka), or horizontal scaling.",
    parameters: [
      { id: "loadFactor", name: "Traffic Intensity (λ/μ)", min: 0.1, max: 0.99, default: 0.7, step: 0.05, unit: "" }
    ]
  }
};
