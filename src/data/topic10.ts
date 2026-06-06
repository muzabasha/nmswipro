import type { TopicData } from './types';

export const topic10Data: TopicData = {
  id: "u1t10",
  title: "SNMP TRAPS",
  moduleName: "Unit I: Introduction to Network Management and Frameworks",
  context: {
    prerequisites: ["SNMP Commands", "SNMP Architecture"],
    dependentTopics: ["YANG Evolution & Background", "SNMP Limitations and Operators Requirement"],
    nextSteps: "Study YANG Evolution & Background to understand the data modelling improvements that directly address SNMP's limitations revealed by TRAP-based management."
  },
  storytelling: {
    analogy: "A Burglar Alarm vs a Security Guard Making Rounds",
    story: "Traditional SNMP polling is like a security guard who walks around a building every 5 minutes checking that all doors are locked. They are thorough, but they might find a problem up to 5 minutes after it happened. SNMP TRAPs are the burglar alarm — the moment a door is forced open (a fault occurs), an instant alert fires directly to the control room (NMS trap receiver on UDP port 162). The device does not wait to be asked; it shouts immediately. This is why TRAPs are the preferred mechanism for fault detection: zero polling latency. However, there is a critical flaw — UDP-based TRAPs are fire-and-forget. If the alarm signal is lost on a congested or lossy management network, the control room never knows the door was opened. This gap led to the introduction of SNMP INFORMs in SNMPv2c: instead of a one-way shout, an INFORM is a two-way radio call — it sends the alert and waits for a 'Roger that' acknowledgment from the NMS. If no ACK arrives within the timeout window, the device retransmits. Only after receiving the ACK does the agent stop retrying. This makes INFORMs suitable for critical alerts in environments where management network reliability cannot be guaranteed — such as out-of-band management links over the public internet.",
    reflectiveQuestions: [
      "Why might an NMS miss some TRAPs during a high-load event even when the management network is otherwise reliable?",
      "What is the practical delivery reliability difference between a single UDP TRAP and an INFORM with 3 retries on a 5% lossy link?",
      "How does an NMS distinguish between a device that genuinely went down and a device that simply stopped sending TRAPs due to a misconfiguration?"
    ],
    technicalConnection: "TRAPs are sent from the SNMP Agent (device) to the NMS trap receiver on UDP port 162. SNMPv1 defines 6 generic trap types: coldStart, warmStart, linkDown, linkUp, authenticationFailure, egpNeighborLoss, plus enterpriseSpecific for vendor-defined events. SNMPv2c/v3 unify all traps into a single trapPDU format using snmpTrapOID.0 to identify the trap type. Every SNMP trap PDU must contain two mandatory varbinds: sysUpTime.0 (the agent's uptime at the moment of the event) and snmpTrapOID.0 (the OID identifying the trap type). INFORMs add a Manager-to-Manager acknowledged notification path with configurable retransmission intervals and retry counts."
  },
  mathModelling: {
    need: "To compare the probability of successful alert delivery for a single UDP TRAP versus an INFORM with n retransmissions, quantifying the reliability improvement of INFORMs over TRAPs on a lossy management network.",
    equation: "P_{\\text{inform}}(n) = 1 - p^{n+1}",
    technicalDetails: "For a single UDP TRAP sent over a link with per-packet loss probability \\( p \\), the delivery success probability is \\( 1 - p \\). For an INFORM with \\( n \\) retransmissions (so up to \\( n+1 \\) total attempts), delivery fails only if all \\( n+1 \\) attempts are lost, which has probability \\( p^{n+1} \\). Therefore \\( P_{\\text{inform}}(n) = 1 - p^{n+1} \\). For \\( p = 0.05 \\) (5% packet loss) and \\( n = 3 \\) retransmissions: \\( P = 1 - 0.05^4 = 1 - 0.00000625 \\approx 99.9994\\% \\), compared to \\( 1 - 0.05 = 95\\% \\) for a single TRAP.",
    explanation: [
      { term: "P_{\\text{inform}}(n)", meaning: "Probability of successful INFORM delivery with n retransmissions" },
      { term: "p", meaning: "Per-packet loss probability on the management link (0 to 1)" },
      { term: "n", meaning: "Number of retransmissions (total attempts = n + 1)" }
    ],
    advantages: [
      "TRAPs provide near-instant fault notification with zero polling overhead — critical for fast SLA-compliant response",
      "INFORMs add reliable delivery via acknowledgment and retransmission, suitable for critical alerts on unreliable management paths",
      "Trap-based monitoring generates near-zero traffic during normal operation, conserving management bandwidth"
    ],
    limitations: [
      "UDP-based TRAPs can be silently dropped under high load — a device reboot generating hundreds of traps may flood and saturate the NMS",
      "Trap storms (cascading failures generating thousands of traps per second) can overwhelm NMS processing capacity",
      "An INFORM that never receives an ACK will retransmit indefinitely until a timeout, consuming agent memory and CPU"
    ],
    simulation: {
      description: "Adjust packet loss percentage and number of INFORM retransmissions to see how delivery probability improves with each retry. Compare the TRAP baseline (n=0) against INFORMs with increasing retry counts.",
      parameters: [
        { id: "loss", name: "Packet Loss", min: 1, max: 30, default: 5, step: 1, unit: " %" },
        { id: "retries", name: "INFORM Retries", min: 0, max: 10, default: 3, step: 1, unit: "" }
      ],
      generateData: (params) => {
        const p = (params.loss || 5) / 100;
        const maxRetries = params.retries || 3;
        const pts: Array<{ x: number; y: number }> = [];
        for (let n = 0; n <= maxRetries; n++) {
          const prob = (1 - Math.pow(p, n + 1)) * 100;
          pts.push({ x: n, y: parseFloat(prob.toFixed(4)) });
        }
        return pts;
      },
      labels: { x: "Retries (n)", y: "Delivery Probability (%)" }
    }
  },
  activities: {
    level1: "List the 6 standard SNMPv1 generic trap types (coldStart, warmStart, linkDown, linkUp, authenticationFailure, egpNeighborLoss) and describe the specific network event or condition that triggers each one.",
    level2: "Draw a message sequence diagram comparing a TRAP delivery (one-way, no ACK) versus an INFORM delivery (request + ACK, with retransmission on timeout). Label: sender, receiver, PDU type, ACK, timeout window, and retry.",
    level3: "Calculate the delivery probability for a single TRAP and for an INFORM with n = 2, n = 3, and n = 5 retries, given p = 0.10. Show all working and state the reliability gain of 5 retries over a single TRAP.",
    level4: "Using GNS3 or Cisco Packet Tracer, configure an SNMP trap receiver on a simulated NMS host, trigger a linkDown event by shutting a router interface, and capture the resulting TRAP PDU in Wireshark. Identify the sysUpTime.0 and snmpTrapOID.0 varbinds in the PDU decode."
  },
  projects: {
    scope: "Build an SNMP trap receiver application that processes, categorises, and persists incoming traps into a structured alarm database.",
    objectives: [
      "Receive and parse SNMPv2c trap PDUs, extracting sysUpTime.0, snmpTrapOID.0, and all additional varbinds",
      "Categorise traps by severity: linkDown → Critical, authenticationFailure → Warning, warmStart → Informational",
      "Implement INFORM acknowledgment logic — send a RESPONSE PDU back to the agent upon receipt"
    ],
    deliverables: [
      "Python trap receiver source code (using pysnmp or scapy) with documented parsing and categorisation logic",
      "Alarm severity categorisation table mapping snmpTrapOID values to severity levels",
      "TRAP vs INFORM delivery reliability comparison report with probability calculations for p = 0.05, 0.10, 0.20"
    ]
  },
  questions: [
    {
      q: "What two varbinds are mandatory in every SNMPv2c trap PDU, and what information do they carry?",
      a: "Every SNMPv2c (and SNMPv3) trap PDU must contain two mandatory varbinds as the first two entries in the varbind list: (1) sysUpTime.0 (OID 1.3.6.1.2.1.1.3.0) — the value of the agent's sysUpTime at the moment the trap was generated, expressed in hundredths of a second. This timestamps the event relative to the last device restart, allowing the NMS to detect out-of-order or duplicate traps. (2) snmpTrapOID.0 (OID 1.3.6.1.6.3.1.1.4.1.0) — the OID that identifies the specific type of trap being sent (e.g., 1.3.6.1.6.3.1.1.5.3 for linkDown, or a vendor enterprise OID for proprietary events). All additional varbinds following these two provide context-specific data relevant to the event.",
      type: "Conceptual"
    },
    {
      q: "Explain the mechanism by which INFORMs improve on the unreliability of UDP TRAPs.",
      a: "An SNMP INFORM (SNMPv2c/v3) uses a request-response mechanism over UDP. The sending agent transmits the INFORM PDU and starts a retransmission timer. The receiving NMS must send a RESPONSE PDU (GET-RESPONSE) acknowledging the INFORM. If the agent does not receive the RESPONSE within the timeout window (typically 1-5 seconds), it retransmits the INFORM PDU. This continues for a configured number of retries. Delivery fails only if all transmission attempts (original + all retries) are lost — probability p^(n+1) on a link with per-packet loss p. For a single TRAP on a 5% lossy link, delivery probability is 95%. For an INFORM with 3 retries, it is 1 - 0.05^4 = 99.9994%. The trade-off is that INFORMs consume more agent memory (must buffer the PDU until ACKed) and can create retransmission storms if the NMS is temporarily unavailable.",
      type: "Conceptual"
    },
    {
      q: "For p = 0.08 (8% packet loss), calculate INFORM delivery probability with n = 2 and n = 4 retries.",
      a: "Using P = 1 - p^(n+1): For n = 2: P = 1 - 0.08^3 = 1 - 0.000512 = 0.999488 = 99.9488%. For n = 4: P = 1 - 0.08^5 = 1 - 0.0000032768 = 0.9999967232 ≈ 99.9997%. A single TRAP has P = 1 - 0.08 = 92%. Two retries improve delivery from 92% to 99.95%, and 4 retries achieve 99.9997% — essentially guaranteed delivery even on an 8% lossy management link.",
      type: "Numerical"
    },
    {
      q: "What is a 'trap storm' and how should a well-designed NMS handle one?",
      a: "A trap storm occurs when a single failure event causes a large number of network elements to simultaneously generate traps — for example, a core switch failure may cause hundreds of downstream devices to report linkDown simultaneously. This can generate thousands of trap PDUs per second, overwhelming the NMS trap receiver's processing queue and causing it to drop later traps. A well-designed NMS handles trap storms through: (1) Rate limiting — discarding duplicate traps from the same source within a short time window; (2) Alarm correlation — recognising that hundreds of linkDown traps from devices connected to the same switch indicate a single root-cause event (the switch failure), not hundreds of independent faults; (3) Storm suppression — if a source exceeds a trap-per-second threshold, the NMS generates a single 'trap storm detected' alarm and temporarily suppresses further traps from that source; (4) Queue buffering — a deep receive buffer prevents UDP packet drops during the initial burst.",
      type: "Analytical"
    },
    {
      q: "How does the NMS distinguish between a device that has genuinely gone down and a device that has simply stopped sending traps?",
      a: "A device that has genuinely gone down will stop responding to both SNMP polling AND stop sending traps. The NMS detects this through the combination of: (1) Polling timeout — if the NMS sends 3 consecutive SNMP GET requests to sysUpTime.0 with no response (each timing out after the configured window), the device is declared unreachable; (2) Dead-agent detection — most NMS platforms implement a 'keep-alive' polling interval specifically to detect unresponsive agents; (3) Heartbeat traps — some deployments configure devices to send periodic 'I am alive' heartbeat traps (warmStart or custom enterprise traps), and absence of a heartbeat within the expected interval triggers a 'silent agent' alarm. A device that has stopped sending traps due to misconfiguration (wrong trap receiver IP) will still respond to polls — the NMS can detect the misconfiguration by comparing the expected trap rate against zero and flagging the discrepancy.",
      type: "Analytical"
    }
  ],
  virtualLab: {
    description: "Vary the packet loss percentage and number of INFORM retransmissions to observe how delivery probability improves with each retry. The chart shows delivery probability (%) as retry count increases from 0 (equivalent to a single TRAP) up to the selected maximum.",
    interpretation: "Even modest packet loss (5-10%) makes single-TRAP delivery unreliable for critical fault notifications. INFORMs with just 2-3 retries restore delivery probability above 99.99% even on 10% lossy links. This quantifies why production NMS deployments configure INFORMs rather than TRAPs for critical alarms, accepting the higher agent overhead in exchange for guaranteed delivery assurance.",
    parameters: [
      { id: "loss", name: "Packet Loss", min: 1, max: 30, default: 5, step: 1, unit: " %" },
      { id: "retries", name: "INFORM Retries", min: 0, max: 10, default: 3, step: 1, unit: "" }
    ],
    generateData: (params) => {
      const p = (params.loss || 5) / 100;
      const maxRetries = params.retries || 3;
      const pts: Array<{ x: number; y: number }> = [];
      for (let n = 0; n <= maxRetries; n++) {
        const prob = (1 - Math.pow(p, n + 1)) * 100;
        pts.push({ x: n, y: parseFloat(prob.toFixed(4)) });
      }
      return pts;
    },
    labels: { x: "Retries (n)", y: "Delivery Probability (%)" }
  }
};
