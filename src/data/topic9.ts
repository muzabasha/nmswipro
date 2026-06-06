import type { TopicData } from './types';

export const topic9Data: TopicData = {
  id: "u1t9",
  title: "SNMP Commands",
  moduleName: "Unit I: Introduction to Network Management and Frameworks",
  context: {
    prerequisites: ["SNMP Query", "SNMP Architecture"],
    dependentTopics: ["SNMP TRAPS", "YANG Evolution & Background"],
    nextSteps: "Study SNMP TRAPs to understand event-driven monitoring as a complement to command-based polling."
  },
  storytelling: {
    analogy: "A Remote Control with Dedicated Buttons",
    story: "SNMP commands are the buttons on the NMS remote control, each performing a specific operation against any managed device. The snmpget button retrieves one precise value — tell me the uptime of this router right now. The snmpgetnext button is a cursor — move to the next object in the MIB tree — useful when exploring an unfamiliar device. The snmpwalk button is a full scan — walk the entire MIB subtree from top to bottom, one object at a time, like flipping through every page in a book. The snmpbulkwalk button is the speed-reader version — fetch 20 pages at once, dramatically reducing the time to audit a large table. The snmpset button changes a configuration value — it is the write command, treated with the same caution as a surgeon picking up a scalpel in a live operating theatre. The snmpinform button is a registered delivery service — it sends an alert and waits for the recipient to acknowledge receipt before clearing, unlike the basic snmptrap which fires and forgets over UDP. Mastering these commands gives a network engineer the ability to diagnose any SNMP-managed device directly from the command line, without needing a GUI — an essential skill when the NMS dashboard is itself down.",
    reflectiveQuestions: [
      "What precautions should be taken before issuing an snmpset command on a production router during business hours?",
      "Why is snmpwalk significantly slower than snmpbulkwalk for traversing a large MIB table?",
      "How does the INFORM command improve delivery reliability over a basic TRAP on lossy management networks?"
    ],
    technicalConnection: "CLI SNMP commands (Net-SNMP toolkit): snmpget -v2c -c public 192.168.1.1 1.3.6.1.2.1.1.3.0 retrieves sysUpTime. snmpwalk -v2c -c public 192.168.1.1 1.3.6.1.2.1.2.2 walks the ifTable. snmpset -v2c -c private 192.168.1.1 1.3.6.1.2.1.1.5.0 s NewHostname sets sysName. snmpbulkwalk -v2c -c public -Cn0 -Cr20 192.168.1.1 1.3.6.1.2.1.2.2 fetches 20 rows per PDU. SNMPv3 variants require additional flags: -v3 -l authPriv -u username -a SHA -A authpass -x AES -X privpass."
  },
  mathModelling: {
    need: "To model the time required to complete a full MIB walk using snmpwalk (GETNEXT) versus snmpbulkwalk (GETBULK), quantifying the performance advantage of bulk commands.",
    equation: "T_{walk} = N \\times RTT \\qquad T_{bulk} = \\left\\lceil \\frac{N}{R} \\right\\rceil \\times RTT",
    technicalDetails: "For GETNEXT-based snmpwalk, each of the \\( N \\) MIB objects requires one round trip, giving total time \\( T_{walk} = N \\times RTT \\). With GETBULK (snmpbulkwalk) and max-repetitions \\( R \\), \\( R \\) objects are fetched per PDU, so only \\( \\lceil N/R \\rceil \\) round trips are needed. For \\( N = 1000 \\) objects, \\( RTT = 5 \\) ms, and \\( R = 20 \\): \\( T_{walk} = 5000 \\) ms vs \\( T_{bulk} = \\lceil 1000/20 \\rceil \\times 5 = 50 \\times 5 = 250 \\) ms — a 20x speedup. The speed ratio is \\( T_{walk}/T_{bulk} = N / \\lceil N/R \\rceil \\).",
    explanation: [
      { term: "T_{walk}", meaning: "Total time for snmpwalk using GETNEXT (ms)" },
      { term: "T_{bulk}", meaning: "Total time for snmpbulkwalk using GETBULK (ms)" },
      { term: "N", meaning: "Total number of MIB objects to retrieve" },
      { term: "R", meaning: "GETBULK max-repetitions (objects fetched per PDU)" },
      { term: "RTT", meaning: "Round-trip time per PDU exchange (ms)" }
    ],
    advantages: [
      "snmpbulkwalk dramatically reduces MIB collection time — essential for NMS platforms polling thousands of devices per minute",
      "Direct CLI commands allow rapid ad-hoc diagnostics without requiring NMS GUI access",
      "snmpget pinpoints exactly the OID value needed without traversing the entire MIB tree"
    ],
    limitations: [
      "snmpset commands without SNMPv3 authentication risk unauthorised configuration changes if community strings are exposed",
      "snmpwalk on large proprietary MIBs can generate thousands of PDUs and take minutes — impractical for time-sensitive diagnostics",
      "SNMPv2c CLI commands expose community strings in process listings (ps aux) visible to other OS users"
    ],
    simulation: {
      description: "Vary max-repetitions (R) to see how the speed ratio of snmpbulkwalk over snmpwalk improves. The MIB object count is fixed at the selected value. Higher R values deliver diminishing returns once a single PDU can cover the entire MIB range.",
      parameters: [
        { id: "objects", name: "MIB Objects", min: 10, max: 500, default: 100, step: 10, unit: "" },
        { id: "maxRep", name: "Max Repetitions", min: 1, max: 50, default: 10, step: 1, unit: "" }
      ],
      generateData: (params) => {
        const N = params.objects || 100;
        const maxR = params.maxRep || 10;
        const RTT = 5; // ms
        const pts: Array<{ x: number; y: number }> = [];
        for (let x = 1; x <= maxR; x++) {
          const tWalk = N * RTT;
          const tBulk = Math.ceil(N / x) * RTT;
          const ratio = tWalk / tBulk;
          pts.push({ x, y: parseFloat(ratio.toFixed(2)) });
        }
        return pts;
      },
      labels: { x: "Max Repetitions", y: "Speed Ratio (walk/bulkwalk)" }
    }
  },
  activities: {
    level1: "Write out the complete CLI syntax for four SNMP commands: snmpget, snmpset, snmpwalk, and snmpbulkwalk. For each command, provide an example targeting OID 1.3.6.1.2.1.1.3.0 (sysUpTime) or the ifTable (1.3.6.1.2.1.2.2) using community string 'public' against IP 10.0.0.1. Label each flag.",
    level2: "Demonstrate step-by-step how snmpwalk traverses the MIB subtree starting from 1.3.6.1.2.1.1 (system group) using successive GETNEXT operations. Show at least 5 OID-name-value triples that would be returned in order, and explain when the walk terminates.",
    level3: "Calculate T_walk and T_bulk for N = 200 MIB objects, R = 20 max-repetitions, and RTT = 3 ms per PDU. Show all working and state the speedup factor.",
    level4: "Using a GNS3 simulation or a real device, run snmpwalk and snmpbulkwalk against the same device targeting the ifTable. Record: (a) total elapsed time for each, (b) number of PDU exchanges counted in a Wireshark capture, and (c) the measured speed ratio. Compare with the theoretical ratio."
  },
  projects: {
    scope: "Create an automated SNMP health-check script in Python (using pysnmp or easysnmp) that polls a set of 10 simulated routers and produces a structured JSON health report.",
    objectives: [
      "Poll sysUpTime (1.3.6.1.2.1.1.3.0), ifOperStatus (1.3.6.1.2.1.2.2.1.8), and ifInErrors (1.3.6.1.2.1.2.2.1.14) for 10 simulated devices using SNMPv2c",
      "Compare snmpwalk and snmpbulkwalk timing for the ifTable on all 10 devices",
      "Output a structured JSON report with per-device uptime, interface status, and error counters"
    ],
    deliverables: [
      "Python SNMP polling script with documented GET, walk, and bulkwalk functions",
      "Timing comparison table: snmpwalk vs snmpbulkwalk duration and PDU count per device",
      "Sample JSON health report output showing all polled values for at least 3 devices"
    ]
  },
  questions: [
    {
      q: "What is the difference between snmpget and snmpgetnext, and when would you use each?",
      a: "snmpget retrieves the value of one or more OIDs that you specify explicitly. You must know the exact OID including the instance suffix (e.g., .0 for scalar objects like sysUpTime.0). If the OID does not exist, the agent returns noSuchObject. snmpgetnext retrieves the value of the OID that is lexicographically next in the MIB tree after the OID you specify — the specified OID does not need to exist. You use snmpget when you know the exact OID and want a specific value. You use snmpgetnext (or snmpwalk, which automates successive GETNEXTs) when you want to discover or enumerate MIB objects without knowing their exact OIDs — for example, when exploring a proprietary enterprise MIB for the first time.",
      type: "Conceptual"
    },
    {
      q: "What SNMP community string is typically required for snmpset, and why is this a security concern?",
      a: "snmpset requires the read-write community string, typically 'private' by default. This is a security concern because: (1) the community string is transmitted in cleartext in every SNMPv1/v2c PDU, so any attacker with access to the management network can capture it with a packet sniffer; (2) the default 'private' community string is universally known and often left unchanged on deployed devices; (3) the community string grants write access to the entire MIB to anyone who knows it — there is no per-user or per-OID granularity; (4) an unauthorised or erroneous SET can change routing configurations, disable interfaces, or corrupt running state, potentially causing widespread outages. SNMPv3 with authPriv security level (HMAC authentication + AES encryption) should be used for all configuration operations in production.",
      type: "Conceptual"
    },
    {
      q: "For N = 500 MIB objects, R = 25 max-repetitions, and RTT = 4 ms — calculate T_walk and T_bulk.",
      a: "T_walk = N × RTT = 500 × 4 = 2000 ms (2 seconds). T_bulk = ⌈N/R⌉ × RTT = ⌈500/25⌉ × 4 = 20 × 4 = 80 ms. Speed ratio = T_walk / T_bulk = 2000 / 80 = 25x. snmpbulkwalk with R = 25 is 25 times faster than snmpwalk for 500 MIB objects at 4 ms RTT.",
      type: "Numerical"
    },
    {
      q: "Why is snmpbulkwalk preferred over snmpwalk in production NMS systems managing thousands of devices?",
      a: "In a production NMS polling 5,000 devices every 5 minutes, if each device has 200 MIB objects and RTT is 5 ms: snmpwalk would take 200 × 5 = 1,000 ms per device × 5,000 devices = 5,000 seconds — far exceeding the 300-second interval. snmpbulkwalk with R = 20 takes ⌈200/20⌉ × 5 = 50 ms per device × 5,000 = 250 seconds — fitting within the 5-minute window. Beyond timing, snmpbulkwalk reduces NMS CPU load (fewer PDU encode/decode cycles), reduces agent interrupt load, and reduces management network bandwidth consumption. These combined effects make snmpbulkwalk the standard approach for performance counter collection in any production NMS.",
      type: "Analytical"
    },
    {
      q: "What additional authentication and privacy flags does an SNMPv3 command require compared to SNMPv2c?",
      a: "An SNMPv3 command requires: -v3 (version flag), -l authPriv (security level: noAuthNoPriv | authNoPriv | authPriv), -u username (USM username replacing community string), -a SHA (authentication protocol: MD5 or SHA), -A authpassphrase (authentication key/passphrase), -x AES (privacy/encryption protocol: DES or AES), and -X privpassphrase (privacy/encryption key). For example: snmpget -v3 -l authPriv -u nmsuser -a SHA -A auth1234 -x AES -X priv1234 192.168.1.1 1.3.6.1.2.1.1.3.0. Compared to the SNMPv2c equivalent (snmpget -v2c -c public 192.168.1.1 ...) which only requires the community string, SNMPv3 requires per-user credentials, specifying both the authentication and privacy algorithms and their respective keys — providing message authentication, integrity, and confidentiality.",
      type: "Conceptual"
    }
  ],
  virtualLab: {
    description: "Adjust the number of MIB objects and max-repetitions to observe how the speed ratio of snmpbulkwalk over snmpwalk changes. Round-trip time is fixed at 5 ms. Observe where the curve plateaus — the point at which increasing max-repetitions no longer reduces the number of PDU exchanges.",
    interpretation: "The speed advantage of snmpbulkwalk grows proportionally with max-repetitions until a single PDU covers the entire MIB range (R ≥ N). In production environments managing thousands of devices, this difference translates directly to NMS scalability — more devices can be fully polled within the same monitoring window. The optimal operating point is typically R = 15-25, capturing most of the gain without risking oversized UDP responses that stress embedded SNMP agents.",
    parameters: [
      { id: "objects", name: "MIB Objects", min: 10, max: 500, default: 100, step: 10, unit: "" },
      { id: "maxRep", name: "Max Repetitions", min: 1, max: 50, default: 10, step: 1, unit: "" }
    ],
    generateData: (params) => {
      const N = params.objects || 100;
      const maxR = params.maxRep || 10;
      const RTT = 5;
      const pts: Array<{ x: number; y: number }> = [];
      for (let x = 1; x <= maxR; x++) {
        const tWalk = N * RTT;
        const tBulk = Math.ceil(N / x) * RTT;
        const ratio = tWalk / tBulk;
        pts.push({ x, y: parseFloat(ratio.toFixed(2)) });
      }
      return pts;
    },
    labels: { x: "Max Repetitions", y: "Speed Ratio (walk/bulkwalk)" }
  }
};
