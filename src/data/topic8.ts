import type { TopicData } from './types';

export const topic8Data: TopicData = {
  id: "u3t2",
  title: "YANG Data Modeling Language",
  moduleName: "Unit 3: Modern Management",
  context: {
    prerequisites: ["The Limitations of SNMP & Rise of NETCONF"],
    dependentTopics: ["RESTCONF and Web-based Management"],
    nextSteps: "Now that we know how YANG models data, we will see how RESTCONF exposes this data via HTTP APIs."
  },
  storytelling: {
    analogy: "The Architect's Blueprint",
    story: "Imagine trying to build a house by just giving a builder a list of materials: '100 bricks, 1 door, 4 windows'. The builder might put the door on the roof! You need an Architect's Blueprint that strictly defines relationships: 'The door must be attached to a wall. The roof must be above the walls'. YANG is that blueprint for networks. It doesn't just list variables like an SNMP MIB does; it defines strict relationships, constraints, and data types, ensuring the router (the builder) knows exactly how the configuration pieces fit together.",
    reflectiveQuestions: ["Why is it important to define that a 'VLAN ID' must be a number between 1 and 4094 before sending it to a router?", "How does a blueprint prevent configuration errors?"],
    technicalConnection: "YANG (Yet Another Next Generation) is a data modeling language. It acts as the 'Information Model' for NETCONF and RESTCONF, replacing the older SMI used in SNMP. It strictly defines the structure, syntax, and constraints of network configuration data."
  },
  mathModelling: {
    need: "To understand the memory footprint optimization of YANG's hierarchical tree structure compared to flat lists.",
    equation: "O_{search} = O(\\log n)",
    technicalDetails: "YANG structures data hierarchically (like a tree), whereas older systems often flattened data. When searching for a specific configuration parameter among $n$ total parameters, a tree structure allows for logarithmic search time complexity $O(\\log n)$ rather than linear time $O(n)$. This is mathematically critical for modern core routers that manage hundreds of thousands of configuration parameters (like massive BGP routing tables); without $O(\\log n)$ access, parsing configurations would stall the router's CPU.",
    explanation: [
      { term: "O_{search}", meaning: "Big O notation representing the time complexity of searching the configuration data." },
      { term: "n", meaning: "Total number of configuration parameters." },
      { term: "\\log n", meaning: "The logarithmic relationship indicating that search time grows very slowly as data scales." }
    ],
    advantages: ["Demonstrates why hierarchical data modeling is superior for scale.", "Explains the fast boot-time configuration parsing of modern network operating systems."],
    limitations: ["Theoretical complexity; real-world performance depends heavily on the XML/JSON parsing engine used by the device firmware."]
  },
  activities: {
    level1: "Teacher shows a simple YANG module side-by-side with its XML representation.",
    level2: "Teacher + Students identify 'leaves', 'lists', and 'containers' in a provided YANG snippet.",
    level3: "Group Activity: Students are given a router interface specification and must draft a pseudo-YANG tree outlining its hierarchy (e.g., interfaces -> interface -> name, IP, status).",
    level4: "Individual Task: Write a short explanation on how YANG's `must` or `range` statements prevent misconfiguration."
  },
  projects: {
    scope: "Compile and validate a YANG model using open-source tools.",
    objectives: ["Install `pyang` (a Python YANG validator)", "Write a basic YANG module for a 'Smart Lightbulb'", "Validate the module using `pyang` and generate a tree view"],
    deliverables: ["The `.yang` text file", "A screenshot of the `pyang -f tree` output"]
  },
  questions: [
    { q: "What is the primary purpose of the YANG language?", a: "YANG is a data modeling language used to formally define the structure, syntax, and constraints of configuration and state data for network devices.", type: "Conceptual" },
    { q: "What is the relationship between YANG and NETCONF?", a: "YANG acts as the Information Model (the blueprint of the data), while NETCONF acts as the Communication Model (the protocol used to transport the YANG-modeled data).", type: "Conceptual" },
    { q: "If a router has 1,000,000 configuration parameters, why is a hierarchical model $O(\\log n)$ preferred over a flat list $O(n)$?", a: "Because $O(\\log n)$ allows the router to locate a specific parameter in roughly 20 operations, whereas $O(n)$ could take up to 1,000,000 operations, saving immense CPU time.", type: "Analytical" },
    { q: "In YANG terminology, what is a 'leaf'?", a: "A 'leaf' is a node in the data tree that contains a single value (like a string or integer) and cannot have any child nodes.", type: "Conceptual" },
    { q: "How does YANG help prevent human error in network configuration?", a: "YANG allows developers to define strict constraints (e.g., specifying that a VLAN ID must be an integer between 1 and 4094). If a configuration violates this constraint, it is rejected before being applied.", type: "Analytical" }
  ],
  virtualLab: {
    description: "Interactive simulation comparing Search Time ($O(n)$ vs $O(\\log n)$) as configuration size grows.",
    interpretation: "Watch the graph as the number of configuration nodes $n$ increases. The flat list search time skyrockets, while the hierarchical tree search time remains relatively flat, proving the efficiency of YANG's structure for massive networks.",
    parameters: [
      { id: "nodeCount", name: "Number of Nodes (n)", min: 100, max: 100000, default: 1000, step: 100, unit: "" }
    ]
  }
};
