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
    explanation: Array<{ term: string; meaning: string }>;
    advantages: string[];
    limitations: string[];
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
    need: "To mathematically quantify network reliability and the impact of polling intervals on NMS load.",
    equation: "R(t) = e^{-\\lambda t}",
    explanation: [
      { term: "R(t)", meaning: "Reliability of the network element over time t" },
      { term: "\\lambda", meaning: "Failure rate (failures per hour)" },
      { term: "t", meaning: "Time period of observation" }
    ],
    advantages: ["Allows predicting when a device might fail (Proactive maintenance).", "Helps calculate necessary redundancy."],
    limitations: ["Assumes a constant failure rate, which doesn't account for 'wear-out' or early 'infant mortality' phases of hardware."]
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
    { q: "If the failure rate $\\lambda$ is 0.01 per hour, what is the reliability after 100 hours?", a: "$R(100) = e^{-0.01 * 100} = e^{-1} \\approx 0.368$ or 36.8%.", type: "Numerical" }
  ],
  virtualLab: {
    description: "Interactive simulation showing the trade-off between NMS Polling Frequency and Network Overhead.",
    parameters: [
      { id: "pollingRate", name: "Polling Interval", min: 1, max: 60, default: 10, unit: "s" },
      { id: "deviceCount", name: "Number of Devices", min: 10, max: 1000, default: 100, unit: " devices" }
    ]
  }
};
