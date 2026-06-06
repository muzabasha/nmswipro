import type { TopicData } from './types';

export const topic11Data: TopicData = {
  id: "u3t2",
  title: "NMS Discovery and FM NBI Flow",
  moduleName: "Unit 3: Alarm Lifecycle Management",
  context: {
    prerequisites: ["Topic 3.1: Alarm Management & Fault Correlation (RCA & Suppression)", "IP Subnets and Scanning"],
    dependentTopics: ["Topic 3.3: REST APIs and ONF TAPI Overview", "Topic 4.2: Network Observability vs. Monitoring"],
    nextSteps: "Examine how REST APIs and standard schemas like ONF TAPI enable discovery in optical and transport networks."
  },
  storytelling: {
    analogy: "The Search Party and the Hotline",
    story: "Imagine you are running a hotel. To find which guests are in their rooms, you send housekeeping to knock on every door (NMS IP Sweep/Ping Discovery). Once housekeeping finds guests, they register them in the master book. Now, if a guest experiences an emergency (like a leak), they pick up the hotline phone and report it to the front desk (Fault Management Northbound Interface - FM NBI), which instantly forwards the issue to the plumber. In networks, an NMS sweeps subnets to build a topology map, and when a device discovers an internal fault, it sends a trap or event upward via the FM NBI to trigger external ticketing systems (like Jira or ServiceNow).",
    reflectiveQuestions: ["Why is scanning an entire /16 subnet (65,536 IPs) using a single thread slow?", "What is the purpose of forwarding network alarms to external IT service systems?"],
    technicalConnection: "NMS discovery is the process of mapping a network's topology by sweeping IP subnets using ICMP Echo (pings) and SNMP/NETCONF credentials. Once devices are discovered, their health is monitored. When faults arise, the NMS processes the alarms and forwards them via the Fault Management Northbound Interface (FM NBI) to external systems using protocols like REST or WebSocket streams for immediate IT action."
  },
  mathModelling: {
    need: "To model the total execution time of an NMS IP discovery sweep to optimize subnet scan speed and concurrency parameters.",
    equation: "T_{disc} = \\frac{N_{ips} \\times [ (1 - p_{active}) \\times T_{timeout} + p_{active} \\times RTT ]}{C_{threads}}",
    technicalDetails: "An auto-discovery engine scans a block of \\(N_{ips}\\) addresses. A fraction \\(p_{active}\\) of these addresses are active hosts which respond within one \\(RTT\\). The inactive hosts (\\(1 - p_{active}\\)) do not respond, causing the scanner to wait for the full \\(T_{timeout}\\) value before proceeding. To perform this sweep efficiently, the NMS spawns a number of worker threads \\(C_{threads}\\) to execute scans in parallel. Increasing concurrency reduces scan duration linearly, but too high a thread count can cause socket exhaustion or local CPU spikes.",
    explanation: [
      { term: "T_disc", meaning: "Total time required to scan the IP address range (seconds)." },
      { term: "N_ips", meaning: "Number of IP addresses in the target subnet." },
      { term: "p_active", meaning: "The ratio of active hosts on the subnet (0 to 1)." },
      { term: "T_timeout", meaning: "Ping timeout value for unresponsive IPs (seconds)." },
      { term: "RTT", meaning: "Round-trip time for responsive hosts (seconds)." },
      { term: "C_threads", meaning: "Number of concurrent scanning threads/workers active in the NMS." }
    ],
    advantages: ["Allows administrators to configure discovery parameters for different WAN subnet sizes.", "Prevents discovery processes from running forever or crashing NMS server resources."],
    limitations: ["Assumes uniform RTT and constant host behavior during the scan cycle."],
    simulation: {
      description: "Vary the subnet size (N), thread concurrency, and ping timeout to see the auto-discovery execution speed curve.",
      parameters: [
        { id: "subnetSize", name: "IP Range (N)", min: 256, max: 4096, default: 512, step: 256, unit: " IPs" },
        { id: "concurrency", name: "Scan Threads (C)", min: 10, max: 200, default: 50, step: 10, unit: " threads" },
        { id: "timeoutSecs", name: "Ping Timeout", min: 0.5, max: 5.0, default: 1.5, step: 0.5, unit: " s" }
      ]
    }
  },
  activities: {
    level1: "Teacher runs a command prompt command nmap -sn 192.168.1.0/24 to demonstrate IP discovery sweeps.",
    level2: "Students calculate the time to scan a /24 network single-threaded if 90% of the IPs are empty and timeout is set to 2 seconds.",
    level3: "Class Exercise: Draw a sequence flow representing an alarm originating on a router, passing to an EMS, then to an NMS, and finally through the FM NBI to a ServiceNow ticketing dashboard.",
    level4: "Write a 150-word paper explaining the trade-offs of using active ICMP scanning vs passive listening (like ARP and DHCP snooping) for device discovery."
  },
  projects: {
    scope: "Design an FM NBI message payload format.",
    objectives: ["Create a JSON payload structure for forwarding alarms", "Include fields for alarm severity, source IP, affected service, ticket ID, and clear-condition"],
    deliverables: ["JSON payload sample", "1-page NBI integration interface guide"]
  },
  questions: [
    { q: "What are the two main steps in an active NMS device discovery sweep?", a: "1) Ping (ICMP) sweep to find active IP addresses, and 2) Credential query (SNMP, SSH, or NETCONF) to retrieve device type, metadata, and operational state.", type: "Conceptual" },
    { q: "Calculate the discovery scan time for a subnet with N_ips = 256, active ratio p_active = 0.1, RTT = 10ms (0.01s), ping timeout = 2s, running with C_threads = 10 threads.", a: "Unresponsive IPs: 256 * 0.9 = 230.4 nodes, Responsive: 25.6 nodes. Scan time per thread = [ (230.4 * 2) + (25.6 * 0.01) ] / 10 = [ 460.8 + 0.256 ] / 10 ≈ 46.1 seconds.", type: "Numerical" },
    { q: "What is the function of a Fault Management Northbound Interface (FM NBI)?", a: "It streams categorized, correlated alarms from the NMS up to higher-level operations support systems (OSS), trouble ticketing systems, or notification hubs.", type: "Conceptual" },
    { q: "Why is passive discovery (monitoring ARP/DHCP) preferred over active ping sweeps in highly sensitive networks?", a: "Active ping sweeps scan every IP sequentially, which can trigger security firewalls (port scans) and consume broadcast link bandwidth, whereas passive discovery listens to existing traffic without injecting overhead.", type: "Analytical" },
    { q: "Which protocol is commonly used to stream real-time alarms over an FM NBI to a modern web application?", a: "WebSockets or Server-Sent Events (SSE) running over HTTP, or message queues like Kafka and AMQP.", type: "Conceptual" }
  ],
  virtualLab: {
    description: "NMS Auto-Discovery Simulator. Scan subnets with varying active device densities and thread counts. Watch for thread limits and timing constraints.",
    interpretation: "Low concurrency results in long scan times. However, increasing concurrency past the OS limits causes socket errors, showcasing that discovery scans must balance speed with platform socket limits.",
    parameters: [
      { id: "activeRatio", name: "Active Host Ratio", min: 0.05, max: 0.95, default: 0.2, step: 0.05, unit: "" }
    ]
  }
};
