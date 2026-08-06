import type { TopicData } from './types';

export const topic15Data: TopicData = {
  id: "u2t3",
  title: "YANG Data Model Details Explanation",
  moduleName: "Unit II: Model-Driven Management and Protocols",
  context: {
    prerequisites: ["YANG Data Model Structure"],
    dependentTopics: ["NETCONF Protocol Concept", "RESTCONF Protocol Concept"],
    nextSteps: "Study NETCONF Protocol Concept to understand how YANG models are used in NETCONF datastores and RPC operations.",
    rfcReferences: [
      { rfc: "RFC 7950", title: "YANG 1.1", summary: "Defines typedef, grouping, uses, augment, deviation, rpc, and notification — all the advanced constructs explained in this topic.", url: "https://www.rfc-editor.org/rfc/rfc7950" },
      { rfc: "RFC 8342", title: "Network Management Datastore Architecture", summary: "Defines how YANG-modelled datastores (running, intended, operational) interact with NETCONF — motivating why RPC and notification constructs are needed.", url: "https://www.rfc-editor.org/rfc/rfc8342" },
      { rfc: "RFC 7224", title: "IANA Interface Type YANG Module", summary: "A real-world example of YANG typedef and identity constructs used for interface-type enumeration.", url: "https://www.rfc-editor.org/rfc/rfc7224" }
    ]
  },
  storytelling: {
    analogy: "Advanced Blueprinting — Reusable Templates and Change Orders",
    story: "Once you know the basic YANG building blocks (containers, lists, leafs), the advanced constructs let you build enterprise-grade models. A typedef is a reusable type definition — like defining 'VlanId' as uint16 with range 1..4094 once and using it everywhere instead of repeating the range constraint in every leaf. A grouping is a reusable schema fragment — like a template clause in a contract that gets referenced wherever the same set of fields appear (e.g., a 'common-interface-params' grouping used by both physical and logical interfaces). An augment inserts new nodes into another module's tree — like a contractor adding a change order to the original blueprint, extending the standard ietf-interfaces model with vendor-specific statistics without modifying the original. A deviation documents that a specific device cannot support part of the standard model — like a building code exemption that says 'this structure does not implement the fire-suppression requirement.' An RPC defines an operational action with input and output — like a formal work order with a defined response format.",
    reflectiveQuestions: [
      "How does YANG grouping improve code reuse compared to duplicating leaf definitions across multiple containers?",
      "When should you use deviation vs augment, and what are the risks of using deviation excessively?",
      "How do YANG RPC definitions differ from YANG container/list definitions in terms of NETCONF protocol handling?"
    ],
    technicalConnection: "RFC 7950 §7 Advanced YANG Constructs: **typedef** (§7.3): defines derived type with refinements. Example: typedef percent { type uint8 { range '0..100'; } description 'Percentage value'; }. Used as: leaf utilization { type percent; }. **grouping** (§7.12): reusable schema template. Syntax: grouping interface-stats { leaf in-octets { type yang:counter64; } leaf out-octets { type yang:counter64; } leaf error-count { type uint32; config false; } }. **uses** statement incorporates grouping: uses interface-stats; expands to all grouped nodes. **augment** (§7.17): extends external module tree without forking. Example: augment '/if:interfaces/if:interface' { when \"derived-from-or-self(type, 'ianaift:ethernetCsmacd')\"; leaf auto-negotiate { type boolean; default true; } leaf duplex { type enumeration { enum half; enum full; } } }. Augment nodes inherit parent module's namespace. **deviation** (§7.20.3): documents implementation divergence. Types: deviate not-supported (feature absent), deviate add (adds constraints: mandatory true, must 'count(../vlan) <= 4094'), deviate replace (replaces type: type uint16 { range 1..100; }), deviate delete (removes default). **rpc** (§7.14): defines operational action. Example: rpc clear-interface-statistics { input { leaf interface-name { type leafref { path '/if:interfaces/if:interface/if:name'; } mandatory true; } } output { leaf status { type enumeration { enum success; enum failed; enum not-found; } } leaf message { type string; } } }. **notification** (§7.16): defines event sent to NMS. Example: notification link-state-change { leaf interface { type leafref { path '/if:interfaces/if:interface/if:name'; } } leaf new-state { type enumeration { enum up; enum down; } } leaf timestamp { type yang:date-and-time; } }. **action** (§7.15): RPC scoped to data node. Example: container interfaces { list interface { key name; action reset { input { leaf reset-type { type enumeration { enum hard; enum soft; } } } } } }. **anydata/anyxml** (§7.10/§7.11): opaque subtree holder for non-YANG data. **must/when constraints** (§7.5.3/§7.21.5): XPath boolean expressions. must 'count(../vlan-id) <= 4094' enforces cardinality. when '../enabled = \"true\"' makes node conditionally present."
  },
  mathModelling: {
    need: "A YANG model architect at a large operator is designing the data model for a new multi-vendor SDN controller. The model must cover 15 interface types, each sharing a common set of 8 leafs (mtu, description, enabled, oper-status, speed, duplex, in-octets, out-octets). The team must decide whether to duplicate these leafs in every interface container, or use YANG groupings. The technical constraint: any change to a shared leaf definition must propagate to all 15 interface types without manual repetition, and the total YANG model must stay under 500 lines for tooling performance.",
    equation: "DECISION CONSTRAINT: Shared leaf changes must propagate automatically (zero manual updates). Total model size ≤ 500 lines. Must support augment for vendor-specific extensions without modifying the base module. Must use NETCONF-compatible constructs (no non-standard extensions).",
    technicalDetails: "No Grouping (Full Duplication): 8 leafs × 15 interface types = 120 lines for shared leafs alone, plus structural boilerplate. Total model: ~450 lines. When a shared leaf definition changes (e.g., adding a unit to out-octets), the engineer must update 15 separate locations — high error risk. With YANG Grouping: Define one grouping 'interface-common' with 8 leafs (8 lines) + 15 uses statements (15 lines) = 23 lines for all shared content. A shared leaf change requires editing 1 grouping definition — zero risk of inconsistency. Total model: ~185 lines — 59% reduction. Code reduction R = 1 - (S+U)/(S×U) = 1 - (8+15)/(8×15) = 1 - 23/120 = 0.808 = 80.8%. With Augment for Vendor Extensions: Vendor A adds 3 proprietary leafs to the base /interfaces/interface tree using augment — base module unchanged. Vendor B adds 2 leafs. Both vendor modules coexist under different namespaces. The NMS can load only the vendor modules relevant to each device. Deviation for Restricted Devices: A low-cost CPE device does not support the duplex leaf — uses 'deviate not-supported'. NMS loads the deviation module for this device family and skips duplex configuration automatically.",
    explanation: [
      { term: "No Grouping — Full Duplication", meaning: "8 shared leafs duplicated across 15 interface types = 120 lines of repeated definitions. WHY REJECTED: Any change to a shared leaf (e.g., updating the description, adding a pattern constraint) requires 15 manual edits — high risk of inconsistency. Model exceeds 450 lines. WHEN ADOPTED: Acceptable for very small models (2–3 interface types) where the grouping overhead is not justified and long-term maintenance is not a concern." },
      { term: "YANG Grouping (Recommended)", meaning: "grouping 'interface-common' defines 8 leafs once. 15 uses statements reference it. Total: 23 lines vs 120 — 80.8% reduction. One edit to the grouping propagates to all 15 interface types automatically. WHY BEST: Meets both constraints — single-point-of-change and model size under 500 lines. Standard YANG practice (RFC 7950 Section 7.13). All NETCONF/RESTCONF tooling (pyang, libyang, Cisco NSO) handles groupings natively." },
      { term: "Augment for Vendor Extensions", meaning: "Vendor-specific modules augment the base /interfaces/interface tree without modifying it. WHY CORRECT: The base module remains standards-compliant and unmodified. Vendor augments are versioned independently. The NMS loads only relevant vendor modules per device. WHEN ADOPTED: Always used when extending standard models (ietf-interfaces, OpenConfig) with vendor-specific leafs — the standard practice across all major vendors (Cisco, Nokia, Juniper, Ericsson)." },
      { term: "Deviation for Restricted Devices", meaning: "'deviate not-supported' marks features a device cannot implement. WHY NECESSARY: Some devices do not implement every leaf in a standard model. The NMS must know this before generating configuration — otherwise it sends unsupported leafs and receives confusing NETCONF errors. WHEN ADOPTED: Used specifically to document device capability gaps, not as a design tool. Excessive deviations indicate a poorly-chosen base model." }
    ],
    advantages: [
      "YANG groupings reduce model size by over 80% when shared leafs are used across many containers, making the model maintainable and keeping it within tooling performance budgets",
      "Augments allow standard models to be extended without forking — vendor additions are namespaced separately and coexist with the base model without causing conflicts",
      "Deviations make device capability gaps explicit and machine-readable — the NMS can automatically skip unsupported configuration parameters per device family without hard-coded logic"
    ],
    limitations: [
      "Full duplication is adopted for very small, one-off models (2–3 types) where the grouping definition overhead is not justified and the model will not evolve",
      "Deep augment trees from multiple vendors on the same base module are adopted cautiously — they create complex data trees that require namespace-qualified XPath queries throughout the NMS",
      "Formal deviation files are adopted for every device family that cannot implement a standard model feature — skipping deviation documentation forces the NMS to rely on trial-and-error configuration"
    ]
  },
  activities: {
    level1: "Define each advanced YANG construct in one sentence with a concrete networking example: typedef (e.g., VlanId type), grouping (e.g., interface-counters group), uses (referencing a grouping), augment (e.g., adding vendor leaf to ietf-interfaces), deviation (e.g., marking unsupported feature), rpc (e.g., clear-interface-counters), notification (e.g., link-state-change event).",
    level2: "Write a YANG grouping called 'interface-statistics' containing three leafs: in-octets (uint64, config false), out-octets (uint64, config false), and error-count (uint32, config false). Then show how to use this grouping inside two different containers: 'physical-interface' and 'logical-interface'. Calculate the R_reuse for S=3 leafs, U=2 usages.",
    level3: "For a YANG model where S = 8 shared leafs are used in U = 10 places: calculate (a) L_without_grouping, (b) L_with_grouping, (c) R_reuse as a percentage. Then find the minimum number of usages U_min at which R_reuse first exceeds 50% for S = 8.",
    level4: "Write a YANG RPC called 'reset-interface' with input leaf 'interface-name' (string, mandatory true) and output leaf 'status' (enumeration with values: success, failed, not-found). Verify with pyang. Then write a corresponding NETCONF XML RPC request message invoking this RPC with interface-name = 'GigabitEthernet0/0'."
  },
  projects: {
    scope: "Build a modular YANG library for a multi-vendor network using typedef, grouping, augment, and deviation constructs, demonstrating code reuse and vendor-specific extension techniques.",
    objectives: [
      "Define a base YANG module 'network-common' with typedefs for common types (bandwidth-type, vlan-id-type, ip-prefix-type) and a grouping for standard interface counters",
      "Create a vendor-specific module 'vendor-ext' that augments ietf-interfaces with three additional vendor leafs, demonstrating the augment construct",
      "Create a second vendor module that uses deviation to mark two standard leafs as 'deviate not-supported', reflecting a constrained device",
      "Write a Python script that parses both modules with pyang API and calculates the actual R_reuse ratio for the shared grouping"
    ],
    deliverables: [
      "network-common.yang, vendor-ext.yang, and vendor-limited.yang YANG module files",
      "pyang tree output for all three modules showing the combined data tree",
      "R_reuse calculation: theoretical using the formula vs actual line counts in the YANG files",
      "Explanation report on when augment is preferable to deviation and the NMS implications of deviations"
    ]
  },
  questions: [
    {
      q: "What is the difference between a YANG typedef and a YANG grouping?",
      a: "A typedef defines a reusable scalar type with constraints and optionally a default value. It is used in leaf type statements. Example: 'typedef vlan-id { type uint16 { range 1..4094; } description \"802.1Q VLAN identifier\"; }' — this can then be used as 'type vlan-id' in any leaf. A grouping, by contrast, defines a reusable set of schema nodes (leafs, containers, lists) that is incorporated into another context by a 'uses' statement. Example: 'grouping interface-counters { leaf in-octets { type uint64; } leaf out-octets { type uint64; } }' — used as 'uses interface-counters' inside any container. The key difference: typedef reuses a type (a scalar value pattern), grouping reuses a structural fragment (a set of nodes). typedef appears in type statements; grouping appears in uses statements.",
      type: "Conceptual"
    },
    {
      q: "How does augment work in YANG, and what are the risks of using it from multiple vendors on the same base module?",
      a: "augment /target/path { new-nodes } inserts new nodes into a target module's data tree without modifying the target module. For example, 'augment /ietf-if:interfaces/ietf-if:interface { leaf vendor-cpu-usage { type uint8; } }' adds a vendor-specific leaf to every interface entry in the standard ietf-interfaces model. The augmented nodes are namespaced by the augmenting module, so they coexist without collision. Risks of multiple vendor augments on the same base module: (1) data tree explosion — the NMS must process combined trees from all vendor modules plus the base, increasing parsing overhead; (2) name ambiguity — if two vendors augment with similarly-named leafs, NMS query logic must always namespace-qualify paths; (3) model compatibility — augments may conflict in their must/when constraints, causing valid data in one vendor's context to be invalid in another's; (4) tooling complexity — NMS configuration generators must know which vendor modules apply to each device and load the corresponding augments per-device.",
      type: "Analytical"
    },
    {
      q: "For S = 6 shared leafs used in U = 8 places, calculate L_without_grouping, L_with_grouping, and R_reuse.",
      a: "L_without_grouping = S × U = 6 × 8 = 48 lines (all leafs duplicated at every usage site). L_with_grouping = S + U = 6 + 8 = 14 lines (grouping definition + one uses statement per usage). R_reuse = 1 - L_with / L_without = 1 - 14/48 = 1 - 0.2917 = 0.7083 = 70.8% code reduction. This means using a grouping eliminates 70.8% of the lines compared to full duplication, and as U increases further the savings approach 100%.",
      type: "Numerical"
    },
    {
      q: "What is a YANG deviation, and when is it appropriate to use it?",
      a: "A YANG deviation is a statement that documents differences between a standard or base YANG model and what a specific device actually implements. Syntax: 'deviation /target/path { deviate not-supported; }' (or deviate add/replace/delete). It is appropriate when: (1) a device does not implement a mandatory feature of a standard model (e.g., an older switch that does not support the oper-speed leaf in ietf-interfaces); (2) a device has a restricted value range for a parameter (deviate replace type uint32 { range 0..100; }); (3) a device requires additional mandatory parameters not in the standard (deviate add mandatory true). Deviations are NOT appropriate as a general-purpose extension mechanism — that is what augment is for. Excessive deviations create maintenance burden because every NMS must load device-specific deviation modules and apply them before generating configuration, producing a different effective schema per device model.",
      type: "Conceptual"
    },
    {
      q: "How does a YANG RPC differ from a YANG container, and how does NETCONF handle RPC invocation?",
      a: "A YANG container defines configuration or state data that persists in a datastore. It is read via get/get-config and written via edit-config. A YANG RPC defines an operational action (like a procedure call) that is invoked on-demand, produces an immediate response, and does not persist data in the datastore. YANG RPC structure: 'rpc rpc-name { input { ...leafs... } output { ...leafs... } }'. NETCONF handles RPC invocation via the rpc XML element with a message-id, containing the operation XML element named after the RPC (in the YANG module's namespace), with input children. The device executes the action and returns an rpc-reply with either an ok element (for RPCs with no output) or the output data structure. Example: invoking 'clear-counters' RPC with input interface-name='eth0' is sent as an XML RPC message; the device clears the counters and returns status='success' in the output. Unlike edit-config, RPC invocations are not part of the candidate datastore and cannot be rolled back.",
      type: "Analytical"
    }
  ],
  virtualLab: {
    description: "You are a YANG module designer deciding whether to refactor repeated node sets into groupings. Your task: calculate the code size reduction achieved by using a grouping instead of duplicating leaf definitions. Adjust the number of shared leaf nodes in the grouping and the number of times the grouping is reused across your module. The chart shows code reduction percentage — even modest reuse delivers significant savings. Find the minimum reuse count where grouping adoption is justified.",
    interpretation: "With just 8 shared leafs used 3 times, code reduction reaches 58% — you cut the YANG source size by more than half for those nodes. At 8 uses, reduction is 78%. The curve is steepest at low usage counts, meaning even groupings used 3-4 times provide substantial value. The practical takeaway: always extract a grouping when the same leaf set appears in more than 2 places. The minimal refactoring effort yields outsized maintainability and readability benefits, and pyang's tree output automatically resolves grouping references for documentation.",
    parameters: [
      { id: "shared", name: "Shared Leaf Count", min: 1, max: 20, default: 8, step: 1, unit: "" },
      { id: "usages", name: "Times Used", min: 2, max: 20, default: 8, step: 1, unit: "" }
    ],
    generateData: (params) => {
      const shared = params.shared || 8;
      const maxUsages = params.usages || 8;
      const pts: Array<{ x: number; y: number }> = [];
      for (let x = 2; x <= maxUsages; x++) {
        const without = shared * x;
        const withGrouping = shared + x;
        const ratio = (1 - withGrouping / without) * 100;
        pts.push({ x, y: parseFloat(ratio.toFixed(1)) });
      }
      return pts;
    },
    labels: { x: "Times Used", y: "Code Reduction (%)" }
  }
};
