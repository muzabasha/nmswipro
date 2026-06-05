export interface TopicData {
  id: string;
  title: string;
  moduleName: string;
  context: {
    prerequisites: string[];
    dependentTopics: string[];
    nextSteps: string;
  };
  storytelling: {
    analogy: string;
    story: string;
    reflectiveQuestions: string[];
    technicalConnection: string;
  };
  mathModelling: {
    need: string;
    equation: string;
    technicalDetails: string;
    explanation: Array<{ term: string; meaning: string }>;
    advantages: string[];
    limitations: string[];
    simulation: {
      description: string;
      parameters: Array<{ id: string; name: string; min: number; max: number; default: number; step: number; unit: string }>;
    };
  };
  activities: {
    level1: string;
    level2: string;
    level3: string;
    level4: string;
  };
  projects: {
    scope: string;
    objectives: string[];
    deliverables: string[];
  };
  questions: Array<{ q: string; a: string; type: string }>;
  virtualLab: {
    description: string;
    interpretation: string;
    parameters: Array<{ id: string; name: string; min: number; max: number; default: number; unit: string }>;
  };
}

export const topic1Data: TopicData = {
  id: "u1t1",
  title: "Understanding Mobile Networks & NMS Frameworks",
  moduleName: "Unit 1: Introduction to Network Management",
  context: {
    prerequisites: ["Basic Computer Networking", "OSI Model", "TCP/IP Suite"],
    dependentTopics: ["eTOM and TMN Frameworks", "EMS and NMS Architecture", "SNMP Protocol Details"],
    nextSteps: "We will formalize this understanding by studying the exact layers of the TMN framework in the next topic."
  },
  storytelling: {
    analogy: "The Postal Service vs. The Fleet Manager",
    story: "Imagine you're managing a nationwide postal service. Initially, you just focus on the mail carriers (the routers) delivering packages (packets). But soon, vans break down, carriers get lost, and customers complain. You realize you can't just send mail; you need a Fleet Management System. This system tracks van health, reroutes traffic during a storm, and bills customers. In networking, sending packets isn't enough; you need a Network Management System (NMS) to oversee the 'fleet'.",
    reflectiveQuestions: ["What happens when a mail carrier gets lost and no one knows?", "How do you know if a van needs maintenance before it breaks down?"],
    technicalConnection: "Just as the Fleet Manager monitors the vans, an NMS uses protocols to monitor Network Elements (routers, switches, base stations). The health checks are 'Fault Management', the routing changes are 'Configuration Management', and the customer billing is 'Accounting Management'."
  },
  mathModelling: {
    need: "To mathematically quantify network reliability over time, which is essential for determining Service Level Agreements (SLAs) and provisioning NMS redundancy.",
    equation: "R(t) = e^{-\\lambda t}",
    technicalDetails: "In network reliability engineering, devices are assumed to be in their 'useful life' phase, where the failure rate (\\(\\lambda\\)) is constant. The reliability function \\( R(t) \\) models the probability that a network element will operate without failure for a specified time period \\( t \\). The exponential distribution is used because component failures are assumed to be memoryless (a component that has survived for a year is just as likely to fail in the next hour as a brand new one). An NMS uses this metric to schedule maintenance and trigger proactive rerouting when reliability drops below a critical threshold.",
    explanation: [
      { term: "R(t)", meaning: "Reliability: The probability (0 to 1) that the network element survives until time t." },
      { term: "\\lambda", meaning: "Failure rate: The expected number of failures per unit time (e.g., failures per hour)." },
      { term: "t", meaning: "Time: The operational period over which reliability is calculated." },
      { term: "e", meaning: "Euler's number: The base of the natural logarithm (approx. 2.71828)." }
    ],
    advantages: ["Allows predicting when a device might fail (Proactive maintenance).", "Helps calculate necessary redundancy to meet five-nines (99.999%) availability.", "Provides a quantitative basis for SLA negotiations."],
    limitations: ["Assumes a constant failure rate, which doesn't account for 'wear-out' or early 'infant mortality' phases of hardware (the Bathtub Curve)."],
    simulation: {
      description: "Adjust the Failure Rate (λ) to observe how quickly the network reliability R(t) decays over time. A higher failure rate causes a steeper decay.",
      parameters: [
        { id: "failureRate", name: "Failure Rate (λ)", min: 0.001, max: 0.1, default: 0.01, step: 0.001, unit: " failures/hr" }
      ]
    }
  },
  activities: {
    level1: "Teacher demonstrates a simple network diagram on the projector, showing an NMS server polling 3 routers.",
    level2: "Teacher + Students map out the 'Fleet Manager' analogy to actual network devices (Van = Router, Manager = NMS).",
    level3: "Group Activity: Students list 5 things an NMS should monitor on a Wi-Fi router.",
    level4: "Individual Task: Write a 100-word reflection on how an NMS prevents network downtime."
  },
  projects: {
    scope: "Build a conceptual mock-up of an NMS dashboard for a university campus.",
    objectives: ["Identify key metrics", "Design a UI wireframe", "Map metrics to FCAPS"],
    deliverables: ["Figma/Draw.io wireframe", "1-page justification document"]
  },
  questions: [
    { q: "Why is simply 'routing packets' insufficient for a modern enterprise network?", a: "Because without an NMS, failures go unnoticed until users complain, configuration changes are manual and error-prone, and there is no way to audit or bill for usage.", type: "Conceptual" },
    { q: "If the failure rate $\\lambda$ is 0.01 per hour, what is the reliability after 100 hours?", a: "$R(100) = e^{-0.01 * 100} = e^{-1} \\approx 0.368$ or 36.8%.", type: "Numerical" },
    { q: "In the 'Fleet Manager' analogy, what does monitoring a router's health correspond to?", a: "It corresponds to 'Fault Management', which is analogous to tracking the health and maintenance needs of the delivery vans to prevent breakdowns.", type: "Conceptual" },
    { q: "What is the primary trade-off when configuring the polling interval of an NMS?", a: "A shorter polling interval detects network issues faster but significantly increases CPU and bandwidth overhead on both the NMS server and the target devices.", type: "Analytical" },
    { q: "What is the limitation of assuming a constant failure rate $\\lambda$ in network reliability engineering?", a: "It assumes components are in their 'useful life' phase and does not account for the 'wear-out' phase of older hardware or the early 'infant mortality' phase (the Bathtub Curve).", type: "Conceptual" }
  ],
  virtualLab: {
    description: "Interactive simulation showing the trade-off between NMS Polling Frequency and Network Overhead.",
    interpretation: "As you decrease the polling interval (polling more frequently), the NMS sends more requests per second. This increases the CPU and bandwidth overhead on both the NMS server and the target devices. If you have a large number of devices and poll them too frequently, the network overhead spikes significantly, which can lead to congestion or dropped packets. Conversely, polling less frequently reduces overhead but delays fault detection.",
    parameters: [
      { id: "pollingRate", name: "Polling Interval", min: 1, max: 60, default: 10, unit: "s" },
      { id: "deviceCount", name: "Number of Devices", min: 10, max: 1000, default: 100, unit: " devices" }
    ]
  }
};
