import type { TopicData } from './types';

import { topic1Data } from './topic1';
import { topic2Data } from './topic2';
import { topic3Data } from './topic3';
import { topic4Data } from './topic4';
import { topic5Data } from './topic5';
import { topic6Data } from './topic6';
import { topic7Data } from './topic7';
import { topic8Data } from './topic8';
import { topic9Data } from './topic9';
import { topic10Data } from './topic10';
import { topic11Data } from './topic11';
import { topic12Data } from './topic12';
import { topic13Data } from './topic13';
import { topic14Data } from './topic14';
import { topic15Data } from './topic15';
import { topic16Data } from './topic16';
import { topic17Data } from './topic17';
import { topic18Data } from './topic18';
import { topic19Data } from './topic19';
import { topic20Data } from './topic20';
import { topic21Data } from './topic21';
import { topic22Data } from './topic22';
import { topic23Data } from './topic23';
import { topic24Data } from './topic24';
import { topic25Data } from './topic25';
import { topic26Data } from './topic26';
import { topic27Data } from './topic27';
import { topic28Data } from './topic28';
import { topic29Data } from './topic29';
import { topic30Data } from './topic30';
import { topic31Data } from './topic31';
import { topic32Data } from './topic32';
import { topic33Data } from './topic33';
import { topic34Data } from './topic34';
import { topic35Data } from './topic35';
import { topic36Data } from './topic36';
import { topic37Data } from './topic37';
import { topic38Data } from './topic38';
import { topic39Data } from './topic39';
import { topic40Data } from './topic40';
import { topic41Data } from './topic41';
import { topic42Data } from './topic42';
import { topic43Data } from './topic43';
import { topic44Data } from './topic44';

export type { TopicData };

export interface CurriculumEntry {
  unit: string;
  title: string;
  topics: Array<{ id: string; name: string }>;
}

export const courseData: Record<string, Record<string, TopicData>> = {
  "1": {
    "1": topic1Data,
    "2": topic2Data,
    "3": topic3Data,
    "4": topic4Data,
    "5": topic5Data,
    "6": topic6Data,
    "7": topic7Data,
    "8": topic8Data,
    "9": topic9Data,
    "10": topic10Data,
    "11": topic11Data,
    "12": topic12Data,
  },
  "2": {
    "1": topic13Data,
    "2": topic14Data,
    "3": topic15Data,
    "4": topic16Data,
    "5": topic17Data,
    "6": topic18Data,
    "7": topic19Data,
    "8": topic20Data,
    "9": topic21Data,
    "10": topic22Data,
  },
  "3": {
    "1": topic23Data,
    "2": topic24Data,
    "3": topic25Data,
    "4": topic26Data,
    "5": topic27Data,
    "6": topic28Data,
    "7": topic29Data,
    "8": topic30Data,
    "9": topic31Data,
    "10": topic32Data,
  },
  "4": {
    "1": topic33Data,
    "2": topic34Data,
    "3": topic35Data,
    "4": topic36Data,
    "5": topic37Data,
    "6": topic38Data,
    "7": topic39Data,
    "8": topic40Data,
    "9": topic41Data,
    "10": topic42Data,
    "11": topic43Data,
    "12": topic44Data,
  },
};

const unitMeta: Record<string, string> = {
  "1": "Unit I: Introduction to Network Management and Frameworks",
  "2": "Unit II: Model-Driven Management and Protocols",
  "3": "Unit III: Alarm Lifecycle Management",
  "4": "Unit IV: SDN, Network Observability, and Advanced Network Management",
};

export const activitiesData: Record<string, { level1: string; level2: string; level3: string; level4: string }> = {
  "u1t1": {
    level1: "List and define the key components of a mobile network: UE (User Equipment), RAN (Radio Access Network), Core Network, and Management Plane. For each component, write a one-sentence description of its primary function.",
    level2: "Draw a layered diagram showing how a voice call travels from a mobile phone through the RAN (eNB), Core Network (MME, S-GW, P-GW in 4G), and out to the PSTN or another mobile subscriber. Label all interfaces.",
    level3: "Using Shannon's formula C = B × log₂(1 + SNR), calculate the maximum capacity of a 20 MHz LTE channel at SNR = 15 dB. Convert SNR from dB to linear first: SNR_linear = 10^(15/10) ≈ 31.62. Then compute C in Mbps.",
    level4: "Research the differences between 4G LTE (EPC architecture with MME, S-GW, P-GW, HSS) and 5G NR (5GC architecture with AMF, SMF, UPF, and service-based interfaces). Write a comparison report covering architecture, latency targets, spectrum bands, and management implications.",
  },
  "u1t2": {
    level1: "Draw the 5-layer TMN pyramid and label each layer (BML, NML, EML, NEL, QAL) with its primary function, a real-world example system, and the interface it uses to communicate with adjacent layers.",
    level2: "Map the five FCAPS functions (Fault, Configuration, Accounting, Performance, Security Management) to the appropriate TMN layers and identify which eTOM process area each belongs to (OPS, SIP, or EM).",
    level3: "Calculate the management overhead M for 200 network elements, EMS concurrency of 20, and a poll time of 5 seconds per element. If you need to reduce M to under 60 seconds, what concurrency value is required?",
    level4: "Research how a real operator-grade OSS product (e.g., Ericsson OSS-RC / ENM, Nokia NetAct, or Huawei U2000) implements the eTOM framework. Identify which eTOM process groups are supported and write a one-page summary.",
  },
  "u1t3": {
    level1: "Define the following management systems and draw the four-tier management hierarchy diagram: NE (Network Element), EMS (Element Management System), NMS (Network Management System), OSS (Operations Support System), BSS (Business Support System). Label the interfaces between each tier.",
    level2: "Explain the role of the Northbound Interface (NBI) and Southbound Interface (SBI) in NMS architecture. For each interface, state: (a) which systems it connects, (b) the protocols commonly used (REST, SNMP, NETCONF, CORBA), and (c) what data flows across it.",
    level3: "Given 5 EMS domains each generating 80 raw alarms in a 15-minute window, and the NMS correlates these into 60 root-cause alarms, calculate R_agg. Interpret the result: is this a good aggregation ratio?",
    level4: "Research a commercial NMS product — Nokia NetAct, Ericsson ENM (Evolved Network Manager), or Huawei U2000 — and document its architecture. Identify: how many EMS domains it supports, what NBIs it exposes, and how it implements alarm correlation.",
  },
  "u1t4": {
    level1: "Define each letter in FCAPS — Fault, Configuration, Accounting, Performance, Security Management — and give one concrete real-world example of each from a mobile network operator's daily operations (e.g., which NMS screen or tool is used for each).",
    level2: "Map each FCAPS function to a specific NMS module, tool, or system. For example: Fault → alarm management/ticketing system; Configuration → CMDB and NETCONF provisioning; Accounting → CDR mediation and billing; Performance → KPI dashboard; Security → RBAC and AAA server. Explain the data flow for each mapping.",
    level3: "Calculate network availability for MTBF = 5000 hours and MTTR = 2 hours. Express the answer as a percentage to 4 decimal places. Then determine the maximum MTTR in minutes that would achieve 99.999% availability given MTBF = 5000 hours. Show your algebraic working.",
    level4: "Design a complete FCAPS management plan for a university campus network with 50 access switches, 5 distribution routers, and a 1 Gbps internet uplink. For each FCAPS function, specify: KPIs to monitor, tools to use, escalation procedure, and an automation rule (if applicable).",
  },
  "u1t5": {
    level1: "Draw an NMS architecture diagram clearly labelling the SBI and NBI. On the SBI, annotate at least three protocols (e.g., SNMP, NETCONF, gNMI). On the NBI, annotate at least two protocols (e.g., REST/HTTPS, TMF OpenAPI). Show the direction of communication — which interface goes toward devices and which goes toward OSS/BSS.",
    level2: "Compare SNMP (SBI) and a REST API (NBI) across four dimensions: data model (MIB OID tree vs JSON schema), security (community string vs OAuth2/TLS), real-time capability (polling vs streaming), and primary consumer (NMS internal vs external OSS application). Present your comparison as a structured table.",
    level3: "Calculate the poll cycle time T_poll for 500 managed devices, an average PDU size of 800 bytes, and an SBI bandwidth of 2 Mbps (= 250,000 bytes/s). Determine whether this fits within a 15-minute monitoring interval. If not, what minimum bandwidth is needed?",
    level4: "Design a NBI REST API for an NMS with exactly three endpoints: GET /alarms (returns active alarms with severity and source), GET /topology (returns network graph with nodes and links), and POST /config (pushes a configuration change to a device via the NMS). For each endpoint, define the HTTP method, URL, request parameters, and a sample JSON response body.",
  },
  "u1t6": {
    level1: "List the three versions of SNMP (v1, v2c, v3) and for each version state: (a) the RFC that defines it, (b) the key new feature or improvement it introduced over the previous version, and (c) one security limitation that remained or was addressed.",
    level2: "Explain the MIB OID hierarchy using the full path for sysDescr: iso(1) → org(3) → dod(6) → internet(1) → mgmt(2) → mib-2(1) → system(1) → sysDescr(1) → instance(0), giving the full numeric OID as 1.3.6.1.2.1.1.1.0. Describe what sysDescr contains and why the .0 suffix is required for scalar objects.",
    level3: "Calculate the SNMP overhead fraction O_snmp for a network with N = 200 nodes, V = 15 OID variables per node, S = 250 bytes PDU size, a polling interval Δt = 60 seconds, and a management link bandwidth B = 125,000 bytes/s (1 Mbps). Express the result as a percentage and determine whether it satisfies the 5% guideline.",
    level4: "Using GNS3 or Cisco Packet Tracer, configure an SNMP community string 'public' (read-only) on a router, configure a trap receiver pointing to a simulated NMS IP address, and use the snmpget command-line tool to retrieve the sysUpTime (OID 1.3.6.1.2.1.1.3.0) from the device. Document the CLI commands used and the response received.",
  },
  "u1t7": {
    level1: "Draw a complete SNMP Manager-Agent architecture diagram. Label: (a) the NMS Manager host, (b) the network device with SNMP Agent, (c) the MIB module inside the Agent, (d) UDP port 161 (agent) and UDP port 162 (trap receiver), and (e) all five PDU types — GET, GETNEXT, GETBULK, SET, TRAP — with arrows showing the direction of each PDU.",
    level2: "Navigate the MIB-II OID tree and identify the full numeric OID path for each of these three objects: (a) sysUpTime — system uptime in hundredths of a second, (b) ifOperStatus — current operational status of an interface (up=1, down=2), (c) ipInReceives — total IP datagrams received. For each, state the MIB group it belongs to and whether it is a scalar or tabular object.",
    level3: "Calculate V_max for MTU = 1500 bytes, H_udp = 28 bytes, H_snmp = 50 bytes, S_varbind = 35 bytes. Show your working. Then recalculate for a jumbo frame MTU of 9000 bytes with the same headers and varbind size, and state the ratio of improvement.",
    level4: "Using the snmpwalk or snmpbulkwalk command-line tools (or a network simulator), retrieve the full interfaces table (ifTable, OID 1.3.6.1.2.1.2.2) from a live or simulated device. Document the full OID, data type, and value for at least five ifTable columns (ifIndex, ifDescr, ifType, ifSpeed, ifOperStatus) for two interfaces.",
  },
  "u1t8": {
    level1: "List all five SNMP PDU types (GET, GETNEXT, GETBULK, SET, RESPONSE) and for each: (a) state which side — Manager or Agent — sends it, (b) describe what data it carries, and (c) draw a simple sequence diagram showing the GET/RESPONSE exchange for retrieving sysUpTime (OID 1.3.6.1.2.1.1.3.0).",
    level2: "Trace a GETBULK request with non-repeaters = 0 and max-repetitions = 5 against a 12-row interfaces table (ifDescr column, OID 1.3.6.1.2.1.2.2.1.2). Show each PDU exchange step-by-step: which OID is requested, which 5 OIDs are returned, and how many total PDUs are needed to retrieve all 12 rows. Identify the boundary condition when the last PDU returns OIDs that fall outside the ifDescr subtree.",
    level3: "Calculate RTT_ratio for a 80-row MIB table with R = 10, then with R = 20. Show all working. State the percentage improvement when doubling max-repetitions from 10 to 20 in this specific case.",
    level4: "Using the snmpbulkwalk command-line tool, retrieve the full ifTable from a device or simulator using max-repetitions = 10, then repeat with max-repetitions = 1 (equivalent to GETNEXT). Record the total number of PDU exchanges and elapsed time for each. Compute the measured RTT_ratio and compare it with the theoretical prediction from the formula.",
  },
  "u1t9": {
    level1: "Write out the complete CLI syntax for four SNMP commands: snmpget, snmpset, snmpwalk, and snmpbulkwalk. For each command, provide an example targeting OID 1.3.6.1.2.1.1.3.0 (sysUpTime) or the ifTable (1.3.6.1.2.1.2.2) using community string 'public' against IP 10.0.0.1. Label each flag.",
    level2: "Demonstrate step-by-step how snmpwalk traverses the MIB subtree starting from 1.3.6.1.2.1.1 (system group) using successive GETNEXT operations. Show at least 5 OID-name-value triples that would be returned in order, and explain when the walk terminates.",
    level3: "Calculate T_walk and T_bulk for N = 200 MIB objects, R = 20 max-repetitions, and RTT = 3 ms per PDU. Show all working and state the speedup factor.",
    level4: "Using a GNS3 simulation or a real device, run snmpwalk and snmpbulkwalk against the same device targeting the ifTable. Record: (a) total elapsed time for each, (b) number of PDU exchanges counted in a Wireshark capture, and (c) the measured speed ratio. Compare with the theoretical ratio.",
  },
  "u1t10": {
    level1: "List the 6 standard SNMPv1 generic trap types (coldStart, warmStart, linkDown, linkUp, authenticationFailure, egpNeighborLoss) and describe the specific network event or condition that triggers each one.",
    level2: "Draw a message sequence diagram comparing a TRAP delivery (one-way, no ACK) versus an INFORM delivery (request + ACK, with retransmission on timeout). Label: sender, receiver, PDU type, ACK, timeout window, and retry.",
    level3: "Calculate the delivery probability for a single TRAP and for an INFORM with n = 2, n = 3, and n = 5 retries, given p = 0.10. Show all working and state the reliability gain of 5 retries over a single TRAP.",
    level4: "Using GNS3 or Cisco Packet Tracer, configure an SNMP trap receiver on a simulated NMS host, trigger a linkDown event by shutting a router interface, and capture the resulting TRAP PDU in Wireshark. Identify the sysUpTime.0 and snmpTrapOID.0 varbinds in the PDU decode.",
  },
  "u1t11": {
    level1: "List 5 specific limitations of SNMP MIBs (SMI) that motivated the IETF NETMOD working group to develop YANG. For each limitation, state the corresponding YANG feature that addresses it.",
    level2: "Write a minimal YANG module stub (10–15 lines) defining a container 'interface' with the following leaves: name (string), enabled (boolean), mtu (uint16, range 68..65535), and description (string, optional). Include a module header with namespace and prefix.",
    level3: "Calculate the YANG expressiveness ratio E for: T_YANG = 18, C_YANG = 10, T_SMI = 8, C_SMI = 2. Then recalculate assuming YANG 1.1 added 3 more constraint constructs. State the change in E.",
    level4: "Research the YANG evolution timeline: SMI/MIBs (1990) → SPPI (2002) → NETCONF (2006, RFC 4741) → YANG 1.0 (2010, RFC 6020) → YANG 1.1 (2016, RFC 7950). For each milestone, write 2-3 sentences on the key problem it solved and the standards body responsible.",
  },
  "u1t12": {
    level1: "List 5 specific technical limitations of SNMP and pair each with a concrete operator requirement it fails to meet. Present your answer as a table with columns: Limitation | Technical Detail | Operator Requirement Violated.",
    level2: "Explain the 'partial configuration' problem in SNMP using a concrete example: configuring BGP peering on a router requires 8 SET operations (AS number, neighbor IP, route policy, timers, etc.). Describe what happens if operation 5 fails, and contrast this with how NETCONF's candidate datastore + commit solves the problem.",
    level3: "Calculate P_fail for k = 5 steps at p = 0.03. Then for k = 15 steps at the same p. Calculate the ratio of risks. What does this tell you about the safety of applying large configuration changes via SNMP compared to small ones?",
    level4: "Read RFC 3535 Section 2 ('Operator Requirements'). Identify and summarise the top 5 operator requirements listed. For each requirement, identify whether it is addressed by NETCONF, YANG, SNMPv3, or remains unaddressed.",
  },
  "u2t1": {
    level1: "Define the following terms in your own words with a one-sentence example each: Model-Driven Management (MDM), YANG, NETCONF, RESTCONF. Identify which component is the data model, which is the transport protocol, and which is the management interface.",
    level2: "Draw a workflow comparison table for CLI-based vs Model-Driven configuration of a single interface. The table should show: how configuration is generated, how it is validated, how it is sent to the device, what happens on failure, and how the change is audited. Identify at least three operational advantages of the MDM workflow.",
    level3: "Calculate T_val for a configuration change with N_nodes = 200 YANG tree nodes (T_parse = 0.5 ms each) and N_constraints = 15 XPath constraints (T_check = 2 ms each). Show all working. Then determine the maximum number of constraints that can be evaluated within a 200 ms validation budget given the same node count.",
    level4: "Install pyang (pip install pyang) and obtain the ietf-interfaces YANG module (RFC 7223). Run: pyang --format tree ietf-interfaces.yang and capture the output. Then introduce a deliberate error (change a type from uint32 to an invalid type name) and run pyang validation again. Document the error message pyang produces and explain what it means.",
  },
  "u2t2": {
    level1: "Identify and define the five core YANG statement types with a real networking example for each: module (e.g., ietf-interfaces), container (e.g., interfaces grouping), list (e.g., interface list keyed by name), leaf (e.g., mtu as uint16), and leaf-list (e.g., dns-server as a list of IP addresses). State whether each construct can appear multiple times in a module.",
    level2: "Write a YANG snippet (15-20 lines) for a simple interface model: a container named 'interfaces' containing a list named 'interface' keyed by leaf 'name' (string), with additional leafs: 'enabled' (boolean, default true), 'mtu' (uint16, range 68..65535), and 'description' (string). Label each statement type and explain the role of the key statement.",
    level3: "Calculate the total node count for a YANG tree with branching factor b = 4 and depth L = 3. Show the calculation using the geometric series formula. Then determine which is larger: a tree with b = 2, L = 6 or b = 6, L = 2.",
    level4: "Download the ietf-interfaces YANG module (RFC 7223) from https://tools.ietf.org/html/rfc7223. Run pyang --format tree to display the full tree. Count: (a) the number of list nodes, (b) the number of config false leafs (operational state), (c) the maximum nesting depth. Verify your tree-node count estimate against the formula.",
  },
  "u2t3": {
    level1: "Define each advanced YANG construct in one sentence with a concrete networking example: typedef (e.g., VlanId type), grouping (e.g., interface-counters group), uses (referencing a grouping), augment (e.g., adding vendor leaf to ietf-interfaces), deviation (e.g., marking unsupported feature), rpc (e.g., clear-interface-counters), notification (e.g., link-state-change event).",
    level2: "Write a YANG grouping called 'interface-statistics' containing three leafs: in-octets (uint64, config false), out-octets (uint64, config false), and error-count (uint32, config false). Then show how to use this grouping inside two different containers: 'physical-interface' and 'logical-interface'. Calculate the R_reuse for S=3 leafs, U=2 usages.",
    level3: "For a YANG model where S = 8 shared leafs are used in U = 10 places: calculate (a) L_without_grouping, (b) L_with_grouping, (c) R_reuse as a percentage. Then find the minimum number of usages U_min at which R_reuse first exceeds 50% for S = 8.",
    level4: "Write a YANG RPC called 'reset-interface' with input leaf 'interface-name' (string, mandatory true) and output leaf 'status' (enumeration with values: success, failed, not-found). Verify with pyang. Then write a corresponding NETCONF XML RPC request message invoking this RPC with interface-name = 'GigabitEthernet0/0'.",
  },
  "u2t4": {
    level1: "List all three NETCONF datastores (running, candidate, startup), state which RFC introduced them, and describe when each is read and when each is written. Identify which capability string must appear in the hello message for candidate and startup datastores to be available.",
    level2: "Trace a complete NETCONF configuration workflow for changing an interface IP address: (1) open SSH session on port 830, (2) hello capability exchange, (3) lock candidate datastore, (4) edit-config on candidate, (5) validate, (6) commit, (7) unlock. Draw a sequence diagram showing the XML message exchange at each step.",
    level3: "Calculate T_nc for S_xml = 25 KB, B_ssh = 512 kbps, RTT = 10 ms. Then find the maximum XML payload size that keeps T_nc below 100 ms for B_ssh = 2000 kbps and RTT = 5 ms.",
    level4: "Using netconf-console or ncclient Python library, connect to a NETCONF simulator (e.g., netsim or OpenWRT with NETCONF), exchange hello messages, retrieve the running datastore with get-config, and display the received XML. Measure the actual round-trip time and compare it to the theoretical T_nc.",
  },
  "u2t5": {
    level1: "List all NETCONF RPCs defined in RFC 6241 and their purpose in one line each: get, get-config, edit-config, copy-config, delete-config, lock, unlock, commit, discard-changes, validate, close-session, kill-session. Identify which require the :candidate capability to be useful.",
    level2: "Trace a complete edit-config → commit → validate flow for adding a new static route to a device. Write the XML for each step: (a) lock candidate, (b) edit-config with merge operation adding a route entry, (c) validate candidate, (d) commit, (e) unlock. Identify the message-id in each request and the expected rpc-reply.",
    level3: "A device has 80 total config nodes. An NMS change modifies 8 nodes. Calculate: (a) the replace/merge traffic ratio, (b) the Delta_config (net new nodes), (c) the minimum changed-node fraction at which replace becomes less than 2× overhead of merge.",
    level4: "Use ncclient Python library (pip install ncclient) to connect to a NETCONF simulator. Run get-config with a subtree filter to retrieve only the interfaces container. Then use edit-config with merge to change the description of one interface. Verify the change with a second get-config. Print the XML request and response for each operation.",
  },
  "u2t6": {
    level1: "Map each RESTCONF HTTP method to its NETCONF RPC equivalent: GET ↔ get/get-config, PUT ↔ edit-config replace, POST ↔ edit-config create, PATCH ↔ edit-config merge, DELETE ↔ edit-config delete. For each pair, state one key difference in behaviour or capability.",
    level2: "Given a YANG module 'ietf-interfaces' with prefix 'if', write the RESTCONF URLs for: (a) listing all interfaces, (b) retrieving the interface named 'GigabitEthernet0/0', (c) creating a new interface named 'Loopback0', (d) deleting interface 'Loopback0'. Identify the HTTP method and expected HTTP status code for each.",
    level3: "An NMS must configure 240 devices in a 2-minute window using RESTCONF, sending 3 operations per device. Calculate the required R_api. If each device responds in 50 ms, what is the minimum parallelism P (concurrent requests) required to achieve this rate?",
    level4: "Using Postman or curl, connect to a RESTCONF-enabled device or sandbox (e.g., Cisco DevNet Always-On Sandbox). Send a GET request to /restconf/data/ietf-interfaces:interfaces with Accept: application/yang-data+json. Then send a PATCH request to change one interface's description. Capture and display the JSON response and HTTP status codes.",
  },
  "u2t7": {
    level1: "List and define the six alarm severity levels as specified in ITU-T X.733: Critical, Major, Minor, Warning, Indeterminate, and Cleared. For each severity level, give one concrete network example (e.g., Critical → core router unreachable) and state the expected operator response time target.",
    level2: "Draw a complete alarm lifecycle diagram showing the three states — Raised, Acknowledged, and Cleared — with labelled transitions. Include the events that trigger each transition: initial fault detection (Raised), operator acknowledgement action (Acknowledged), and condition clearing or manual closure (Cleared). Annotate each state with the data fields that change.",
    level3: "A network generates the following alarm counts in successive 10-second windows: 8, 12, 45, 310, 280, 15, 6. Using λ_storm = N_alarms / Δt, calculate the alarm arrival rate for each window. Identify which windows exceed a storm threshold of 20 alarms/second and state what actions the NMS should take.",
    level4: "Design alarm correlation rules for a scenario where a core switch (SW-CORE-01) fails and causes downstream alarms on 8 attached access switches. Specify: (a) the topological parent–child relationship used for correlation, (b) the temporal window within which co-occurring alarms are grouped, (c) the suppressed secondary alarms, (d) the single root-cause alarm raised to the operator, and (e) the clearing sequence when SW-CORE-01 recovers.",
  },
  "u2t8": {
    level1: "Define the following terms with a one-paragraph explanation each: (a) SDN — Software-Defined Networking, (b) NFV — Network Function Virtualization, (c) VNF — Virtual Network Function, (d) VxLAN — Virtual Extensible LAN, (e) VIM — Virtualized Infrastructure Manager. For each term, identify one real-world vendor or open-source implementation.",
    level2: "Draw the ETSI NFV MANO reference architecture showing the three functional blocks — NFVO (NFV Orchestrator), VNFM (VNF Manager), and VIM (Virtualized Infrastructure Manager) — along with the NE layer (VNFs and NFVI). Label all reference points (Os-Ma, Ve-Vnfm, Vi-Vnfm, Nf-Vi, Or-Vi) and briefly describe the function of each reference point.",
    level3: "A server has 100 normalised capacity units. It hosts VNFs with the following resource allocations: VNF-A = 20, VNF-B = 15, VNF-C = 25, VNF-D = 18. Calculate: (a) total resource consumption, (b) server utilisation efficiency η, (c) remaining capacity available for an additional VNF, (d) the maximum number of additional VNF-B-sized instances that can be added.",
    level4: "Design a VNF lifecycle management workflow for deploying a virtual Firewall VNF on an NFV platform. Specify: (a) the NFVO API calls to create a Network Service Descriptor and VNF Descriptor, (b) the VIM API calls (OpenStack) to allocate compute, network, and storage resources, (c) the VNFM operations to instantiate, configure, health-check, scale-out, and terminate the VNF, and (d) how the NMS/EMS integrates with the VNFM to reflect the VNF's operational state.",
  },
  "u2t9": {
    level1: "Map each HTTP method used in RESTCONF to its NETCONF equivalent and the corresponding YANG data operation. Create a table with columns: HTTP Method, RESTCONF Semantics, NETCONF Equivalent, YANG Operation (create/replace/merge/delete). Include all five methods: GET, POST, PUT, PATCH, DELETE. Provide a concrete example URL and body for each method targeting the ietf-interfaces YANG module.",
    level2: "Given the following YANG module snippet for ietf-interfaces, construct the complete RESTCONF URLs for five operations: (a) GET all interfaces, (b) GET the configuration of interface 'eth0', (c) POST to create a new interface 'eth1' with IP 10.0.1.1/24, (d) PATCH to change the MTU of 'eth0' to 9000, (e) DELETE interface 'eth1'. Show the required HTTP headers (Content-Type, Accept) and request body for operations (c) and (d).",
    level3: "Calculate the JSON and XML payload sizes for a YANG response containing 30 fields with an average field name length of 10 characters and an average value length of 8 characters. Use the formula: S_xml = fields × (2×avgLen + 15 + valueLen) and S_json = fields × (avgLen + 8 + valueLen). Compute the encoding ratio ρ and state the percentage saving achieved by RESTCONF's JSON encoding over NETCONF's XML.",
    level4: "Write a Python script using the requests library that performs the following RESTCONF operations against a Cisco IOS-XE device (or a YANG-capable simulator): (a) GET the YANG library to discover supported modules, (b) GET all interfaces and parse the JSON response to print interface names and operational status, (c) PATCH the description field of one interface, (d) verify the change with a subsequent GET. Include error handling for HTTP 404 and 409 responses.",
  },
  "u2t10": {
    level1: "Install Postman and configure a new RESTCONF request from scratch. Document each step: (a) create a new Collection named 'RESTCONF Lab', (b) add a GET request with URL https://{{device_ip}}/restconf/data/ietf-interfaces:interfaces, (c) configure the Authorization tab with Basic Auth credentials, (d) add Accept: application/yang-data+json and Content-Type: application/yang-data+json headers, (e) create a Postman Environment with variables device_ip, username, and password. Screenshot or describe the configuration of each panel.",
    level2: "Using the configured Postman collection, send a GET request to /restconf/data/ietf-interfaces:interfaces and examine the full response. Document: (a) the HTTP status code returned, (b) the response headers including Content-Type, (c) the structure of the JSON response body — identify the top-level YANG module namespace prefix, the interface list array, and at least 5 leaf fields per interface entry, (d) how the JSON structure maps to the ietf-interfaces YANG model hierarchy.",
    level3: "Your Postman collection contains 12 tested endpoints out of a device's 25 total RESTCONF endpoints. Calculate the current API coverage C_api. Then determine how many additional endpoints must be tested to reach (a) 60% coverage, (b) 80% coverage (the production gate), and (c) 100% coverage. Show all calculations.",
    level4: "Build a complete Postman collection with exactly 5 RESTCONF operations targeting the ietf-interfaces YANG model: (a) GET all interfaces, (b) GET a specific interface by name, (c) POST to create a new loopback interface with a description and IP address in the JSON body, (d) PATCH to modify the description of an existing interface, (e) DELETE the loopback interface created in step (c). For each request document the URL, HTTP method, required headers, request body (if applicable), and expected HTTP status code in the response.",
  },
  "u3t1": {
    level1: "List five types of secondary alarms that a single core router failure would generate in a typical enterprise network. For each, identify which directly connected device or protocol would raise the alarm and explain why it is a secondary (symptomatic) alarm rather than the root cause.",
    level2: "Draw a network topology with one core switch connected to four edge routers, each with two downstream hosts. A failure of the core switch generates alarms from all four routers and eight hosts. Group these alarms into a single correlated alarm tree, identifying the root-cause alarm at the top and all secondary alarms beneath it with their dependency relationships.",
    level3: "A network experiences an alarm storm: 150 raw alarms arrive in 45 seconds. The correlation engine has an efficiency of 75%. Calculate (a) the number of correlated alarm groups, (b) the correlation ratio, and (c) the percentage reduction in alarms presented to the operator.",
    level4: "Design a correlation rule set for a three-tier network (core, distribution, access). Define at least four ECA (event-condition-action) rules that handle: (a) core link failure cascading to distribution layer, (b) distribution switch failure cascading to access, (c) OSPF neighbour-down caused by interface failure, and (d) BGP session drop caused by IGP route withdrawal. Specify the topology condition and time window for each rule.",
  },
  "u3t2": {
    level1: "Define the four components of a confusion matrix (TP, TN, FP, FN) in the context of RCA, and give a real-world example of each. For example, what does a False Positive mean operationally — which engineer is dispatched to which device, and what do they find when they arrive?",
    level2: "Construct a topology dependency graph for a three-tier network (core, distribution, access) where a distribution switch fails. Trace the RCA algorithm's steps: (1) list all alarming devices, (2) traverse the dependency graph upward from each alarm, (3) identify the common upstream node, and (4) state the root-cause alarm with supporting evidence.",
    level3: "An RCA engine produces the following results over 500 test incidents: TP=380, TN=85, FP=25, FN=10. Calculate (a) accuracy, (b) precision, (c) recall, and (d) F1-score. Identify the most pressing weakness and suggest one specific improvement.",
    level4: "Design a codebook with five fault signatures for a campus network. Each signature should include: alarm pattern (list of alarm types and their source devices), topology condition (e.g., all source devices connected to same switch), temporal condition (all alarms within N seconds), and the mapped root cause with confidence score.",
  },
  "u3t3": {
    level1: "List the four types of alarm suppression mechanisms (parent, flap, time-based, storm) and for each provide: (a) a definition, (b) the specific network scenario it addresses, and (c) an example alarm type that would be suppressed by each mechanism.",
    level2: "A core router fails and generates 80 secondary alarms from 15 downstream devices. Design a parent suppression rule that: (a) defines the parent alarm (type, source, severity), (b) defines the child alarm criteria (which device types and alarm types qualify as children), (c) specifies the time window, and (d) handles the case where a child device has an independent unrelated alarm active at the same time.",
    level3: "During a one-hour monitoring window, an NMS receives 450 alarms. 320 are suppressed as secondary correlations. 30 are suppressed by flap detection. 20 are suppressed in a maintenance window. Calculate (a) total suppressed, (b) total visible to operator, and (c) overall suppression effectiveness.",
    level4: "Design a complete alarm suppression policy for a mobile core network that includes: parent suppression for RAN site failures, flap suppression for backhaul links with a configurable bounce threshold, maintenance window suppression integrated with a change management system, and storm suppression with an escalation procedure that alerts duty managers when storm suppression activates.",
  },
  "u3t4": {
    level1: "List the five discovery methods used by NMS platforms (SNMP walk, ICMP ping sweep, CDP neighbour discovery, LLDP neighbour discovery, NETCONF capability exchange). For each method, state: (a) the protocol used, (b) what information it retrieves, and (c) which type of device it works best with.",
    level2: "Design a discovery workflow for a three-tier enterprise network (core, distribution, access) with 200 devices. Specify: (a) the IP address ranges to scan, (b) the SNMP community strings to try, (c) the order of discovery methods, and (d) how CDP/LLDP neighbour data is used to build the topology map after device discovery.",
    level3: "An NMS scans 500 IP addresses with a hit rate of 25%. Of the discovered devices, 80% respond to SNMP and are fully inventoried. The total actual device count is 160. Calculate (a) devices found by ping, (b) devices fully inventoried via SNMP, (c) discovery coverage.",
    level4: "Implement a Python discovery script using pysnmp that: scans an IP range via ICMP ping, walks the system group (sysName, sysDescr, sysObjectID) and ifTable (ifDescr, ifType, ifOperStatus) on responding devices, then outputs a structured JSON inventory file with one object per discovered device.",
  },
  "u3t5": {
    level1: "List the three TMF OpenAPI standards used for NMS NBI (TMF642, TMF628, TMF639). For each, state: (a) what management domain it covers, (b) the primary data objects it exposes, and (c) two example REST endpoint operations.",
    level2: "Design the NBI architecture for an NMS that must serve four OSS consumers: a ServiceNow ticketing system, a Grafana analytics dashboard, a customer self-service portal, and a network planning tool. For each consumer, specify: the data it needs, the appropriate NBI API (TMF number), the authentication method, and whether push (webhook) or pull (polling) notifications are appropriate.",
    level3: "An NMS NBI serves 8 OSS consumers. Each consumer polls 3 API endpoints per second. Average response size is 15 KB. Calculate (a) total API call rate, (b) total NBI throughput in KB/s, and (c) total throughput in MB/min.",
    level4: "Design a complete NBI security architecture including: OAuth 2.0 token-based authentication flow (client credentials grant), role-based access control (read-only vs read-write roles with specific endpoint permissions), TLS 1.3 encryption, rate limiting policy (per-client and global), and audit logging requirements for compliance.",
  },
  "u3t6": {
    level1: "Draw a block diagram of the FM NBI flow with all five stages: NE, EMS (SBI), NMS Fault Management, NMS NBI, and OSS Ticketing. For each stage, label: the protocol used (SNMP/NETCONF/REST), the direction of data flow (push vs pull), the data format (trap/JSON/XML), and the typical latency.",
    level2: "For a mobile network, describe how an LTE eNodeB hardware failure flows through the FM NBI pipeline. Specify: (a) what fault the eNB detects and what trap it sends, (b) how the EMS processes and normalises it, (c) how the NMS correlates it with alarms from adjacent cells, (d) what the NBI alarm JSON payload looks like (write a sample JSON object), and (e) how the OSS creates a P1 incident ticket.",
    level3: "An FM NBI flow has latencies: L_ne = 1.5 s, L_ems = 4 s, L_nms = 8 s, L_nbi = 2.5 s. Calculate: (a) L_e2e, (b) which stage is the bottleneck, (c) if NMS latency is halved by optimising the correlation rules, what is the new L_e2e and improvement percentage.",
    level4: "Design a high-availability FM NBI flow architecture that handles NMS unavailability. Specify: (a) how the EMS buffers alarms during NMS downtime (circular buffer vs persistent queue), (b) maximum buffer duration before alarms are dropped, (c) alarm replay protocol when NMS recovers, and (d) how the NBI guarantees at-least-once delivery to the OSS for Critical alarms.",
  },
  "u3t7": {
    level1: "List the five HTTP methods used in REST APIs (GET, POST, PUT, PATCH, DELETE) and for each: (a) the equivalent SQL/CRUD operation, (b) whether it is idempotent, (c) the typical HTTP success response code, and (d) a concrete NMS alarm API example using that method.",
    level2: "Design a RESTful URL structure for an NMS alarm API that exposes: (a) a collection of all alarms, (b) a single alarm by ID, (c) the list of alarms for a specific device, (d) alarm statistics (counts by severity), and (e) the acknowledgement operation on a specific alarm. Follow REST URL naming conventions (nouns, not verbs, plural resource names).",
    level3: "An NMS REST API has: T_auth = 8 ms (local JWT validation), T_db = 45 ms (indexed alarm query), T_serial = 12 ms (JSON marshalling). Calculate T_rest. If the database adds a full-text search feature that increases T_db by 80 ms, what is the new T_rest and which component now dominates?",
    level4: "Implement a Python REST API client that authenticates to an NMS NBI (mock), queries all Critical alarms with state=UNACKNOWLEDGED, handles pagination (follow Link header to retrieve all pages), and outputs a structured summary report: total count, top 5 affected devices, and alarm age distribution.",
  },
  "u3t8": {
    level1: "Write out the complete HTTP request and expected response for each of the five REST operations (GET, POST, PUT, PATCH, DELETE) targeting an NMS alarm resource. Include: HTTP method and URL, Authorization header, request body (where applicable), expected HTTP status code, and response body format.",
    level2: "Trace the complete operation flow for an NOC engineer who: (1) queries all Critical alarms for a specific device, (2) acknowledges each Critical alarm with their user ID, (3) adds a diagnostic note to the most recent alarm, and (4) clears the alarms after the fault is repaired. Write out each API call in curl format.",
    level3: "An NMS database has 3,750 alarms. The OSS client requests them with page_size=150. Each API call takes 80 ms. Calculate (a) number of pages, (b) last page record count, (c) total retrieval time in seconds.",
    level4: "Design a pagination implementation for an NMS NBI using cursor-based pagination (as opposed to offset pagination). Specify: how the cursor is generated (last seen alarm ID + timestamp), how it is included in the Link header, how the server uses it to query the next page consistently, and why cursor-based pagination is more reliable than offset-based during concurrent alarm creation.",
  },
  "u3t9": {
    level1: "List the four core TAPI API domains (topology, connectivity, path computation, notification/alarm) and for each: (a) describe what it manages, (b) give the primary YANG module name, and (c) describe a specific OSS use case that would use that domain.",
    level2: "Draw the TAPI architecture stack for an operator managing a three-vendor optical network (Ciena, Infinera, Nokia). Show: the OSS layer, the TAPI REST API interface, the Transport Domain Controller (TDC) layer, the vendor-specific southbound interfaces, and the vendor optical equipment. Label each interface with its protocol and direction.",
    level3: "An operator manages 6 optical transport vendors. Custom integration for each vendor costs 70 person-days. TAPI standard integration costs 90 person-days. Calculate (a) total custom development cost, (b) TAPI-based savings, and (c) break-even vendor count (minimum N_vendors at which TAPI becomes economically justified).",
    level4: "Write a TAPI connectivity service provisioning request in JSON format for a 100G wavelength service between two optical nodes. Include: serviceType, layer, clientServiceEndpoints (source and destination topology node + port), bandwidth, and protection scheme. Document each JSON field with its TAPI YANG model definition.",
  },
  "u3t10": {
    level1: "Draw the ETSI NFV reference architecture showing all three layers: NFVI (hardware + hypervisor), VNF layer (three example VNF types), and MANO (NFVO, VNFM, VIM). Label all major interfaces (Vi-Ha, Vn-Nf, Or-Vnfm, Os-Ma-nfvo) and show the direction of management control and data flow.",
    level2: "For a virtualised IMS (IP Multimedia Subsystem) deployment, identify and describe the VNF components needed: P-CSCF (Proxy Call Session Control Function), S-CSCF (Serving CSCF), I-CSCF, HSS (Home Subscriber Server), and BGCF. For each, specify the typical vCPU, vRAM, and vStorage resource requirements in a VNFD-style format.",
    level3: "A VNF instance uses 8 vCPUs and 16 GB RAM. It needs to scale from 1 to 6 instances. Calculate: (a) total resource cost at each scale level (1 to 6), (b) per-VNF efficiency at each scale level, (c) total resource cost when scaled to 6 instances.",
    level4: "Design a complete VNF lifecycle management flow using the MANO architecture for a virtualised firewall (vFW). Specify: (a) the VNFD (VNF Descriptor) in TOSCA-YAML format with resource requirements, scaling policies, and healing policies, (b) the NFVO onboarding steps, (c) the VNFM instantiation sequence, (d) the scale-out trigger condition and procedure, and (e) the VIM (OpenStack) API calls made during instantiation.",
  },
  "u4t1": {
    level1: "Draw the three-plane SDN architecture (data plane, control plane, management/application plane) with a diagram showing 4 OpenFlow switches connected to an SDN controller. Label the southbound API (OpenFlow), northbound API (REST), and management plane application. Identify which components exist in traditional networking and which are new to SDN.",
    level2: "Compare SDN and traditional networking across five dimensions: topology discovery, policy deployment, fault recovery, traffic engineering, and vendor lock-in. For each dimension, explain why SDN provides an advantage or introduces a new challenge. Include a concrete scenario for each comparison.",
    level3: "Given: Controller bandwidth B_ctrl = 500,000 bytes/s, flow message size S_flow = 150 bytes, flow request rate F_rate = 40 flows/s/switch. Calculate: (a) N_max (maximum switches), (b) total controller bandwidth consumed for N = 80 switches, (c) whether this configuration can support 80 switches, and (d) the minimum controller bandwidth needed for 80 switches.",
    level4: "Using Mininet and the Ryu SDN controller, deploy a 4-switch linear topology. Capture OpenFlow PACKET_IN and FLOW_MOD messages with Wireshark on the controller interface. Measure: (a) average PACKET_IN rate per switch during an iperf TCP flood test, (b) average FLOW_MOD response latency, (c) flow table utilisation on each switch. Compare measured results to the N_max model predictions.",
  },
  "u4t2": {
    level1: "Describe the three SDN controller engine functions — Route, Switch, and Rollback — in your own words. For each function, identify: (a) the input it receives, (b) the processing it performs, (c) the output it produces, and (d) which southbound API message types it uses (e.g., FLOW_MOD, ECHO_REQUEST, STATS_REQUEST).",
    level2: "Trace the complete sequence of events when a core link fails in an SDN network with 10 switches. Starting from LLDP topology discovery detecting the link removal, through the route function recomputing affected paths, to the switch function pushing new FLOW_MOD messages and verifying installation. Include the rollback trigger condition and what the rollback state machine reverts to.",
    level3: "Compute the relative Dijkstra computation time for three network scenarios: (a) V=30 switches, E=50 links; (b) V=100 switches, E=200 links; (c) V=200 switches, E=600 links. Calculate T_rel = (V+E) × log₂(V+1) for each and determine how much slower scenario (c) is compared to scenario (a). Explain the implications for controller scalability.",
    level4: "Using ONOS and Mininet, deploy a 10-switch ring topology. Deliberately introduce a link failure using 'link down' in Mininet CLI while running a continuous iperf3 UDP stream. Measure: (a) total rerouting latency from link failure to traffic restoration, (b) number of FLOW_MOD messages generated, (c) whether the rollback state machine was triggered. Compare rerouting latency with OSPF failover time in the equivalent topology.",
  },
  "u4t3": {
    level1: "Define the three pillars of network observability — Metrics, Logs, and Traces — and for each pillar provide: (a) a precise definition, (b) two specific examples from a network operations context, (c) one tool commonly used to collect that pillar's data, and (d) a question that pillar uniquely answers that the other two pillars cannot.",
    level2: "A network operations team is investigating why a web application experienced a 3-second latency spike for all users in a specific geographic region at 14:32:05 UTC. Describe step-by-step how they would use all three observability pillars together to diagnose the root cause. What specific metric anomaly would trigger the investigation? What logs would they correlate? What trace would they examine to pinpoint the slow component?",
    level3: "Calculate SNR_obs for three observability pipeline configurations: (a) S_useful=5000, S_noise=500; (b) S_useful=5000, S_noise=5000; (c) S_useful=1000, S_noise=10. For each, explain what the SNR value means operationally and which configuration would cause alert fatigue.",
    level4: "Deploy a Prometheus + Grafana + Jaeger observability stack using Docker Compose. Instrument a simple Python Flask web service with OpenTelemetry. Generate synthetic load and then deliberately introduce a slow database query. Demonstrate that: (a) the Prometheus metric shows latency increase, (b) application logs capture the slow query, (c) the Jaeger trace pinpoints exactly which database call caused the latency. Measure time to diagnose with vs without traces.",
  },
  "u4t4": {
    level1: "Create a detailed comparison table of network monitoring vs network observability across 8 dimensions: purpose, data types collected, cardinality, query model (predefined vs exploratory), typical tools, typical alert mechanism, reaction posture (reactive vs proactive), and primary audience (NOC vs business stakeholder). For each dimension, explain why the difference matters in practice.",
    level2: "Scenario analysis: A financial services firm's trading platform experienced a 45-second latency spike at 09:31 AM during market open. Their monitoring dashboard showed nothing abnormal during the spike. Design the observability investigation: (a) which metrics would show the anomaly that monitoring missed, (b) which logs would reveal the event sequence, (c) what distributed trace would pinpoint the root cause, (d) what change to the monitoring system could prevent missing this next time.",
    level3: "Calculate MTTD for monitoring and observability, and compute ΔMTTD for: (a) poll_interval=60s, alert_processing=30s, obs_latency=3s; (b) poll_interval=300s, alert_processing=60s, obs_latency=5s. For each scenario, calculate the annual cost savings if each avoided incident minute saves $500.",
    level4: "Run a controlled experiment: deploy the same synthetic fault (gradual CPU memory leak reaching critical in 10 minutes) on a simulated device. Use Zabbix (monitoring) and Prometheus+Grafana (observability) in parallel. Measure: (a) MTTD for each system, (b) the minimum information provided by each system at the moment of detection, (c) how long it takes each system to provide root-cause information. Document the observability advantage quantitatively.",
  },
  "u4t5": {
    level1: "List five specific business questions that network observability can answer but traditional monitoring cannot. For each question, identify: (a) which observability pillar(s) (metrics, logs, traces) provide the data needed, (b) which specific tool would provide the answer, and (c) the business decision that answer enables.",
    level2: "Construct a business case for observability investment for a mid-size e-commerce company with: 5 incidents/month averaging 10 minutes each, revenue loss rate of $2,000/minute, and SLA penalties of $3,000 per breach above 10 minutes downtime. Calculate: (a) current annual incident cost without observability, (b) projected annual cost if observability reduces average incident duration to 4 minutes, (c) savings per year, (d) ROI if the observability platform costs $80,000/year.",
    level3: "Using the downtime impact formula I_down = R_rate × T_down + P_sla, calculate the total annual savings from observability for: R_rate=$3,000/min, 8 incidents/year, average T_down reduced from 20 min to 6 min by observability, SLA penalty of $10,000 triggered when T_down > 15 min. Show the calculation for each incident and total annual savings.",
    level4: "Design an observability-based SLA dashboard for a telecom operator serving 50 enterprise customers. Define: (a) the metrics and queries needed for real-time per-customer SLA compliance tracking, (b) the automated breach detection and notification workflow, (c) the data retention and audit trail requirements for legal defensibility, (d) the KPIs the dashboard exposes to both the NOC team and account managers.",
  },
  "u4t6": {
    level1: "Create a reference table of the five network observability techniques covered in this topic: streaming telemetry (gNMI), EBPF, distributed tracing, log aggregation, and flow telemetry. For each technique, document: protocol/technology used, data type produced (metric/log/trace), collection model (push/pull/passive), primary tool examples, and typical use case in network operations.",
    level2: "Trace the journey of a network observability event through all five techniques simultaneously: a customer's VoIP call degrades at 14:32:05. Describe what each of the five techniques captures about this event: (a) what counter changes does streaming telemetry detect, (b) what would EBPF capture at the packet level, (c) what would distributed tracing show about the SIP signalling path, (d) what log entries would be generated, (e) what NetFlow records would characterise the RTP stream.",
    level3: "Calculate V_tel in Mbps and daily storage in GB for: N=800 devices, F=2 Hz (2 samples/second), S_sample=600 bytes. Then calculate 30-day raw storage and compressed storage (assuming 15x compression ratio). Show all working.",
    level4: "Deploy an EBPF observability probe using bpftrace or the BCC toolkit on a Linux system to trace TCP retransmissions on a specific interface. Capture 5 minutes of trace data during an iperf3 session with simulated packet loss (tc netem). Correlate the EBPF TCP retransmission events with: (a) Prometheus network interface error counters, (b) iperf3 throughput degradation, (c) application-layer latency increase. Document how the three pillars together explain the observed behaviour.",
  },
  "u4t7": {
    level1: "Compare the three storage backends in the observability data lake: time-series database (Prometheus/InfluxDB), log store (Elasticsearch/Loki), and trace store (Jaeger/Tempo). For each: (a) data type optimised for, (b) write model (push/pull/stream), (c) query language used, (d) compression technique, (e) typical retention window, and (f) one example query that the backend uniquely handles well.",
    level2: "Design a data collection pipeline for a 200-device enterprise network. Define: (a) which collection protocol (gNMI, NetFlow, syslog) feeds each storage backend, (b) how Apache Kafka is used as a buffer between collectors and storage, (c) what downsampling policy (raw resolution and duration, downsampled resolution and duration) minimises cost while preserving diagnostic capability, (d) what the total storage capacity requirement is using S_total = N × F × S_point × T_retention.",
    level3: "Calculate S_total for: N=2000 interfaces, F=1 sample/second, S_point=16 bytes, T_retention=90 days. Then calculate: (a) raw storage in GB, (b) compressed storage at 15x ratio, (c) how much is saved by downsampling after 7 days to 60-second resolution.",
    level4: "Deploy a complete observability data pipeline using Docker: gnmic (gNMI collector) → Kafka → Prometheus remote write adapter → VictoriaMetrics. Generate synthetic gNMI telemetry from a Python simulator for 50 interfaces at 1 Hz. Measure: (a) actual bytes written to VictoriaMetrics per second, (b) compression ratio achieved vs theoretical S_point=16 bytes, (c) query latency for a 24-hour range query across all 50 interfaces.",
  },
  "u4t8": {
    level1: "Define and distinguish three AI/ML techniques used in AIOps: anomaly detection (Isolation Forest, LSTM autoencoder), time-series forecasting (ARIMA, Prophet), and root cause analysis (causal inference, graph neural networks). For each: (a) the type of input data, (b) the type of output produced, (c) a specific network use case, and (d) the evaluation metric used to measure model quality.",
    level2: "Trace the lifecycle of an AIOps prediction from data collection to action: beginning with raw interface utilisation telemetry at 1 Hz, through the data preprocessing step (normalisation, feature engineering), through the Prophet forecast model, through the alert generation and enrichment step, to the final human or automated remediation action. Identify where false positives can enter the pipeline and how they are filtered.",
    level3: "Calculate MAPE for the following 6-step forecast sequence: Actual=[100, 105, 98, 112, 107, 115], Forecast=[95, 110, 100, 108, 110, 120]. Show the absolute percentage error at each step and the final average. Is this model acceptable for capacity planning?",
    level4: "Using Python and the Facebook Prophet library, train a forecasting model on 90 days of synthetic hourly network utilisation data (with daily and weekly seasonality patterns). Evaluate the model on a 14-day holdout period using MAPE. Compare Prophet's MAPE against a simple ARIMA(2,1,2) model on the same dataset. Generate a capacity saturation forecast: predict the date when the link will exceed 80% utilisation given the growth trend.",
  },
  "u4t9": {
    level1: "Define the following service orchestration terms with one sentence each: NSD (Network Service Descriptor), VNF Descriptor, TOSCA, BPMN workflow, ONAP SO, and CDS. For each, identify whether it is a design-time artefact, a runtime component, or both.",
    level2: "Draw the ONAP service orchestration workflow for an L3 VPN service order: customer order → SO BPMN execution → NFVO VNF instantiation → CDS NE configuration → completion callback. Label each ONAP component, the API protocol between them (REST/NETCONF/gRPC), and the domain adapter used for each domain.",
    level3: "A service deployment has 5 sequential steps with individual durations of 3, 8, 12, 5, and 7 minutes (synchronous). Calculate: (a) total deployment time, (b) time saved if steps 1 and 2 can be parallelised, (c) time saved if steps 4 and 5 can also be parallelised. What is the minimum achievable deployment time?",
    level4: "Review the ETSI SOL001 standard (TOSCA profile for NFV) and write a minimal TOSCA node template for a virtual Firewall VNF. Include: node_type, properties (vCPU count, vRAM, VDU image URL), requirements (virtual_link for management and data interfaces), and one TOSCA workflow step (instantiate).",
  },
  "u4t10": {
    level1: "Define the TMF622 Product Ordering API order states: acknowledged, rejected, pending, inProgress, completed, failed, partial. For each state, describe the triggering event and the expected next state transition.",
    level2: "Draw a sequence diagram showing the complete order flow for an L3 VPN service: customer portal → BSS (TMF622) → OSS decomposition → MPLS domain → SD-WAN VNF domain → CPE activation. Include the 202 Accepted response at the start and the asynchronous completion callback at the end.",
    level3: "A service order has 4 provisioning steps with individual failure probabilities of 2%, 3%, 1%, and 4%. Calculate: (a) the probability that at least one step fails (without compensation), (b) the probability that a saga rollback successfully compensates a step-3 failure (assuming each compensating action has a 99% success rate).",
    level4: "Review TMF622 Product Ordering Management API v4.0 (available at tmforum.org). Identify the 5 mandatory fields in a POST /productOrder request body and explain the role of each. Then design a minimal productOrder JSON payload for a new 100 Mbps internet service.",
  },
  "u4t11": {
    level1: "Define the difference between Fault Management and Service Assurance. Give two examples where a network is fault-free (no FCAPS alarms active) but a customer's SLA is being violated. Explain the root cause in each example.",
    level2: "Draw a service assurance architecture diagram showing: Y.1731 probes injecting test traffic, passive IPFIX flow collection, SLA correlation engine, breach detection module, and automated remediation via SR traffic engineering. Label the data flow between each component.",
    level3: "A customer's 100 Mbps VPN SLA allows a maximum of 43.8 minutes downtime per month (99.9% availability). In October, the following SLA-degrading events were measured: 8-minute latency breach (RTT >150ms), 12-minute packet loss event (>0.1%), 5-minute complete outage. Calculate: (a) total SLA-impacting minutes, (b) actual monthly availability percentage, (c) whether the SLA was breached.",
    level4: "Research Y.1731 (ITU-T MEG, MEP, CC, DM, LM) and IP SLA (Cisco) as service assurance probing technologies. Compare them across: measurement type (active vs passive), metrics measured, vendor support, and cost. Recommend one for a multi-vendor enterprise WAN with 50 customer sites.",
  },
  "u4t12": {
    level1: "Define the following 5G network slicing terms: NST (Network Slice Template), NSI (Network Slice Instance), NSSI (Network Slice Subnet Instance), S-NSSAI, SST, and SD. For each, give one concrete example value (e.g., SST=2 means URLLC).",
    level2: "Draw the ONAP closed-loop slice management architecture showing: DCAE (telemetry collection from gNBs and UPFs), Policy Framework (closed-loop policies), SO (Service Orchestrator), and CDS (Configuration Design Studio). Label the data flow: telemetry → anomaly detection → policy trigger → SO scaling action → configuration push → back to telemetry.",
    level3: "A 5G network has 100 MHz of available NR spectrum at 3.5 GHz. Static slicing allocates: eMBB 50 MHz, URLLC 20 MHz, mMTC 30 MHz. At 9 PM, eMBB demand is at 110% of its 50 MHz allocation. Calculate: (a) the bandwidth deficit for eMBB, (b) the maximum additional bandwidth available from unused mMTC allocation (mMTC is at 15% utilisation at 9 PM), (c) the new eMBB allocation after dynamic rebalancing if 80% of unused mMTC spectrum is reallocated.",
    level4: "Read 3GPP TS 28.530 Section 6 (Network Slice Management Concept). Identify: (a) the three phases of network slice lifecycle (preparation, commissioning, operation, decommissioning), (b) the interfaces between NSMF (Network Slice Management Function) and NSSMF (Network Slice Subnet Management Function), (c) how the CSMF (Communication Service Management Function) translates customer requirements to NST parameters.",
  },
};

export const curriculum: CurriculumEntry[] = Object.entries(courseData).map(([unitId, topics]) => ({
  unit: unitId,
  title: unitMeta[unitId] ?? `Unit ${unitId}`,
  topics: Object.entries(topics).map(([topicId, data]) => ({ id: topicId, name: data.title })),
}));
