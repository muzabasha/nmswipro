import type { TopicData } from './types';

export const topic11Data: TopicData = {
  id: "u4t2",
  title: "SDN Controllers and OpenFlow",
  moduleName: "Unit 4: Next-Generation Management",
  context: {
    prerequisites: ["Introduction to Software-Defined Networking (SDN)"],
    dependentTopics: ["Intent-Based Networking and AI in NMS"],
    nextSteps: "We will conclude the course by looking at the highest level of abstraction: Intent-Based Networking."
  },
  storytelling: {
    analogy: "The Brain and the Nervous System",
    story: "In the human body, your brain makes the decisions (Control Plane), and your muscles do the lifting (Data Plane). But how does the brain talk to the muscles? It uses the nervous system. In an SDN network, OpenFlow is the nervous system. It's the standard protocol (the Southbound Interface) that allows the central brain (the SDN Controller) to send electrical signals (Flow Rules) down to the muscles (the Network Switches), telling them exactly how to flex (where to forward packets). Without a standardized nervous system, a brain cannot control muscles from different vendors.",
    reflectiveQuestions: ["Why is it critical for the 'nervous system' (OpenFlow) to be an open, vendor-neutral standard?", "What happens if the 'brain' wants to route traffic, but the 'muscle' doesn't understand the command?"],
    technicalConnection: "OpenFlow is the most prominent Southbound API protocol in SDN. It standardizes how the controller programs the forwarding tables (Flow Tables) of the switches, allowing hardware from different vendors (Cisco, Juniper, Arista) to be managed by a single controller."
  },
  mathModelling: {
    need: "To understand the memory limitations of hardware switches when storing Flow Rules defined by the Controller.",
    equation: "U_{TCAM} = \\frac{\\sum_{i=1}^{f} S_{rule_i}}{C_{TCAM}} \\times 100",
    technicalDetails: "SDN switches use Ternary Content-Addressable Memory (TCAM) to store OpenFlow rules because it allows for high-speed, parallel matching of packets against complex rules (e.g., matching IP, MAC, and Port simultaneously). However, TCAM is extremely expensive and power-hungry, so switches have very limited TCAM capacity ($C_{TCAM}$). The TCAM Utilization ($U_{TCAM}$) is the sum of the sizes of all $f$ installed flow rules ($S_{rule_i}$) divided by the total capacity. If $U_{TCAM}$ reaches 100%, the switch cannot accept new rules from the controller, causing network failures.",
    explanation: [
      { term: "U_{TCAM}", meaning: "Percentage utilization of the switch's TCAM memory." },
      { term: "f", meaning: "Number of active flow rules installed on the switch." },
      { term: "S_{rule_i}", meaning: "Size (in bytes) of the $i$-th flow rule." },
      { term: "C_{TCAM}", meaning: "Total capacity of the switch's TCAM." }
    ],
    advantages: ["Explains the hardware bottleneck of SDN deployments.", "Highlights why SDN controllers must optimize and aggregate flow rules before sending them to the switch."],
    limitations: ["Assumes all rules are stored in TCAM; modern switches use hierarchical memory (SRAM + TCAM) to mitigate this issue."]
  },
  activities: {
    level1: "Teacher explains the three parts of an OpenFlow rule: Match Fields, Counters, and Instructions.",
    level2: "Teacher + Students write a pseudo-OpenFlow rule on the board to 'Drop all traffic from IP 192.168.1.5'.",
    level3: "Group Activity: Students debate the pros and cons of using a single global controller vs. a clustered group of controllers.",
    level4: "Individual Task: Define what a 'Southbound API' is in the context of SDN."
  },
  projects: {
    scope: "Interact with an SDN Controller's Northbound API.",
    objectives: ["Start the Ryu SDN Controller (or similar) attached to Mininet", "Use a REST client (like Postman) to query the controller's Northbound API", "Retrieve the list of connected switches and their installed flow rules"],
    deliverables: ["The JSON response showing the connected switches", "A screenshot of the REST API call"]
  },
  questions: [
    { q: "What role does OpenFlow play in the SDN architecture?", a: "OpenFlow is a Southbound API protocol that allows the SDN Controller to communicate with the Data Plane switches, instructing them on how to forward packets.", type: "Conceptual" },
    { q: "In the 'Brain and Nervous System' analogy, what does the nervous system represent?", a: "The Southbound API protocol, such as OpenFlow, which carries the commands from the brain (Controller) to the muscles (Switches).", type: "Conceptual" },
    { q: "If a switch has a TCAM capacity ($C_{TCAM}$) of 1MB, and the controller installs 5,000 rules that are 100 bytes each, what is the TCAM utilization ($U_{TCAM}$)?", a: "U_TCAM = ((5000 * 100) / 1,000,000) * 100 = (500,000 / 1,000,000) * 100 = 50%.", type: "Numerical" },
    { q: "Why do hardware switches use TCAM for storing OpenFlow rules instead of standard RAM?", a: "TCAM allows the switch hardware to compare an incoming packet against thousands of complex rules simultaneously in a single clock cycle, enabling line-rate forwarding speeds.", type: "Analytical" },
    { q: "What is the difference between a Northbound API and a Southbound API in SDN?", a: "The Southbound API (e.g., OpenFlow) connects the Controller down to the switches. The Northbound API (usually a REST API) connects the Controller up to the management applications.", type: "Conceptual" }
  ],
  virtualLab: {
    description: "Simulation of TCAM Exhaustion based on the number of granular micro-flows.",
    interpretation: "Watch the TCAM Utilization meter. As you define more granular rules (e.g., per-user rules rather than per-subnet rules), the number of flows skyrockets. If TCAM hits 100%, the switch starts dropping packets because it cannot store the rules needed to route them.",
    parameters: [
      { id: "granularity", name: "Rule Granularity (1=Subnet, 10=Per-IP)", min: 1, max: 10, default: 5, step: 1, unit: "" },
      { id: "users", name: "Number of Active Users", min: 100, max: 5000, default: 1000, step: 100, unit: "" }
    ]
  }
};
