import type { TopicData } from './types';

export const topic6Data: TopicData = {
  id: "u2t3",
  title: "SNMPv1, v2c, and v3",
  moduleName: "Unit 2: SNMP and Legacy Protocols",
  context: {
    prerequisites: ["Introduction to SNMP", "SMI and MIBs"],
    dependentTopics: ["The Limitations of SNMP"],
    nextSteps: "We will conclude the legacy era by understanding why even SNMPv3 isn't enough, leading us to NETCONF and YANG in Unit 3."
  },
  storytelling: {
    analogy: "The Postcard, the Bulk Envelope, and the Armored Briefcase",
    story: "SNMPv1 is like sending a postcard; anyone can read the 'community string' password written on the back because it's sent in plain text. Also, you can only ask for one piece of data at a time. SNMPv2c introduced the 'Bulk Envelope', allowing you to request large amounts of data at once (GetBulk), but it's still just a paper envelope—no real security. SNMPv3 is the Armored Briefcase. It requires cryptographic authentication to open and encrypts the contents so nobody can eavesdrop on your network configuration.",
    reflectiveQuestions: ["Why did it take the industry so long to adopt the 'Armored Briefcase' (v3) if v1 and v2c were so insecure?", "What is the danger of sending a 'Set' command (which changes router settings) using a 'Postcard' (v1)?"],
    technicalConnection: "SNMPv1 introduced basic polling. SNMPv2c improved performance with GetBulkRequest and InformRequest. SNMPv3 introduced the User-Based Security Model (USM) for authentication and encryption, and the View-Based Access Control Model (VACM) for authorization."
  },
  mathModelling: {
    need: "To evaluate the computational overhead introduced by SNMPv3's encryption algorithms (like AES) on network devices.",
    equation: "t_{process} = t_{parse} + \\left( \\frac{S_{payload}}{R_{crypto}} \\right)",
    technicalDetails: "The processing time ($t_{process}$) for an SNMPv3 packet includes the time to parse the headers ($t_{parse}$) plus the time required to encrypt/decrypt the payload. The cryptographic time is the payload size ($S_{payload}$) divided by the cryptographic throughput rate ($R_{crypto}$) of the device's CPU. While SNMPv3 provides necessary security, it heavily taxes the CPU of older routers, causing $t_{process}$ to spike. If $t_{process}$ exceeds the polling timeout, the NMS will register false 'device down' alarms.",
    explanation: [
      { term: "t_{process}", meaning: "Total time required by the agent to process the SNMP request." },
      { term: "t_{parse}", meaning: "Fixed overhead time to parse the packet headers." },
      { term: "S_{payload}", meaning: "Size of the data payload in bytes." },
      { term: "R_{crypto}", meaning: "Cryptographic processing rate of the CPU (bytes per millisecond)." }
    ],
    advantages: ["Helps network engineers determine if their current hardware can handle a migration from SNMPv2c to SNMPv3 without CPU exhaustion."],
    limitations: ["Assumes software-based encryption. Modern routers with hardware cryptographic accelerators drastically reduce this overhead, making the equation less relevant for new hardware."]
  },
  activities: {
    level1: "Teacher shows a Wireshark capture of an SNMPv2c packet, revealing the community string in plain text.",
    level2: "Teacher + Students compare the packet structure of v2c vs v3 side-by-side, noting the encrypted payload in v3.",
    level3: "Group Activity: Students are given a scenario (e.g., managing routers in a public cafe vs. a secure military base) and must choose and justify the appropriate SNMP version.",
    level4: "Individual Task: Write a brief explanation of how a 'GetBulk' request in v2c improves network performance over v1."
  },
  projects: {
    scope: "Configure SNMPv3 securely on a simulated router.",
    objectives: ["Set up an SNMPv3 user with `authPriv` security level", "Configure SHA for authentication and AES for encryption", "Successfully poll the router using the configured credentials"],
    deliverables: ["The router configuration commands used", "A screenshot of the successful encrypted poll"]
  },
  questions: [
    { q: "What is the primary vulnerability of SNMPv1 and SNMPv2c?", a: "They transmit the community string (password) and all payload data in clear text, making them vulnerable to eavesdropping and interception.", type: "Conceptual" },
    { q: "In the 'Postcard' analogy, what does the 'Bulk Envelope' of SNMPv2c represent?", a: "The 'GetBulkRequest' command, which allows the manager to retrieve large blocks of data (like routing tables) in a single request, reducing network overhead.", type: "Conceptual" },
    { q: "If the payload size $S_{payload}$ is 2000 bytes, $t_{parse}$ is 2ms, and the router's crypto rate $R_{crypto}$ is 500 bytes/ms, what is the processing time $t_{process}$ for an SNMPv3 packet?", a: "t_process = 2 + (2000 / 500) = 2 + 4 = 6 milliseconds.", type: "Numerical" },
    { q: "What does the 'authPriv' security level in SNMPv3 provide?", a: "It provides both Authentication (verifying the identity of the user via hashes like SHA) and Privacy (encrypting the payload via algorithms like AES).", type: "Analytical" },
    { q: "Why might a network administrator hesitate to upgrade from SNMPv2c to SNMPv3 on older network hardware?", a: "Because the cryptographic processing required by SNMPv3 (encryption/decryption) introduces significant computational overhead, which could overwhelm the weak CPUs of older hardware.", type: "Conceptual" }
  ],
  virtualLab: {
    description: "Simulation comparing CPU load on an Agent when polling with SNMPv2c vs SNMPv3.",
    interpretation: "Watch the CPU usage graph. SNMPv2c has a negligible impact on CPU. When switching to SNMPv3 (AuthPriv), CPU usage jumps significantly due to the cryptographic overhead, especially as the polling frequency increases.",
    parameters: [
      { id: "snmpVersion", name: "SNMP Version", min: 1, max: 3, default: 2, step: 1, unit: "" },
      { id: "pollFreq", name: "Polling Freq", min: 1, max: 100, default: 10, unit: " /s" }
    ]
  }
};
