import type { TopicData } from './types';

export const topic5Data: TopicData = {
  id: "u1t5",
  title: "YANG Background & SNMP Limitations",
  moduleName: "Unit 1: Introduction to Network Management",
  context: {
    prerequisites: ["Topic 1.4: Introduction to SNMP (Architecture, Queries, Traps)", "UDP vs TCP"],
    dependentTopics: ["Topic 2.1: Introduction to Model-Driven Management", "Topic 2.2: YANG Data Model Structure Details"],
    nextSteps: "Begin Unit 2: Model-Driven Management to study YANG data modeling constructs in detail."
  },
  storytelling: {
    analogy: "Reading a Book Word-by-Word over a Walkie-Talkie",
    story: "Imagine trying to read a 500-page book to someone over a walkie-talkie (UDP). You can only send one word at a time, and they must respond 'got it' before you read the next word. If the line drops or static occurs (packet loss), you have to repeat the word, and you might get out of sync. This is how SNMP retrieves a router's massive configuration table. Now, imagine putting the book in a package, signing for it, and mailing it (TCP/NETCONF with YANG). The package is guaranteed to arrive, and there's a table of contents (YANG model) mapping exactly where everything is. SNMP was designed in 1988 for monitoring simple numbers, not for push-configuring huge, complex device states.",
    reflectiveQuestions: ["Why is it risky to configure a router's security access lists one line at a time?", "What happens if the network drops a packet midway through a series of SNMP GET-NEXT queries?"],
    technicalConnection: "SNMP's main limitations include: lack of atomic transactions (cannot rollback changes if a mid-way configuration fails), UDP's lack of reliability for large data transfers (leads to fragmentation drops), and the lack of a standardized data model (each vendor has custom MIBs, making automation difficult). YANG emerged as a formal data modeling language to solve this, creating a unified, vendor-neutral structure for both configuration and state data."
  },
  mathModelling: {
    need: "To model the transaction success probability when retrieving large network tables (e.g., routing tables) using multi-packet UDP queries (SNMP) vs. a single TCP stream (NETCONF/YANG).",
    equation: "P_{success} = (1 - p)^{\\frac{D}{S_{max}}}",
    technicalDetails: "When SNMP retrieves a large dataset of size \\(D\\) bytes, it must split it into multiple small UDP transactions, each limited by the Maximum Transmission Unit \\(S_{max}\\) (typically 1500 bytes). If the link packet loss rate is \\(p\\), the probability that all packets arrive successfully \\(P_{success}\\) decreases exponentially with the number of fragments \\(\\frac{D}{S_{max}}\\). Under even mild packet loss (e.g., 1%), retrieving a large 30KB routing table (approx. 20 packets) has a high failure rate, forcing costly retries. TCP-based model-driven protocols avoid this by using sliding window flow control and reliable retransmissions.",
    explanation: [
      { term: "P_success", meaning: "Probability that the entire dataset is successfully retrieved without retries (0 to 1)." },
      { term: "p", meaning: "Average packet drop rate of the network link." },
      { term: "D", meaning: "Total size of the configuration/state data to be retrieved (bytes)." },
      { term: "S_max", meaning: "Maximum payload capacity per UDP packet (typically 1500 bytes)." }
    ],
    advantages: ["Explains why SNMP is unusable for bulk configuration transfers.", "Justifies the transition to TCP-based RESTCONF/NETCONF protocols."],
    limitations: ["Does not model the specific retry/timeout back-off algorithms of SNMP managers."],
    simulation: {
      description: "Vary the packet drop rate (p) and data size (D) to see how success probability decays exponentially for UDP-based SNMP transfers.",
      parameters: [
        { id: "dropRate", name: "Packet Drop Rate (p)", min: 0.001, max: 0.05, default: 0.01, step: 0.001, unit: "" },
        { id: "dataSize", name: "Data Size (D)", min: 1500, max: 75000, default: 30000, step: 1500, unit: " B" }
      ]
    }
  },
  activities: {
    level1: "Teacher displays a slide listing the core failures of SNMP (No atomic changes, UDP limitation, Lack of formal modeling language).",
    level2: "Students calculate the number of packets required to transfer a 45KB routing table using SNMP GET-NEXT if each packet fits 500 bytes of payload.",
    level3: "Group discussion: Students analyze what happens if an SNMP SET command to configure a router fails on the 5th step out of 10.",
    level4: "Write a comparative analysis (150 words) on why CLI scripting and SNMP are unable to scale in modern software-defined data centers, and why YANG is needed."
  },
  projects: {
    scope: "Analyze the failure mode of SNMP configuration rollbacks.",
    objectives: ["Flowchart the process of configuring 3 VLANs on 5 switches using SNMP SET", "Highlight the steps where failure leaves the network in an inconsistent state"],
    deliverables: ["Failure Mode Flowchart", "1-page proposal for a transactional management model"]
  },
  questions: [
    { q: "What are three key limitations of SNMP when used for configuration management?", a: "1) Lack of support for transactional/atomic operations (no rollback on failure). 2) Lack of standard formatting (custom vendor MIBs). 3) Instability over UDP when transferring large configuration datasets.", type: "Conceptual" },
    { q: "If a network link has a packet drop rate p of 2% (0.02), what is the success probability P_success of transferring a 15,000-byte table over UDP using 10 packets?", a: "P_success = (1 - 0.02)^10 = 0.98^10 ≈ 0.817 or 81.7%.", type: "Numerical" },
    { q: "Why are atomic operations critical for configuring modern network services?", a: "Because a service configuration (e.g., VPN tunnel) involves changes across multiple interfaces and devices. If any single configuration command fails, the entire transaction must rollback to prevent split-brain states or security loopholes.", type: "Analytical" },
    { q: "What is YANG and why was it created?", a: "YANG is a data modeling language (RFC 6020) created to model configuration data, state data, RPCs, and notifications. It was designed to replace unstructured CLI/MIB models with a formal, vendor-neutral structure.", type: "Conceptual" },
    { q: "Explain how TCP's sliding window mechanism benefits NETCONF compared to SNMP's simple UDP query-response model.", a: "TCP guarantees reliable delivery, preserves packet order, and optimizes throughput using sliding window flow control. This allows NETCONF to transmit large XML/JSON configurations without worrying about application-level segment tracking and drop retries.", type: "Analytical" }
  ],
  virtualLab: {
    description: "UDP SNMP vs. TCP NETCONF Table Transfer Simulator. Compare completion times and retry overhead as network congestion increases.",
    interpretation: "Under high congestion, the UDP packet loss forces the SNMP manager to timeout and restart table traversal, whereas the TCP-based transfer adapts using sliding window and recovers lost segments automatically, proving TCP's superiority for large payloads.",
    parameters: [
      { id: "congestionLevel", name: "Link Congestion (%)", min: 0, max: 95, default: 20, unit: "%" }
    ]
  }
};
