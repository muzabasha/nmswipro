import type { TopicData } from './types';

export const topic44Data: TopicData = {
  id: "u4t12",
  title: "Overview of Network Slicing via ONAP Framework",
  moduleName: "Unit IV: SDN, Network Observability, and Advanced Network Management",
  context: {
    prerequisites: ["Overview of Service Orchestration", "Network Function Virtualization (NFV) Concepts (VIM, VNFM, NFVO)", "SDN Architecture and Concept"],
    dependentTopics: ["N/A — Final topic of the course"],
    nextSteps: "This is the final topic of the course. Review all units and explore 3GPP TS 28.530 (Network Slice Management) and ONAP's Service Orchestrator (SO) component documentation for deeper study."
  },
  storytelling: {
    analogy: "Virtual Private Lanes on a Shared Highway",
    story: "Network slicing is like creating virtual private lanes on a shared highway. The physical 5G infrastructure — RAN, transport, core — is the highway. Every car (packet) shares the same physical asphalt (radio spectrum, fibre, routers). But a network slice is a dedicated logical lane with guaranteed speed, capacity, and safety rules, carved from the shared infrastructure using SDN, NFV, and 3GPP control-plane extensions. The URLLC slice (ultra-reliable low latency communication) is the emergency vehicle lane: sub-1ms latency guaranteed regardless of traffic — ambulances (surgical robot commands, autonomous vehicle control) always get through. The eMBB slice (enhanced mobile broadband) is the express lane: maximum throughput for passengers (smartphone video streaming, VR). The mMTC slice (massive machine-type communication) is the slow lane for billions of IoT sensors sending tiny packets infrequently. ONAP (Open Network Automation Platform) is the highway authority: it receives a slice request (Network Slice Template — NST), instantiates the slice as a Network Slice Instance (NSI) by calling SO → NFVO → VIM → OpenStack to create the virtualised NFs, and then monitors the slice's SLA via the closed-loop automation platform — automatically scaling capacity when a slice approaches congestion before any ambulance is delayed.",
    reflectiveQuestions: [
      "How does network slicing differ from traditional Quality of Service (QoS) differentiation between traffic classes?",
      "What role does ONAP's closed-loop automation play in maintaining slice SLAs without manual operator intervention?",
      "Why is intent-based slice management (define what is needed) preferred over imperative slice management (define exactly how to provision it) for 5G operators?"
    ],
    technicalConnection: "3GPP TS 28.530 defines the Network Slice Management framework. A network slice = NST (Network Slice Template defining requirements) + NSI (Network Slice Instance, the live deployment). NSI components: NSSI (Network Slice Subnet Instance) per domain — RAN NSSI (O-RAN xApp-controlled RB allocation), TN NSSI (transport SR-TE path), CN NSSI (5GC UPF/SMF/AMF VNFs). ONAP architecture: SDC (design) → SO (orchestration) → NFVO (VNF lifecycle) → CDS (configuration) → DCAE (telemetry collection) → Policy Framework (closed-loop). S-NSSAI (Single Network Slice Selection Assistance Information) = SST (Slice Service Type: eMBB=1, URLLC=2, mMTC=3) + SD (Slice Differentiator, operator-specific). The UE requests a specific S-NSSAI during PDU Session establishment; the AMF selects the appropriate SMF/UPF from the correct CN NSSI."
  },
  mathModelling: {
    need: "A 5G operator is planning their network slicing strategy for three service types: eMBB (100 enterprise customers requiring guaranteed 500 Mbps each), URLLC (20 industrial automation customers requiring <1ms latency, 99.9999% availability), and mMTC (500 IoT platform customers, 100,000 devices each, 1KB/device/hour). The operator must choose between: static slice provisioning (fixed resource allocation per slice), dynamic slice provisioning (on-demand scaling based on demand), or intent-based slicing (ONAP closed-loop automation adjusts slices to meet stated KPI targets). Constraint: total physical capacity = 10 Tbps transport + 100 MHz 5G spectrum. OpEx budget: $5M/year for slice management. SLA breach rate must be <0.1% across all slices.",
    equation: "DECISION CONSTRAINT: Total allocated capacity across all slices must not exceed physical infrastructure. URLLC latency ≤ 1ms (zero tolerance for breach). eMBB throughput ≥ 500 Mbps per customer. mMTC device density ≥ 100,000 devices/customer. Slice management OpEx ≤ $5M/year. SLA breach rate ≤ 0.1%.",
    technicalDetails: "Static Slicing: Each slice type is pre-allocated a fixed resource block — 40% capacity for eMBB, 20% for URLLC, 40% for mMTC. Simple to operate. Problem: at 3 AM when eMBB demand is 10% of peak, 36% of the physical capacity is wasted. At peak hours, URLLC slice has no room to absorb an mMTC IoT flood. eMBB SLA breach rate at peak: ~8% (static allocation insufficient). OpEx: $2M/year (simple NMS policies). Dynamic Slicing (demand-responsive): ONAP SO monitors per-slice KPIs every 30 seconds. When eMBB utilisation exceeds 80%, SO requests additional RBs from the RAN and additional UPF capacity from OpenStack. Resources are returned when demand drops. Average utilisation improves from 40% to 72%. Peak eMBB SLA breach rate: <2%. OpEx: $4M/year (more complex automation). Intent-Based Slicing (ONAP closed-loop): Operator defines intent: 'eMBB customers must receive ≥500 Mbps with ≤0.1% breach rate'. ONAP Policy Framework translates intent to control actions. DCAE detects impending breach via ML-predicted demand 5 minutes ahead. Policy engine triggers pre-emptive scaling before breach occurs. Average utilisation: 85%. SLA breach rate: 0.08% — meets the 0.1% target. OpEx: $4.8M/year (ML platform + policy authoring). Meets all constraints.",
    explanation: [
      { term: "Static Slice Provisioning", meaning: "Adopted by operators in initial 5G deployment phases when demand is low and predictable, and operational simplicity is prioritised. Wastes 40-60% of capacity during off-peak periods. Cannot accommodate sudden demand spikes without manual intervention. Acceptable when the operator's SLA commitment is 99% uptime — not 99.9% or better." },
      { term: "Dynamic Slice Provisioning", meaning: "Adopted when operators need better resource efficiency than static allocation but have not yet invested in ML-based prediction infrastructure. ONAP SO responds to measured KPI degradation by scaling slices reactively. Reduces capacity waste from 60% (static) to ~28%. SLA breach rate improves to <2% but reactive scaling has a 30-90 second lag — insufficient for URLLC slice SLA guarantees." },
      { term: "Intent-Based Slicing with ONAP Closed-Loop (Recommended)", meaning: "Adopted when the operator has committed to strict SLA guarantees across heterogeneous slice types with financial penalties for breach. ONAP's closed-loop (DCAE + Policy Framework + SO) enables proactive scaling based on ML demand prediction, maintaining SLA breach rate at 0.08% — below the 0.1% target. $4.8M/year OpEx is justified by avoiding SLA penalty payouts, which for 100 eMBB enterprise customers at $50K/breach each represent a $5M risk per incident." }
    ],
    advantages: [
      "Intent-based slicing meets the <0.1% SLA breach rate constraint across all three service types simultaneously",
      "ML-driven demand prediction enables proactive scaling 5 minutes ahead of breach — eliminating the 30-90 second reactive scaling lag that causes URLLC violations",
      "Closed-loop automation maintains 85% average utilisation vs 40% for static slicing — more than doubling the revenue-generating capacity of the same physical infrastructure"
    ],
    limitations: [
      "Static slicing is adopted for private 5G campuses (factories, hospitals) where capacity is over-provisioned, demand is predictable, and operational simplicity is the priority",
      "Dynamic (reactive) slicing is adopted as a stepping stone — operators typically deploy reactive scaling first, then add ML prediction as operational experience with slice behaviour matures",
      "Some operators deploy intent-based slicing only for eMBB and mMTC slices while keeping URLLC statically over-provisioned to guarantee the zero-latency SLA without any automation risk"
    ]
  },
  activities: {
    level1: "Define the following 5G network slicing terms: NST (Network Slice Template), NSI (Network Slice Instance), NSSI (Network Slice Subnet Instance), S-NSSAI, SST, and SD. For each, give one concrete example value (e.g., SST=2 means URLLC).",
    level2: "Draw the ONAP closed-loop slice management architecture showing: DCAE (telemetry collection from gNBs and UPFs), Policy Framework (closed-loop policies), SO (Service Orchestrator), and CDS (Configuration Design Studio). Label the data flow: telemetry → anomaly detection → policy trigger → SO scaling action → configuration push → back to telemetry.",
    level3: "A 5G network has 100 MHz of available NR spectrum at 3.5 GHz. Static slicing allocates: eMBB 50 MHz, URLLC 20 MHz, mMTC 30 MHz. At 9 PM, eMBB demand is at 110% of its 50 MHz allocation. Calculate: (a) the bandwidth deficit for eMBB, (b) the maximum additional bandwidth available from unused mMTC allocation (mMTC is at 15% utilisation at 9 PM), (c) the new eMBB allocation after dynamic rebalancing if 80% of unused mMTC spectrum is reallocated.",
    level4: "Read 3GPP TS 28.530 Section 6 (Network Slice Management Concept). Identify: (a) the three phases of network slice lifecycle (preparation, commissioning, operation, decommissioning), (b) the interfaces between NSMF (Network Slice Management Function) and NSSMF (Network Slice Subnet Management Function), (c) how the CSMF (Communication Service Management Function) translates customer requirements to NST parameters."
  },
  projects: {
    scope: "Design and simulate a 5G network slice management system using ONAP concepts, demonstrating intent-based slice lifecycle management for a private 5G industrial campus.",
    objectives: [
      "Define three slice templates (NSTs) for a factory: eMBB for worker tablets (target: 100 Mbps/device, 50 devices), URLLC for robot control (target: <5ms RTT, 99.999% availability, 20 robots), mMTC for environmental sensors (target: 10,000 sensors, 1KB/sensor/hour)",
      "Simulate the ONAP SO orchestration workflow: NST design in SDC → NSI instantiation via SO → VNF deployment via NFVO → configuration via CDS → monitoring via DCAE",
      "Implement a simplified closed-loop policy: when URLLC RTT exceeds 3ms for >5 seconds, trigger an SO scaling action to add a second UPF VNF instance in the same edge data centre"
    ],
    deliverables: [
      "Three NST definition documents (JSON/YAML) with all required parameters, SLA targets, and resource profiles per slice type",
      "ONAP SO workflow simulation script (Python) showing the step-by-step instantiation of each NSI with logged API calls to each ONAP component",
      "Closed-loop policy demonstration: simulation log showing a URLLC latency spike, policy trigger, UPF scaling action, and latency recovery within 30 seconds"
    ]
  },
  questions: [
    {
      q: "What is a Network Slice and how does it differ from traditional QoS traffic differentiation?",
      a: "A network slice is an end-to-end, logically isolated virtual network built on shared physical infrastructure, spanning RAN, transport, and core network, with its own dedicated set of virtualised network functions and guaranteed resource allocation. It provides complete network function isolation — an eMBB slice and a URLLC slice may use entirely different UPF, SMF, and AMF instances, with no resource contention at the function level. Traditional QoS differentiates traffic by marking packets with priority bits (DSCP, 802.1p) and applying per-class scheduling and queuing policies on shared network elements. QoS is per-packet within shared infrastructure — a URLLC-marked packet is prioritised in the queue but still competes on the same physical router with millions of other packets. Network slicing guarantees isolation: the URLLC UPF is dedicated to URLLC traffic, the RAN resources are reserved, and the transport path is pre-engineered. Under heavy eMBB load, a QoS-only network may still degrade URLLC latency if queues fill; a properly isolated network slice does not.",
      type: "Conceptual"
    },
    {
      q: "What is the role of ONAP's DCAE component and the Policy Framework in closed-loop slice management?",
      a: "DCAE (Data Collection Analytics and Events) is ONAP's telemetry collection and analytics platform. It: (1) subscribes to gNMI/VES (Virtual Event Streaming) telemetry streams from gNBs, UPFs, and transport NEs; (2) runs analytics algorithms (threshold monitoring, ML anomaly detection) on the telemetry data in real time; (3) generates enriched events when it detects abnormal patterns (e.g., URLLC latency trending toward SLA threshold). The Policy Framework receives these DCAE events and matches them against closed-loop policies. A policy is an Event-Condition-Action rule: Event = 'URLLC RTT > 3ms for 5 consecutive seconds'; Condition = 'slice is in operational state'; Action = 'call SO API to scale-out UPF'. The Policy Framework invokes the action — calling ONAP SO, which in turn calls NFVO to instantiate an additional UPF VNF. The loop closes when DCAE detects that the latency has returned to normal following the scale-out. This closed loop operates without any human operator intervention, achieving sub-60-second response to predicted SLA breaches.",
      type: "Conceptual"
    },
    {
      q: "A factory's 5G URLLC slice has 99.9999% availability SLA (six nines). Calculate the maximum allowable downtime in minutes per year and per month.",
      a: "Six nines availability = 99.9999%. Downtime fraction = 1 - 0.999999 = 0.000001. Per year (365 days = 525,600 minutes): Maximum downtime = 0.000001 × 525,600 = 0.5256 minutes = 31.5 seconds per year. Per month (30 days = 43,200 minutes): Maximum downtime = 0.000001 × 43,200 = 0.0432 minutes = 2.59 seconds per month. This illustrates why static over-provisioning is the only safe approach for URLLC slice SLAs — any dynamic re-scaling carries a risk of transient latency or availability degradation that would immediately exhaust the entire annual downtime budget. A single 32-second outage per year is the limit.",
      type: "Numerical"
    },
    {
      q: "Explain the 5G network slice lifecycle phases and what operations occur in each phase.",
      a: "The 3GPP TS 28.530 network slice lifecycle has four phases: (1) Preparation Phase: The operator designs the Network Slice Template (NST) in ONAP SDC — defining SLA requirements (latency, throughput, availability), resource profiles (CPU, RAM, bandwidth), and geographic coverage. No live resources are allocated; this is a design-time activity. (2) Commissioning (Instantiation) Phase: NSMF calls NSSMF for each domain to instantiate the NSSIs. ONAP SO orchestrates VNF instantiation via NFVO (creates UPF, SMF, AMF VMs on OpenStack), SDN configuration via CDS, and RAN resource reservation via O-RAN xApps. The NSI transitions to 'configured' state. (3) Operation Phase: The NSI is active and serving subscribers. ONAP DCAE continuously monitors SLA KPIs. The Policy Framework implements closed-loop automation: scaling, rerouting, and reconfiguring the slice in response to demand changes. This is the steady-state phase lasting months to years. (4) Decommissioning Phase: When the slice is no longer needed (contract end, migration to new service design), NSMF instructs NSSMF to terminate all NSSIs. ONAP SO issues VNF terminate RPCs, returns all compute/network resources to the shared pool, and cleans up CMDB entries.",
      type: "Conceptual"
    },
    {
      q: "Why is intent-based slice management preferred over imperative slice management for large-scale 5G operators?",
      a: "Imperative slice management: the operator specifies exactly how a slice should be provisioned — 'allocate 20 RBs on cell 1, 2 vCPU UPF on server rack 3, SR-TE path via PE-A→PE-B→PE-C'. This requires expert knowledge of the current infrastructure state, manual capacity calculations, and direct knowledge of the physical topology. It does not adapt to changes — if server rack 3 fails, someone must manually reallocate. It scales poorly — managing 10,000 slices imperatively requires a very large engineering team. Intent-based slice management: the operator specifies what outcome is needed — 'provide 99.9999% available, <1ms latency URLLC slice for 20 robot controllers in Building 4'. ONAP's CSMF translates the communication service requirement to NST parameters. The NST is passed to NSMF which determines the optimal RAN resource allocation, transport path, and core VNF placement based on current infrastructure state. When infrastructure changes occur (cell upgrades, server failures, traffic pattern shifts), the closed-loop automation re-optimises the slice placement without operator intervention. Intent-based management enables one operations team to manage tens of thousands of slices — the economics of 5G as a platform business model.",
      type: "Analytical"
    }
  ],
  virtualLab: {
    description: "Simulate how static vs dynamic network slicing strategies affect resource utilisation and SLA compliance across varying traffic load levels. Adjust the traffic load percentage and number of slice types to observe the capacity utilisation gap between static (fixed allocation) and dynamic (demand-responsive) slicing.",
    interpretation: "Static slicing wastes capacity during off-peak hours because reserved resources cannot be reallocated to other slices. At low load (20%), only 8% of capacity is used by all slices combined even though 100% is reserved. Dynamic slicing reclaims unused capacity, improving utilisation to match actual demand. At high load (90%), dynamic slicing also prevents SLA breaches by temporarily borrowing capacity from low-demand slices. This efficiency gain is the primary economic justification for investing in ONAP-based slice automation.",
    parameters: [
      { id: "load", name: "Traffic Load (%)", min: 10, max: 100, default: 60, step: 5, unit: " %" },
      { id: "slices", name: "Slice Types", min: 1, max: 5, default: 3, step: 1, unit: "" }
    ],
    generateData: (params) => {
      const maxLoad = params.load || 60;
      const slices = params.slices || 3;
      const staticAlloc = 100 / slices;
      const pts: Array<{ x: number; y: number }> = [];
      for (let x = 10; x <= maxLoad; x += 5) {
        const staticUtil = Math.min(x, staticAlloc * slices);
        const wastedCapacity = staticUtil - (x * 0.85);
        pts.push({ x, y: parseFloat(Math.max(0, wastedCapacity).toFixed(1)) });
      }
      return pts;
    },
    labels: { x: "Traffic Load (%)", y: "Wasted Capacity — Static vs Dynamic (%)" }
  }
};
