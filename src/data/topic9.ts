import type { TopicData } from './types';

export const topic9Data: TopicData = {
  id: "u3t3",
  title: "RESTCONF and Web-based Management",
  moduleName: "Unit 3: Modern Management",
  context: {
    prerequisites: ["YANG Data Modeling Language"],
    dependentTopics: ["Introduction to Software-Defined Networking"],
    nextSteps: "Having mastered modern APIs, we will now look at the architectural shift these APIs enable: Software-Defined Networking (SDN)."
  },
  storytelling: {
    analogy: "The Translator for Web Developers",
    story: "NETCONF is powerful, but it speaks XML over SSH—a language loved by network engineers but hated by web developers. Imagine a brilliant web developer who wants to build a dashboard for your network. If you give them NETCONF, they have to learn a complex new protocol. Instead, you give them RESTCONF. RESTCONF acts as a translator. It takes standard Web technologies (HTTP, URLs, JSON) that every web developer already knows, and translates them into the YANG models the router understands. It bridges the gap between the IT network team and the software development team.",
    reflectiveQuestions: ["Why is it beneficial to manage a router using the same protocols (HTTP/JSON) used to manage web servers?", "What are the security implications of managing a core router via HTTP?"],
    technicalConnection: "RESTCONF (RFC 8040) provides a RESTful interface for accessing data defined in YANG, using the datastores defined in NETCONF. It uses HTTP verbs (GET, POST, PUT, PATCH, DELETE) to map to NETCONF operations."
  },
  mathModelling: {
    need: "To understand the scaling constraints of HTTP-based polling (RESTCONF) compared to asynchronous telemetry.",
    equation: "C = \\frac{N_{req}}{T_{response}}",
    technicalDetails: "The Concurrency limit ($C$) of a RESTCONF server dictates how many concurrent REST requests it can handle. It is the number of incoming requests ($N_{req}$) divided by the average HTTP response time ($T_{response}$). Because RESTCONF is built on HTTP (which runs over TCP), each request requires a TCP handshake, TLS negotiation, and HTTP header parsing. If $T_{response}$ is high (e.g., pulling a massive routing table), the concurrency $C$ drops sharply. This mathematical limitation proves why RESTCONF is great for configuration (low volume) but poor for high-frequency performance monitoring.",
    explanation: [
      { term: "C", meaning: "Maximum concurrency (requests per second the router can handle)." },
      { term: "N_{req}", meaning: "Number of incoming RESTCONF requests." },
      { term: "T_{response}", meaning: "Average time in seconds to process and respond to one HTTP request." }
    ],
    advantages: ["Highlights the overhead of HTTP/TCP compared to lightweight UDP.", "Explains why modern networks use RESTCONF for configuration but gRPC/Telemetry for monitoring."],
    limitations: ["Ignores HTTP/2 multiplexing, which significantly improves concurrency by reusing TCP connections."]
  },
  activities: {
    level1: "Teacher maps CRUD (Create, Read, Update, Delete) operations to HTTP verbs (POST, GET, PUT, DELETE).",
    level2: "Teacher + Students use Postman or `curl` to make a mock RESTCONF GET request to a public sandbox router.",
    level3: "Group Activity: Students are given a YANG data tree and must construct the correct RESTCONF URL path to access a specific leaf node.",
    level4: "Individual Task: Write a paragraph contrasting when to use NETCONF vs RESTCONF."
  },
  projects: {
    scope: "Build a Python web dashboard using RESTCONF.",
    objectives: ["Use the Python `requests` library", "Authenticate to a Cisco DevNet sandbox via RESTCONF", "Fetch the router's hostname and interface status in JSON", "Display it using basic HTML/CSS (or simple print statements)"],
    deliverables: ["The Python source code", "A screenshot of the extracted JSON data"]
  },
  questions: [
    { q: "What is the primary motivation for using RESTCONF instead of NETCONF?", a: "RESTCONF uses standard web technologies (HTTP and JSON/XML), making it much easier for software developers and modern web applications to integrate with network devices.", type: "Conceptual" },
    { q: "Which HTTP verb is used in RESTCONF to retrieve configuration data?", a: "The HTTP GET method is used to retrieve data.", type: "Conceptual" },
    { q: "If a router takes 0.5 seconds to process a RESTCONF request ($T_{response}$ = 0.5), what is the maximum concurrency $C$ if it receives 10 requests at once?", a: "C = 10 / 0.5 = 20 requests per second.", type: "Numerical" },
    { q: "Why is RESTCONF generally preferred for configuration rather than high-frequency performance monitoring?", a: "Because RESTCONF relies on HTTP and TCP, which introduce significant overhead (headers, handshakes). High-frequency polling would exhaust the router's resources; streaming telemetry is better for monitoring.", type: "Analytical" },
    { q: "How does RESTCONF relate to YANG?", a: "Like NETCONF, RESTCONF uses YANG as its underlying data modeling language (Information Model), but transports it using a RESTful HTTP interface (Communication Model).", type: "Conceptual" }
  ],
  virtualLab: {
    description: "Simulation comparing the Overhead of RESTCONF (HTTP/TCP) vs Streaming Telemetry (gRPC/UDP) for monitoring.",
    interpretation: "As you increase the polling frequency to monitor real-time traffic, the RESTCONF CPU load spikes rapidly due to constant HTTP connection setups and teardowns. Streaming telemetry establishes a single connection and pushes data, maintaining a low, flat CPU profile.",
    parameters: [
      { id: "monitorFreq", name: "Monitoring Frequency", min: 1, max: 1000, default: 10, step: 10, unit: " ms" }
    ]
  }
};
