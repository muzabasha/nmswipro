import type { TopicData } from './types';

export const topic6Data: TopicData = {
  id: "u2t1",
  title: "Introduction to Model-Driven Management",
  moduleName: "Unit 2: Model-Driven Management and Protocols",
  context: {
    prerequisites: ["Topic 1.5: YANG Background & SNMP Limitations", "Data Serialization (JSON, XML)"],
    dependentTopics: ["Topic 2.2: YANG Data Model Structure Details", "Topic 2.3: NETCONF Protocol and Operations"],
    nextSteps: "Deep dive into the syntax and node types of YANG data schemas in the next topic."
  },
  storytelling: {
    analogy: "The Architectural Blueprint vs. Verbal Instructions",
    story: "If you ask five builders to build a house using only verbal instructions, you'll end up with five completely different houses, some without doors or windows. But if you give them a single standard blueprint (YANG schema), every room is guaranteed to have the exact dimensions specified. Model-Driven Management does exactly this: it replaces ad-hoc command-line scripting (CLI) and unstructured SNMP variables with a strict, formal blueprint of the device's state. Both the manager and the device agree on this blueprint before any message is sent.",
    reflectiveQuestions: ["Why do CLI scripts break when a vendor changes a command's text formatting?", "How does a formal schema prevent invalid IP addresses from being configured?"],
    technicalConnection: "Model-Driven Management separates the data model (the structure of configuration and state data, defined in YANG) from the transport protocol (how the data is moved, such as NETCONF or RESTCONF). This ensures vendor interoperability because regardless of the hardware vendor, the data structures conform to the same standard YANG models (like IETF or OpenConfig)."
  },
  mathModelling: {
    need: "To model the schema compatibility between vendor-specific extensions and standard YANG models using the Jaccard Similarity Index.",
    equation: "S(A, B) = \\frac{|A \\cap B|}{|A \\cup B|}",
    technicalDetails: "When integrating multi-vendor devices, an NMS checks the similarity between the vendor-supported YANG leaf nodes (set \\(A\\)) and the standard IETF YANG model leaf nodes (set \\(B\\)). The Jaccard Similarity Index \\(S(A, B)\\) ranges from 0 (completely incompatible) to 1 (perfectly compliant). A lower similarity score indicates that the vendor has added proprietary extensions, meaning the NMS must handle custom translation logic.",
    explanation: [
      { term: "S(A, B)", meaning: "Similarity Index between vendor model A and standard model B (0 to 1)." },
      { term: "|A \\cap B|", meaning: "The number of overlapping, identical leaf nodes supported by both models." },
      { term: "|A \\cup B|", meaning: "The total number of unique leaf nodes defined across both models combined." }
    ],
    advantages: ["Provides a numeric audit score for vendor schema compliance.", "Helps developers automate API gateway translations based on model overlap."],
    limitations: ["Does not account for differences in leaf data types or semantic behaviors between the schemas."],
    simulation: {
      description: "Adjust the number of shared leaves and vendor-specific leaves to observe the compliance similarity index.",
      parameters: [
        { id: "sharedLeaves", name: "Shared Nodes (|A ∩ B|)", min: 10, max: 100, default: 80, step: 5, unit: " nodes" },
        { id: "vendorLeaves", name: "Proprietary Nodes", min: 0, max: 50, default: 10, step: 2, unit: " nodes" }
      ]
    }
  },
  activities: {
    level1: "Teacher demonstrates an XML representation of an interface config and compares it to a YANG schema description.",
    level2: "Students map a basic JSON interface configuration block to a conceptual tree structure.",
    level3: "In groups, students audit a list of vendor configurations and count proprietary leaf additions to calculate the Jaccard similarity index.",
    level4: "Write a 150-word paper explaining the benefit of separating the modeling language (YANG) from the protocol (NETCONF/RESTCONF)."
  },
  projects: {
    scope: "Design a mock-up of a model validation agent.",
    objectives: ["Create a JSON file representing a target interface model", "Write a validation ruleset checklist for IP address formatting and MTU ranges"],
    deliverables: ["JSON sample configuration", "1-page validation ruleset document"]
  },
  questions: [
    { q: "What is the primary difference between a data model and a protocol in model-driven management?", a: "A data model (like YANG) defines the structure, constraints, and semantics of the data, whereas a protocol (like NETCONF) defines how that data is transmitted, secured, and operated upon.", type: "Conceptual" },
    { q: "If vendor model A defines 95 leaf nodes and standard model B defines 80 leaf nodes, and 75 leaf nodes are identical, what is the Jaccard compliance index S(A,B)?", a: "S(A, B) = 75 / (95 + 80 - 75) = 75 / 100 = 0.75 or 75%.", type: "Numerical" },
    { q: "Name two standards bodies or organizations that write common, vendor-neutral YANG models.", a: "IETF (Internet Engineering Task Force) and OpenConfig (operator-led group).", type: "Conceptual" },
    { q: "How does model-driven management solve the screen scraping problem of CLI-based automation?", a: "CLI outputs are unstructured text that can change unexpectedly. Model-driven management guarantees data is sent and received in structured formats (XML/JSON) that strictly conform to a pre-defined schema, preventing parsing crashes.", type: "Analytical" },
    { q: "Why is client-side configuration validation possible in a model-driven system?", a: "Because the client (NMS) has access to the device's YANG schema file, allowing it to validate data types, range limits, and regex constraints locally before sending any API requests to the device.", type: "Analytical" }
  ],
  virtualLab: {
    description: "YANG Schema Validation Lab. Try entering invalid values (e.g., text for an integer field, or out-of-range IPs) to see how the schema validator rejects the payload before it reaches the device.",
    interpretation: "Model-driven management catches configuration syntax and constraint errors client-side. This prevents corrupt configurations from ever loading onto the router, avoiding routing crashes and maintaining network uptime.",
    parameters: [
      { id: "validationStrictness", name: "Validation Level", min: 1, max: 3, default: 2, unit: " levels" }
    ]
  }
};
