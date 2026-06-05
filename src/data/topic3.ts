import type { TopicData } from './types';

export const topic3Data: TopicData = {
  id: "u1t3",
  title: "Information Models vs. Communication Models",
  moduleName: "Unit 1: Introduction to Network Management",
  context: {
    prerequisites: ["The FCAPS Framework"],
    dependentTopics: ["Introduction to SNMP", "YANG Data Modeling"],
    nextSteps: "We will now transition to Unit 2, where we see these models put into practice with SNMP."
  },
  storytelling: {
    analogy: "The Menu vs. The Waiter",
    story: "Imagine dining at a restaurant. The 'Menu' describes what dishes exist, their ingredients, and their prices. This is the Information Model—it defines the structure of data. However, you can't just stare at the menu to get food. You need the 'Waiter' to take your order to the kitchen and bring the food back. The Waiter's protocol (taking orders, delivering food) is the Communication Model. In networking, a MIB or YANG file is the Menu (Information Model), and SNMP or NETCONF is the Waiter (Communication Model).",
    reflectiveQuestions: ["Can a restaurant function if it has a Menu but no Waiter?", "What happens if the Waiter speaks a language you don't understand, even if you can read the Menu?"],
    technicalConnection: "In NMS, you must define WHAT data looks like (Information Model: SMI, MIB, YANG) separately from HOW that data is transported across the network (Communication Model: SNMP, RESTCONF, NETCONF)."
  },
  mathModelling: {
    need: "To understand the data serialization overhead when moving from an Information Model (like an object in memory) to a Communication Model (packets on a wire).",
    equation: "E = \\frac{S_{payload}}{S_{payload} + S_{headers}} \\times 100",
    technicalDetails: "The Encapsulation Efficiency (E) equation calculates the percentage of a network packet that contains actual data versus overhead. When an Information Model is serialized into a Communication Model (e.g., a simple integer encoded into SNMP via BER inside UDP inside IP), significant headers are added. A 4-byte integer payload might require 40 bytes of headers. Understanding this efficiency is crucial for designing NMS protocols for low-bandwidth IoT networks.",
    explanation: [
      { term: "E", meaning: "Encapsulation Efficiency: The percentage of the packet that is useful payload." },
      { term: "S_{payload}", meaning: "Size of Payload: The bytes representing the actual Information Model data." },
      { term: "S_{headers}", meaning: "Size of Headers: The overhead bytes added by the Communication Model and lower network layers." }
    ],
    advantages: ["Highlights the hidden cost of overly complex communication protocols.", "Assists in selecting the right protocol (e.g., CoAP vs HTTP) for constrained networks."],
    limitations: ["Does not account for connection setup overhead (like TCP handshakes).", "Assumes fixed header sizes, which vary in protocols with variable-length options."],
    simulation: {
      description: "Adjust the Header Size to see how it impacts Encapsulation Efficiency for a fixed Payload Size. Notice how small payloads are heavily penalized by large headers.",
      parameters: [
        { id: "headerSize", name: "Header Size (bytes)", min: 20, max: 200, default: 60, step: 1, unit: "B" }
      ]
    }
  },
  activities: {
    level1: "Teacher shows a snippet of a MIB file (Information Model) alongside a Wireshark capture of an SNMP packet (Communication Model).",
    level2: "Teacher + Students build an 'Information Model' of a student (Name, Age, Grade) on the board.",
    level3: "Group Activity: Students invent a 'Communication Model' protocol (rules for asking and answering) to transmit the student data across the classroom without speaking.",
    level4: "Individual Task: Write an essay contrasting how SNMP and NETCONF handle the separation of Information and Communication models."
  },
  projects: {
    scope: "Design a custom JSON Information Model for a Smart Thermostat.",
    objectives: ["Define at least 5 attributes (e.g., temperature, target_temp, mode)", "Define data types for each attribute", "Propose a REST-based Communication Model to read/write these attributes"],
    deliverables: ["A JSON schema document", "A mock API specification (e.g., Swagger/OpenAPI snippet)"]
  },
  questions: [
    { q: "What is the primary difference between an Information Model and a Communication Model?", a: "An Information Model defines the structure, syntax, and semantics of the management data (the 'what'), while a Communication Model defines the protocol and mechanisms used to exchange that data across the network (the 'how').", type: "Conceptual" },
    { q: "In the restaurant analogy, what does the Waiter represent?", a: "The Waiter represents the Communication Model, responsible for transporting requests and responses between the client (customer) and the server (kitchen).", type: "Conceptual" },
    { q: "If the payload size is 10 bytes and the total header size is 40 bytes, what is the Encapsulation Efficiency?", a: "E = (10 / (10 + 40)) * 100 = (10 / 50) * 100 = 20%.", type: "Numerical" },
    { q: "Why might a protocol with high overhead (large headers) be problematic for managing thousands of IoT sensors over a low-bandwidth wireless network?", a: "Because a low Encapsulation Efficiency means most of the limited bandwidth is wasted on protocol headers rather than actual sensor data, potentially causing congestion and delays.", type: "Analytical" },
    { q: "Is SNMP considered an Information Model or a Communication Model?", a: "SNMP is a Communication Model. It relies on SMI/MIBs, which serve as the Information Model.", type: "Conceptual" }
  ],
  virtualLab: {
    description: "Interactive simulation comparing serialization overhead of JSON (RESTCONF) vs BER (SNMP).",
    interpretation: "Notice that while JSON is human-readable and excellent for modern APIs, it is 'chatty' and consumes more bytes. Basic Encoding Rules (BER) used by SNMP are binary and more compact, leading to better Encapsulation Efficiency for very small data points, though it is harder to parse manually.",
    parameters: [
      { id: "dataPoints", name: "Number of Data Points", min: 1, max: 100, default: 10, unit: " items" }
    ]
  }
};
