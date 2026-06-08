import type { TopicData } from './types';

export const topic16Data: TopicData = {
  id: "u2t4",
  title: "NETCONF Protocol Concept",
  moduleName: "Unit II: Model-Driven Management and Protocols",
  context: {
    prerequisites: ["YANG Data Model Details Explanation", "NMS SBI and NBI"],
    dependentTopics: ["NETCONF Operation Commands", "RESTCONF Protocol Concept"],
    nextSteps: "Study NETCONF Operation Commands to learn the full set of RPCs: get, get-config, edit-config, commit, lock, unlock, copy-config, delete-config, kill-session.",
    rfcReferences: [
      { rfc: "RFC 6241", title: "NETCONF Protocol", summary: "Defines the SSH transport, datastores (running, candidate, startup), hello capability exchange, and all NETCONF RPCs covered in this topic.", url: "https://www.rfc-editor.org/rfc/rfc6241" },
      { rfc: "RFC 6242", title: "Using NETCONF over SSH", summary: "Specifies the SSH transport for NETCONF on TCP port 830, including end-of-message and chunked framing.", url: "https://www.rfc-editor.org/rfc/rfc6242" },
      { rfc: "RFC 5277", title: "NETCONF Event Notifications", summary: "Extends NETCONF with event subscription and push-based notification delivery — complementing the RPC model.", url: "https://www.rfc-editor.org/rfc/rfc5277" },
      { rfc: "RFC 8342", title: "Network Management Datastore Architecture", summary: "Introduces the intended and operational datastores that extend the running/candidate/startup model in modern NETCONF deployments.", url: "https://www.rfc-editor.org/rfc/rfc8342" }
    ]
  },
  storytelling: {
    analogy: "A Transactional Database Client for Network Devices",
    story: "NETCONF is to network devices what a database transaction client is to a relational database. Before NETCONF, configuring a router via CLI was like editing a live production database by typing raw SQL directly into the console — no staging area, no validation, no rollback. NETCONF introduces the database discipline: there is a candidate datastore (staging area), you make changes there while the running datastore (production) is untouched. You validate the candidate against the YANG schema. You lock the running datastore so no other operator can make conflicting changes simultaneously. Then you commit — atomically applying all staged changes to running. If anything goes wrong, you discard-changes (rollback). The entire workflow mirrors ACID transactions: Atomic (all-or-nothing commit), Consistent (YANG validation), Isolated (locking), Durable (startup datastore persistence).",
    reflectiveQuestions: [
      "How does NETCONF's candidate datastore model prevent configuration conflicts in multi-operator environments?",
      "What happens to the running configuration if a NETCONF commit fails mid-application on a device?",
      "Why does NETCONF use SSH over TCP rather than UDP, unlike SNMP?"
    ],
    technicalConnection: "NETCONF (RFC 6241): transport = SSH (TCP port 830). Session lifecycle: TCP connect → SSH handshake → NETCONF hello exchange (capability advertisement) → RPC operations → close-session. Datastores: running (active config, always present), candidate (staging area, requires :candidate capability), startup (persistent boot config, requires :startup capability). Key RPCs: get-config, edit-config, copy-config, delete-config, lock, unlock, commit, discard-changes, validate, get, close-session, kill-session. Message format: XML wrapped in rpc/rpc-reply elements with message-id attributes. Framing: end-of-message (]]>]]>) or chunked framing (RFC 6242)."
  },
  mathModelling: {
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
  },
  activities: {
    level1: "List all three NETCONF datastores (running, candidate, startup), state which RFC introduced them, and describe when each is read and when each is written. Identify which capability string must appear in the hello message for candidate and startup datastores to be available.",
    level2: "Trace a complete NETCONF configuration workflow for changing an interface IP address: (1) open SSH session on port 830, (2) hello capability exchange, (3) lock candidate datastore, (4) edit-config on candidate, (5) validate, (6) commit, (7) unlock. Draw a sequence diagram showing the XML message exchange at each step.",
    level3: "Calculate T_nc for S_xml = 25 KB, B_ssh = 512 kbps, RTT = 10 ms. Then find the maximum XML payload size that keeps T_nc below 100 ms for B_ssh = 2000 kbps and RTT = 5 ms.",
    level4: "Using netconf-console or ncclient Python library, connect to a NETCONF simulator (e.g., netsim or OpenWRT with NETCONF), exchange hello messages, retrieve the running datastore with get-config, and display the received XML. Measure the actual round-trip time and compare it to the theoretical T_nc."
  },
  projects: {
    scope: "Implement a NETCONF configuration management client in Python using ncclient that manages interface configurations on a set of simulated network devices with full transactional discipline.",
    objectives: [
      "Establish NETCONF sessions to 3 simulated devices, capture and display their capability lists from hello messages",
      "Implement a configure_interface() function that: locks candidate, sends edit-config, validates, commits, then unlocks — with discard-changes on any error",
      "Demonstrate multi-device atomic configuration (configure same VLAN on 3 devices) with rollback if any device fails validation",
      "Measure and report T_nc for payloads of 1 KB, 5 KB, and 20 KB and compare against theoretical values"
    ],
    deliverables: [
      "Python ncclient script with documented connect, lock, edit-config, validate, commit, and rollback functions",
      "Sample capability list output from each device's hello message",
      "Demonstration of rollback: show that when device 3 rejects a commit, devices 1 and 2 also discard their changes",
      "T_nc measurement table: theoretical vs measured for three payload sizes"
    ]
  },
  questions: [
    {
      q: "What is the NETCONF candidate datastore and how does it enable transactional configuration management?",
      a: "The candidate datastore is a scratch-pad copy of the running configuration that can be modified without immediately affecting the live device behaviour. When an NMS wants to change a device's configuration, it targets edits to the candidate datastore using edit-config target='candidate'. The running datastore remains unchanged. The NMS can validate the candidate against YANG schema using the validate RPC. Only when all changes are complete and validated does the NMS issue a commit RPC, which atomically applies the entire candidate to the running datastore. If the commit succeeds, the running config reflects all changes simultaneously — there is no period where half the changes are applied. If anything fails (YANG constraint violation, device internal error), the NMS issues discard-changes to revert the candidate to match running, leaving the device completely unchanged. This ACID-like behaviour is what makes NETCONF safe for complex multi-parameter configuration changes.",
      type: "Conceptual"
    },
    {
      q: "Why does NETCONF use TCP port 830 over SSH rather than UDP like SNMP?",
      a: "NETCONF requires reliable, ordered delivery of XML messages that can be very large (multi-kilobyte configuration payloads). UDP does not guarantee delivery, ordering, or message integrity — making it unsuitable for configuration management where a lost edit-config message could result in a partially applied or missed configuration change. NETCONF also requires mutual authentication (the device must authenticate the NMS and vice versa) and encryption (configuration data often contains sensitive parameters like passwords, authentication keys, and routing policies). SSH over TCP provides: reliable in-order delivery (TCP), mutual authentication via SSH public keys or username/password, encryption of all traffic (AES or ChaCha20), and message integrity verification (HMAC). Additionally, NETCONF sessions are stateful (lock/unlock, candidate datastore state is session-specific), which maps naturally to TCP's persistent connection model rather than UDP's connectionless model.",
      type: "Analytical"
    },
    {
      q: "Calculate T_nc for S_xml = 50 KB, B_ssh = 2000 kbps, RTT = 8 ms.",
      a: "Convert units: S_xml = 50 × 1024 = 51200 bytes. B_ssh = 2000 kbps = 2000 × 1000 / 8 = 250000 bytes/second. RTT = 8 ms = 0.008 seconds. T_nc = S_xml / B_ssh + RTT = 51200 / 250000 + 0.008 = 0.2048 + 0.008 = 0.2128 seconds = 212.8 ms. This exceeds the typical interactive 200 ms budget. To reduce T_nc below 200 ms with the same RTT, bandwidth would need to be at least: S_xml / (T_budget - RTT) = 51200 / (0.192) = 266,667 bytes/s = 2133 kbps. Alternatively, reducing payload size via YANG model minimisation or using RESTCONF with JSON encoding (which reduces payload by ~40%) would bring T_nc within budget.",
      type: "Numerical"
    },
    {
      q: "What is NETCONF capability exchange and what information does it convey?",
      a: "NETCONF capability exchange is the mandatory first step after SSH session establishment, before any RPCs can be sent. Both the NETCONF client (NMS) and server (device) send a hello message listing their supported capabilities as URIs. Capabilities convey: (1) Base NETCONF version — urn:ietf:params:netconf:base:1.1 (RFC 6241); (2) Datastore support — :candidate, :startup, :writable-running indicate which datastores are available; (3) Feature support — :confirmed-commit (rollback timer), :validate (validate RPC), :url (copy-config from file URL), :xpath (XPath-based filtering in get/get-config); (4) YANG model support — each supported YANG module is listed with its module name, revision date, and namespace URI. This tells the NMS exactly what it can configure, what RPCs it can issue, and which YANG models to load for generating and validating configuration — without any trial-and-error interaction with the device.",
      type: "Conceptual"
    },
    {
      q: "How does the NETCONF lock RPC prevent configuration conflicts in environments where multiple NMS instances may configure the same device?",
      a: "The lock RPC acquires an exclusive write lock on a specified datastore (typically candidate). While a lock is held, no other NETCONF session can modify that datastore — any attempt returns a lock-denied error. This prevents the scenario where NMS instance A and NMS instance B both read the running config, both compute changes, and both write edit-config to candidate — the second write may overwrite changes from the first, creating an inconsistent configuration. With locking: NMS A issues lock candidate → makes its edits → commits → unlocks. During this window, NMS B's lock attempt is rejected, forcing it to wait or fail. The NMS must unlock or close the session to release the lock, ensuring it never holds a lock indefinitely. Best practice: acquire lock → edit → validate → commit → unlock, all within a single transaction, minimising the lock hold time to reduce contention impact.",
      type: "Analytical"
    }
  ],
  virtualLab: {
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
  }
};
