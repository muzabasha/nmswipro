import type { TopicData } from './types';

export const topic6Data: TopicData = {
  id: "u1t6",
  title: "SNMP Concepts & Evolution",
  moduleName: "Unit I: Introduction to Network Management and Frameworks",

  context: {
    prerequisites: ["NMS SBI and NBI", "FCAPS Process"],
    dependentTopics: ["SNMP Architecture", "SNMP Query", "SNMP Commands", "SNMP TRAPS"],
    nextSteps:
      "Study SNMP Architecture to understand the Manager-Agent model and MIB structure in detail.",
  },

  storytelling: {
    analogy: "A Postal System with Registered Mail",
    story:
      "SNMP (Simple Network Management Protocol) is like a postal system where the NMS is the central post office and each network device is a remote branch. The NMS can send a letter asking 'how many packets did you forward today?' (GET request) and the branch (SNMP Agent) responds with the answer. If a branch catches fire — a critical fault like a port failure — it does not wait for the next scheduled letter. It calls the post office directly with an urgent notification (TRAP). SNMPv1, standardised in 1988, was like sending postcards: readable by anyone who intercepts them, with only a simple shared password (community string) for access control — no encryption, no authentication of the sender. SNMPv2c (1993) brought 'bulk mail delivery' — the GETBULK operation that retrieves multiple rows of data in a single request instead of one row per trip. But v2c kept the same insecure postcard format. SNMPv3 (1999–2004, RFC 3414) finally introduced registered mail with a wax seal and signature verification: HMAC-MD5 or HMAC-SHA authentication to prove the sender's identity, and AES-128 or DES encryption to seal the envelope against eavesdropping.",
    reflectiveQuestions: [
      "Why was SNMPv3 necessary if SNMPv2c was already an improvement over SNMPv1?",
      "What is the fundamental difference between polling-based monitoring and trap-based monitoring, and when should each be used?",
      "Why is SNMP still widely deployed despite being several decades old?",
    ],
    technicalConnection:
      "SNMP uses UDP port 161 on the Agent (for GET/SET requests from the Manager) and UDP port 162 on the Manager (TRAP receiver). It operates over the NMS Southbound Interface. The MIB (Management Information Base) is the hierarchical data schema — an OID (Object Identifier) tree rooted at iso(1).org(3).dod(6).internet(1).mgmt(2).mib-2(1). SNMPv3 introduces the User-based Security Model (USM, RFC 3414) providing HMAC-MD5/SHA for authentication and DES/AES for privacy, and the View-based Access Control Model (VACM, RFC 3415) for fine-grained read/write access control per user and MIB subtree.",
  },

  mathModelling: {
    need:
      "To model SNMP polling overhead and determine the optimal polling interval that balances data freshness against the fraction of available network bandwidth consumed by management traffic. The standard guideline is to keep SNMP overhead below 5% of available bandwidth.",
    equation:
      "O_{snmp} = \\frac{N \\times V \\times S_{pdu}}{\\Delta t \\times B}",
    technicalDetails:
      "\\( O_{snmp} \\) is the SNMP traffic as a dimensionless fraction of available bandwidth (multiply by 100 for percentage). \\( N \\) is the number of managed nodes, \\( V \\) is the number of OID variables polled per node per cycle, \\( S_{pdu} \\) is the average PDU size in bytes (request + response), \\( \\Delta t \\) is the polling interval in seconds, and \\( B \\) is the available bandwidth in bytes per second. Keeping \\( O_{snmp} < 0.05 \\) (5%) is the widely accepted operational guideline to prevent management traffic from starving production flows.",
    explanation: [
      { term: "O_{snmp}", meaning: "SNMP bandwidth overhead as a fraction of total available bandwidth" },
      { term: "N", meaning: "Number of managed network nodes" },
      { term: "V", meaning: "Number of OID variables polled per node per polling cycle" },
      { term: "S_{pdu}", meaning: "Average PDU size (bytes) for one request-response exchange" },
      { term: "\\Delta t", meaning: "Polling interval (seconds) between successive polls of the same node" },
      { term: "B", meaning: "Available management network bandwidth (bytes per second)" },
    ],
    advantages: [
      "Lightweight UDP-based protocol with minimal per-packet overhead — ideal for high-frequency polling of many devices",
      "Universal vendor support: virtually every network device manufactured since 1990 implements at least SNMPv2c",
      "SNMP Traps provide near-real-time fault notification without continuous polling overhead",
      "SNMPv3 provides enterprise-grade security (authentication + encryption) comparable to modern protocols",
    ],
    limitations: [
      "SNMPv1 and SNMPv2c transmit community strings in cleartext — trivially captured by network sniffers",
      "GETBULK responses can overwhelm low-memory embedded devices, causing agent restarts",
      "Pull-based polling introduces monitoring latency equal to the polling interval — a device can fail and recover before the next poll detects it",
      "MIB compilation and OID management is complex in large multi-vendor environments with hundreds of proprietary enterprise MIBs",
    ],
    simulation: {
      description:
        "Adjust the number of managed nodes and the polling interval to see how SNMP bandwidth overhead changes. The red dashed line at 5% marks the maximum recommended overhead threshold.",
      parameters: [
        { id: "nodes", name: "Managed Nodes", min: 10, max: 500, default: 100, step: 10, unit: "" },
        { id: "interval", name: "Poll Interval", min: 10, max: 300, default: 60, step: 10, unit: " s" },
      ],
      generateData: (params) => {
        const maxNodes = params.nodes || 100;
        const interval = params.interval || 60;
        const V = 10;           // OID variables per node
        const S = 200;          // PDU size (bytes)
        const B = 125_000;      // 1 Mbps in bytes/s
        const pts: Array<{ x: number; y: number }> = [];
        for (let x = 10; x <= maxNodes; x += 10) {
          const overhead = ((x * V * S) / (interval * B)) * 100;
          pts.push({ x, y: parseFloat(overhead.toFixed(3)) });
        }
        return pts;
      },
      labels: { x: "Managed Nodes", y: "SNMP Overhead (%)" },
    },
  },

  activities: {
    level1:
      "List the three versions of SNMP (v1, v2c, v3) and for each version state: (a) the RFC that defines it, (b) the key new feature or improvement it introduced over the previous version, and (c) one security limitation that remained or was addressed.",
    level2:
      "Explain the MIB OID hierarchy using the full path for sysDescr: iso(1) → org(3) → dod(6) → internet(1) → mgmt(2) → mib-2(1) → system(1) → sysDescr(1) → instance(0), giving the full numeric OID as 1.3.6.1.2.1.1.1.0. Describe what sysDescr contains and why the .0 suffix is required for scalar objects.",
    level3:
      "Calculate the SNMP overhead fraction \\( O_{snmp} \\) for a network with N = 200 nodes, V = 15 OID variables per node, S = 250 bytes PDU size, a polling interval Δt = 60 seconds, and a management link bandwidth B = 125,000 bytes/s (1 Mbps). Express the result as a percentage and determine whether it satisfies the 5% guideline.",
    level4:
      "Using GNS3 or Cisco Packet Tracer, configure an SNMP community string 'public' (read-only) on a router, configure a trap receiver pointing to a simulated NMS IP address, and use the snmpget command-line tool to retrieve the sysUpTime (OID 1.3.6.1.2.1.1.3.0) from the device. Document the CLI commands used and the response received.",
  },

  projects: {
    scope:
      "Build a proof-of-concept SNMP polling engine in Python (using the pysnmp or easysnmp library) that monitors 50 simulated network nodes represented by SNMP agents, collects interface counters every 60 seconds, and stores results in a time-series format.",
    objectives: [
      "Implement SNMP GET, GETNEXT, and GETBULK query operations targeting simulated agents",
      "Parse MIB OID responses for ifInOctets and ifOutOctets and store in a CSV or SQLite time-series database",
      "Compare SNMPv2c and SNMPv3 in terms of configuration complexity, CPU overhead, and security posture",
    ],
    deliverables: [
      "Python SNMP polling script with documented GET/GETNEXT/GETBULK implementations",
      "MIB OID mapping table documenting the 10 polled OIDs with their full OID path and data type",
      "Security comparison report contrasting SNMPv2c community strings vs SNMPv3 USM credentials",
    ],
  },

  questions: [
    {
      q: "What are the key differences between SNMPv1, SNMPv2c, and SNMPv3? Address security, operations, and data model improvements.",
      a: "SNMPv1 (RFC 1157, 1988): Defines the foundational GET, GETNEXT, SET, and TRAP PDU types. Uses community strings in plaintext for access control. No authentication or encryption. SNMPv2c (RFC 1901/3416, 1993): Adds GETBULK (efficient table retrieval) and INFORM (acknowledged trap). Retains insecure cleartext community strings — the 'c' stands for 'community-based'. SNMPv3 (RFC 3414/3415, 1999): Adds the User-based Security Model (USM) providing HMAC-MD5 or HMAC-SHA authentication and DES or AES-128 encryption. Adds the View-based Access Control Model (VACM) for per-user, per-subtree access control. Does not add new PDU types but wraps existing PDUs in a secure message format.",
      type: "Conceptual",
    },
    {
      q: "What is a MIB and how does the OID tree organize network management data?",
      a: "A MIB (Management Information Base) is a hierarchical database schema that defines the managed objects (variables) available in a network device. Each object is identified by an OID (Object Identifier) — a sequence of integers encoding a path through a tree. The root of the public Internet management tree is: iso(1).org(3).dod(6).internet(1). Under internet: mgmt(2) contains standard MIBs like MIB-II (1); private(4).enterprises(1) contains vendor-specific enterprise MIBs (e.g., Cisco at 1.3.6.1.4.1.9). MIB-II (RFC 1213) defines critical groups: system(1), interfaces(2), ip(4), icmp(5), tcp(6), udp(7), snmp(11). The OID tree ensures globally unique identifiers so any manager can unambiguously reference any managed object on any device.",
      type: "Conceptual",
    },
    {
      q: "Calculate O_snmp for N = 150 nodes, V = 10 OIDs per node, S = 200 bytes PDU size, Δt = 30 seconds, B = 62,500 bytes/s. Show all working and state whether it exceeds the 5% threshold.",
      a: "Apply the formula: O_snmp = (N × V × S) / (Δt × B) = (150 × 10 × 200) / (30 × 62,500) = 300,000 / 1,875,000 = 0.16 = 16%. This significantly exceeds the 5% guideline. To bring overhead below 5% at this node count and bandwidth, the polling interval must be increased to at least: Δt_min = (N × V × S) / (0.05 × B) = 300,000 / 3,125 = 96 seconds. Alternatively, the bandwidth must be increased to at least B_min = (N × V × S) / (Δt × 0.05) = 300,000 / 1,500 = 200,000 bytes/s (1.6 Mbps).",
      type: "Numerical",
    },
    {
      q: "Why is trap-based monitoring more efficient than pure polling for fault detection in large networks?",
      a: "In pure polling, the NMS must send a GET request to every device on every polling cycle to check for faults. For 1,000 devices polled every 60 seconds, this generates 1,000 request-response exchanges per minute regardless of whether any faults have occurred. The average detection latency is half the polling interval — a device can fail immediately after being polled and not be detected for up to 60 seconds. Trap-based monitoring is event-driven: an SNMP Agent sends a TRAP (v1/v2c) or INFORM (v2c/v3) PDU to the NMS only when a significant event occurs (link down, threshold crossed, reboot). This reduces management traffic to near-zero during normal operation and achieves sub-second fault detection latency. The hybrid approach — regular polling for performance data combined with traps for fault events — is the standard production practice for large-scale NMS deployments.",
      type: "Analytical",
    },
    {
      q: "What security mechanisms does SNMPv3 add over SNMPv2c?",
      a: "SNMPv3 introduces three security services through the User-based Security Model (USM, RFC 3414): (1) Authentication: HMAC-MD5 or HMAC-SHA is applied to each PDU using a user-specific auth key derived from a passphrase. This proves the message originated from the claimed user and detects tampering (integrity). (2) Privacy (Encryption): DES-CBC or AES-128-CFB encrypts the PDU payload so eavesdroppers cannot read management data or community strings. (3) Anti-replay protection: A 150-second time-window check on message timestamps prevents replay attacks. Additionally, SNMPv3 adds the View-based Access Control Model (VACM, RFC 3415) which allows fine-grained access control — a user can be restricted to read-only access on a specific MIB subtree. Together these replace the insecure cleartext community string of SNMPv1/v2c with cryptographically strong per-user credentials.",
      type: "Analytical",
    },
  ],

  virtualLab: {
    description:
      "Adjust the number of managed nodes and the polling interval to observe how SNMP bandwidth overhead changes dynamically. Explore the trade-off between monitoring freshness (short interval) and network overhead. Find the break-even point where overhead crosses the 5% threshold.",
    interpretation:
      "Increasing the polling interval dramatically reduces SNMP overhead because fewer poll cycles occur per second, spreading the fixed per-cycle traffic over more time. Doubling the interval halves the overhead. However, a longer interval means faults detected by polling (as opposed to traps) are discovered later. This fundamental trade-off guides real NMS configuration: operators typically use 60-second intervals for performance counter collection and rely exclusively on traps for immediate fault notification, achieving both low overhead and near-real-time fault awareness.",
    parameters: [
      { id: "nodes", name: "Nodes", min: 10, max: 500, default: 100, step: 10, unit: "" },
      { id: "interval", name: "Poll Interval", min: 10, max: 300, default: 60, step: 10, unit: " s" },
    ],
    generateData: (params) => {
      const maxNodes = params.nodes || 100;
      const interval = params.interval || 60;
      const V = 10;
      const S = 200;
      const B = 125_000; // 1 Mbps in bytes/s
      const pts: Array<{ x: number; y: number }> = [];
      for (let x = 10; x <= maxNodes; x += 10) {
        const overhead = ((x * V * S) / (interval * B)) * 100;
        pts.push({ x, y: parseFloat(overhead.toFixed(3)) });
      }
      return pts;
    },
    labels: { x: "Nodes", y: "SNMP Overhead (%)" },
  },
};
