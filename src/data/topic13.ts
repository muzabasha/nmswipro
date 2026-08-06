import type { TopicData } from './types';

export const topic13Data: TopicData = {
  id: "u2t1",
  title: "Introduction to Model-Driven Management",
  moduleName: "Unit II: Model-Driven Management and Protocols",
  context: {
    prerequisites: ["SNMP Limitations and Operators Requirement", "YANG Evolution & Background"],
    dependentTopics: ["YANG Data Model Structure", "NETCONF Protocol Concept"],
    nextSteps: "Study YANG Data Model Structure to learn the building blocks of model-driven data definitions.",
    rfcReferences: [
      { rfc: "RFC 6020", title: "YANG 1.0", summary: "The YANG data modelling language — the schema that NETCONF validates against and the foundation of model-driven management.", url: "https://www.rfc-editor.org/rfc/rfc6020" },
      { rfc: "RFC 6241", title: "NETCONF Protocol", summary: "The protocol that implements model-driven management — reads and writes YANG-modelled data using candidate datastore and transactional commit.", url: "https://www.rfc-editor.org/rfc/rfc6241" },
      { rfc: "RFC 3535", title: "IAB Network Management Workshop", summary: "The 2003 operator requirements document that motivated the shift from CLI-based to model-driven management described in this topic.", url: "https://www.rfc-editor.org/rfc/rfc3535" }
    ]
  },
  storytelling: {
    analogy: "A Blueprint-Driven Construction Industry",
    story: "Before model-driven management, configuring networks was like building a skyscraper where each contractor (vendor) worked from their own hand-drawn sketches with no shared blueprint. Electricians, plumbers, and structural engineers each had different plans that didn't always agree. Model-Driven Management (MDM) is the shift to BIM (Building Information Modelling) — a single, machine-readable digital model of the entire building that every contractor reads from. In networking, the YANG model is the BIM schema, NETCONF is the API that contractors use to read and update it, and the NMS is the project manager who coordinates all changes transactionally. Any modification is validated against the blueprint before touching the real building.",
    reflectiveQuestions: [
      "How does model-driven management differ from traditional CLI-based device configuration?",
      "What role does schema validation play in preventing network misconfiguration?",
      "Why is separation of data model from protocol important in model-driven architectures?"
    ],
    technicalConnection: "RFC 3535 (IAB Network Management Workshop, 2003) §2.1 documents SNMP operator pain points driving MDM adoption: **(1) Configuration Management Complexity**: CLI scripts are brittle (vendor-specific syntax, no structure), SNMP SET lacks transaction semantics (partial failure leaves inconsistent state). MDM solution: YANG models provide structured, validated, transactional config via NETCONF edit-config with commit/rollback. **(2) Data Model Explosion**: SMI (RFC 2578) MIBs proliferated per-feature (3000+ standard MIBs by 2003), no reusable components, no inheritance. MDM solution: YANG groupings, typedefs, augments enable modular, extensible models. **(3) Lack of Structured Error Reporting**: SNMP returns genErr with error-index; no machine-parseable detail. MDM solution: NETCONF <rpc-error> with <error-type>, <error-tag>, <error-severity>, <error-path> (XPath to failing node), <error-message> (human-readable). **(4) No Operational vs Config Separation**: SNMP MIB mixes writable config objects (ifAdminStatus) with read-only state (ifOperStatus). MDM solution: YANG config true/false distinction. config true leafs writable via <edit-config>; config false leafs read-only via <get>. **(5) Schema Evolution Difficulty**: MIB versioning requires new OID branches, breaks backward compatibility. MDM solution: YANG modules versioned via revision statements; augment/deviation allow backward-compatible extensions. **MDM Architecture**: YANG Compiler (pyang) → validates model, generates bindings (pyangbind Python, ygot Go) → NMS uses bindings to construct/parse NETCONF XML → device YANG engine validates against local models → on success, applies to candidate datastore → commit moves to running. **Pre-validation Workflow**: NMS constructs edit-config XML → validates locally against YANG schema + XPath must/when → if valid, lock target, send edit-config, validate RPC, commit; if invalid, reject before network transmission. **Adoption**: Cisco IOS-XE (YANG+NETCONF since 16.x), Juniper JunOS (since 14.2), Nokia SR-OS (YANG since 14.0), Huawei VRP (YANG since V200R008). Industry shift: 2010-2015 CLI-dominant → 2015-2020 NETCONF+YANG adoption → 2020+ RESTCONF+YANG for cloud-native NMS."
  },
  mathModelling: {
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
  },

  activities: {
    level1: "Define the following terms in your own words with a one-sentence example each: Model-Driven Management (MDM), YANG, NETCONF, RESTCONF. Identify which component is the data model, which is the transport protocol, and which is the management interface.",
    level2: "Draw a workflow comparison table for CLI-based vs Model-Driven configuration of a single interface. The table should show: how configuration is generated, how it is validated, how it is sent to the device, what happens on failure, and how the change is audited. Identify at least three operational advantages of the MDM workflow.",
    level3: "Calculate T_val for a configuration change with N_nodes = 200 YANG tree nodes (T_parse = 0.5 ms each) and N_constraints = 15 XPath constraints (T_check = 2 ms each). Show all working. Then determine the maximum number of constraints that can be evaluated within a 200 ms validation budget given the same node count.",
    level4: "Install pyang (pip install pyang) and obtain the ietf-interfaces YANG module (RFC 7223). Run: pyang --format tree ietf-interfaces.yang and capture the output. Then introduce a deliberate error (change a type from uint32 to an invalid type name) and run pyang validation again. Document the error message pyang produces and explain what it means."
  },
  projects: {
    scope: "Build a YANG model validation pipeline for a campus network configuration management system that validates interface and VLAN configuration changes before they are applied to devices.",
    objectives: [
      "Define a YANG module modelling campus switch interfaces with container, list (keyed by interface name), and leaf nodes including type, mtu, description, and enabled",
      "Run pyang --format tree and pyang --format yin to verify the model structure and generate XML schema",
      "Test the validation pipeline using a NETCONF simulator (e.g., netsim from NSO or netconf-console) by submitting valid and invalid configurations",
      "Measure T_val empirically for configurations of 10, 50, and 100 nodes and compare against the theoretical model"
    ],
    deliverables: [
      "campus-interfaces.yang YANG module file with full node definitions, must constraints, and revision history",
      "pyang validation output showing tree structure and any warnings/errors",
      "Validation test report comparing valid vs invalid configuration submissions and their error responses",
      "T_val measurement table comparing theoretical and empirical validation times"
    ]
  },
  questions: [
    {
      q: "What is Model-Driven Management and how does it differ from CLI-based network configuration?",
      a: "Model-Driven Management (MDM) is a network management approach in which device configuration and state data are described by a formal, machine-readable schema (the YANG model), and all interactions with devices use structured protocols (NETCONF or RESTCONF) that enforce this schema. In CLI-based management, an operator types vendor-specific text commands (e.g., Cisco IOS 'interface GigabitEthernet0/0 / ip address 10.0.0.1 255.255.255.0') which are parsed as unstructured text — there is no schema validation, no transactional commit, and no machine-readable capability exchange. MDM replaces this with: (1) YANG models that define every configurable parameter with explicit types, ranges, and constraints; (2) NETCONF edit-config that applies changes transactionally with commit/rollback; (3) capability exchange that tells the NMS exactly what models a device supports before any configuration is attempted. The result is automation-friendly, vendor-agnostic, and far less prone to misconfiguration.",
      type: "Conceptual"
    },
    {
      q: "Why is the separation of data model from transport protocol a key design principle in model-driven architectures?",
      a: "Separating the data model (YANG) from the transport protocol (NETCONF over SSH, RESTCONF over HTTPS) means that the same YANG module describes the same data regardless of how it is accessed. An NMS can access a device's interface configuration over NETCONF when operating in a data-centre context that requires transactional commits, or over RESTCONF when integrating with a cloud orchestration platform that uses HTTP APIs — without changing the YANG model or the device's internal data representation. This separation also means YANG models can be validated, stored, and version-controlled independently of any specific protocol implementation. It mirrors the separation in web architecture between data schemas (JSON Schema / OpenAPI) and transport (HTTP/HTTPS), enabling tooling reuse and interoperability across vendors and platforms.",
      type: "Conceptual"
    },
    {
      q: "Calculate T_val for N_nodes = 150, T_parse = 0.5 ms, N_constraints = 20, T_check = 2 ms. Is this acceptable for an interactive NMS operation with a 200 ms budget?",
      a: "T_val = N_nodes × T_parse + N_constraints × T_check = 150 × 0.5 + 20 × 2 = 75 + 40 = 115 ms. Yes, 115 ms is below the 200 ms interactive budget. The parse component contributes 75 ms and the constraint evaluation 40 ms. If the constraint count were increased to 62, T_val = 75 + 62 × 2 = 75 + 124 = 199 ms — just within budget. For N_nodes = 300, T_val = 150 + 40 = 190 ms — also within budget.",
      type: "Numerical"
    },
    {
      q: "What is YANG capability exchange and why is it important in model-driven management?",
      a: "YANG capability exchange is the process by which a NETCONF client (NMS) and a NETCONF server (device) announce their supported YANG modules during session establishment. When a NETCONF session is opened, both sides send a hello message listing their capabilities as URIs of the form: urn:ietf:params:netconf:capability:{feature}:{version} and YANG module identifiers. This tells the NMS exactly which YANG modules (and which revisions) the device understands, which NETCONF features it supports (candidate datastore, confirmed commit, etc.), and which deviations it has applied. Without capability exchange, the NMS would have to attempt operations and interpret errors, potentially sending configuration for features the device doesn't implement. Capability exchange enables the NMS to auto-generate the correct configuration templates for each specific device model without hard-coded vendor logic.",
      type: "Analytical"
    },
    {
      q: "What are the key advantages and limitations of YANG schema validation before configuration commit?",
      a: "Advantages: (1) Type safety — YANG enforces that a value like MTU is uint16 in range 68..65535, catching '999999' before it reaches the device and causes an obscure error; (2) Constraint checking — must and when XPath expressions enforce cross-field dependencies (e.g., 'if encapsulation is dot1q, vlan-id must be present'); (3) Mandatory field enforcement — mandatory true leafs ensure no required parameter is omitted; (4) Early error detection — validation runs on the NMS candidate configuration before any change is sent, saving round trips to the device. Limitations: (1) Complex XPath must expressions can reference distant subtrees, making validation time unpredictable and potentially slow for large models; (2) YANG validation only checks structural and type correctness — it cannot verify that the configuration will work correctly in the network (e.g., that a next-hop IP is reachable); (3) Device implementations may not validate all YANG constraints locally, so a model-valid configuration can still be rejected by the device's internal validation for implementation-specific reasons.",
      type: "Analytical"
    }
  ],
  virtualLab: {
    description: "You are leading a 300-device network-wide configuration rollout. Your task: select the YANG validation strategy that keeps error rates below 0.1% while completing the rollout within a 4-hour maintenance window. Choose a validation strategy (1 = No Validation, 2 = Schema Only, 3 = YANG + XPath, 4 = Formal Checking) and adjust the device count. The chart shows total validation overhead — find the strategy that balances error prevention (0.05%) with completion time under your window.",
    interpretation: "At 300 devices, YANG + XPath validation adds just 7.8 seconds of overhead and delivers 0.05% error rates — well within the 4-hour window and below the 0.1% error target. Formal model checking adds 75 minutes for the same accuracy improvement to 0.01%, consuming 31% of the maintenance window. This is why YANG + XPath is the industry standard: it delivers near-zero error rates at negligible overhead. Use this lab to justify the YANG-constraint investment to your change management board.",
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
  }
};
