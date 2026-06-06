import type { TopicData } from './types';

export const topic13Data: TopicData = {
  id: "u3t4",
  title: "Network Function Virtualization (NFV) Concepts",
  moduleName: "Unit 3: Alarm Lifecycle Management",
  context: {
    prerequisites: ["Topic 3.3: REST APIs and ONF TAPI Overview", "Virtual Machines & Hypervisors"],
    dependentTopics: ["Topic 4.4: Service Orchestration, Assurance, and Network Slicing (ONAP)", "Topic 4.1: SDN Architecture and Controller Engine Functions"],
    nextSteps: "Begin Unit 4: SDN and Network Observability, studying how virtualized network nodes are controlled dynamically."
  },
  storytelling: {
    analogy: "The Smartphone Apps vs. Single-Purpose Devices",
    story: "In the 1990s, if you wanted to take a photo, navigate with GPS, listen to music, and check the time, you had to buy four separate physical devices (camera, GPS receiver, walkman, watch). Today, you buy one physical device (a smartphone) and run all these functions as software apps (Virtual Network Functions - VNFs). NFV does exactly this for network hardware: instead of buying proprietary physical firewalls, load balancers, and routers from different vendors, operators deploy standard off-the-shelf servers (x86) and run these appliances as virtual machines or containers.",
    reflectiveQuestions: ["Why is it cheaper to run a software firewall on standard servers than buying a dedicated physical appliance?", "What are the performance challenges of software routers compared to specialized hardware ASICs?"],
    technicalConnection: "NFV (Network Function Virtualization) replaces proprietary network hardware with Virtual Network Functions (VNFs) running on standard server virtualization platforms. The ETSI NFV framework defines the standard architecture, which includes VNFs, NFV Infrastructure (NFVI - compute, storage, networking resources), and MANO (Management and Orchestration), which coordinates virtual resource allocation."
  },
  mathModelling: {
    need: "To model the physical host CPU utilization in an NFV cloud to prevent CPU exhaustion and ensure virtual network function performance.",
    equation: "U_{host} = \\frac{\\sum_{i=1}^{K} C_{VNF, i} + C_{hypervisor}}{C_{physical}}",
    technicalDetails: "An NFV orchestrator (like MANO) schedules virtual functions onto physical hypervisors. The total host CPU utilization \\(U_{host}\\) is the sum of the CPU core demands of the \\(K\\) active VNFs running on the host, plus the hypervisor management CPU overhead \\(C_{hypervisor}\\), divided by the total physical CPU core capacity \\(C_{physical}\\). If \\(U_{host}\\) exceeds a threshold (typically 80%), the orchestrator must spin up a new physical server and migrate VNFs using VM live-migration to prevent packet loss.",
    explanation: [
      { term: "U_host", meaning: "Overall CPU utilization of the physical hypervisor host (value between 0 and 1)." },
      { term: "C_VNF, i", meaning: "Number of CPU cores allocated and used by Virtual Network Function (VNF) i." },
      { term: "C_hypervisor", meaning: "CPU overhead cores consumed by the virtualization layer and virtual switch (vSwitch)." },
      { term: "C_physical", meaning: "Total number of physical CPU cores available on the hardware host." }
    ],
    advantages: ["Helps MANO orchestrators make placement and auto-scaling decisions.", "Prevents over-provisioning of expensive server hardware."],
    limitations: ["Does not account for memory, I/O, or cache contention between adjacent virtual machines."],
    simulation: {
      description: "Adjust the number of VNFs, average VNF core count, and hypervisor overhead to observe hypervisor core utilization.",
      parameters: [
        { id: "vnfCount", name: "VNF Count (K)", min: 1, max: 16, default: 4, step: 1, unit: " VNFs" },
        { id: "vnfCores", name: "Cores per VNF", min: 1, max: 8, default: 2, step: 1, unit: " cores" },
        { id: "hostCores", name: "Physical Cores", min: 8, max: 64, default: 16, step: 8, unit: " cores" }
      ]
    }
  },
  activities: {
    level1: "Teacher displays a slide showing the ETSI NFV architectural framework: VNF, NFVI, and NFV MANO.",
    level2: "Students list 3 network functions that can be virtualized (e.g., Firewall, DHCP, IMS).",
    level3: "Group Exercise: Students design a recovery flow when a physical server hosting a virtual firewall suffers a hardware crash.",
    level4: "Write a comparative review (150 words) on the benefits and drawbacks of running virtualized network functions (VNFs) in containers (CNFs) vs. Virtual Machines (VMs)."
  },
  projects: {
    scope: "Design an NFV resource template.",
    objectives: ["Write a YAML descriptor file (VNF Descriptor - VNFD) specifying CPU, memory, and storage requirements for a virtual router", "Define network connection points for input and output interfaces"],
    deliverables: ["VNF Descriptor YAML snippet", "Orchestration lifecycle flowchart"]
  },
  questions: [
    { q: "What does the ETSI NFV framework consist of in terms of its three major blocks?", a: "Virtual Network Functions (VNFs), NFV Infrastructure (NFVI), and NFV Management and Orchestration (NFV MANO).", type: "Conceptual" },
    { q: "A hypervisor host has 32 physical cores. It runs 6 VNFs demanding 4 cores each, and the hypervisor/vSwitch overhead is 2 cores. Calculate the host CPU utilization U_host.", a: "U_host = (6 * 4 + 2) / 32 = (24 + 2) / 32 = 26 / 32 = 0.8125 or 81.25%.", type: "Numerical" },
    { q: "What is the difference between a physical network function (PNF) and a virtual network function (VNF)?", a: "A PNF is a dedicated, single-purpose proprietary hardware appliance, whereas a VNF is a software implementation of a network function that runs inside a VM or container on generic hardware.", type: "Conceptual" },
    { q: "What are the three components of NFV MANO?", a: "NFV Orchestrator (NFVO), VNF Manager (VNFM), and Virtualized Infrastructure Manager (VIM).", type: "Conceptual" },
    { q: "Why is vSwitch CPU overhead a significant consideration in NFV performance planning?", a: "Because a virtual switch must process and route packets in software between physical NICs and virtual machines. This consumes hypervisor CPU cycles that would otherwise be allocated to VNFs, especially under high packet rates.", type: "Analytical" }
  ],
  virtualLab: {
    description: "NFV VNF Provisioning and Scale-out Lab. Spin up virtual network instances and monitor physical host resource usage. Try triggering auto-scaling when CPU usage peaks.",
    interpretation: "As load increases, the active VNF CPU spikes. Triggering auto-scale spins up a duplicate VNF instance, distributing the load and dropping host CPU back to safe limits, demonstrating NFV elasticity.",
    parameters: [
      { id: "trafficLoad", name: "Incoming Traffic", min: 10, max: 100, default: 30, unit: " Mbps" }
    ]
  }
};
