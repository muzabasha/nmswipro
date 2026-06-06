import type { TopicData } from './types';

export const topic8Data: TopicData = {
  id: "u1t8",
  title: "SNMP Query",
  moduleName: "Unit I: Introduction to Network Management and Frameworks",

  context: {
    prerequisites: ["SNMP Architecture", "SNMP Concepts & Evolution"],
    dependentTopics: ["SNMP Commands", "SNMP TRAPS"],
    nextSteps:
      "Study SNMP Commands to learn the full CLI command set for practical SNMP query execution using tools like snmpget, snmpwalk, and snmpbulkwalk.",
  },

  storytelling: {
    analogy: "A Database Query System",
    story:
      "SNMP queries are the language the NMS speaks to interrogate its distributed database — a database where every network device hosts its own shard of the table (the MIB). A GET request is like a precise SQL SELECT: SELECT value WHERE oid='1.3.6.1.2.1.1.3.0' — give me the exact value of this one cell. You must know the exact OID in advance, just as you need to know the exact column and primary key in SQL. A GETNEXT is more like a cursor: 'give me the next row after this position in the table' — it's the mechanism used to walk an unknown MIB tree, retrieving each successive OID even when you don't know what's there. This is how the classic snmpwalk tool traverses an entire device's MIB. GETBULK is the high-performance query: 'give me the next 20 rows starting from this position'. Like a SQL LIMIT clause, it amortises the round-trip cost across multiple rows. A SET is an UPDATE statement — it writes a new value to an OID — but unlike a database UPDATE, a misconfigured SET on a production router can bring down a live network, so it is treated with extreme caution and typically requires SNMPv3 authentication. The fundamental challenge is that this 'database' has no single join operation: to correlate data across devices, the NMS must query each device individually and assemble the results centrally — exactly the problem modern NMS platforms solve with their inventory and topology engines.",
    reflectiveQuestions: [
      "When would you use GETNEXT instead of GET for a MIB query, and what risk does GETNEXT carry at the end of a MIB subtree?",
      "What is the risk of issuing SET commands on production network devices without per-user authentication and write access control?",
      "How does GETBULK's max-repetitions parameter interact with low-memory embedded SNMP agents, and what is the safe upper limit?",
    ],
    technicalConnection:
      "SNMP query operations: GET retrieves the value of one or more specific OIDs; GETNEXT retrieves the value of the OID lexicographically following the requested one in the MIB tree; GETBULK (SNMPv2c/v3) retrieves N rows of a MIB table in a single PDU, controlled by max-repetitions and non-repeaters fields; SET writes a new value to a specified OID. All request PDUs carry a Request-ID that the Agent echoes in its RESPONSE PDU for correlation. NMS tools like Cacti, MRTG, Zabbix, and LibreNMS use GETBULK for efficient ifTable polling, typically with max-repetitions set between 10 and 25.",
  },

  mathModelling: {
    need:
      "To quantify the efficiency gain of GETBULK over GETNEXT for retrieving an N-row MIB table, expressed as a round-trip ratio. This guides the optimal choice of max-repetitions in production NMS configurations.",
    equation:
      "RTT_{ratio} = \\frac{RTT_{getnext}}{RTT_{getbulk}} = \\frac{N}{\\lceil N / R \\rceil}",
    technicalDetails:
      "For a MIB table with \\( N \\) rows, iterative GETNEXT requires exactly \\( N \\) round trips — one PDU exchange per row. GETBULK with max-repetitions \\( R \\) retrieves \\( R \\) rows per PDU, requiring \\( \\lceil N / R \\rceil \\) round trips. \\( RTT_{ratio} \\) is the efficiency multiplier: how many times fewer round trips GETBULK needs compared to GETNEXT. For N = 100 rows and R = 20, RTT_ratio = 100 / ⌈100/20⌉ = 100 / 5 = 20x. The ratio approaches N as R increases, but plateaus at N once R ≥ N (one PDU covers the entire table). Setting R too high risks response truncation by memory-constrained agents.",
    explanation: [
      { term: "N", meaning: "Total number of rows in the MIB table being retrieved" },
      { term: "R", meaning: "GETBULK max-repetitions: number of table rows requested per PDU" },
      { term: "RTT_{getnext}", meaning: "Total round trips for GETNEXT walk = N (one per row)" },
      { term: "RTT_{getbulk}", meaning: "Total round trips for GETBULK walk = ⌈N / R⌉" },
      { term: "RTT_{ratio}", meaning: "Efficiency gain of GETBULK over GETNEXT (dimensionless multiplier)" },
    ],
    advantages: [
      "GETBULK reduces management network traffic and NMS CPU load significantly for large interface tables",
      "GETNEXT allows safe, ordered MIB tree walking without requiring prior knowledge of the OID namespace",
      "The RTT_ratio model enables NMS operators to mathematically justify their max-repetitions configuration choice",
      "SNMP queries are stateless — each PDU is self-contained, so there is no session establishment overhead",
    ],
    limitations: [
      "GETBULK is not available in SNMPv1 — devices that only support SNMPv1 must use slower GETNEXT walking",
      "Setting max-repetitions too high can cause the SNMP Agent to truncate the response or crash on low-memory embedded devices",
      "GETNEXT walks across MIB subtree boundaries unless the Manager checks that returned OIDs remain within the requested subtree",
      "SNMP queries are synchronous — the Manager must wait for each response before issuing the next query in single-threaded implementations",
    ],
    simulation: {
      description:
        "Vary the max-repetitions value to see how the GETBULK efficiency ratio improves for a fixed table size. Observe the point of diminishing returns where adding more repetitions no longer reduces round trips.",
      parameters: [
        { id: "rows", name: "Table Rows", min: 10, max: 200, default: 50, step: 5, unit: "" },
        { id: "maxRep", name: "Max Repetitions", min: 1, max: 50, default: 10, step: 1, unit: "" },
      ],
      generateData: (params) => {
        const rows = params.rows || 50;
        const maxRep = params.maxRep || 10;
        const pts: Array<{ x: number; y: number }> = [];
        for (let x = 1; x <= maxRep; x++) {
          const rttsGetbulk = Math.ceil(rows / x);
          const ratio = rows / rttsGetbulk;
          pts.push({ x, y: parseFloat(ratio.toFixed(2)) });
        }
        return pts;
      },
      labels: { x: "Max Repetitions", y: "Efficiency Ratio (GETNEXT/GETBULK)" },
    },
  },

  activities: {
    level1:
      "List all five SNMP PDU types (GET, GETNEXT, GETBULK, SET, RESPONSE) and for each: (a) state which side — Manager or Agent — sends it, (b) describe what data it carries, and (c) draw a simple sequence diagram showing the GET/RESPONSE exchange for retrieving sysUpTime (OID 1.3.6.1.2.1.1.3.0).",
    level2:
      "Trace a GETBULK request with non-repeaters = 0 and max-repetitions = 5 against a 12-row interfaces table (ifDescr column, OID 1.3.6.1.2.1.2.2.1.2). Show each PDU exchange step-by-step: which OID is requested, which 5 OIDs are returned, and how many total PDUs are needed to retrieve all 12 rows. Identify the boundary condition when the last PDU returns OIDs that fall outside the ifDescr subtree.",
    level3:
      "Calculate RTT_ratio for a 80-row MIB table with R = 10, then with R = 20. Show all working. State the percentage improvement when doubling max-repetitions from 10 to 20 in this specific case.",
    level4:
      "Using the snmpbulkwalk command-line tool, retrieve the full ifTable from a device or simulator using max-repetitions = 10, then repeat with max-repetitions = 1 (equivalent to GETNEXT). Record the total number of PDU exchanges and elapsed time for each. Compute the measured RTT_ratio and compare it with the theoretical prediction from the formula.",
  },

  projects: {
    scope:
      "Build a SNMP query performance benchmarking tool in Python (using pysnmp) that queries the interfaces table (ifTable) of a simulated network with 50 devices, comparing GETNEXT-walk and GETBULK-walk across a range of max-repetitions values from 1 to 50.",
    objectives: [
      "Implement both GETNEXT iterative walk and GETBULK bulk walk for the ifDescr and ifOperStatus columns of the ifTable",
      "Measure and record the number of PDU exchanges and wall-clock time for each approach across 50 devices",
      "Plot the efficiency ratio (RTT_getnext / RTT_getbulk) vs max-repetitions and identify the optimal knee-point",
    ],
    deliverables: [
      "Python SNMP benchmarking script with configurable target, community string, and max-repetitions sweep",
      "Performance comparison report in tabular format: max-rep vs PDU count, time, and efficiency ratio",
      "Efficiency ratio line chart showing the plateau region and recommended max-repetitions operating point",
    ],
  },

  questions: [
    {
      q: "What is the difference between the SNMP GET and GETNEXT operations?",
      a: "GET retrieves the current value of one or more OIDs that the Manager specifies explicitly. The exact OID must be known in advance (including the instance identifier suffix — e.g., .0 for scalar objects). If the OID does not exist in the Agent's MIB, the Agent returns a noSuchObject or noSuchInstance error. GETNEXT retrieves the value of the OID that is lexicographically next in the MIB tree after the specified OID — it does not require the specified OID to exist. This makes GETNEXT the basis of MIB tree walking: by repeatedly issuing GETNEXT starting from any known OID (e.g., 1.3.6.1.2.1), the Manager can discover all managed objects in a device's MIB in lexicographic order. The key risk with GETNEXT is that it will walk past the end of an intended subtree unless the Manager checks that each returned OID remains within the target prefix.",
      type: "Conceptual",
    },
    {
      q: "How does the GETBULK non-repeaters parameter control which OIDs are treated differently from repeated OIDs?",
      a: "A GETBULK PDU contains a list of OIDs divided into two sections by the non-repeaters field. The first non-repeaters OIDs are treated like GETNEXT — one successor is returned for each, regardless of max-repetitions. These are intended for scalar objects at the start of the query that don't need multiple rows. The remaining OIDs in the list are the 'repeater' variables — for each of these, up to max-repetitions successive MIB tree entries are returned. For example, with non-repeaters = 1 and max-repetitions = 10: the first OID gets a single GETNEXT response (useful for a scalar like sysUpTime), and each subsequent OID gets 10 successive entries (useful for table columns like ifDescr). This design allows a single GETBULK PDU to efficiently retrieve both scalar and tabular data in one round trip.",
      type: "Conceptual",
    },
    {
      q: "For a 60-row MIB table, calculate how many GETBULK PDUs are needed with R = 15. Then with R = 5. Show all working.",
      a: "With R = 15: PDUs = ⌈60 / 15⌉ = ⌈4.0⌉ = 4 PDUs. With R = 5: PDUs = ⌈60 / 5⌉ = ⌈12.0⌉ = 12 PDUs. RTT_ratio (R=15 vs GETNEXT) = 60 / 4 = 15x improvement. RTT_ratio (R=5 vs GETNEXT) = 60 / 12 = 5x improvement. Increasing max-repetitions from 5 to 15 triples the efficiency gain for this 60-row table, reducing PDU count from 12 to 4.",
      type: "Numerical",
    },
    {
      q: "Why might a network operator prefer trap-based fault alerts over continuous GETBULK polling for fault detection in a large network?",
      a: "Continuous GETBULK polling detects faults only when the NMS happens to poll the affected OID — the fault detection latency equals the polling interval (typically 60–300 seconds). For a 5-minute polling interval, a link that fails and recovers within 5 minutes is completely invisible to the polling system. Traps (SNMPv1/v2c) and INFORMs (SNMPv2c/v3) are event-driven: the Agent sends the notification immediately when the event occurs, achieving sub-second fault detection latency regardless of polling schedule. For a 1,000-device network polled every 60 seconds, continuous GETBULK generates 1,000 request-response pairs per minute at all times. Trap-based monitoring generates near-zero traffic during normal operation and creates PDU bursts only during outage events. The standard production architecture combines both: GETBULK polling for performance counter collection (not latency-sensitive) and traps for real-time fault detection (latency-critical).",
      type: "Analytical",
    },
    {
      q: "What is the Request-ID field used for in SNMP PDUs, and why is it necessary given that SNMP uses UDP?",
      a: "The Request-ID is a 32-bit integer assigned by the Manager in each request PDU (GET, GETNEXT, GETBULK, SET). The Agent copies this Request-ID verbatim into its corresponding RESPONSE PDU. The Manager uses the Request-ID to correlate each response with the original request. This is necessary because SNMP uses UDP, which is connectionless and provides no ordering or delivery guarantees. An NMS that sends concurrent SNMP requests to multiple devices will receive responses in unpredictable order and may receive duplicate responses from retransmissions. Without Request-ID matching, the Manager cannot determine which response answers which request. The Request-ID also allows the NMS to detect and discard stale responses (where the Request-ID in the response does not match any outstanding request) and to implement timeout-based retransmission when no response is received within the expected window.",
      type: "Analytical",
    },
  ],

  virtualLab: {
    description:
      "Adjust both the number of table rows (simulating different MIB table sizes) and the max-repetitions value to explore how GETBULK efficiency changes. Observe the point of diminishing returns — the max-repetitions value beyond which adding more repetitions no longer reduces round trips for your specific table size.",
    interpretation:
      "As max-repetitions increases, the GETBULK efficiency ratio rises rapidly from 1 (at R=1, identical to GETNEXT) toward its maximum value of N (at R≥N, the entire table in one PDU). The efficiency curve is steep at low R values and levels off as R approaches N. For a 50-row table, max-repetitions = 20 achieves 83% of the maximum possible gain; beyond that, the returns diminish sharply. This guides optimal NMS SNMP configuration: setting max-repetitions between 15 and 25 captures most of the efficiency benefit while avoiding the risk of oversized responses that stress low-memory embedded SNMP agents.",
    parameters: [
      { id: "rows", name: "Table Rows", min: 10, max: 200, default: 50, step: 5, unit: "" },
      { id: "maxRep", name: "Max Repetitions", min: 1, max: 50, default: 10, step: 1, unit: "" },
    ],
    generateData: (params) => {
      const rows = params.rows || 50;
      const maxRep = params.maxRep || 10;
      const pts: Array<{ x: number; y: number }> = [];
      for (let x = 1; x <= maxRep; x++) {
        const rttsGetbulk = Math.ceil(rows / x);
        const ratio = rows / rttsGetbulk;
        pts.push({ x, y: parseFloat(ratio.toFixed(2)) });
      }
      return pts;
    },
    labels: { x: "Max Repetitions", y: "Efficiency Ratio" },
  },
};
