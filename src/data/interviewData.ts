export interface InterviewQuestion {
  id: string;
  question: string;
  answer: string[];
  tip?: string;
}

export interface JobRole {
  id: string;
  title: string;
  description: string;
  skillsRequired: string[];
  experienceLevel: string;
  averageSalary: string;
  companies: string[];
  questions: InterviewQuestion[];
}

export const jobRoles: JobRole[] = [
  {
    id: "network-engineer",
    title: "Network Engineer",
    description: "Design, implement, and maintain enterprise and service provider networks. Manage routing, switching, and network security infrastructure.",
    skillsRequired: [
      "TCP/IP, OSI model, subnetting, VLANs",
      "Routing protocols (OSPF, BGP, EIGRP)",
      "Switching (STP, LACP, VLANs, trunking)",
      "SNMP monitoring and NMS tools",
      "Firewall and ACL configuration",
      "Network troubleshooting (ping, traceroute, packet capture)",
    ],
    experienceLevel: "0–3 years (Junior) / 3–8 years (Senior)",
    averageSalary: "₹4–12 LPA (India) / $60K–$110K (US)",
    companies: ["Cisco, Juniper, TCS, Infosys, Wipro, HCL, Jio, Airtel"],
    questions: [
      {
        id: "ne-q1",
        question: "Explain the difference between SNMP v1, v2c, and v3. Which one should you deploy in a production network and why?",
        answer: [
          "SNMPv1: Uses community strings ('public', 'private') for authentication — no encryption, no integrity check. Simple but insecure. Uses GET, SET, GETNEXT, TRAP operations.",
          "SNMPv2c: Adds GETBULK (efficient bulk retrieval), INFORM (acknowledged traps), and improved error handling. Still uses community strings — no security improvement over v1.",
          "SNMPv3: Adds USM (User-based Security Model) with authentication (MD5/SHA) and encryption (DES/AES). Adds VACM (View-based Access Control) for per-user OID access control. Provides authentication, integrity, and confidentiality.",
          "Recommendation: Deploy SNMPv3 in production. v1/v2c transmit community strings in plaintext — any packet capture reveals credentials. SNMPv3 is mandatory for compliance (PCI-DSS, HIPAA).",
          "Migration strategy: Enable SNMPv3 alongside v2c, migrate devices incrementally, then disable v1/v2c.",
        ],
        tip: "Always mention security implications. Interviewers want to see you think about production readiness, not just textbook differences.",
      },
      {
        id: "ne-q2",
        question: "A user reports slow network access. Walk me through your troubleshooting methodology.",
        answer: [
          "Step 1 — Verify scope: Is it one user, a department, or the entire network? This determines if it's a host issue or infrastructure issue.",
          "Step 2 — Check physical layer: Verify link status, LED indicators, cable integrity. Run 'show interface' for errors (CRC, runts, giants).",
          "Step 3 — Check Layer 2: Verify VLAN assignment, STP topology (is the port blocking?), check for duplex mismatch (half vs full).",
          "Step 4 — Check Layer 3: Ping default gateway, check routing table, verify ARP resolution. Use traceroute to identify where latency begins.",
          "Step 5 — Check Layer 4–7: Test specific services (HTTP, DNS). Check if firewall ACLs are blocking traffic. Use packet capture (Wireshark/tcpdump) to analyze traffic patterns.",
          "Step 6 — Correlate: Check NMS dashboards for interface utilization, CPU/memory on switches/routers. Look for alarm correlation — are other devices reporting issues?",
          "Step 7 — Resolution and documentation: Fix the root cause, verify restoration, document the incident, and update the knowledge base.",
        ],
        tip: "Show structured thinking. Use OSI layers as your mental model. Interviewers love candidates who follow a systematic approach rather than random guessing.",
      },
      {
        id: "ne-q3",
        question: "What is the difference between a router and a Layer 3 switch? When would you use each?",
        answer: [
          "Router: Operates at Layer 3, forwards packets based on IP routing tables. Optimized for WAN connectivity, NAT, VPN termination, BGP peering. Uses hardware-based forwarding (ASICs in enterprise routers). Supports complex routing protocols (BGP, OSPF, EIGRP).",
          "Layer 3 Switch: Combines Layer 2 switching with Layer 3 routing. Optimized for high-speed LAN forwarding. Uses hardware-based switching (ASICs) for wire-speed routing. Limited WAN features compared to dedicated routers.",
          "Use router for: WAN/Internet connectivity, site-to-site VPN, BGP peering with ISPs, NAT overload, DMVPN/SD-WAN aggregation.",
          "Use L3 switch for: Inter-VLAN routing in campus/data center, high-speed north-south and east-west traffic, spine-leaf fabric routing, where wire-speed routing with low latency is needed.",
          "Key difference: Routers have richer WAN interface support (serial, T1/E1, fiber) and more routing features. L3 switches optimize for port density and throughput in LAN environments.",
        ],
        tip: "Give real-world examples. Mentioning specific use cases shows practical experience.",
      },
      {
        id: "ne-q4",
        question: "Explain OSPF areas and why we use them. What happens if you don't use areas?",
        answer: [
          "OSPF areas divide a large network into smaller, manageable regions. Area 0 (backbone) connects all other areas. Each area maintains its own link-state database (LSDB).",
          "Why areas: (1) Reduces LSDB size — fewer LSAs to process, less memory/CPU. (2) Limits LSA flooding — topology changes in one area don't trigger SPF recalculation in others. (3) Hierarchical summarization — summarize routes at area boundaries.",
          "Area types: Stub (no external routes), Totally Stubby (only default route), NSSA (allows limited external routes), Transit (carries traffic between areas).",
          "Without areas: Every router has the complete topology of the entire network. LSDB grows linearly with network size. SPF algorithm runs on a massive graph — CPU-intensive. Any topology change (link flap) triggers global SPF recalculation. Network becomes unstable at scale.",
          "Real-world: Enterprise networks typically use 2–3 areas. Service provider networks use hundreds of areas with careful summarization.",
        ],
        tip: "Connect theory to operational impact. Interviewers want to see you understand WHY, not just WHAT.",
      },
      {
        id: "ne-q5",
        question: "What is BGP and how is it different from OSPF?",
        answer: [
          "BGP (Border Gateway Protocol): Path-vector protocol used for inter-domain routing (between autonomous systems). The protocol that makes the Internet work — BGP peers exchange reachability information between ISPs, enterprises, and cloud providers.",
          "OSPF: Link-state protocol used for intra-domain routing (within an autonomous system). Fast convergence, metric-based (cost), uses Dijkstra SPF algorithm.",
          "Key differences: BGP uses TCP (port 179) for transport — reliable, but slower convergence. OSPF uses raw IP (protocol 89) — faster but needs its own reliability. BGP selects paths based on policies (AS-path, local preference, MED). OSPF selects based on cost (bandwidth). BGP scales to Internet size (900K+ routes). OSPF is designed for enterprise/ISP internal use.",
          "When to use BGP: Multi-homed Internet connectivity, peering with ISPs, MPLS VPN backbone, data center leaf-spine fabrics (eBGP as underlay).",
          "When to use OSPF: Internal enterprise routing, data center underlay (iBGP + OSPF), campus networks.",
        ],
        tip: "Know the transport differences and scaling characteristics. BGP is policy-driven; OSPF is metric-driven.",
      },
    ],
  },

  {
    id: "noc-engineer",
    title: "NOC Engineer / Network Operations Center",
    description: "Monitor network health, respond to alarms, manage incidents, and ensure SLA compliance in a 24/7 operations environment.",
    skillsRequired: [
      "FCAPS model — especially Fault and Performance Management",
      "Alarm monitoring and correlation",
      "SNMP TRAP/INFORM handling",
      "Incident management and ticketing (ServiceNow, Remedy)",
      "NMS tools (SolarWinds, PRTG, Nagios, Zabbix)",
      "Shift handling and escalation procedures",
    ],
    experienceLevel: "0–2 years (L1) / 2–5 years (L2) / 5+ years (L3)",
    averageSalary: "₹3–8 LPA (India) / $45K–$85K (US)",
    companies: ["TCS, Infosys, Wipro, HCL, Accenture, IBM, Jio, Vi, BSNL"],
    questions: [
      {
        id: "noc-q1",
        question: "What is the difference between an event and an alarm? Explain the alarm lifecycle.",
        answer: [
          "Event: A raw occurrence on a network device — a link going down, a CPU spike, a configuration change. Events are the raw data points. Not all events are actionable.",
          "Alarm: A managed fault condition derived from one or more events. An alarm represents a problem that requires operator attention. The NMS correlates events to create alarms.",
          "Alarm lifecycle: (1) Detection — device detects fault, sends TRAP/INFORM to NMS. (2) Creation — NMS creates alarm record with severity, timestamp, source. (3) Notification — NMS notifies operator (dashboard, email, SMS). (4) Acknowledgment — operator acknowledges the alarm. (5) Investigation — operator diagnoses root cause. (6) Resolution — fix is applied, device recovers. (7) Clearing — alarm status changes to 'cleared'. (8) Closure — alarm is archived.",
          "Alarm severity: Critical (service down), Major (degraded service), Minor (non-critical fault), Warning (threshold approaching), Informational (informational event).",
          "Key distinction: One event can generate one alarm, or hundreds of events from multiple devices can correlate into a single root-cause alarm.",
        ],
        tip: "NOC interviews focus on operational awareness. Show you understand the difference between monitoring data and actionable alarms.",
      },
      {
        id: "noc-q2",
        question: "247 TRAPs arrive in 2 minutes from different devices after a core router fails. How do you handle this alarm storm?",
        answer: [
          "Step 1 — Don't panic. Alarm storms are expected when critical infrastructure fails. The NMS should have alarm correlation rules to identify the root cause.",
          "Step 2 — Identify the root cause: Look for the earliest alarm. In this case, the core router's 'systemRestart' TRAP at 10:00 is the first event. All other alarms (linkDown from access switches, OSPF neighbor loss from distribution, BGP peer loss from edge) are consequences.",
          "Step 3 — Acknowledge the root cause alarm. This signals to the team that someone is working on it.",
          "Step 4 — Suppress derived alarms: If your NMS supports alarm suppression or shelving, suppress the 245 derived alarms to reduce noise. Focus on the core router.",
          "Step 5 — Escalate per procedure: If the core router is critical, immediately escalate to L2/L3 engineering and notify the NOC manager.",
          "Step 6 — Check dependencies: What services are affected? Which customers are impacted? Prepare a service impact summary for management.",
          "Step 7 — Monitor restoration: When the core router recovers, verify alarms clear in reverse order. If some alarms don't clear, investigate residual issues.",
        ],
        tip: "Show calm, methodical thinking. NOC managers want operators who can handle alarm storms without getting overwhelmed.",
      },
      {
        id: "noc-q3",
        question: "What is SLA in network operations? Explain key SLA metrics and how you monitor them.",
        answer: [
          "SLA (Service Level Agreement): A formal commitment between a service provider and customer defining the expected quality of service, measured metrics, and penalties for non-compliance.",
          "Key metrics: (1) Availability — % uptime (e.g., 99.99% = 52.6 min downtime/year). (2) Latency — round-trip time (e.g., <50ms for voice). (3) Jitter — variance in latency (e.g., <30ms for video). (4) Packet loss — % of dropped packets (e.g., <0.1% for data). (5) Throughput — guaranteed bandwidth (e.g., 100 Mbps committed).",
          "Monitoring approach: Use synthetic monitoring (TWAMP, IP SLA) for active probing. Use streaming telemetry for real-time metrics. Set threshold-based alarms for each metric. Build dashboards showing current vs SLA targets.",
          "Escalation: If metric breaches SLA threshold → auto-escalate. Track SLA compliance monthly. Report to management with trend analysis.",
          "Real-world: Telecom operators use 5-minute monitoring intervals. Enterprise SLAs typically measure monthly availability.",
        ],
        tip: "Know the math: 99.99% uptime = 52.6 minutes/year downtime. Interviewers love specific numbers.",
      },
      {
        id: "noc-q4",
        question: "Explain the EMS-NMS-OSS hierarchy. Why do we need all three layers?",
        answer: [
          "EMS (Element Management System): Manages devices from a single vendor or technology domain. Handles device-specific configuration, monitoring, and fault management. Example: Cisco Prime for Cisco devices, Ericsson OSS for Ericsson equipment.",
          "NMS (Network Management System): Sits above EMS, provides unified cross-vendor network-wide visibility. Aggregates alarms, topology, and performance from multiple EMS systems. Provides a single pane of glass for network operators.",
          "OSS (Operations Support Systems): Business-level systems for service management, billing, customer care, and inventory. Consumes data from NMS via northbound interfaces (REST APIs, SNMP). Examples: ServiceNow, Amdocs, Netcracker.",
          "Why three layers: (1) Separation of concerns — device-specific vs network-wide vs business logic. (2) Scalability — EMS handles device volume, NMS handles network scope, OSS handles business processes. (3) Vendor independence — NMS abstracts vendor differences from OSS. (4) Fault isolation — EMS failure affects one vendor; NMS failure affects one network; OSS failure affects business operations.",
        ],
        tip: "This is a fundamental NMS architecture question. Know it cold.",
      },
      {
        id: "noc-q5",
        question: "What is alarm correlation? Give an example of how it reduces alarm floods.",
        answer: [
          "Alarm correlation is the process of analyzing multiple alarms to identify patterns, relationships, and root causes. It reduces alarm floods by suppressing derived alarms and surfacing only the actionable root cause.",
          "Types of correlation: (1) Temporal — alarms within a time window share root cause. (2) Spatial — alarms from the same network segment are related. (3) Causal — alarm A causes alarm B (e.g., link down → BGP peer loss → route withdrawal). (4) Topological — alarms from devices connected through the same path.",
          "Example: A core switch fails at 10:00. This generates: 2 linkDown TRAPs (direct connections), 50 OSPF neighbor loss alarms (routers that lost adjacency), 200 interface-down alarms (VLANs behind the switch). Without correlation: 252 alarms flood the NOC. With correlation: NMS identifies the core switch failure as root cause, suppresses 251 derived alarms, surfaces 1 actionable alarm.",
          "Tools: Commercial NMS (SolarWinds, IBM Tivoli) have built-in correlation engines. Open-source: Nagios with custom scripts, Zabbix with correlation rules.",
          "Benefits: Reduces operator fatigue, faster MTTR (Mean Time To Repair), prevents alarm blindness where critical alarms are buried in noise.",
        ],
        tip: "Give a concrete example with numbers. Abstract answers are forgettable; specific scenarios stick.",
      },
    ],
  },

  {
    id: "sdn-developer",
    title: "SDN / Network Automation Engineer",
    description: "Build software-defined networking solutions, automate network operations, and develop network management applications using modern APIs and frameworks.",
    skillsRequired: [
      "Python, Go, or Java programming",
      "REST API design and consumption",
      "NETCONF/YANG and data modeling",
      "SDN controllers (ONOS, OpenDaylight, OpenStack Neutron)",
      "Configuration management (Ansible, Terraform)",
      "CI/CD pipelines for network automation",
      "Containerization (Docker, Kubernetes)",
    ],
    experienceLevel: "1–5 years",
    averageSalary: "₹6–18 LPA (India) / $80K–$140K (US)",
    companies: ["Cisco, Juniper, VMware, Nokia, Arista, Jio, Cloudflare, Google Cloud"],
    questions: [
      {
        id: "sdn-q1",
        question: "What is the difference between imperative and declarative network configuration? Give examples of each.",
        answer: [
          "Imperative: You tell the device exactly what steps to execute, in order. Example: CLI commands — 'configure terminal; interface ge-0/0/0; ip address 10.0.0.1 255.255.255.0; no shutdown'. You are programming the device step-by-step.",
          "Declarative: You describe the desired end-state, and the system figures out how to achieve it. Example: NETCONF/YANG — '<config><interface><name>ge-0/0/0</name><ipv4><address><ip>10.0.0.1</ip><prefix-length>24</prefix-length></address></ipv4></interface></config>'. The controller/device computes the diff.",
          "Key difference: Imperative = HOW. Declarative = WHAT. Declarative is idempotent — applying the same config twice produces the same result. Imperative is not — running 'no shutdown' twice is redundant.",
          "Real-world: Ansible is declarative (playbooks describe desired state). Python + NETCONF library can be either. CLI is imperative. Terraform is declarative for cloud infrastructure.",
          "Why declarative matters: (1) Idempotency — safe to re-run. (2) Rollback — system knows the previous state. (3) Validation — can check config against YANG model before applying. (4) Auditability — desired state is documented in code.",
        ],
        tip: "This question tests your understanding of modern network automation philosophy. Emphasize the operational benefits of declarative approaches.",
      },
      {
        id: "sdn-q2",
        question: "Explain the SDN three-layer architecture. What protocols are used at each interface?",
        answer: [
          "Data Plane (Infrastructure Layer): Physical or virtual switches that forward packets based on flow tables. Protocol: OpenFlow (ONF standard) for flow table programming. Also: P4 for custom forwarding behavior.",
          "Control Plane (Control Layer): SDN controller (ONOS, OpenDaylight, ODL) that computes forwarding decisions, manages topology, and enforces policies. It is the 'brain' of the network.",
          "Application Plane (Application Layer): Network applications that consume controller APIs to implement services — load balancing, firewalling, traffic engineering, monitoring.",
          "Southbound interface (Controller ↔ Data Plane): OpenFlow for flow programming. NETCONF/YANG for device configuration. SNMP for legacy monitoring. gNMI/gRPC for streaming telemetry.",
          "Northbound interface (Controller ↔ Application Plane): REST APIs (RESTCONF, custom REST). gRPC for high-performance applications. Intent-based APIs (ONOS Intent Framework).",
          "East-West interface (Controller ↔ Controller): ONOS clustering protocol. ODL clustering (Akka). Used for multi-domain, multi-controller deployments.",
        ],
        tip: "Know the specific protocols at each interface. Interviewers want to see you can implement, not just describe.",
      },
      {
        id: "sdn-q3",
        question: "Write a Python script using netmiko or NAPALM to backup configurations from 10 routers. How would you make it production-ready?",
        answer: [
          "Basic script structure: Import Netmiko library. Define device inventory (IP, credentials, device type). Loop through devices, establish SSH connection, send 'show running-config', save output to file with timestamp and hostname.",
          "Production hardening: (1) Use environment variables or vault for credentials — never hardcode passwords. (2) Add error handling — connection timeouts, authentication failures, command timeouts. (3) Use concurrent.futures for parallel execution — backup 10 routers simultaneously, not sequentially. (4) Add logging — log each backup attempt, success/failure, and timestamp. (5) Implement retry logic — if a device fails, retry 2 times before marking as failed. (6) Validate backups — check file size, verify 'end' marker at end of config. (7) Send notification — email/Slack alert if any backup fails. (8) Schedule with cron/APScheduler for daily automated backups.",
          "Example production additions: try/except blocks, logging module, ThreadPoolExecutor, SSH keep-alive, config diff against previous backup.",
          "Testing: Test against lab devices first. Verify backup integrity by comparing with manual backup. Test failure scenarios (wrong credentials, unreachable device).",
        ],
        tip: "Don't just write code — explain how you'd make it resilient. Production-readiness separates juniors from seniors.",
      },
      {
        id: "sdn-q4",
        question: "What is YANG-Push and how does it differ from traditional SNMP polling?",
        answer: [
          "Traditional SNMP polling: NMS sends GET/GETBULK requests at fixed intervals (e.g., every 5 minutes). Pull model — NMS initiates all data collection. Limitation: Polling gap — failures between polls are invisible. Overhead: Thousands of GET requests per cycle.",
          "YANG-Push (RFC 8639): Device pushes data to subscribers at configured intervals or on-change. Push model — device initiates data delivery. Uses NETCONF/RESTCONF notification streams. No polling gap — real-time visibility.",
          "Key differences: (1) Granularity: SNMP polls every 5 min; YANG-Push can push every 100ms. (2) Overhead: SNMP creates request/response overhead; YANG-Push sends data once to multiple subscribers. (3) Coverage: SNMP limited to MIB objects; YANG-Push covers all YANG-modeled data. (4) On-change: YANG-Push can trigger on state changes; SNMP only sees changes at next poll.",
          "Implementation: Configure YANG-Push subscription on device (netconf-yang push-datastore). Device streams data to collector (Telegraf, Prometheus, custom collector). Collector stores in time-series database (InfluxDB, Prometheus TSDB).",
          "Use case: Real-time SLA monitoring, sub-second link state change detection, high-frequency performance metrics for AI/ML analytics.",
        ],
        tip: "Show you understand the operational difference, not just the protocol difference. Mention specific use cases.",
      },
      {
        id: "sdn-q5",
        question: "How would you design a CI/CD pipeline for network device configurations?",
        answer: [
          "Stage 1 — Source Control: All configurations stored in Git. Each change is a pull request (PR) with description and reviewer approval. Branch protection rules enforce code review.",
          "Stage 2 — Linting & Validation: Pre-commit hooks validate syntax. CI runner checks YANG model compliance (yanglint). Ansible-lint for playbooks. IP address schema validation.",
          "Stage 3 — Automated Testing: Spin up virtual network topology (containerlab, EVE-NG) in CI environment. Apply configuration changes to virtual devices. Run test suite: ping reachability, BGP adjacency, VLAN connectivity, SNMP reachability.",
          "Stage 4 — Staged Deployment: Deploy in phases: (a) Single non-critical device, (b) One site's access layer, (c) Distribution layer, (d) Core/edge. Wait for monitoring signals (no new alarms) between stages.",
          "Stage 5 — Rollback: If monitoring detects anomalies, automatically revert to previous Git commit and re-apply. Manual rollback trigger for operator override.",
          "Stage 6 — Audit: All deployments logged with commit hash, author, timestamp, and diff. Integration with CMDB for change tracking.",
          "Tools: Git (version control), GitHub Actions/GitLab CI (pipeline), Ansible/Terraform (configuration), containerlab (test topology), Prometheus/Grafana (monitoring), ServiceNow (ticketing).",
        ],
        tip: "Show end-to-end thinking. Mention specific tools and how they connect in the pipeline.",
      },
    ],
  },

  {
    id: "cloud-network-engineer",
    title: "Cloud / NFV Network Engineer",
    description: "Deploy and manage virtualized network functions, cloud networking, and NFV infrastructure in data center and edge environments.",
    skillsRequired: [
      "Cloud platforms (AWS, Azure, GCP networking)",
      "NFV architecture (ETSI MANO, VNF lifecycle)",
      "OpenStack / Kubernetes networking",
      "Virtualization (VMware, KVM, containers)",
      "Overlay networking (VXLAN, GRE, Geneve)",
      "Service mesh and microservices networking",
    ],
    experienceLevel: "1–5 years",
    averageSalary: "₹5–15 LPA (India) / $75K–$130K (US)",
    companies: ["AWS, Azure, GCP, VMware, Red Hat, Jio, Airtel, Ericsson, Nokia"],
    questions: [
      {
        id: "cn-q1",
        question: "What is NFV and how does it differ from traditional network appliance deployment?",
        answer: [
          "Traditional deployment: Dedicated hardware appliances (firewall, load balancer, router) for each network function. Proprietary hardware, vendor lock-in, long procurement cycles (months), high CapEx.",
          "NFV deployment: Network functions run as software (VNFs) on commodity x86 servers. Decouples function from hardware. Uses standard servers, hypervisors, and orchestration platforms.",
          "Key differences: (1) Hardware: Proprietary vs commodity x86. (2) Deployment: Weeks/months vs minutes/hours. (3) Scaling: Buy new hardware vs spin up new VNF instances. (4) Cost: High CapEx vs OpEx-based. (5) Flexibility: Fixed capacity vs elastic scaling.",
          "NFV architecture (ETSI MANO): NFVI (compute, storage, networking) → VNF (virtual network function) → MANO (NFVO, VNFM, VIM). NFVO orchestrates, VNFM manages VNF lifecycle, VIM manages infrastructure resources.",
          "Real-world example: A traditional firewall appliance ($50K, 4 week lead time) becomes a VNF ($5K/year, deploys in 5 minutes). But VNF performance may be 50–70% of hardware due to virtualization overhead.",
          "Challenges: Performance (virtualization overhead), troubleshooting (multi-layer), orchestration complexity, vendor interoperability.",
        ],
        tip: "Know the ETSI MANO framework. Mention both benefits AND challenges — interviewers want balanced perspective.",
      },
      {
        id: "cn-q2",
        question: "Explain VXLAN and why it's used in modern data centers.",
        answer: [
          "VXLAN (Virtual eXtensible LAN, RFC 7348): An overlay networking protocol that encapsulates Layer 2 frames in Layer 3 UDP packets. Creates virtual Layer 2 segments across a Layer 3 underlay network.",
          "Problem it solves: Traditional VLANs have a 12-bit VLAN ID — maximum 4,094 VLANs. Large data centers with multi-tenancy need millions of isolated segments. VXLAN uses a 24-bit VNI (VXLAN Network Identifier) — supports 16 million segments.",
          "How it works: (1) VTEP (VXLAN Tunnel Endpoint) on each host encapsulates original Ethernet frame. (2) Adds VXLAN header (VNI) + UDP header + outer IP header. (3) Packet traverses Layer 3 underlay (spine-leaf fabric). (4) Remote VTEP decapsulates and delivers original frame.",
          "Use cases: (1) Multi-tenant data centers — isolate tenant traffic across shared infrastructure. (2) Cloud provider networks — millions of isolated virtual networks. (3) Container networking — Kubernetes CNI plugins (Calico, Flannel) use VXLAN for pod-to-pod communication. (4) Data center migration — extend Layer 2 segments across physical locations.",
          "Alternatives: GRE (simpler, no VNI), Geneve (IETF standard, more extensible), STT (TCP-like segmentation for NIC offload). VXLAN is the most widely deployed.",
        ],
        tip: "Know the encapsulation format. Draw the packet header if asked — it shows deep understanding.",
      },
      {
        id: "cn-q3",
        question: "What is the difference between a VM and a container? When would you use each for network functions?",
        answer: [
          "Virtual Machine: Full OS stack per instance (Linux kernel + userspace). Hypervisor (KVM, VMware) virtualizes hardware. Strong isolation — each VM has its own kernel. Resource overhead: GBs of RAM, minutes to boot. Examples: VMware ESXi, KVM/QEMU, Hyper-V.",
          "Container: Shares host OS kernel. Only userspace processes are isolated. Lightweight — MBs of memory, seconds to boot. Weaker isolation than VMs (shared kernel). Examples: Docker, containerd, CRI-O.",
          "When to use VMs for VNFs: (1) Legacy VNFs that require specific kernel modules (e.g., DPDK, custom drivers). (2) Security-critical functions (firewalls, IDS) that need strong isolation. (3) VNFs from vendors that only support VM deployment.",
          "When to use containers for VNFs: (1) Cloud-native network functions (CNFs) designed for Kubernetes. (2) Microservices-based functions (API gateways, DNS). (3) Functions that need rapid scaling (auto-scaling based on load). (4) Edge deployments where resource efficiency matters.",
          "Trend: Industry is moving from VNFs (VM-based) to CNFs (container-based). CNFs are more efficient but require different design patterns (statelessness, sidecar proxies, service mesh).",
        ],
        tip: "Show you understand the trade-offs. Don't just say 'containers are lighter' — explain the isolation and operational differences.",
      },
      {
        id: "cn-q4",
        question: "How do you monitor a VNF running on OpenStack? What metrics would you collect?",
        answer: [
          "Infrastructure layer monitoring: (1) Nova compute — VM CPU, memory, disk I/O, network I/O per VNF instance. (2) Neutron — virtual port statistics, floating IP reachability, security group hit counts. (3) Cinder — volume IOPS, latency, capacity. (4) Host — physical server health, NUMA topology, CPU pinning status.",
          "VNF layer monitoring: (1) Application metrics — connections per second, throughput, latency, error rate. (2) VNF-specific — firewall: sessions, packet drops; load balancer: backend health, connection queue; router: route table size, forwarding rate. (3) VNF lifecycle — instantiation time, scaling events, healing events.",
          "Service layer monitoring: (1) End-to-end SLA — latency, jitter, packet loss across the service chain. (2) Chain integrity — verify traffic flows through all VNFs in correct order. (3) Orchestration events — NFVO logs, VNFM actions, VIM resource utilization.",
          "Tools: Prometheus (metrics), Grafana (dashboards), ELK Stack (logs), OpenStack Ceilometer (infrastructure telemetry), VNF-specific exporters (SNMP, gNMI, REST).",
          "Alerting: Set thresholds for CPU > 80%, memory > 85%, connection pool > 90%. Use anomaly detection for traffic patterns. Correlate VNF alarms with infrastructure alarms.",
        ],
        tip: "Show layered thinking — infrastructure, VNF, and service layers each need different monitoring approaches.",
      },
      {
        id: "cn-q5",
        question: "Explain the difference between service orchestration and service chaining.",
        answer: [
          "Service chaining: Connecting multiple VNFs in a specific sequence so traffic flows through them in order. Example: Traffic → Firewall → IDS → Load Balancer → Server. The chain defines the traffic path and processing order.",
          "Service orchestration: The end-to-end lifecycle management of a network service, including VNF instantiation, configuration, scaling, healing, and termination. Orchestrator (NFVO) coordinates all components.",
          "Key difference: Service chaining is about traffic flow (data plane). Service orchestration is about lifecycle management (control/management plane).",
          "Service chaining implementation: (1) Static chaining — configure traffic steering rules manually. (2) Dynamic chaining — controller programs flow paths based on policies. (3) SFC (Service Function Chaining, RFC 7665) — IETF standard using NSH (Network Service Header) for chain metadata.",
          "Service orchestration workflow: (1) Service design — define NSD (Network Service Descriptor) with VNFs, connections, resources. (2) Resource allocation — VIM provisions compute, network, storage. (3) VNF instantiation — deploy each VNF instance. (4) Configuration — configure VNFs and chain them. (5) Activation — enable traffic flow. (6) Monitoring — track SLA compliance. (7) Scaling — add/remove VNF instances based on load. (8) Termination — decommission when no longer needed.",
        ],
        tip: "Clarify the distinction clearly. Many candidates confuse chaining (traffic path) with orchestration (lifecycle).",
      },
    ],
  },
];
