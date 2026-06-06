import type { TopicData } from './types';

export const topic7Data: TopicData = {
  id: "u2t2",
  title: "YANG Data Model Structure Details",
  moduleName: "Unit 2: Model-Driven Management and Protocols",
  context: {
    prerequisites: ["Topic 2.1: Introduction to Model-Driven Management", "Tree structures"],
    dependentTopics: ["Topic 2.3: NETCONF Protocol and Operations", "Topic 2.4: RESTCONF Protocol and Postman Operations"],
    nextSteps: "Study how these structured YANG models are transmitted and manipulated using NETCONF in the next topic."
  },
  storytelling: {
    analogy: "The Filing Cabinet Hierarchy",
    story: "Imagine a filing cabinet in a corporate office. The top drawer is labeled 'Engineering' (Container). Inside, there are folders for each engineer (List, keyed by Employee ID). Inside each folder, there are individual sheets of paper (Leaves) containing their name, status, and salary. You cannot have a sheet of paper floating around without a folder, and folders must live inside a drawer. YANG structures data exactly like this cabinet using `container`, `list` (with a `key`), `leaf`, and `leaf-list` statements to build a perfect hierarchy of network settings.",
    reflectiveQuestions: ["Why does each employee folder need a unique ID key?", "What is the equivalent of a container vs a leaf on a router?"],
    technicalConnection: "YANG defines data nodes. A `container` groups related nodes but carries no values; a `leaf` carries a single value of a specific type (e.g., string, uint8); a `list` represents multiple entries of identical structure (like interfaces), identified by a unique `key` node; and `leaf-list` contains an array of single-type values. These blocks let YANG map complex physical networks into strict hierarchical schemas."
  },
  mathModelling: {
    need: "To model the serialization processing time of a YANG data tree as a function of the nesting depth and the number of leaf elements.",
    equation: "T_{proc} = k \\times D \\times N_{leaves}",
    technicalDetails: "When an NMS converts a YANG-modeled configuration into XML or JSON, it traverses the tree. The processing time \\(T_{proc}\\) depends on the nesting depth \\(D\\) of the tree, the total number of leaf elements \\(N_{leaves}\\), and a processor-specific parsing constant \\(k\\). A deeply nested structure (high \\(D\\)) requires recursive traversal and path parsing, which increases CPU utilization compared to flat, shallow models with the same number of parameters. This models the trade-off in YANG design between deep conceptual organization and rapid serialization performance.",
    explanation: [
      { term: "T_proc", meaning: "Time taken to parse and serialize/deserialize the YANG data tree (microseconds)." },
      { term: "k", meaning: "Processor parsing coefficient constant (microseconds per node-depth level)." },
      { term: "D", meaning: "Maximum hierarchy depth of the YANG tree." },
      { term: "N_leaves", meaning: "Total number of active leaf nodes in the payload." }
    ],
    advantages: ["Helps model NMS agent performance for large-scale device configurations.", "Encourages designers to optimize YANG schemas by avoiding excessive nesting."],
    limitations: ["Assumes uniform parsing time per node, ignoring variations in validation overhead for different data types (e.g., regex checks)."],
    simulation: {
      description: "Vary the maximum depth (D) and number of leaves (N) to observe the parser execution time model.",
      parameters: [
        { id: "treeDepth", name: "Max Tree Depth (D)", min: 2, max: 10, default: 4, step: 1, unit: " layers" },
        { id: "leafCount", name: "Leaf Node Count (N)", min: 10, max: 1000, default: 150, step: 10, unit: " leaves" }
      ]
    }
  },
  activities: {
    level1: "Teacher shows a basic YANG file containing container interfaces, list interface, key name, leaf type on screen.",
    level2: "Students identify containers, lists, keys, and leaves in a printed snippet of a YANG schema.",
    level3: "Class Exercise: Students write a 10-line YANG block defining a list of DNS servers with IP addresses.",
    level4: "Write a short summary (150 words) explaining why a `list` node in YANG requires a `key` leaf, and what happens if a key is missing."
  },
  projects: {
    scope: "Write a schema definition for a virtual routing instance.",
    objectives: ["Create a YANG model specifying a routing container", "Include a list of neighbor IP routers with keys and leaves for interface name and autonomous system number"],
    deliverables: ["A mockup YANG text file structure", "YANG tree model layout diagram"]
  },
  questions: [
    { q: "What are the four primary data node types in YANG?", a: "container, list, leaf, and leaf-list.", type: "Conceptual" },
    { q: "Given a parsing constant k of 0.2 μs/node-depth, calculate the processing time T_proc for a configuration with 500 leaves nested at a depth of 6.", a: "T_proc = 0.2 * 6 * 500 = 600 microseconds or 0.6 milliseconds.", type: "Numerical" },
    { q: "Why must a YANG 'list' define a 'key'?", a: "The 'key' is a leaf node that acts as a unique identifier for each list entry, allowing the NMS to select, read, update, or delete specific entries from the list (like selecting a specific interface by name).", type: "Conceptual" },
    { q: "How does a 'leaf-list' differ from a 'list' in YANG?", a: "A 'leaf-list' represents a sequence of scalar values of a single type (e.g., an array of strings representing DNS servers), whereas a 'list' represents a sequence of complex multi-leaf records (e.g., interfaces, each having a name, IP, and status).", type: "Analytical" },
    { q: "What is the purpose of the 'config' statement in YANG nodes (config true vs config false)?", a: "Config true designates writable configuration data (e.g., setting an IP), whereas config false designates read-only state data or statistics (e.g., packet counters, temperature sensors).", type: "Conceptual" }
  ],
  virtualLab: {
    description: "YANG Schema Tree Visualization Lab. Toggle between container, list, leaf, and leaf-list inputs to see how the XML parser structures the output payload dynamically.",
    interpretation: "Containers are mapped to XML tags without content, lists map to repeating element blocks, and keys are output as the first leaf elements of lists. This showcases the direct mapping from YANG structure to on-the-wire XML bytes.",
    parameters: [
      { id: "payloadFormat", name: "Serialization Type (1=XML, 2=JSON)", min: 1, max: 2, default: 1, step: 1, unit: "" }
    ]
  }
};
