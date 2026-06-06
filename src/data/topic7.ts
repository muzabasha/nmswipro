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
    need:
      "To compute the maximum number of OID varbind pairs that can be packed into a single SNMP GETBULK PDU without exceeding the network MTU, thereby avoiding UDP packet fragmentation which can cause PDU loss and retransmission.",
    equation:
      "V_{max} = \\left\\lfloor \\frac{MTU - H_{udp} - H_{snmp}}{S_{varbind}} \\right\\rfloor",
    technicalDetails:
      "\\( V_{max} \\) is the maximum number of OID+value varbind pairs that fit in one PDU. \\( MTU \\) is the link Maximum Transmission Unit (1500 bytes for Ethernet, up to 9000 bytes for jumbo frames). \\( H_{udp} \\) is the combined UDP header (8 bytes) plus IP header (20 bytes) overhead = 28 bytes. \\( H_{snmp} \\) is the SNMP PDU header overhead including version, community string, and PDU type fields, typically ~50 bytes for SNMPv2c. \\( S_{varbind} \\) is the average BER-encoded size of one OID+value pair; for 32-bit counter values with typical OIDs this is 20–40 bytes. GETBULK uses the max-repetitions field to request \\( V_{max} \\) rows of a MIB table in a single PDU, minimising round trips.",
    explanation: [
      { term: "V_{max}", meaning: "Maximum number of OID+value varbind pairs per PDU" },
      { term: "MTU", meaning: "Maximum Transmission Unit of the link layer (bytes), e.g., 1500 for Ethernet" },
      { term: "H_{udp}", meaning: "UDP header (8 bytes) + IP header (20 bytes) = 28 bytes combined overhead" },
      { term: "H_{snmp}", meaning: "SNMP PDU header overhead (version, community, PDU type, IDs) ≈ 50 bytes" },
      { term: "S_{varbind}", meaning: "Average BER-encoded size of one OID+value varbind pair (bytes)" },
    ],
    advantages: [
      "GETBULK with an optimal max-repetitions setting dramatically reduces round trips for MIB table traversal, improving NMS scalability",
      "MIB-II ensures a common baseline of managed objects across all SNMP-capable devices, enabling vendor-agnostic management",
      "The hierarchical OID tree allows MIBs to be extended without breaking existing Manager-Agent compatibility",
      "UDP's connectionless design means the SNMP Agent remains lightweight with no connection state overhead",
    ],
    limitations: [
      "Large GETBULK responses that approach or exceed the MTU can cause UDP fragmentation, which is unreliable over lossy paths",
      "MIB compilation and resolution of vendor enterprise MIBs is operationally complex in large multi-vendor environments",
      "SNMPv1/v2c community-string security is inadequate for management traffic that crosses untrusted network segments",
      "The Agent's MIB access is synchronous and single-threaded on many embedded devices — heavy GETBULK loads can cause agent instability",
    ],
    simulation: {
      description:
        "Vary the varbind size to observe how the maximum number of varbinds per PDU changes for a fixed MTU. Smaller, more compact varbinds (simpler OIDs with integer values) allow more data per PDU.",
      parameters: [
        { id: "mtu", name: "MTU", min: 576, max: 9000, default: 1500, step: 100, unit: " bytes" },
        { id: "varbindSize", name: "Varbind Size", min: 10, max: 100, default: 30, step: 5, unit: " bytes" },
      ],
      generateData: (params) => {
        const mtu = params.mtu || 1500;
        const maxVbSize = params.varbindSize || 30;
        const H_total = 28 + 50; // H_udp + H_snmp = 78 bytes
        const pts: Array<{ x: number; y: number }> = [];
        for (let x = 10; x <= maxVbSize; x += 5) {
          const vmax = Math.floor((mtu - H_total) / x);
          pts.push({ x, y: vmax });
        }
        return pts;
      },
      labels: { x: "Varbind Size (bytes)", y: "Max Varbinds per PDU" },
    },
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
      "Adjust the MTU to see how the maximum number of varbinds per GETBULK PDU scales with available frame size. Compare standard Ethernet (1500 bytes) against jumbo frames (9000 bytes) for large MIB table retrieval.",
    interpretation:
      "Larger MTUs allow more varbinds per GETBULK PDU, directly reducing the number of round trips required to retrieve a complete MIB table. With standard 1500-byte Ethernet and 30-byte varbinds, V_max ≈ 47 varbinds per PDU. With jumbo frames (9000 bytes), V_max ≈ 296 varbinds — a 6x improvement. For a 500-row ifTable: standard Ethernet requires ⌈500/47⌉ = 11 round trips; jumbo frames require only ⌈500/296⌉ = 2 round trips. This demonstrates why enabling jumbo frames on the management network significantly improves NMS scalability for large device populations.",
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
