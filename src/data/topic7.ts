import type { TopicData } from './types';

export const topic7Data: TopicData = {
  id: "u1t7",
  title: "SNMP Architecture",
  moduleName: "Unit I: Introduction to Network Management and Frameworks",

  context: {
    prerequisites: ["SNMP Concepts & Evolution", "EMS and NMS Architecture"],
    dependentTopics: ["SNMP Query", "SNMP Commands", "SNMP TRAPS"],
    nextSteps:
      "Study SNMP Query operations to understand how the Manager retrieves data from Agent MIBs using GET, GETNEXT, and GETBULK PDUs.",
    rfcReferences: [
      { rfc: "RFC 1213", title: "MIB-II", summary: "Defines the standard MIB-II object groups (system, interfaces, ip, tcp, udp) that form the basis of the SNMP Agent MIB discussed in this topic.", url: "https://www.rfc-editor.org/rfc/rfc1213" },
      { rfc: "RFC 3416", title: "SNMPv2 Protocol Operations", summary: "Specifies the GET, GETNEXT, GETBULK, SET, and RESPONSE PDU operations and their precise semantics.", url: "https://www.rfc-editor.org/rfc/rfc3416" },
      { rfc: "RFC 3418", title: "MIB for SNMPv2", summary: "Defines the SNMP management objects (snmp group in MIB-II) for monitoring the SNMP agent itself.", url: "https://www.rfc-editor.org/rfc/rfc3418" }
    ]
  },

  storytelling: {
    analogy: "A Library System with Librarians and Catalog Cards",
    story:
      "Picture the SNMP Manager as the head librarian at a central city library who oversees dozens of branch libraries across the region. Each network device is a branch library with its own resident librarian — the SNMP Agent — who has intimate knowledge of every book (MIB data object) on every shelf. When the head librarian wants to know how many books were borrowed last week from the West End branch, she sends a formal request slip (GET PDU) via post to the branch librarian. The branch librarian consults the catalog (MIB), finds the answer, and sends back a response slip (RESPONSE PDU) with the exact number. The catalog itself is organised like a Dewey Decimal system — a deep hierarchical tree of subject codes called OIDs (Object Identifiers). The system(1) section holds general branch information like the librarian's name (sysName) and how long the library has been open (sysUpTime). The interfaces(2) section holds a table of all the delivery desks — one row per network interface. If the West End branch burns down (critical hardware failure), the branch librarian does not wait for the next scheduled request. She calls the head librarian immediately — this is the TRAP PDU, an unsolicited emergency notification. For large audits (retrieving the full interfaces table), instead of sending one request slip per row, the head librarian can send a single 'bulk request' (GETBULK PDU) asking for 20 rows at once — dramatically reducing the postal workload.",
    reflectiveQuestions: [
      "Why does SNMP use UDP rather than TCP for most Manager-Agent communication?",
      "What is the difference between a scalar MIB object (like sysUpTime) and a tabular MIB object (like an ifTable row)?",
      "How does the MIB-II standard (RFC 1213) ensure interoperability between SNMP Managers from different vendors and Agents in devices from different manufacturers?",
    ],
    technicalConnection:
      "SNMP architecture: the Manager (NMS host) sends PDUs to the Agent (device software) over UDP/IP. The Agent runs as a process in the network element, maintains read/write access to its local MIB, and listens on UDP port 161. The Manager's trap receiver listens on UDP port 162. MIB-II (RFC 1213) defines the standard managed object groups: system, interfaces, at (address translation), ip, icmp, tcp, udp, egp, transmission, snmp. Proprietary enterprise MIBs are rooted at OID 1.3.6.1.4.1.{vendor-id} and extend standard MIBs with vendor-specific counters and configuration objects.",
  },

  mathModelling: {
    need: "An NMS team is designing the SNMP collection strategy for 5000 switches, each with an average of 48 interfaces. The team needs to retrieve the full ifTable (48 rows × 12 columns = 576 OID values per device) for all 5000 devices within a 5-minute polling cycle. Available management network bandwidth is 100 Mbps. They are evaluating three collection strategies: GETNEXT iterative walk, GETBULK with max-repetitions=20, or GETBULK with max-repetitions=50.",
    equation: "DECISION CONSTRAINT: Total collection time for 5000 devices × 576 OIDs each must fit within 300 seconds. Management bandwidth must stay below 80 Mbps (leave 20% headroom). PDU size ≤ 1500 bytes (standard Ethernet MTU). RTT per PDU = 2ms assumed.",
    technicalDetails: "GETNEXT only: 576 PDUs per device × 5000 devices = 2,880,000 PDUs. At 2ms RTT: 5760 seconds — 19× over the 300-second budget. Completely infeasible. GETBULK max-rep=20: ceil(576/20) = 29 PDUs per device × 5000 = 145,000 PDUs × 2ms = 290 seconds — just within budget. Each PDU is ~1440 bytes (20 varbinds × 72 bytes). Bandwidth: 145,000 × 1440 × 8 / 300 = 5.6 Mbps — well within 80 Mbps limit. GETBULK max-rep=50: ceil(576/50) = 12 PDUs per device × 5000 = 60,000 PDUs × 2ms = 120 seconds. Bandwidth: 60,000 × 3200 × 8 / 300 = 5.1 Mbps. BUT: each PDU is ~3600 bytes, exceeding the 1500-byte MTU — causes UDP fragmentation, which increases packet loss and retransmission.",
    explanation: [
      { term: "GETNEXT Iterative Walk", meaning: "Adopted for small networks (<100 devices) or for walking unknown/proprietary MIB subtrees where you cannot predict OID structure. Completely infeasible at 5000-device scale due to PDU count. Still used for initial MIB discovery when device capabilities are unknown." },
      { term: "GETBULK max-repetitions=20 (Recommended)", meaning: "Adopted for production NMS deployments with standard 1500-byte Ethernet MTU. Fits within the polling window (290 seconds), stays under bandwidth limit (5.6 Mbps), and avoids UDP fragmentation. The standard production configuration for most NMS platforms targeting 48-port switches." },
      { term: "GETBULK max-repetitions=50", meaning: "Adopted when the management network supports jumbo frames (9000-byte MTU) — e.g., a dedicated out-of-band management VLAN with jumbo frame enabled. With 9000-byte MTU, 50-varbind PDUs are within bounds. Also appropriate for very large tables (>100 columns) where higher repetitions reduce round trips further." }
    ],
    advantages: [
      "GETBULK max-rep=20 fits exactly within the 300-second window with a 3% margin",
      "1440-byte PDUs fit comfortably within standard 1500-byte MTU, avoiding fragmentation and retransmission",
      "5.6 Mbps bandwidth consumption leaves 94 Mbps headroom — allows parallel collection of other performance counters"
    ],
    limitations: [
      "GETNEXT is still used for discovering unknown enterprise MIBs where OID structure is not known in advance",
      "Higher max-repetitions (30-50) are used when the management network has jumbo frames enabled and device memory allows larger response PDUs",
      "Adaptive max-repetitions algorithms (start at 20, increase if no fragmentation detected) are used in sophisticated NMS platforms"
    ]
  },



  activities: {
    level1:
      "Draw a complete SNMP Manager-Agent architecture diagram. Label: (a) the NMS Manager host, (b) the network device with SNMP Agent, (c) the MIB module inside the Agent, (d) UDP port 161 (agent) and UDP port 162 (trap receiver), and (e) all five PDU types — GET, GETNEXT, GETBULK, SET, TRAP — with arrows showing the direction of each PDU.",
    level2:
      "Navigate the MIB-II OID tree and identify the full numeric OID path for each of these three objects: (a) sysUpTime — system uptime in hundredths of a second, (b) ifOperStatus — current operational status of an interface (up=1, down=2), (c) ipInReceives — total IP datagrams received. For each, state the MIB group it belongs to and whether it is a scalar or tabular object.",
    level3:
      "Calculate V_max for MTU = 1500 bytes, H_udp = 28 bytes, H_snmp = 50 bytes, S_varbind = 35 bytes. Show your working. Then recalculate for a jumbo frame MTU of 9000 bytes with the same headers and varbind size, and state the ratio of improvement.",
    level4:
      "Using the snmpwalk or snmpbulkwalk command-line tools (or a network simulator), retrieve the full interfaces table (ifTable, OID 1.3.6.1.2.1.2.2) from a live or simulated device. Document the full OID, data type, and value for at least five ifTable columns (ifIndex, ifDescr, ifType, ifSpeed, ifOperStatus) for two interfaces.",
  },

  projects: {
    scope:
      "Build a MIB browser tool in Python or Java that connects to a simulated SNMP Agent (e.g., using snmpsim or a GNS3 router), walks the MIB-II OID tree, and displays the result as a navigable hierarchical tree. The tool must demonstrate V_max calculation and GETBULK optimisation.",
    objectives: [
      "Implement SNMP GET, GETNEXT, and GETBULK operations using a standard library (pysnmp, snmp4j)",
      "Parse and display the full MIB-II system group and interfaces table in a structured tree or table view",
      "Demonstrate the V_max calculation for the target device MTU and show how it optimises GETBULK max-repetitions",
    ],
    deliverables: [
      "MIB browser source code with inline documentation (Python or Java)",
      "OID query output file showing system group and interfaces table data from at least one device",
      "GETBULK optimisation analysis comparing round-trip counts for max-repetitions = 1, 10, and V_max",
    ],
  },

  questions: [
    {
      q: "What are the five PDU types in SNMPv2c and what is the function of each?",
      a: "The five SNMPv2c PDU types are: (1) GET — sent by the Manager to retrieve the current value of one or more specified OIDs from the Agent's MIB. (2) GETNEXT — retrieves the value of the lexicographically next OID in the MIB tree after the specified OID, enabling ordered MIB tree walking without knowing exact OIDs. (3) GETBULK — a v2c addition that retrieves multiple rows of a MIB table in a single PDU, controlled by non-repeaters and max-repetitions fields. (4) SET — sent by the Manager to write a new value to a specified OID, used for configuration changes on the device. (5) GETRESPONSE (also called RESPONSE) — sent by the Agent in reply to GET, GETNEXT, GETBULK, and SET PDUs, containing the requested values or an error status. TRAP and INFORM are also defined in SNMPv2c for unsolicited notification, though sometimes counted separately.",
      type: "Conceptual",
    },
    {
      q: "Explain the difference between a standard MIB-II object and an enterprise (private) MIB object.",
      a: "Standard MIB-II objects (defined in RFC 1213) are rooted at OID 1.3.6.1.2.1 and represent universally agreed-upon managed objects that every SNMP-capable device must implement. They cover fundamental aspects of any IP node: system identity (system group), network interfaces (interfaces group), IP layer statistics (ip group), TCP/UDP counters, and more. Any SNMP Manager can query these objects on any device from any manufacturer without any MIB-specific configuration. Enterprise (private) MIBs are vendor-specific extensions rooted at 1.3.6.1.4.1.{enterprise-id}. Cisco's enterprise OID is 1.3.6.1.4.1.9, Juniper's is 1.3.6.1.4.1.2636. These define device-specific features like chassis temperature sensors, BGP route counters, or hardware module inventory. To query enterprise MIBs, the Manager must first compile the vendor-supplied MIB definition files (.my or .mib files) to resolve OID-to-name mappings.",
      type: "Conceptual",
    },
    {
      q: "Calculate V_max for MTU = 1400 bytes, H_udp = 28 bytes, H_snmp = 50 bytes, S_varbind = 40 bytes. Show all working.",
      a: "Available payload for varbinds = MTU − H_udp − H_snmp = 1400 − 28 − 50 = 1322 bytes. Maximum varbinds = ⌊1322 / 40⌋ = ⌊33.05⌋ = 33 varbinds. This means a single GETBULK PDU can retrieve at most 33 rows of a MIB table in one request before risking UDP fragmentation. Setting max-repetitions = 33 in the GETBULK PDU is therefore the optimal configuration for this MTU and varbind size.",
      type: "Numerical",
    },
    {
      q: "Why does GETBULK improve performance for interface table retrieval compared to repeated GETNEXT operations?",
      a: "For a device with N interfaces, retrieving the full ifTable using GETNEXT requires N individual round trips — one GET request and one response per row. Each round trip incurs the full round-trip latency of the management network (typically 1–10 ms). For 100 interfaces at 5 ms per round trip, GETNEXT requires 100 × 5 ms = 500 ms total. GETBULK with max-repetitions = V_max (e.g., 33) retrieves 33 rows per PDU, requiring only ⌈100/33⌉ = 4 round trips = 20 ms — a 25x latency reduction. Beyond latency, GETBULK reduces the Manager's processing overhead (fewer PDU encode/decode cycles) and reduces Agent interrupt load. This efficiency gain scales with table size: the larger the table, the greater the benefit of GETBULK over GETNEXT.",
      type: "Analytical",
    },
    {
      q: "What is the role of the SNMP Community String in SNMPv1/v2c, and why is it considered insecure?",
      a: "The community string in SNMPv1/v2c acts as a shared password between the Manager and Agent. Agents are typically configured with two community strings: 'public' (read-only, allows GET/GETNEXT/GETBULK) and 'private' (read-write, additionally allows SET). Any Manager that knows the correct community string can perform operations up to the associated privilege level. Community strings are insecure because: (1) They are transmitted in cleartext in every PDU header — any device with access to the management network can capture them with a simple packet sniffer (e.g., Wireshark). (2) The default strings 'public' and 'private' are universally known and frequently left unchanged. (3) There is no per-user granularity — all managers sharing the same string have identical access. (4) There is no message integrity protection — a man-in-the-middle can modify PDU content without detection. SNMPv3 USM replaces community strings with cryptographic HMAC-based authentication keys.",
      type: "Analytical",
    },
  ],

  virtualLab: {
    description:
      "You are tuning SNMP GETBULK performance for a large ifTable walk across 500 interfaces. Your task: determine how MTU sizing affects the number of round trips needed to retrieve the full table. Adjust the MTU (Ethernet frame size) and average varbind size. The chart shows max varbinds per PDU — a higher value means fewer round trips and faster polling. Find the MTU that reduces total round trips to under 3 for your table size.",
    interpretation:
      "With standard 1500-byte Ethernet and 30-byte varbinds, only 47 varbinds fit per PDU — requiring 11 round trips for a 500-row ifTable. Jumbo frames (9000 bytes) fit 296 varbinds — just 2 round trips. This 6x improvement directly translates to faster polling cycles and reduced CPU load on both NMS and device. The practical takeaway: enabling jumbo frames on the management network is a zero-config hardware feature (most switches support it) that yields immediate scalability improvements for any NMS performing SNMP bulkwalks.",
    parameters: [
      { id: "mtu", name: "MTU", min: 576, max: 9000, default: 1500, step: 100, unit: " bytes" },
      { id: "vbSize", name: "Varbind Size", min: 10, max: 100, default: 30, step: 5, unit: " bytes" },
    ],
    generateData: (params) => {
      const maxMtu = params.mtu || 1500;
      const vbSize = params.vbSize || 30;
      const H_total = 28 + 50; // H_udp + H_snmp
      const pts: Array<{ x: number; y: number }> = [];
      for (let x = 576; x <= maxMtu; x += 100) {
        const vmax = Math.floor((x - H_total) / vbSize);
        pts.push({ x, y: vmax > 0 ? vmax : 0 });
      }
      return pts;
    },
    labels: { x: "MTU (bytes)", y: "Max Varbinds per PDU" },
  },
};
