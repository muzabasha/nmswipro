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
    rfcReferences: [
      { rfc: "RFC 3416", title: "SNMPv2 Protocol Operations", summary: "Defines GETBULK with max-repetitions and non-repeaters — the key efficiency mechanism analysed in this topic's polling frequency case study.", url: "https://www.rfc-editor.org/rfc/rfc3416" },
      { rfc: "RFC 1157", title: "SNMP v1", summary: "Original SNMP polling model — the baseline against which polling frequency optimisations in this topic are compared.", url: "https://www.rfc-editor.org/rfc/rfc1157" },
      { rfc: "RFC 3411", title: "SNMP Management Frameworks", summary: "Describes the overall SNMP architecture including manager/agent roles relevant to understanding polling overhead.", url: "https://www.rfc-editor.org/rfc/rfc3411" }
    ]
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
    need: "An NMS operator needs to determine the optimal SNMP polling interval for a network of 2000 managed devices. The management network link is shared at 10 Mbps. Business requirement: CPU and memory performance data must be no older than 5 minutes. Interface traffic counters need 1-minute granularity for SLA reporting. The operator evaluates: 1-minute global polling, 5-minute tiered polling (critical devices at 1-min, others at 5-min), or event-driven architecture (polling at 15-min, traps for faults).",
    equation: "DECISION CONSTRAINT: Management link ≤ 60% utilisation (6 Mbps budget for polling). Interface counters must be collected at ≤ 60-second intervals for accurate traffic rate calculation. Fault detection must not require waiting for the next poll cycle.",
    technicalDetails: "1-minute global polling: 2000 devices × 10 OIDs × 200 bytes / 60 seconds × 8 = 533 kbps for GET requests plus responses. Well within 6 Mbps budget. BUT: 2000 devices × 10 OIDs × 2ms RTT = 40 seconds — leaves only 20 seconds of headroom. Any NMS processing delay or network jitter pushes cycle over 60 seconds. 5-minute tiered polling (200 critical at 1-min, 1800 non-critical at 5-min): 200×10×200×8/60 + 1800×10×200×8/300 = 53 kbps + 96 kbps = 149 kbps. 48 seconds for critical tier + 360 seconds for normal tier (parallelised with critical). Highly efficient. Event-driven (15-min polling + traps): Minimal bandwidth. But 15-minute intervals mean traffic rate calculation uses average over 15 minutes — SLA reporting accuracy degrades significantly.",
    explanation: [
      { term: "1-Minute Global Polling", meaning: "Adopted for small networks (<500 devices) where uniformity simplifies NMS configuration and the polling cycle comfortably fits within 60 seconds. Acceptable when all devices are equally critical and granular data is needed for SLA reporting across the entire fleet." },
      { term: "5-Minute Tiered Polling (Recommended)", meaning: "Adopted in production NMS deployments at scale. Critical devices (core routers, aggregation switches) polled at 1-minute for high-resolution SLA data. Edge devices polled at 5-minute intervals saving 89% of polling bandwidth. Meets both the accuracy requirement (1-min for critical) and the bandwidth constraint." },
      { term: "Event-Driven Architecture (15-min polling + traps)", meaning: "Adopted when bandwidth is extremely constrained (e.g., satellite management links) and fault detection via traps is sufficient. Not acceptable when SLA reporting requires granular traffic counters — 15-minute averages are too coarse for most operator SLA commitments." }
    ],
    advantages: [
      "Tiered polling matches polling granularity to business criticality — best use of limited polling bandwidth",
      "1-minute polling for critical devices satisfies SLA reporting requirements for traffic counters",
      "5-minute polling for non-critical devices reduces total management traffic by 89% vs 1-minute global polling"
    ],
    limitations: [
      "1-minute global polling is used for small networks or during incident investigation when high-resolution data is needed temporarily",
      "Event-driven architecture is adopted for satellite or LTE-M management backhaul links where bandwidth is scarce",
      "Some modern NMS platforms use adaptive polling — auto-increasing frequency when anomalies are detected"
    ]
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
      "You are configuring SNMP GETBULK parameters for a large-scale NMS. Your task: find the optimal max-repetitions value that captures most of the GETBULK efficiency gain without wasting bandwidth on oversized responses. Adjust the MIB table row count and max-repetitions setting. The chart shows the efficiency ratio (higher = fewer round trips) — identify the point of diminishing returns where increasing max-repetitions stops meaningfully improving speed.",
    interpretation:
      "Setting max-repetitions = 20 on a 50-row table achieves 83% of the maximum possible gain — the efficiency curve is steep at low values and flattens as R approaches N. Beyond R = N/2, returns diminish sharply. The practical guideline: configure max-repetitions between 15 and 25 for most production SNMP deployments. This captures most of the GETBULK speed advantage while avoiding oversized UDP responses that can overflow low-memory SNMP agents on older devices. Use this lab to find the sweet spot for your environment.",
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
