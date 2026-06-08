import type { TopicData } from './types';

export const topic1Data: TopicData = {
  id: "u1t1",
  title: "Understanding of Mobile Network",
  moduleName: "Unit I: Introduction to Network Management and Frameworks",
  context: {
    prerequisites: ["Basic Networking Concepts", "OSI/TCP-IP Model"],
    dependentTopics: ["eTOM and TMN Framework", "EMS and NMS Architecture"],
    nextSteps: "Study the eTOM and TMN frameworks that standardize mobile network management processes."
  },
  storytelling: {
    analogy: "A City's Transportation Grid",
    story: "A mobile network is like a city's transportation system — roads (radio links), vehicles (data packets), traffic lights (base stations), and a central control room (NMS). The city has zones: the Radio Access Network (RAN) covers local streets, the Core Network is the highway system, and the Management Plane is the traffic control center that monitors everything. Just as a city planner needs to know how many cars are on each road, a network engineer monitors cell load, signal strength, and handovers. When roads get congested, the planner reroutes traffic — just as an NMS triggers load balancing when a cell is overloaded. 2G/3G/4G/5G represent upgrades from dirt roads to smart motorways, each generation adding more lanes, smarter signals, and autonomous vehicle support. Without the central control room, the city would grind to a halt — and without the Management Plane, even a perfectly built network becomes unmanageable.",
    reflectiveQuestions: [
      "How does a mobile network differ from a fixed-line network?",
      "Why is the Core Network separated from the Radio Access Network?",
      "What happens to a call when a user moves between two cell towers?"
    ],
    technicalConnection: "A mobile network consists of UE (User Equipment), RAN (Radio Access Network — eNB/gNB), Core Network (EPC/5GC), and the Management Plane. The RAN handles the air interface using licensed spectrum, the Core Network provides IP connectivity, authentication, and session management, while the Management Plane (NMS/OSS) collects KPIs, alarms, and configuration data from every layer."
  },
  mathModelling: {
    need: "A regional ISP must deploy 5G NR base stations (gNBs) across a 500 km² semi-urban area. The engineering team faces three competing constraints: coverage (every resident must have signal), capacity (peak hour throughput must support 1000 concurrent HD video streams per cell), and cost (total CapEx budget is $15M). They must choose between Macro-cell only, Macro + Small-cell hybrid, or Dense Small-cell deployment strategies. Each option makes different trade-offs.",
    equation: "DECISION CONSTRAINT: Coverage × Capacity / Cost ≤ Budget. Macro cells cover more area but hit capacity limits. Small cells add capacity but multiply CapEx. The optimal strategy maximises service quality per dollar within the budget envelope.",
    technicalDetails: "Macro-cell only (3.5 GHz, 200W): 15 sites × $350K each = $5.25M. Each site covers ~6 km² and supports 800 Mbps aggregate, serving ~600 concurrent users. Insufficient for 1000-stream requirement at peak. Macro + Small-cell hybrid: 10 macro sites (traffic anchoring) + 30 small cells (capacity offload) = $3.5M + $4.5M = $8M. Meets 1000-stream target with macro handling wide coverage and small cells handling hotspots (stadiums, shopping centres). Dense small-cell only: 80 small cells × $150K = $12M. Achieves highest capacity but has coverage gaps between cells and requires 80 backhaul connections. The hybrid approach delivers the best capacity-per-dollar ratio within budget.",
    explanation: [
      { term: "Macro-Cell Only", meaning: "Adopted when budget is severely constrained and coverage is prioritised over capacity. Typical in rural deployments where population density does not justify small-cell investment. Does not meet peak capacity requirements for dense semi-urban areas." },
      { term: "Macro + Small-Cell Hybrid (Recommended)", meaning: "Adopted when both coverage and capacity must be satisfied within a constrained budget. Macro cells provide ubiquitous coverage and handle mobility; small cells handle capacity hotspots. This is the standard 5G deployment strategy for urban and semi-urban areas worldwide." },
      { term: "Dense Small-Cell Only", meaning: "Adopted in ultra-dense urban environments (CBDs, stadiums) where capacity demand is extreme and area is small. Requires extensive backhaul investment and is impractical for large areas due to the cost of connecting 80+ sites to core infrastructure." }
    ],
    advantages: [
      "Hybrid strategy meets all three constraints simultaneously — coverage, capacity, and budget",
      "Macro cells handle mobility and seamless handovers that small cells cannot manage alone",
      "Small-cell placement targets actual capacity hotspots, maximising return on investment"
    ],
    limitations: [
      "Macro-only is chosen when coverage is the sole requirement and budget cannot support small cells",
      "Dense small-cell is chosen when the deployment area is tiny (single building or campus) and capacity demand is extreme",
      "Small-cell-only is also chosen for indoor enterprise deployments where macro penetration is inadequate"
    ]
  },
  activities: {
    level1: "List and define the key components of a mobile network: UE (User Equipment), RAN (Radio Access Network), Core Network, and Management Plane. For each component, write a one-sentence description of its primary function.",
    level2: "Draw a layered diagram showing how a voice call travels from a mobile phone through the RAN (eNB), Core Network (MME, S-GW, P-GW in 4G), and out to the PSTN or another mobile subscriber. Label all interfaces.",
    level3: "Using Shannon's formula C = B × log₂(1 + SNR), calculate the maximum capacity of a 20 MHz LTE channel at SNR = 15 dB. Convert SNR from dB to linear first: SNR_linear = 10^(15/10) ≈ 31.62. Then compute C in Mbps.",
    level4: "Research the differences between 4G LTE (EPC architecture with MME, S-GW, P-GW, HSS) and 5G NR (5GC architecture with AMF, SMF, UPF, and service-based interfaces). Write a comparison report covering architecture, latency targets, spectrum bands, and management implications."
  },
  projects: {
    scope: "Design and simulate a simplified mobile network topology for a university campus covering 4 buildings and an outdoor sports ground.",
    objectives: [
      "Identify the required RAN elements (eNBs/gNBs) for full coverage using coverage radius and propagation model assumptions",
      "Define Core Network elements and their interfaces (S1-MME, S1-U, S11, SGi) for a 4G EPC deployment",
      "Model peak traffic load per cell and apply Shannon's theorem to validate that the planned bandwidth meets demand"
    ],
    deliverables: [
      "Network topology diagram showing cell placements, coverage areas, and interface labels",
      "Capacity calculation worksheet with Shannon's formula applied to each cell at peak and average SNR",
      "2-page comparison report on 4G vs 5G architecture trade-offs for the campus deployment scenario"
    ]
  },
  questions: [
    {
      q: "What are the four main components of a mobile network?",
      a: "The four main components are: (1) UE (User Equipment) — the end-user device such as a smartphone; (2) RAN (Radio Access Network) — comprising eNBs (4G) or gNBs (5G) that provide the air interface; (3) Core Network — providing IP connectivity, authentication, mobility management (EPC in 4G, 5GC in 5G); and (4) Management Plane — the NMS/OSS layer that monitors, configures, and manages all network elements.",
      type: "Conceptual"
    },
    {
      q: "Differentiate between the RAN and the Core Network in terms of function and interfaces.",
      a: "The RAN (Radio Access Network) handles the wireless air interface between UE and base stations (eNB/gNB). It manages radio resource allocation, modulation, coding, and handovers. Its key interface to the Core is S1 (in 4G). The Core Network handles user authentication (HSS/UDM), session management (MME/AMF), IP address assignment, and internet breakout (P-GW/UPF). The Core also connects to external networks via the SGi/N6 interface. In short: RAN = wireless connectivity; Core = IP services, mobility, and security.",
      type: "Conceptual"
    },
    {
      q: "Calculate the theoretical channel capacity for B = 10 MHz and SNR = 20 dB (SNR linear = 100).",
      a: "Using C = B × log₂(1 + SNR_linear): C = 10×10⁶ × log₂(1 + 100) = 10×10⁶ × log₂(101) = 10×10⁶ × 6.658 ≈ 66.58 Mbps. This is the theoretical Shannon limit for a 10 MHz channel at 20 dB SNR.",
      type: "Numerical"
    },
    {
      q: "Why does the effective SNR per user decrease as more users share a cell?",
      a: "In LTE/5G, a cell's total bandwidth (e.g., 20 MHz = 100 Resource Blocks) is divided among active users by the scheduler. As the number of users increases, each user receives fewer Resource Blocks, effectively reducing their allocated bandwidth. Additionally, inter-user interference in the uplink and pilot contamination in massive MIMO further reduce the per-user SINR. Thus, both the allocated bandwidth (B) and SNR degrade simultaneously, causing per-user capacity to fall roughly as C_user ≈ (B/N) × log₂(1 + SNR_eff), where N is the number of users.",
      type: "Analytical"
    },
    {
      q: "What role does the Management Plane play in a mobile network?",
      a: "The Management Plane sits above the User Plane and Control Plane. It is responsible for: (1) Fault Management — detecting and alarming on failures in RAN and Core elements; (2) Configuration Management — provisioning base stations, setting parameters; (3) Performance Management — collecting KPIs like throughput, latency, handover success rate; (4) Security Management — enforcing access control policies on network elements. The NMS/OSS tools in the Management Plane enable operators to maintain network quality without manual inspection of individual elements.",
      type: "Conceptual"
    }
  ],
  virtualLab: {
    description: "This lab simulates how per-user throughput changes as more users share the same cell bandwidth. The total cell bandwidth is divided equally among all active users, and Shannon's formula is applied at a fixed SNR of 10 dB to compute per-user capacity. Adjust the total bandwidth and maximum number of users to observe the trade-off.",
    interpretation: "As more users share the same cell bandwidth, the per-user throughput drops rapidly — roughly inversely proportional to the number of users. This illustrates the need for cell densification (deploying more small cells), efficient scheduling algorithms, and techniques like OFDMA and MIMO to serve more users without proportional throughput loss.",
    parameters: [
      { id: "totalBw", name: "Total Bandwidth", min: 10, max: 100, default: 20, step: 10, unit: " MHz" },
      { id: "users", name: "Number of Users", min: 1, max: 50, default: 10, step: 1, unit: "" }
    ],
    generateData: (params) => {
      const totalBw = params.totalBw || 20;
      const maxUsers = params.users || 10;
      const snrLinear = 10; // fixed 10 dB SNR
      const pts: Array<{ x: number; y: number }> = [];
      for (let u = 1; u <= maxUsers; u++) {
        const perUserBw = (totalBw / u) * 1e6;
        const throughput = perUserBw * Math.log2(1 + snrLinear) / 1e6;
        pts.push({ x: u, y: parseFloat(throughput.toFixed(3)) });
      }
      return pts;
    },
    labels: { x: "Number of Users", y: "Per-User Throughput (Mbps)" }
  }
};
