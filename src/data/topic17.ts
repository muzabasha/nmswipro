import type { TopicData } from './types';

export const topic17Data: TopicData = {
  id: "u4t4",
  title: "Service Orchestration, Assurance, and Network Slicing (ONAP)",
  moduleName: "Unit 4: SDN, Network Observability, and Advanced Management",
  context: {
    prerequisites: ["Topic 4.3: Data Analytics with AI/ML in Observability", "5G Network Fundamentals"],
    dependentTopics: [],
    nextSteps: "This concludes the Network Management System course syllabus! You are now prepared to analyze and deploy next-generation NMS architectures."
  },
  storytelling: {
    analogy: "The Dedicated Highway Lanes",
    story: "Imagine a highway. Normally, ambulances, cargo trucks, and commuter cars share the same lanes. During rush hour, the ambulance gets stuck in traffic (congested packets). In a sliced highway network, the traffic authority paints special lanes: one lane is strictly reserved for ambulances and emergency response (Low Latency Slice), one for heavy freight trucks (High Bandwidth Slice), and one for standard cars. ONAP (Open Network Automation Platform) acts as the highway construction and traffic management system: it instantly paints these lanes dynamically across physical and virtual infrastructures, monitors them for quality, and adjusts lane boundaries to guarantee everyone gets their service requirements.",
    reflectiveQuestions: ["Why is sharing the same physical network links for emergency services and normal web browsing risky?", "How does network slicing enable mobile operators to charge different rates for different service tiers?"],
    technicalConnection: "Service Orchestration (via platforms like ONAP) coordinates the lifecycle of virtual network services. In 5G networks, Service Orchestration enables Network Slicing—the creation of virtual end-to-end networks on top of a single shared physical infrastructure. Slices are customized for specific SLA demands like URLLC (low latency) or eMBB (high bandwidth), managed through a continuous closed-loop assurance feedback loop."
  },
  mathModelling: {
    need: "To model the end-to-end latency of a 5G network slice to ensure it meets strict URLLC or eMBB Service Level Agreement (SLA) constraints.",
    equation: "L_{slice} = \\sum_{j=1}^{M} \\left( D_{prop, j} + \\frac{S_{packet}}{C_{slice, j}} \\right)",
    technicalDetails: "A network slice spans \\(M\\) links from the user device to the core datacenter. The total slice latency \\(L_{slice}\\) is the sum of the link propagation delays \\(D_{prop, j}\\) and packet transmission delays \\(S_{packet} / C_{slice, j}\\), where \\(S_{packet}\\) is the packet size in bits and \\(C_{slice, j}\\) is the reserved virtual bandwidth capacity of the slice on link \\(j\\). By allocating more bandwidth to a slice, the transmission delay drops. ONAP uses this model to dynamically increase slice capacity when measured latency approaches the SLA limit.",
    explanation: [
      { term: "L_slice", meaning: "Total end-to-end latency experienced by packets within the network slice (seconds)." },
      { term: "M", meaning: "Total number of network links traversed by the slice." },
      { term: "D_{prop, j}", meaning: "Propagation delay of link j, determined by fiber length and speed of light (seconds)." },
      { term: "S_packet", meaning: "Size of the transmitted network packet (bits)." },
      { term: "C_slice, j", meaning: "Reserved bandwidth capacity allocated to the slice on link j (bits per second)." }
    ],
    advantages: ["Enables automated SLA enforcement by predicting latency violation thresholds.", "Aids in mathematical validation of slice resource partitioning policies."],
    limitations: ["Does not account for virtual queuing variations under sudden traffic bursts or scheduling jitter in hypervisors."],
    simulation: {
      description: "Adjust the packet size, link count, and reserved slice bandwidth to observe the end-to-end slice latency.",
      parameters: [
        { id: "reservedBwMbps", name: "Slice Bandwidth", min: 1, max: 100, default: 10, step: 1, unit: " Mbps" },
        { id: "packetBits", name: "Packet Size", min: 500, max: 1500, default: 1000, step: 100, unit: " Bytes" },
        { id: "hopsCount", name: "Link Hops (M)", min: 1, max: 10, default: 3, step: 1, unit: " hops" }
      ]
    }
  },
  activities: {
    level1: "Teacher displays a slide showing the ONAP architectural components: Design-time (SDC) and Run-time (SO, AAI, DCAE).",
    level2: "Students match 3 types of 5G slices: eMBB (Broadband), URLLC (Low Latency), and mMTC (IoT) to their typical applications (Streaming, Autonomous Driving, Smart Meters).",
    level3: "Class Exercise: Calculate the transmission delay of a 12,000-bit packet over a 10 Mbps sliced channel.",
    level4: "Write a 150-word paper explaining the role of closed-loop automation in service assurance, referencing ONAP DCAE and Policy engines."
  },
  projects: {
    scope: "Design a service orchestration workflow.",
    objectives: ["Flowchart the steps to instantiate a new network slice, including checking physical inventory, allocating IP subnets, and configuring base stations", "Define the SLA verification metrics"],
    deliverables: ["Orchestration Flowchart (PDF/Image)", "SLA validation schema"]
  },
  questions: [
    { q: "What are the three main service categories defined for 5G network slicing?", a: "Enhanced Mobile Broadband (eMBB), Ultra-Reliable Low-Latency Communications (URLLC), and Massive Machine Type Communications (mMTC).", type: "Conceptual" },
    { q: "Calculate the total latency L_slice over a path of M = 3 links if the propagation delay of each link is 2ms, the packet size is 8000 bits, and the slice capacity is 2 Mbps (2,000,000 bps) on all links.", a: "L_slice = 3 * 0.002 + 3 * (8000 / 2,000,000) = 0.006 + 3 * 0.004 = 0.006 + 0.012 = 0.018 seconds or 188ms. Wait, let's recalculate: L_slice = (0.002 + 8000 / 2000000) * 3 = (0.002 + 0.004) * 3 = 0.006 * 3 = 0.018 seconds or 18 milliseconds.", type: "Numerical" },
    { q: "What does ONAP stand for and what is its purpose?", a: "ONAP stands for Open Network Automation Platform. It provides a comprehensive platform for real-time, policy-driven orchestration and automation of physical and virtual network services.", type: "Conceptual" },
    { q: "Explain the role of DCAE (Data Collection Analytics and Events) in ONAP closed-loop control.", a: "DCAE collects telemetry and event logs from virtual services and devices, analyzes the data for anomalies or SLA violations, and sends trigger events to the Policy and Orchestration engines to perform healing or scaling.", type: "Analytical" },
    { q: "How does network slicing differ from simple VLAN partitioning?", a: "VLANs only partition traffic at the Layer 2 Ethernet frame level within a local switch path. 5G Network Slicing creates virtual end-to-end networks spanning base stations, transit fiber routing, virtual hypervisors, and core applications, each with isolated QoS and SLA guarantees.", type: "Analytical" }
  ],
  virtualLab: {
    description: "ONAP closed-loop network slicing simulator. Launch slices and simulate traffic congestion. Trigger ONAP policies to scale-up slice bandwidth dynamically when latency violations occur.",
    interpretation: "Under heavy load, latency spikes. The DCAE telemetry engine detects this, matches it to a policy rule, and triggers the Service Orchestrator to allocate more capacity, automatically dropping latency back within SLA limits.",
    parameters: [
      { id: "congestionLevel", name: "Background Congestion", min: 10, max: 90, default: 40, unit: "%" }
    ]
  }
};
