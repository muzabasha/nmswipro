import type { TopicData } from './types';

export const topic33Data: TopicData = {
  id: "u4t1",
  title: "SDN Architecture and Concept",
  moduleName: "Unit IV: SDN, Network Observability, and Advanced Network Management",
  context: {
    prerequisites: [
      "Network Function Virtualization (NFV) Concepts (VIM, VNFM, NFVO)",
      "EMS and NMS Architecture"
    ],
    dependentTopics: ["SDN Controller Engine Functions (Route, Switch, Rollback)"],
    nextSteps: "Study SDN Controller Engine Functions to understand how the SDN control plane computes paths, manages the switch fleet, and enables rollback — building on the architectural separation introduced here.",
    rfcReferences: [
      { name: "RFC 7426", relevance: "Software-Defined Networking (SDN) Architecture - defines control/data plane separation and layered architecture" },
      { name: "RFC 7149", relevance: "Software-Defined Networking within a Service Provider Environment - use cases and requirements" },
      { name: "OpenFlow 1.5.1", relevance: "OpenFlow Switch Specification - southbound API for SDN controller-to-switch communication" },
      { name: "P4_16 Specification", relevance: "Programming Protocol-independent Packet Processors - programmable data plane definition language" },
      { name: "RFC 8040", relevance: "RESTCONF Protocol - commonly used for SDN northbound API alongside REST/gRPC" },
      { name: "RFC 8345", relevance: "Network Topology Data Model - YANG model for SDN topology representation" }
    ]
  },
  storytelling: {
    analogy: "Separating Air Traffic Control from Airplanes",
    story: "In traditional networking, every router is like an airplane that also does its own air traffic control — it independently decides where to route traffic using OSPF or BGP, exchanging link-state advertisements with its neighbours and computing its own forwarding table. Each plane (router) makes local decisions based on partial information, hoping consensus emerges. SDN separates these concerns completely: the SDN controller is the centralised air traffic control tower that has a global, real-time view of every aircraft position, every runway status, and every route in the sky. The switches and routers become simple forwarding devices — they just follow the controller's explicit instructions delivered via OpenFlow or P4Runtime. This architectural separation enables three transformative capabilities: first, global traffic engineering — the controller can optimise end-to-end paths across the entire network in a single computation, something no individual router can achieve with only local topology knowledge; second, rapid policy changes — instead of logging into hundreds of routers to deploy a new ACL or traffic-shaping policy, one API call to the SDN controller propagates the change to all devices simultaneously; third, programmable forwarding — P4-based data planes allow operators to define entirely new packet processing pipelines, matching on arbitrary header fields and performing custom actions that fixed ASIC firmware could never support. The SDN architecture is defined by three distinct planes: the data plane (packet forwarding hardware — switches, NICs), the control plane (SDN controller — OpenDaylight, ONOS, Ryu), and the management/application plane (network applications consuming the northbound API). The southbound API (OpenFlow, NETCONF, P4Runtime) connects the controller to switches; the northbound API (REST, gRPC) exposes the network as a programmable resource to applications.",
    reflectiveQuestions: [
      "What are the failure implications if the centralised SDN controller becomes unavailable — how does this differ from a distributed routing protocol failure?",
      "How does the separation of control and data planes make network virtualisation (creating multiple virtual networks on shared physical infrastructure) easier to implement?",
      "What security risks are introduced by centralising network control in a single SDN controller, and how do SDN frameworks mitigate them?"
    ],
    technicalConnection: "OpenFlow protocol: the controller installs flow entries via FLOW_MOD messages into switch flow tables. A flow entry specifies match fields (in_port, eth_src, eth_dst, ip_src, ip_dst, tcp_dport) and actions (output:port, drop, modify-field, goto-table). ONOS (Open Network Operating System) distributes controller state across a cluster using Apache Atomix for fault tolerance. Mininet simulates SDN networks in software: `mn --topo tree,depth=2,fanout=3 --controller remote,ip=127.0.0.1` creates a tree topology connected to an external ONOS controller. P4 (Programming Protocol-Independent Packet Processors) allows custom match-action pipelines compiled to Tofino ASICs or software switches (bmv2)."
  },
  mathModelling: {
    need: "To determine the maximum number of switches an SDN controller can manage given its control-plane bandwidth, the flow request rate from each switch, and the size of each flow setup message. This capacity model is critical for planning controller deployment and clustering strategies.",
    equation: "N_{max} = \\frac{B_{ctrl}}{F_{rate} \\times S_{flow}}",
    technicalDetails: "The SDN controller must process OpenFlow PACKET_IN messages and respond with FLOW_MOD messages. Each new flow arriving at a switch that has no matching entry triggers a PACKET_IN to the controller. If each of \\( N \\) switches generates \\( F_{rate} \\) flow setup requests per second, and each request/response exchange consumes \\( S_{flow} \\) bytes of controller bandwidth, the total bandwidth consumed is \\( N \\times F_{rate} \\times S_{flow} \\). The controller's available control-plane bandwidth \\( B_{ctrl} \\) caps the number of manageable switches at \\( N_{max} = B_{ctrl} / (F_{rate} \\times S_{flow}) \\). For example: \\( B_{ctrl} = 1 \\times 10^6 \\) bytes/s, \\( F_{rate} = 50 \\) flows/s/switch, \\( S_{flow} = 200 \\) bytes: \\( N_{max} = 1{,}000{,}000 / (50 \\times 200) = 100 \\) switches. Beyond this limit, the controller queues become saturated, flow setup latency spikes, and packets are dropped at switches awaiting forwarding decisions. SDN controller clustering (ONOS, OpenDaylight cluster) partitions the switch fleet across multiple controller instances to scale beyond single-node limits.",
    explanation: [
      { term: "N_{max}", meaning: "Maximum number of switches the controller can manage without saturation" },
      { term: "B_{ctrl}", meaning: "Controller available control-plane bandwidth in bytes per second" },
      { term: "F_{rate}", meaning: "Flow setup request rate per switch in flow requests per second" },
      { term: "S_{flow}", meaning: "Size of one flow setup message exchange (PACKET_IN + FLOW_MOD) in bytes" }
    ],
    advantages: [
      "Provides a concrete capacity planning boundary for SDN controller deployment — preventing reactive scaling crises",
      "Highlights the direct relationship between flow table hit-rate (which reduces PACKET_IN rate) and controller scalability",
      "Guides clustering decisions: if N_max = 100 and the network has 400 switches, deploy a 4-node controller cluster"
    ],
    limitations: [
      "Assumes uniform flow arrival rate across all switches — bursty traffic (DDoS, elephant flows) causes instantaneous violations of N_max",
      "Does not account for controller CPU processing overhead — flow computation latency can bottleneck before bandwidth is exhausted",
      "Ignores proactive flow installation (where the controller pre-installs flows, eliminating PACKET_IN entirely) which fundamentally changes the model"
    ],
    simulation: {
      description: "Adjust the number of switches and the per-switch flow request rate to observe how the controller's capacity utilisation changes. Controller bandwidth is fixed at 1,000,000 bytes/s and flow message size at 200 bytes. When capacity reaches 100%, the controller is saturated and cannot handle additional switches.",
      parameters: [
        { id: "switches", name: "Number of Switches", min: 10, max: 200, default: 50, step: 10, unit: "" },
        { id: "flow_rate", name: "Flow Rate (flows/s/switch)", min: 10, max: 100, default: 50, step: 10, unit: " flows/s" }
      ],
      generateData: (params: Record<string, number>): Array<{ x: number; y: number }> => {
        const switches = params.switches || 50;
        const flow_rate = params.flow_rate || 50;
        const ctrl_bw = 1e6;
        const flow_size = 200;
        const pts: Array<{ x: number; y: number }> = [];
        for (let x = 10; x <= switches; x += 10) {
          const capacity = (ctrl_bw / (x * flow_rate * flow_size)) * 100;
          const status = Math.min(capacity, 100);
          pts.push({ x, y: parseFloat(status.toFixed(1)) });
        }
        return pts;
      },
      labels: { x: "Switches", y: "Controller Capacity Used (%)" }
    }
  },
  activities: {
    level1: "Draw the three-plane SDN architecture (data plane, control plane, management/application plane) with a diagram showing 4 OpenFlow switches connected to an SDN controller. Label the southbound API (OpenFlow), northbound API (REST), and management plane application. Identify which components exist in traditional networking and which are new to SDN.",
    level2: "Compare SDN and traditional networking across five dimensions: topology discovery, policy deployment, fault recovery, traffic engineering, and vendor lock-in. For each dimension, explain why SDN provides an advantage or introduces a new challenge. Include a concrete scenario for each comparison.",
    level3: "Given: Controller bandwidth B_ctrl = 500,000 bytes/s, flow message size S_flow = 150 bytes, flow request rate F_rate = 40 flows/s/switch. Calculate: (a) N_max (maximum switches), (b) total controller bandwidth consumed for N = 80 switches, (c) whether this configuration can support 80 switches, and (d) the minimum controller bandwidth needed for 80 switches.",
    level4: "Using Mininet and the Ryu SDN controller, deploy a 4-switch linear topology. Capture OpenFlow PACKET_IN and FLOW_MOD messages with Wireshark on the controller interface. Measure: (a) average PACKET_IN rate per switch during an iperf TCP flood test, (b) average FLOW_MOD response latency, (c) flow table utilisation on each switch. Compare measured results to the N_max model predictions."
  },
  projects: {
    scope: "Design and simulate a campus network migration from traditional OSPF routing to an SDN architecture using Mininet and ONOS controller, demonstrating centralized traffic engineering capabilities.",
    objectives: [
      "Model a campus network with 20 access switches, 4 distribution switches, and 2 core switches using Mininet with a custom topology script",
      "Deploy ONOS controller and implement a REST API-based path computation application that installs optimal forwarding rules based on real-time link utilisation",
      "Measure and compare convergence time after a link failure between traditional OSPF (simulated) and SDN reactive rerouting",
      "Demonstrate global traffic engineering by splitting elephant flows across equal-cost paths and measuring throughput improvement"
    ],
    deliverables: [
      "Mininet topology Python script defining the 26-switch campus network with realistic link speeds and delays",
      "ONOS REST API application code performing path computation and flow rule installation via ONOS Intent Framework",
      "Measurement report comparing OSPF vs SDN convergence time (ms), flow setup latency (ms), and aggregate throughput (Mbps)",
      "Architecture diagram showing the three SDN planes with component placement in the campus scenario"
    ]
  },
  questions: [
    {
      q: "Explain the three planes of SDN architecture and the APIs that connect them.",
      a: "SDN architecture separates network functionality into three planes. The data plane consists of forwarding hardware (switches, routers, NICs) that process packets purely based on flow tables installed by the controller — no routing logic resides here. The control plane is the SDN controller (ONOS, OpenDaylight, Ryu) that maintains a global network view, computes paths, and installs flow rules. The management/application plane contains network applications (traffic engineering, load balancers, firewalls as apps) that consume the controller's network abstraction. The southbound API (OpenFlow, P4Runtime, NETCONF) connects the control plane to the data plane — it carries FLOW_MOD messages from controller to switch and PACKET_IN events from switch to controller. The northbound API (REST, gRPC, Intent API) connects the application plane to the control plane — applications express network intent (connect endpoint A to endpoint B with QoS) and the controller translates intent to forwarding rules. This clean separation is what enables programmable, software-defined network management.",
      type: "Conceptual"
    },
    {
      q: "Why does centralized SDN control improve traffic engineering compared to distributed OSPF/BGP?",
      a: "Distributed protocols like OSPF make routing decisions based on local topology databases — each router only knows the network graph and computes shortest paths independently. This makes it impossible for any single device to optimise for global network conditions: a router cannot know that its chosen shortest path is already 90% loaded while an alternative 2-hop longer path is empty. SDN centralises topology and utilisation knowledge in the controller — it sees all link loads in real time via OpenFlow port statistics. The controller can therefore compute traffic-engineering paths (RSVP-TE equivalents) using algorithms like CSPF (Constrained Shortest Path First) that explicitly avoid congested links, balance load across equal-cost paths (ECMP), and satisfy QoS constraints (maximum delay, minimum bandwidth) — none of which are possible with hop-by-hop distributed routing. Google's B4 WAN and Microsoft's SWAN both use SDN traffic engineering to achieve near-100% WAN utilisation, compared to 30-40% utilisation typical under distributed routing designed for worst-case failover.",
      type: "Analytical"
    },
    {
      q: "Calculate N_max for: B_ctrl = 2,000,000 bytes/s, F_rate = 80 flows/s/switch, S_flow = 250 bytes.",
      a: "N_max = B_ctrl / (F_rate × S_flow) = 2,000,000 / (80 × 250) = 2,000,000 / 20,000 = 100 switches. This means a single controller instance with 2 Mbps of control-plane bandwidth capacity can manage up to 100 switches generating 80 flow setup requests per second each. If the network has 300 switches, a 3-node controller cluster is required, with each node managing approximately 100 switches. Increasing the flow table hit-rate through proactive or timeout-extended flow installation reduces F_rate and thus increases N_max — for example, if F_rate drops to 20 flows/s/switch, N_max increases to 400.",
      type: "Numerical"
    },
    {
      q: "What is the OpenFlow protocol's role in SDN and how does a PACKET_IN / FLOW_MOD exchange work?",
      a: "OpenFlow is the pioneering southbound protocol that enables the SDN controller to program the data plane of OpenFlow-capable switches. When a packet arrives at an OpenFlow switch and no matching flow entry exists in the flow table, the switch encapsulates the packet (or its header) in a PACKET_IN message and sends it to the controller over the OpenFlow TCP/TLS channel. The controller processes the PACKET_IN — it identifies the flow (source/destination IP, port, protocol), runs its path computation and policy logic, and then sends back a FLOW_MOD message that installs a new flow entry specifying match fields and actions (output to port N, modify VLAN tag, drop). Optionally, the controller also sends a PACKET_OUT to forward the original triggering packet while the flow rule is being installed. Subsequent packets matching the installed flow entry are forwarded directly by the switch hardware at line rate without involving the controller — this is called reactive flow installation. Proactive installation (controller pre-programs flows before any traffic arrives) eliminates the PACKET_IN round trip entirely.",
      type: "Conceptual"
    },
    {
      q: "What are the key fault tolerance concerns with a centralised SDN controller and how are they addressed?",
      a: "A centralised SDN controller represents a single point of failure — if it becomes unavailable, new flows cannot be installed and the network loses the ability to respond to topology changes. Three mechanisms address this. First, controller clustering: ONOS deploys as a cluster of 3, 5, or 7 nodes using Raft consensus to replicate controller state (flow tables, topology, application state) — if one node fails, the remaining nodes continue operation without interruption. Second, fail-secure vs fail-open switch behaviour: OpenFlow switches can be configured to drop all packets (fail-secure) or continue forwarding based on the last installed flows (fail-open) when the controller connection is lost — fail-open maintains service for known flows during brief controller outages. Third, local fallback rules: critical flows (management traffic, default gateway routes) can be pre-installed with long timeouts so they persist across controller disconnections. Google's Jupiter network uses a hierarchical controller design with local domain controllers handling data-plane failures independently of the global controller.",
      type: "Analytical"
    }
  ],
  virtualLab: {
    description: "Simulate the SDN controller capacity model by adjusting the number of switches and flow request rate. The controller's control-plane bandwidth is fixed at 1,000,000 bytes/s with a flow message size of 200 bytes. The Y-axis shows what percentage of the controller's bandwidth budget is consumed. When the value exceeds 100%, the controller is overloaded.",
    interpretation: "As the number of switches increases, controller bandwidth consumption grows linearly. The curve drops as you increase the switch count beyond N_max — this represents the percentage of controller capacity remaining (inverted). When capacity drops toward 0%, the controller is saturated. In production deployments, architects target a maximum of 70-80% controller utilisation to maintain headroom for traffic bursts. Controller clustering (ONOS, ODL) is the standard solution when a single controller cannot serve the full switch fleet.",
    parameters: [
      { id: "switches", name: "Number of Switches", min: 10, max: 200, default: 50, step: 10, unit: "" },
      { id: "flow_rate", name: "Flow Rate (flows/s/switch)", min: 10, max: 100, default: 50, step: 10, unit: " flows/s" }
    ],
    generateData: (params: Record<string, number>): Array<{ x: number; y: number }> => {
      const switches = params.switches || 50;
      const flow_rate = params.flow_rate || 50;
      const ctrl_bw = 1e6;
      const flow_size = 200;
      const pts: Array<{ x: number; y: number }> = [];
      for (let x = 10; x <= switches; x += 10) {
        const capacity = (ctrl_bw / (x * flow_rate * flow_size)) * 100;
        const status = Math.min(capacity, 100);
        pts.push({ x, y: parseFloat(status.toFixed(1)) });
      }
      return pts;
    },
    labels: { x: "Switches", y: "Controller Capacity Used (%)" }
  }
};
