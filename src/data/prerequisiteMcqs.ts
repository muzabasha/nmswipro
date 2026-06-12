import type { MCQItem } from './types';

export const prerequisiteMcqs: Record<string, MCQItem[]> = {
  "1": [
    {
      id: "prereq-u1-q1",
      question: "Which OSI layer is responsible for end-to-end reliable data delivery and flow control?",
      options: ["Network Layer (Layer 3)", "Transport Layer (Layer 4)", "Data Link Layer (Layer 2)", "Session Layer (Layer 5)"],
      correctAnswer: 1,
      explanation: "The Transport Layer (Layer 4) provides end-to-end communication services including reliability (TCP), flow control, and segmentation. TCP ensures ordered, error-free delivery while UDP provides faster, connectionless communication.",
      wrongExplanations: ["Layer 3 handles routing and logical addressing (IP), not reliable delivery.", "Layer 2 handles hop-to-hop framing and MAC addressing, not end-to-end reliability.", "Layer 5 manages sessions between applications, not data delivery guarantees."],
    },
    {
      id: "prereq-u1-q2",
      question: "What is the primary difference between a Layer 2 switch and a Layer 3 router?",
      options: [
        "Switches are faster than routers",
        "Switches forward frames using MAC addresses; routers forward packets using IP addresses",
        "Switches connect different networks; routers connect devices within the same network",
        "Switches use TCP; routers use UDP"
      ],
      correctAnswer: 1,
      explanation: "Layer 2 switches use MAC addresses to forward frames within a single broadcast domain/LAN. Layer 3 routers use IP addresses to forward packets across different networks/subnets, making routing decisions based on routing tables.",
      wrongExplanations: ["Speed is not the defining architectural difference.", "It is the opposite — routers connect different networks; switches connect devices within a network.", "Neither uses TCP/UDP for forwarding decisions; these are transport-layer protocols."],
    },
    {
      id: "prereq-u1-q3",
      question: "Which IPv4 address class defaults to a /8 subnet mask?",
      options: ["Class B (128.0.0.0 – 191.255.255.255)", "Class C (192.0.0.0 – 223.255.255.255)", "Class A (1.0.0.0 – 126.255.255.255)", "Class D (224.0.0.0 – 239.255.255.255)"],
      correctAnswer: 2,
      explanation: "Class A addresses (1.0.0.0 to 126.255.255.255) use a default /8 subnet mask (255.0.0.0), meaning the first 8 bits identify the network and the remaining 24 bits identify hosts, allowing ~16 million hosts per network.",
      wrongExplanations: ["Class B uses /16 (255.255.0.0).", "Class C uses /24 (255.255.255.0).", "Class D is reserved for multicast and does not use traditional subnet masks."],
    },
    {
      id: "prereq-u1-q4",
      question: "In the TCP/IP model, which protocol is used for reliable, connection-oriented communication?",
      options: ["UDP (User Datagram Protocol)", "ICMP (Internet Control Message Protocol)", "TCP (Transmission Control Protocol)", "ARP (Address Resolution Protocol)"],
      correctAnswer: 2,
      explanation: "TCP provides reliable, connection-oriented communication with features like three-way handshake, sequence numbers, acknowledgments, retransmission, and flow control. UDP is connectionless and unreliable but faster.",
      wrongExplanations: ["UDP is connectionless and does not guarantee delivery — it trades reliability for speed.", "ICMP is used for diagnostic and error reporting (ping, traceroute), not data transport.", "ARP resolves IP addresses to MAC addresses and is not a transport protocol."],
    },
    {
      id: "prereq-u1-q5",
      question: "What is the role of a firewall in a network?",
      options: [
        "Assigns IP addresses to devices automatically",
        "Filters incoming and outgoing network traffic based on security rules",
        "Routes packets between different subnets",
        "Provides wireless connectivity to end users"
      ],
      correctAnswer: 1,
      explanation: "A firewall acts as a security barrier between trusted and untrusted networks, inspecting traffic and allowing or blocking packets based on defined rules (port numbers, protocols, IP addresses, application signatures).",
      wrongExplanations: ["DHCP servers assign IP addresses automatically.", "Routers handle inter-subnet packet forwarding.", "Wireless access points provide Wi-Fi connectivity."],
    },
    {
      id: "prereq-u1-q6",
      question: "What is the default port number used by HTTPS?",
      options: ["80", "8080", "443", "22"],
      correctAnswer: 2,
      explanation: "HTTPS (HTTP Secure) uses port 443 by default. It wraps HTTP in TLS/SSL encryption, providing confidentiality and integrity for web communications. HTTP uses port 80 (unencrypted).",
      wrongExplanations: ["Port 80 is used by HTTP (unencrypted).", "Port 8080 is a common alternative/proxy HTTP port.", "Port 22 is used by SSH for secure shell access."],
    },
    {
      id: "prereq-u1-q7",
      question: "What is a Network Management System (NMS)?",
      options: [
        "A hardware device that connects two networks",
        "Software and hardware platform used to monitor, manage, and control network devices and services",
        "A protocol for configuring routers",
        "A type of firewall for enterprise networks"
      ],
      correctAnswer: 1,
      explanation: "An NMS (Network Management System) is a platform that collects data from network devices (via SNMP, APIs, etc.), monitors network health, detects faults, configures devices, and provides dashboards and alerts to network operators.",
      wrongExplanations: ["That describes a router or bridge.", "SNMP and NETCONF are management protocols, not the NMS itself.", "A firewall is a security device, not a management platform."],
    },
    {
      id: "prereq-u1-q8",
      question: "In a client-server architecture, which statement is true?",
      options: [
        "The server initiates connections to clients",
        "Both client and server can initiate communication",
        "The client initiates requests and the server responds",
        "Clients communicate directly with each other without a server"
      ],
      correctAnswer: 2,
      explanation: "In client-server architecture, the client initiates requests (e.g., HTTP GET) and the server listens, processes, and responds. The server is always-on and waiting, while clients connect on demand. This is the foundation of web, email, and most network services.",
      wrongExplanations: ["The server listens and responds; it does not initiate connections to clients.", "Only the client initiates; the server responds — this asymmetry is fundamental.", "Client-to-client communication without a server describes peer-to-peer (P2P), not client-server."],
    },
    {
      id: "prereq-u1-q9",
      question: "What does CIDR notation /24 represent in IP addressing?",
      options: [
        "A subnet with 24 usable host addresses",
        "A subnet mask of 255.255.255.0 — 24 network bits and 8 host bits",
        "An IP address with 24 octets",
        "A network containing 24 subnets"
      ],
      correctAnswer: 1,
      explanation: "CIDR /24 means 24 bits are used for the network portion, giving a subnet mask of 255.255.255.0. This leaves 8 bits for host addresses, providing 254 usable hosts per subnet (2^8 - 2, excluding network and broadcast addresses).",
      wrongExplanations: ["/24 refers to network bits, not usable host count (which is 254).", "IPv4 addresses have 4 octets, not 24.", "/24 defines the mask, not the number of subnets."],
    },
    {
      id: "prereq-u1-q10",
      question: "Which device is used to extend a wireless network and provide Wi-Fi connectivity to end users?",
      options: ["Router", "Switch", "Access Point (AP)", "Modem"],
      correctAnswer: 2,
      explanation: "A Wireless Access Point (AP) connects wireless devices (laptops, phones) to the wired network using IEEE 802.11 (Wi-Fi) standards. It bridges wireless and wired segments, unlike a router which routes between networks.",
      wrongExplanations: ["A router forwards packets between different networks/subnets.", "A switch forwards frames within a wired LAN using MAC addresses.", "A modem converts between analog and digital signals for ISP connectivity."],
    },
  ],

  "2": [
    {
      id: "prereq-u2-q1",
      question: "In SNMP, which component runs on the managed device and responds to manager requests?",
      options: ["NMS (Network Management Station)", "Agent", "MIB (Management Information Base)", "SMI (Structure of Management Information)"],
      correctAnswer: 1,
      explanation: "The SNMP Agent runs on each managed device. It maintains local management data (MIB variables), responds to GET/SET requests from the NMS, and can send unsolicited TRAP/INFORM notifications when events occur.",
      wrongExplanations: ["The NMS is the management station that sends requests — it does not run on managed devices.", "The MIB is a database of management objects, not a running process.", "SMI defines naming rules and data types for MIB objects, not a runtime component."],
    },
    {
      id: "prereq-u2-q2",
      question: "What is the key difference between SNMP TRAP and INFORM messages?",
      options: [
        "TRAP is encrypted; INFORM is unencrypted",
        "TRAP is fire-and-forget; INFORM requires acknowledgment from the manager",
        "TRAP is sent by the manager; INFORM is sent by the agent",
        "TRAP supports more severity levels than INFORM"
      ],
      correctAnswer: 1,
      explanation: "TRAP is a one-way unsolicited notification — the agent sends it and does not verify delivery. INFORM is similar but requires the NMS to send back a RESPONSE acknowledgment, providing reliable delivery. INFORM is used when guaranteed notification is critical.",
      wrongExplanations: ["Encryption is handled by SNMPv3, not by TRAP vs INFORM.", "Both are sent by the agent to the manager.", "Both use the same severity/event model; the difference is delivery reliability."],
    },
    {
      id: "prereq-u2-q3",
      question: "What does the SNMP GETNEXT operation do?",
      options: [
        "Retrieves the exact OID value requested",
        "Returns the next OID-value pair in lexicographic order after the given OID",
        "Bulk-retrieves all OIDs in a single request",
        "Sets a MIB variable to the next valid value"
      ],
      correctAnswer: 1,
      explanation: "GETNEXT takes a starting OID and returns the next object in the MIB's lexicographic tree. It is used to walk/iterate through a MIB subtree sequentially, discovering all objects without knowing their exact OIDs in advance.",
      wrongExplanations: ["GET retrieves the exact OID; GETNEXT moves to the next one.", "GETBULK retrieves multiple values in one request (SNMPv2+).", "SET writes a value; there is no 'next valid value' concept."],
    },
    {
      id: "prereq-u2-q4",
      question: "Why did SNMP's limitations motivate the development of NETCONF/YANG?",
      options: [
        "SNMP could not monitor network traffic",
        "SNMP had no support for encryption",
        "SNMP lacked transactional configuration, rollback, and full configuration capability",
        "SNMP was too slow for real-time monitoring"
      ],
      correctAnswer: 2,
      explanation: "SNMP was designed primarily for monitoring (read-heavy) and had significant gaps for configuration management: no transactional commits (apply-all-or-nothing), no rollback on failure, inability to retrieve/send full device configurations, and limited data modeling. NETCONF/YANG addressed all these gaps.",
      wrongExplanations: ["SNMP could monitor; its gap was configuration management.", "SNMPv3 added encryption (USM).", "SNMP speed was adequate for monitoring; the gap was configuration semantics."],
    },
    {
      id: "prereq-u2-q5",
      question: "In XML, what is the purpose of a namespace?",
      options: [
        "To define the font and styling of elements",
        "To avoid element name conflicts when combining documents from different sources",
        "To compress XML data for faster transmission",
        "To validate the structure of an XML document"
      ],
      correctAnswer: 1,
      explanation: "XML namespaces prevent name collisions when merging XML documents from different vocabularies. By prefixing elements with a unique URI (e.g., <netconf:config>), the same element name can have different meanings in different contexts without conflict.",
      wrongExplanations: ["Styling is handled by CSS/XSLT, not namespaces.", "Namespaces have no role in data compression.", "Schema (XSD) validates structure; namespaces identify vocabulary origins."],
    },
    {
      id: "prereq-u2-q6",
      question: "What is the purpose of a YANG data model?",
      options: [
        "To define the physical layout of a network",
        "To describe the structure, constraints, and semantics of configuration and state data for network devices",
        "To encrypt data transmitted over REST APIs",
        "To monitor network traffic in real time"
      ],
      correctAnswer: 1,
      explanation: "YANG (RFC 7950) is a data modeling language that defines the schema of configuration and state data exposed by a network device. It specifies data types, container/leaf hierarchies, constraints (must/when), RPCs, and notifications — enabling standardized, machine-readable device modeling.",
      wrongExplanations: ["Physical topology is defined by diagrams and protocols like LLDP.", "YANG is a schema/modeling language, not an encryption mechanism.", "YANG defines data structure; monitoring is done via SNMP/telemetry."],
    },
    {
      id: "prereq-u2-q7",
      question: "In a RESTful API, which HTTP method is idempotent and used to update an existing resource?",
      options: ["POST", "GET", "PUT", "PATCH"],
      correctAnswer: 2,
      explanation: "PUT is idempotent — sending the same PUT request multiple times produces the same result (the resource is set to the same state). It replaces the entire resource. POST is not idempotent (creates new resources or triggers processing). PATCH is partially idempotent depending on implementation.",
      wrongExplanations: ["POST creates new resources and is not idempotent.", "GET is idempotent but is for retrieval, not updating.", "PATCH may or may not be idempotent depending on implementation; PUT is guaranteed idempotent."],
    },
    {
      id: "prereq-u2-q8",
      question: "What does the MIB OID '1.3.6.1.2.1.1.1' represent in standard MIB-II?",
      options: [
        "sysName — the device hostname",
        "sysDescr — a textual description of the device",
        "sysUpTime — time since last reboot",
        "sysLocation — the physical location of the device"
      ],
      correctAnswer: 1,
      explanation: "OID 1.3.6.1.2.1.1.1 (iso.org.dod.internet.mgmt.mib-2.system.sysDescr) is the sysDescr object in MIB-II's system group. It contains a textual description of the device including hardware, OS, and software versions.",
      wrongExplanations: ["sysName is at OID 1.3.6.1.2.1.1.5.", "sysUpTime is at OID 1.3.6.1.2.1.1.3.", "sysLocation is at OID 1.3.6.1.2.1.1.6."],
    },
    {
      id: "prereq-u2-q9",
      question: "What is 'configuration management' in the context of network operations?",
      options: [
        "Monitoring network traffic for security threats",
        "Tracking and controlling changes to device configurations with versioning, commit, and rollback",
        "Assigning IP addresses to devices automatically",
        "Managing user login credentials"
      ],
      correctAnswer: 1,
      explanation: "Configuration management ensures controlled, auditable changes to network device configurations. It includes retrieving current config, making changes, transactional commit (apply all-or-nothing), rollback on failure, version history, and consistency verification across devices.",
      wrongExplanations: ["Traffic monitoring is fault/performance management, not configuration management.", "IP assignment is DHCP's role.", "Credential management is AAA (Authentication, Authorization, Accounting)."],
    },
    {
      id: "prereq-u2-q10",
      question: "Which of the following best describes a structured data format like JSON?",
      options: [
        "Unformatted plain text with no hierarchy",
        "A text-based format using key-value pairs and nested objects to represent data",
        "A binary protocol for real-time streaming",
        "A markup language for defining web page layout"
      ],
      correctAnswer: 1,
      explanation: "JSON (JavaScript Object Notation) is a lightweight, human-readable structured data format using key-value pairs, arrays, and nested objects. It is widely used in REST APIs for configuration data, state data, and communication between network management systems and devices.",
      wrongExplanations: ["JSON is structured, not plain text.", "JSON is text-based, not binary; streaming protocols like gRPC use different formats.", "HTML is a markup language for web pages; JSON is a data interchange format."],
    },
  ],

  "3": [
    {
      id: "prereq-u3-q1",
      question: "Which FCAPS category deals with detecting, isolating, and resolving network faults?",
      options: ["Configuration Management", "Accounting Management", "Fault Management", "Performance Management"],
      correctAnswer: 2,
      explanation: "Fault Management is responsible for detecting, logging, notifying, and resolving network faults/alarm conditions. It includes alarm correlation, root cause analysis, trouble ticketing, and escalation procedures to restore network services.",
      wrongExplanations: ["Configuration Management tracks device settings and changes.", "Accounting Management tracks resource usage for billing/cost allocation.", "Performance Management monitors throughput, latency, and utilization metrics."],
    },
    {
      id: "prereq-u3-q2",
      question: "What is the difference between a SNMP TRAP and a network alarm?",
      options: [
        "They are the same thing",
        "A TRAP is a PDU carrying event data; an alarm is the higher-level fault condition it represents",
        "A TRAP is sent by the manager; an alarm is sent by the agent",
        "An alarm is always critical; a TRAP is always informational"
      ],
      correctAnswer: 1,
      explanation: "A TRAP (or INFORM) is the SNMP protocol message (PDU) sent by an agent to report an event. An alarm is the logical fault condition (e.g., link down, high CPU) that the TRAP represents in the NMS. Multiple TRAPs may correlate to a single root-cause alarm.",
      wrongExplanations: ["They are related but distinct — one is a protocol message, the other is a fault condition.", "Both TRAPs and alarms originate from managed devices/agents.", "TRAPs can carry any severity level; alarms also range from informational to critical."],
    },
    {
      id: "prereq-u3-q3",
      question: "In network monitoring, what is a polling interval?",
      options: [
        "The time between consecutive alarm notifications",
        "The frequency at which the NMS requests status data from managed devices",
        "The maximum number of devices an NMS can monitor simultaneously",
        "The delay between alarm detection and operator notification"
      ],
      correctAnswer: 1,
      explanation: "The polling interval is how frequently the NMS queries managed devices for status/performance data (via SNMP GET). Shorter intervals give more real-time data but increase network overhead and device CPU load. Typical intervals range from 1–5 minutes.",
      wrongExplanations: ["That describes alarm notification frequency or escalation delay.", "That describes NMS scalability/capacity.", "That is alarm propagation delay, not polling frequency."],
    },
    {
      id: "prereq-u3-q4",
      question: "What protocol does an NMS commonly use to discover neighboring devices and build a network topology map?",
      options: ["FTP", "CDP/LLDP combined with SNMP", "SMTP", "DHCP"],
      correctAnswer: 1,
      explanation: "CDP (Cisco Discovery Protocol) and LLDP (Link Layer Discovery Protocol) are layer-2 protocols that advertise device identity, capabilities, and neighbor information. Combined with SNMP sysDescr and routing table queries, an NMS can auto-discover topology.",
      wrongExplanations: ["FTP is for file transfer, not topology discovery.", "SMTP is for email, not network discovery.", "DHCP assigns IP addresses, not topology information."],
    },
    {
      id: "prereq-u3-q5",
      question: "What is the difference between an EMS and an NMS in network management architecture?",
      options: [
        "They are the same system with different names",
        "EMS manages a specific vendor's devices; NMS provides cross-vendor, network-wide management",
        "EMS handles fault management; NMS handles configuration management",
        "EMS runs on-premises; NMS is always cloud-based"
      ],
      correctAnswer: 1,
      explanation: "An EMS (Element Management System) manages devices from a specific vendor or technology domain. An NMS (Network Management System) sits above EMS systems, providing unified, cross-vendor, network-wide visibility and management. OSS sits above NMS for business/service operations.",
      wrongExplanations: ["They serve different layers in the management hierarchy.", "Both handle multiple FCAPS functions.", "Both can be on-premises or cloud-hosted."],
    },
    {
      id: "prereq-u3-q6",
      question: "What is the difference between synchronous and asynchronous communication in network management?",
      options: [
        "Synchronous uses UDP; asynchronous uses TCP",
        "Synchronous requires the client to wait for a response; asynchronous allows the client to continue while waiting for callbacks/notifications",
        "Synchronous is used only for polling; asynchronous is used only for configuration",
        "They are the same thing in different contexts"
      ],
      correctAnswer: 1,
      explanation: "In synchronous communication (e.g., REST GET), the client sends a request and blocks until it receives a response. In asynchronous communication (e.g., SNMP TRAP, webhooks), the client continues processing and receives responses/notifications later via callbacks or event streams.",
      wrongExplanations: ["Protocol choice is independent of sync/async patterns.", "Both patterns can be used for various management operations.", "They represent fundamentally different communication paradigms."],
    },
    {
      id: "prereq-u3-q7",
      question: "What is an incident ticket lifecycle in IT/network operations?",
      options: [
        "The process of physically replacing faulty hardware",
        "The workflow from alarm detection through classification, assignment, resolution, and closure",
        "The time it takes for a device to reboot after a failure",
        "The process of installing new network equipment"
      ],
      correctAnswer: 1,
      explanation: "The incident ticket lifecycle tracks a network issue from initial alarm/detection through classification (severity, type), assignment to an engineer, troubleshooting/diagnosis, resolution/fix, verification, and finally closure. This ensures accountability and audit trails.",
      wrongExplanations: ["Hardware replacement is part of resolution but not the full lifecycle.", "Device reboot time is MTTR/availability, not ticket lifecycle.", "Equipment installation is a change management process."],
    },
    {
      id: "prereq-u3-q8",
      question: "In a REST API, what does HTTP status code 200 OK indicate?",
      options: [
        "The request was malformed and could not be processed",
        "The server successfully processed the request and returned the requested data",
        "The requested resource was not found on the server",
        "The server encountered an internal error while processing the request"
      ],
      correctAnswer: 1,
      explanation: "HTTP 200 OK indicates successful processing. For GET requests, it means the resource was found and returned in the response body. For PUT/PATCH, it means the update succeeded. For DELETE, it confirms the resource was removed.",
      wrongExplanations: ["400 Bad Request indicates a malformed request.", "404 Not Found means the resource does not exist.", "500 Internal Server Error indicates a server-side failure."],
    },
    {
      id: "prereq-u3-q9",
      question: "What is alarm correlation in network fault management?",
      options: [
        "Deleting duplicate alarms from the system",
        "Analyzing multiple alarms to identify the root cause and reduce alarm storms",
        "Forwarding all alarms to the operator simultaneously",
        "Assigning severity levels to individual alarms"
      ],
      correctAnswer: 1,
      explanation: "Alarm correlation analyzes patterns across multiple alarms to identify the underlying root cause. For example, a single router failure might generate 50+ interface-down alarms — correlation identifies the router failure as root cause and suppresses the 50 derived alarms, reducing alarm floods.",
      wrongExplanations: ["Correlation groups and analyzes alarms; deletion is a separate suppression step.", "Forwarding everything without analysis defeats the purpose of correlation.", "Severity assignment happens at alarm generation, not during correlation."],
    },
    {
      id: "prereq-u3-q10",
      question: "What does the 'southbound interface' refer to in a network management architecture?",
      options: [
        "The interface between the NMS and higher-level OSS/BSS systems",
        "The interface between the NMS and managed network devices (agents, APIs)",
        "The interface between two NMS instances",
        "The user interface for network operators"
      ],
      correctAnswer: 1,
      explanation: "Southbound interfaces connect the NMS downward to managed devices. Examples include SNMP (to agents), NETCONF (to routers/switches), CLI/SSH, and REST APIs. Northbound interfaces connect upward to OSS/BSS for service management and business operations.",
      wrongExplanations: ["That describes the northbound interface.", "That describes an NMS-to-NMS peering or federation interface.", "That is the management UI/dashboard, not a southbound interface."],
    },
  ],

  "4": [
    {
      id: "prereq-u4-q1",
      question: "What is the primary purpose of NFV (Network Functions Virtualization)?",
      options: [
        "To replace physical network cables with wireless connections",
        "To virtualize network functions (firewalls, load balancers, routers) as software running on commodity hardware",
        "To increase the clock speed of network device processors",
        "To provide IPv6 address allocation"
      ],
      correctAnswer: 1,
      explanation: "NFV decouples network functions (like firewalls, IDS, load balancers, WAN optimizers) from dedicated hardware appliances, running them as Virtual Network Functions (VNFs) on commercial off-the-shelf (COTS) servers. This reduces costs, enables elastic scaling, and accelerates service deployment.",
      wrongExplanations: ["NFV is about virtualizing functions, not physical connectivity.", "NFV runs on commodity hardware; it does not modify device hardware specs.", "IPv6 allocation is handled by DHCPv6/SLAAC, unrelated to NFV."],
    },
    {
      id: "prereq-u4-q2",
      question: "In the ETSI MANO framework, what does NFVO stand for?",
      options: [
        "Network Function Virtualization Observer",
        "Network Function Virtualization Orchestrator",
        "Network Function Verification Operator",
        "Network Function Versioning Operator"
      ],
      correctAnswer: 1,
      explanation: "NFVO (Network Function Virtualization Orchestrator) is the top-level MANO component responsible for end-to-end service orchestration. It coordinates VNF onboarding, network service lifecycle, and resource allocation across VIM and VNFM.",
      wrongExplanations: ["NFVO is an Orchestrator, not an Observer.", "MANO focuses on lifecycle management, not version verification.", "Versioning is a sub-function, not the primary role of NFVO."],
    },
    {
      id: "prereq-u4-q3",
      question: "What is the difference between a virtual machine and a container?",
      options: [
        "They are the same technology with different names",
        "VMs virtualize hardware and run a full OS; containers share the host OS kernel and virtualize the OS layer",
        "Containers are always more secure than VMs",
        "VMs can only run Linux; containers can run any OS"
      ],
      correctAnswer: 1,
      explanation: "VMs use a hypervisor to virtualize hardware, each running its own full operating system (heavy, GBs). Containers share the host OS kernel (lightweight, MBs), isolating only user-space processes. Containers start faster and use fewer resources but share kernel attack surface.",
      wrongExplanations: ["VMs and containers are fundamentally different virtualization approaches.", "VMs provide stronger isolation; containers trade isolation for efficiency.", "VMs can run any OS (Windows, Linux, macOS); containers are OS-dependent on kernel compatibility."],
    },
    {
      id: "prereq-u4-q4",
      question: "What is the role of a VIM (Virtualized Infrastructure Manager) in NFV?",
      options: [
        "Manages VNF software lifecycle (install, update, scale)",
        "Manages and allocates compute, storage, and network resources for VNFs",
        "Provides the user interface for network operators",
        "Handles northbound API integration with OSS/BSS"
      ],
      correctAnswer: 1,
      explanation: "The VIM (e.g., OpenStack, VMware vCloud) manages the physical infrastructure resources (compute, storage, networking) and allocates them to VNFs. It provisions VMs/containers, manages resource pools, and ensures resource isolation between VNFs.",
      wrongExplanations: ["VNF lifecycle management is the VNFM's role.", "Operator interfaces are provided by the NMS/orchestrator.", "Northbound integration is handled by NFVO/orchestrator."],
    },
    {
      id: "prereq-u4-q5",
      question: "What is network telemetry and how does it differ from traditional SNMP polling?",
      options: [
        "Telemetry and SNMP polling are the same thing",
        "Telemetry pushes data streams proactively at high frequency; SNMP pulls data on a polling interval",
        "Telemetry only monitors interface counters; SNMP monitors everything",
        "Telemetry is used only in data centers; SNMP is used everywhere else"
      ],
      correctAnswer: 1,
      explanation: "Network telemetry (e.g., gNMI, streaming telemetry) uses a publish/subscribe model where devices push data continuously at sub-second intervals. SNMP uses a pull model with fixed polling intervals (typically minutes). Telemetry provides higher granularity, lower latency, and less overhead.",
      wrongExplanations: ["They are fundamentally different paradigms (push vs pull).", "Telemetry supports rich data models (YANG); SNMP is limited to MIB objects.", "Telemetry is deployed across all network environments, not just data centers."],
    },
    {
      id: "prereq-u4-q6",
      question: "What is the purpose of a 'data pipeline' in network observability?",
      options: [
        "To physically connect network devices with cables",
        "To collect, process, transform, and store telemetry/metric data for analysis and visualization",
        "To route packets between data centers",
        "To encrypt network traffic between endpoints"
      ],
      correctAnswer: 1,
      explanation: "A data pipeline ingests raw telemetry data (metrics, logs, traces) from network devices, applies processing (filtering, aggregation, enrichment), and stores it in time-series databases or data lakes. This enables dashboards, alerting, anomaly detection, and capacity planning.",
      wrongExplanations: ["Physical connectivity is cabling/infrastructure.", "Packet routing is a forwarding plane function, not observability.", "Encryption is handled by IPsec/TLS, not data pipelines."],
    },
    {
      id: "prereq-u4-q7",
      question: "In automation scripting (e.g., Python for network management), what does an API wrapper library like 'requests' do?",
      options: [
        "It replaces the need for a network connection",
        "It simplifies making HTTP requests and handling responses to interact with REST APIs",
        "It encrypts all network traffic automatically",
        "It generates network topology diagrams"
      ],
      correctAnswer: 1,
      explanation: "The Python 'requests' library provides a high-level interface for making HTTP requests (GET, POST, PUT, DELETE) to REST APIs. It handles connection management, authentication, response parsing, and error handling, making it easy to automate network device configuration via NETCONF/RESTCONF APIs.",
      wrongExplanations: ["APIs still require network connectivity.", "Encryption is handled by TLS/SSL layers, not the requests library.", "Topology diagram generation requires specialized tools."],
    },
    {
      id: "prereq-u4-q8",
      question: "What is a hypervisor?",
      options: [
        "A physical server in a data center",
        "Software that creates and manages virtual machines by abstracting physical hardware resources",
        "A network switch optimized for virtual environments",
        "A backup and disaster recovery system"
      ],
      correctAnswer: 1,
      explanation: "A hypervisor (e.g., VMware ESXi, KVM, Xen) sits between physical hardware and virtual machines, abstracting CPU, memory, storage, and network resources. Type 1 hypervisors run directly on hardware; Type 2 run on top of a host OS.",
      wrongExplanations: ["A hypervisor is software, not physical hardware.", "Virtual switches connect VMs but are not hypervisors.", "Backup systems are separate infrastructure components."],
    },
    {
      id: "prereq-u4-q9",
      question: "What is declarative configuration in network management?",
      options: [
        "Describing the exact step-by-step commands to configure a device",
        "Describing the desired end-state of the system, letting the management tool figure out how to achieve it",
        "Configuring devices manually through a CLI",
        "Using SNMP SET to write individual MIB variables"
      ],
      correctAnswer: 1,
      explanation: "Declarative configuration (used in NETCONF/YANG, Ansible, Terraform) specifies the desired state (e.g., 'interface ge-0/0/0 should have IP 10.0.0.1/24'). The management tool compares current state to desired state and computes the necessary changes automatically.",
      wrongExplanations: ["Step-by-step commands describe procedural/imperative configuration.", "Manual CLI is imperative and error-prone — declarative aims to eliminate this.", "SNMP SET modifies individual variables without understanding desired end-state."],
    },
    {
      id: "prereq-u4-q10",
      question: "What is the key principle of intent-based networking (IBN)?",
      options: [
        "Manually configuring every device in the network",
        "Translating high-level business intent into network configurations, verifying compliance, and self-correcting drift",
        "Using only SNMP for all network management tasks",
        "Replacing all routers with software-defined switches"
      ],
      correctAnswer: 1,
      explanation: "Intent-based networking allows operators to express high-level intent (e.g., 'all branches must have 99.9% uptime'). The system translates this into device configurations, continuously verifies that the network complies with the intent, and automatically remediates any drift or violations.",
      wrongExplanations: ["IBN aims to automate and abstract manual configuration.", "IBN uses multiple protocols and data sources, not just SNMP.", "IBN is a management paradigm, not a hardware replacement strategy."],
    },
  ],
};
