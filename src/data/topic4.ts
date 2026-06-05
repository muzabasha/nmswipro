import type { TopicData } from './types';

export const topic4Data: TopicData = {
  id: "u2t1",
  title: "Introduction to SNMP",
  moduleName: "Unit 2: SNMP and Legacy Protocols",
  context: {
    prerequisites: ["Information Models vs. Communication Models"],
    dependentTopics: ["SMI and MIBs", "SNMP Versions and Security"],
    nextSteps: "After understanding the basics of SNMP operations, we will dive into how the MIB structures the data it retrieves."
  },
  storytelling: {
    analogy: "The Manager and the Department Heads",
    story: "Imagine a CEO (the NMS) who manages several departments. The CEO doesn't micromanage every employee; instead, they talk to the Department Heads (the SNMP Agents). The CEO asks questions ('Get me the sales numbers') or gives commands ('Set the marketing budget to $10k'). Sometimes, if a fire breaks out in a department, the Department Head immediately calls the CEO without being asked—this is an SNMP Trap. SNMP defines the language and rules for this communication.",
    reflectiveQuestions: ["Why is it better for the CEO to talk to Department Heads rather than every individual employee?", "What happens if a Department Head's 'Trap' message gets lost in the mail?"],
    technicalConnection: "SNMP is an application-layer protocol that facilitates the exchange of management information between network devices. It operates primarily on a pull-model (Get/Set) but supports asynchronous push-notifications (Traps)."
  },
  mathModelling: {
    need: "To understand the bandwidth consumed by SNMP polling on a network, especially when managing thousands of devices.",
    equation: "B_{poll} = N \\times F \\times (S_{req} + S_{resp})",
    technicalDetails: "The Bandwidth of Polling ($B_{poll}$) calculates the bytes per second consumed by SNMP queries. It depends on the number of devices ($N$), the polling frequency ($F$ in queries per second), the size of the SNMP GetRequest packet ($S_{req}$), and the size of the GetResponse packet ($S_{resp}$). While SNMP uses UDP to minimize overhead, frequent polling of large MIB tables across many devices can still cause significant network congestion.",
    explanation: [
      { term: "B_{poll}", meaning: "Bandwidth consumed by polling (bytes/second)." },
      { term: "N", meaning: "Number of devices being monitored." },
      { term: "F", meaning: "Polling Frequency (queries per second)." },
      { term: "S_{req} + S_{resp}", meaning: "Total bytes of the request and response packets." }
    ],
    advantages: ["Allows network administrators to plan capacity for the management VLAN.", "Justifies the use of SNMP Traps (event-driven) over aggressive constant polling."],
    limitations: ["Assumes uniform packet sizes, which is rarely true when requesting varying amounts of OIDs.", "Ignores retransmission overhead if UDP packets are dropped."]
  },
  activities: {
    level1: "Teacher demonstrates a simple `snmpget` command from a terminal to query a router's uptime.",
    level2: "Teacher + Students break down the output of the `snmpget` command, identifying the Manager, Agent, and the value returned.",
    level3: "Group Activity: Students roleplay as Manager and Agents, passing paper 'Packets' with Get, Set, and Trap messages.",
    level4: "Individual Task: Write a comparison of the Push (Trap) vs. Pull (Get) models in SNMP."
  },
  projects: {
    scope: "Set up a local SNMP Agent and query it using open-source tools.",
    objectives: ["Install an SNMP agent (e.g., net-snmp) on a local machine", "Configure a read-only community string", "Use an SNMP Walk tool to retrieve system information"],
    deliverables: ["Screenshots of the successful SNMP Walk", "A brief explanation of the community string security risk"]
  },
  questions: [
    { q: "What are the two primary components in an SNMP managed network?", a: "The SNMP Manager (which resides on the NMS) and the SNMP Agent (which resides on the managed device).", type: "Conceptual" },
    { q: "In the CEO analogy, what does a Department Head calling the CEO about a fire represent?", a: "An SNMP Trap, which is an unsolicited, asynchronous message sent by the Agent to notify the Manager of a significant event.", type: "Conceptual" },
    { q: "If an NMS polls 1,000 devices every 10 seconds ($F = 0.1$), and the combined request/response size is 500 bytes, what is the polling bandwidth $B_{poll}$?", a: "$B_{poll} = 1000 * 0.1 * 500 = 50,000$ bytes/second (or 50 KB/s).", type: "Numerical" },
    { q: "Which transport layer protocol does SNMP primarily use, and why?", a: "SNMP primarily uses UDP (User Datagram Protocol) because it has lower overhead than TCP, making it faster and less taxing on network resources.", type: "Analytical" },
    { q: "What is the primary difference between an SNMP 'Get' request and an SNMP 'Set' request?", a: "A 'Get' request retrieves information (read-only), while a 'Set' request modifies a configuration or variable on the managed device (write).", type: "Conceptual" }
  ],
  virtualLab: {
    description: "Simulation of SNMP Polling Bandwidth based on device count and frequency.",
    interpretation: "Notice how bandwidth scales linearly. As you add more devices, you must either decrease your polling frequency (which delays fault detection) or rely more heavily on SNMP Traps to maintain a healthy management network.",
    parameters: [
      { id: "deviceCount", name: "Number of Devices (N)", min: 100, max: 10000, default: 1000, unit: "" },
      { id: "pollFreq", name: "Polling Freq (F)", min: 0.01, max: 1, default: 0.1, unit: " /s" }
    ]
  }
};
