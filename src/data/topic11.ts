import type { TopicData } from './types';

export const topic11Data: TopicData = {
  id: "u1t11",
  title: "YANG Evolution & Background",
  moduleName: "Unit I: Introduction to Network Management and Frameworks",
  context: {
    prerequisites: ["SNMP Limitations and Operators Requirement", "SNMP Architecture"],
    dependentTopics: ["YANG Data Model Structure", "YANG Data Model Details Explanation", "NETCONF Protocol Concept"],
    nextSteps: "Study YANG Data Model Structure to learn how YANG modules, containers, lists, and leaves are organised and validated using pyang."
  },
  storytelling: {
    analogy: "From Paper Forms to a Relational Database Schema",
    story: "Before YANG, configuring network devices was like managing a hospital with hand-written paper forms. Every vendor's device had a different form layout — Cisco's form looked nothing like Juniper's, Ericsson's had different fields entirely. SNMP MIBs were a step forward: a typed, structured form system (think carbon-copy forms with checkboxes). But MIBs were primarily designed for reading data, not writing configuration. Operators writing complex configurations still had to resort to CLI commands — unstructured, vendor-specific, and impossible to validate before sending. YANG (Yet Another Next Generation, RFC 6020 in 2010, RFC 7950 in 2016) was the shift to a relational database schema: every field has a strict data type, fields can have constraints and validation rules, the schema is hierarchical and reusable via groupings and imports, and the schema definition itself is machine-readable so tools can automatically generate code, validate data, and detect conflicts before a change touches a live device. NETCONF became the transaction engine that reads and writes against this schema — replacing CLI the way SQL replaced hand-written ledger entries. Just as a database schema prevents you from inserting a string into an integer column, a YANG model prevents you from assigning an invalid value to a network interface's MTU or an illegal BGP AS number.",
    reflectiveQuestions: [
      "What specific SNMP MIB limitations drove the IETF to develop a completely new data modelling language?",
      "How does YANG's 'augment' statement solve the vendor extension problem that proprietry SMI enterprise MIBs created?",
      "Why is YANG described as a 'data modelling language' rather than a management protocol?"
    ],
    technicalConnection: "YANG (RFC 6020 / RFC 7950) was developed by the IETF NETMOD working group as the data modelling language for NETCONF (RFC 6241). It replaces SMI (Structure of Management Information) used for SNMP MIBs. Key YANG constructs: module (top-level namespace unit), container (grouping node with no value), list (table with key), leaf (scalar value with type), leaf-list (typed array), typedef (reusable type definition), grouping (reusable schema fragment), augment (extend another module's schema), deviation (vendor-specific constraint). YANG 1.1 (RFC 7950) added: actions, notifications, anydata, and improved must/when expressions. Standard YANG models are maintained by IETF (ietf-interfaces, ietf-routing), OpenConfig (openconfig-interfaces), and 3GPP."
  },
  mathModelling: {
    need: "To quantify the expressiveness advantage of YANG over SMI (the MIB definition language for SNMP) in terms of supported data types and constraint mechanisms, motivating the transition to model-driven management.",
    equation: "E = \\frac{|T_{\\text{YANG}}| + |C_{\\text{YANG}}|}{|T_{\\text{SMI}}| + |C_{\\text{SMI}}|}",
    technicalDetails: "\\( E \\) is the expressiveness ratio of YANG relative to SMI. \\( |T_{\\text{YANG}}| \\) counts YANG's built-in types: string, boolean, int8, int16, int32, int64, uint8, uint16, uint32, uint64, decimal64, binary, bits, enumeration, identityref, instance-identifier, leafref, union, empty — approximately 18 types. SMI base types \\( |T_{\\text{SMI}}| \\): INTEGER, OCTET STRING, OBJECT IDENTIFIER, IpAddress, Counter32, Gauge32, TimeTicks, Opaque — 8 types. \\( |C_{\\text{YANG}}| \\) counts constraint constructs in YANG: must (boolean XPath assertion), when (conditional presence), pattern (regex), range, length, min-elements, max-elements, mandatory, unique — approximately 10. SMI constraints \\( |C_{\\text{SMI}}| \\): DEFVAL (default value), SIZE constraint — approximately 2. \\( E = (18 + 10) / (8 + 2) = 28 / 10 = 2.8 \\). YANG is roughly 2.8× more expressive than SMI for defining managed data models.",
    explanation: [
      { term: "E", meaning: "Expressiveness ratio of YANG vs SMI" },
      { term: "|T_{\\text{YANG}}|", meaning: "Number of YANG built-in data types (~18)" },
      { term: "|C_{\\text{YANG}}|", meaning: "Number of YANG constraint constructs (~10)" },
      { term: "|T_{\\text{SMI}}|", meaning: "Number of SMI base data types (~8)" },
      { term: "|C_{\\text{SMI}}|", meaning: "Number of SMI constraint mechanisms (~2)" }
    ],
    advantages: [
      "YANG models are machine-readable and enable automatic code generation, documentation, and validation tooling (pyang, pyangbind)",
      "YANG supports both configuration data and operational state in a single unified model — SMI only modelled operational state",
      "Extensible via augment and deviation without modifying base modules — safe multi-vendor extension",
      "YANG 1.1 adds actions and notifications as first-class model constructs, replacing ad-hoc SNMP trap definitions"
    ],
    limitations: [
      "YANG has a steeper learning curve than SMI — XPath expressions in must/when statements require additional expertise",
      "Large, deeply nested YANG models can be difficult to navigate and understand without tooling",
      "Tooling maturity for YANG compilation and validation varies significantly across vendors"
    ],
    simulation: {
      description: "Vary the number of YANG constraint constructs to see how the expressiveness ratio vs SMI changes. Built-in types are fixed at 18 for YANG and 8 for SMI. SMI constraints are fixed at 2.",
      parameters: [
        { id: "yangTypes", name: "YANG Types", min: 8, max: 25, default: 18, step: 1, unit: "" },
        { id: "yangConstraints", name: "YANG Constraints", min: 2, max: 15, default: 10, step: 1, unit: "" }
      ],
      generateData: (params) => {
        const yT = params.yangTypes || 18;
        const maxYC = params.yangConstraints || 10;
        const smiT = 8;
        const smiC = 2;
        const pts: Array<{ x: number; y: number }> = [];
        for (let yC = 2; yC <= maxYC; yC++) {
          const ratio = (yT + yC) / (smiT + smiC);
          pts.push({ x: yC, y: parseFloat(ratio.toFixed(2)) });
        }
        return pts;
      },
      labels: { x: "YANG Constraint Constructs", y: "Expressiveness Ratio vs SMI" }
    }
  },
  activities: {
    level1: "List 5 specific limitations of SNMP MIBs (SMI) that motivated the IETF NETMOD working group to develop YANG. For each limitation, state the corresponding YANG feature that addresses it.",
    level2: "Write a minimal YANG module stub (10–15 lines) defining a container 'interface' with the following leaves: name (string), enabled (boolean), mtu (uint16, range 68..65535), and description (string, optional). Include a module header with namespace and prefix.",
    level3: "Calculate the YANG expressiveness ratio E for: T_YANG = 18, C_YANG = 10, T_SMI = 8, C_SMI = 2. Then recalculate assuming YANG 1.1 added 3 more constraint constructs. State the change in E.",
    level4: "Research the YANG evolution timeline: SMI/MIBs (1990) → SPPI (2002) → NETCONF (2006, RFC 4741) → YANG 1.0 (2010, RFC 6020) → YANG 1.1 (2016, RFC 7950). For each milestone, write 2-3 sentences on the key problem it solved and the standards body responsible."
  },
  projects: {
    scope: "Design and validate a YANG data model for a university campus network's interface and VLAN management module.",
    objectives: [
      "Define a YANG module with container, list (keyed by interface name), leaf, and leaf-list nodes for interface and VLAN data",
      "Add must and when constraints: MTU must be ≥ 68, VLAN ID must be between 1 and 4094, enabled must be set before configuring IP address",
      "Validate the model using pyang or yangvalidator.org and resolve any reported errors"
    ],
    deliverables: [
      "YANG module file (.yang) with documented constructs and inline comments explaining design choices",
      "pyang validation output showing zero errors and warning resolution notes",
      "Side-by-side comparison table: SMI MIB definition vs YANG module for the same 5 managed objects"
    ]
  },
  questions: [
    {
      q: "What does YANG stand for, and which RFC defines YANG version 1.1?",
      a: "YANG stands for 'Yet Another Next Generation'. It was intentionally named to acknowledge that previous attempts at solving the network management data modelling problem (SMI, PIB, SPPI) had been made. YANG version 1.0 is defined in RFC 6020 (October 2010). YANG version 1.1, which added significant enhancements including actions, anydata, improved notification support, and more powerful XPath expressions in must/when statements, is defined in RFC 7950 (August 2016). YANG was developed by the IETF NETMOD (Network Modeling) working group as the data modelling language for NETCONF (RFC 6241).",
      type: "Conceptual"
    },
    {
      q: "List 5 YANG built-in data types that are not present in SMI base types.",
      a: "Five YANG built-in types not present in SMI: (1) boolean — explicit true/false type (SMI uses INTEGER with values 1/2); (2) decimal64 — 64-bit signed decimal number with configurable fraction digits, enabling precise representation of rates and ratios (SMI has no decimal type); (3) bits — a set of named bit flags in a bit field (SMI has no native bits type); (4) union — a type that is the union of multiple types, allowing a leaf to accept a value matching any one of its member types; (5) identityref — a reference to a globally unique identity defined in a YANG identity statement, enabling extensible enumeration across modules (SMI has no equivalent mechanism). Additional YANG-only types: leafref, instance-identifier, anydata.",
      type: "Conceptual"
    },
    {
      q: "Calculate the YANG expressiveness ratio E for T_YANG = 22, C_YANG = 13, T_SMI = 8, C_SMI = 4.",
      a: "E = (T_YANG + C_YANG) / (T_SMI + C_SMI) = (22 + 13) / (8 + 4) = 35 / 12 ≈ 2.92. YANG is approximately 2.92 times more expressive than SMI for these parameter values. This means YANG can express nearly 3 times as many distinct data model constraints and type nuances compared to SMI, directly enabling more precise, self-validating network configuration models.",
      type: "Numerical"
    },
    {
      q: "How does YANG's 'augment' statement solve the vendor extension problem that SMI enterprise MIBs created?",
      a: "In SMI, vendors extended standard MIBs by creating entirely separate enterprise MIBs rooted at their private OID subtree (1.3.6.1.4.1.{vendor-id}). This meant vendor extensions lived in a completely separate namespace with no formal structural relationship to the standard MIB they were extending — an NMS had to load both and manually correlate them. YANG's 'augment' statement allows a vendor (or any standards body) to formally inject new nodes into an existing module's schema tree at a precisely specified XPath location. For example: augment /if:interfaces/if:interface { leaf cisco-speed-mismatch-detection { type boolean; } } — this inserts a Cisco-specific leaf directly into the standard ietf-interfaces module's interface list. The augmented node becomes part of the same schema tree, with a formal namespace reference, making the relationship machine-readable and enabling NETCONF servers to validate both standard and vendor-extended data in a single operation.",
      type: "Analytical"
    },
    {
      q: "What is the relationship between YANG models and NETCONF datastores?",
      a: "YANG models define the schema — the structure, types, and constraints — for the data that NETCONF manages. NETCONF datastores (running, candidate, startup) store instances of data that conform to one or more YANG models. Specifically: the running datastore holds the currently active configuration of all YANG-modelled features; the candidate datastore allows tentative edits to be staged and validated before committing to running; the startup datastore holds the configuration applied on next boot. When a NETCONF client sends an edit-config RPC, the NETCONF server validates the XML payload against the YANG models it supports — if the data violates any YANG constraint (wrong type, out-of-range value, failed must expression), the server rejects the edit and returns an error. This is the fundamental advantage over SNMP SET: NETCONF+YANG provides schema-validated, transactional configuration management, while SNMP SET has no transactional semantics and limited type validation.",
      type: "Conceptual"
    }
  ],
  virtualLab: {
    description: "Vary the number of YANG built-in types and constraint constructs to observe how the expressiveness ratio relative to SMI changes. SMI parameters are fixed at 8 types and 2 constraints. This illustrates why YANG's richer type system and constraint language make it fundamentally more capable than SMI for defining precise, self-validating network management data models.",
    interpretation: "As YANG's constraint construct count increases, the expressiveness ratio grows linearly. Each additional constraint mechanism (must, when, pattern, unique, etc.) represents a class of data integrity rule that can be enforced automatically at the NETCONF server, eliminating a category of configuration error that would previously have required manual operator verification. This directly translates to fewer mis-configurations and faster, safer automated network changes.",
    parameters: [
      { id: "yangTypes", name: "YANG Types", min: 8, max: 25, default: 18, step: 1, unit: "" },
      { id: "yangConstraints", name: "YANG Constraints", min: 2, max: 15, default: 10, step: 1, unit: "" }
    ],
    generateData: (params) => {
      const yT = params.yangTypes || 18;
      const maxYC = params.yangConstraints || 10;
      const smiT = 8;
      const smiC = 2;
      const pts: Array<{ x: number; y: number }> = [];
      for (let yC = 2; yC <= maxYC; yC++) {
        const ratio = (yT + yC) / (smiT + smiC);
        pts.push({ x: yC, y: parseFloat(ratio.toFixed(2)) });
      }
      return pts;
    },
    labels: { x: "YANG Constraint Constructs", y: "Expressiveness Ratio vs SMI" }
  }
};
