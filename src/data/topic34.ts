import type { TopicData } from './types';

export const topic34Data: TopicData = {
  id: "u4t2",
  title: "SDN Controller Engine Functions (Route, Switch, Rollback)",
  moduleName: "Unit IV: SDN, Network Observability, and Advanced Network Management",
  context: {
    prerequisites: ["SDN Architecture and Concept"],
    dependentTopics: ["Key Concepts of Network Observability"],
    nextSteps: "Study Key Concepts of Network Observability to understand how metrics, logs, and traces are used to monitor the SDN control plane and detect anomalies in route computation and switch health.",
    rfcReferences: [
      { name: "OpenFlow 1.5.1", relevance: "OpenFlow Switch Specification — FLOW_MOD messages for flow table management, Echo for switch health monitoring, and group table operations." },
      { rfc: "RFC 8345", title: "Network Topology YANG Model", summary: "YANG data model for network topology graphs — represents nodes, links, termination points for SDN route computation.", url: "https://www.rfc-editor.org/rfc/rfc8345" },
      { rfc: "RFC 5440", title: "Path Computation Element (PCE) Protocol", summary: "Protocol for requesting optimal paths from a PCE server — enables constraint-based path computation for SDN traffic engineering.", url: "https://www.rfc-editor.org/rfc/rfc5440" },
      { name: "IEEE 802.1AB (LLDP)", relevance: "Link Layer Discovery Protocol — used by SDN controllers (OpenDaylight, ONOS) for automatic topology discovery via PACKET_OUT/PACKET_IN." },
      { name: "P4Runtime Specification", relevance: "gRPC-based protocol for runtime control of P4-capable switches — enables SDN controller to push forwarding rules to programmable data planes." },
      { name: "ONOS Intent Framework", relevance: "High-level intent API for SDN routing — HostToHostIntent with versioning and automatic rollback on intent withdrawal." }
    ]
  },
  storytelling: {
    analogy: "A Central Command Center with an Undo Button",
    story: "The SDN controller engine is the brain of the SDN architecture — and unlike the human brain, it has a perfect undo button. The command center metaphor captures all three critical engine functions precisely. The Route function is the strategic operations room: it receives real-time topology updates from all switches via LLDP discovery, maintains a complete network graph in memory, and runs path computation algorithms — Dijkstra's for shortest path, Bellman-Ford for distance-vector scenarios, or traffic-engineering algorithms (CSPF) that find paths satisfying bandwidth and delay constraints simultaneously. When the route function decides on a path for a flow, it translates the abstract path into a precise sequence of OpenFlow FLOW_MOD messages and dispatches them to each switch along the path. The Switch function is the fleet management desk: it monitors every switch's health through periodic OpenFlow echo request/reply heartbeats, tracks each switch's flow table utilisation (a full flow table causes packet drops), reads port statistics (bytes in/out, error counters) at configurable intervals, and detects switch disconnections. When a switch loses connectivity to the controller, the switch function triggers rerouting automatically. The Rollback function is the crown jewel — the capability that makes SDN transformational: every time the controller changes the network state (installs new flows, modifies QoS policies, applies access control rules), it takes a snapshot of the previous state — the complete set of flow entries across all switches. If the new policy causes congestion, routing loops, black holes, or SLA violations, the operator can invoke rollback with a single API call — the controller immediately reissues FLOW_MOD delete messages for all new flows and reinstates the previous good state across the entire network. This is technically impossible in traditional distributed routing: rolling back 200 routers to a previous OSPF state requires manual CLI intervention on each device, a process that takes hours and risks introducing inconsistencies. SDN rollback completes in seconds with guaranteed consistency because the controller is the single source of truth.",
    reflectiveQuestions: [
      "Why is the rollback function not just 'useful' but a fundamental operational safety mechanism — what class of incidents does it prevent that traditional networks cannot recover from quickly?",
      "How does the SDN controller's route function handle a topology change (link failure) differently from OSPF's distributed SPF recomputation — what are the latency and consistency implications?",
      "What data should the switch function collect and at what frequency to detect a failing switch before it causes service degradation?"
    ],
    technicalConnection: "**OpenFlow 1.5.1 Flow Table Management**: FLOW_MOD commands - OFPFC_ADD (add new flow), OFPFC_MODIFY (modify matching flows), OFPFC_DELETE (remove flows). Flow entry: {priority, match (OXM fields), instructions[], timeouts: {idle_timeout (seconds), hard_timeout}, cookie (opaque ID for tracking)}. Echo mechanism: OFPT_ECHO_REQUEST → OFPT_ECHO_REPLY (every 5s) - missed echo triggers switch disconnect detection. **RFC 5440 PCE Protocol**: Path Computation Request (PCReq) message - RP (Request Parameters): bandwidth=100Mbps, metric=IGP. ENDPOINTS: src-ipv4=10.1.1.1, dst-ipv4=10.2.2.2. PCRep (Path Computation Reply): ERO (Explicit Route Object) - ordered list of hops. **IEEE 802.1AB LLDP**: Chassis ID TLV (type=1), Port ID TLV (type=2), TTL TLV (type=3). OpenFlow controller uses PACKET_OUT to inject LLDP frames, receives PACKET_IN with LLDP from neighbors → builds topology graph. **ONOS Intent Framework**: HostToHostIntent(src=00:00:00:00:00:01, dst=00:00:00:00:00:02, constraints=[BandwidthConstraint(100Mbps)]). Intent compiler: PathService.getPaths(src, dst) → Dijkstra → FlowObjectiveService.forward(DeviceId, ForwardingObjective). Rollback: intentService.withdraw(intentKey) → FlowRuleService removes all flows installed by that intent. **P4Runtime Specification**: gRPC methods - Write(TableEntry{table_id, match[], action, priority}) → insert/modify flow. Read(TableEntry) → query installed entries. StreamChannel for PACKET_IN/OUT. **Dijkstra Algorithm**: Priority queue (binary heap). Initialize: dist[src]=0, dist[all_others]=∞. While queue not empty: u = extract_min(). For each neighbor v of u: if dist[u] + weight(u,v) < dist[v]: dist[v] = dist[u] + weight(u,v), enqueue v. Complexity: O((V+E) log V). **OpenDaylight MD-SAL Transactions**: DataBroker.newWriteOnlyTransaction() → tx.put(topology_path, topology_node) → tx.commit() (atomic). Rollback: catch exception → tx.cancel(). **ONOS Rollback State Machine**: IntentState enum: {INSTALL_REQ, COMPILING, INSTALLING, INSTALLED, WITHDRAWING, WITHDRAWN, FAILED}. intentService.withdraw(key) → state=WITHDRAWING → FlowRuleService.removeFlowRulesById(intent.flowRules) → state=WITHDRAWN."
  },
  mathModelling: {
    need: "To estimate the time required for the SDN controller's route function to compute a shortest path in a network of V switches and E links. This determines the maximum reachable path computation rate — critical for assessing controller responsiveness during mass rerouting events such as a core link failure affecting hundreds of flows.",
    equation: "T_{dijkstra} = O((V + E) \\log V)",
    technicalDetails: "Dijkstra's algorithm using a binary min-heap has time complexity \\( O((V + E) \\log V) \\) where \\( V \\) is the number of vertices (switches) and \\( E \\) is the number of edges (links). For a sparse network (\\( E \\approx V \\)): \\( T \\approx O(V \\log V) \\). For a dense network (\\( E \\approx V^2 \\)): \\( T \\approx O(V^2 \\log V) \\). In practice, data-centre fat-tree topologies have \\( E = \\frac{k^3}{4} \\) for \\( k \\)-port switches, making \\( E \\) scale as \\( V^{4/3} \\). For relative comparison, we model \\( T_{rel} \\propto (V + E) \\log_2(V + 1) \\). For \\( V = 50 \\) switches and \\( E = 100 \\) links: \\( T_{rel} = (50 + 100) \\times \\log_2(51) \\approx 150 \\times 5.67 = 851 \\) relative units. For \\( V = 100, E = 200 \\): \\( T_{rel} = 300 \\times \\log_2(101) \\approx 300 \\times 6.66 = 1998 \\) relative units. Modern SDN controllers (ONOS, ODL) use incremental SPF (iSPF) that recomputes only affected path segments after a topology change, reducing effective computation time by 60-90% compared to full Dijkstra recomputation.",
    explanation: [
      { term: "T_{dijkstra}", meaning: "Relative path computation time proportional to Dijkstra algorithm complexity" },
      { term: "V", meaning: "Number of vertices (switches/nodes) in the network graph" },
      { term: "E", meaning: "Number of edges (physical links) in the network graph" },
      { term: "\\log V", meaning: "Logarithmic factor from the binary heap priority queue operations in Dijkstra's algorithm" }
    ],
    advantages: [
      "Quantifies controller route computation overhead — enabling prediction of maximum rerouting events per second the controller can handle",
      "Guides topology design: sparser topologies compute faster, justifying hierarchical (spine-leaf) over full-mesh designs for large SDN deployments",
      "Enables capacity planning for controller CPU: if Dijkstra runs in 1 ms for V=100 and a failure triggers 500 concurrent recomputations, the controller needs 500 ms of compute budget"
    ],
    limitations: [
      "O-notation hides constant factors — actual ONOS implementation may be 10-100x faster due to JIT compilation, graph caching, and incremental SPF",
      "Does not model the time to push computed flow rules to switches via OpenFlow — southbound API latency often dominates total rerouting time",
      "Assumes a single-source shortest path computation — multi-path and traffic-engineering algorithms (k-shortest paths, CSPF) have higher complexity"
    ],
    simulation: {
      description: "Adjust the number of switches and links to observe how relative path computation time changes. This illustrates why large-scale SDN deployments need controller clustering and incremental SPF optimisations.",
      parameters: [
        { id: "switches", name: "Number of Switches", min: 10, max: 200, default: 50, step: 5, unit: "" },
        { id: "links", name: "Number of Links", min: 10, max: 500, default: 100, step: 10, unit: "" }
      ],
      generateData: (params: Record<string, number>): Array<{ x: number; y: number }> => {
        const switches = params.switches || 50;
        const links = params.links || 100;
        const pts: Array<{ x: number; y: number }> = [];
        for (let x = 10; x <= switches; x += 5) {
          const E = Math.min(links, (x * (x - 1)) / 2);
          const T = Math.round((x + E) * Math.log2(x + 1));
          pts.push({ x, y: T });
        }
        return pts;
      },
      labels: { x: "Switches", y: "Relative Computation Time" }
    }
  },
  activities: {
    level1: "Describe the three SDN controller engine functions — Route, Switch, and Rollback — in your own words. For each function, identify: (a) the input it receives, (b) the processing it performs, (c) the output it produces, and (d) which southbound API message types it uses (e.g., FLOW_MOD, ECHO_REQUEST, STATS_REQUEST).",
    level2: "Trace the complete sequence of events when a core link fails in an SDN network with 10 switches. Starting from LLDP topology discovery detecting the link removal, through the route function recomputing affected paths, to the switch function pushing new FLOW_MOD messages and verifying installation. Include the rollback trigger condition and what the rollback state machine reverts to.",
    level3: "Compute the relative Dijkstra computation time for three network scenarios: (a) V=30 switches, E=50 links; (b) V=100 switches, E=200 links; (c) V=200 switches, E=600 links. Calculate T_rel = (V+E) × log₂(V+1) for each and determine how much slower scenario (c) is compared to scenario (a). Explain the implications for controller scalability.",
    level4: "Using ONOS and Mininet, deploy a 10-switch ring topology. Deliberately introduce a link failure using 'link down' in Mininet CLI while running a continuous iperf3 UDP stream. Measure: (a) total rerouting latency from link failure to traffic restoration, (b) number of FLOW_MOD messages generated, (c) whether the rollback state machine was triggered. Compare rerouting latency with OSPF failover time in the equivalent topology."
  },
  projects: {
    scope: "Implement a simplified SDN controller engine module in Python that demonstrates route computation, switch health monitoring, and rollback state management for a simulated 15-switch network.",
    objectives: [
      "Implement Dijkstra's shortest-path algorithm in Python using a networkx graph representing 15 switches with weighted links, computing and installing paths for 50 traffic flows",
      "Build a switch health monitor that tracks simulated heartbeat responses, detects failures within 3 seconds, and triggers automatic rerouting via the route function",
      "Implement a versioned rollback manager that snapshots network state before each policy change and can restore the previous state on command, logging all state transitions",
      "Benchmark path computation time for topologies ranging from V=10 to V=100 switches and compare measured results against the O((V+E)logV) theoretical model"
    ],
    deliverables: [
      "Python controller engine source code with documented route, switch monitor, and rollback modules and unit tests",
      "Benchmark results table showing measured vs theoretical computation time across topology sizes",
      "Rollback demonstration: a network state dump before a policy change, the changed state, and the restored state after rollback — showing flow table consistency",
      "Architecture diagram of the controller engine showing how the three functions interact with the southbound API and each other"
    ]
  },
  questions: [
    {
      q: "What are the three core functions of the SDN controller engine and what does each do?",
      a: "The Route function computes optimal forwarding paths through the network graph using algorithms like Dijkstra (shortest path), Bellman-Ford (distance-vector scenarios), or CSPF (constrained shortest path for traffic engineering). It translates computed paths into OpenFlow FLOW_MOD messages and installs them into switch flow tables via the southbound API. The Switch function manages the switch fleet — it monitors switch health via OpenFlow Echo Request/Reply heartbeats, reads port statistics (bytes, packets, errors) via STATS_REQUEST messages, tracks flow table utilisation, and detects switch disconnections or degradation. When a switch fails, it triggers rerouting through the Route function. The Rollback function maintains versioned snapshots of the complete network flow-rule state before each policy change. If a new routing policy causes congestion, routing loops, or SLA violations, the operator (or an automated detection system) invokes rollback — the controller deletes all new flow entries and reinstates the previous good-state rules across all switches simultaneously via a batch of FLOW_MOD messages. This entire operation completes in seconds and guarantees network-wide consistency.",
      type: "Conceptual"
    },
    {
      q: "How does SDN rollback differ fundamentally from traditional network configuration rollback?",
      a: "In traditional distributed networking, rolling back a routing change requires individually reconfiguring every affected router via CLI or NETCONF — a process that can take hours across a large network, during which different routers may be in different states (some already reverted, some not), creating transient routing loops or black holes. There is no single source of truth; each router's configuration is independent. SDN rollback is fundamentally different because the SDN controller is the authoritative source of all network forwarding state. When rollback is triggered, the controller issues a precisely sequenced batch of FLOW_MOD DELETE and ADD messages to restore the previous state atomically from the network's perspective — all switches receive their new (restored) rules in a coordinated sequence. The controller's versioned state store means it can restore to any previous checkpoint, not just the immediately prior state. This makes SDN rollback analogous to a database transaction rollback: atomic, consistent, and deterministic — properties impossible to achieve with distributed routing protocols.",
      type: "Analytical"
    },
    {
      q: "Calculate T_rel for V=80 switches and E=160 links using the formula T_rel = (V+E) × log₂(V+1).",
      a: "T_rel = (V + E) × log₂(V + 1) = (80 + 160) × log₂(81) = 240 × log₂(81). log₂(81) = ln(81)/ln(2) = 4.394/0.693 ≈ 6.34. T_rel = 240 × 6.34 ≈ 1,522 relative units. For comparison, V=10, E=20: T_rel = 30 × log₂(11) = 30 × 3.459 ≈ 104 relative units. So V=80/E=160 is approximately 1,522/104 ≈ 14.6x slower than V=10/E=20. This demonstrates why large SDN networks require incremental SPF (recomputing only affected segments) rather than full Dijkstra recomputation after every topology change.",
      type: "Numerical"
    },
    {
      q: "What information does the SDN controller's switch function collect from managed switches, and why is each piece important?",
      a: "The switch function collects: (1) Heartbeat status via OpenFlow Echo Request/Reply at configurable intervals (typically 1-5s) — detects switch disconnection or TCP session failure, triggering failover within the heartbeat timeout period. (2) Flow table utilisation via FLOW_STATS_REQUEST — TCAM-based flow tables have hardware limits (typically 2,000–128,000 entries); utilisation above 80% risks new flows being dropped rather than installed, causing forwarding failures that are invisible to the operator without this metric. (3) Port statistics via PORT_STATS_REQUEST — bytes_in, bytes_out, packets_in, packets_out, rx_errors, tx_errors, rx_drops, tx_drops — used by the route function to avoid congested or error-prone links in path computation. (4) Group table and meter utilisation for QoS-aware forwarding. (5) Switch description (hardware, software version) via FEATURES_REQUEST — ensures the controller does not push flow rules using actions not supported by the switch's OpenFlow version. Together these data points enable the controller to maintain a real-time, accurate model of the network's forwarding capability.",
      type: "Conceptual"
    },
    {
      q: "Why is incremental SPF (iSPF) preferred over full Dijkstra recomputation in production SDN controllers?",
      a: "Full Dijkstra recomputation after every topology change recomputes all paths from scratch — O((V+E)logV) per computation. In a large network with V=500, E=1000, this may take tens of milliseconds per computation. If a core link failure affects hundreds of active flows simultaneously, triggering hundreds of independent Dijkstra runs would saturate the controller CPU and delay rerouting by seconds. Incremental SPF (iSPF) identifies which paths are affected by the topology change (only paths that traverse the failed link or node) and recomputes only those partial trees, reusing unchanged subtrees. For a single link failure in a large sparse graph, only O(V') paths need recomputation where V' << V is the affected subtree. ONOS implements iSPF in its org.onosproject.net.topology package — measured rerouting latency for a single link failure in a 50-switch topology is typically under 50 ms including flow rule installation, compared to 200-500 ms for full SPF recomputation plus installation.",
      type: "Analytical"
    }
  ],
  virtualLab: {
    description: "You are designing a fat-tree data centre topology and need to estimate the SDN controller's path computation load during a mass rerouting event (e.g., after a spine switch failure). Your task: determine how topology size affects Dijkstra computation time. Adjust the number of switches and links. The model uses T_rel = (V+E) x log2(V+1). Find the topology size where path computation time becomes a concern, and decide whether incremental SPF is needed.",
    interpretation: "Computation grows super-linearly — dense networks (E >> V) cause the (V+E) term to dominate. A 100-switch topology with 200 links has relative time ~1,400. With 400 links, it jumps to ~3,000 — more than double. This is why fat-tree topologies deliberately limit path lengths (2-3 hops) — they keep E manageable relative to V. In production, SDN controllers use incremental SPF (ISPF) to avoid full recomputation on every topology change. Use this lab to understand why ISPF is essential for controllers managing dense fabrics.",
    parameters: [
      { id: "switches", name: "Number of Switches", min: 10, max: 200, default: 50, step: 5, unit: "" },
      { id: "links", name: "Number of Links", min: 10, max: 500, default: 100, step: 10, unit: "" }
    ],
    generateData: (params: Record<string, number>): Array<{ x: number; y: number }> => {
      const switches = params.switches || 50;
      const links = params.links || 100;
      const pts: Array<{ x: number; y: number }> = [];
      for (let x = 10; x <= switches; x += 5) {
        const E = Math.min(links, (x * (x - 1)) / 2);
        const T = Math.round((x + E) * Math.log2(x + 1));
        pts.push({ x, y: T });
      }
      return pts;
    },
    labels: { x: "Switches", y: "Relative Computation Time" }
  }
};
