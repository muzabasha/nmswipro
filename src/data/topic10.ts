import type { TopicData } from './types';

export const topic10Data: TopicData = {
  id: "u4t1",
  title: "Introduction to Software-Defined Networking (SDN)",
  moduleName: "Unit 4: Next-Generation Management",
  context: {
    prerequisites: ["RESTCONF and Web-based Management"],
    dependentTopics: ["SDN Controllers and OpenFlow", "Intent-Based Networking"],
    nextSteps: "We will delve into the protocols that allow the separated control plane to communicate with the data plane, specifically OpenFlow."
  },
  storytelling: {
    analogy: "The Traffic Cops and the City Planner",
    story: "In a traditional network, every router is like an independent traffic cop standing at an intersection. They only know what's happening at their specific corner and make local decisions (the Control Plane and Data Plane are bundled together). If a parade blocks Main Street, chaos ensues because the cops can't instantly coordinate a city-wide detour. SDN removes the decision-making from the cops. Instead, there is a central City Planner (the SDN Controller) looking at a live map of the whole city. The Planner computes the optimal detours and instantly sends simple, direct orders to the cops (the Data Plane): 'Send all red cars left'.",
    reflectiveQuestions: ["What happens to the network if the central 'City Planner' (SDN Controller) goes offline?", "Why can a central planner make better routing decisions than an independent traffic cop?"],
    technicalConnection: "SDN decouples the Control Plane (the brains/decision making) from the Data Plane (the muscle/forwarding packets). The Control Plane is centralized in a software controller, while the Data Plane remains on the hardware switches."
  },
  mathModelling: {
    need: "To evaluate the latency overhead of processing 'New Flows' in a centralized SDN architecture compared to distributed routing.",
    equation: "T_{flow} = T_{switch} + 2(T_{prop}) + T_{controller}",
    technicalDetails: "When a traditional router sees a new packet, it looks up its local routing table ($T_{switch}$) instantly. In an SDN network using reactive routing, if a switch sees a packet it doesn't recognize (a new flow), it must pause the packet and ask the SDN Controller what to do. The total time to process this first packet ($T_{flow}$) includes the time for the switch to generate the request ($T_{switch}$), the round-trip propagation delay to the controller ($2 \\times T_{prop}$), and the time the controller takes to calculate the path ($T_{controller}$). If the controller is physically far away, $T_{prop}$ can cause noticeable latency for initial connections.",
    explanation: [
      { term: "T_{flow}", meaning: "Total time required to process the first packet of a new flow." },
      { term: "T_{switch}", meaning: "Time taken by the switch hardware to recognize a table miss and generate a query." },
      { term: "T_{prop}", meaning: "Propagation delay over the network link between the switch and the controller." },
      { term: "T_{controller}", meaning: "Processing time of the SDN controller to calculate the route." }
    ],
    advantages: ["Explains why 'reactive' flow setup can cause high latency for the first ping.", "Highlights the importance of placing SDN controllers topologically close to the switches."],
    limitations: ["Does not apply to 'proactive' SDN models, where the controller pre-populates all rules before traffic arrives."]
  },
  activities: {
    level1: "Teacher diagrams a traditional router (Control + Data plane inside) vs an SDN switch (Data plane only, connected to an external Controller).",
    level2: "Teacher + Students trace the path of a packet entering an SDN switch that has no matching flow rule.",
    level3: "Group Activity: Students brainstorm the security risks of having a single centralized 'brain' for the entire network and propose two mitigation strategies.",
    level4: "Individual Task: Write a short paragraph explaining the difference between the Control Plane and the Data Plane."
  },
  projects: {
    scope: "Set up a virtual SDN environment using Mininet.",
    objectives: ["Install Mininet on a Linux VM", "Create a simple linear topology with 3 switches and 3 hosts", "Ping between hosts to see the default SDN controller in action"],
    deliverables: ["A screenshot of the Mininet CLI `pingall` command succeeding", "A brief explanation of what happened to the first ping packet"]
  },
  questions: [
    { q: "What is the fundamental defining characteristic of Software-Defined Networking (SDN)?", a: "SDN fundamentally decouples the Control Plane (decision making) from the Data Plane (packet forwarding), centralizing the Control Plane in a software controller.", type: "Conceptual" },
    { q: "In the 'Traffic Cop' analogy, what does the 'City Planner' represent?", a: "The City Planner represents the centralized SDN Controller, which has a global view of the network and dictates the routing rules.", type: "Conceptual" },
    { q: "If the propagation delay ($T_{prop}$) to the controller is 10ms, $T_{switch}$ is 2ms, and $T_{controller}$ is 5ms, how long does it take to process a new flow ($T_{flow}$)?", a: "T_flow = 2 + (2 * 10) + 5 = 2 + 20 + 5 = 27 milliseconds.", type: "Numerical" },
    { q: "What is the potential drawback of using a purely 'reactive' flow setup in SDN?", a: "Every new flow introduces significant latency for the first packet, as the switch must query the controller over the network before it knows how to forward the traffic.", type: "Analytical" },
    { q: "How does centralizing the Control Plane benefit network management?", a: "It provides a global, holistic view of the network, allowing for optimized routing, easier policy enforcement, and rapid programmatic changes across the entire infrastructure from a single point.", type: "Conceptual" }
  ],
  virtualLab: {
    description: "Simulation comparing 'First Packet Latency' in Traditional vs Reactive SDN Routing based on Controller distance.",
    interpretation: "Notice how moving the SDN controller geographically further away (increasing Propagation Delay) drastically increases the latency of the first ping. Subsequent pings drop to near zero latency because the flow rule is now cached in the Data Plane.",
    parameters: [
      { id: "controllerDistance", name: "Distance to Controller (km)", min: 10, max: 2000, default: 100, step: 10, unit: " km" }
    ]
  }
};
