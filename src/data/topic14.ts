import type { TopicData } from './types';

export const topic14Data: TopicData = {
  id: "u4t1",
  title: "SDN Architecture and Controller Engine Functions",
  moduleName: "Unit 4: SDN, Network Observability, and Advanced Management",
  context: {
    prerequisites: ["Topic 3.4: Network Function Virtualization (NFV) Concepts", "Routing Protocols (OSPF, BGP)"],
    dependentTopics: ["Topic 4.2: Network Observability vs. Monitoring", "Topic 4.4: Service Orchestration, Assurance, and Network Slicing (ONAP)"],
    nextSteps: "Explore how controllers push telemetry to enable Network Observability instead of simple polling in the next topic."
  },
  storytelling: {
    analogy: "The Coordinated Traffic Signals vs. Individual Drivers",
    story: "In a traditional town, every driver (Router) makes their own routing decisions at every intersection, looking only at the signs nearby. If a street gets jammed, they don't know it until they hit it. In a Software-Defined Town (SDN), a central Traffic Control Center (SDN Controller) watches the entire town via cameras. It calculates the fastest routes for all cars and dynamically configures the traffic lights and signs (Flow Tables) at every intersection from a single console. Drivers just follow the lights without having to decide, preventing traffic jams and enabling emergency vehicles to get green lights all the way.",
    reflectiveQuestions: ["What happens if the central traffic control system goes offline?", "Why is it faster to update a central map than wait for 100 drivers to talk to each other?"],
    technicalConnection: "Software-Defined Networking (SDN) separates the control plane (routing decisions, path calculations) from the data plane (packet forwarding hardware). A central SDN Controller (like ONOS or OpenDaylight) runs the control plane software, exposing Southbound interfaces (like OpenFlow or gNMI) to write flow entries into switch forwarding tables, and Northbound interfaces (REST APIs) to let orchestrators request network services."
  },
  mathModelling: {
    need: "To model the path re-calculation processing delay of an SDN controller when a link failure occurs, using graph-theory-based Dijkstra complexity.",
    equation: "T_{recalc} = \\beta \\times (V \\log V + E)",
    technicalDetails: "When a network link fails, the central SDN controller must recompute the shortest paths for all active traffic flows. Representing the network topology as a graph \\(G = (V, E)\\) with vertices \\(V\\) (switches) and edges \\(E\\) (links), the computational time complexity for Dijkstra's shortest path algorithm using a binary heap is \\(O(V \\log V + E)\\). The processing time \\(T_{recalc}\\) represents this load, scaled by controller efficiency coefficient \\(\\beta\\). For massive networks (high \\(V\\) and \\(E\\)), path calculation spikes can saturate controller CPU cores, requiring multi-threaded clustering.",
    explanation: [
      { term: "T_recalc", meaning: "Time taken by the SDN controller to recompute routing paths (milliseconds)." },
      { term: "\\beta", meaning: "Controller hardware processing coefficient (ms per algorithm step)." },
      { term: "V", meaning: "Number of network switches (nodes) in the controller topology." },
      { term: "E", meaning: "Number of active inter-switch links (edges) in the topology." }
    ],
    advantages: ["Determines maximum network scale an SDN controller can manage before suffering path latency spikes.", "Enables network architects to calculate flow restoration times during fiber cuts."],
    limitations: ["Does not model flow table entry installation delays over the southbound interface."],
    simulation: {
      description: "Vary the number of switches (V) and links (E) to observe the non-linear growth in path re-calculation time.",
      parameters: [
        { id: "nodesV", name: "Switches Count (V)", min: 10, max: 1000, default: 100, step: 10, unit: " switches" },
        { id: "edgesE", name: "Links Count (E)", min: 20, max: 5000, default: 300, step: 50, unit: " links" },
        { id: "betaCoef", name: "Hardware Scale (β)", min: 0.0001, max: 0.005, default: 0.001, step: 0.0001, unit: "" }
      ]
    }
  },
  activities: {
    level1: "Teacher displays a diagram illustrating the 3 SDN layers: Application Layer -> Northbound -> Control Layer -> Southbound -> Infrastructure Layer.",
    level2: "Students identify whether OpenFlow, gNMI, and REST APIs are Southbound or Northbound interfaces.",
    level3: "Class Exercise: Given a small 5-switch topology, students calculate flow table entries for routing a packet from Switch 1 to Switch 5.",
    level4: "Write a 150-word essay evaluating the 'Single Point of Failure' vulnerability of a centralized SDN controller and how clustering mitigates it."
  },
  projects: {
    scope: "Design an SDN flow-table rule database.",
    objectives: ["Create a JSON representation of an OpenFlow table entry", "Specify match fields (Ingress Port, Source IP, EtherType) and actions (Forward to Port, Drop, Modify VLAN)"],
    deliverables: ["JSON Flow rule entry sample", "1-page installation workflow diagram"]
  },
  questions: [
    { q: "What is the key structural division introduced by Software-Defined Networking (SDN)?", a: "SDN separates the Control Plane (which decides how packets are routed) from the Data Plane (which forwards packets based on those decisions).", type: "Conceptual" },
    { q: "Calculate the path recomputation time T_recalc for an SDN network with 200 switches (V) and 800 links (E) if the hardware coefficient β is 0.0005 ms.", a: "V log V = 200 * log_2(200) ≈ 200 * 7.64 = 1528. T_recalc = 0.0005 * (1528 + 800) = 0.0005 * 2328 ≈ 1.16 milliseconds.", type: "Numerical" },
    { q: "What are the roles of Southbound Interfaces (SBI) and Northbound Interfaces (NBI) in an SDN controller?", a: "The SBI (e.g., OpenFlow, NETCONF) allows the controller to communicate with and configure switches, while the NBI (e.g., REST API) allows business applications and orchestrators to program the controller.", type: "Conceptual" },
    { q: "How does OpenFlow configure packet forwarding on a network switch?", a: "By installing flow entries in the switch's flow tables. Each entry contains match criteria (e.g., VLAN ID, destination IP) and actions (e.g., output to port 3, rewrite MAC).", type: "Conceptual" },
    { q: "Why is a central SDN controller better at traffic engineering compared to traditional distributed routing protocols?", a: "Because the SDN controller possesses a global topology view of the entire network and traffic state, allowing it to optimize routes globally, whereas traditional protocols calculate paths based only on local neighbor information.", type: "Analytical" }
  ],
  virtualLab: {
    description: "SDN Centralized Controller Simulator. Click on links to fail them and monitor the time taken by the controller to recompute paths and push new rules down to switches.",
    interpretation: "Failing a link triggers an immediate OpenFlow PortStatus message to the controller. The controller runs Dijkstra's algorithm and issues flow mod updates, illustrating dynamic SDN path restoration.",
    parameters: [
      { id: "flowThroughput", name: "Active Flows", min: 100, max: 10000, default: 1000, unit: " flows" }
    ]
  }
};
