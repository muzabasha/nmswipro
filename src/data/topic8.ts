import type { TopicData } from './types';

export const topic8Data: TopicData = {
  id: "u2t3",
  title: "NETCONF Protocol and Operations",
  moduleName: "Unit 2: Model-Driven Management and Protocols",
  context: {
    prerequisites: ["Topic 2.2: YANG Data Model Structure Details", "SSH Protocol"],
    dependentTopics: ["Topic 2.4: RESTCONF Protocol and Postman Operations", "Topic 3.3: REST APIs and ONF TAPI Overview"],
    nextSteps: "Explore RESTCONF as a lightweight HTTP-based alternative to NETCONF in the next topic."
  },
  storytelling: {
    analogy: "The Safe Deposit Box Transaction",
    story: "Imagine you want to change your bank account details. If you edit them directly on the clerk's terminal, a network crash mid-way leaves your profile corrupt. Instead, the bank uses a secure transaction: they pull out a shadow copy of your account in a private folder (Candidate Configuration), let you edit it (edit-config), double check for errors (validate), and then merge it back into the main bank vault (commit) while locking the vault from other changes (lock). Finally, the vault is unlocked (unlock). NETCONF operates exactly like this secure vault, running over SSH to prevent eavesdropping and using XML-based remote procedure calls (RPCs) to perform atomic database edits.",
    reflectiveQuestions: ["Why is it safer to edit a configuration copy (Candidate) rather than the active system (Running)?", "How does locking a database prevent two administrators from breaking each other's changes?"],
    technicalConnection: "NETCONF (RFC 6241) is an XML/SSH-based protocol that provides mechanisms to install, manipulate, and delete the configuration of network devices. It utilizes distinct datastores: <running/> for the active device state, <candidate/> for draft configurations, and <startup/> for non-volatile storage. Its key operations are <get-config>, <edit-config>, <lock>, <unlock>, <validate>, and <commit>, enabling safe, multi-device transactions."
  },
  mathModelling: {
    need: "To model the total transaction latency for a secure NETCONF configuration edit-validate-commit cycle over SSH.",
    equation: "T_{trans} = 3 \\times RTT + T_{lock} + T_{validate} + T_{commit}",
    technicalDetails: "The transaction latency \\(T_{trans}\\) involves three round-trip times (RTT) across the network: 1) Sending the \\(<lock>\\) RPC and getting a response; 2) Sending the \\(<edit-config>\\) payload; and 3) Sending the \\(<commit>\\) and \\(<unlock>\\) RPCs. Additionally, the device incurs internal processing delays for locking the datastore (\\(T_{lock}\\)), validating the YANG constraints of the XML configuration payload (\\(T_{validate}\\)), and writing the candidate settings into the running database (\\(T_{commit}\\)). Minimizing network RTT or optimizing device-side validation speeds up global network commits.",
    explanation: [
      { term: "T_trans", meaning: "Total time required to complete the configuration change transaction (seconds)." },
      { term: "RTT", meaning: "Round-Trip Time: The network propagation delay between the NMS and the device (seconds)." },
      { term: "T_lock", meaning: "Device processing time to secure exclusive database locks (seconds)." },
      { term: "T_validate", meaning: "Device processing time to validate XML data against the YANG schema (seconds)." },
      { term: "T_commit", meaning: "Device processing time to merge and apply the configuration (seconds)." }
    ],
    advantages: ["Quantifies the time needed to deploy changes during massive automated rollouts.", "Allows engineers to calculate maximum transaction throughput for SDN controllers."],
    limitations: ["Assumes SSH connection is already established, excluding initial handshaking and key exchange times."],
    simulation: {
      description: "Adjust the network RTT and device validate/commit times to see how total transaction latency scales. Note that network distance (RTT) is the primary driver for remote devices.",
      parameters: [
        { id: "networkRtt", name: "Network RTT", min: 0.005, max: 0.200, default: 0.050, step: 0.005, unit: " s" },
        { id: "valTime", name: "Device Validation (T_val)", min: 0.010, max: 0.500, default: 0.100, step: 0.010, unit: " s" },
        { id: "commitTime", name: "Device Commit (T_commit)", min: 0.020, max: 1.000, default: 0.150, step: 0.010, unit: " s" }
      ]
    }
  },
  activities: {
    level1: "Teacher shows on the projector an XML-wrapped NETCONF <edit-config> RPC message.",
    level2: "Students order the sequence of NETCONF XML tags to lock, edit, commit, and unlock a router datastore.",
    level3: "Roleplay: Two students act as competing NMS systems trying to write to a single router, illustrating the lock mechanism.",
    level4: "Write a comparative reflection (150 words) on how the candidate datastore differs from the running datastore, and how this prevents partial configurations."
  },
  projects: {
    scope: "Write a sequence of raw NETCONF XML payloads.",
    objectives: ["Compose a <lock> request", "Compose an <edit-config> payload adding a description to interface GigabitEthernet1", "Compose the corresponding <commit> request"],
    deliverables: ["Three XML raw payload blocks", "Sequence diagram of the SSH/RPC exchanges"]
  },
  questions: [
    { q: "What are the three standard NETCONF configuration datastores?", a: "<running/>, <candidate/>, and <startup/>.", type: "Conceptual" },
    { q: "Given RTT = 40ms, T_lock = 5ms, T_validate = 80ms, and T_commit = 110ms, calculate the total transaction time T_trans.", a: "T_trans = 3 * 0.040 + 0.005 + 0.080 + 0.110 = 0.120 + 0.195 = 0.315 seconds or 315 milliseconds.", type: "Numerical" },
    { q: "What is the role of the NETCONF <hello> message during session establishment?", a: "The <hello> message is exchanged initially to list the supported capabilities (YANG models and protocol options) of both the client (manager) and server (agent).", type: "Conceptual" },
    { q: "How does the <candidate/> datastore facilitate error recovery in configurations?", a: "It allows changes to be staged and validated before applying them. If an error is detected or the session is lost before a commit, the device discards the changes, leaving the running datastore unaffected.", type: "Analytical" },
    { q: "What happens if a client attempts to edit the configuration of a device datastore that is currently locked by another client?", a: "The device rejects the edit request and returns a lock-denied RPC error, maintaining transaction serialization and database integrity.", type: "Analytical" }
  ],
  virtualLab: {
    description: "NETCONF Datastore Simulator. Walk through the step-by-step pipeline: Lock -> Edit Candidate -> Commit -> Unlock. Monitor how the running and candidate datastores differ at each stage.",
    interpretation: "Modifying the candidate datastore does not affect the active running configuration. Only when the commit operation succeeds does the candidate configuration copy over to running. If validation fails, you discard changes without affecting the device's operational state.",
    parameters: [
      { id: "simulateError", name: "Inject Validation Error (0=No, 1=Yes)", min: 0, max: 1, default: 0, step: 1, unit: "" }
    ]
  }
};
