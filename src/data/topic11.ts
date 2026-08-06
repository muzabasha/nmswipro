import type { TopicData } from './types';

export const topic11Data: TopicData = {
  id: "u1t11",
  title: "YANG Evolution & Background",
  moduleName: "Unit I: Introduction to Network Management and Frameworks",
  context: {
    prerequisites: ["SNMP Limitations and Operators Requirement", "SNMP Architecture"],
    dependentTopics: ["YANG Data Model Structure", "YANG Data Model Details Explanation", "NETCONF Protocol Concept"],
    nextSteps: "Study YANG Data Model Structure to learn how YANG modules, containers, lists, and leaves are organised and validated using pyang.",
    rfcReferences: [
      { rfc: "RFC 6020", title: "YANG 1.0 — A Data Modeling Language", summary: "The foundational YANG 1.0 specification (2010) that this topic traces as the key milestone replacing SMI/MIBs.", url: "https://www.rfc-editor.org/rfc/rfc6020" },
      { rfc: "RFC 7950", title: "YANG 1.1", summary: "YANG 1.1 (2016) adding actions, anydata, and improved XPath expressions — the current standard for model-driven management.", url: "https://www.rfc-editor.org/rfc/rfc7950" },
      { rfc: "RFC 2578", title: "SMI Version 2 (SMIv2)", summary: "Defines the Structure of Management Information used for SNMP MIBs — the predecessor data modelling approach that YANG replaced.", url: "https://www.rfc-editor.org/rfc/rfc2578" },
      { rfc: "RFC 6536", title: "NETCONF Access Control Model", summary: "Demonstrates how YANG models integrate with access control — showing the richer capability of YANG vs SMI.", url: "https://www.rfc-editor.org/rfc/rfc6536" }
    ]
  },
  storytelling: {
    analogy: "From Paper Forms to a Relational Database Schema",
    story: "Before YANG, configuring network devices was like managing a hospital with hand-written paper forms. Every vendor's device had a different form layout — Cisco's form looked nothing like Juniper's, Ericsson's had different fields entirely. SNMP MIBs were a step forward: a typed, structured form system (think carbon-copy forms with checkboxes). But MIBs were primarily designed for reading data, not writing configuration. Operators writing complex configurations still had to resort to CLI commands — unstructured, vendor-specific, and impossible to validate before sending. YANG (Yet Another Next Generation, RFC 6020 in 2010, RFC 7950 in 2016) was the shift to a relational database schema: every field has a strict data type, fields can have constraints and validation rules, the schema is hierarchical and reusable via groupings and imports, and the schema definition itself is machine-readable so tools can automatically generate code, validate data, and detect conflicts before a change touches a live device. NETCONF became the transaction engine that reads and writes against this schema — replacing CLI the way SQL replaced hand-written ledger entries. Just as a database schema prevents you from inserting a string into an integer column, a YANG model prevents you from assigning an invalid value to a network interface's MTU or an illegal BGP AS number.",
    reflectiveQuestions: [
      "What specific SNMP MIB limitations drove the IETF to develop a completely new data modelling language?",
      "How does YANG's 'augment' statement solve the vendor extension problem that proprietry SMI enterprise MIBs created?",
      "Why is YANG described as a 'data modelling language' rather than a management protocol?"
    ],
    technicalConnection: "RFC 6020 (YANG 1.0, 2010) and RFC 7950 (YANG 1.1, 2016) define the data modelling language for NETCONF. **YANG Module Structure**: module (top-level, defines namespace), yang-version 1.1, namespace \"http://example.com/...\", prefix (short alias), import (other modules), organization/contact, description, revision (version history), container/list/leaf/leaf-list (data nodes), grouping (reusable schema fragments), typedef (custom data types), augment (extend external modules), deviation (vendor-specific constraints). **YANG Types (18 built-in)**: int8/16/32/64, uint8/16/32/64, decimal64 (fixed-point), string, boolean, enumeration, bits, binary, leafref (reference to another leaf, enforces referential integrity), identityref (extensible enumeration), empty (presence flag), union (multiple type choices), instance-identifier (XPath to datastore node). **Constraints**: must (boolean XPath expression, e.g., \"must ./ipv4-address or ./ipv6-address\" enforces one address type present), when (conditional schema applicability), mandatory true/false, min-elements / max-elements (for lists/leaf-lists), pattern (regex for string validation). **YANG Tree Example** (ietf-interfaces RFC 8343): container interfaces { list interface { key \"name\"; leaf name {type string;} leaf type {type identityref {base interface-type;}} leaf enabled {type boolean; default true;} leaf mtu {type uint16; units \"octets\";} } }. **Deviation**: vendor restricts standard YANG model. Example: deviation \"/if:interfaces/if:interface/if:mtu\" { deviate replace {type uint16 {range \"1280..9000\";}} } replaces standard MTU range with vendor-specific. **OpenConfig**: industry consortium YANG models (openconfig-interfaces, openconfig-bgp) designed for multi-vendor interoperability. Focuses on operational state (config vs state leaves separation). Pyang tool: YANG compiler/validator, generates code bindings (Python pyangbind, Go ygot, Java JNIX)."
  },
  mathModelling: {
    need: "A network equipment vendor is designing the management data model for a new generation of 5G transport switches. They must choose between: proprietary MIB (extending standard MIB-II), vendor-specific YANG module, or adopting OpenConfig YANG models. The decision affects interoperability with NMS/OSS vendors, time-to-market for management features, and long-term maintenance cost. The constraint: the model must be machine-readable for auto-code-generation, support transactional configuration via NETCONF, and be extensible without forking by third-party OSS vendors.",
    equation: "DECISION CONSTRAINT: Model must be machine-parseable for NMS code auto-generation. Must support NETCONF transactional commit. Third-party OSS must be able to extend the model without modifying the vendor source. Time-to-market for first release ≤ 12 months.",
    technicalDetails: "Proprietary MIB: Well-understood by the engineering team, fast initial development. But: SMI type system lacks the expressiveness for 5G transport data (no decimal64, no leafref, no union types). Cannot be used directly with NETCONF — requires an additional YANG-to-MIB translation layer. OSS vendors cannot extend it cleanly. Auto-code-generation tools for MIBs are limited. Vendor-specific YANG: Leverages YANG's rich type system (18 types, 10+ constraints), natively supported by NETCONF and RESTCONF. Machine-readable with pyang/pyangbind auto-code-generation. Third parties can augment without modifying the source module. 12-month timeline achievable with YANG tooling. OpenConfig YANG: Pre-defined industry-standard models for common network functions. Reduces per-vendor differentiation but maximises NMS interoperability. Some 5G transport features not yet modelled in OpenConfig — requires augmentation. Preferred by cloud providers and webscalers.",
    explanation: [
      { term: "Proprietary MIB Extension", meaning: "Adopted by vendors with large installed bases of SNMP-based NMS customers who need backward compatibility. Now considered a legacy approach for new products. Fails the NETCONF and auto-code-generation constraints for new 5G products." },
      { term: "Vendor-Specific YANG Module (Recommended)", meaning: "Adopted when the vendor needs to model device-specific features that are not covered by any standard module, while still using a standard protocol (NETCONF) and tool ecosystem. Meets all constraints: machine-parseable, NETCONF-native, extensible via augment, 12-month timeline." },
      { term: "OpenConfig YANG Models", meaning: "Adopted when the target customer base includes cloud providers and webscalers who mandate OpenConfig for NMS interoperability. Reduces differentiation risk — multiple vendors supporting the same models means the customer can switch vendors easily. Preferred for commoditised device types (leaf switches, basic routers)." }
    ],
    advantages: [
      "Vendor-specific YANG enables modelling all device capabilities including proprietary features not in any standard",
      "YANG's augment mechanism allows OSS vendors to extend the model without the equipment vendor's involvement",
      "pyang and pyangbind generate Python bindings automatically — eliminating manual API client coding"
    ],
    limitations: [
      "OpenConfig is adopted when the customer base demands multi-vendor interoperability and the vendor's competitive advantage is hardware, not software features",
      "Proprietary MIB is maintained alongside YANG for backward compatibility with existing SNMP-based NMS customers during the transition period",
      "IETF standard YANG modules (ietf-interfaces, ietf-routing) are adopted for well-established functions to maximise ecosystem compatibility"
    ]
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
    description: "You are a data model architect evaluating whether to adopt YANG or continue using SMI-based MIBs for a new network device. Your task: calculate the expressiveness advantage YANG gives you over SMI for defining data constraints. Adjust the number of YANG built-in types and constraint constructs. The chart shows the expressiveness ratio vs SMI (fixed at 8 types + 2 constraints) — a ratio of 3 means YANG can express 3× as many distinct data constraints as SMI. Use this to justify the YANG migration to your standards board.",
    interpretation: "Each additional YANG constraint mechanism (must, when, pattern, unique, etc.) directly represents a type of data integrity rule that the NETCONF server enforces automatically — eliminating an entire category of configuration error that previously required manual operator review. With 18 types and 10 constraints, YANG is 2.8× more expressive than SMI. This means a YANG-based device can catch 3× as many invalid configurations before they reach the network. In production, this translates to fewer mis-configurations, faster automated rollouts, and reduced change-window durations.",
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
