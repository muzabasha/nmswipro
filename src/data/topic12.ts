import type { TopicData } from './types';

export const topic12Data: TopicData = {
  id: "u3t3",
  title: "REST APIs and ONF TAPI Overview",
  moduleName: "Unit 3: Alarm Lifecycle Management",
  context: {
    prerequisites: ["Topic 2.4: RESTCONF Protocol and Postman Operations", "Graph representation (Vertices, Edges)"],
    dependentTopics: ["Topic 3.4: Network Function Virtualization (NFV) Concepts", "Topic 4.4: Service Orchestration, Assurance, and Network Slicing (ONAP)"],
    nextSteps: "Analyze virtualized network infrastructures (NFV) in the next topic, mapping physical topologies to virtual networks."
  },
  storytelling: {
    analogy: "The Standardized Transit Map",
    story: "Imagine trying to navigate five different cities' subway systems. If each city uses a completely different set of symbols, colors, and line styles, you will get lost. But if there is a global transit mapping association (ONF TAPI) that forces every subway system to report its layout using standard stations (Nodes) and tunnels (Links) in a single JSON API format, a single app can navigate all five cities. ONF TAPI (Transport API) does this for transport networks: it provides a standardized REST API model that represents optical switches, transponders, and fiber connections, so controllers can see and provision multi-vendor optical paths.",
    reflectiveQuestions: ["Why is managing optical transport networks (DWDM, OTN) more complex than standard Ethernet routing?", "How does a standard representation of links and nodes help in path calculation?"],
    technicalConnection: "The Open Networking Foundation (ONF) created the Transport API (TAPI) to define a standardized interface for Software-Defined Transport Networks. TAPI models topology, connectivity, path computation, and virtual network services using YANG. By exposing these models through RESTful APIs, NMS systems can discover physical fiber networks and dynamically request end-to-end optical tunnels across different hardware vendors."
  },
  mathModelling: {
    need: "To calculate the serialization network payload size of a TAPI topology query, aiding in network capacity planning for central SDN orchestrators.",
    equation: "S_{topo} = V \\times S_{node} + E \\times S_{link}",
    technicalDetails: "A transport network is modeled as a graph \\(G = (V, E)\\), where \\(V\\) represents the set of nodes (optical switches) and \\(E\\) represents links (physical fibers). When an NMS fetches the topology via REST/JSON, the payload size \\(S_{topo}\\) is the sum of the serialized data for all nodes and links. Standardizing node metadata size \\(S_{node}\\) and link metadata size \\(S_{link}\\) allows planners to estimate NMS bandwidth usage when polling massive networks with thousands of optical fibers.",
    explanation: [
      { term: "S_topo", meaning: "Total size of the topology JSON payload (bytes)." },
      { term: "V", meaning: "Total number of nodes (optical network elements) in the topology." },
      { term: "S_node", meaning: "Average size of a single serialized node record (bytes)." },
      { term: "E", meaning: "Total number of links (optical spans) connecting the nodes." },
      { term: "S_link", meaning: "Average size of a single serialized link record (bytes)." }
    ],
    advantages: ["Enables predicting the bandwidth overhead of periodic topology updates.", "Assists in optimization of topology caching policies on NMS servers."],
    limitations: ["Does not account for nested node ports (Connection Termination Points) which can expand node size dynamically."],
    simulation: {
      description: "Adjust the node count, link count, and average record sizes to see the total serialized topology payload size.",
      parameters: [
        { id: "nodesCount", name: "Nodes Count (V)", min: 10, max: 500, default: 100, step: 10, unit: " nodes" },
        { id: "linksCount", name: "Links Count (E)", min: 10, max: 1000, default: 200, step: 10, unit: " links" },
        { id: "nodeSizeB", name: "Node Record Size", min: 500, max: 2000, default: 800, step: 100, unit: " B" }
      ]
    }
  },
  activities: {
    level1: "Teacher displays a sample ONF TAPI JSON response containing a 'topology' object with nodes and links.",
    level2: "Students trace the route between two nodes on an optical map using a JSON TAPI links array.",
    level3: "Class Exercise: Write a simplified JSON structure representing an optical link, specifying wavelength capacity and endpoint node IDs.",
    level4: "Write a short summary (150 words) on why path computation (calculating optical routes) is separated into a dedicated TAPI service layer."
  },
  projects: {
    scope: "Design a TAPI-compliant network database schema.",
    objectives: ["Create SQL or NoSQL structures representing TAPI Node, Link, and Connection tables", "Draft the REST API endpoints to POST a new connection request"],
    deliverables: ["Database schema diagram", "API Endpoint definition document (YAML/JSON)"]
  },
  questions: [
    { q: "What does TAPI stand for and what is its primary focus?", a: "TAPI stands for Transport API, and it focuses on standardizing northbound interfaces for controlling optical and physical transport network layers.", type: "Conceptual" },
    { q: "Given a network with 200 nodes and 300 links, calculate the topology payload size (in KB) if a node record is 1000 bytes and a link record is 500 bytes.", a: "S_topo = (200 * 1000) + (300 * 500) = 200,000 + 150,000 = 350,000 bytes. In KB, 350,000 / 1000 = 350 KB.", type: "Numerical" },
    { q: "Name three services defined within the ONF TAPI specification.", a: "Topology Service, Connectivity Service, Path Computation Service (and Notification/Virtual Network Services).", type: "Conceptual" },
    { q: "Why is topology representation in TAPI modeled as a graph containing links and nodes?", a: "Because optical networks rely on physical connectivity (fibers) between specific locations (switches). Representing them as a mathematical graph allows path computation algorithms to compute shortest optical paths and allocate wavelengths dynamically.", type: "Analytical" },
    { q: "How does TAPI help in multi-domain transport networks?", a: "It provides a vendor-neutral API model that abstracts the underlying optical hardware. A multi-domain orchestrator can use a single TAPI interface to manage domains controlled by different vendors' SDN controllers.", type: "Analytical" }
  ],
  virtualLab: {
    description: "ONF TAPI Topology Explorer. Click to add nodes and connect them with links. Observe how the backend constructs the TAPI-compliant JSON structure in real-time.",
    interpretation: "Adding elements expands the JSON arrays of nodes and links. Standardizing this graph model allows any compatible SDN path controller (like ONOS) to calculate routes instantly, regardless of physical vendor hardware details.",
    parameters: [
      { id: "averageLinkCapacity", name: "Link Capacity", min: 10, max: 400, default: 100, unit: " Gbps" }
    ]
  }
};
