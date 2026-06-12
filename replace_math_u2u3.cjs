
/**
 * replace_math_u2u3.cjs
 * Replaces mathModelling + virtualLab sections in topic13–topic32
 * with Unit-1 case-study / decision-constraint style (no LaTeX).
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'src', 'data');

// ─── Case-study replacements per topic ────────────────────────────────────────
// Each entry contains the complete mathModelling block + virtualLab block text
// to splice into the file.  Written as plain TS object literal strings.

const replacements = {

  // ── topic13 ── Introduction to Model-Driven Management ──────────────────────
  topic13: {
    mathModelling: `  mathModelling: {
    need: "NetOps Ltd is rolling out a BGP configuration change across 300 PE routers. The change involves 12 parameters per device. Previous manual CLI rollouts had a 4% per-device error rate — 12 errors per rollout — with each error requiring 45 minutes of NOC time to diagnose and roll back. The CTO requires the error rate drop below 0.1% without extending the 4-hour maintenance window. Three validation strategies are under evaluation.",
    equation: "DECISION CONSTRAINT: Config error rate < 0.1% per device (from 4%). Validation must complete within 4-hour window. All 12 BGP parameters must be checked before commit. Cross-parameter constraints (e.g., hold-timer ≥ 3 × keepalive) must be enforced. Decision: No Validation / YANG Schema-only / YANG + XPath Constraints / Formal Model Checking.",
    technicalDetails: "Option A (No Validation): Edit-config sent directly. Device YANG engine is the only check. Error rate 4%, 12 failures per rollout — each costing 45 minutes NOC time (9 hours total). Option B (YANG Schema Only): Validates XML against YANG types, ranges, mandatory leafs before sending. Catches 60% of errors (type mismatches, out-of-range values). Error rate drops to ~1.6%. Validation overhead: 300 devices × 6 ms = 1.8 seconds — negligible. Option C (YANG + XPath Constraints — Recommended): Adds must/when expressions for cross-parameter rules (hold-timer ≥ 3 × keepalive, route-policy exists). 300 devices × 26 ms = 7.8 seconds total — negligible in a 4-hour window. Error rate drops to ~0.05%, meeting the target. Option D (Formal Model Checking): Z3/SMT solver verifies full reachability invariants. Catches bugs YANG cannot express. But 300 devices × 15 seconds = 75 minutes — adds 31% to the maintenance window, violating the constraint.",
    explanation: [
      { term: "Option A: No Pre-validation", meaning: "Edit-config sent directly; device YANG engine is the only validator. WHY REJECTED: 4% error rate — 12 devices fail per rollout, each requiring 45 minutes of manual NOC diagnosis. Unpredictable window extension. WHEN ADOPTED: Acceptable only for trivial single-leaf changes (e.g., updating a description string) where the operator has high confidence in the input and the change is easily reversible." },
      { term: "Option B: YANG Schema Validation", meaning: "Validates XML against YANG module schema (types, ranges, mandatory, pattern). Catches 60% of errors. Leaves cross-parameter violations undetected — a hold-timer of 5 s with keepalive of 10 s passes schema validation but violates the BGP RFC. WHY INSUFFICIENT ALONE: Does not catch semantic constraint violations. WHEN ADOPTED: Correct as a minimum baseline — schema validation should never be skipped." },
      { term: "Option C: YANG + XPath Constraints (Recommended)", meaning: "Adds must/when expressions: 'must hold-time >= 3 * keepalive-interval'. 10 constraints × 2 ms = 20 ms per device. 300 × 26 ms = 7.8 s total overhead. Error rate: ~0.05% — below the 0.1% target. WHY BEST: Meets all three constraints within the window. XPath must expressions are the intended YANG mechanism for semantic correctness. Cisco NSO, Nokia NSP, and Ericsson ENM all use must/when constraints in production." },
      { term: "Option D: Formal Model Checking", meaning: "Z3/SMT or Batfish verifies global reachability and policy invariants — catches routing-loop creation that YANG constraints cannot express. WHY EXCEEDS CONSTRAINT: 300 × 15 s = 75 minutes — extends the 4-hour window by 31%. WHEN ADOPTED: Correct for quarterly large topology changes or new service onboarding where the 75-minute overhead is acceptable (hyperscaler practice at Google and Meta)." }
    ],
    advantages: [
      "YANG + XPath constraints reduce the error rate from 4% to 0.05% — a 98.75% improvement — while adding only 7.8 seconds of overhead across 300 devices",
      "XPath must expressions capture semantic correctness rules that pure schema validation cannot: cross-parameter relationships, referential integrity (policy names must exist), and conditional requirements",
      "Pre-validation by the NMS before sending edit-config eliminates the 8-minute per-error device-side recovery time, making the maintenance window predictable"
    ],
    limitations: [
      "No pre-validation is adopted only for trivial single-leaf changes where operator-verified input leaves no room for error",
      "Schema-only validation is the minimum baseline for all NETCONF operations regardless of complexity — it costs under 2 ms per device",
      "Formal model checking is adopted for large topology changes where ensuring global invariants justifies the 15-second per-device overhead, run in the pre-maintenance planning phase — not during the window itself"
    ]
  },`,
    virtualLab: `  virtualLab: {
    description: "Adjust the number of devices (PE routers) and validation strategy (1 = No Validation, 2 = Schema Only, 3 = YANG + XPath, 4 = Formal Checking) to observe how total validation overhead and projected error count change across the rollout. Error rates: Option 1 = 4%, Option 2 = 1.6%, Option 3 = 0.05%, Option 4 = 0.01%.",
    interpretation: "As device count grows, the overhead difference between XPath validation and formal model checking becomes dramatic — at 300 devices, formal checking adds 75 minutes while XPath adds under 10 seconds. This is why YANG + XPath constraints are the industry standard for production rollouts: they deliver near-zero error rates at negligible overhead, enabling automation at scale.",
    parameters: [
      { id: "devices", name: "PE Router Count", min: 10, max: 500, default: 100, step: 10, unit: "" },
      { id: "strategy", name: "Validation Strategy (1-4)", min: 1, max: 4, default: 3, step: 1, unit: "" }
    ],
    generateData: (params) => {
      const maxDevices = params.devices || 100;
      const strategy = Math.round(params.strategy || 3);
      const overheadPerDevice = [0, 0.006, 0.026, 15][strategy - 1] || 0.026;
      const pts: Array<{ x: number; y: number }> = [];
      for (let d = 10; d <= maxDevices; d += 10) {
        pts.push({ x: d, y: parseFloat((d * overheadPerDevice).toFixed(2)) });
      }
      return pts;
    },
    labels: { x: "Devices", y: "Total Validation Time (s)" }
  }`
  },

  // ── topic14 ── YANG Data Model Structure ─────────────────────────────────────
  topic14: {
    mathModelling: `  mathModelling: {
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
  },`,
    virtualLab: `  virtualLab: {
    description: "Vary tree depth and branch factor to observe how total YANG node count scales. This illustrates why deep, highly-branched YANG models create validation overhead and why flat, grouping-based designs are preferred. Node count = branch_factor^depth (simplified model).",
    interpretation: "YANG model complexity grows exponentially with tree depth and branch factor. A depth-4 model with branch factor 3 has 81 leaf nodes — manageable. At depth 6 with branch factor 4, node count reaches 4,096 — creating significant validation and tooling overhead. This drives the design principle of keeping YANG trees shallow (depth ≤ 5) and using groupings to share common structures rather than deepening the tree.",
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
  }`
  },

  // ── topic15 ── YANG Data Model Details Explanation ───────────────────────────
  topic15: {
    mathModelling: `  mathModelling: {
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
  },`,
    virtualLab: `  virtualLab: {
    description: "Adjust Shared Leaf Count (S) and Times Used (U) to observe code reduction from YANG groupings. The plot shows R_reuse (%) as usage count steps from 2 up to the selected maximum, keeping shared leaf count fixed.",
    interpretation: "Code reduction grows rapidly with the first few additional usages and then flattens asymptotically toward 100%. With S=8 leafs and just 3 usages, R_reuse already reaches 58%. By 15 usages it exceeds 80%. This demonstrates that even modestly-reused groupings deliver substantial savings — validating the practice of extracting common node sets into groupings even when reuse is limited to 3–4 locations.",
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
  }`
  },

  // ── topic16 ── NETCONF Protocol Concept ──────────────────────────────────────
  topic16: {
    mathModelling: `  mathModelling: {
    need: "A network operations team must choose a configuration protocol to automate provisioning across a fleet of 800 routers. The current process uses SSH CLI scripts, resulting in a 6% per-device error rate, a 3-hour average rollback time per failure, and no transactional guarantee (partial configurations are left on failed devices). The replacement protocol must support transactional commit/rollback, structured data, and complete the 800-device rollout within a 6-hour maintenance window.",
    equation: "DECISION CONSTRAINT: Config error rate < 0.5%. Rollback must be automatic (zero manual intervention). Rollout of 800 devices must complete within 6 hours. Must support candidate datastore for pre-validation. Decision: SSH CLI scripts / SNMP SET / NETCONF / gNMI.",
    technicalDetails: "SSH CLI Scripts: Current state. Per-device: variable time (15–45 min per failure case). Error rate: 6%. Rollback: manual, 3 hours average. No transactional guarantee — partial config persists on failure. SNMP SET: Structured protocol, but designed for monitoring — SET operations are not transactional, not YANG-modelled, and have a maximum PDU size of 65 KB (insufficient for full router config). Not suitable for bulk provisioning. NETCONF (Recommended): Uses candidate datastore — operator loads full config to candidate, validates, then issues commit. On commit failure, the running datastore is untouched. Rollback: automatic, zero manual steps. Per-device time: 45 seconds average (XML encode, SSH transport, commit). 800 devices at 45 s = 600 minutes if serial; with 8 parallel workers: 75 minutes — well within 6 hours. Supported on all major vendors (Cisco, Nokia, Juniper, Huawei). gNMI: Google-developed, gRPC-based, optimised for streaming telemetry and high-frequency state polling. Configuration support (gNMI Set) exists but lacks the candidate/commit/rollback datastore model. WHY SECONDARY: Excellent for telemetry streaming, but NETCONF has more mature configuration management semantics (confirmed commit, rollback-on-error).",
    explanation: [
      { term: "SSH CLI Scripts", meaning: "Custom bash/Python scripts send vendor-specific CLI commands over SSH. WHY REJECTED: 6% error rate, no transactional guarantee — a failed mid-script leaves partial config on the device (e.g., BGP neighbor added but route policy not applied). Rollback requires a human to SSH to each failed device and manually reverse changes. WHEN ADOPTED: Still used for one-off, ad-hoc changes on devices that do not support NETCONF — typically older hardware at end of life." },
      { term: "SNMP SET", meaning: "SNMP write operations (SET PDUs) can modify device configuration for SNMP-modelled parameters. WHY REJECTED: Not transactional, not YANG-aware, PDU size limit of 65 KB is insufficient for full router configuration, and SET operations are deprecated in modern network management (SNMP v3 usage is primarily for monitoring). WHEN ADOPTED: Legacy environments where device management is limited to SNMP traps and basic scalar configuration (e.g., setting sysName, enabling/disabling interfaces on legacy switches)." },
      { term: "NETCONF (Recommended)", meaning: "RFC 6241 protocol over SSH. Uses candidate datastore — full config loaded, validated, then committed atomically. Rollback: on commit failure, running datastore unchanged. 800 devices with 8 parallel workers: 75 minutes. Error rate: < 0.1% (YANG validation + XPath constraints catch errors before commit). WHY BEST: Meets all four constraints — error rate, automatic rollback, 6-hour window, and candidate datastore. Industry standard for production network automation (Cisco NSO, Nokia NSP, Ericsson ENM all use NETCONF as the southbound protocol)." },
      { term: "gNMI", meaning: "gRPC-based protocol by Google/OpenConfig. Excellent for high-frequency streaming telemetry (Subscribe RPC with 1-second polling intervals). gNMI Set operation supports configuration, but lacks NETCONF's candidate/confirmed-commit/rollback-on-error semantics. WHY SECONDARY FOR CONFIG: Best-in-class for telemetry streaming; adequate for configuration in cloud-native environments (Kubernetes-managed network functions). WHEN ADOPTED: Chosen for telemetry collection alongside NETCONF for configuration — the two protocols are complementary, not mutually exclusive." }
    ],
    advantages: [
      "NETCONF candidate datastore enables full pre-validation of the entire configuration before any change reaches the running state — eliminating partial-config failures that plagued SSH CLI scripts",
      "Atomic commit/rollback means a failure during a 800-device rollout leaves all devices either fully updated or fully reverted — no manual cleanup required, reducing NOC workload from 3 hours to zero",
      "NETCONF capability exchange at session open allows the NMS to auto-select the correct YANG models per device — eliminating the vendor-specific script branching logic of CLI automation"
    ],
    limitations: [
      "SSH CLI scripts are retained for legacy devices that do not support NETCONF — typically end-of-life hardware where vendor firmware updates are not available",
      "SNMP SET is retained for environments where the NMS is SNMP-only (legacy OSS tools) and the configuration scope is limited to SNMP-modelled scalars",
      "gNMI Set is adopted in cloud-native network function (CNF) environments where gRPC is the native transport and Kubernetes-based orchestration drives configuration changes at sub-second intervals"
    ]
  },`,
    virtualLab: `  virtualLab: {
    description: "Vary XML payload size (KB) and SSH bandwidth (kbps) to observe NETCONF transaction time per device. Total time = (payload size in bits) / bandwidth. Use this to estimate the maximum parallel worker count needed to complete an 800-device rollout within 6 hours.",
    interpretation: "At 10 KB payload and 1000 kbps bandwidth, each NETCONF transaction takes about 0.08 seconds of transport time (plus ~0.4 s commit overhead = ~0.5 s total). 800 devices ÷ 8 workers = 100 serial transactions per worker × 0.5 s = 50 seconds — far under the 6-hour window. The chart shows that even at 100 KB payloads, NETCONF transport is not the bottleneck; commit validation time dominates and must be optimised through XPath constraint caching.",
    parameters: [
      { id: "xmlSize", name: "XML Payload", min: 1, max: 100, default: 10, step: 1, unit: " KB" },
      { id: "bandwidth", name: "SSH Bandwidth", min: 100, max: 10000, default: 1000, step: 100, unit: " kbps" }
    ],
    generateData: (params) => {
      const maxSize = params.xmlSize || 10;
      const bw = params.bandwidth || 1000;
      const pts: Array<{ x: number; y: number }> = [];
      for (let s = 1; s <= maxSize; s++) {
        const bits = s * 8 * 1024;
        const time = (bits / (bw * 1000)) * 1000;
        pts.push({ x: s, y: parseFloat(time.toFixed(3)) });
      }
      return pts;
    },
    labels: { x: "Payload (KB)", y: "Transport Time (ms)" }
  }`
  },

  // ── topic17 ── NETCONF Operation Commands ────────────────────────────────────
  topic17: {
    mathModelling: {
      need: `"A network automation engineer at a financial services firm must choose the correct NETCONF operations to implement a zero-downtime BGP policy change on 200 production routers. The change must: (1) not affect running config until fully validated, (2) be reversible within 30 seconds if the change causes a routing anomaly, and (3) minimise the amount of configuration data sent per device (network is bandwidth-constrained at 512 kbps per management link). Three operation strategies are evaluated."`,
      equation: `"DECISION CONSTRAINT: Zero impact on running config during validation. Rollback within 30 seconds of anomaly detection. Minimize bytes sent per device (management link: 512 kbps). Must support BGP policy update across 200 routers. Decision: get-config + full edit-config / get-config + merge edit-config / lock + candidate + confirmed-commit / copy-config."`,
      technicalDetails: `"Full edit-config Replace: Sends the entire device configuration as a single XML payload to replace the running config. Bandwidth: 200-500 KB per device at 512 kbps = 3–8 seconds per device. Serial: 200 × 8 s = 1,600 seconds (26 minutes). Risk: one XML encoding error replaces the full running config. Merge edit-config (targeted): Sends only the changed BGP policy subtree (typically 2–5 KB). Bandwidth: 5 KB at 512 kbps = 0.08 seconds transport. Merges only the specified nodes into the running config. Risk: no atomicity — if a second edit-config fails mid-sequence, partial config persists. Lock + Candidate + Confirmed-Commit (Recommended): (1) lock running and candidate datastores. (2) Send merge edit-config to candidate (validation only, running unchanged). (3) Issue validate operation. (4) Issue confirmed-commit with a 30-second timeout. The device applies the change to running; if no confirming commit arrives within 30 seconds, the device automatically rolls back. WHY BEST: Meets all three constraints. Bandwidth: only changed subtree sent. Rollback: automatic at 30-second timeout. Running config untouched during validation. copy-config: Copies an entire datastore to another (e.g., candidate to running, or startup to running). Used for device initialisation and factory reset — not appropriate for incremental policy changes as it replaces the entire target datastore."`,
      explanation: [
        `{ term: "Full edit-config Replace", meaning: "Sends entire config as XML with operation=replace. WHY REJECTED: 200–500 KB payload at 512 kbps takes 3–8 seconds per device of transport alone. More critically, one encoding error corrupts the entire running config — no partial protection. WHEN ADOPTED: Correct for initial device provisioning (zero-to-full-config) or factory reset scenarios where the full config is intentionally replaced." }`,
        `{ term: "Merge edit-config (targeted subtree)", meaning: "Sends only the changed BGP policy nodes with operation=merge. Bandwidth-efficient (2–5 KB). But no atomicity — if a second edit-config in a sequence fails, partial policy change persists on the device. Rollback requires a manual reverse edit-config. WHY INSUFFICIENT: Does not meet the 30-second automatic rollback constraint. WHEN ADOPTED: Correct for non-critical, easily reversible single-leaf changes (e.g., updating interface description) where partial failure is acceptable." }`,
        `{ term: "Lock + Candidate + Confirmed-Commit (Recommended)", meaning: "Full atomic workflow: lock datastores → edit candidate → validate → confirmed-commit (30 s timeout). Running config unchanged during validation. Rollback: automatic if no confirm arrives within 30 seconds. Bandwidth: only changed subtree sent to candidate. WHY BEST: Meets all three constraints simultaneously. This is the standard NETCONF workflow for production configuration changes. Cisco NSO and Nokia NSP use this pattern for all production commits." }`,
        `{ term: "copy-config", meaning: "Copies one full datastore to another. WHY INAPPROPRIATE: Replaces the entire target datastore — equivalent to replacing the full running config, with the same bandwidth and risk profile as full edit-config replace. WHEN ADOPTED: Device initialisation (copying a baseline candidate to running), startup config restoration after hardware replacement, and configuration backup (copying running to startup)." }`
      ]
    },
    virtualLab: {
      description: `"Vary total config node count and the number of changed nodes per operation to observe how targeted NETCONF edit-config (merge, changed nodes only) compares to full replace (all nodes) in terms of bytes sent. Demonstrates the bandwidth efficiency of targeted NETCONF operations."`,
      interpretation: `"As total config size grows, the gap between full-replace and targeted-merge becomes dramatic. At 200 total nodes with only 10 changed nodes, targeted merge sends 5% of the data. This is why the lock+candidate+confirmed-commit pattern with targeted subtree edits is the standard for bandwidth-constrained management networks — it minimises management traffic while maximising atomicity guarantees."`,
      params: [
        `{ id: "total", name: "Total Config Nodes", min: 10, max: 200, default: 50, step: 5, unit: "" }`,
        `{ id: "changed", name: "Max Changed Nodes", min: 1, max: 50, default: 10, step: 1, unit: "" }`
      ],
      generateData: `(params) => {
      const total = params.total || 50;
      const maxChanged = params.changed || 10;
      const bytesPerNode = 150;
      const pts: Array<{ x: number; y: number }> = [];
      for (let c = 1; c <= maxChanged; c++) {
        const pct = (c / total) * 100;
        pts.push({ x: c, y: parseFloat(pct.toFixed(1)) });
      }
      return pts;
    }`,
      labels: `{ x: "Changed Nodes", y: "Data Sent vs Full Replace (%)" }`
    }
  },

  // ── topic18 ── RESTCONF ───────────────────────────────────────────────────────
  topic18: {
    mathModelling: `  mathModelling: {
    need: "A DevOps team building a cloud-native network orchestration platform must choose a northbound API protocol to expose network configuration and state to application developers. The platform manages 50 virtual network functions (VNFs). Developers are familiar with REST APIs, use Python Requests and JavaScript Fetch for tooling, and require JSON responses. The constraint: API integration must take under 1 day per developer, no proprietary SDKs, and the API must be compatible with standard HTTP tooling (Postman, curl, OpenAPI).",
    equation: "DECISION CONSTRAINT: Developer integration time ≤ 1 day. No proprietary SDKs or clients required. Must return JSON (not XML). Must support GET, POST, PUT, PATCH, DELETE semantics. Must work with standard HTTP tooling. Decision: NETCONF / RESTCONF / proprietary REST API / gRPC+Protobuf.",
    technicalDetails: "NETCONF: XML-over-SSH protocol with its own session model. Developer integration: requires a NETCONF client library (ncclient for Python, no native browser support). Integration time: 2–3 days to understand NETCONF operations, XML encoding, and session management. Not compatible with Postman or standard HTTP tooling. Rejected: violates 1-day integration and HTTP tooling constraints. RESTCONF (RFC 8040 — Recommended): HTTP-based protocol mapping NETCONF datastores to REST resources. Supports JSON (application/yang-data+json). Standard HTTP verbs: GET (get-config), POST (create), PUT (replace), PATCH (merge), DELETE (remove). Works natively with Postman, curl, Python Requests, JavaScript Fetch. Developer integration: 2–4 hours (standard REST experience transfers directly). WHY BEST: Meets all constraints. Proprietary REST API: Some vendors expose a custom REST API for configuration (e.g., Cisco ACI REST API, F5 iControl REST). Not YANG-modelled — responses are vendor-specific JSON schemas. Integration time: 1–3 days per vendor (learning proprietary schema). Switching NMS vendors requires full API rewrite. gRPC + Protobuf: High-performance binary protocol used for streaming telemetry (gNMI Subscribe). Not HTTP/REST — requires gRPC client library and Protobuf schema compilation. Developer integration: 3–5 days. Not compatible with Postman or curl. Appropriate for telemetry streaming, not REST-style configuration.",
    explanation: [
      { term: "NETCONF", meaning: "RFC 6241 XML-over-SSH. WHY REJECTED: Requires NETCONF client library (ncclient), no browser support, incompatible with Postman/curl. XML encoding is verbose and harder to read than JSON for application developers. Integration time: 2–3 days. WHEN ADOPTED: Correct for NMS-to-device (southbound) automation where transactional commit/rollback is required — NETCONF is the gold standard for device configuration, but inappropriate as a northbound API for application developers." },
      { term: "RESTCONF (Recommended)", meaning: "RFC 8040 HTTP-based YANG access. GET/POST/PUT/PATCH/DELETE map to NETCONF operations. Returns JSON (application/yang-data+json). Works with Postman, curl, Python Requests. Developer integration: 2–4 hours for any developer with REST experience. WHY BEST: All four constraints met. Standard tooling works out of the box. YANG-modelled responses are self-describing via the YANG schema. Nokia NSP, Cisco NSO, and Ericsson ENM all expose RESTCONF northbound APIs for orchestration integration." },
      { term: "Proprietary REST API", meaning: "Vendor-specific JSON schemas over HTTP. WHY REJECTED: Integration knowledge is vendor-specific and non-transferable. Switching NMS vendors requires full API client rewrite. No YANG schema available for automated code generation. WHEN ADOPTED: Acceptable when the entire orchestration stack is single-vendor (e.g., Cisco ACI with its proprietary REST API) and the team has no plans to introduce alternative vendors." },
      { term: "gRPC + Protobuf", meaning: "Binary protocol requiring client library and Protobuf schema compilation. WHY REJECTED FOR THIS CASE: Not HTTP/REST, incompatible with Postman/curl, integration time 3–5 days. WHEN ADOPTED: Best-in-class for high-frequency telemetry streaming (gNMI Subscribe at 1-second intervals), where binary encoding efficiency is worth the tooling investment. Complementary to RESTCONF: RESTCONF for configuration, gNMI for telemetry." }
    ],
    advantages: [
      "RESTCONF reuses the existing REST ecosystem — Postman collections, OpenAPI documentation, curl scripts, and HTTP load balancers all work without modification",
      "JSON responses from RESTCONF are human-readable, directly consumable by JavaScript front-ends without parsing overhead, and compatible with standard JSON schema validation tools",
      "RESTCONF is YANG-modelled — every resource path corresponds to a YANG node, making the API self-documenting and enabling automated client code generation from YANG models"
    ],
    limitations: [
      "NETCONF is adopted southbound (NMS to device) where transactional commit/rollback and candidate datastore semantics are required — RESTCONF does not support confirmed-commit",
      "Proprietary REST APIs are adopted only in locked-in single-vendor deployments where no multi-vendor interoperability is required and the vendor's tooling is the primary integration point",
      "gRPC is adopted for telemetry collection alongside RESTCONF for configuration — the two are complementary: RESTCONF for read/write configuration, gNMI for high-frequency streaming state"
    ]
  },`,
    virtualLab: `  virtualLab: {
    description: "Vary API operation count and time window to observe RESTCONF API throughput (ops/sec). Demonstrates how RESTCONF scales with HTTP/1.1 vs HTTP/2 connection reuse. A multiplier of 6 is applied for HTTP/2 (connection multiplexing reduces per-request overhead by ~6×).",
    interpretation: "HTTP/2 multiplexing dramatically improves RESTCONF throughput for high-frequency polling — at 1,000 operations per 10 seconds, HTTP/2 delivers ~600 effective ops/sec vs ~100 for HTTP/1.1. This is why modern RESTCONF servers (Nokia NSP, Cisco NSO 6.x) mandate HTTP/2 for NBI connections in high-scale orchestration environments. For low-frequency configuration operations (< 10 ops/sec), HTTP/1.1 is sufficient.",
    parameters: [
      { id: "ops", name: "API Operations", min: 10, max: 1000, default: 100, step: 10, unit: "" },
      { id: "window", name: "Time Window", min: 1, max: 60, default: 10, step: 1, unit: " s" }
    ],
    generateData: (params) => {
      const maxOps = params.ops || 100;
      const window = params.window || 10;
      const pts: Array<{ x: number; y: number }> = [];
      for (let o = 10; o <= maxOps; o += 10) {
        const throughput = o / window;
        pts.push({ x: o, y: parseFloat(throughput.toFixed(2)) });
      }
      return pts;
    },
    labels: { x: "API Operations", y: "Throughput (ops/s)" }
  }`
  },

  // ── topic19 ── Alarm Management ──────────────────────────────────────────────
  topic19: {
    mathModelling: `  mathModelling: {
    need: "A NOC at a national mobile operator receives 12,000 raw alarms per hour from 3,000 network elements during peak periods. The NOC has 8 engineers on shift. Each engineer can handle a maximum of 5 alarms per hour with full investigation and resolution. The current system floods all 12,000 alarms to the NOC dashboard without filtering — engineers are overwhelmed and critical alarms are missed. The operator must reduce actionable alarm volume to under 40 alarms per hour (5 per engineer × 8 engineers) without missing any P1 (critical) alarms.",
    equation: "DECISION CONSTRAINT: Actionable alarms reaching NOC ≤ 40 per hour. Zero P1 alarms suppressed or missed. Must process 12,000 raw alarms/hour in real time. System must add < 5 seconds of latency from alarm generation to NOC notification. Decision: No filtering / Severity threshold filter / Alarm correlation engine / AI-based anomaly detection.",
    technicalDetails: "No Filtering: All 12,000 alarms/hour reach the NOC. Engineers cannot investigate 1,500 alarms each per hour — 97% go uninvestigated. Critical failures masked by noise. Severity Threshold Filter (P1/P2 only): Filters alarms below severity P2. Assumes 8% of alarms are P1/P2 = 960 alarms/hour — still 24× above the 40/hour target. Correlation Engine (Recommended): Groups related alarms by root cause topology. A single transmission failure generates 50+ downstream alarms (cell outage, capacity alarms, handover failures). A correlation rule: 'if >10 alarms arrive from the same geographic cluster within 60 seconds, emit one parent alarm and suppress children.' Suppression rate: typically 96–98%. 12,000 × 0.97 suppression = ~360 actionable alarms/hour. Apply P1/P2 filter on top: 360 × 20% P1/P2 = 72 alarms/hour. Further tuning achieves <40. Processing latency: 60-second correlation window + 2-second engine latency = 62 seconds — marginally over the 5-second target for individual alarms but acceptable for correlated output. AI-Based Anomaly Detection: ML models score each alarm for novelty and operational impact. High accuracy but requires 6–12 months of labelled training data and ongoing model retraining. Processing latency: 0.5–2 seconds per alarm (GPU inference). Not yet production-ready at this operator (insufficient labelled data). Viable in 12 months.",
    explanation: [
      { term: "No Filtering", meaning: "All raw alarms forwarded to NOC. WHY REJECTED: 12,000 alarms/hour = 200 per minute — engineers cannot process 1,500 alarms each per hour. P1 critical alarms are buried in noise. WHEN ADOPTED: Never appropriate for a NOC managing >100 NEs. Acceptable only in a lab/test environment where all alarms are of interest for debugging." },
      { term: "Severity Threshold Filter (P1/P2 only)", meaning: "Drops all alarms below P2 severity. Reduces volume from 12,000 to ~960/hour — still 24× above the 40/hour target. WHY INSUFFICIENT: Does not address alarm storms where a single root cause generates hundreds of P1/P2 child alarms simultaneously. WHEN ADOPTED: Used as a first-pass filter in conjunction with a correlation engine — never as the sole alarm reduction mechanism in a high-volume NOC." },
      { term: "Alarm Correlation Engine (Recommended)", meaning: "Topological correlation groups related alarms from the same root cause. Suppression rule: >10 alarms from the same cluster within 60 seconds → emit one parent alarm. 97% suppression achieves <72 P1/P2 alarms/hour with P2+ filter. Further tuning to <40 is achievable. WHY BEST: Meets the volume target without suppressing any root-cause (P1) alarms. Industry standard in all major NMS platforms (Netcracker, Ericsson OSS, Nokia NetAct). 62-second correlation latency is acceptable — P1 alarms are still notified within 5 seconds as uncorrelated alarms before the engine confirms the pattern." },
      { term: "AI-Based Anomaly Detection", meaning: "ML models score alarm novelty and impact. Potential to reduce volume to <10 actionable alarms/hour by surfacing only genuinely new failure modes. WHY NOT ADOPTED NOW: Requires 6–12 months of labelled training data. Current operator data is unlabelled. Processing latency of 0.5–2 seconds per alarm meets the 5-second target. WHEN ADOPTED: After 12 months of correlation engine operation (which labels alarms by root cause), AI models can be trained on the labelled dataset and progressively replace rule-based correlation." }
    ],
    advantages: [
      "Alarm correlation reduces NOC alarm volume by 97% while ensuring every root-cause P1 alarm reaches an engineer — the NOC focuses on actionable faults, not noise",
      "Topological correlation automatically identifies when a single transmission failure causes cell outage, handover, and capacity alarms — engineers see one parent alarm instead of 50+ children, dramatically reducing MTTR",
      "Correlation rules are maintainable by NOC engineers without data science expertise — rule updates (new topology additions) take minutes, unlike ML model retraining which takes weeks"
    ],
    limitations: [
      "Severity filtering alone is adopted only as a baseline pre-filter before the correlation engine — it reduces initial alarm volume without requiring topology awareness",
      "AI anomaly detection is adopted after 12 months of labelled operational data from the correlation engine — the correlation engine is the prerequisite, not the replacement, for AI-based alarm management",
      "No filtering is never adopted in production NOC environments — it is retained only in test/lab systems where full alarm visibility is needed for network behaviour analysis"
    ]
  },`,
    virtualLab: `  virtualLab: {
    description: "Vary raw alarm rate and correlation efficiency to observe how many actionable alarms reach the NOC per time window. Target is ≤ 40 alarms/hour. The simulation shows correlated alarm count as efficiency increases from 10% to the selected maximum.",
    interpretation: "At 70% correlation efficiency with 1,000 raw alarms per 10-second window (360,000/hour equivalent), the actionable count drops to 300 per window — still too high. At 97% efficiency, the count reaches 30 — below the NOC target. This illustrates why correlation rules must be tuned to 95–98% efficiency for high-volume environments, and why a combination of correlation + severity filtering is required to meet NOC capacity.",
    parameters: [
      { id: "alarms", name: "Alarms", min: 10, max: 1000, default: 100, step: 10, unit: "" },
      { id: "window", name: "Window", min: 1, max: 60, default: 10, step: 1, unit: " s" }
    ],
    generateData: (params) => {
      const rawAlarms = params.alarms || 100;
      const window = params.window || 10;
      const pts: Array<{ x: number; y: number }> = [];
      for (let eff = 10; eff <= 98; eff += 5) {
        const actionable = rawAlarms * (1 - eff / 100);
        pts.push({ x: eff, y: parseFloat(actionable.toFixed(1)) });
      }
      return pts;
    },
    labels: { x: "Correlation Efficiency (%)", y: "Actionable Alarms" }
  }`
  },

  // ── topic20 ── Network Virtualization ────────────────────────────────────────
  topic20: {
    mathModelling: `  mathModelling: {
    need: "A tier-2 mobile operator is replacing its proprietary hardware-based EPC (Evolved Packet Core) with a virtualised EPC (vEPC). The physical EPC runs on 12 dedicated hardware appliances (4 MME, 4 S-GW, 4 P-GW) with fixed capacity. The operator serves 2 million subscribers with peak load 3× the average. The constraint: the vEPC must handle the 3× peak load without over-provisioning hardware for the 3× peak at all times, and must reduce CapEx by 30% compared to expanding the physical EPC to handle peak load with dedicated hardware.",
    equation: "DECISION CONSTRAINT: Must handle 3× average peak load elastically. CapEx reduction ≥ 30% vs. dedicated hardware peak sizing. VNF start time must be ≤ 90 seconds to respond to traffic peaks. Must maintain 99.99% availability (< 52 minutes/year downtime). Decision: Physical EPC expansion / Bare-metal vEPC / VM-based vEPC / Container-based vEPC.",
    technicalDetails: "Physical EPC Expansion: Add 24 more dedicated appliances (8 MME, 8 S-GW, 8 P-GW) to handle 3× peak. CapEx: $8.4M. These appliances sit at 33% utilisation for 21 hours/day — wasteful. Bare-metal vEPC: Deploy EPC software directly on standard x86 servers without a hypervisor. High performance (no virtualisation overhead), but no live migration, no rapid scaling. Startup: 10–15 minutes per VNF instance (requires OS boot). Does not meet 90-second VNF start constraint. VM-based vEPC (OpenStack + KVM): Deploy EPC VNFs as virtual machines on an OpenStack cluster. VNF startup: 60–90 seconds (VM boot + application init). Meets the 90-second target. Elasticity: Auto-scaling triggered when CPU > 70% — new VNF starts within 90 seconds. CapEx: 6 compute servers × $120K = $720K + OpenStack licensing = $1.1M total. 87% CapEx reduction vs dedicated hardware expansion. Resource utilisation: 33% at average load, scales to 100% at peak — average utilisation ~50%. Container-based vEPC (Kubernetes + Docker): EPC functions containerised. Startup: 5–15 seconds (no VM overhead). Best elasticity. But: Kubernetes networking (CNI plugins) adds latency overhead for user-plane traffic — typical vEPC user-plane latency increases from 0.5 ms (bare-metal) to 2–5 ms (container). For control-plane functions (MME, AMF) this is acceptable; for user-plane (S-GW, UPF) it may violate 5G latency SLAs.",
    explanation: [
      { term: "Physical EPC Expansion (Dedicated Hardware)", meaning: "Add 24 appliances sized for 3× peak load. WHY REJECTED: $8.4M CapEx for hardware that operates at 33% utilisation 87% of the time — structurally inefficient. No elasticity: the hardware is provisioned for peak regardless of actual load. WHEN ADOPTED: Appropriate for operators in regions with no reliable cloud infrastructure or data-centre power/cooling that cannot support x86 server farms." },
      { term: "Bare-metal vEPC", meaning: "EPC software on x86 without hypervisor. Highest performance (no virtualisation overhead), lowest latency. WHY REJECTED: VNF startup 10–15 minutes — violates 90-second auto-scaling constraint. No live migration capability — planned maintenance requires traffic failover. WHEN ADOPTED: Used for user-plane (S-GW/UPF) functions where latency is critical and auto-scaling is not required (capacity is pre-provisioned)." },
      { term: "VM-based vEPC — OpenStack + KVM (Recommended)", meaning: "VNF startup 60–90 seconds — meets the constraint. Elasticity via auto-scaling (CPU threshold trigger). CapEx: $1.1M — 87% reduction vs dedicated hardware expansion (exceeds 30% target). Availability: achieved via VNF redundancy across compute nodes (Active-Standby or Active-Active). WHY BEST: Meets all four constraints. Industry standard for vEPC deployments (Ericsson Cloud EPC, Nokia Cloud BTS all use OpenStack). Average utilisation ~50% — acceptable for cloud economics." },
      { term: "Container-based vEPC — Kubernetes", meaning: "VNF startup 5–15 seconds — best elasticity. CapEx similar to VM. WHY SECONDARY: Kubernetes CNI networking adds 2–5 ms user-plane latency — acceptable for 4G (latency target 10 ms) but may violate 5G URLLC (1 ms) for user-plane functions. WHEN ADOPTED: Used for 5G control-plane NFs (AMF, SMF) where latency targets are 10 ms+. For 5G user-plane (UPF), hardware offloading (DPDK, SR-IOV) is used to reduce container networking overhead to < 0.5 ms." }
    ],
    advantages: [
      "VM-based vEPC auto-scaling cuts average resource utilisation from 100% (dedicated hardware sized for peak) to 50% — halving the compute infrastructure cost while meeting peak demand",
      "Elastic scaling responds to traffic peaks (morning rush, sporting events) within 90 seconds — zero manual intervention required, reducing NOC operational cost",
      "OpenStack multi-tenant isolation allows the same compute cluster to host EPC VNFs for multiple MVNOs (virtual operators) — enabling shared infrastructure revenue"
    ],
    limitations: [
      "Bare-metal is adopted for user-plane functions (S-GW, UPF) where the 2–5 ms virtualisation overhead of VMs would violate 5G user-plane latency SLAs",
      "Container-based is adopted for 5G control-plane NFs (AMF, SMF, PCF) in greenfield 5G SA deployments where Kubernetes-native lifecycle management is the orchestration standard",
      "Dedicated hardware is adopted in markets with unreliable data-centre infrastructure where hardware appliances offer better operational predictability than software-defined VNFs on x86"
    ]
  },`,
    virtualLab: `  virtualLab: {
    description: "Vary VNF count and resource allocation per VNF to observe total resource utilisation. The simulation shows how resource usage scales with VNF instances — illustrating the elastic scaling trade-off between over-provisioning (guaranteed capacity) and just-in-time scaling (risk of scale-up latency).",
    interpretation: "At 5 VNFs each consuming 15% of host resources, total utilisation is 75% — leaving 25% headroom for traffic spikes. Adding a 6th VNF would push to 90% — triggering auto-scaling to a second compute node. This illustrates why 70–80% CPU threshold is the standard auto-scaling trigger in OpenStack vEPC deployments: it provides enough headroom for VNF startup (60–90 s) before the host becomes saturated.",
    parameters: [
      { id: "vnfs", name: "VNFs", min: 1, max: 20, default: 5, step: 1, unit: "" },
      { id: "resPerVnf", name: "Resources per VNF (%)", min: 5, max: 50, default: 15, step: 5, unit: " %" }
    ],
    generateData: (params) => {
      const maxVnfs = params.vnfs || 5;
      const resPerVnf = params.resPerVnf || 15;
      const pts: Array<{ x: number; y: number }> = [];
      for (let v = 1; v <= maxVnfs; v++) {
        pts.push({ x: v, y: Math.min(v * resPerVnf, 100) });
      }
      return pts;
    },
    labels: { x: "VNF Count", y: "Resource Utilisation (%)" }
  }`
  },

  // ── topic21 ── RESTCONF Protocol Concept ─────────────────────────────────────
  topic21: {
    mathModelling: `  mathModelling: {
    need: "A software team is integrating a third-party analytics platform with a Nokia NSP (Network Services Platform) to retrieve real-time interface statistics. The NSP exposes both NETCONF and RESTCONF northbound interfaces. The analytics platform is built on Python microservices with a REST-first architecture. The integration must retrieve interface stats from 500 interfaces every 30 seconds, with each response parsed into a time-series database. The constraint: total per-cycle retrieval time < 25 seconds, response format must be JSON, and no NETCONF client library can be introduced into the analytics codebase.",
    equation: "DECISION CONSTRAINT: Per-cycle retrieval time ≤ 25 seconds for 500 interfaces. Response format: JSON (not XML). Zero NETCONF client library dependencies in the analytics platform. Must support filtering (retrieve only counter leafs, not full interface config). Decision: NETCONF + ncclient / RESTCONF + Python Requests / gNMI Subscribe / SNMP bulk walk.",
    technicalDetails: "NETCONF + ncclient: Retrieves interface state using get with subtree filter. Returns XML — requires XML-to-JSON conversion in the analytics platform. Dependency: ncclient library (Python). Per-interface retrieval: 200 ms (session reuse). 500 interfaces serial: 100 seconds — exceeds 25-second limit. With 20 parallel NETCONF sessions: 5 seconds. But: introduces ncclient dependency — violates the constraint. RESTCONF + Python Requests (Recommended): GET /restconf/data/ietf-interfaces:interfaces/interface={name}/statistics with Accept: application/yang-data+json. Returns JSON natively. Python Requests library is already present (standard REST dependency). Per-request: 80 ms (HTTP keep-alive). 500 requests with 25 concurrent HTTP connections: 500/25 × 80 ms = 1,600 ms (1.6 seconds). Well within 25-second constraint. Supports field filtering via query parameter (fields=in-octets,out-octets). gNMI Subscribe: Streaming protocol — subscribes once, device pushes updates every 30 seconds. Total per-cycle overhead: near-zero (push model). But: requires gNMI client library (grpcio) — violates the no-new-library constraint unless gNMI is already present. SNMP Bulk Walk: GetBulk across ifTable. JSON not natively supported (requires SNMP-to-JSON adapter). No YANG alignment. Counter objects only (no config data). Per-walk: 3–8 seconds for 500 interfaces. Meets the time constraint but violates the JSON and YANG-alignment requirements.",
    explanation: [
      { term: "NETCONF + ncclient", meaning: "XML retrieval with subtree filtering. Requires ncclient library. Per-500-interfaces with 20 parallel sessions: ~5 seconds. WHY REJECTED: Introduces ncclient dependency (violates constraint). XML responses require an additional parsing/conversion step in the analytics platform. WHEN ADOPTED: Correct when the integration platform is an NMS tool (not an analytics platform) and NETCONF transactional semantics (candidate datastore, commit) are needed alongside state retrieval." },
      { term: "RESTCONF + Python Requests (Recommended)", meaning: "HTTP GET with application/yang-data+json. 500 requests via 25 HTTP keep-alive connections: 1.6 seconds per cycle — 15× under the 25-second budget. No new library dependencies (Requests is already present). JSON natively. Field filtering via RESTCONF query parameters reduces response payload. WHY BEST: Meets all three constraints simultaneously. Python Requests is the de facto HTTP library for Python microservices." },
      { term: "gNMI Subscribe", meaning: "Push-based streaming protocol. Near-zero per-cycle overhead once subscribed. JSON encoding available (RFC 7951). WHY REJECTED FOR THIS CASE: Requires grpcio library — a new dependency. Streaming model assumes persistent device connection — analytics platform may not maintain persistent gRPC streams reliably. WHEN ADOPTED: Best choice for telemetry streaming when grpcio is already a platform dependency or when the analytics platform supports long-lived gRPC streams (e.g., cloud-native observability platforms using OpenTelemetry)." },
      { term: "SNMP Bulk Walk", meaning: "GetBulk on ifTable. 3–8 seconds for 500 interfaces — meets time constraint. WHY REJECTED: No native JSON output (requires adapter). Not YANG-aligned (counter names differ from YANG leaf names, requiring a mapping table). No filtering — full ifTable is always returned. WHEN ADOPTED: Legacy environments where devices do not support NETCONF or RESTCONF — SNMP remains the only structured management protocol available." }
    ],
    advantages: [
      "RESTCONF returns JSON natively, eliminating the XML-to-JSON conversion step and reducing per-response processing time in the analytics pipeline",
      "HTTP keep-alive connection pooling allows 500 interface queries to complete in 1.6 seconds using 25 concurrent connections — 15× headroom under the 25-second budget",
      "RESTCONF field filtering (query parameter: fields=in-octets,out-octets) reduces response payload size by up to 80% vs full interface retrieval, halving network bandwidth usage on the management link"
    ],
    limitations: [
      "NETCONF is adopted for configuration management operations (edit-config, commit, rollback) on the same devices — RESTCONF and NETCONF are complementary, not competing",
      "gNMI Subscribe is adopted when the analytics platform already includes grpcio and the team wants push-based telemetry with sub-second sampling intervals not achievable with REST polling",
      "SNMP is adopted for legacy devices that do not expose NETCONF or RESTCONF interfaces — typically end-of-life hardware running firmware from before 2015"
    ]
  },`,
    virtualLab: `  virtualLab: {
    description: "Vary data field count and average field name length to observe RESTCONF JSON response size. This illustrates the impact of YANG leaf verbosity on response payload and demonstrates why field filtering is important for bandwidth-constrained management links.",
    interpretation: "A RESTCONF response for a single interface with 20 fields of average 8-character names produces ~800 bytes of JSON (plus structural overhead). Across 500 interfaces, this totals ~400 KB per polling cycle. Applying field filtering to retrieve only 4 counter fields reduces this to 80 KB — an 80% bandwidth saving. This is why RESTCONF field filtering is used in all production analytics integrations polling high-frequency telemetry.",
    parameters: [
      { id: "fields", name: "Data Fields", min: 5, max: 100, default: 20, step: 5, unit: "" },
      { id: "avgLen", name: "Avg Field Name Length", min: 3, max: 20, default: 8, step: 1, unit: " chars" }
    ],
    generateData: (params) => {
      const maxFields = params.fields || 20;
      const avgLen = params.avgLen || 8;
      const pts: Array<{ x: number; y: number }> = [];
      for (let f = 5; f <= maxFields; f += 5) {
        const bytes = f * (avgLen + 20);
        pts.push({ x: f, y: bytes });
      }
      return pts;
    },
    labels: { x: "Fields", y: "Response Size (bytes)" }
  }`
  },

  // ── topic22 ── RESTCONF Operation via Postman ─────────────────────────────────
  topic22: {
    mathModelling: `  mathModelling: {
    need: "A network engineering team is validating a RESTCONF API implementation on a Nokia NSP lab environment before deploying to production. The team has 5 engineers, each responsible for validating a subset of API endpoints across 4 resource types: interfaces, BGP, OSPF, and MPLS. The total API surface is 40 endpoints. The constraint: all endpoints must be tested within a 2-day sprint, each test must include both success and error-case validation, and results must be documented in a shared format importable by the CI/CD pipeline.",
    equation: "DECISION CONSTRAINT: 40 endpoints tested within 2 days (16 work hours, 5 engineers). Each endpoint needs success + error-case test. Results must be exportable to CI/CD (Newman-compatible format). Decision: Manual curl scripts / Postman Collections / Python Requests automated tests / OpenAPI contract testing.",
    technicalDetails: "Manual curl Scripts: Each engineer writes curl commands manually per endpoint. Testing rate: 2–3 endpoints per hour per engineer (writing, executing, documenting). 40 endpoints ÷ 5 engineers = 8 endpoints each. At 3/hour: 2.7 hours per engineer — feasible within 2 days. But: results stored in terminal logs — not importable to CI/CD without manual reformatting. Error-case testing requires separate curl invocations with modified parameters. Postman Collections (Recommended): Pre-built YANG-to-Postman collection generator available (pyang-postman). Engineers test at 8–10 endpoints/hour using Postman's GUI. 40 endpoints ÷ 5 engineers = 8 each × 0.1 h = 0.8 hours total — 16× faster than curl. Results exported as JUnit XML — directly importable to Jenkins/GitLab CI. Environment variables allow same collection to run against lab and production. Newman (Postman CLI) runs the collection in CI/CD without GUI. Python Requests Automated Tests (pytest): Automated test framework. Highest coverage and CI/CD integration. But: test development time: 2–3 days to write 40 endpoint tests with error cases — exceeds the 2-day sprint constraint. OpenAPI Contract Testing (Schemathesis): Generates test cases automatically from OpenAPI spec. But: RESTCONF does not have a standard OpenAPI 3.0 spec — requires generating one from YANG models first (additional 1-day effort). Not feasible within 2 days.",
    explanation: [
      { term: "Manual curl Scripts", meaning: "curl commands executed per endpoint with manual result logging. WHY INSUFFICIENT: Results not CI/CD-importable without manual reformatting. Error-case testing requires separate commands — time-consuming and error-prone. WHEN ADOPTED: Appropriate for one-off exploratory testing of a single endpoint during initial API integration (e.g., confirming the server URL and authentication header format before building a Postman collection)." },
      { term: "Postman Collections (Recommended)", meaning: "GUI-based API testing with environment variables, pre-request scripts, and test assertions. pyang-postman generates a base collection from YANG modules. 8–10 endpoints/hour per engineer. 40 endpoints in < 1 hour total. JUnit XML export integrates with Jenkins/GitLab CI. Newman CLI runs the collection in headless CI/CD. WHY BEST: Meets all three constraints — 2-day timeline, success+error testing, CI/CD export. Industry standard for RESTCONF/REST API validation at Nokia, Cisco, and Ericsson labs." },
      { term: "Python Requests Automated Tests (pytest)", meaning: "Programmatic HTTP testing with assertions. Highest long-term value for regression testing. WHY REJECTED FOR THIS SPRINT: Writing 40 endpoint tests with error cases takes 2–3 days for 1 engineer — exceeds the 2-day sprint. WHEN ADOPTED: After initial Postman validation, the Postman collection is converted to pytest scripts for long-term CI regression suite — Postman collections can be exported as code." },
      { term: "OpenAPI Contract Testing (Schemathesis)", meaning: "Auto-generates test cases from OpenAPI spec. Zero manual test writing. WHY REJECTED: No standard OpenAPI 3.0 spec for RESTCONF — requires 1 additional day to generate spec from YANG modules using pyang-openapi. WHEN ADOPTED: After the YANG-to-OpenAPI pipeline is established (6-month effort), Schemathesis provides automated regression testing with zero manual test maintenance." }
    ],
    advantages: [
      "Postman Collections generated from YANG models via pyang-postman cover 100% of the API surface in under 1 hour — eliminating the risk of missed endpoints in manual testing",
      "Newman CLI integration means the same Postman collection that engineers ran in the lab GUI executes automatically in CI/CD on every code merge — zero rework for pipeline integration",
      "Environment variables in Postman allow the same collection to target lab, staging, and production environments by changing a single variable — eliminating per-environment test duplication"
    ],
    limitations: [
      "curl is adopted for one-off exploratory tests during initial API discovery — its zero-setup advantage outweighs Postman's efficiency when testing a single endpoint",
      "pytest automated tests are adopted after the sprint as the long-term regression suite — Postman collections are exported to Python code as the starting point, avoiding rewriting tests from scratch",
      "OpenAPI contract testing is adopted after the YANG-to-OpenAPI pipeline is established — it provides the highest regression coverage with zero manual test maintenance once the pipeline is in place"
    ]
  },`,
    virtualLab: `  virtualLab: {
    description: "Vary total API endpoint count and tested endpoint count to observe API coverage percentage. Demonstrates how Postman collection-based testing achieves higher coverage rates per engineering hour compared to manual curl testing.",
    interpretation: "At 40 total endpoints with 35 tested, coverage is 87.5%. Reaching 100% coverage with manual curl requires testing the remaining 5 endpoints — approximately 1.7 additional engineering-hours. With a Postman collection, running the remaining 5 tests takes under 5 minutes via Newman CLI. This illustrates why collection-based testing is the standard for API coverage assurance in time-constrained sprints.",
    parameters: [
      { id: "endpoints", name: "Total Endpoints", min: 5, max: 50, default: 20, step: 1, unit: "" },
      { id: "tested", name: "Tested Endpoints", min: 1, max: 50, default: 15, step: 1, unit: "" }
    ],
    generateData: (params) => {
      const total = params.endpoints || 20;
      const maxTested = Math.min(params.tested || 15, total);
      const pts: Array<{ x: number; y: number }> = [];
      for (let t = 1; t <= maxTested; t++) {
        pts.push({ x: t, y: parseFloat(((t / total) * 100).toFixed(1)) });
      }
      return pts;
    },
    labels: { x: "Tested Endpoints", y: "Coverage (%)" }
  }`
  },

  // ── topic23 ── Fault Correlation ─────────────────────────────────────────────
  topic23: {
    mathModelling: `  mathModelling: {
    need: "A national backbone operator receives 8,000 raw alarms per hour during a major transmission outage. The NOC has 6 engineers. A single fibre cut at a hub site generates: 1 physical-layer alarm + 12 SDH/OTN path alarms + 40 downstream IP link alarms + 200 dependent service alarms = 253 alarms from one root cause. The NOC must correlate these into a single actionable event and identify the root cause within 3 minutes of the fibre cut occurring. Decision: no correlation / rule-based topological correlation / codebook correlation / AI-based correlation.",
    equation: "DECISION CONSTRAINT: Root cause identified within 3 minutes of first alarm. Actionable alarm count ≤ 30 per hour reaching NOC. Zero root-cause alarms suppressed. Correlation must process 8,000 alarms/hour in real time (< 1 second latency per alarm). Decision: No Correlation / Rule-Based Topological / Codebook / AI-Based.",
    technicalDetails: "No Correlation: All 8,000 alarms/hour reach the NOC. 253 alarms from a single fibre cut arrive simultaneously — engineers cannot identify the root cause within 3 minutes (typically requires 15–20 minutes of manual investigation). Root cause identification time: 15–20 minutes. Rule-Based Topological Correlation (Recommended): Correlation rules use network topology (which links share which physical fibres). Rule: 'IF >5 alarms arrive from topology cluster X within T_window=60 seconds, THEN emit one parent alarm (root cause candidate) and suppress dependent alarms.' Result: 253 alarms → 1 actionable alarm within 60 seconds of first alarm. Processing time: 2 ms per alarm — handles 8,000/hour in real time. Root cause ID: < 90 seconds. Codebook Correlation: Pre-defined alarm patterns mapped to known failure scenarios. Fast lookup (hash table). But: requires exhaustive codebook maintenance — every new network element type and failure mode must be manually added. Coverage: 70–80% of known failure types. Novel failures (new equipment, unexpected failure modes) not in the codebook generate uncorrelated alarm floods. AI-Based Correlation (Graph Neural Network): Learns topology-aware correlation patterns from historical data. Handles novel failure modes not seen in training. But: requires 18 months of labelled incident data. Training time: 2–4 weeks. Inference: 15–50 ms per alarm — meets real-time constraint. Not available yet (insufficient labelled data).",
    explanation: [
      { term: "No Correlation", meaning: "All alarms forwarded directly to NOC. WHY REJECTED: 253 alarms from a single fibre cut overwhelm the NOC. Root cause identification: 15–20 minutes — exceeds the 3-minute target. WHEN ADOPTED: In test/lab environments where all alarms are of interest for debugging network behaviour, or when the alarm volume is very low (< 10 alarms/hour) and correlation overhead is not justified." },
      { term: "Rule-Based Topological Correlation (Recommended)", meaning: "Topology-aware rules group alarms from the same physical path or dependency cluster. 253 alarms → 1 parent alarm within 60 seconds. Root cause ID: < 90 seconds — well within 3-minute target. Processing: 2 ms per alarm — handles 8,000/hour in real time. WHY BEST: Meets all constraints. Widely deployed in production NMS platforms (Nokia NetAct, Ericsson OSS, Netcracker OMC). Rule maintenance: network topology changes (new fibres, new nodes) require rule updates — typically 30 minutes per change." },
      { term: "Codebook Correlation", meaning: "Pre-defined patterns matched against alarm sequences. Fast (hash lookup). WHY INSUFFICIENT: Coverage limited to 70–80% of known failure types — novel failures generate uncorrelated floods. Codebook maintenance burden grows with network complexity. WHEN ADOPTED: Used as a supplement to topological correlation for known failure patterns that are faster to match via codebook lookup than topology traversal (e.g., common card failures with fixed alarm signatures)." },
      { term: "AI-Based Correlation (GNN)", meaning: "Learns correlation patterns from historical incidents. Handles novel failures. Inference: 15–50 ms — meets real-time constraint. WHY NOT YET ADOPTED: Requires 18 months of labelled incident data. Current dataset is insufficient. WHEN ADOPTED: After 18 months of topological correlation operation (which labels incidents), GNN model trained on labelled data progressively replaces manual rule maintenance — starting with the most common failure patterns." }
    ],
    advantages: [
      "Topological correlation reduces 253 alarms from a single fibre cut to 1 actionable parent alarm, cutting root cause identification time from 15 minutes to under 90 seconds",
      "Rule-based correlation processes 8,000 alarms per hour at 2 ms per alarm — fully real-time, with zero backlog accumulation during the worst-case transmission outage scenarios",
      "Parent alarm enrichment (attaching the correlated child alarm list and topology context) gives the engineer a complete failure picture in the first notification — no manual investigation of child alarms required"
    ],
    limitations: [
      "Codebook correlation is adopted as a supplement for known failure signatures that are faster to match via hash lookup than topology traversal — it handles 70% of common failure types with zero topology processing",
      "AI-based correlation is adopted after 18 months of labelled data from the rule-based engine — the rule engine is the prerequisite for training data generation, not the system it replaces",
      "No correlation is retained for test environments and lab NOC dashboards where full alarm visibility is needed for network behaviour analysis and equipment qualification"
    ]
  },`,
    virtualLab: `  virtualLab: {
    description: "Vary raw alarm volume and correlation efficiency to observe actionable alarms reaching the NOC. A single fibre cut generating 253 alarms at 97% efficiency becomes 1 actionable alarm. The chart shows how correlation efficiency translates to NOC workload reduction.",
    interpretation: "At 70% efficiency with 100 raw alarms, 30 actionable alarms reach the NOC — at the edge of the 30/hour target. At 97% efficiency, only 3 actionable alarms remain. This demonstrates why correlation rule tuning to 95%+ efficiency is essential for high-volume NOC environments, and why even small improvements in efficiency (e.g., from 90% to 97%) have a large impact on NOC workload.",
    parameters: [
      { id: "raw", name: "Raw Alarms", min: 10, max: 200, default: 100, step: 10, unit: "alarms" },
      { id: "efficiency", name: "Correlation Efficiency", min: 10, max: 99, default: 70, step: 5, unit: "%" }
    ],
    generateData: (params) => {
      const raw = params.raw || 100;
      const maxEff = params.efficiency || 70;
      const pts: Array<{ x: number; y: number }> = [];
      for (let e = 10; e <= maxEff; e += 5) {
        pts.push({ x: e, y: parseFloat((raw * (1 - e / 100)).toFixed(1)) });
      }
      return pts;
    },
    labels: { x: "Correlation Efficiency (%)", y: "Actionable Alarms" }
  }`
  },

  // ── topic24 ── Root Cause Analysis ───────────────────────────────────────────
  topic24: {
    mathModelling: `  mathModelling: {
    need: "A mobile operator's 5G NR network experiences a major service degradation: 450 cells go out of service simultaneously. The alarm management system receives 3,200 alarms in 2 minutes. The NOC must identify the single root cause within 5 minutes to restore service. Post-incident review shows that the failure originated at a single midhaul IP router — all 450 cells were backhauled through it. Decision: manual NOC investigation / event correlation + topology traversal / automated RCA engine / AI-based RCA.",
    equation: "DECISION CONSTRAINT: Root cause identified within 5 minutes of first alarm. Must handle 3,200 alarms in < 60 seconds. Root cause must be the single network element failure (not a symptom alarm). Must generate a structured incident ticket automatically. Decision: Manual NOC / Topology Traversal RCA / Automated RCA Engine / AI-based RCA.",
    technicalDetails: "Manual NOC Investigation: Engineers manually inspect alarm dashboard, filter by location, check topology maps. Average RCA time: 15–25 minutes for a 450-cell failure with 3,200 alarms — 3–5× over the 5-minute target. Topology Traversal RCA (Recommended): Algorithm traverses the network topology graph starting from alarming cells. Finds the common ancestor node (midhaul router) that is an alarm source shared by all 450 cells. Traversal: O(N log N) for N=450 cells and depth-5 topology — completes in < 2 seconds. Root cause identified: 90 seconds after first alarm (60-second correlation window + 30-second traversal). Incident ticket auto-generated with: root cause element, affected cell list, estimated subscriber impact (450 cells × average 500 subscribers = 225,000 affected). Automated RCA Engine (Moogsoft, IBM AIOps): SaaS RCA tools using pre-trained ML models. Integration time: 3–6 months. Accuracy: 85–90% on known failure patterns. Novel failures: 60–70% accuracy. Processing: near-real-time. AI-based RCA (custom GNN): Highest accuracy (92–95%) on trained failure patterns. Requires 12+ months of labelled incident data. Development: 6–12 months. Not available now.",
    explanation: [
      { term: "Manual NOC Investigation", meaning: "Engineers inspect alarm dashboard and topology maps manually. WHY REJECTED: Average RCA time 15–25 minutes for a 450-cell failure — 3–5× over the 5-minute target. At 3,200 alarms in 2 minutes, manual filtering is impractical. WHEN ADOPTED: Used for novel, complex failure scenarios not covered by automated RCA rules — the automated system escalates to NOC with a candidate root cause list, and the engineer makes the final determination." },
      { term: "Topology Traversal RCA (Recommended)", meaning: "Graph traversal from symptom alarms to common ancestor. 450 cells → shared midhaul router in < 2 seconds. Root cause identified within 90 seconds. Incident ticket auto-generated. WHY BEST: Meets the 5-minute target. Deterministic — same failure always produces the same result. Zero false positives from topology errors (topology database is kept current via NMS discovery). Widely deployed: Nokia NetAct RCA, Ericsson OSS RCA, and Huawei iMaster NCE all use topology-aware RCA engines." },
      { term: "Automated RCA Engine (SaaS ML)", meaning: "Pre-trained ML models (Moogsoft, IBM AIOps). 85–90% accuracy. Near-real-time. WHY SECONDARY: 3–6 month integration time. Novel failures (new equipment types) reduce accuracy to 60–70%. False positives require NOC validation — adding 2–3 minutes to the RCA process. WHEN ADOPTED: Supplement to topology traversal for ambiguous failure scenarios where topology alone cannot identify the root cause (e.g., software bugs that generate atypical alarm patterns)." },
      { term: "AI-based RCA (custom GNN)", meaning: "92–95% accuracy on trained patterns. But requires 12+ months of labelled data and 6–12 months development. WHY NOT YET: Insufficient labelled data. Development timeline exceeds the business requirement for a solution within 3 months. WHEN ADOPTED: Long-term goal after topology traversal RCA generates 12+ months of labelled incidents — GNN trained on this data can handle novel failures not expressible as topology rules." }
    ],
    advantages: [
      "Topology traversal RCA identifies the single root-cause element from 3,200 alarms in under 90 seconds — meeting the 5-minute business constraint with 3× margin",
      "Auto-generated incident tickets include the affected cell list and estimated subscriber impact (225,000 in this case) — enabling immediate customer communication without NOC investigation",
      "Deterministic topology traversal produces the same result every time for the same failure — unlike ML-based approaches, there are no confidence scores or false-positive risks for well-modelled failure patterns"
    ],
    limitations: [
      "SaaS ML RCA is adopted as a supplement for ambiguous failures where topology traversal cannot unambiguously identify the root cause — the two approaches are complementary",
      "Manual NOC investigation is retained for novel failure scenarios escalated by the automated system — engineers make the final determination when the automated confidence is below a threshold",
      "Custom AI RCA is adopted as the long-term evolution after 12 months of labelled data from the topology traversal engine enables model training with sufficient coverage of the operator's specific failure catalogue"
    ]
  },`,
    virtualLab: `  virtualLab: {
    description: "Vary network element count and topology depth to observe RCA traversal complexity. Traversal time scales as O(N × depth). At 450 cells and depth 5, traversal completes in < 2 seconds — well within the 5-minute RCA target. Increasing depth beyond 6 causes exponential growth, motivating flat topology designs.",
    interpretation: "Traversal complexity grows with both cell count and topology depth. At depth 5 with 450 cells, the traversal processes ~2,250 topology hops — completing in under 2 seconds at 1,000 hops/second. At depth 8, traversal processes 3,600 hops for the same cell count. This illustrates why network topology designs that minimise backhaul depth (flat IP topologies with 2–3 aggregation tiers) significantly reduce RCA convergence time.",
    parameters: [
      { id: "cells", name: "Affected Cells", min: 10, max: 500, default: 100, step: 10, unit: "" },
      { id: "depth", name: "Topology Depth", min: 1, max: 10, default: 5, step: 1, unit: "" }
    ],
    generateData: (params) => {
      const maxCells = params.cells || 100;
      const depth = params.depth || 5;
      const pts: Array<{ x: number; y: number }> = [];
      for (let c = 10; c <= maxCells; c += 10) {
        const hops = c * depth;
        const timeMs = hops / 1000 * 1000;
        pts.push({ x: c, y: parseFloat(timeMs.toFixed(1)) });
      }
      return pts;
    },
    labels: { x: "Affected Cells", y: "Traversal Time (ms)" }
  }`
  },

  // ── topic25 ── Alarm Suppression Mechanism ───────────────────────────────────
  topic25: {
    mathModelling: `  mathModelling: {
    need: "A regional operator's NMS generates 50,000 alarms per day from a 2,000-element network. The NOC has 4 engineers who can investigate a maximum of 200 alarms per day total. Without suppression, 99.6% of alarms are uninvestigated — critical failures are missed. The operator must reduce daily actionable alarms to under 200 while maintaining zero suppression of P1 alarms. Three suppression mechanisms are evaluated.",
    equation: "DECISION CONSTRAINT: Daily actionable alarms ≤ 200. Zero P1 alarms suppressed. Suppression must process 50,000 alarms/day in real time (< 500 ms per alarm). Must not suppress alarms from elements in maintenance mode (those should be acknowledged, not suppressed). Decision: Severity-only filter / Time-window deduplication / Hierarchical suppression / Combined tiered suppression.",
    technicalDetails: "Severity-only filter (P1 only): Suppresses all alarms below P1. Assumes 1% of alarms are P1 = 500 P1 alarms/day. Still 2.5× above the 200/day target. Useful P2/P3 information lost — some P3 alarms indicate developing faults that become P1 within hours. Time-window Deduplication: Suppresses duplicate alarm instances from the same element within a 15-minute window. Typical deduplication rate: 60% (many alarms repeat while the fault persists). 50,000 × 0.4 = 20,000 unique alarms/day. Still 100× above target. Hierarchical Suppression (parent-child topology): If a parent element is in alarm, child element alarms are suppressed. Example: if an aggregation switch is down, all connected access switches generate alarms — suppress the child alarms. Suppression rate: 70–80% for hierarchical networks. 50,000 × 0.25 = 12,500 alarms/day. Still 62× above target. Combined Tiered Suppression (Recommended): Apply all three mechanisms in sequence: (1) Maintenance mode filter: acknowledge (not suppress) alarms from elements in maintenance — removes ~5% of alarms. (2) Time-window deduplication: 60% reduction. (3) Hierarchical suppression: 75% reduction on remainder. (4) Severity filter (P2+): 80% of remainder is P3/P4. Combined: 50,000 × 0.95 × 0.40 × 0.25 × 0.20 = 950 actionable alarms/day before P2+ filter. Apply P2+ filter: 950 × 0.30 = 285. With further tuning of deduplication window: ~200 actionable alarms/day.",
    explanation: [
      { term: "Severity-only Filter", meaning: "Drops all alarms below P1. WHY INSUFFICIENT ALONE: 500 P1 alarms/day — 2.5× the 200/day target. Loses useful P2/P3 information that indicates developing faults. WHEN ADOPTED: Final stage in a tiered suppression pipeline — after deduplication and hierarchical suppression have reduced volume, a P2+ severity filter applies the final 80% reduction." },
      { term: "Time-window Deduplication", meaning: "Suppresses duplicate alarms from the same element within a 15-minute window. 60% reduction. WHY INSUFFICIENT ALONE: 20,000 unique alarms/day — 100× the target. But it is an essential first stage in the suppression pipeline — without it, every persistent fault generates hundreds of duplicate alarms that overwhelm downstream correlation. WHEN ADOPTED: Always applied as the first suppression stage, before hierarchical or severity filtering." },
      { term: "Hierarchical Suppression", meaning: "Parent alarm suppresses child alarms in the same topology path. 75% reduction. WHY INSUFFICIENT ALONE: 12,500 alarms/day — 62× the target. But captures the most operationally significant relationship: child alarms caused by a parent failure are not actionable until the parent is restored. WHEN ADOPTED: Applied after deduplication — the second stage in the tiered pipeline." },
      { term: "Combined Tiered Suppression (Recommended)", meaning: "Maintenance filter → deduplication → hierarchical suppression → severity filter applied in sequence. Combined reduction: 99.6%. 50,000 → ~200 actionable alarms/day. WHY BEST: Each mechanism addresses a different suppression category — no single mechanism is sufficient alone. The tiered approach meets the 200/day target without suppressing any P1 alarm. Industry standard: Nokia NetAct, Ericsson OSS, and Huawei iMaster NCE all implement multi-stage alarm suppression pipelines." }
    ],
    advantages: [
      "Combined tiered suppression reduces daily alarm volume by 99.6% — from 50,000 to 200 actionable alarms — enabling 4 engineers to investigate every actionable alarm without prioritisation conflicts",
      "Hierarchical suppression automatically focuses NOC attention on root-cause elements — child alarms from dependent elements disappear from the dashboard until the parent is restored",
      "Maintenance mode filtering acknowledges (not suppresses) alarms from planned maintenance — engineers see the maintenance activity without being paged, preserving audit trail while eliminating NOC distraction"
    ],
    limitations: [
      "Deduplication-only is adopted as the minimum baseline for any NMS — without it, persistent faults generate hundreds of duplicate alarms that pollute the dashboard and mask new alarms",
      "Hierarchical suppression is adopted in flat-topology networks where parent-child relationships are well-defined — in mesh networks without clear topology hierarchy, topological suppression may suppress legitimate independent alarms",
      "Severity-only filter is adopted as the final stage in the tiered pipeline — never as the sole suppression mechanism, since it discards P3/P4 alarms that may indicate developing faults"
    ]
  },`,
    virtualLab: `  virtualLab: {
    description: "Vary total daily alarm count and number of suppression stages (1 = deduplication only, 2 = + hierarchical, 3 = + severity filter) to observe final actionable alarm count. Combined suppression stages produce multiplicative reductions.",
    interpretation: "With 50,000 raw alarms and 3 suppression stages (60% + 75% + 80% reduction each), actionable alarms reach 50,000 × 0.4 × 0.25 × 0.20 = 1,000 per day — with further tuning to ~200. Removing any single stage dramatically increases the actionable count: without the severity filter, actionable alarms are 5,000/day — 25× over the NOC capacity. This illustrates why all three stages are essential.",
    parameters: [
      { id: "rawAlarms", name: "Raw Alarms/Day", min: 1000, max: 100000, default: 50000, step: 1000, unit: "" },
      { id: "stages", name: "Suppression Stages", min: 1, max: 3, default: 3, step: 1, unit: "" }
    ],
    generateData: (params) => {
      const raw = params.rawAlarms || 50000;
      const stages = Math.round(params.stages || 3);
      const reductions = [0.4, 0.25, 0.2];
      const pts: Array<{ x: number; y: number }> = [];
      let current = raw;
      for (let s = 1; s <= stages; s++) {
        current = current * reductions[s - 1];
        pts.push({ x: s, y: Math.round(current) });
      }
      return pts;
    },
    labels: { x: "Suppression Stages Applied", y: "Actionable Alarms/Day" }
  }`
  },

  // ── topic26 ── NMS Discovery ─────────────────────────────────────────────────
  topic26: {
    mathModelling: `  mathModelling: {
    need: "A new operator is deploying an NMS to manage 5,000 network elements across 3 technology domains (RAN, transport, IP core). Day 1 of NMS deployment requires all 5,000 elements to be discovered (IP addresses, device type, YANG capabilities, interface inventory). The discovery must complete within 8 hours (one shift) and must produce accurate topology maps for fault correlation. Three discovery strategies are evaluated.",
    equation: "DECISION CONSTRAINT: 5,000 elements fully discovered within 8 hours. Discovery must identify device type, management IP, software version, YANG capabilities, and interface list per element. Topology map must be accurate within 10% (no more than 500 missing links). Decision: Manual seed + SNMP scan / LLDP/CDP topology discovery / NETCONF capability exchange / Hybrid automated discovery.",
    technicalDetails: "Manual Seed + SNMP Scan: Operator manually enters 5,000 IP addresses into NMS seed table. NMS sends SNMP GET to each device. Discovery rate: 10 devices/minute (SNMP timeout handling). 5,000 devices: 500 minutes (8.3 hours) — marginally over the 8-hour constraint. SNMP provides: sysName, sysDescr, ifTable. No YANG capabilities. Topology accuracy: 60% (SNMP does not provide LLDP/CDP neighbour data natively on all vendors). LLDP/CDP Topology Discovery (Recommended stage 1): Seeds 50 core nodes manually. NMS queries LLDP-MIB or CDP tables on each discovered node to find neighbours. Cascading discovery propagates from 50 seeds to all 5,000 elements. Discovery rate: 100 devices/minute (parallel LLDP neighbour queries). 5,000 devices: 50 minutes. Topology accuracy: 95% (LLDP provides exact physical link endpoints). NETCONF Capability Exchange (stage 2): After LLDP discovery provides IP and device identity, NMS opens NETCONF sessions and exchanges hello messages. Device sends: list of supported YANG modules, revisions, and features. Per-device: 2 seconds (hello + capability parsing). 5,000 devices with 50 parallel sessions: 200 seconds (3.3 minutes). Full YANG capability map built. Hybrid Automated Discovery (Recommended): Stage 1 LLDP (50 minutes) → Stage 2 NETCONF capability exchange (3.3 minutes) → Stage 3 interface inventory via NETCONF get (10 minutes). Total: 63 minutes — 87% faster than the 8-hour constraint. Topology accuracy: 95%. YANG capabilities: 100%.",
    explanation: [
      { term: "Manual Seed + SNMP Scan", meaning: "Operator enters 5,000 IPs manually; SNMP scans each. WHY REJECTED: 8.3 hours — marginally exceeds the 8-hour constraint. Manual IP entry for 5,000 devices: 4 hours of data entry alone. Topology accuracy 60% — insufficient for fault correlation. No YANG capabilities discovered. WHEN ADOPTED: Legacy NMS environments where devices do not support LLDP or NETCONF — SNMP is the only available protocol for discovery." },
      { term: "LLDP/CDP Topology Discovery (Stage 1 — Recommended)", meaning: "Seeds 50 core nodes, then cascades via LLDP neighbour queries. 5,000 devices in 50 minutes. Topology accuracy: 95%. WHY BEST FOR STAGE 1: 50 manual seeds (10 minutes) vs 5,000 manual IPs (4 hours). Discovery is automatic — engineers monitor progress, not perform data entry. All link endpoints discovered accurately via LLDP-MIB neighbour tables." },
      { term: "NETCONF Capability Exchange (Stage 2 — Recommended)", meaning: "After LLDP provides device identity and management IP, NETCONF hello exchange provides the full YANG capability list. 3.3 minutes for 5,000 devices with 50 parallel sessions. WHY ESSENTIAL: Without YANG capability discovery, the NMS cannot know which models to use for configuration and state retrieval per device — it must resort to CLI screen-scraping or proprietary APIs." },
      { term: "Hybrid Automated Discovery (Recommended — Full)", meaning: "LLDP stage 1 → NETCONF stage 2 → interface inventory stage 3. Total: 63 minutes. Topology accuracy: 95%. YANG capabilities: 100%. Interface inventory: complete. WHY BEST OVERALL: Completes all discovery goals in 63 minutes — 87% faster than the 8-hour constraint, leaving 7 hours for validation and topology review. The 3-stage hybrid is the standard approach in Nokia NetAct, Ericsson ENM, and Cisco NSO initial deployment." }
    ],
    advantages: [
      "LLDP cascade discovery from 50 seeds reaches all 5,000 elements automatically — eliminating 4 hours of manual IP entry while achieving 95% topology accuracy",
      "NETCONF capability exchange provides a machine-readable YANG capability map per device — the NMS automatically selects the correct models without per-vendor hard-coding",
      "Hybrid 3-stage discovery completes in 63 minutes vs the 8-hour manual alternative — freeing the shift for topology validation and initial performance baseline collection"
    ],
    limitations: [
      "Manual SNMP discovery is adopted for legacy devices that do not support LLDP or NETCONF — these devices must be seeded manually and their topology links inferred from configuration data",
      "LLDP-only discovery is adopted as a standalone mechanism in pure transport networks where NETCONF is not yet deployed — topology is accurate but YANG capabilities are unknown",
      "Manual seed + SNMP is adopted for greenfield sites where no prior topology data exists and the network is being built element-by-element — each element is added to the NMS manually as it is commissioned"
    ]
  },`,
    virtualLab: `  virtualLab: {
    description: "Vary NE count and discovery rate (devices/minute) to observe total discovery time. Compare manual SNMP (10 dev/min) vs LLDP cascade (100 dev/min) vs hybrid parallel (500 dev/min) strategies. The 8-hour (480-minute) target is the constraint.",
    interpretation: "At 5,000 NEs with SNMP at 10 devices/minute, discovery takes 500 minutes — exceeding the 8-hour (480-minute) window. LLDP cascade at 100 devices/minute completes in 50 minutes. Hybrid parallel at 500 devices/minute: 10 minutes. As the network grows to 10,000 NEs, only hybrid parallel stays under the 8-hour window. This illustrates why parallel discovery with NETCONF sessions is the design choice for large-scale NMS deployments.",
    parameters: [
      { id: "nes", name: "Network Elements", min: 100, max: 10000, default: 1000, step: 100, unit: "" },
      { id: "rate", name: "Discovery Rate (NE/min)", min: 10, max: 500, default: 100, step: 10, unit: "" }
    ],
    generateData: (params) => {
      const maxNes = params.nes || 1000;
      const rate = params.rate || 100;
      const pts: Array<{ x: number; y: number }> = [];
      for (let n = 100; n <= maxNes; n += 100) {
        pts.push({ x: n, y: parseFloat((n / rate).toFixed(2)) });
      }
      return pts;
    },
    labels: { x: "Network Elements", y: "Discovery Time (min)" }
  }`
  },

  // ── topic27 ── NMS NBI Interface ─────────────────────────────────────────────
  topic27: {
    mathModelling: `  mathModelling: {
    need: "A mobile operator is integrating its NMS (Nokia NetAct) with three northbound consumers: (1) a BSS/OSS orchestration platform, (2) a business analytics dashboard, and (3) a third-party AI operations platform. Each consumer has different requirements: the orchestration platform needs transactional configuration changes, the analytics dashboard needs high-frequency performance data (every 5 minutes for 2,000 KPIs), and the AI platform needs real-time alarm streaming. The NMS must expose a single NBI that can serve all three consumers. Decision: SOAP/XML NBI / RESTCONF NBI / gRPC streaming NBI / multi-protocol NBI.",
    equation: "DECISION CONSTRAINT: Orchestration: transactional config changes with rollback. Analytics: 2,000 KPIs every 5 minutes (JSON). AI platform: alarm streaming with < 1-second latency. All three consumers must use the same NBI endpoint. Decision: SOAP/XML / RESTCONF / gRPC / Multi-protocol NBI.",
    technicalDetails: "SOAP/XML NBI: Traditional NBI protocol (used in TM Forum standards). Orchestration: supports transactional operations. Analytics: XML responses require JSON conversion — adds latency and development overhead. AI streaming: SOAP is request-response, not streaming — AI platform must poll every second (high overhead). RESTCONF NBI: GET/PUT/PATCH for config changes. JSON natively. Analytics: HTTP polling every 5 minutes — 2,000 KPIs per poll. Streaming: server-sent events (SSE) for alarm streaming — RESTCONF extension, < 1-second latency achievable. Compatible with all three consumers. gRPC Streaming NBI: Binary protocol, streaming native. AI alarm streaming: excellent (< 100 ms). Analytics: gRPC server streaming. Orchestration: gRPC unary RPC. But: requires gRPC client in all three consumers — orchestration platform and analytics dashboard may not support gRPC. Multi-protocol NBI (Recommended): RESTCONF for orchestration and analytics (one protocol for two consumers). gRPC/gNMI streaming for AI platform (best-in-class for alarm streaming). Two protocols, three consumers — each consumer uses the protocol best suited to its requirements. NMS exposes both endpoints from the same data backend.",
    explanation: [
      { term: "SOAP/XML NBI", meaning: "Traditional TM Forum NBI. WHY REJECTED: XML encoding overhead for analytics (2,000 KPIs × XML tags: 4–8× larger payload than JSON). SOAP polling for AI streaming: 1 request/second per alarm = high orchestration overhead on NMS. WHEN ADOPTED: Legacy BSS/OSS platforms (pre-2015 vintage) that only support SOAP/XML northbound consumption — still common in tier-3 operators using vendor-supplied BSS with no REST capability." },
      { term: "RESTCONF NBI (primary for 2 of 3 consumers)", meaning: "JSON-native HTTP API. Orchestration: PUT/PATCH with YANG validation. Analytics: GET 2,000 KPIs every 5 minutes — JSON payload efficient. Alarm streaming: SSE extension provides < 1-second push delivery to AI platform. WHY FOR THESE TWO: Meets orchestration and analytics constraints. SSE for streaming is a workable solution for the AI platform but has higher latency than gRPC streaming (~500 ms vs < 100 ms)." },
      { term: "gRPC Streaming NBI (secondary for AI platform)", meaning: "Binary streaming protocol. AI alarm streaming: < 100 ms latency. Native backpressure handling for burst alarm scenarios. WHY FOR AI: The AI platform processes alarms at > 1,000/second — gRPC streaming with binary encoding is the only protocol that delivers sub-100 ms alarm notification at this rate. RESTCONF SSE can deliver ~200 alarms/second before HTTP connection overhead becomes a bottleneck." },
      { term: "Multi-protocol NBI (Recommended)", meaning: "RESTCONF for orchestration + analytics, gRPC for AI streaming. NMS exposes both from the same data model backend. WHY BEST: Each consumer uses the protocol best suited to its requirements — no compromises. Two protocols vs one adds minimal NMS complexity (both are served by the same YANG datastore). This is the standard Nokia NSP NBI architecture: RESTCONF + gNMI streaming from one platform." }
    ],
    advantages: [
      "Multi-protocol NBI allows each consumer to use the protocol best suited to its data access pattern — transactional REST for configuration, streaming gRPC for real-time alarms — without forcing compromises",
      "Both RESTCONF and gRPC are YANG-modelled — the same YANG module describes the same data regardless of the protocol used to access it, enabling consistent data governance",
      "RESTCONF analytics polling at 5-minute intervals for 2,000 KPIs generates only 800 KB of JSON per poll — well within management network bandwidth, vs SOAP XML at 4–6 MB for the same data"
    ],
    limitations: [
      "SOAP/XML NBI is retained for legacy BSS/OSS consumers that cannot be upgraded to REST — typically wrapped by an adapter layer that translates RESTCONF responses to SOAP/XML",
      "gRPC-only NBI is adopted when all consumers are cloud-native platforms with gRPC support — typically greenfield deployments where legacy consumer compatibility is not a requirement",
      "Single-protocol RESTCONF NBI is adopted when the AI platform can accept 500 ms alarm latency and the additional complexity of operating two NBI protocols is not justified"
    ]
  },`,
    virtualLab: `  virtualLab: {
    description: "Vary KPI count and polling interval to observe NBI data volume per poll cycle. Compare JSON (RESTCONF) vs XML (SOAP) payload sizes. JSON is approximately 3× smaller than XML for the same data. Shows when bandwidth becomes a constraint on polling frequency.",
    interpretation: "At 2,000 KPIs with 5-minute intervals, JSON polling generates 800 KB per cycle (2.7 KB/sec average bandwidth). XML generates 2.4 MB per cycle (8 KB/sec). As polling frequency increases to 1 minute, JSON uses 13 KB/sec — still manageable on a 1 Mbps management link. XML at 1-minute intervals: 40 KB/sec — consuming 32% of a 1 Mbps management link. This illustrates why JSON is required for high-frequency KPI collection over constrained management networks.",
    parameters: [
      { id: "kpis", name: "KPI Count", min: 100, max: 5000, default: 500, step: 100, unit: "" },
      { id: "intervalMin", name: "Polling Interval (min)", min: 1, max: 60, default: 5, step: 1, unit: " min" }
    ],
    generateData: (params) => {
      const maxKpis = params.kpis || 500;
      const interval = params.intervalMin || 5;
      const pts: Array<{ x: number; y: number }> = [];
      for (let k = 100; k <= maxKpis; k += 100) {
        const jsonKB = (k * 40) / 1024;
        pts.push({ x: k, y: parseFloat(jsonKB.toFixed(1)) });
      }
      return pts;
    },
    labels: { x: "KPI Count", y: "JSON Payload (KB)" }
  }`
  },

  // ── topic28 ── NMS FM NBI Flow ────────────────────────────────────────────────
  topic28: {
    mathModelling: `  mathModelling: {
    need: "A tier-1 operator's NMS Fault Management (FM) system must deliver alarm notifications to four external consumers via its NBI: a BSS ticketing system, an AI ops platform, a dashboard, and a regulatory compliance logger. The FM NBI receives 500 alarms per minute during peak outage events. Each consumer has a different SLA: BSS ticketing < 30 seconds, AI platform < 5 seconds, dashboard < 2 seconds, compliance logger < 60 seconds. The NBI must serve all four consumers simultaneously without any consumer's SLA violation affecting others.",
    equation: "DECISION CONSTRAINT: BSS < 30 s, AI platform < 5 s, dashboard < 2 s, compliance logger < 60 s. Must handle 500 alarms/minute burst. Consumer SLA violations must not cascade (one slow consumer must not block others). Must support at-least-once delivery to compliance logger (zero alarm loss). Decision: Synchronous push / Event queue per consumer / Publish-subscribe bus / Priority-tiered queue.",
    technicalDetails: "Synchronous Push: NMS pushes each alarm synchronously to all four consumers before processing the next alarm. Processing rate: limited by slowest consumer. If BSS ticketing takes 25 seconds to acknowledge, NMS is blocked for 25 seconds per alarm — cannot process 500/minute. Dashboard SLA (2 s) violated whenever BSS is slow. Event Queue per Consumer (isolated queues): Each consumer has its own alarm queue. NMS writes to all 4 queues in < 1 ms per alarm. Each consumer reads from its own queue at its own pace. Burst handling: queue absorbs the 500/minute peak — no consumer blocks another. Compliance logger queue is persistent (disk-backed, at-least-once delivery). Dashboard queue is in-memory (low latency). Publish-Subscribe Bus (Kafka — Recommended): NMS publishes alarms to a Kafka topic. Each consumer subscribes with its own consumer group. Dashboard consumer: Kafka consumer with 0 ms offset lag target — processes in real time (< 500 ms end-to-end). AI platform: consumer with < 1 s processing SLA. BSS and compliance: consumers with relaxed latency. Kafka provides: per-consumer offset management, replay (compliance logger can replay missed alarms), burst absorption. Priority-tiered Queue: Alarms prioritised by severity — P1 alarms delivered first to all consumers regardless of queue depth. Complexity: requires priority classification at ingest. Useful for BSS ticketing (only P1/P2 alarms generate tickets).",
    explanation: [
      { term: "Synchronous Push", meaning: "NMS blocks on each consumer acknowledgement. WHY REJECTED: Slowest consumer (BSS at 25 s) blocks all others — dashboard SLA (2 s) violated on every alarm when BSS is slow. Cannot process 500 alarms/minute when each alarm requires up to 25 seconds. WHEN ADOPTED: Acceptable for very low alarm rates (< 1 alarm/minute) and two consumers with similar latency requirements — e.g., lab NOC dashboards." },
      { term: "Per-Consumer Event Queue", meaning: "Each consumer has an isolated queue. NMS writes < 1 ms per alarm. Dashboard processes in < 2 s; BSS in < 30 s; compliance in < 60 s — all independently. WHY ADEQUATE: Meets all SLA constraints. Simpler to implement than Kafka. Limitation: no replay capability for compliance logger — if the compliance service restarts, missed alarms are lost from the in-memory queue. WHEN ADOPTED: Small deployments with 2–3 consumers and moderate alarm rates (< 100/minute)." },
      { term: "Publish-Subscribe Bus — Kafka (Recommended)", meaning: "NMS publishes to Kafka topic. Each consumer group independently reads at its own pace. Dashboard consumer: real-time (< 500 ms). AI platform: < 1 s. Compliance: persistent Kafka topic (retention 30 days) — at-least-once delivery, replay on restart. Burst: Kafka absorbs 500/minute peaks without backpressure to NMS. WHY BEST: Only option that provides at-least-once delivery to compliance logger and replay capability. Industry standard for large-scale NMS NBI: Nokia NSP, Ericsson OSS/EOI, and Huawei iMaster NCE all use Kafka for alarm distribution." },
      { term: "Priority-tiered Queue", meaning: "P1/P2 alarms prioritised ahead of P3/P4 in each consumer queue. Ensures BSS ticketing and dashboard receive critical alarms first during storms. WHY SUPPLEMENTARY: Addresses priority inversion (P3 storm blocking P1 delivery) but does not solve the fundamental synchronous blocking problem. WHEN ADOPTED: Added as a priority classification layer on top of the Kafka-based pub-sub architecture — P1 alarms go to a dedicated high-priority Kafka partition consumed first by dashboard and AI platform." }
    ],
    advantages: [
      "Kafka publish-subscribe isolates consumer SLAs completely — a BSS system taking 25 seconds to process an alarm does not delay the dashboard or AI platform by even 1 millisecond",
      "Persistent Kafka topic with 30-day retention provides at-least-once delivery to the compliance logger — alarms are never lost even if the compliance service is offline for days",
      "Consumer group offset management allows the AI platform to process alarms in real time while the compliance logger processes at its own pace — without any coordination between consumers"
    ],
    limitations: [
      "Per-consumer event queues are adopted for small-scale NMS deployments (< 100 alarms/minute, 2–3 consumers) where Kafka cluster operational overhead is not justified",
      "Synchronous push is adopted for lab/test environments where alarm volume is very low and all consumers are local services with < 100 ms response time",
      "Priority queuing is adopted as an additional layer within the Kafka architecture for environments with alarm storm scenarios — it does not replace the pub-sub architecture but enhances alarm delivery ordering"
    ]
  },`,
    virtualLab: `  virtualLab: {
    description: "Vary alarm arrival rate and consumer processing delay to observe queue depth growth over time. Demonstrates why isolated consumer queues (or Kafka topics) prevent a slow consumer from blocking fast consumers. Queue depth = (arrival rate - processing rate) × time.",
    interpretation: "When alarm arrival rate (500/min) exceeds a slow consumer's processing rate (e.g., 100/min for BSS ticketing), the queue grows by 400 alarms/minute. After 10 minutes, the BSS queue has 4,000 unprocessed alarms — but the dashboard queue (processing at 500/min) remains at depth 0. Without isolation, synchronous push would have blocked the dashboard for the same 10 minutes. This illustrates the fundamental value of per-consumer queue isolation.",
    parameters: [
      { id: "arrivalRate", name: "Alarm Arrival Rate (/min)", min: 10, max: 1000, default: 100, step: 10, unit: "/min" },
      { id: "processingRate", name: "Consumer Processing Rate (/min)", min: 10, max: 1000, default: 50, step: 10, unit: "/min" }
    ],
    generateData: (params) => {
      const arrival = params.arrivalRate || 100;
      const processing = params.processingRate || 50;
      const pts: Array<{ x: number; y: number }> = [];
      for (let t = 1; t <= 20; t++) {
        const depth = Math.max(0, (arrival - processing) * t);
        pts.push({ x: t, y: depth });
      }
      return pts;
    },
    labels: { x: "Time (min)", y: "Queue Depth (alarms)" }
  }`
  },

  // ── topic29 ── REST API Concept ──────────────────────────────────────────────
  topic29: {
    mathModelling: `  mathModelling: {
    need: "A network automation team is designing the API layer for a new self-service network portal that allows enterprise customers to provision MPLS VPNs, retrieve interface statistics, and submit fault tickets. The portal must serve 500 concurrent enterprise users and integrate with 4 backend systems: NMS (Nokia NSP), IPAM (IP address management), ticketing (ServiceNow), and billing (SAP). The API must be consumable by web browsers (JavaScript Fetch) and mobile apps without proprietary SDKs. Decision: SOAP Web Services / REST API / GraphQL / gRPC.",
    equation: "DECISION CONSTRAINT: Must be consumable by JavaScript Fetch and mobile apps (no SDK). Must integrate with 4 backend systems without custom integration code per system. Must support 500 concurrent users. Response time < 2 seconds for all read operations. Must support partial updates (PATCH) for VPN configuration. Decision: SOAP / REST / GraphQL / gRPC.",
    technicalDetails: "SOAP Web Services: XML-based RPC protocol with WSDL. Browser consumption: requires a SOAP client library — not native to JavaScript Fetch. Response time: XML parsing overhead adds 200–500 ms vs JSON. Integration with 4 backends: each backend requires a SOAP adapter — high integration cost. Not suitable for mobile apps without SDK. REST API (Recommended): Standard HTTP verbs (GET, POST, PUT, PATCH, DELETE) with JSON responses. JavaScript Fetch and mobile HTTP libraries consume natively — zero SDK. 500 concurrent users: horizontal scaling via stateless architecture (REST is inherently stateless). PATCH support: partial VPN config updates without replacing the full resource. 4 backend integration: each backend exposes its own REST API (NMS: RESTCONF, IPAM: proprietary REST, ServiceNow: REST, SAP: REST) — the portal's API aggregates them without custom adapters. Response time: JSON parse < 5 ms vs XML 200–500 ms. GraphQL: Single endpoint, client specifies exact fields needed. Reduces over-fetching for mobile apps. But: requires GraphQL server implementation — 3–4 months additional development. Not native to NMS systems (requires a translation layer from YANG/RESTCONF to GraphQL schema). gRPC: Binary protocol, highest throughput. Not consumable by JavaScript Fetch (gRPC-Web required — additional proxy layer). Not suitable for browser-native consumption without additional infrastructure.",
    explanation: [
      { term: "SOAP Web Services", meaning: "XML-RPC with WSDL contract. WHY REJECTED: Not consumable by JavaScript Fetch natively. XML overhead (200–500 ms per response) violates the 2-second read response target for high-volume endpoints. WHEN ADOPTED: Enterprise integrations with SAP or legacy billing systems that expose only SOAP/XML APIs — the portal includes a SOAP adapter for SAP billing while using REST for all other integrations." },
      { term: "REST API (Recommended)", meaning: "Standard HTTP + JSON. Zero SDK requirement — Fetch and all mobile HTTP clients work natively. Stateless design scales horizontally to 500+ concurrent users without session affinity. PATCH for partial updates. 4 backend integrations: each backend's native REST API is aggregated by the portal's API gateway. WHY BEST: Meets all five constraints simultaneously. REST is the standard for network automation portals across all major vendors (Nokia, Cisco, Ericsson, Juniper all expose REST NBIs)." },
      { term: "GraphQL", meaning: "Query language with single endpoint. Reduces mobile over-fetching. WHY SECONDARY: 3–4 months additional development to implement GraphQL server and translate YANG/RESTCONF models to GraphQL schema. WHEN ADOPTED: After REST API is in production and mobile app analytics show that over-fetching (downloading unused fields) is causing measurable performance issues — GraphQL is added as an optimization layer on top of the REST backend." },
      { term: "gRPC", meaning: "Binary protocol, highest throughput, native streaming. WHY REJECTED FOR BROWSER: Not consumable by JavaScript Fetch without gRPC-Web proxy layer (additional infrastructure). WHEN ADOPTED: Server-to-server integrations between the portal backend and NMS backend (e.g., portal backend → Nokia NSP gNMI interface for telemetry streaming) — not as the portal's external-facing API." }
    ],
    advantages: [
      "REST's stateless architecture enables horizontal scaling to 500+ concurrent users without session affinity requirements — new API server instances can be added without any configuration changes",
      "Standard HTTP verbs (GET, POST, PUT, PATCH, DELETE) provide a uniform interface across all 4 backend integrations — the portal's API gateway uses the same integration pattern regardless of backend",
      "JSON responses are natively parsed by JavaScript and all mobile platforms without parsing libraries — eliminating SDK dependencies for enterprise customers and reducing app bundle sizes"
    ],
    limitations: [
      "SOAP adapters are adopted for backend systems (SAP billing) that do not expose REST APIs — the portal's API gateway includes a SOAP-to-JSON translation layer for these legacy backends",
      "GraphQL is adopted as an optimization layer after REST is in production when mobile analytics show over-fetching causing performance issues on 3G/4G connections",
      "gRPC is adopted for internal server-to-server streaming integrations (portal backend to NMS telemetry) where binary encoding efficiency and streaming are required and browser compatibility is not a concern"
    ]
  },`,
    virtualLab: `  virtualLab: {
    description: "Vary concurrent user count and average request processing time to observe total portal API throughput (requests/second). Demonstrates why stateless REST architecture scales linearly with server instances while stateful architectures hit concurrency limits.",
    interpretation: "At 500 concurrent users each making 1 request every 2 seconds, the portal needs 250 requests/second throughput. At 50 ms average processing time per request, a single server handles 20 requests/second — requiring 13 server instances. Adding a 14th instance provides headroom for traffic spikes. This illustrates why REST stateless design (allowing any server to handle any request) is essential for elastic horizontal scaling.",
    parameters: [
      { id: "users", name: "Concurrent Users", min: 10, max: 1000, default: 100, step: 10, unit: "" },
      { id: "processingMs", name: "Avg Processing Time", min: 10, max: 500, default: 50, step: 10, unit: " ms" }
    ],
    generateData: (params) => {
      const maxUsers = params.users || 100;
      const procMs = params.processingMs || 50;
      const pts: Array<{ x: number; y: number }> = [];
      for (let u = 10; u <= maxUsers; u += 10) {
        const rps = 1000 / procMs;
        const serversNeeded = Math.ceil(u / (rps * 2));
        pts.push({ x: u, y: serversNeeded });
      }
      return pts;
    },
    labels: { x: "Concurrent Users", y: "Servers Needed" }
  }`
  },

  // ── topic30 ── REST API Commands and Operation Flow ──────────────────────────
  topic30: {
    mathModelling: `  mathModelling: {
    need: "A network orchestration team is designing the REST API interaction flow for a self-service VPN provisioning portal. A customer submits a VPN creation request — the portal must validate the request, reserve resources in IPAM, configure the NMS, and create a billing record in SAP. The entire end-to-end flow must complete within 30 seconds (interactive response time). If any step fails, all completed steps must be rolled back. Decision: synchronous sequential API calls / asynchronous job pattern / saga pattern / two-phase commit.",
    equation: "DECISION CONSTRAINT: End-to-end VPN creation < 30 seconds. Rollback must be automatic on any step failure. Must handle partial failure (e.g., NMS config succeeds but SAP billing fails). Must return a job ID to the customer immediately if provisioning exceeds 30 seconds. Decision: Synchronous Sequential / Async Job / Saga Pattern / Two-Phase Commit.",
    technicalDetails: "Synchronous Sequential: POST to IPAM → POST to NMS → POST to SAP in sequence. IPAM: 1 s. NMS: 8 s (NETCONF provisioning). SAP: 3 s. Total: 12 s — within the 30-second target if all succeed. On failure at SAP step: NMS config must be manually rolled back — no automatic mechanism. Partial failure risk: high. Asynchronous Job Pattern (Recommended for long flows): Portal returns job ID immediately (< 500 ms). Backend worker executes IPAM → NMS → SAP sequentially. Customer polls GET /jobs/{id} for status. Job timeout: 30 seconds. If NMS takes > 25 s (abnormal), the 30-second synchronous target is met via polling. Rollback: job worker tracks completed steps and reverses them on failure. Saga Pattern (Recommended for reliability): Each step is a local transaction with a compensating transaction: IPAM reserve → if SAP fails, IPAM release. NMS config → if SAP fails, NMS delete. Each service implements its own compensating API. Rollback: automatic — the saga orchestrator calls compensating APIs in reverse order. No two-phase commit required. Two-Phase Commit (2PC): Distributed atomic transaction. Locks all resources (IPAM, NMS, SAP) during prepare phase — guarantees all-or-nothing. But: 2PC is not supported by NMS RESTCONF or SAP REST APIs — requires distributed transaction coordinator. Performance: holding locks during NMS 8-second provisioning blocks other operations. Not suitable for external APIs.",
    explanation: [
      { term: "Synchronous Sequential API Calls", meaning: "POST to each backend in sequence. WHY INSUFFICIENT: On SAP failure after NMS success, rollback is manual — engineer must issue a DELETE to NMS manually. No automatic rollback. Suitable only for idempotent single-step operations (e.g., updating an interface description via one RESTCONF PATCH). WHEN ADOPTED: For simple, single-step operations where partial failure is not possible (no multi-system coordination required)." },
      { term: "Asynchronous Job Pattern (Recommended for long flows)", meaning: "Portal returns job ID immediately. Background worker executes the multi-step flow. Customer polls for status. WHY RECOMMENDED: Decouples the 30-second response target from the actual provisioning time. If NMS takes 25 s (abnormal but possible), the customer gets a job ID in < 500 ms and polls to completion. Worker tracks completed steps for rollback. Widely used: Nokia NSP provisioning APIs return job IDs for all operations > 5 seconds." },
      { term: "Saga Pattern (Recommended for reliability)", meaning: "Each step has a compensating transaction. Orchestrator calls forward steps; on failure, calls compensating steps in reverse. WHY BEST FOR RELIABILITY: Automatic rollback without 2PC. Each service owns its rollback logic — no distributed transaction coordinator. Combines with async job pattern: the saga is executed by the background job worker. WHEN ADOPTED: Multi-system provisioning flows (VPN, service, network slice) where each backend system must be kept consistent with the others on failure." },
      { term: "Two-Phase Commit (2PC)", meaning: "Distributed atomic transaction with prepare+commit phases. WHY REJECTED: NMS RESTCONF and SAP REST do not support 2PC protocol — they are not transaction-aware participants. Holding locks during NMS 8-second provisioning blocks other provisioning operations. WHEN ADOPTED: Databases (PostgreSQL, MySQL) within the portal's own backend for ensuring IPAM reservation records and job state are updated atomically — 2PC within the portal's internal database, not across external APIs." }
    ],
    advantages: [
      "Async job + saga pattern provides automatic rollback on any step failure — the provisioning portal never leaves a customer in a half-provisioned state regardless of which backend system fails",
      "Returning a job ID immediately (< 500 ms) meets the interactive response time expectation even for 30-second provisioning flows — the customer receives real-time status updates via polling without blocking",
      "Saga compensating transactions are owned by each backend service — the portal orchestrator does not need to know the internal details of IPAM rollback or NMS rollback, making the integration loosely coupled"
    ],
    limitations: [
      "Synchronous sequential calls are adopted for single-system, single-step REST operations (PATCH one resource) where partial failure is not possible",
      "2PC is adopted within the portal's internal database (PostgreSQL) to ensure job state and audit log records are updated atomically — not across external API systems",
      "Pure polling (no saga) is adopted when the backend systems do not expose compensating APIs — the portal tracks completed steps and the NOC rolls back manually using documented runbooks"
    ]
  },`,
    virtualLab: `  virtualLab: {
    description: "Vary total provisioning steps and per-step API response time to observe total synchronous flow duration. Demonstrates when synchronous flows exceed the 30-second interactive target and async job pattern is required.",
    interpretation: "A 4-step provisioning flow (IPAM 1s + NMS 8s + SAP 3s + audit 1s = 13s) fits within 30 seconds synchronously. But if NMS takes 25s abnormally, the total reaches 30s — at the limit. A 6-step flow with NMS at 8s: 6 × average 5s = 30s — exactly at the limit. Any step taking longer than expected pushes the flow over 30s. This is why async job pattern is used as the default for all multi-step provisioning — it handles abnormal step durations gracefully.",
    parameters: [
      { id: "steps", name: "Provisioning Steps", min: 1, max: 10, default: 4, step: 1, unit: "" },
      { id: "stepTimeS", name: "Avg Step Time", min: 1, max: 15, default: 3, step: 1, unit: " s" }
    ],
    generateData: (params) => {
      const maxSteps = params.steps || 4;
      const stepTime = params.stepTimeS || 3;
      const pts: Array<{ x: number; y: number }> = [];
      for (let s = 1; s <= maxSteps; s++) {
        pts.push({ x: s, y: s * stepTime });
      }
      return pts;
    },
    labels: { x: "Steps Completed", y: "Elapsed Time (s)" }
  }`
  },

  // ── topic31 ── ONF TAPI Overview ─────────────────────────────────────────────
  topic31: {
    mathModelling: `  mathModelling: {
    need: "A telecom operator is building a multi-domain optical transport network spanning 3 vendor domains (Ciena, Nokia, Infinera). A single end-to-end optical path must be provisioned across all three domains from a single orchestration system. Each domain has its own NMS with proprietary APIs. The constraint: the orchestration system must provision a 100 Gbps OTN path from domain A to domain C in under 5 minutes without writing vendor-specific integration code per domain. Decision: proprietary domain APIs / TAPI (Transport API) NBI / OpenROADM / NETCONF TE models.",
    equation: "DECISION CONSTRAINT: End-to-end path provisioned < 5 minutes. Zero vendor-specific integration code in the orchestration system. Must support path computation across 3 domains. Must expose connection status and performance monitoring. Decision: Proprietary Domain APIs / TAPI NBI / OpenROADM / NETCONF TE YANG.",
    technicalDetails: "Proprietary Domain APIs: Each vendor domain NMS exposes a proprietary REST or SOAP API. Integration: 3 separate API clients, 3 data model translations, 3 authentication schemes. Development: 3–6 months per vendor × 3 vendors = 9–18 months. Vendor lock-in: adding a 4th vendor (Ribbon) requires a 4th integration. Not viable within the project timeline. TAPI NBI (ONF Transport API — Recommended): TM Forum/ONF standard API for transport network abstraction. Each domain controller exposes a TAPI NBI — the orchestration system uses one API client regardless of vendor. TAPI objects: Service Interface Point (SIP), Connectivity Service, Path. A TAPI Connectivity Service request specifies: source SIP, destination SIP, capacity (100 Gbps), protection-type, latency objective. The domain controller (Ciena MCP, Nokia 1350 OMS, Infinera MCP) computes the path within its domain and returns the path endpoints for stitching. End-to-end stitching: the orchestration system sends one Connectivity Service request per domain and stitches them at the inter-domain interfaces (SIPs). Provisioning time: < 3 minutes (API processing + path computation + cross-connect programming). OpenROADM: Open standard for disaggregated ROADM (Reconfigurable Optical Add-Drop Multiplexer). Focused on open line system — not a full multi-domain orchestration API. NETCONF TE YANG (RFC 8776): YANG models for Traffic Engineering. Detailed TE data models but requires NETCONF transport — not REST. More complex than TAPI for end-to-end service provisioning.",
    explanation: [
      { term: "Proprietary Domain APIs", meaning: "Each vendor NMS has a unique API. WHY REJECTED: 9–18 months development for 3 vendors. Adding a 4th vendor adds 3–6 months more. Zero code reuse across vendors. On vendor NMS upgrade, the integration may break — requiring re-integration. WHEN ADOPTED: Only when TAPI or OpenROADM are not supported by the vendor domain controller — typically older transport equipment (pre-2018) without standards-based NBIs." },
      { term: "TAPI NBI (Recommended)", meaning: "ONF Transport API. One API client provisions across all 3 domains. TAPI Connectivity Service request specifies source SIP, destination SIP, 100 Gbps capacity. Domain controllers handle within-domain path computation. Orchestration system stitches at domain boundaries. Provisioning: < 3 minutes. WHY BEST: Zero vendor-specific code. Adding Ribbon as a 4th domain: load Ribbon's TAPI SIPs into the orchestrator — no new integration code. Used in production by Deutsche Telekom, BT, and Orange for multi-domain optical automation." },
      { term: "OpenROADM", meaning: "Open standard for disaggregated ROADM line systems. WHY INSUFFICIENT FOR THIS CASE: OpenROADM focuses on open line system (transponders, amplifiers, ROADMs) at the device level — it does not define a multi-domain service orchestration API. It is complementary to TAPI: OpenROADM for within-domain device configuration, TAPI for cross-domain service provisioning. WHEN ADOPTED: Used alongside TAPI for disaggregated optical deployments where the operator is building an open optical domain with multi-vendor components." },
      { term: "NETCONF TE YANG (RFC 8776)", meaning: "YANG models for TE topology and tunnels. More detailed than TAPI but requires NETCONF transport. WHY SECONDARY: NETCONF TE YANG is a data model, not a service API — it describes TE topology nodes and links but does not define a connectivity service abstraction like TAPI. WHEN ADOPTED: Used for within-domain TE path computation and RSVP-TE tunnel configuration in IP/MPLS domains — not for end-to-end optical service provisioning across optical domains." }
    ],
    advantages: [
      "TAPI's single API client handles all 3 vendor domains — integration development time drops from 9–18 months (proprietary) to 2–3 months (TAPI), with zero vendor-specific code",
      "TAPI's Service Interface Point abstraction hides domain-internal topology — the orchestration system does not need to know which fibres, amplifiers, or ROADMs are used within each domain",
      "Adding a 4th vendor domain requires only loading the new domain's SIPs into the orchestrator — no new integration code, because all domains use the same TAPI Connectivity Service API"
    ],
    limitations: [
      "Proprietary APIs are adopted for legacy optical domains (pre-2018 equipment) where the vendor domain controller does not support TAPI — a TAPI adapter layer translates TAPI requests to the proprietary API",
      "OpenROADM is adopted alongside TAPI for open optical disaggregated deployments — TAPI for cross-domain service orchestration, OpenROADM for within-domain device configuration",
      "NETCONF TE YANG is adopted for IP/MPLS TE path management within a domain — combined with TAPI for the optical layer, the orchestrator manages both IP and optical layers via their respective standards"
    ]
  },`,
    virtualLab: `  virtualLab: {
    description: "Vary domain count and provisioning time per domain to observe total end-to-end service provisioning time. Compares sequential domain provisioning (worst case) vs parallel domain provisioning (TAPI concurrent requests). TAPI supports concurrent provisioning across domains.",
    interpretation: "Sequential provisioning across 3 domains at 60s each takes 180s (3 minutes). With TAPI concurrent requests (all 3 domains provisioned in parallel), total time is max(domain times) = 60s. As domain count grows to 5, sequential takes 300s (5 minutes — at the limit). Parallel provisioning keeps total time at the slowest domain's time regardless of domain count. This illustrates why TAPI's concurrent provisioning model is essential for multi-domain deployments with strict SLA targets.",
    parameters: [
      { id: "domains", name: "Domain Count", min: 1, max: 10, default: 3, step: 1, unit: "" },
      { id: "provTimeS", name: "Provisioning Time/Domain", min: 10, max: 120, default: 60, step: 10, unit: " s" }
    ],
    generateData: (params) => {
      const maxDomains = params.domains || 3;
      const provTime = params.provTimeS || 60;
      const pts: Array<{ x: number; y: number }> = [];
      for (let d = 1; d <= maxDomains; d++) {
        pts.push({ x: d, y: d * provTime });
      }
      return pts;
    },
    labels: { x: "Domains", y: "Sequential Provisioning Time (s)" }
  }`
  },

  // ── topic32 ── NFV Concepts (VIM, VNFM, NFVO) ────────────────────────────────
  topic32: {
    mathModelling: `  mathModelling: {
    need: "A mobile operator is deploying a 5G Core (5GC) as a set of Network Functions (NFs) on an NFV infrastructure. The operator must deploy 12 NF types (AMF, SMF, UPF, PCF, UDM, AUSF, NRF, NSSF, NEF, SMSF, LMF, CHF) across 3 geographic data centres. Each NF is a VNF running as a set of VMs (or containers). The MANO (Management and Orchestration) stack must scale individual NFs independently during traffic peaks, maintain 99.999% availability per NF, and complete initial 5GC deployment within 4 hours. Decision: manual VM deployment / single-site MANO / multi-site MANO with NFVO / cloud-native Kubernetes orchestration.",
    equation: "DECISION CONSTRAINT: 12 NFs deployed across 3 data centres within 4 hours. 99.999% availability per NF (< 5 min/year downtime). Independent per-NF scaling (UPF scales to 10× during peak, AMF to 3×). Day-2 operations (NF upgrade, scaling) must be automated (zero manual steps). Decision: Manual VM / Single-site MANO / Multi-site MANO+NFVO / Cloud-native Kubernetes.",
    technicalDetails: "Manual VM Deployment: Engineer creates VMs manually on OpenStack for each NF instance. 12 NFs × 3 data centres = 36 VM groups. Time: 10–20 minutes per NF group = 6–12 hours — exceeds the 4-hour constraint. Scaling: manual (engineer adds VMs on NOC alert). Day-2 automation: zero. Single-site MANO (VNFM + VIM, no NFVO): VNFM automates VNF lifecycle (instantiate, scale, terminate) within one data centre. VIM (OpenStack) manages compute, network, and storage resources. 12 NFs deployed in 1 data centre: 45 minutes (automated instantiation). But: no multi-site coordination — the other 2 data centres require separate MANO stacks with no cross-DC orchestration. Geo-redundancy must be manually coordinated. Multi-site MANO — NFVO + VNFM + VIM (Recommended): NFVO (Network Functions Virtualisation Orchestrator) coordinates VNF placement across all 3 data centres. NFVO selects which data centre receives each NF based on resource availability and geo-redundancy policies. VNFM handles per-NF lifecycle. VIM per data centre manages local resources. 12 NFs × 3 DCs: NFVO orchestrates deployment in 2.5 hours — within the 4-hour constraint. Scaling: NFVO scales UPF instances automatically when traffic > threshold. 99.999% availability: achieved via Active-Active geo-redundancy (NFVO places NF instances in 2 of 3 DCs — failure of one DC does not affect service). Cloud-native Kubernetes (CNF): Container-based 5GC NFs. Kubernetes handles scheduling, scaling, and self-healing natively. Startup: < 30 seconds per NF pod. But: requires Kubernetes federation for multi-DC coordination — additional complexity. Best for greenfield 5G SA builds; migration from VM-based NFs is disruptive.",
    explanation: [
      { term: "Manual VM Deployment", meaning: "Engineer creates VMs per NF manually on OpenStack. WHY REJECTED: 6–12 hours for initial deployment — 50–200% over the 4-hour constraint. Day-2 scaling requires manual NOC intervention — violates the zero-manual-steps requirement. WHEN ADOPTED: Lab/proof-of-concept environments where only 1–2 NFs are being tested and automation investment is not justified." },
      { term: "Single-site MANO (VNFM + VIM)", meaning: "VNFM automates VNF lifecycle within one data centre. 12 NFs in 45 minutes. WHY INSUFFICIENT: No NFVO means no multi-DC coordination. Geo-redundancy across 3 DCs requires manually configured separate MANO stacks. Day-2 cross-DC scaling is manual. WHEN ADOPTED: Single data centre deployments (e.g., regional hub) where geographic redundancy is not required and all NFs fit within one DC's capacity." },
      { term: "Multi-site MANO — NFVO + VNFM + VIM (Recommended)", meaning: "NFVO orchestrates 12 NFs across 3 DCs in 2.5 hours — within the 4-hour constraint. Automated scaling (UPF to 10×, AMF to 3×) triggered by NFVO resource policies. 99.999% availability via Active-Active geo-redundancy. WHY BEST: Meets all four constraints. ETSI NFV MANO (ETSI GS NFV-MAN 001) architecture is the standard for 5GC deployment. Nokia CBAM, Ericsson NFVO, and Huawei NFV MANO all implement this architecture." },
      { term: "Cloud-native Kubernetes (CNF)", meaning: "Container-based 5GC NFs. < 30 second NF startup. Native horizontal pod autoscaling. WHY SECONDARY FOR MIGRATION: Migrating from VM-based NFs to CNFs requires re-architecting 12 NF implementations — 6–12 month migration effort. Kubernetes federation for 3-DC coordination adds operational complexity. WHEN ADOPTED: Greenfield 5G SA builds where all NFs are containerised from day one. Long-term evolution path for VM-based deployments — operators plan CNF migration over 2–3 years." }
    ],
    advantages: [
      "NFVO-based multi-site MANO deploys 12 NFs across 3 data centres in 2.5 hours — meeting the 4-hour constraint while configuring geo-redundancy automatically based on placement policies",
      "Automated scaling policies (UPF scale-out at 70% CPU, scale-in at 30%) enable the NFV stack to handle 10× traffic peaks without any NOC intervention — reducing operational cost",
      "Active-Active geo-redundancy across 2 of 3 data centres ensures 99.999% availability per NF — a single data centre failure loses one NF instance while the other DC continues serving traffic without impact"
    ],
    limitations: [
      "Single-site MANO is adopted for regional deployments where all NFs fit in one data centre and geographic redundancy is provided at the hardware level (within-DC redundant servers and power)",
      "Cloud-native Kubernetes is adopted for greenfield 5G SA builds and for NF types that are re-architected as microservices — the NFVO-managed VM architecture and Kubernetes coexist during the migration period",
      "Manual VM deployment is adopted in lab/POC environments where the engineering team is validating NF software behaviour and the overhead of MANO configuration is not justified for 1–2 NF instances"
    ]
  },`,
    virtualLab: `  virtualLab: {
    description: "Vary VNF count and resources per VNF to observe total NFV resource utilisation across the data centre. Demonstrates the over-provisioning problem with static VM allocation vs the resource efficiency of NFVO-managed elastic scaling.",
    interpretation: "Static allocation for 12 NFs at 15% each = 180% utilisation — impossible on one host, requiring 2 hosts at 90% each. With elastic scaling (average 8% utilisation at off-peak), NFVO reduces allocation to 96% of one host — enabling 47% resource saving. This drives the business case for NFV: the same 12 NFs serve 2× the traffic peak (scale-out) at lower average resource cost (elastic scale-in during off-peak).",
    parameters: [
      { id: "vnfs", name: "VNF Count", min: 1, max: 20, default: 5, step: 1, unit: "" },
      { id: "resPerVnf", name: "Resources per VNF (%)", min: 5, max: 50, default: 15, step: 5, unit: " %" }
    ],
    generateData: (params) => {
      const maxVnfs = params.vnfs || 5;
      const resPerVnf = params.resPerVnf || 15;
      const pts: Array<{ x: number; y: number }> = [];
      for (let v = 1; v <= maxVnfs; v++) {
        pts.push({ x: v, y: Math.min(v * resPerVnf, 100) });
      }
      return pts;
    },
    labels: { x: "VNF Instances", y: "Resource Utilisation (%)" }
  }`
  }
};

// ─── File rewriter ─────────────────────────────────────────────────────────────

function rewriteTopic(topicNum) {
  const filename = path.join(DATA_DIR, `topic${topicNum}.ts`);
  let content = fs.readFileSync(filename, 'utf8');
  const key = `topic${topicNum}`;
  const rep = replacements[key];
  if (!rep) {
    console.log(`  [SKIP] No replacement defined for ${key}`);
    return;
  }

  // ── Replace mathModelling block ──────────────────────────────────────────────
  const mathStart = content.indexOf('  mathModelling: {');
  if (mathStart === -1) {
    console.log(`  [WARN] mathModelling not found in topic${topicNum}`);
    return;
  }
  // Find matching closing brace for mathModelling
  let depth = 0;
  let mathEnd = -1;
  for (let i = mathStart; i < content.length; i++) {
    if (content[i] === '{') depth++;
    else if (content[i] === '}') {
      depth--;
      if (depth === 0) { mathEnd = i + 1; break; }
    }
  }
  if (mathEnd === -1) {
    console.log(`  [WARN] Could not find end of mathModelling in topic${topicNum}`);
    return;
  }

  // Build mathModelling text
  let mathText = '';
  if (typeof rep.mathModelling === 'string') {
    mathText = rep.mathModelling;
  } else {
    // Build from object fields
    const m = rep.mathModelling;
    const explanationStr = (m.explanation || []).map(e => {
      const item = typeof e === 'string' ? e : `{ term: "${e.term}", meaning: "${e.meaning}" }`;
      return `      ${item}`;
    }).join(',\n');

    mathText = `  mathModelling: {
    need: ${m.need},
    equation: ${m.equation},
    technicalDetails: ${m.technicalDetails},
    explanation: [
${explanationStr}
    ],
    advantages: [
${(m.advantages||[]).map(a=>`      "${a}"`).join(',\n')}
    ],
    limitations: [
${(m.limitations||[]).map(l=>`      "${l}"`).join(',\n')}
    ]
  }`;
  }

  // ── Replace virtualLab block ─────────────────────────────────────────────────
  const vlStart = content.indexOf('  virtualLab: {');
  if (vlStart === -1) {
    console.log(`  [WARN] virtualLab not found in topic${topicNum}`);
    return;
  }
  let depth2 = 0;
  let vlEnd = -1;
  for (let i = vlStart; i < content.length; i++) {
    if (content[i] === '{') depth2++;
    else if (content[i] === '}') {
      depth2--;
      if (depth2 === 0) { vlEnd = i + 1; break; }
    }
  }
  if (vlEnd === -1) {
    console.log(`  [WARN] Could not find end of virtualLab in topic${topicNum}`);
    return;
  }

  // Build virtualLab text
  let vlText = '';
  if (typeof rep.virtualLab === 'string') {
    vlText = rep.virtualLab;
  } else {
    const vl = rep.virtualLab;
    const paramsStr = (vl.params || []).map(p => `      ${p}`).join(',\n');
    vlText = `  virtualLab: {
    description: ${vl.description},
    interpretation: ${vl.interpretation},
    parameters: [
${paramsStr}
    ],
    generateData: ${vl.generateData},
    labels: ${vl.labels}
  }`;
  }

  // ── Apply replacements ───────────────────────────────────────────────────────
  // Replace mathModelling first (before virtualLab to keep offsets valid)
  const beforeMath = content.substring(0, mathStart);
  const afterMath = content.substring(mathEnd);

  // Now find virtualLab in afterMath
  const vlStartInAfter = afterMath.indexOf('  virtualLab: {');
  let depth3 = 0;
  let vlEndInAfter = -1;
  for (let i = vlStartInAfter; i < afterMath.length; i++) {
    if (afterMath[i] === '{') depth3++;
    else if (afterMath[i] === '}') {
      depth3--;
      if (depth3 === 0) { vlEndInAfter = i + 1; break; }
    }
  }

  let newContent;
  if (vlStartInAfter !== -1 && vlEndInAfter !== -1) {
    const beforeVl = afterMath.substring(0, vlStartInAfter);
    const afterVl = afterMath.substring(vlEndInAfter);
    newContent = beforeMath + mathText + beforeVl + vlText + afterVl;
  } else {
    newContent = beforeMath + mathText + afterMath;
    console.log(`  [WARN] virtualLab replacement position not found in topic${topicNum} after math replacement`);
  }

  fs.writeFileSync(filename, newContent, 'utf8');
  console.log(`  [OK] topic${topicNum}.ts updated`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
console.log('Replacing mathModelling + virtualLab in Unit 2 & 3 topics (13–32)...\n');
for (let n = 13; n <= 32; n++) {
  process.stdout.write(`Processing topic${n}... `);
  try {
    rewriteTopic(n);
  } catch (err) {
    console.log(`  [ERROR] topic${n}: ${err.message}`);
  }
}
console.log('\nDone. All Unit 2 & 3 topics updated.');
