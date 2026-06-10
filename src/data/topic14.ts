import type { TopicData } from './types';

export const topic14Data: TopicData = {
  id: "u2t2",
  title: "YANG Data Model Structure",
  moduleName: "Unit II: Model-Driven Management and Protocols",
  context: {
    prerequisites: ["Introduction to Model-Driven Management", "YANG Evolution & Background"],
    dependentTopics: ["YANG Data Model Details Explanation", "NETCONF Protocol Concept"],
    nextSteps: "Study YANG Data Model Details Explanation to understand advanced constructs: typedef, grouping, augment, deviation, and RPC definitions.",
    rfcReferences: [
      { rfc: "RFC 7950", title: "YANG 1.1", summary: "The current YANG specification defining all constructs discussed: module, container, list, leaf, leaf-list, and their full type system.", url: "https://www.rfc-editor.org/rfc/rfc7950" },
      { rfc: "RFC 7223", title: "YANG Data Model for Interface Management", summary: "A real-world YANG module using container, list keyed by name, and leaf constructs — a practical example of the structures covered in this topic.", url: "https://www.rfc-editor.org/rfc/rfc7223" },
      { rfc: "RFC 6020", title: "YANG 1.0", summary: "The original YANG specification introducing the core container/list/leaf tree structure analysed in this topic.", url: "https://www.rfc-editor.org/rfc/rfc6020" }
    ]
  },
  storytelling: {
    analogy: "A Database Schema Designer's Toolkit",
    story: "A YANG module is like designing a relational database schema. The module itself is the database — it has a name, a namespace (unique identifier), and a prefix. Containers are like tables that group related fields but have no primary key themselves — they just hold things. Lists are the real tables — they have one or more key leafs (like a primary key) and can have multiple instances. Leafs are the individual columns — each with a specific data type (uint32, string, boolean). Leaf-lists are like a column that stores an array of values. Together these four constructs — module, container, list, leaf — can model any network configuration data structure: interfaces, BGP neighbors, VLANs, routing tables.",
    reflectiveQuestions: [
      "When would you use a YANG list vs a container to model network data?",
      "How does the key statement in a YANG list affect how NETCONF clients navigate the data tree?",
      "What is the difference between a config true and config false leaf in YANG, and why does this matter for operational monitoring?"
    ],
    technicalConnection: "YANG module structure: module name { namespace; prefix; import; revision; container/list/leaf/leaf-list/typedef/grouping/augment/rpc/notification }. A leaf has: type (string/uint32/boolean/enumeration/bits/etc.), mandatory, default, description, must, when. A list has: key (one or more leaf names as primary key), min-elements, max-elements, ordered-by (user or system). config true = writable configuration data; config false = read-only operational state data returned by get but not edit-config."
  },
  mathModelling: {
    need: "A network automation team at a tier-1 operator must define YANG data models for 500 managed interfaces across a multi-vendor fleet (Cisco, Nokia, Juniper). They must choose between vendor-proprietary YANG models, standard IETF YANG models (RFC 7223 ietf-interfaces), or OpenConfig models. The constraint: a single NMS must retrieve interface state from all three vendors without device-specific parsing logic, and new device onboarding must take under 2 hours per device.",
    equation: "DECISION CONSTRAINT: Zero vendor-specific parsing code in the NMS. New device onboarding time ≤ 2 hours. Must model container, list, leaf, and leaf-list constructs for interface configuration and state. Must support NETCONF get-config and get operations.",
    technicalDetails: "Vendor-Proprietary YANG: Each vendor exposes its own YANG tree (e.g., Cisco: openconfig-interfaces + cisco-extensions, Juniper: junos-config). The NMS must implement three separate parsers — one per vendor. Onboarding a new device type: 4–6 hours of parser development. Current technical debt: 3 vendor parsers × 500 interfaces = 1,500 parsing pathways to maintain. IETF ietf-interfaces (RFC 7223): Standardised container /interfaces/interface[name], with leafs for type, enabled, oper-status. All three vendors support it. The NMS has one parser. Onboarding a new device: load its YANG capability announcement, confirm ietf-interfaces support, done — under 30 minutes. Coverage limitation: vendor-specific features (e.g., Cisco's storm-control, Juniper's damping) require augments. OpenConfig Models: Similar to IETF but richer (supports both config and state subtrees in one model). Supported by all three vendors with deviations. Adds a deviation processing step during onboarding (15 minutes). Best long-term choice for greenfield NMS. Hybrid (IETF base + Vendor Augments): Recommended for this fleet — use ietf-interfaces as the base path for all state polling, use vendor augments only for vendor-specific configuration parameters. Single NMS parser for state, supplemented by vendor-specific augment handlers only where needed.",
    explanation: [
      { term: "Vendor-Proprietary YANG Models", meaning: "Each vendor maintains its own YANG namespace and tree layout. WHY REJECTED: Requires 3 separate NMS parsers. Onboarding a new device model takes 4–6 hours of parser development. As the fleet expands from 500 to 5,000 interfaces, maintenance cost grows linearly with vendor count. WHEN ADOPTED: Acceptable when the entire fleet is single-vendor (e.g., all-Cisco or all-Nokia) and the NMS is vendor-provided (e.g., Cisco NSO managing only Cisco devices)." },
      { term: "IETF ietf-interfaces Standard Models", meaning: "RFC 7223 defines /interfaces/interface[name] with standard leafs. All three vendors support the path. One NMS parser handles all vendors. Onboarding: load capability, verify ietf-interfaces in hello, done in under 30 minutes. WHY ADEQUATE: Meets the zero-vendor-specific-code and 2-hour onboarding constraints. Limitation: does not expose advanced vendor features without augments. WHEN ADOPTED: Correct for multi-vendor fleets where standard FCAPS functions (interface state, counters) are the primary use case." },
      { term: "OpenConfig Models (Recommended for new builds)", meaning: "OpenConfig provides richer, community-maintained models covering both config and state subtrees (using the config/state separation pattern). Supported by all three vendors with published deviation files. Deviation processing adds 15 minutes to onboarding. WHY BEST FOR NEW NMS: Covers interface, BGP, MPLS, QoS, and more in a single consistent namespace — enabling a single NMS parser across all protocol domains. WHEN ADOPTED: Greenfield NMS builds or major NMS platform migrations where the operator can accept a 3–6 month YANG library migration effort." },
      { term: "Hybrid: IETF base + Vendor Augments (Recommended for this case)", meaning: "Use ietf-interfaces for standard state polling (one parser). Use vendor augment namespaces only for vendor-specific config parameters. WHY BEST FOR THIS CASE: Meets the zero-vendor-specific-code constraint for 90% of NMS operations. Only 10% of operations (vendor-specific config) require augment handling. Onboarding: 30–45 minutes. Balances standards compliance with access to vendor-specific features." }
    ],
    advantages: [
      "Standard YANG models (IETF or OpenConfig) eliminate vendor-specific parsing code — one NMS parser handles the entire multi-vendor fleet",
      "NETCONF capability exchange at session open tells the NMS exactly which YANG modules a device supports — enabling automatic model selection without manual configuration per device",
      "Hierarchical YANG structure (module → container → list → leaf) maps directly to the operator's configuration hierarchy, making model authoring intuitive for network engineers"
    ],
    limitations: [
      "Vendor-proprietary models are adopted when the fleet is 100% single-vendor and vendor tools (Cisco NSO, Nokia NSP) are the NMS — avoiding the abstraction overhead of standard models",
      "OpenConfig is adopted for greenfield builds where the operator is willing to invest 3–6 months in library migration in exchange for long-term multi-domain consistency",
      "Hybrid IETF + augments is adopted for existing multi-vendor fleets where a full OpenConfig migration is impractical but zero-vendor-code for standard operations is achievable immediately"
    ]
  },

  activities: {
    level1: "Identify and define the five core YANG statement types with a real networking example for each: module (e.g., ietf-interfaces), container (e.g., interfaces grouping), list (e.g., interface list keyed by name), leaf (e.g., mtu as uint16), and leaf-list (e.g., dns-server as a list of IP addresses). State whether each construct can appear multiple times in a module.",
    level2: "Write a YANG snippet (15-20 lines) for a simple interface model: a container named 'interfaces' containing a list named 'interface' keyed by leaf 'name' (string), with additional leafs: 'enabled' (boolean, default true), 'mtu' (uint16, range 68..65535), and 'description' (string). Label each statement type and explain the role of the key statement.",
    level3: "Calculate the total node count for a YANG tree with branching factor b = 4 and depth L = 3. Show the calculation using the geometric series formula. Then determine which is larger: a tree with b = 2, L = 6 or b = 6, L = 2.",
    level4: "Download the ietf-interfaces YANG module (RFC 7223) from https://tools.ietf.org/html/rfc7223. Run pyang --format tree to display the full tree. Count: (a) the number of list nodes, (b) the number of config false leafs (operational state), (c) the maximum nesting depth. Verify your tree-node count estimate against the formula."
  },
  projects: {
    scope: "Design a complete YANG data model for a campus network's VLAN management system, covering VLAN definitions and their assignment to switch ports.",
    objectives: [
      "Define a YANG module 'campus-vlan' with namespace, prefix, and a revision statement documenting the model version",
      "Create a container 'vlans' containing a list 'vlan' keyed by 'vlan-id' (uint16, range 1..4094) with leafs: name (string), description (string), enabled (boolean)",
      "Create a container 'port-vlan-assignments' with a list 'assignment' keyed by port-name (string) with leafs: untagged-vlan (uint16) and a leaf-list tagged-vlans (uint16)",
      "Validate the module with pyang and generate the tree output — verify the expected node counts match the geometric series estimate"
    ],
    deliverables: [
      "campus-vlan.yang YANG module file with all containers, lists, leafs, and leaf-lists defined",
      "pyang --format tree output showing the complete data hierarchy",
      "Node count calculation: theoretical estimate using D_tree formula vs actual count from pyang output",
      "A brief report explaining why list was chosen over container for vlans and port-vlan-assignments"
    ]
  },
  questions: [
    {
      q: "What is the difference between a YANG container and a YANG list, and when should each be used?",
      a: "A YANG container is a node that groups related data nodes under a single parent — it is a singleton (appears at most once at any given position in the data tree) and has no key. It is used when there is exactly one instance of the group: for example, a 'system' container holding hostname, location, and contact. A YANG list is a sequence of zero or more instances, each uniquely identified by one or more key leafs. It is used when the same data structure repeats for different entities: for example, an 'interface' list keyed by 'name' because a device may have many interfaces. The key distinction is multiplicity: use container when there is exactly one instance; use list when there are multiple named instances. In NETCONF, list instances are accessed by their key values in the path — e.g., /interfaces/interface[name='eth0'] — while containers are accessed simply by name.",
      type: "Conceptual"
    },
    {
      q: "What does 'config false' mean on a YANG leaf, and how does NETCONF treat such nodes differently?",
      a: "In YANG, 'config false' marks a leaf (or any node) as operational state data — data that is observed or computed by the device rather than written by an operator. Examples include interface packet counters (ifInOctets), current operational status (oper-status), and CPU utilisation. NETCONF treats config false nodes as read-only: they are included in the response to a get RPC (which retrieves both configuration and state data), but they are not present in get-config responses (which retrieve only configuration data) and cannot be targeted by edit-config. Attempting to set a config false leaf via edit-config will result in an rpc-error. This separation between configuration (config true, the intent) and operational state (config false, the reality) is fundamental to model-driven management — it allows the NMS to separately track what was configured and what is actually happening.",
      type: "Conceptual"
    },
    {
      q: "Calculate the total YANG schema node count for b = 4, L = 4 and for b = 2, L = 8. Which model is larger?",
      a: "For b = 4, L = 4: total = (b^(L+1) - 1) / (b - 1) = (4^5 - 1) / (4 - 1) = (1024 - 1) / 3 = 1023 / 3 = 341 nodes. For b = 2, L = 8: total = (2^9 - 1) / (2 - 1) = (512 - 1) / 1 = 511 nodes. The b=2, L=8 tree has 511 nodes compared to 341 for b=4, L=4, so the deeper but narrower tree is larger. This illustrates that deep nesting increases node count faster than wide branching at shallow depths when the total 'b×L' product is similar. However, the b=4, L=4 tree reaches each leaf in 4 hops vs 8 hops for the b=2, L=8 tree, making path addressing shorter.",
      type: "Numerical"
    },
    {
      q: "Why must every YANG module have a unique namespace, and what problems arise if two modules share the same namespace?",
      a: "Every YANG module must have a unique namespace URI (e.g., 'urn:ietf:params:xml:ns:yang:ietf-interfaces') because YANG data is serialised in XML or JSON, and namespaces are the mechanism by which XML/JSON parsers disambiguate identically-named nodes from different modules. If two modules shared the same namespace, a NETCONF XML message containing a node named 'interface' would be ambiguous — parsers could not determine which module's type definitions and constraints apply. In practice this would cause NETCONF parsers to fail or misinterpret data. Unique namespaces also enable safe augmentation and imports: when module A imports module B, the namespace ensures that all type definitions and nodes from B are unambiguously prefixed (e.g., 'b:interface-type'). IANA and IETF maintain namespaces for standard modules; vendors use their own domain-based URNs for proprietary extensions.",
      type: "Analytical"
    },
    {
      q: "How does the 'ordered-by user' vs 'ordered-by system' statement in a YANG list affect NETCONF behaviour?",
      a: "In YANG, 'ordered-by system' (the default) means the server maintains list entries in an order determined by the system — typically sorted by key value. The NMS cannot control the order and should not rely on any specific ordering. 'ordered-by user' means the list maintains entries in the order the client inserted them, and the client can use NETCONF edit-config with insert attributes (insert='before', insert='after', insert='first', insert='last') to control the position of each entry. This matters significantly for: (1) ACL (access-control list) entries, where the order of entries determines which rule matches first — a user-ordered list is mandatory; (2) policy-map actions, where the sequence of operations must be preserved; (3) route-map clauses, which are evaluated in sequence. Using 'ordered-by system' for ACLs would be a serious model design error, as the server could arbitrarily reorder rules and change security policy behaviour.",
      type: "Analytical"
    }
  ],
  virtualLab: {
    description: "You are a YANG model designer deciding between a flat grouping-based structure and a deeply nested tree for a network device model. Your task: determine how fast node count grows as you increase tree depth and branching. Adjust the tree depth and branch factor. The chart shows total leaf nodes on a log scale — find the design point where the tree stays under 500 nodes (the practical limit for maintainable YANG models). Use this to decide: is depth-5 with branch-3 better than depth-3 with branch-6?",
    interpretation: "Node count grows exponentially: depth-4 with branch-factor 3 = 81 nodes (manageable), depth-6 with branch-factor 4 = 4,096 nodes (excessive). A single YANG module with over 1,000 nodes creates validation overhead during pyang checks, longer tooling response times, and cognitive overload for human readers. The design principle: keep tree depth ≤ 5 and branch factor ≤ 4. When you need more nodes, use YANG groupings to share common subtrees rather than deepening the hierarchy. This lab helps you make that design trade-off quantitatively.",
    parameters: [
      { id: "depth", name: "Tree Depth", min: 1, max: 8, default: 4, step: 1, unit: "" },
      { id: "branch", name: "Branch Factor", min: 1, max: 10, default: 3, step: 1, unit: "" }
    ],
    generateData: (params) => {
      const maxDepth = params.depth || 4;
      const branch = params.branch || 3;
      const pts: Array<{ x: number; y: number }> = [];
      for (let d = 1; d <= maxDepth; d++) {
        pts.push({ x: d, y: Math.pow(branch, d) });
      }
      return pts;
    },
    labels: { x: "Tree Depth", y: "Total Leaf Nodes" }
  }
};
