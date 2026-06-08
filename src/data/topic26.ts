import type { TopicData } from './types';

export const topic26Data: TopicData = {
  id: "u3t4",
  title: "NMS Discovery",
  moduleName: "Unit III: Alarm Lifecycle Management",
  context: {
    prerequisites: ["EMS and NMS Architecture", "SNMP Architecture"],
    dependentTopics: ["NMS NBI Interface"],
    nextSteps: "Study the NMS NBI Interface to understand how the discovered and inventoried network data is exposed northbound to OSS systems and analytics platforms."
  },
  storytelling: {
    analogy: "A City Census Office",
    story: "NMS Discovery is the census office for network devices. Before a city can plan its roads, schools, and utilities, the census office must first know every household that exists: its address, how many people live there, what languages they speak, what services they use. Without this inventory, planning is guesswork. Similarly, before an NMS can manage, monitor, or receive alarms from any network element, it must first discover that the element exists. Network discovery is the process of systematically finding every device, every interface, every link, and every protocol instance in the network and recording them in the NMS inventory database. Discovery uses multiple complementary methods because no single method finds everything: SNMP discovery walks the system MIB (sysName, sysDescr, sysObjectID, sysLocation) and the interfaces table (ifDescr, ifType, ifOperStatus) on every responding IP address to identify SNMP-managed devices. ICMP ping sweeps scan IP address ranges to find live devices — any device that responds to ping is a candidate for further probing. CDP/LLDP neighbour discovery uses the CDP-MIB (Cisco-proprietary) or LLDP-MIB (IEEE 802.1AB standard) to ask each discovered switch and router for the list of its directly connected neighbours — this is the fastest way to build a topological map, because each device reports its own neighbours. NETCONF capability exchange connects to devices via NETCONF over SSH and queries the hello message to discover which YANG models the device supports — identifying its capabilities for programmatic management. Once all devices are found, topology discovery correlates the LLDP neighbour information to construct a physical connectivity graph — which port on which device connects to which port on which other device. This graph is the foundation of fault correlation, root cause analysis, and impact analysis in the NMS.",
    reflectiveQuestions: [
      "If a new device is added to the network and is not SNMP-manageable but responds to ICMP, how would you design a discovery workflow to still include it in the NMS inventory?",
      "Why is LLDP-based topology discovery more reliable than CDP-based discovery in a multi-vendor environment?",
      "How should the NMS handle discovery of devices that are reachable but whose SNMP community strings are not yet configured — should they appear in the inventory as 'unmanaged' or be excluded entirely?"
    ],
    technicalConnection: "NMS discovery is typically scheduled as a periodic job (e.g., every 24 hours for full discovery, every 5 minutes for new-device detection). Discovery workflows in commercial NMS platforms: Cisco Prime Infrastructure — SNMP ping sweep + CDP discovery + SNMP walk. IBM Tivoli Netcool — network discovery using DISCO probe. SolarWinds NPM — SNMP/ICMP scan with automatic interface enumeration. OpenNMS — Provisiond with discovery policy (IP ranges, SNMP community strings, foreign sources). NETCONF discovery: send hello, parse capabilities, match against known YANG module names (ietf-interfaces@2018-02-20, ietf-alarms@2019-09-11). Discovery output: CMDB populated with device objects, interface objects, topology links, and protocol instances — all referenced by alarm events."
  },
  mathModelling: {
    need: "A new operator is deploying an NMS to manage 5,000 network elements across 3 technology domains (RAN, transport, IP core). Day 1 of NMS deployment requires all 5,000 elements to be discovered (IP addresses, device type, YANG capabilities, interface inventory). The discovery must complete within 8 hours (one shift) and must produce accurate topology maps for fault correlation. Three discovery strategies are evaluated.",
    equation: "DECISION CONSTRAINT: 5,000 elements fully discovered within 8 hours. Discovery must identify device type, management IP, software version, YANG capabilities, and interface list per element. Topology map must be accurate within 10% (no more than 500 missing links). Decision: Manual seed + SNMP scan / LLDP/CDP topology discovery / NETCONF capability exchange / Hybrid automated discovery.",
    technicalDetails: "Manual Seed + SNMP Scan: Operator manually enters 5,000 IP addresses into NMS seed table. NMS sends SNMP GET to each device. Discovery rate: 10 devices/minute (SNMP timeout handling). 5,000 devices: 500 minutes (8.3 hours) — marginally over the 8-hour constraint. SNMP provides: sysName, sysDescr, ifTable. No YANG capabilities. Topology accuracy: 60% (SNMP does not provide LLDP/CDP neighbour data natively on all vendors). LLDP/CDP Topology Discovery (Recommended stage 1): Seeds 50 core nodes manually. NMS queries LLDP-MIB or CDP tables on each discovered node to find neighbours. Cascading discovery propagates from 50 seeds to all 5,000 elements. Discovery rate: 100 devices/minute (parallel LLDP neighbour queries). 5,000 devices: 50 minutes. Topology accuracy: 95% (LLDP provides exact physical link endpoints). NETCONF Capability Exchange (stage 2): After LLDP discovery provides IP and device identity, NMS opens NETCONF sessions and exchanges hello messages. Device sends: list of supported YANG modules, revisions, and features. Per-device: 2 seconds (hello + capability parsing). 5,000 devices with 50 parallel sessions: 200 seconds (3.3 minutes). Full YANG capability map built. Hybrid Automated Discovery (Recommended): Stage 1 LLDP (50 minutes) → Stage 2 NETCONF capability exchange (3.3 minutes) → Stage 3 interface inventory via NETCONF get (10 minutes). Total: 63 minutes — 87% faster than the 8-hour constraint. Topology accuracy: 95%. YANG capabilities: 100%.",
    explanation: [
      { term: "Manual Seed + SNMP Scan", meaning: "Operator enters 5,000 IPs manually; SNMP scans each. WHY REJECTED: 8.3 hours — marginally exceeds the 8-hour constraint. Manual IP entry for 5,000 devices: 4 hours of data entry alone. Topology accuracy 60% — insufficient for fault correlation. No YANG capabilities discovered. WHEN ADOPTED: Legacy NMS environments where devices do not support LLDP or NETCONF — SNMP is the only available protocol for discovery." },
      { term: "LLDP/CDP Topology Discovery (Stage 1 — Recommended)", meaning: "Seeds 50 core nodes, then cascades via LLDP neighbour queries. 5,000 devices in 50 minutes. Topology accuracy: 95%. WHY BEST FOR STAGE 1: 50 manual seeds (10 minutes) vs 5,000 manual IPs (4 hours). Discovery is automatic — engineers monitor progress, not perform data entry. All link endpoints discovered accurately via LLDP-MIB neighbour tables." },
      { term: "NETCONF Capability Exchange (Stage 2 — Recommended)", meaning: "After LLDP provides device identity and management IP, NETCONF hello exchange provides the full YANG capability list. 3.3 minutes for 5,000 devices with 50 parallel sessions. WHY ESSENTIAL: Without YANG capability discovery, the NMS cannot know which models to use for configuration and state retrieval per device — it must resort to CLI screen-scraping or proprietary APIs." },
      { term: "Hybrid Automated Discovery (Recommended — Full)", meaning: "LLDP stage 1 → NETCONF stage 2 → interface inventory stage 3. Total: 63 minutes. Topology accuracy: 95%. YANG capabilities: 100%. Interface inventory: complete. WHY BEST OVERALL: Completes all discovery goals in 63 minutes — 87% faster than the 8-hour constraint, leaving 7 hours for validation and topology review. The 3-stage hybrid is the standard approach in Nokia NetAct, Ericsson ENM, and Cisco NSO initial deployment." }
    ],
    advantages: [
      "LLDP cascade discovery from 50 seeds reaches all 5,000 elements automatically — eliminating 4 hours of manual IP entry while achieving 95% topology accuracy",
      "NETCONF capability exchange provides a machine-readable YANG capability map per device — the NMS automatically selects the correct models without per-vendor hard-coding",
      "Hybrid 3-stage discovery completes in 63 minutes vs the 8-hour manual alternative — freeing the shift for topology validation and initial performance baseline collection"
    ],
    limitations: [
      "Manual SNMP discovery is adopted for legacy devices that do not support LLDP or NETCONF — these devices must be seeded manually and their topology links inferred from configuration data",
      "LLDP-only discovery is adopted as a standalone mechanism in pure transport networks where NETCONF is not yet deployed — topology is accurate but YANG capabilities are unknown",
      "Manual seed + SNMP is adopted for greenfield sites where no prior topology data exists and the network is being built element-by-element — each element is added to the NMS manually as it is commissioned"
    ]
  },,
  activities: {
    level1: "List the five discovery methods used by NMS platforms (SNMP walk, ICMP ping sweep, CDP neighbour discovery, LLDP neighbour discovery, NETCONF capability exchange). For each method, state: (a) the protocol used, (b) what information it retrieves, and (c) which type of device it works best with.",
    level2: "Design a discovery workflow for a three-tier enterprise network (core, distribution, access) with 200 devices. Specify: (a) the IP address ranges to scan, (b) the SNMP community strings to try, (c) the order of discovery methods, and (d) how CDP/LLDP neighbour data is used to build the topology map after device discovery.",
    level3: "An NMS scans 500 IP addresses with a hit rate of 25%. Of the discovered devices, 80% respond to SNMP and are fully inventoried. The total actual device count is 160. Calculate (a) devices found by ping, (b) devices fully inventoried via SNMP, (c) discovery coverage.",
    level4: "Implement a Python discovery script using pysnmp that: scans an IP range via ICMP ping, walks the system group (sysName, sysDescr, sysObjectID) and ifTable (ifDescr, ifType, ifOperStatus) on responding devices, then outputs a structured JSON inventory file with one object per discovered device."
  },
  projects: {
    scope: "Build a comprehensive NMS discovery simulator that models a 50-node network, simulates discovery using three methods (SNMP, ICMP, LLDP), and produces a complete network inventory and topology map.",
    objectives: [
      "Model a 50-node network with configurable SNMP community strings, ICMP reachability, and LLDP neighbour relationships",
      "Implement three discovery phases: ICMP ping sweep, SNMP walk (system group + ifTable), and LLDP neighbour-based topology construction",
      "Generate a network inventory JSON file and a topology adjacency list, then calculate and report discovery coverage"
    ],
    deliverables: [
      "Python discovery simulator with configurable network model and three-phase discovery engine",
      "Network inventory JSON output: per-device sysName, sysDescr, interfaces, management IP, discovery method",
      "Topology map output: adjacency list showing device-to-device connections with interface-level detail, and discovery coverage report"
    ]
  },
  questions: [
    {
      q: "What is NMS discovery and why must it be completed before fault management can begin?",
      a: "NMS discovery is the automated process of finding all network devices, their interfaces, their capabilities, and their connectivity relationships, and recording this information in the NMS inventory database (CMDB). It must be completed before fault management because: (1) Alarm routing — when an SNMP trap arrives, the NMS must know which device sent it (map IP to device object in CMDB) to associate the alarm with the correct managed object. (2) Fault correlation — the correlation engine requires a topology graph showing which devices are upstream/downstream of each other; this graph is built from discovery data. (3) Root cause analysis — RCA traverses the dependency graph from victim alarms to root cause; without discovery data, there is no graph to traverse. (4) Impact analysis — the NMS cannot calculate which services are affected by a failure if it does not know which devices and interfaces support which services. In short, the CMDB populated by discovery is the foundation on which all NMS intelligence functions — fault, performance, configuration, and security management — depend.",
      type: "Conceptual"
    },
    {
      q: "Compare LLDP-based and CDP-based neighbour discovery. Why is LLDP preferred in multi-vendor networks?",
      a: "CDP (Cisco Discovery Protocol) is a Layer 2 protocol proprietary to Cisco. It allows Cisco devices to advertise their identity, capabilities, IP addresses, and directly connected interface information to neighbours. Only Cisco devices (and a few that implement CDP compatibility) participate. In a multi-vendor network with Juniper, Huawei, Nokia, and Cisco devices, only the Cisco devices exchange CDP information — the others are invisible to CDP. LLDP (Link Layer Discovery Protocol, IEEE 802.1AB) is an open standard supported by all major vendors. It uses the same concept — devices broadcast TLVs (Type-Length-Value) containing chassis ID, port ID, system name, capabilities, and management address — but since it is standardised, all IEEE 802.1AB-compliant devices participate. This allows the NMS to build a complete multi-vendor topology map from LLDP data alone. In a mixed Cisco/Juniper/Huawei network, enabling LLDP globally on all devices and querying the LLDP-MIB (1.0.8802.1.1.2) allows the NMS to map every physical connection in the network regardless of vendor.",
      type: "Conceptual"
    },
    {
      q: "An NMS scans 300 IPs. Hit rate is 20%. Of those found, 85% are SNMP-reachable. Total actual devices = 70. Calculate discovery coverage.",
      a: "Devices found by ICMP ping: 300 × 20/100 = 60 devices. Devices fully inventoried via SNMP: 60 × 85/100 = 51 devices. Discovery coverage: C_disc = D_found / D_total × 100 = 51 / 70 × 100 = 72.9%. This means 27.1% of the actual devices are not in the NMS inventory, likely because they either did not respond to ICMP (firewalled, ICMP disabled) or responded to ping but had SNMP disabled or used a different community string. To improve coverage, the NMS operator should: review ACL rules blocking ICMP or SNMP, ensure consistent SNMP community string configuration, and add undiscovered IP ranges to the scan profile.",
      type: "Numerical"
    },
    {
      q: "What SNMP MIB objects are queried during device discovery and what information does each provide?",
      a: "During SNMP-based discovery, the NMS walks the following key MIB objects: sysDescr (1.3.6.1.2.1.1.1.0) — a text description of the device hardware and software, e.g., 'Cisco IOS Software, Version 15.4'. sysObjectID (1.3.6.1.2.1.1.2.0) — the vendor's enterprise OID that uniquely identifies the device type; used to select the correct device template and MIB set. sysName (1.3.6.1.2.1.1.5.0) — the administratively assigned hostname. sysLocation (1.3.6.1.2.1.1.6.0) — physical location string. ifDescr (1.3.6.1.2.1.2.2.1.2) — interface description for each interface. ifType (1.3.6.1.2.1.2.2.1.3) — interface type (ethernetCsmacd=6, softwareLoopback=24, etc.). ifOperStatus (1.3.6.1.2.1.2.2.1.8) — current operational state (up=1, down=2, testing=3). ifSpeed (1.3.6.1.2.1.2.2.1.5) — interface bandwidth in bits per second. Together, these objects give the NMS the device identity, capabilities, and interface inventory needed to populate the CMDB and begin monitoring.",
      type: "Conceptual"
    },
    {
      q: "How should an NMS handle discovery of devices it cannot fully manage — for example, devices that respond to ICMP but not SNMP?",
      a: "Devices that respond to ICMP but not SNMP should be added to the NMS inventory in a partial or 'unmanaged' state rather than excluded entirely. This matters for several reasons: (1) Availability monitoring — even without SNMP, the NMS can monitor the device's reachability via ICMP ping and alert when it becomes unreachable. This provides a basic fault detection capability. (2) Topology completeness — an ICMP-only device may appear in LLDP neighbour tables of its SNMP-managed neighbours. Including it in the topology graph prevents false gaps in connectivity maps. (3) Audit and compliance — the NMS inventory should reflect all network devices, not just those fully managed. An unmanaged device is a security gap that should be tracked and remediated. The NMS should flag ICMP-only devices with a status of 'Partial Coverage' and generate a management-gap alert prompting the network team to enable SNMP on those devices. Discovery policy should be configurable: include-all (add all responsive devices) vs. managed-only (exclude devices without full SNMP access).",
      type: "Analytical"
    }
  ],
  virtualLab: {
    description: "Vary NE count and discovery rate (devices/minute) to observe total discovery time. Compare manual SNMP (10 dev/min) vs LLDP cascade (100 dev/min) vs hybrid parallel (500 dev/min) strategies. The 8-hour (480-minute) target is the constraint.",
    interpretation: "At 5,000 NEs with SNMP at 10 devices/minute, discovery takes 500 minutes — exceeding the 8-hour (480-minute) window. LLDP cascade at 100 devices/minute completes in 50 minutes. Hybrid parallel at 500 devices/minute: 10 minutes. As the network grows to 10,000 NEs, only hybrid parallel stays under the 8-hour window. This illustrates why parallel discovery with NETCONF sessions is the design choice for large-scale NMS deployments.",
    parameters: [
      { id: "nes", name: "Network Elements", min: 100, max: 10000, default: 1000, step: 100, unit: "" },
      { id: "rate", name: "Discovery Rate (NE/min)", min: 10, max: 500, default: 100, step: 10, unit: "" }
    ],
    generateData: (params) => {
      const maxNes = params.nes || 1000;
      const rate = params.rate || 100;
      const pts: Array<{ x: number; y: number }> = [];
      for (let n = 100; n <= maxNes; n += 100) {
        pts.push({ x: n, y: parseFloat((n / rate).toFixed(2)) });
      }
      return pts;
    },
    labels: { x: "Network Elements", y: "Discovery Time (min)" }
  }
};
