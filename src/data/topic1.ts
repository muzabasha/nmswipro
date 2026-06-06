import type { TopicData } from './types';

export const topic1Data: TopicData = {
  id: "u1t1",
  title: "Mobile Networks, eTOM, and TMN Framework",
  moduleName: "Unit 1: Introduction to Network Management",
  context: {
    prerequisites: ["Basic Computer Networks", "OSI Model", "TCP/IP Protocol Suite"],
    dependentTopics: ["EMS and NMS Architecture", "The FCAPS Process"],
    nextSteps: "Explore how EMS and NMS manage these layers through southbound and northbound interfaces in the next topic."
  },
  storytelling: {
    analogy: "A Multi-Store Retail Franchise",
    story: "Imagine a global coffee franchise. At the cash register (Element Management - EMS), staff process individual drinks. At the store level (Network Management - NMS), the manager monitors inventory and staff schedules. At the regional headquarters (Service Management), logistics plans delivery routes between stores. Finally, at the corporate executive suite (Business Management), strategic investments and mergers are decided. TMN (Telecommunications Management Network) does exactly this: it categorizes network operations from the raw hardware interface up to business strategies, ensuring that base stations in a mobile network align with billing and business goals (eTOM).",
    reflectiveQuestions: ["What happens if a coffee machine breaks down and the store manager is not notified?", "How does corporate strategy depend on cash register sales?"],
    technicalConnection: "In mobile telecommunications, TMN divides management into Business, Service, Network, and Element Management Layers. eTOM (enhanced Telecom Operations Map) provides a business-process framework that sits on top of this hierarchy, standardizing how customer service, billing, and network planning interact with the underlying LTE/5G infrastructure elements."
  },
  mathModelling: {
    need: "To model the availability of a hierarchical management system where failure at any layer disrupts the overall management path.",
    equation: "A_{sys} = A_{EML} \\times A_{NML} \\times A_{SML} \\times A_{BML}",
    technicalDetails: "A Telecommunications Management Network (TMN) operates hierarchically. The system availability \\(A_{sys}\\) is modeled as a series reliability block diagram. If the Element Management Layer (EML), Network Management Layer (NML), Service Management Layer (SML), or Business Management Layer (BML) fails, the management link is broken. Thus, the total management system availability is the product of the individual layers' availabilities. A higher layer cannot retrieve information if a lower layer is offline, making redundancy at the EML and NML critical.",
    explanation: [
      { term: "A_sys", meaning: "Overall TMN system availability (value between 0 and 1)." },
      { term: "A_EML", meaning: "Availability of the Element Management Layer." },
      { term: "A_NML", meaning: "Availability of the Network Management Layer." },
      { term: "A_SML", meaning: "Availability of the Service Management Layer." },
      { term: "A_BML", meaning: "Availability of the Business Management Layer." }
    ],
    advantages: ["Quantifies system weak points to determine where redundancy is needed.", "Enables service providers to calculate expected downtime for SLAs."],
    limitations: ["Assumes independent layer failures, which may not hold if a shared database or infrastructure fails."],
    simulation: {
      description: "Simulate overall system availability by adjusting the availability of individual TMN layers. Observe how a single low-availability layer degrades the entire system.",
      parameters: [
        { id: "emlAvail", name: "EML Availability", min: 0.9, max: 1.0, default: 0.99, step: 0.001, unit: "" },
        { id: "nmlAvail", name: "NML Availability", min: 0.9, max: 1.0, default: 0.995, step: 0.001, unit: "" },
        { id: "smlAvail", name: "SML Availability", min: 0.9, max: 1.0, default: 0.99, step: 0.001, unit: "" }
      ]
    }
  },
  activities: {
    level1: "Teacher displays a slide mapping a 5G network to the TMN layers: Base Station (NE) -> EML -> NML.",
    level2: "Students map real-world telecom events (e.g., SIM activation, fiber cut, billing update) to either TMN or eTOM processes.",
    level3: "In groups, students design a process flow for 'Customer reports slow data speed' using eTOM customer relationship and service assurance processes.",
    level4: "Write a comparative summary (150 words) on how TMN's structural layers complement eTOM's business-process-focused layers."
  },
  projects: {
    scope: "Design a conceptual management blueprint for a regional 5G base station network based on eTOM and TMN.",
    objectives: ["Map network elements to TMN layers", "Identify 3 key eTOM processes for base station maintenance", "Create a layer interaction diagram"],
    deliverables: ["Layer interaction diagram (PDF)", "2-page design document detailing EML/NML interactions"]
  },
  questions: [
    { q: "What are the five layers of the TMN physical management hierarchy?", a: "Element Layer (EL), Element Management Layer (EML), Network Management Layer (NML), Service Management Layer (SML), and Business Management Layer (BML).", type: "Conceptual" },
    { q: "If the availability of EML, NML, SML, and BML are 0.99, 0.98, 0.95, and 0.90 respectively, what is the overall TMN system availability?", a: "A_sys = 0.99 * 0.98 * 0.95 * 0.90 ≈ 0.829 or 82.9%.", type: "Numerical" },
    { q: "How does eTOM differ from the TMN framework?", a: "TMN defines a hierarchical framework based on technology and network levels, whereas eTOM (enhanced Telecom Operations Map) is a business-process framework that focuses on customer-centric and business operations.", type: "Conceptual" },
    { q: "In a mobile network, where would a node-specific element manager (EMS) for a gNodeB base station fit in the TMN hierarchy?", a: "It fits in the Element Management Layer (EML), acting as the direct mediator between the physical network element and the higher Network Management Layer (NML).", type: "Conceptual" },
    { q: "Why is high availability at the EML and NML layers more critical than at the BML layer for real-time fault monitoring?", a: "Because EML and NBI paths handle real-time alarms and network telemetry. If EML fails, the network loses visibility and control over faults, whereas a BML failure only delays business-level decisions or billing audits.", type: "Analytical" }
  ],
  virtualLab: {
    description: "Interactive TMN Layer Availability Simulator. Find the critical path and observe how system availability decreases as layers are added in series.",
    interpretation: "The simulation demonstrates the product rule of series systems. Even if individual layers have 99% availability, the compounded availability drops as more dependencies are introduced. This highlights the absolute necessity of high-availability clustering (redundancy) in core NMS/EMS databases.",
    parameters: [
      { id: "redundantLayers", name: "Active Redundant EML Nodes", min: 1, max: 3, default: 1, unit: " nodes" },
      { id: "baseAvailability", name: "Single Node Availability", min: 0.95, max: 0.999, default: 0.98, step: 0.001, unit: "" }
    ]
  }
};
