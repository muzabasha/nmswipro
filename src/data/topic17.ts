import type { TopicData } from './types';

export const topic17Data: TopicData = {
  id: "u2t5",
  title: "NETCONF Operation Commands (get, edit-config, etc.)",
  moduleName: "Unit II: Model-Driven Management and Protocols",
  context: {
    prerequisites: ["NETCONF Protocol Concept"],
    dependentTopics: ["RESTCONF Protocol Concept", "RESTCONF Operation via Postman"],
    nextSteps: "Study RESTCONF Protocol Concept to understand how the same YANG models are exposed over HTTP/HTTPS with a RESTful interface.",
    rfcReferences: [
      { rfc: "RFC 6241", title: "NETCONF Protocol", summary: "Defines all NETCONF RPCs covered here: get-config, edit-config, commit, lock, unlock, validate, copy-config, and kill-session.", url: "https://www.rfc-editor.org/rfc/rfc6241" },
      { rfc: "RFC 7950", title: "YANG 1.1", summary: "The data model that NETCONF RPCs validate against — essential for understanding edit-config merge vs replace operation semantics.", url: "https://www.rfc-editor.org/rfc/rfc7950" },
      { rfc: "RFC 8342", title: "Network Management Datastore Architecture (NMDA)", summary: "Extends NETCONF datastores to include intended and operational datastores, updating get-config and get RPC behaviour.", url: "https://www.rfc-editor.org/rfc/rfc8342" }
    ]
  },
  storytelling: {
    analogy: "SQL Commands for Network Configuration",
    story: "NETCONF RPCs are the SQL commands of network management. get-config is SELECT from the running datastore — retrieve the current configuration. get is SELECT including operational state data not stored in config (like interface counters, CPU usage, and ARP tables). edit-config is INSERT/UPDATE/DELETE with operation attributes: merge (UPDATE or INSERT if not present), replace (full overwrite), create (INSERT, fail if exists), delete (DELETE, fail if not present), remove (DELETE, ignore if not present). commit is COMMIT TRANSACTION — apply all staged changes atomically. discard-changes is ROLLBACK — revert the candidate to match running. lock is BEGIN EXCLUSIVE TRANSACTION. validate is a dry-run — check the config is schema-valid without applying it. copy-config is backup/restore — replicate one datastore to another. Each RPC is an XML message sent over SSH with a message-id for correlation. The agent returns an ok or rpc-error response with error-type, error-tag, and error-message, just like SQL returns affected rows or an error code.",
    reflectiveQuestions: [
      "What is the difference between NETCONF get and get-config, and when would you use each?",
      "When would you use the replace operation vs merge in edit-config, and what are the risks of each?",
      "Why is the lock RPC critical when multiple NMS instances may be configuring the same device simultaneously?"
    ],
    technicalConnection: "RFC 6241 NETCONF Protocol Operations: **get-config** (§7.1): retrieves configuration datastore. XML: <rpc message-id='101' xmlns='urn:ietf:params:xml:ns:netconf:base:1.0'><get-config><source><running/></source><filter type='subtree'><interfaces xmlns='urn:ietf:params:xml:ns:yang:ietf-interfaces'/></filter></get-config></rpc>. Returns only config true nodes. **get** (§7.7): retrieves config + operational state (config false nodes). No source parameter — always live device state. **edit-config** (§7.2): modifies datastore. Parameters: target (candidate|running|startup), default-operation (merge|replace|none), error-option (stop-on-error|continue-on-error|rollback-on-error). Per-node operation attribute (nc:operation): merge (default, RFC 6241 §7.2.5.1) adds or updates node; replace (§7.2.5.2) replaces entire subtree; create (§7.2.5.3) adds node, fails with data-exists if present; delete (§7.2.5.4) removes node, fails with data-missing if absent; remove (§7.2.5.5) deletes node, succeeds if already absent (idempotent). **lock** (§7.5): acquires exclusive write lock on datastore. Prevents concurrent edit-config from other sessions. **unlock** (§7.6): releases lock. **commit** (§8.3.4.1, requires :candidate capability): applies candidate to running atomically. **confirmed-commit** (§8.4): commit with auto-rollback timeout. Syntax: <commit><confirmed/><confirm-timeout>600</confirm-timeout></commit> (10-minute timeout). If no <commit/> (confirming commit) arrives within timeout, device automatically reverts to pre-commit state. Prevents misconfigurations from locking operators out. **discard-changes** (§8.3.4.3): resets candidate to match running — discards all staged edits. **validate** (§8.6, requires :validate capability): checks datastore YANG schema validity without commit. <validate><source><candidate/></source></validate> → returns <ok/> or <rpc-error>. **copy-config** (§7.3): duplicates entire datastore. <copy-config><source><running/></source><target><startup/></target></copy-config> persists running config across reboots. **delete-config** (§7.4): removes writable datastore (startup or candidate). Cannot delete running. **close-session** (§7.8): graceful session termination. **kill-session** (§7.9): forcibly terminates another session by session-id. Error codes (§Appendix A): operation-failed, invalid-value, data-missing, data-exists, operation-not-supported, in-use (lock held)."
  },
  mathModelling: {
    need: "A network automation engineer at a financial services firm must choose the correct NETCONF operations to implement a zero-downtime BGP policy change on 200 production routers. The change must: (1) not affect running config until fully validated, (2) be reversible within 30 seconds if the change causes a routing anomaly, and (3) minimise the amount of configuration data sent per device (network is bandwidth-constrained at 512 kbps per management link). Three operation strategies are evaluated.",
    equation: "DECISION CONSTRAINT: Zero impact on running config during validation. Rollback within 30 seconds of anomaly detection. Minimize bytes sent per device (management link: 512 kbps). Must support BGP policy update across 200 routers. Decision: get-config + full edit-config / get-config + merge edit-config / lock + candidate + confirmed-commit / copy-config.",
    technicalDetails: "Full edit-config Replace: Sends the entire device configuration as a single XML payload to replace the running config. Bandwidth: 200-500 KB per device at 512 kbps = 3–8 seconds per device. Serial: 200 × 8 s = 1,600 seconds (26 minutes). Risk: one XML encoding error replaces the full running config. Merge edit-config (targeted): Sends only the changed BGP policy subtree (typically 2–5 KB). Bandwidth: 5 KB at 512 kbps = 0.08 seconds transport. Merges only the specified nodes into the running config. Risk: no atomicity — if a second edit-config fails mid-sequence, partial config persists. Lock + Candidate + Confirmed-Commit (Recommended): (1) lock running and candidate datastores. (2) Send merge edit-config to candidate (validation only, running unchanged). (3) Issue validate operation. (4) Issue confirmed-commit with a 30-second timeout. The device applies the change to running; if no confirming commit arrives within 30 seconds, the device automatically rolls back. WHY BEST: Meets all three constraints. Bandwidth: only changed subtree sent. Rollback: automatic at 30-second timeout. Running config untouched during validation. copy-config: Copies an entire datastore to another (e.g., candidate to running, or startup to running). Used for device initialisation and factory reset — not appropriate for incremental policy changes as it replaces the entire target datastore.",
    explanation: [
      { term: "Full edit-config Replace", meaning: "Sends entire config as XML with operation=replace. WHY REJECTED: 200–500 KB payload at 512 kbps takes 3–8 seconds per device of transport alone. More critically, one encoding error corrupts the entire running config — no partial protection. WHEN ADOPTED: Correct for initial device provisioning (zero-to-full-config) or factory reset scenarios where the full config is intentionally replaced." },
      { term: "Merge edit-config (targeted subtree)", meaning: "Sends only the changed BGP policy nodes with operation=merge. Bandwidth-efficient (2–5 KB). But no atomicity — if a second edit-config in a sequence fails, partial policy change persists on the device. Rollback requires a manual reverse edit-config. WHY INSUFFICIENT: Does not meet the 30-second automatic rollback constraint. WHEN ADOPTED: Correct for non-critical, easily reversible single-leaf changes (e.g., updating interface description) where partial failure is acceptable." },
      { term: "Lock + Candidate + Confirmed-Commit (Recommended)", meaning: "Full atomic workflow: lock datastores → edit candidate → validate → confirmed-commit (30 s timeout). Running config unchanged during validation. Rollback: automatic if no confirm arrives within 30 seconds. Bandwidth: only changed subtree sent to candidate. WHY BEST: Meets all three constraints simultaneously. This is the standard NETCONF workflow for production configuration changes. Cisco NSO and Nokia NSP use this pattern for all production commits." },
      { term: "copy-config", meaning: "Copies one full datastore to another. WHY INAPPROPRIATE: Replaces the entire target datastore — equivalent to replacing the full running config, with the same bandwidth and risk profile as full edit-config replace. WHEN ADOPTED: Device initialisation (copying a baseline candidate to running), startup config restoration after hardware replacement, and configuration backup (copying running to startup)." }
    ],
    advantages: [

    ],
    limitations: [

    ]
  },
  activities: {
    level1: "List all NETCONF RPCs defined in RFC 6241 and their purpose in one line each: get, get-config, edit-config, copy-config, delete-config, lock, unlock, commit, discard-changes, validate, close-session, kill-session. Identify which require the :candidate capability to be useful.",
    level2: "Trace a complete edit-config → commit → validate flow for adding a new static route to a device. Write the XML for each step: (a) lock candidate, (b) edit-config with merge operation adding a route entry, (c) validate candidate, (d) commit, (e) unlock. Identify the message-id in each request and the expected rpc-reply.",
    level3: "A device has 80 total config nodes. An NMS change modifies 8 nodes. Calculate: (a) the replace/merge traffic ratio, (b) the Delta_config (net new nodes), (c) the minimum changed-node fraction at which replace becomes less than 2× overhead of merge.",
    level4: "Use ncclient Python library (pip install ncclient) to connect to a NETCONF simulator. Run get-config with a subtree filter to retrieve only the interfaces container. Then use edit-config with merge to change the description of one interface. Verify the change with a second get-config. Print the XML request and response for each operation."
  },
  projects: {
    scope: "Build a NETCONF-based configuration drift detector that compares the current running configuration against a stored baseline and automatically remediates differences using targeted edit-config operations.",
    objectives: [
      "Implement get-config to retrieve the running datastore from 5 simulated devices and save as baseline XML files",
      "Introduce deliberate configuration drift (modify 3-5 nodes per device) and re-retrieve running configs",
      "Implement a diff engine that compares current vs baseline XML and generates merge-operation edit-config payloads for changed nodes only",
      "Remediate drift: lock, apply merge edit-config for each changed node set, commit, unlock, and report success/failure per device"
    ],
    deliverables: [
      "Python script with documented get_config(), detect_drift(), generate_edit_config(), and remediate() functions",
      "Baseline XML files for all 5 devices and drift-introduced versions",
      "Diff output showing which YANG paths changed on each device and the generated remediation XML",
      "Replace/merge traffic ratio comparison: theoretical vs actual bytes transmitted for drift remediation"
    ]
  },
  questions: [
    {
      q: "What is the difference between NETCONF get and get-config?",
      a: "get-config retrieves only configuration data — the data that was set via edit-config and stored in a configuration datastore (running, candidate, or startup). It maps to YANG nodes with 'config true' (or nodes without an explicit config statement, which defaults to true if parent is config true). You specify a source datastore: get-config source='running' returns what is currently active. get retrieves both configuration data AND operational state data — all YANG nodes including those with 'config false'. This includes interface counters, current link status, ARP table entries, routing table state, CPU load, and any other read-only operational data. get always reads from the device's combined view of config + state (there is no source parameter for get). Use get-config when you want to back up configuration, compare against a baseline, or validate what was committed. Use get when you need real-time operational monitoring data like interface statistics or system health.",
      type: "Conceptual"
    },
    {
      q: "What are the five edit-config operation attribute values and what does each do?",
      a: "The five operation attribute values on any edit-config node are: (1) merge — the default; merges the supplied data into the existing config: adds the node if it doesn't exist, updates it if it does. Safe for most incremental changes. (2) replace — replaces the entire target subtree with the supplied data, deleting any existing child nodes not present in the supplied XML. Useful for full subtree synchronisation. (3) create — inserts the node only if it does not already exist; if the node exists, returns a data-exists error. Prevents accidental duplication of list entries or containers. (4) delete — removes the node only if it exists; if the node does not exist, returns a data-missing error. Used for explicit, verified removals. (5) remove — removes the node if it exists, but silently succeeds if it does not. Idempotent deletion, safe to use without knowing current state. These attributes are placed on the XML element to be modified: e.g., <interface nc:operation='delete'>.",
      type: "Conceptual"
    },
    {
      q: "A device has 120 total config nodes. An NMS change affects 15 nodes. Calculate the replace/merge traffic ratio and the percentage overhead of using replace instead of merge.",
      a: "Replace sends all 120 nodes. Merge sends only 15 changed nodes. Replace/Merge ratio = 120 / 15 = 8.0. Percentage overhead = (120 - 15) / 15 × 100 = 105 / 15 × 100 = 700%. Replace requires 8× more configuration data to be transmitted than merge for this change. Delta_config = |C_new| - |C_unchanged| = 15 - 105 = -90 (meaning 105 unchanged nodes are sent unnecessarily with replace). Breakeven (ratio = 2) occurs when changed nodes = total / 2 = 60 — half the config must be changing before replace is within 2× merge overhead.",
      type: "Numerical"
    },
    {
      q: "When would you use copy-config and delete-config, and what are the risks associated with each?",
      a: "copy-config duplicates the contents of one datastore to another (or to/from an external URL if the :url capability is supported). Use cases: (1) copy running to startup to make the current config persistent across reboots (copy-config source=running target=startup); (2) copy a known-good backup to candidate before making changes, providing a clean starting point; (3) backup running to a file URL for disaster recovery. Risk: overwriting startup with a bad config means the device boots into a broken state — always validate first. delete-config removes a writable datastore. The running datastore cannot be deleted (it is always present). Startup can be deleted, causing the device to boot with a minimal factory default — use carefully. Candidate can be deleted (equivalent to discard-changes). Risk of delete-config on startup: next reboot produces a factory-default state, potentially locking operators out of the device. Both operations should be locked behind change management processes in production environments.",
      type: "Analytical"
    },
    {
      q: "How does NETCONF validate RPC differ from the validation performed during commit?",
      a: "The validate RPC (requires :validate capability) explicitly asks the device to check a datastore — typically the candidate — for YANG schema consistency without applying any changes. It verifies: type correctness (all leafs have values matching their declared type), range and length constraints, mandatory leaf presence, must and when XPath constraint satisfaction, and referential integrity (leafref targets exist). It returns ok if valid or rpc-error with a detailed validation-error if not. Commit performs validation implicitly as part of applying the candidate to running — the device re-validates before switching the running pointer. The difference: validate is a pure check with no side effects, usable at any point during configuration building to catch errors early. Commit validation is the final gate; if it fails, the commit is rejected and the running config is unchanged. Best practice is to always call validate before commit to get clear error messages early in the workflow — commit error messages are sometimes less informative than validate's.",
      type: "Analytical"
    }
  ],
  virtualLab: {
    description: "You are an automation engineer writing NETCONF edit-config operations for a bandwidth-constrained management network. Your task: quantify how much data you save by sending only changed nodes (merge) instead of the full configuration (replace). Adjust the total config node count and the number of nodes changed per operation. The chart shows data sent as a percentage of full-replace — find the savings ratio and decide whether merge mode is worth the extra locking overhead.",
    interpretation: "With 200 total config nodes and only 10 changed, targeted merge sends just 5% of the data — a 95% bandwidth saving. This gap widens as the total config grows: at 200 total nodes with 5 changed, merge sends 2.5%. The lock + candidate + confirmed-commit pattern with targeted subtree edits is the standard for management networks sharing bandwidth with production traffic. Use this lab to justify the merge operation pattern in your NETCONF automation playbooks.",
    parameters: [
      { id: "total", name: "Total Config Nodes", min: 10, max: 200, default: 50, step: 5, unit: "" },
      { id: "changed", name: "Max Changed Nodes", min: 1, max: 50, default: 10, step: 1, unit: "" }
    ],
    generateData: (params) => {
      const total = params.total || 50;
      const maxChanged = params.changed || 10;
      const pts: Array<{ x: number; y: number }> = [];
      for (let c = 1; c <= maxChanged; c++) {
        const pct = (c / total) * 100;
        pts.push({ x: c, y: parseFloat(pct.toFixed(1)) });
      }
      return pts;
    },
    labels: { x: "Changed Nodes", y: "Data Sent vs Full Replace (%)" }
  }
};
