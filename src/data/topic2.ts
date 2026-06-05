import type { TopicData } from './types';

export const topic2Data: TopicData = {
  id: "u1t2",
  title: "The FCAPS Framework",
  moduleName: "Unit 1: Introduction to Network Management",
  context: {
    prerequisites: ["Understanding Mobile Networks & NMS Frameworks"],
    dependentTopics: ["Information Models vs. Communication Models"],
    nextSteps: "Now that we understand what to manage (FCAPS), we will explore how data is structured to be managed in the next topic."
  },
  storytelling: {
    analogy: "The Hospital Administration System",
    story: "Think of managing a network like running a large hospital. You need an Emergency Room to handle sudden injuries (Fault Management). You need a system to assign rooms to new patients and schedule surgeries (Configuration Management). The billing department ensures patients pay for services (Accounting Management). The fitness testing center monitors athletes' cardiovascular health over time (Performance Management). Finally, the security guards and badge scanners ensure only authorized personnel access the medicine cabinets (Security Management).",
    reflectiveQuestions: ["What happens to the hospital if the Emergency Room (Fault Management) goes down?", "Why is it important to separate billing (Accounting) from monitoring health (Performance)?"],
    technicalConnection: "FCAPS is the ISO Telecommunications Management Network (TMN) model that defines the five core operational areas of network management: Fault, Configuration, Accounting, Performance, and Security."
  },
  mathModelling: {
    need: "To quantitatively assess the Performance Management aspect, specifically evaluating network throughput and delay to ensure Quality of Service (QoS).",
    equation: "T = \\frac{W}{RTT} \\times \\sqrt{\\frac{3}{2p}}",
    technicalDetails: "The Mathis Equation models the theoretical maximum throughput (T) of a TCP connection. It shows that throughput is inversely proportional to the Round Trip Time (RTT) and the square root of the packet loss probability (p). W represents the Maximum Segment Size (MSS). Performance Management systems continuously monitor RTT and packet loss to calculate if the network can sustain the required throughput. If p or RTT increases, throughput collapses, triggering an alarm.",
    explanation: [
      { term: "T", meaning: "TCP Throughput: The rate at which data is successfully transmitted." },
      { term: "W", meaning: "Maximum Segment Size (MSS): The maximum amount of data in a single TCP packet." },
      { term: "RTT", meaning: "Round Trip Time: The time it takes for a packet to reach the destination and an ACK to return." },
      { term: "p", meaning: "Packet Loss Probability: The probability that a single packet is lost during transmission." }
    ],
    advantages: ["Provides a clear mathematical bound on TCP performance.", "Helps network engineers understand why high-bandwidth links might still suffer from low throughput if latency is high."],
    limitations: ["Assumes standard TCP Reno congestion avoidance; modern algorithms like BBR behave differently.", "Does not account for application-layer bottlenecks."],
    simulation: {
      description: "Adjust the Packet Loss Probability (p) to see its dramatic effect on TCP Throughput. Notice how even a tiny amount of packet loss severely degrades performance due to the inverse square root relationship.",
      parameters: [
        { id: "packetLoss", name: "Packet Loss (p)", min: 0.0001, max: 0.05, default: 0.01, step: 0.001, unit: "" }
      ]
    }
  },
  activities: {
    level1: "Teacher presents a case study of a network outage and asks students to categorize the response steps into the FCAPS acronym.",
    level2: "Teacher + Students use a whiteboard to map the FCAPS components to the 'Hospital' analogy.",
    level3: "Group Activity: Given a scenario (e.g., 'User complains internet is slow'), teams must decide whether it's a Fault or Performance issue, and justify it.",
    level4: "Individual Task: Write a short paragraph explaining which of the 5 FCAPS areas is the most critical for a banking network, and why."
  },
  projects: {
    scope: "Design a comprehensive checklist for evaluating a commercial NMS tool based on FCAPS.",
    objectives: ["Identify 3 key features required for each FCAPS category", "Research an existing tool (like SolarWinds or PRTG)", "Map the tool's features to your checklist"],
    deliverables: ["A structured FCAPS evaluation matrix spreadsheet", "A 2-page tool review report"]
  },
  questions: [
    { q: "What does the acronym FCAPS stand for in the context of network management?", a: "Fault, Configuration, Accounting, Performance, and Security.", type: "Conceptual" },
    { q: "In the hospital analogy, what does the Emergency Room represent?", a: "Fault Management, because it deals with sudden, unexpected issues and outages that need immediate remediation.", type: "Conceptual" },
    { q: "According to the Mathis Equation, if the packet loss probability ($p$) increases by a factor of 4, what happens to the throughput ($T$)?", a: "Because $T$ is inversely proportional to the square root of $p$, increasing $p$ by a factor of 4 will halve the throughput ($T$ is divided by 2).", type: "Numerical" },
    { q: "A user complains they cannot access a specific internal server. If the server is up but the firewall is blocking their IP, which FCAPS management area is involved?", a: "Configuration Management (the firewall rules) and Security Management (access control).", type: "Analytical" },
    { q: "Why is Accounting Management important for Internet Service Providers (ISPs)?", a: "It tracks bandwidth usage, storage, and processing time per user, which is essential for billing customers based on their actual consumption.", type: "Conceptual" }
  ],
  virtualLab: {
    description: "Interactive simulation mapping network events to FCAPS categories.",
    interpretation: "Different network events trigger different management modules. A link going down triggers a Fault event (high priority, immediate action). A request to change a VLAN is a Configuration event. Monitoring CPU usage over 24 hours is a Performance event. Understanding these categories helps NMS software route alerts to the correct IT teams.",
    parameters: [
      { id: "eventRate", name: "Network Event Rate", min: 1, max: 100, default: 20, unit: " events/min" },
      { id: "faultRatio", name: "Fault Probability", min: 1, max: 50, default: 5, unit: "%" }
    ]
  }
};
