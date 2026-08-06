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
    rfcReferences: [
      { rfc: "RFC 1157", title: "SNMP v1", summary: "The original SNMP specification (1990) that introduced GET, GETNEXT, SET, and TRAP PDU types discussed in this topic.", url: "https://www.rfc-editor.org/rfc/rfc1157" },
      { rfc: "RFC 1901", title: "Community-Based SNMPv2", summary: "Defines SNMPv2c including the GETBULK and INFORM operations that improved on SNMPv1.", url: "https://www.rfc-editor.org/rfc/rfc1901" },
      { rfc: "RFC 3414", title: "USM for SNMPv3", summary: "Specifies the User-based Security Model (USM) providing HMAC authentication and AES encryption for SNMPv3 — the security upgrade this topic contrasts with v1/v2c.", url: "https://www.rfc-editor.org/rfc/rfc3414" },
      { rfc: "RFC 3415", title: "VACM for SNMP", summary: "View-based Access Control Model for SNMPv3 — provides per-user, per-MIB-subtree access control replacing community strings.", url: "https://www.rfc-editor.org/rfc/rfc3415" }
    ]
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
    technicalConnection: "RFC 3411 (SNMP Architecture) defines the modular SNMP framework: **SNMP Engine** = Dispatcher + Message Processing Subsystem + Security Subsystem + Access Control Subsystem. **SNMPv1 (RFC 1157, 1990)**: Community-based authentication, cleartext transmission. PDU types: GetRequest, GetNextRequest, SetRequest, GetResponse, Trap. Community string acts as password, transmitted in cleartext. Vulnerable to eavesdropping and replay attacks. **SNMPv2c (RFC 1901-1908, 1996)**: Added GetBulkRequest (RFC 1905) for efficient table retrieval, improved error codes (tooBig, noSuchName → genError with error-index). GetBulk parameters: non-repeaters=N (number of scalar OIDs), max-repetitions=M (table rows per PDU). Still uses community-based security (v2c='community'). **SNMPv3 (RFC 3411-3418, 2002)**: User-based Security Model (USM, RFC 3414) with 3 security levels: noAuthNoPriv (no authentication, no encryption), authNoPriv (HMAC-MD5/SHA authentication per RFC 2104), authPriv (authentication + DES/AES-128 encryption per RFC 3826). VACM (View-based Access Control Model, RFC 3415): assigns MIB views per securityName. Example: user 'monitor' has read-only view of 1.3.6.1.2.1 (MIB-II), user 'admin' has read-write. USM HMAC-MD5: uses authKey K, message M, HMAC-MD5(K,M) = MD5((K ⊕ opad) || MD5((K ⊕ ipad) || M)), where opad=0x5c repeated, ipad=0x36 repeated. Digest appended to PDU as msgAuthenticationParameters (12 bytes). AES-128-CFB encryption: uses privKey K, IV (16 bytes), ciphertext C = AES_encrypt(K, IV) ⊕ plaintext PDU."
  },

  mathModelling: {
    need: "A government agency running 800 network devices on SNMPv2c has received a security audit finding: community strings ('public', 'private') are transmitted in cleartext and were found in a network capture during a penetration test. The CISO mandates remediation within 90 days. Three options are evaluated: retain SNMPv2c with access control lists (ACLs), migrate to SNMPv3 authPriv, or replace SNMP entirely with NETCONF/YANG for all management.",
    equation: "DECISION CONSTRAINT: Community strings must not be transmittable in cleartext on any management network segment. Remediation must complete within 90 days. All 800 devices must remain manageable with no monitoring gaps. Available remediation budget: $150K.",
    technicalDetails: "SNMPv2c + ACLs: Cost ~$20K (engineer time). Restricts SNMP access to specific NMS IP addresses using device ACLs. Community strings still exist in cleartext but are harder to capture if management traffic is on a separate VLAN. Does not satisfy the CISO requirement — pen test will still find cleartext credentials. SNMPv3 authPriv migration: Cost ~$80K (scripting, testing, NMS reconfiguration for 800 devices). All devices support SNMPv3 (verified). USM with SHA-256 auth and AES-128 privacy fully satisfies the security finding. 90-day timeline achievable with automated provisioning scripts. Full NETCONF/YANG replacement: Cost ~$600K (upgrade 200 legacy devices that lack NETCONF support, re-architect NMS SBI). Far exceeds budget. 18-month timeline minimum. Disproportionate to the security finding.",
    explanation: [
      { term: "SNMPv2c + ACLs", meaning: "Adopted as a short-term interim measure when SNMPv3 migration cannot be completed before a regulatory deadline. Reduces attack surface but does not eliminate cleartext credentials. Not acceptable as a permanent solution where compliance certifications (ISO 27001, FedRAMP) require encryption." },
      { term: "SNMPv3 authPriv Migration (Recommended)", meaning: "Adopted when the primary driver is securing existing SNMP management infrastructure within a constrained budget and timeline. All 800 devices already support SNMPv3; migration is a configuration change, not a device replacement. Fully satisfies the CISO finding at $80K — within budget. 90-day timeline is achievable." },
      { term: "Full NETCONF/YANG Replacement", meaning: "Adopted when the organisation is undertaking a strategic NMS modernisation programme, not just fixing a security finding. Appropriate as a multi-year transformation project. Disproportionate as a tactical security remediation — $600K and 18 months for a finding that costs $80K and 90 days to fix with SNMPv3." }
    ],
    advantages: [
      "SNMPv3 directly eliminates the pen-test finding (cleartext credentials) with a targeted configuration change",
      "USM with AES-128 privacy satisfies common compliance frameworks (ISO 27001, NIST SP 800-53) without architectural redesign",
      "Automated provisioning scripts can configure SNMPv3 credentials on all 800 devices within the 90-day window"
    ],
    limitations: [
      "SNMPv2c + ACLs is adopted as a bridge when devices physically cannot support SNMPv3 (very old firmware)",
      "NETCONF migration is adopted when the security audit reveals broader issues beyond SNMP — e.g., CLI telnet access — requiring a complete management plane redesign",
      "SNMPv3 noAuth/noPriv is sometimes adopted as a first step to maintain compatibility while privacy is phased in"
    ]
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
      "You are an NMS performance tuner responsible for keeping SNMP management traffic under 5% of link capacity. Your task: find the optimum polling interval that keeps overhead low while maintaining acceptable fault detection latency. Adjust the node count and polling interval. The chart shows SNMP bandwidth overhead as a percentage of a 1 Mbps management link — find the interval that keeps overhead under your target threshold.",
    interpretation:
      "Doubling the polling interval halves the overhead, but also doubles the worst-case polling-based fault detection delay. With 200 nodes at 60-second intervals, overhead is 0.53% — well under 5%. At 30-second intervals it is 1.07% — still acceptable. The key insight: traps provide immediate notification, so performance counters can use longer intervals (60-300s) while fault-critical alarms use traps. This combination keeps total SNMP overhead under 2% for networks up to 500 nodes. Use this lab to calibrate your poll interval against your overhead budget.",
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
