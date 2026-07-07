import type { TopicData, CommandEntry } from './types';

export const topic0Data: TopicData = {
  id: "u1t0",
  title: "Networking Commands for Network Management",
  moduleName: "Unit I: Introduction to Network Management and Frameworks",
  context: {
    prerequisites: [
      "Basic understanding of IP addressing (IPv4/IPv6)",
      "Familiarity with the OSI/TCP-IP model layers",
      "Basic command-line interface (CLI) usage on Linux/Windows",
      "Understanding of DNS, routing, and network protocols"
    ],
    dependentTopics: [
      "Understanding of Mobile Network",
      "eTOM and TMN Framework",
      "SNMP Protocol and MIB Structure",
      "NMS Architecture and Interfaces"
    ],
    nextSteps: "Apply these commands in real network management tasks: use ping/traceroute for fault diagnosis, netstat/ss for performance monitoring, arp/nmap for topology discovery, and snmpwalk as an NMS southbound interface tool.",
    rfcReferences: [
      { rfc: "RFC 792", title: "Internet Control Message Protocol (ICMP)", summary: "Defines ICMP — the protocol underpinning ping and traceroute. ping sends ICMP Echo Request (Type 8) and receives Echo Reply (Type 0). traceroute uses ICMP TTL-exceeded messages (Type 11) to map the path.", url: "https://www.rfc-editor.org/rfc/rfc792" },
      { rfc: "RFC 826", title: "Address Resolution Protocol (ARP)", summary: "Defines ARP — the protocol used by the arp command to map IPv4 addresses to MAC addresses. Critical for understanding the arp -a output and detecting ARP spoofing attacks.", url: "https://www.rfc-editor.org/rfc/rfc826" },
      { rfc: "RFC 1213", title: "MIB-II (Management Information Base)", summary: "Defines MIB-II objects including the ifTable (interfaces), ipAddrTable (IP addresses), and tcpConnTable — the data structures retrieved by snmpwalk and snmpget commands.", url: "https://www.rfc-editor.org/rfc/rfc1213" },
      { rfc: "RFC 4271", title: "BGP-4 Protocol", summary: "Defines BGP — a protocol whose session status, prefixes, and neighbour relationships are examined using show ip bgp, route, and netstat commands in network management.", url: "https://www.rfc-editor.org/rfc/rfc4271" }
    ]
  },
  storytelling: {
    analogy: "A Network Engineer's Diagnostic Toolkit",
    story: "Imagine a hospital where every patient is a network device and the doctor is a network engineer. Before any treatment, the doctor uses a stethoscope (ping) to check if the patient is alive and responsive. To trace where the problem originated, the doctor follows a referral chain from GP to specialist to hospital — this is traceroute, mapping each hop. To understand what organs (ports/services) are active, the doctor reviews the patient chart — this is netstat or ss. To see who else is in the ward (the local network segment), the doctor checks the admissions register — this is the ARP table. To get a full body scan revealing all open services across the entire building (subnet), the doctor orders an MRI — this is nmap. Finally, to read the patient's own health telemetry data (SNMP MIB variables) directly from their monitoring system, the doctor uses snmpget and snmpwalk. These commands are not just CLI tools — they are the primary instruments through which a network management system (NMS) interacts with, monitors, and diagnoses every device in the network.",
    reflectiveQuestions: [
      "Which commands would you use first when a remote server stops responding — and in what order?",
      "How does the TTL field in IP headers enable traceroute to map the network path?",
      "What is the difference between netstat and ss, and when would you prefer one over the other in a production environment?",
      "How does nmap's OS fingerprinting work, and why is it both useful for network management and a security concern?"
    ],
    technicalConnection: "In Network Management Systems (NMS), these commands form the diagnostic and discovery foundation: ping and traceroute implement ICMP-based reachability probing (fault management), netstat/ss provide real-time socket and connection state (performance management), arp maps Layer 2 to Layer 3 for topology discovery (configuration management), nmap performs automated host and port discovery to build network inventory, and snmpget/snmpwalk are the primary SNMP southbound interface tools used by every commercial NMS (Nokia NetAct, Ericsson ENM, Huawei U2000) to poll KPIs and collect alarms."
  },
  mathModelling: {
    need: "A network operations center (NOC) engineer must determine whether an observed packet loss on a critical WAN link is caused by random bit errors or systematic congestion. Using ping with extended options and statistical analysis of the RTT distribution, the engineer can calculate loss percentage, mean RTT, jitter, and coefficient of variation to distinguish the root cause.",
    equation: "Packet Loss % = (Packets_Sent - Packets_Received) / Packets_Sent x 100. RTT Jitter = |RTT_n - RTT_{n-1}|. Mean RTT = SUM(RTT_i) / N. Coefficient of Variation (CV) = sigma_RTT / mu_RTT. High CV (>0.3) indicates congestion; Low CV with high loss indicates link errors.",
    technicalDetails: "Scenario: ping -c 100 -i 0.2 192.168.1.1 sends 100 ICMP Echo Requests at 200 ms intervals. Results: 100 sent, 87 received — Loss = 13%. RTT min/avg/max/mdev = 2.1/18.4/312.5/45.2 ms. Analysis: mdev (mean deviation) of 45.2 ms is very high relative to avg of 18.4 ms. CV = 45.2/18.4 = 2.46. A CV greater than 0.3 strongly indicates queue-based congestion rather than random bit errors. Congestion causes RTT spikes (bursty loss pattern) while link errors cause uniform random loss with low jitter. Decision: escalate to capacity team for WAN bandwidth upgrade rather than requesting physical layer inspection from the carrier.",
    explanation: [
      { term: "Packet Loss < 1%", meaning: "Normal for most networks. RTT should be stable with low jitter. No action required. Monitor trend over time using NMS performance counters." },
      { term: "Packet Loss 1-5% with High Jitter (CV > 0.3)", meaning: "Indicates congestion or buffer bloat on an intermediate link. Use traceroute to identify which hop introduces the highest RTT increase. Engage capacity planning team. May indicate QoS misconfiguration causing bursty drops." },
      { term: "Packet Loss 1-5% with Low Jitter (CV < 0.1)", meaning: "Indicates physical layer errors — bit errors due to degraded fibre, EMI, or a failing interface. Request carrier to check BER (Bit Error Rate) on the physical medium. The uniform random nature distinguishes it from congestion." },
      { term: "Packet Loss > 10%", meaning: "Severe impairment. Services including VoIP, video conferencing, and real-time trading are unusable. Declare P1 incident. Use traceroute to isolate the faulty segment. Check interface error counters with show interfaces or ethtool -S." }
    ],
    advantages: [
      "ping with -c -i -Q flags provides quantitative link quality metrics without any additional monitoring infrastructure",
      "RTT statistics directly expose queue depth changes — each millisecond of added RTT corresponds to approximately 1 KB of queued data at 1 Gbps",
      "Jitter measurement predicts VoIP quality (G.114 requires < 150 ms one-way delay, < 30 ms jitter for toll-quality voice)"
    ],
    limitations: [
      "Some firewalls and routers deprioritise or block ICMP, causing false-positive loss results — always cross-reference with application-level telemetry",
      "ping measures round-trip time — asymmetric paths mean uplink and downlink quality cannot be independently assessed without directional tools like iperf3",
      "High ping rates (low -i intervals) may be classified as a network scan or DoS attempt and trigger IDS alerts — coordinate with security team before stress-testing"
    ],
    simulation: {
      description: "Simulate ping packet loss analysis. Adjust the total packets sent and the simulated loss percentage to see how loss rate and jitter affect the NOC's diagnostic conclusion. The chart shows cumulative receive rate (%) as packets are sent.",
      parameters: [
        { id: "totalPackets", name: "Packets Sent", min: 10, max: 200, default: 100, step: 10, unit: "" },
        { id: "lossPercent", name: "Loss Percentage", min: 0, max: 50, default: 13, step: 1, unit: "%" }
      ],
      generateData: (params) => {
        const total = params.totalPackets || 100;
        const lossPct = (params.lossPercent || 13) / 100;
        const pts: Array<{ x: number; y: number }> = [];
        let received = 0;
        for (let i = 1; i <= total; i++) {
          if (Math.random() > lossPct) received++;
          pts.push({ x: i, y: parseFloat(((received / i) * 100).toFixed(1)) });
        }
        return pts;
      },
      labels: { x: "Packet Number", y: "Cumulative Receive Rate (%)" }
    }
  },
  activities: {
    level1: "List and briefly describe the primary purpose of each of the following networking commands: ping, traceroute (tracert), netstat, ss, arp, nmap, dig, nslookup, route (ip route), ifconfig (ip addr), tcpdump, snmpget, snmpwalk. For each command, state the OSI layer it primarily operates at.",
    level2: "Run the following command sequence on a Linux system (or describe expected output if not available): (1) ping -c 5 8.8.8.8, (2) traceroute 8.8.8.8, (3) netstat -tulnp | grep LISTEN, (4) arp -a, (5) ip route show. For each command, document the actual output and explain what each line or field means in the context of network management.",
    level3: "Using ping -c 100 -i 0.5 <target_ip>, collect RTT statistics. Extract min, avg, max, and mdev values. Calculate: (a) Packet loss %, (b) Coefficient of Variation (CV = mdev/avg), (c) Estimated queue depth if avg RTT increase = 15 ms on a 100 Mbps link (hint: queue_bytes = delta_RTT x bandwidth / 8). Interpret: is the loss congestion-based or error-based?",
    level4: "Design a network health check script using bash that runs the following commands against a list of 5 target IPs: ping (report loss%), traceroute (identify the last reachable hop), netstat (count ESTABLISHED connections to each target), nmap -sV (identify open ports and services). Output a structured report in JSON format with fields: ip, reachable (bool), loss_percent, last_hop, established_connections, open_ports. This is the foundation of an NMS automated probing module."
  },
  projects: {
    scope: "Build a command-line Network Diagnostic Dashboard that mimics the probe functions of a real NMS southbound interface. The tool must discover devices, check reachability, map topology, enumerate services, and poll SNMP data.",
    objectives: [
      "Use nmap -sn to discover all live hosts in a /24 subnet and build an IP inventory",
      "Use ping -c 10 to measure packet loss and average RTT for each discovered host, classifying link quality as Good (<1% loss), Degraded (1-5%), or Critical (>5%)",
      "Use traceroute to map the hop path from the management host to each device, identifying the first hop that exceeds 50 ms RTT as a potential bottleneck",
      "Use snmpget to retrieve sysDescr (1.3.6.1.2.1.1.1.0), sysUpTime (1.3.6.1.2.1.1.3.0), and ifOperStatus for each interface from SNMP-enabled devices"
    ],
    deliverables: [
      "Python or bash script implementing the four-phase discovery-and-probe workflow above",
      "Sample JSON output file showing discovered devices with all metrics (reachability, RTT, loss, hop count, SNMP data)",
      "One-page analysis report identifying any devices with Critical link quality or SNMP-reported interface faults, with recommended remediation steps"
    ]
  },
  questions: [
    {
      q: "Explain the difference between ping and traceroute. What protocol does each use, and what specific information does each provide that the other cannot?",
      a: "ping uses ICMP Echo Request (Type 8) / Echo Reply (Type 0) to test reachability and measure round-trip time (RTT) to a single destination. It tells you: is the host alive? What is the RTT? What is the packet loss rate? traceroute (Linux) / tracert (Windows) uses ICMP with TTL manipulation (or UDP on Linux, TCP-SYN on nmap's traceroute variant). It sends packets with TTL=1, 2, 3, ... incrementing by 1 each probe. Each router that receives a packet with TTL=0 sends back an ICMP Time Exceeded (Type 11) message, revealing its IP address and RTT. traceroute provides the full network path: every intermediate hop, their RTTs, and where latency is introduced. ping cannot identify which intermediate device is causing packet loss — traceroute can. However, some routers rate-limit or block ICMP TTL-exceeded responses, causing '* * *' (no-reply hops) in traceroute output even when the path is otherwise functional.",
      type: "Conceptual"
    },
    {
      q: "A network engineer runs: netstat -an | grep :443 and sees 200 lines showing ESTABLISHED connections to the same remote IP. What does this indicate, and what follow-up commands would you run?",
      a: "200 ESTABLISHED connections to port 443 (HTTPS) from the same source suggests either: (1) a web server with 200 active HTTPS sessions — normal if this is a web server, (2) an application using a connection pool, or (3) a potential SYN flood or connection exhaustion attack if the source IP is unexpected. Follow-up commands: (a) ss -tnp | grep :443 — shows the PID/process name owning these connections, confirming if a legitimate application (e.g., nginx, apache) is responsible. (b) netstat -s | grep -i 'connection' — shows TCP connection statistics including failed connection attempts. (c) iptables -L -n -v — check if any firewall rules are rate-limiting new connections. (d) If suspicious: tcpdump -nn -i eth0 port 443 -c 100 — capture 100 packets to inspect whether traffic is legitimate HTTPS or malformed SYN packets. In NMS terms, high connection counts are a Performance Management indicator requiring threshold alerting.",
      type: "Analytical"
    },
    {
      q: "Calculate the theoretical maximum number of SNMP OID variables that snmpbulkwalk can retrieve in one UDP packet, given: MTU = 1500 bytes, UDP header = 8 bytes, IP header = 20 bytes, SNMP fixed overhead = 50 bytes, average varbind size = 35 bytes.",
      a: "Available payload = MTU - IP header - UDP header - SNMP fixed overhead = 1500 - 20 - 8 - 50 = 1422 bytes. Max varbinds = floor(1422 / 35) = floor(40.63) = 40 varbinds per PDU. This is why snmpbulkwalk uses max-repetitions = 10 by default — a conservative value that keeps responses well within the MTU to avoid IP fragmentation. Setting max-repetitions = 40 would retrieve the maximum per PDU but risks fragmentation on links with smaller effective MTU (e.g., VPN tunnels with overhead reducing MTU to 1400 bytes). In practice, operators use max-repetitions = 10-20 as a balance between efficiency and fragmentation risk.",
      type: "Numerical"
    },
    {
      q: "What is the ARP table and why is monitoring it important for network security management?",
      a: "The ARP (Address Resolution Protocol) table maps IPv4 addresses to MAC addresses for devices on the local subnet. Command: arp -a (Linux/Windows) or ip neigh show (Linux). Output format: 192.168.1.1 at aa:bb:cc:dd:ee:ff [ether] on eth0. Security importance: (1) ARP Spoofing — an attacker can send forged ARP replies mapping a legitimate IP (e.g., the default gateway 192.168.1.1) to the attacker's MAC address. All traffic destined for the gateway is then redirected through the attacker (Man-in-the-Middle attack). By monitoring the ARP table, an NMS can detect when a known device's MAC address changes unexpectedly — a key indicator of ARP spoofing. (2) Rogue Device Detection — new MAC addresses appearing in the ARP table that do not match the authorised device inventory indicate unauthorised devices on the network. In NMS Security Management (the S in FCAPS), automated ARP table polling and MAC-to-IP binding verification is a standard defence-in-depth control.",
      type: "Conceptual"
    },
    {
      q: "A traceroute to a remote host shows: Hop 1: 2ms, Hop 2: 3ms, Hop 3: * * *, Hop 4: 150ms, Hop 5: 151ms. Interpret this output and identify the issue.",
      a: "Hop 1 (192.168.1.1, 2ms) and Hop 2 (10.50.0.1, 3ms) are local routers responding normally with low latency. Hop 3 shows * * * — this means the router at Hop 3 either: (a) does not generate ICMP TTL-exceeded messages (common on many enterprise routers for security), or (b) rate-limits ICMP responses. This does NOT indicate packet loss for through-traffic; it just means this router does not reveal itself. Hop 4 (150ms) — a sudden jump of 147ms from Hop 2's 3ms is a significant latency increase. This indicates a long-haul WAN link between Hop 3 and Hop 4 — likely a cross-continental or intercontinental fibre link (e.g., 150ms approximately matches USA to Europe round-trip). Hop 5 (151ms) — only 1ms increase from Hop 4, meaning Hops 4 and 5 are geographically co-located (same data centre). Conclusion: the latency is introduced by the WAN link, not by any device malfunction. The * * * at Hop 3 is normal. This output is expected for international traffic and does not indicate a fault.",
      type: "Analytical"
    }
  ],
  virtualLab: {
    description: "Simulate a traceroute path analysis. Adjust the number of network hops and the WAN link latency (introduced at a specific hop) to observe how RTT accumulates across the path. This mirrors how a real traceroute output reveals where latency is added — critical for NMS fault localisation. The chart plots cumulative RTT at each hop, matching the format of actual traceroute output.",
    interpretation: "In a real traceroute, RTT should increase gradually at each hop (1-5 ms per hop for local links). A sudden large jump (e.g., 100-150 ms) at a specific hop reveals a long-haul WAN link (intercontinental fibre). Flat sections (same RTT for multiple hops) indicate those hops are in the same location. Hops showing no response (* * *) are not packet loss — they are routers that suppress ICMP TTL-exceeded messages. In NMS fault management, traceroute data is used to automatically localise which network segment is causing degraded performance, enabling targeted ticketing to the responsible carrier or engineering team.",
    parameters: [
      { id: "totalHops", name: "Total Hops", min: 5, max: 20, default: 10, step: 1, unit: "" },
      { id: "wanHop", name: "WAN Hop Position", min: 2, max: 15, default: 5, step: 1, unit: "" },
      { id: "wanLatency", name: "WAN Latency (ms)", min: 20, max: 300, default: 120, step: 10, unit: " ms" }
    ],
    generateData: (params) => {
      const hops = Math.min(params.totalHops || 10, 20);
      const wanHop = Math.min(params.wanHop || 5, hops - 1);
      const wanLatency = params.wanLatency || 120;
      const pts: Array<{ x: number; y: number }> = [];
      let cumulativeRtt = 0;
      for (let i = 1; i <= hops; i++) {
        if (i === wanHop) {
          cumulativeRtt += wanLatency;
        } else {
          cumulativeRtt += Math.round(2 + Math.random() * 4);
        }
        pts.push({ x: i, y: cumulativeRtt });
      }
      return pts;
    },
    labels: { x: "Hop Number", y: "Cumulative RTT (ms)" }
  },
  commands: [
    {
      id: "ping",
      name: "ping",
      category: "Reachability & Path",
      oneLiner: "Tests host reachability and measures round-trip time using ICMP Echo Request/Reply.",
      protocol: "ICMP (RFC 792)",
      osiLayer: "Layer 3 — Network",
      syntax: "ping [OPTIONS] <destination>",
      options: [
        { flag: "-c <count>", description: "Stop after sending <count> packets (Linux). Default: run indefinitely.", example: "ping -c 5 8.8.8.8" },
        { flag: "-i <interval>", description: "Wait <interval> seconds between each packet. Default: 1 second. Use 0.2 for faster probing.", example: "ping -i 0.2 192.168.1.1" },
        { flag: "-s <size>", description: "Set ICMP payload size in bytes. Default: 56 bytes (64 with header). Use 1472 for MTU probing (1472 + 28 = 1500).", example: "ping -s 1472 192.168.1.1" },
        { flag: "-t <ttl>", description: "Set the IP Time-To-Live field. Limits how many router hops the packet can traverse.", example: "ping -t 5 8.8.8.8" },
        { flag: "-W <timeout>", description: "Time (seconds) to wait for each reply before declaring packet lost.", example: "ping -W 2 192.168.1.1" },
        { flag: "-f", description: "Flood ping — sends packets as fast as possible. Requires root. Used for stress testing (use with caution).", example: "sudo ping -f -c 1000 192.168.1.1" },
        { flag: "-q", description: "Quiet output — only show summary statistics, not individual packet responses.", example: "ping -c 100 -q 8.8.8.8" },
        { flag: "-n", description: "Do not resolve hostnames — show IP addresses only. Speeds up output.", example: "ping -n -c 4 8.8.8.8" },
        { flag: "-I <interface>", description: "Specify the source interface or source IP address for the ping.", example: "ping -I eth0 8.8.8.8" },
        { flag: "-D", description: "Print UNIX timestamp before each line (useful for logging).", example: "ping -D -c 100 192.168.1.1" }
      ],
      sampleOutput: `PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=12.4 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=11.8 ms
64 bytes from 8.8.8.8: icmp_seq=3 ttl=118 time=13.1 ms
64 bytes from 8.8.8.8: icmp_seq=4 ttl=118 time=12.9 ms
64 bytes from 8.8.8.8: icmp_seq=5 ttl=118 time=11.6 ms

--- 8.8.8.8 ping statistics ---
5 packets transmitted, 5 received, 0% packet loss, time 4005ms
rtt min/avg/max/mdev = 11.6/12.36/13.1/0.535 ms`,
      outputInterpretation: "icmp_seq: sequence number — gaps indicate lost packets. ttl=118: the IP TTL value; started at 128 (Windows) or 64 (Linux) on the source device; 128-118=10 hops traversed. time=12.4 ms: round-trip time. Summary: 0% loss = healthy link. rtt min/avg/max/mdev: minimum, average, maximum RTT, and mean deviation (jitter). mdev=0.535 ms is very low, indicating a stable link with no congestion. If mdev > 50% of avg, investigate for congestion.",
      windowsEquivalent: "ping -n 5 8.8.8.8  (uses -n for count instead of -c)",
      nmContext: "Fault Management: Primary tool for reachability probing. NMS platforms run automated ping probes every 60-300 seconds per device to detect outages. A sustained loss rate > 5% triggers a 'link degraded' alarm. Complete unreachability triggers a P1/P2 incident creation."
    },
  {
    id: "traceroute",
    name: "traceroute / tracert",
    category: "Reachability & Path",
    oneLiner: "Maps the network path to a destination, revealing each intermediate router (hop) and the RTT to each.",
    protocol: "ICMP TTL-exceeded (Linux default: UDP; Windows: ICMP)",
    osiLayer: "Layer 3 — Network",
    syntax: "traceroute [OPTIONS] <destination>",
    options: [
      { flag: "-n", description: "Do not resolve IP addresses to hostnames. Faster output, avoids DNS delays.", example: "traceroute -n 8.8.8.8" },
      { flag: "-m <max_hops>", description: "Maximum number of hops (TTL) to probe. Default: 30.", example: "traceroute -m 15 8.8.8.8" },
      { flag: "-q <nqueries>", description: "Number of probe packets per TTL value. Default: 3. Use 1 for faster output.", example: "traceroute -q 1 8.8.8.8" },
      { flag: "-w <waittime>", description: "Time in seconds to wait for each reply. Default: 5.", example: "traceroute -w 2 8.8.8.8" },
      { flag: "-I", description: "Use ICMP Echo Request instead of UDP probes (requires root on Linux). Same as Windows tracert.", example: "sudo traceroute -I 8.8.8.8" },
      { flag: "-T", description: "Use TCP SYN probes on port 80. Useful when ICMP and UDP are blocked by firewalls.", example: "sudo traceroute -T -p 80 8.8.8.8" },
      { flag: "-p <port>", description: "Set destination port for UDP/TCP probes.", example: "traceroute -T -p 443 8.8.8.8" },
      { flag: "-s <src_ip>", description: "Set source IP address — useful for testing specific interface paths.", example: "traceroute -s 10.0.0.1 8.8.8.8" },
      { flag: "--mtu", description: "Discover path MTU — reports the MTU of each segment. Critical for VPN/tunnel diagnosis.", example: "traceroute --mtu 8.8.8.8" }
    ],
    sampleOutput: `traceroute to 8.8.8.8 (8.8.8.8), 30 hops max, 60 byte packets
 1  192.168.1.1 (192.168.1.1)   1.234 ms   1.102 ms   1.089 ms
 2  10.50.0.1 (10.50.0.1)       4.567 ms   4.401 ms   4.388 ms
 3  * * *
 4  203.0.113.1 (203.0.113.1)   15.234 ms  15.100 ms  15.210 ms
 5  72.14.215.168                120.450 ms 119.998 ms 120.123 ms
 6  8.8.8.8                     121.002 ms 120.889 ms 121.100 ms`,
    outputInterpretation: "Hop 1 (~1ms): Local default gateway/router. Hop 2 (~4ms): ISP edge router (private IP space). Hop 3 (* * *): Router suppresses ICMP TTL-exceeded — normal behaviour, NOT packet loss. Hop 4 (~15ms): ISP backbone router. Hop 5 (~120ms): Large RTT jump — intercontinental WAN link (transatlantic fibre). Hop 6 (~121ms): Destination reached. Only 1ms added after the WAN hop. Key insight: the 105ms jump between Hops 4 and 5 is the bottleneck. Fault localisation points to the WAN link, not local infrastructure.",
    windowsEquivalent: "tracert 8.8.8.8  (uses ICMP by default, no UDP option)",
    nmContext: "Fault Management & Performance Management: Used in NMS to perform path analysis when a device becomes unreachable. Automated traceroute pinpoints the last responsive hop, enabling automatic ticket assignment to the responsible carrier or network segment owner."
  },
  {
    id: "netstat",
    name: "netstat",
    category: "Port & Connection",
    oneLiner: "Displays network connections, routing tables, interface statistics, and socket state information.",
    protocol: "TCP/UDP socket inspection",
    osiLayer: "Layer 4 — Transport",
    syntax: "netstat [OPTIONS]",
    options: [
      { flag: "-a", description: "Show all sockets (listening and non-listening). Default shows only established.", example: "netstat -a" },
      { flag: "-t", description: "Show TCP connections only.", example: "netstat -t" },
      { flag: "-u", description: "Show UDP connections only.", example: "netstat -u" },
      { flag: "-l", description: "Show only listening sockets (services waiting for connections).", example: "netstat -l" },
      { flag: "-n", description: "Show numerical addresses and ports instead of resolving names. Faster output.", example: "netstat -tn" },
      { flag: "-p", description: "Show the PID and program name owning each socket (requires root for full info).", example: "sudo netstat -tulnp" },
      { flag: "-r", description: "Show the routing table (same as route command).", example: "netstat -r" },
      { flag: "-s", description: "Show per-protocol statistics: packets sent/received, errors, retransmissions.", example: "netstat -s" },
      { flag: "-i", description: "Show per-interface statistics: bytes in/out, errors, drops.", example: "netstat -i" },
      { flag: "-c", description: "Continuously refresh output every second.", example: "netstat -c -tulnp" }
    ],
    sampleOutput: `Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address     Foreign Address  State        PID/Program
tcp        0      0 0.0.0.0:22        0.0.0.0:*        LISTEN       1234/sshd
tcp        0      0 0.0.0.0:80        0.0.0.0:*        LISTEN       5678/nginx
tcp        0      0 127.0.0.1:3306    0.0.0.0:*        LISTEN       9012/mysqld
tcp6       0      0 :::443            :::*             LISTEN       5678/nginx
tcp        0      0 10.0.0.5:22       192.168.1.100:51234 ESTABLISHED 1234/sshd
udp        0      0 0.0.0.0:161       0.0.0.0:*                     3456/snmpd`,
    outputInterpretation: "Proto: TCP or UDP. Recv-Q/Send-Q: bytes queued in receive/send buffer — non-zero values indicate application not reading data fast enough. Local Address: 0.0.0.0 = all interfaces, 127.0.0.1 = loopback only. State: LISTEN (waiting for connections), ESTABLISHED (active connection), TIME_WAIT (connection closed, waiting for retransmissions), CLOSE_WAIT (remote peer closed, local app has not called close()). A large number of TIME_WAIT indicates high connection turnover. Many CLOSE_WAIT suggests an application bug (not closing sockets). Port 161 UDP = SNMP agent is running.",
    windowsEquivalent: "netstat -ano  (uses -o for PID instead of -p; requires tasklist to map PIDs to names)",
    nmContext: "Performance Management & Fault Management: NMS uses socket state counts as KPIs. High Send-Q values indicate server overload. Unexpected LISTEN ports indicate security violations (unauthorized services). SNMP MIB-II tcpConnTable and udpTable provide the same data remotely without needing CLI access."
  },
  {
    id: "ss",
    name: "ss (Socket Statistics)",
    category: "Port & Connection",
    oneLiner: "Modern replacement for netstat — faster and provides richer TCP socket information including congestion window and retransmissions.",
    protocol: "TCP/UDP kernel socket inspection via netlink",
    osiLayer: "Layer 4 — Transport",
    syntax: "ss [OPTIONS] [FILTER]",
    options: [
      { flag: "-t", description: "Show TCP sockets.", example: "ss -t" },
      { flag: "-u", description: "Show UDP sockets.", example: "ss -u" },
      { flag: "-l", description: "Show listening sockets only.", example: "ss -tl" },
      { flag: "-a", description: "Show all sockets (listening and connected).", example: "ss -ta" },
      { flag: "-n", description: "Do not resolve service names — show port numbers.", example: "ss -tn" },
      { flag: "-p", description: "Show process using each socket.", example: "ss -tp" },
      { flag: "-i", description: "Show internal TCP information: retransmissions, cwnd (congestion window), RTT.", example: "ss -ti" },
      { flag: "-o", description: "Show timer information (keepalive, retransmit timers).", example: "ss -to" },
      { flag: "-4 / -6", description: "Show only IPv4 or IPv6 sockets.", example: "ss -4 -tl" },
      { flag: "dst <ip>", description: "Filter: show only sockets with destination matching <ip>.", example: "ss -tn dst 8.8.8.8" },
      { flag: "state established", description: "Filter by socket state: established, listen, time-wait, close-wait, etc.", example: "ss -tn state established" }
    ],
    sampleOutput: `State    Recv-Q  Send-Q  Local Address:Port    Peer Address:Port   Process
LISTEN   0       128     0.0.0.0:22           0.0.0.0:*           users:(("sshd",pid=1234,fd=3))
ESTAB    0       0       10.0.0.5:22          192.168.1.100:51234 users:(("sshd",pid=2345,fd=4))
ESTAB    0       52124   10.0.0.5:443         203.0.113.50:61000  users:(("nginx",pid=5678,fd=12))

# ss -ti output:
ESTAB    0       52124   10.0.0.5:443  203.0.113.50:61000
     cubic wscale:7,7 rto:236 rtt:18.5/4.2 ato:40 mss:1460 pmtu:1500
     rcvmss:1460 advmss:1460 cwnd:10 ssthresh:12 bytes_sent:14582 retrans:0/2`,
    outputInterpretation: "LISTEN with Recv-Q=128: the TCP backlog queue size — kernel queues up to 128 incoming connections before dropping. ESTAB Send-Q=52124: 52 KB queued to send — the remote peer is not receiving data fast enough (possible network congestion or slow receiver). cubic = congestion control algorithm. rtt:18.5/4.2 = mean/variance RTT in ms. cwnd:10 = congestion window (10 segments). ssthresh:12 = slow-start threshold. retrans:0/2 = total/current retransmissions. retrans > 0 confirms packet loss on this connection. ss -i is the most powerful tool for diagnosing individual TCP connection performance.",
    windowsEquivalent: "netstat -ano (Windows lacks equivalent internal TCP detail; use Performance Monitor for TCP counters)",
    nmContext: "Performance Management: ss -i reveals TCP congestion window size and retransmissions per connection — essential for diagnosing application-layer performance issues without a full packet capture."
  },
  {
    id: "ip-addr",
    name: "ip addr / ifconfig",
    category: "Interface & Address",
    oneLiner: "Displays and configures network interface addresses, MTU, state, and MAC addresses.",
    protocol: "Kernel network interface management",
    osiLayer: "Layer 2-3 — Data Link & Network",
    syntax: "ip addr [show | add | del | flush] [OPTIONS]  |  ifconfig [interface] [OPTIONS]",
    options: [
      { flag: "ip addr show", description: "Show all interfaces with their IP addresses, MAC addresses, and state.", example: "ip addr show" },
      { flag: "ip addr show eth0", description: "Show only the eth0 interface.", example: "ip addr show eth0" },
      { flag: "ip addr add <ip/prefix> dev <iface>", description: "Add an IP address to an interface.", example: "ip addr add 192.168.1.10/24 dev eth0" },
      { flag: "ip addr del <ip/prefix> dev <iface>", description: "Remove an IP address from an interface.", example: "ip addr del 192.168.1.10/24 dev eth0" },
      { flag: "ip link set eth0 up/down", description: "Bring an interface up or down.", example: "ip link set eth0 down" },
      { flag: "ip link set eth0 mtu 9000", description: "Set the MTU (Maximum Transmission Unit) of an interface.", example: "ip link set eth0 mtu 9000" },
      { flag: "ip -s link show", description: "Show interface statistics: bytes/packets transmitted, errors, drops.", example: "ip -s link show eth0" }
    ],
    sampleOutput: `2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether aa:bb:cc:dd:ee:ff brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.100/24 brd 192.168.1.255 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::aabb:ccff:fedd:eeff/64 scope link

# ip -s link show eth0:
    RX: bytes  packets  errors  dropped  missed  mcast
    52345678   432100   0       12       0       100
    TX: bytes  packets  errors  dropped  carrier collsns
    23456789   211000   0       0        0       0`,
    outputInterpretation: "UP,LOWER_UP: interface is administratively up AND the physical link is detected (cable connected). mtu 1500: Maximum Transmission Unit. inet 192.168.1.100/24: IPv4 address with /24 prefix. brd 192.168.1.255: broadcast address. inet6 fe80::/64: link-local IPv6 address (auto-configured). Statistics: RX dropped=12 — 12 packets dropped on receive; check for buffer overflow (increase ring buffer with ethtool -G). errors=0 — no CRC or frame errors (healthy physical link).",
    windowsEquivalent: "ipconfig /all  (shows IP, MAC, DHCP info); netsh interface show interface  (shows interface state)",
    nmContext: "Configuration Management & Fault Management: Interface state (UP/DOWN) is the primary source for link alarms in NMS. SNMP ifOperStatus (1.3.6.1.2.1.2.2.1.8) maps to this: 1=up, 2=down, 3=testing. Error counters (ifInErrors, ifOutErrors) are polled every 5 minutes to detect deteriorating physical links before complete failure."
  },
  {
    id: "ip-route",
    name: "ip route / route",
    category: "Routing",
    oneLiner: "Displays and manipulates the kernel IP routing table — shows how packets are forwarded to destinations.",
    protocol: "Kernel routing table (static routes, OSPF/BGP-installed routes)",
    osiLayer: "Layer 3 — Network",
    syntax: "ip route [show | add | del | get] [OPTIONS]  |  route [add | del | -n]",
    options: [
      { flag: "ip route show", description: "Display the entire routing table.", example: "ip route show" },
      { flag: "ip route show table all", description: "Show all routing tables including policy routing tables.", example: "ip route show table all" },
      { flag: "ip route get <destination>", description: "Show exactly which route and interface would be used to reach a specific destination.", example: "ip route get 8.8.8.8" },
      { flag: "ip route add <prefix> via <gateway>", description: "Add a static route.", example: "ip route add 10.0.0.0/8 via 192.168.1.1" },
      { flag: "ip route add default via <gw>", description: "Set the default gateway.", example: "ip route add default via 192.168.1.1" },
      { flag: "ip route del <prefix>", description: "Remove a route.", example: "ip route del 10.0.0.0/8" },
      { flag: "ip route flush cache", description: "Clear the routing cache. Useful after route changes.", example: "ip route flush cache" },
      { flag: "route -n", description: "(Legacy) Show routing table without resolving names.", example: "route -n" }
    ],
    sampleOutput: `# ip route show
default via 192.168.1.1 dev eth0 proto dhcp src 192.168.1.100 metric 100
10.0.0.0/8 via 10.50.0.1 dev eth1 proto static metric 200
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100

# ip route get 8.8.8.8
8.8.8.8 via 192.168.1.1 dev eth0 src 192.168.1.100 uid 0
    cache`,
    outputInterpretation: "default via 192.168.1.1: packets with no specific match go to the default gateway via eth0. 10.0.0.0/8 via 10.50.0.1 metric 200: route to 10.x.x.x via a secondary gateway; higher metric = less preferred. proto kernel: route auto-generated by kernel when interface comes up. proto dhcp: route installed by DHCP client. proto static: manually configured. ip route get 8.8.8.8 confirms the exact gateway and source IP that would be used — critical for verifying policy routing decisions.",
    windowsEquivalent: "route print   or   netstat -r   (Windows routing table)",
    nmContext: "Configuration Management & Fault Management: Missing or incorrect routes are a common cause of network outages. NMS monitors the ipRouteTable (1.3.6.1.2.1.4.21) via SNMP to detect route changes. BGP/OSPF route withdrawals are logged as alarm events."
  },
  {
    id: "arp",
    name: "arp / ip neigh",
    category: "ARP & Neighbor",
    oneLiner: "Displays and manages the ARP cache — the Layer 2 to Layer 3 address mapping table for the local subnet.",
    protocol: "ARP (RFC 826)",
    osiLayer: "Layer 2-3 — Data Link & Network",
    syntax: "arp [OPTIONS]  |  ip neigh [show | add | del | flush]",
    options: [
      { flag: "arp -a", description: "Show all ARP cache entries in BSD format (hostname, IP, MAC, interface).", example: "arp -a" },
      { flag: "arp -n", description: "Show ARP entries without resolving hostnames to IP addresses.", example: "arp -n" },
      { flag: "arp -i <iface>", description: "Show ARP entries for a specific interface only.", example: "arp -n -i eth0" },
      { flag: "arp -d <ip>", description: "Delete an ARP cache entry — forces re-ARP on next packet to that IP.", example: "arp -d 192.168.1.1" },
      { flag: "arp -s <ip> <mac>", description: "Add a static/permanent ARP entry — prevents ARP spoofing for critical hosts.", example: "arp -s 192.168.1.1 aa:bb:cc:dd:ee:ff" },
      { flag: "ip neigh show", description: "(Modern) Show neighbor table with state information.", example: "ip neigh show" },
      { flag: "ip neigh flush dev eth0", description: "Clear all ARP cache entries on an interface.", example: "ip neigh flush dev eth0" }
    ],
    sampleOutput: `# arp -n
Address          HWtype  HWaddress          Flags Mask  Iface
192.168.1.1      ether   aa:bb:cc:dd:ee:ff  C           eth0
192.168.1.50     ether   11:22:33:44:55:66  C           eth0
192.168.1.200    ether   (incomplete)                   eth0

# ip neigh show
192.168.1.1  dev eth0 lladdr aa:bb:cc:dd:ee:ff REACHABLE
192.168.1.50 dev eth0 lladdr 11:22:33:44:55:66 STALE
192.168.1.200 dev eth0 FAILED`,
    outputInterpretation: "Flags C: dynamically learned entry. REACHABLE: the entry is confirmed valid (kernel recently received a packet from this host). STALE: entry not recently confirmed — will be verified on next use (normal). FAILED: ARP resolution failed — the host did not respond. (incomplete): same as FAILED — no reply to ARP request. Security: if the gateway MAC address changes unexpectedly in the ARP table, suspect ARP poisoning/spoofing.",
    windowsEquivalent: "arp -a   (same flags and output format on Windows)",
    nmContext: "Configuration Management & Security Management: NMS uses ARP table polling to build and maintain network topology maps. MAC address changes for known IPs trigger 'IP-MAC binding violation' security alarms. ARP table data feeds the CMDB (Configuration Management Database) with physical layer device identity."
  },
  {
    id: "nmap",
    name: "nmap",
    category: "Network Discovery",
    oneLiner: "Network discovery and security auditing tool — discovers live hosts, open ports, running services, and OS versions.",
    protocol: "ICMP, TCP SYN/connect, UDP",
    osiLayer: "Layer 3-4 — Network & Transport",
    syntax: "nmap [OPTIONS] <target>",
    options: [
      { flag: "-sn", description: "Ping scan — discover live hosts without port scanning. Fastest host discovery.", example: "nmap -sn 192.168.1.0/24" },
      { flag: "-sS", description: "TCP SYN scan (stealth) — sends SYN, does not complete handshake. Requires root.", example: "sudo nmap -sS 192.168.1.1" },
      { flag: "-sT", description: "TCP connect scan — full TCP handshake. Works without root but is noisier.", example: "nmap -sT 192.168.1.1" },
      { flag: "-sU", description: "UDP scan — discover UDP services (SNMP:161, DNS:53, DHCP:67). Slow but essential.", example: "sudo nmap -sU -p 161,53,67 192.168.1.1" },
      { flag: "-p <ports>", description: "Specify ports to scan. Examples: -p 22,80,443 or -p 1-1000 or -p- (all 65535).", example: "nmap -p 22,80,443 192.168.1.1" },
      { flag: "-sV", description: "Version detection — probe open ports to determine service name and version.", example: "nmap -sV 192.168.1.1" },
      { flag: "-O", description: "OS detection — identify the operating system via TCP/IP stack fingerprinting.", example: "sudo nmap -O 192.168.1.1" },
      { flag: "-A", description: "Aggressive scan: OS detection + version detection + script scanning + traceroute.", example: "sudo nmap -A 192.168.1.1" },
      { flag: "-T<0-5>", description: "Timing template: T0=paranoid, T3=normal, T4=aggressive, T5=insane. Use T4 for speed.", example: "nmap -T4 -sS 192.168.1.0/24" },
      { flag: "-oX <file>", description: "Save output in XML format (parseable by NMS tools).", example: "nmap -sV -oX inventory.xml 192.168.1.0/24" },
      { flag: "--script <script>", description: "Run Nmap scripts (NSE) for advanced checks: vulnerability scanning, SNMP enumeration.", example: "nmap --script snmp-info -sU -p 161 192.168.1.1" }
    ],
    sampleOutput: `Starting Nmap 7.94
Nmap scan report for router.local (192.168.1.1)
Host is up (0.0012s latency).
PORT     STATE SERVICE    VERSION
22/tcp   open  ssh        OpenSSH 8.9p1 Ubuntu
80/tcp   open  http       nginx 1.23.1
443/tcp  open  https      nginx 1.23.1
161/udp  open  snmp       SNMPv2c (public)
MAC Address: AA:BB:CC:DD:EE:FF (Cisco Systems)
OS details: Linux 5.15 - 5.19

Nmap done: 254 IP addresses (18 hosts up) scanned in 4.23 seconds`,
    outputInterpretation: "22/tcp open ssh OpenSSH 8.9p1: SSH service — version indicates Ubuntu system. Check CVEs for this version. 161/udp snmp (public): SNMP agent using default community string 'public' — CRITICAL SECURITY FINDING. Default community strings must be changed. MAC Address AA:BB:CC:DD:EE:FF (Cisco Systems): OUI lookup identifies hardware vendor. OS: Linux 5.15-5.19 — assists in patch management. Subnet sweep: 18 of 254 addresses are live. Compare against authorised device list — unrecognised hosts are rogue devices.",
    windowsEquivalent: "nmap is cross-platform — same command syntax on Windows. Download from nmap.org",
    nmContext: "Configuration Management & Security Management: NMS uses automated nmap-style scanning for network discovery, open port auditing (detecting unauthorised services), and SNMP version identification. XML output (-oX) feeds directly into CMDB and vulnerability management systems."
  },
  {
    id: "dig",
    name: "dig / nslookup",
    category: "DNS & Name Resolution",
    oneLiner: "Performs DNS lookups — queries DNS servers to resolve hostnames to IPs and retrieve DNS records.",
    protocol: "DNS (UDP/TCP port 53, RFC 1035)",
    osiLayer: "Layer 7 — Application",
    syntax: "dig [@server] <name> [type] [OPTIONS]  |  nslookup <name> [server]",
    options: [
      { flag: "dig <hostname>", description: "Standard A record lookup — resolves hostname to IPv4 address.", example: "dig google.com" },
      { flag: "dig <hostname> AAAA", description: "Resolve hostname to IPv6 address.", example: "dig google.com AAAA" },
      { flag: "dig <hostname> MX", description: "Look up Mail Exchange records for a domain.", example: "dig gmail.com MX" },
      { flag: "dig <hostname> NS", description: "Look up authoritative Name Server records.", example: "dig google.com NS" },
      { flag: "dig <hostname> TXT", description: "Retrieve TXT records (SPF, DKIM, domain verification).", example: "dig google.com TXT" },
      { flag: "dig -x <ip>", description: "Reverse DNS lookup — resolve IP to hostname (PTR record).", example: "dig -x 8.8.8.8" },
      { flag: "dig @<server> <hostname>", description: "Query a specific DNS server instead of the system default.", example: "dig @8.8.8.8 google.com" },
      { flag: "dig +short", description: "Return only the answer — no verbose headers. Useful in scripts.", example: "dig +short google.com" },
      { flag: "dig +trace", description: "Trace the full DNS resolution path from root servers to authoritative NS.", example: "dig +trace google.com" }
    ],
    sampleOutput: `# dig google.com
;; QUESTION SECTION:
;google.com.                  IN    A

;; ANSWER SECTION:
google.com.           270    IN    A    142.250.80.46

;; Query time: 12 msec
;; SERVER: 192.168.1.1#53(192.168.1.1)

# dig -x 8.8.8.8
;; ANSWER SECTION:
8.8.8.8.in-addr.arpa.  21599  IN  PTR  dns.google.

# dig +short google.com
142.250.80.46`,
    outputInterpretation: "ANSWER SECTION: google.com resolves to 142.250.80.46 with TTL=270 seconds (the answer will be cached for 270 seconds). SERVER: 192.168.1.1 answered (local DNS resolver, likely the router). Query time 12ms: local cache or fast upstream. If query time is very high (>500ms), DNS resolution is adding latency to every connection. PTR record (reverse DNS): 8.8.8.8 maps to dns.google — useful for verifying that an IP belongs to a legitimate owner. NXDOMAIN response means the domain does not exist. SERVFAIL means DNS server error.",
    windowsEquivalent: "nslookup google.com   (built-in on Windows);  Resolve-DnsName google.com  (PowerShell)",
    nmContext: "Fault Management: DNS failures cause application-level outages even when IP connectivity is intact. NMS monitors DNS resolution time as a KPI. dig is used in synthetic monitoring to verify that managed DNS zones are resolving correctly."
  },
  {
    id: "tcpdump",
    name: "tcpdump",
    category: "Packet Capture",
    oneLiner: "Captures and analyses network packets in real time — the primary CLI packet sniffer for protocol-level diagnostics.",
    protocol: "Any — operates at the raw packet level via libpcap",
    osiLayer: "Layer 2-7 — All Layers",
    syntax: "tcpdump [OPTIONS] [filter expression]",
    options: [
      { flag: "-i <interface>", description: "Specify which interface to capture on. Use -i any to capture on all interfaces.", example: "tcpdump -i eth0" },
      { flag: "-n", description: "Do not resolve hostnames or port names. Faster, cleaner output.", example: "tcpdump -n -i eth0" },
      { flag: "-c <count>", description: "Capture exactly <count> packets then stop.", example: "tcpdump -c 100 -i eth0" },
      { flag: "-w <file>", description: "Write captured packets to a .pcap file (readable by Wireshark).", example: "tcpdump -w capture.pcap -i eth0" },
      { flag: "-r <file>", description: "Read packets from a previously saved .pcap file.", example: "tcpdump -r capture.pcap" },
      { flag: "-v / -vv / -vvv", description: "Increase verbosity: -v shows TTL and checksum, -vv shows full protocol decode.", example: "tcpdump -vv -i eth0 icmp" },
      { flag: "-X", description: "Print packet data in hex and ASCII — shows payload content.", example: "tcpdump -X -i eth0 port 80" },
      { flag: "host <ip>", description: "Filter: capture packets to or from a specific host.", example: "tcpdump -n host 192.168.1.1" },
      { flag: "port <port>", description: "Filter: capture packets on a specific port.", example: "tcpdump -n port 443" },
      { flag: "src/dst <ip/port>", description: "Filter by source or destination IP/port.", example: "tcpdump src 10.0.0.1 and dst port 80" },
      { flag: "icmp / tcp / udp", description: "Filter by protocol.", example: "tcpdump -n icmp" }
    ],
    sampleOutput: `tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on eth0, link-type EN10MB (Ethernet)

10:15:01.234567 IP 192.168.1.100.52341 > 203.0.113.10.80: Flags [S], seq 1234567890, win 65535, options [mss 1460,sackOK,TS val 1000000 ecr 0,nop,wscale 7], length 0
10:15:01.246789 IP 203.0.113.10.80 > 192.168.1.100.52341: Flags [S.], seq 987654321, ack 1234567891, win 65535, options [mss 1460,sackOK,TS val 2000000 ecr 1000000,nop,wscale 9], length 0
10:15:01.246900 IP 192.168.1.100.52341 > 203.0.113.10.80: Flags [.], ack 987654322, win 512, length 0
10:15:01.247100 IP 192.168.1.100.52341 > 203.0.113.10.80: Flags [P.], seq 1:77, ack 1, win 512, length 76: HTTP: GET / HTTP/1.1`,
    outputInterpretation: "Flags [S]: TCP SYN — connection request. Flags [S.]: SYN-ACK — server accepted. Flags [.]: ACK — three-way handshake complete. Flags [P.]: PUSH+ACK — data being sent. Flags [F]: FIN — connection close. Flags [R]: RST — connection reset (abrupt close, often due to firewall rule or service rejection). RTT between SYN and SYN-ACK = 12.2ms — the actual network RTT. win 512: receiver buffer window — if this drops to 0, the sender must pause (TCP flow control).",
    windowsEquivalent: "Wireshark (GUI) or tshark (CLI, same filter syntax as tcpdump)",
    nmContext: "Fault Management: tcpdump is the last-resort diagnostic tool in NMS. Used when SNMP data does not reveal the root cause of an intermittent fault. Output is saved as .pcap files and attached to incident tickets for escalation to Tier 3 or vendor support."
  },
  {
    id: "snmpget",
    name: "snmpget",
    category: "SNMP Management",
    oneLiner: "Retrieves the value of a specific SNMP OID from a managed device — the fundamental NMS southbound polling operation.",
    protocol: "SNMP (UDP port 161, RFC 1157/3412)",
    osiLayer: "Layer 7 — Application (over UDP Layer 4)",
    syntax: "snmpget [OPTIONS] <agent> <OID>",
    options: [
      { flag: "-v 1 / -v 2c / -v 3", description: "SNMP version. Use -v 2c for most networks; -v 3 for secure environments.", example: "snmpget -v 2c -c public 192.168.1.1 1.3.6.1.2.1.1.1.0" },
      { flag: "-c <community>", description: "Community string for SNMPv1/v2c (acts as password). Default: 'public'.", example: "snmpget -v 2c -c public 192.168.1.1 sysDescr.0" },
      { flag: "-u <username>", description: "SNMPv3 username.", example: "snmpget -v 3 -u admin 192.168.1.1 sysUpTime.0" },
      { flag: "-l authPriv", description: "SNMPv3 security level: noAuthNoPriv, authNoPriv, or authPriv.", example: "snmpget -v 3 -u admin -l authPriv -a SHA -A mypass -x AES -X encpass 192.168.1.1 sysUpTime.0" },
      { flag: "-a <auth-proto>", description: "SNMPv3 authentication protocol: MD5 or SHA.", example: "-a SHA" },
      { flag: "-x <priv-proto>", description: "SNMPv3 privacy/encryption protocol: DES or AES.", example: "-x AES" },
      { flag: "-t <timeout>", description: "Timeout in seconds for each request. Default: 1.", example: "snmpget -t 5 -v 2c -c public 192.168.1.1 sysUpTime.0" },
      { flag: "-r <retries>", description: "Number of retry attempts on timeout. Default: 5.", example: "snmpget -r 3 -v 2c -c public 192.168.1.1 sysUpTime.0" },
      { flag: "-On", description: "Output OID in numeric format (no MIB name resolution).", example: "snmpget -On -v 2c -c public 192.168.1.1 sysDescr.0" },
      { flag: "-Ov", description: "Output only the value, no OID or type prefix.", example: "snmpget -Ov -v 2c -c public 192.168.1.1 sysUpTime.0" }
    ],
    sampleOutput: `# snmpget -v 2c -c public 192.168.1.1 sysDescr.0
SNMPv2-MIB::sysDescr.0 = STRING: Cisco IOS Software, Version 15.7(3)M6, RELEASE SOFTWARE (fc3)

# snmpget -v 2c -c public 192.168.1.1 sysUpTime.0
DISMAN-EVENT-MIB::sysUpTimeInstance = Timeticks: (432105678) 50 days, 0:17:36.78

# snmpget -v 2c -c public 192.168.1.1 1.3.6.1.2.1.2.2.1.8.1
IF-MIB::ifOperStatus.1 = INTEGER: up(1)

# snmpget -v 2c -c public 192.168.1.1 1.3.6.1.2.1.2.2.1.10.1
IF-MIB::ifInOctets.1 = Counter32: 4823456789`,
    outputInterpretation: "sysDescr.0: The .0 suffix is mandatory for scalar objects — retrieves a single instance. Returns the device description string: OS version, platform. Used for automated inventory. sysUpTime.0: Returns Timeticks in hundredths of a second. 432105678 / 100 / 86400 = approximately 50 days uptime. A sysUpTime lower than expected indicates a recent reboot — trigger a 'cold restart' alarm. ifOperStatus.1: Interface 1 operational status = up(1). Values: 1=up, 2=down. Value 2 triggers a linkDown alarm. ifInOctets.1: Total bytes received on interface 1. As a Counter32, it wraps at 4.29 GB. Poll twice, compute delta/elapsed_seconds = bytes/second throughput.",
    windowsEquivalent: "snmpget is cross-platform — install Net-SNMP tools on Windows.",
    nmContext: "This IS the NMS southbound polling operation. Every commercial NMS (Ericsson ENM, Nokia NetAct, Huawei U2000) uses SNMP GET requests to retrieve KPIs: CPU load, interface utilisation (ifInOctets/ifOutOctets), error rates (ifInErrors), and alarm states. Poll cycle time directly impacts the freshness of NMS dashboards."
  },
  {
    id: "snmpwalk",
    name: "snmpwalk",
    category: "SNMP Management",
    oneLiner: "Traverses an entire MIB subtree using successive GETNEXT operations — retrieves all OIDs under a given root.",
    protocol: "SNMP GETNEXT PDU (UDP port 161)",
    osiLayer: "Layer 7 — Application",
    syntax: "snmpwalk [OPTIONS] <agent> [OID]",
    options: [
      { flag: "-v 2c -c <community>", description: "SNMP version and community string (same as snmpget).", example: "snmpwalk -v 2c -c public 192.168.1.1" },
      { flag: "OID (optional)", description: "Root OID to start walking from. Default: 1.3.6.1.2.1 (MIB-II). Specify to narrow the walk.", example: "snmpwalk -v 2c -c public 192.168.1.1 1.3.6.1.2.1.2" },
      { flag: "-O n", description: "Display OIDs numerically. Useful when MIB files are not installed.", example: "snmpwalk -On -v 2c -c public 192.168.1.1" },
      { flag: "-t <timeout>", description: "Seconds to wait for each response. Increase for slow devices.", example: "snmpwalk -t 10 -v 2c -c public 192.168.1.1" },
      { flag: "snmpbulkwalk", description: "Uses GETBULK PDU — retrieves multiple OIDs per request (much faster for large tables). Requires SNMPv2c or v3.", example: "snmpbulkwalk -v 2c -c public -Cn0 -Cr10 192.168.1.1 ifTable" }
    ],
    sampleOutput: `# snmpwalk -v 2c -c public 192.168.1.1 system
SNMPv2-MIB::sysDescr.0 = STRING: Cisco IOS Software, Version 15.7(3)M6
SNMPv2-MIB::sysObjectID.0 = OID: CISCO-PRODUCTS-MIB::cisco2611
SNMPv2-MIB::sysUpTime.0 = Timeticks: (432105678) 50 days, 0:17:36.78
SNMPv2-MIB::sysContact.0 = STRING: NOC Team <noc@company.com>
SNMPv2-MIB::sysName.0 = STRING: core-router-01
SNMPv2-MIB::sysLocation.0 = STRING: DC-1, Rack 12, Unit 4

# snmpwalk -v 2c -c public 192.168.1.1 ifTable
IF-MIB::ifIndex.1 = INTEGER: 1
IF-MIB::ifDescr.1 = STRING: GigabitEthernet0/0
IF-MIB::ifType.1 = INTEGER: ethernetCsmacd(6)
IF-MIB::ifSpeed.1 = Gauge32: 1000000000
IF-MIB::ifPhysAddress.1 = STRING: aa:bb:cc:dd:ee:ff
IF-MIB::ifOperStatus.1 = INTEGER: up(1)
IF-MIB::ifInOctets.1 = Counter32: 4823456789
IF-MIB::ifOutOctets.1 = Counter32: 2345678901
IF-MIB::ifInErrors.1 = Counter32: 0
IF-MIB::ifOutErrors.1 = Counter32: 0`,
    outputInterpretation: "System group walk: sysName='core-router-01' identifies the device. sysLocation provides physical location for field dispatch. sysObjectID identifies the exact device type (used for vendor-specific MIB loading). ifTable walk: Each interface row contains ifIndex, ifDescr (name), ifType (6=Ethernet), ifSpeed (1 Gbps), ifPhysAddress (MAC), ifOperStatus (1=up, 2=down). Throughput calculation: Poll ifInOctets twice: [(value2 - value1) / elapsed_seconds x 8] = bits/second. For Counter32 wrap detection: if value2 < value1, add 4,294,967,296 before subtracting. ifInErrors > 0 indicates physical layer problems.",
    windowsEquivalent: "snmpwalk (Net-SNMP for Windows).",
    nmContext: "This is the primary NMS bulk data collection operation. A full ifTable walk retrieves all interface KPIs in one sequence. NMS platforms schedule snmpwalk-equivalent operations every 5 minutes for performance monitoring. snmpbulkwalk with max-repetitions=20 reduces the number of UDP packets by 20x compared to individual GET requests."
  },
  {
    id: "ethtool",
    name: "ethtool",
    category: "Interface & Address",
    oneLiner: "Displays and configures Ethernet interface hardware settings — speed, duplex, NIC statistics, and driver information.",
    protocol: "Ethernet NIC kernel driver interface",
    osiLayer: "Layer 1-2 — Physical & Data Link",
    syntax: "ethtool [OPTIONS] <interface>",
    options: [
      { flag: "ethtool eth0", description: "Show interface speed, duplex, link status, and auto-negotiation state.", example: "ethtool eth0" },
      { flag: "ethtool -S eth0", description: "Show hardware NIC statistics: rx/tx counters, drops, errors — more detailed than ip -s link.", example: "ethtool -S eth0" },
      { flag: "ethtool -i eth0", description: "Show driver information: driver name, version, firmware version.", example: "ethtool -i eth0" },
      { flag: "ethtool -a eth0", description: "Show pause frame settings (flow control between NIC and switch).", example: "ethtool -a eth0" },
      { flag: "ethtool -g eth0", description: "Show ring buffer sizes (rx/tx) — increase to reduce packet drops under high load.", example: "ethtool -g eth0" },
      { flag: "ethtool -G eth0 rx 4096", description: "Set receive ring buffer to 4096 entries to reduce drops.", example: "ethtool -G eth0 rx 4096 tx 4096" },
      { flag: "ethtool -s eth0 speed 1000 duplex full autoneg off", description: "Force speed and duplex — disable auto-negotiation.", example: "ethtool -s eth0 speed 1000 duplex full autoneg off" }
    ],
    sampleOutput: `# ethtool eth0
Settings for eth0:
    Supported link modes:   10baseT/Half 10baseT/Full
                            100baseT/Half 100baseT/Full
                            1000baseT/Full
    Speed: 1000Mb/s
    Duplex: Full
    Auto-negotiation: on
    Link detected: yes

# ethtool -S eth0 | grep -E "error|drop|miss"
rx_crc_errors: 0
rx_frame_errors: 0
rx_missed_errors: 12
tx_dropped: 0`,
    outputInterpretation: "Speed: 1000Mb/s, Duplex: Full: Gigabit full-duplex — optimal. If Speed=100Mb/s or Duplex=Half on a GbE link, auto-negotiation has failed — force speed/duplex manually. Link detected: yes = physical cable connected. rx_missed_errors: 12 — packets dropped because the receive ring buffer was full; increase ring buffer with ethtool -G eth0 rx 4096. rx_crc_errors > 0 — corrupted frames received; indicates physical layer problems (bad cable, failing NIC, or switch port).",
    windowsEquivalent: "Get-NetAdapter -Name 'Ethernet' | Get-NetAdapterStatistics  (PowerShell). Device Manager for speed/duplex.",
    nmContext: "Performance Management: ethtool -S rx_missed_errors reveals packet drops that SNMP counters may not capture (hardware-level drops before the OS sees the packet). Critical for high-throughput servers and network appliances."
  },
  {
    id: "mtr",
    name: "mtr (My TraceRoute)",
    category: "Reachability & Path",
    oneLiner: "Combines ping and traceroute into a continuously updated interactive display — the most powerful path diagnosis tool.",
    protocol: "ICMP + UDP/TCP probes",
    osiLayer: "Layer 3 — Network",
    syntax: "mtr [OPTIONS] <destination>",
    options: [
      { flag: "mtr <host>", description: "Interactive mode — continuously updates RTT and loss statistics per hop.", example: "mtr 8.8.8.8" },
      { flag: "--report / -r", description: "Report mode — send N packets then print a summary and exit (useful in scripts).", example: "mtr --report -c 100 8.8.8.8" },
      { flag: "-c <count>", description: "Number of pings to send per hop in report mode. Default: 10.", example: "mtr -r -c 50 8.8.8.8" },
      { flag: "-n", description: "Do not resolve hostnames — show IP addresses only.", example: "mtr -n 8.8.8.8" },
      { flag: "--tcp / --udp", description: "Use TCP SYN or UDP probes instead of ICMP.", example: "mtr --tcp --port 443 8.8.8.8" },
      { flag: "--json", description: "Output report in JSON format for NMS integration.", example: "mtr --json --report 8.8.8.8" }
    ],
    sampleOutput: `Start: 2026-07-07T10:00:00+0000
HOST: server-01               Loss%   Snt  Last  Avg  Best  Wrst StDev
  1. 192.168.1.1              0.0%    100  1.2   1.1  0.9   2.1  0.2
  2. 10.50.0.1                0.0%    100  4.5   4.3  3.9   6.1  0.4
  3. ???                      100.0%  100  0.0   0.0  0.0   0.0  0.0
  4. 203.0.113.1              0.0%    100  15.2  14.8 14.1  18.3 0.9
  5. 72.14.215.168            0.0%    100  121.1 120.5 119.2 125.0 1.3
  6. 8.8.8.8                  0.0%    100  121.5 120.9 119.8 125.4 1.4`,
    outputInterpretation: "Loss%: Packet loss percentage for each hop across 100 probes. 0.0% = no loss. Hop 3: 100% loss with ??? — this router does not respond to probes (ICMP rate-limiting). NOT a real loss — all subsequent hops show 0% loss. Avg: Average RTT. StDev (standard deviation): measure of jitter. StDev > 10ms indicates congestion or unstable path. If a middle hop shows 30% loss AND all subsequent hops also show 30% loss, the loss is real and occurring AT that hop. If only one hop shows loss but destination has 0%, the hop is just rate-limiting ICMP.",
    windowsEquivalent: "WinMTR (GUI for Windows). PingPlotter (commercial alternative with graphing)",
    nmContext: "Fault Management: mtr --report --json is used in automated fault diagnosis workflows. When an NMS detects a performance degradation alarm, automated scripts run mtr to identify the offending hop, extract the data in JSON, and attach it to the incident ticket — reducing MTTR (Mean Time To Repair)."
  },
  {
    id: "curl",
    name: "curl / wget",
    category: "Bandwidth & Performance",
    oneLiner: "Tests HTTP/HTTPS connectivity, API endpoints, and download speeds — essential for verifying NMS REST API interfaces.",
    protocol: "HTTP/HTTPS/FTP (Layer 7 — Application)",
    osiLayer: "Layer 7 — Application",
    syntax: "curl [OPTIONS] <URL>  |  wget [OPTIONS] <URL>",
    options: [
      { flag: "-v", description: "Verbose mode — shows full request/response headers including TLS handshake.", example: "curl -v https://api.example.com/alarms" },
      { flag: "-s", description: "Silent mode — no progress bar or error messages (useful in scripts).", example: "curl -s https://api.example.com/status" },
      { flag: "-o <file>", description: "Save output to a file instead of stdout.", example: "curl -o response.json https://api.example.com/data" },
      { flag: "-X <method>", description: "Specify HTTP method: GET, POST, PUT, PATCH, DELETE.", example: "curl -X POST https://api.example.com/config" },
      { flag: "-H '<header>'", description: "Add a custom HTTP header.", example: "curl -H 'Authorization: Bearer TOKEN' -H 'Accept: application/json' https://api.example.com" },
      { flag: "-d '<data>'", description: "Send data in the request body (for POST/PUT).", example: "curl -X POST -H 'Content-Type: application/json' -d '{\"name\":\"eth0\"}' https://api.example.com/interfaces" },
      { flag: "-w '%{http_code}'", description: "Print only the HTTP status code — useful for health check scripts.", example: "curl -s -o /dev/null -w '%{http_code}' https://api.example.com/health" },
      { flag: "-k", description: "Ignore SSL certificate errors (use only for testing, NOT production).", example: "curl -k https://self-signed.example.com" },
      { flag: "--connect-timeout <sec>", description: "Maximum time to establish the TCP connection.", example: "curl --connect-timeout 5 https://api.example.com" },
      { flag: "--max-time <sec>", description: "Maximum total time for the entire operation.", example: "curl --max-time 30 https://api.example.com/large-data" }
    ],
    sampleOutput: `# curl -s -o /dev/null -w "%{http_code} %{time_total}s\n" https://api.example.com/alarms
200 0.324s

# curl -v https://api.example.com/status 2>&1 | head -20
* Trying 203.0.113.10:443...
* Connected to api.example.com (203.0.113.10) port 443 (#0)
* TLSv1.3 (OUT), TLS handshake, Client hello (1)
* SSL certificate verify ok.
> GET /status HTTP/2
> Host: api.example.com
> Authorization: Bearer eyJhbGci...
< HTTP/2 200
< content-type: application/json
< x-ratelimit-remaining: 98

{"status":"healthy","uptime":432105,"alarms":{"critical":2,"major":5}}`,
    outputInterpretation: "200 0.324s: HTTP 200 OK response received in 324ms — healthy API. 4xx responses indicate client errors: 401=unauthorized, 403=forbidden, 404=not found, 429=rate limited. 5xx indicates server errors: 500=internal error, 503=service unavailable. time_total includes DNS lookup + TCP connect + TLS handshake + request + response. TLSv1.3 + verify ok: secure connection with valid certificate. x-ratelimit-remaining: 98 — API rate limiting is in effect; important for NMS polling design. Response JSON shows 2 critical + 5 major alarms — a RESTCONF/REST NBI response that an OSS would parse to create trouble tickets.",
    windowsEquivalent: "curl is built-in since Windows 10. Invoke-WebRequest -Uri https://... (PowerShell equivalent)",
    nmContext: "NMS NBI Testing: curl is the primary tool for testing RESTCONF, TMF OpenAPI, and custom REST northbound interfaces. Automated health checks use curl -s -w '%{http_code}' to verify API availability. In CI/CD pipelines for NMS software, curl tests verify that all REST endpoints respond with expected status codes."
  }
]
};
