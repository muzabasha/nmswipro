import type { TopicData } from './types';

export const topic9Data: TopicData = {
  id: "u2t4",
  title: "RESTCONF Protocol and Postman Operations",
  moduleName: "Unit 2: Model-Driven Management and Protocols",
  context: {
    prerequisites: ["Topic 2.3: NETCONF Protocol and Operations", "HTTP and REST Methods (GET, POST, PUT, PATCH, DELETE)"],
    dependentTopics: ["Topic 3.2: NMS Discovery and FM NBI Flow", "Topic 3.3: REST APIs and ONF TAPI Overview"],
    nextSteps: "Begin Unit 3: Alarm Lifecycle Management by investigating how events and faults are triggered over REST interfaces."
  },
  storytelling: {
    analogy: "The Restaurant Web Order vs. Booking a Catering Service",
    story: "If you want a massive catering service for a wedding, you sign a complex contract, set up schedules, and coordinate extensively (NETCONF over SSH). But if you just want to order a single burger, you open an app, tap a button, and submit an HTTP POST request (RESTCONF over HTTPS). It is lightweight, fast, and uses standard web technologies that web browsers and toolkits (like Postman) already understand. RESTCONF is the web-developer-friendly brother of NETCONF: it maps YANG data structures directly to HTTP methods like GET, POST, PUT, and DELETE.",
    reflectiveQuestions: ["Why do web developers prefer REST APIs over SSH connections?", "How does HTTP PUT differ from HTTP PATCH when editing a configuration?"],
    technicalConnection: "RESTCONF (RFC 8040) is an HTTP-based protocol that provides a RESTful interface to YANG-defined datastores. It supports XML and JSON data serialization. It maps YANG data tree operations to standard HTTP verbs: GET maps to retrieve, POST to create, PUT to replace, PATCH to merge, and DELETE to remove. Unlike NETCONF, RESTCONF is stateless and does not support the candidate datastore or explicit locks, making it ideal for quick, lightweight web-based operations."
  },
  mathModelling: {
    need: "To model RESTCONF request-response latency over HTTPS, accounting for TCP/TLS handshakes and payload processing overhead.",
    equation: "T_{latency} = (1 + N_{hand}) \\times RTT + \\frac{S_{payload}}{B} + T_{device}",
    technicalDetails: "Because RESTCONF is stateless and runs over HTTPS, every new session requires TCP and TLS handshakes. The number of handshake round-trips \\(N_{hand}\\) is typically 2 (1 for TCP, 1 for TLS 1.3). The overall latency \\(T_{latency}\\) is the sum of network round-trips, the payload serialization transmission time \\(S_{payload} / B\\) (where \\(S_{payload}\\) is the payload size in bits and \\(B\\) is link bandwidth in bps), and the device processing delay \\(T_{device}\\) to parse JSON/XML. Under high RTT, stateless RESTCONF calls can compile higher cumulative delays than persistent NETCONF SSH sessions.",
    explanation: [
      { term: "T_latency", meaning: "Total request-response latency of the RESTCONF operation (seconds)." },
      { term: "N_hand", meaning: "Number of network round-trips required for connection handshaking (typically 1 to 3)." },
      { term: "RTT", meaning: "Network Round-Trip Time between the manager and device (seconds)." },
      { term: "S_payload", meaning: "Total size of the HTTP header and body payload (bits)." },
      { term: "B", meaning: "Link bandwidth (bits per second)." },
      { term: "T_device", meaning: "Time taken by the device web server to parse and process the request (seconds)." }
    ],
    advantages: ["Helps compare performance between RESTCONF (HTTPS stateless) and NETCONF (SSH persistent) for bulk configurations.", "Aids in network design for high-latency paths (e.g., satellite links)."],
    limitations: ["Does not account for HTTP connection pooling or keep-alive optimizations which reduce handshake frequency."],
    simulation: {
      description: "Vary the handshake count (representing new vs pooled sessions) and network RTT to observe the HTTP latency model.",
      parameters: [
        { id: "handshakes", name: "Handshake RTT Cycles (N)", min: 0, max: 3, default: 2, step: 1, unit: " cycles" },
        { id: "rttSecs", name: "Network RTT", min: 0.010, max: 0.300, default: 0.060, step: 0.010, unit: " s" },
        { id: "payloadKb", name: "Payload Size (KB)", min: 1, max: 100, default: 5, step: 1, unit: " KB" }
      ]
    }
  },
  activities: {
    level1: "Teacher displays a slide mapping a YANG path to a RESTCONF URI: /restconf/data/ietf-interfaces:interfaces/interface=eth0.",
    level2: "Students match HTTP verbs (GET, POST, PUT, DELETE) to their corresponding database CRUD actions.",
    level3: "Postman Exercise: Students write a simulated HTTP PATCH request payload in JSON to change an interface description.",
    level4: "Write a comparison (150 words) on when to choose NETCONF (candidate datastore, locks) over RESTCONF (lightweight, stateless, web integration) for an enterprise."
  },
  projects: {
    scope: "Design a Postman collection for device management.",
    objectives: ["Define the HTTP URI paths for fetching and updating system parameters using the IETF YANG model", "Specify the HTTP headers (Content-Type, Accept) for JSON transactions"],
    deliverables: ["JSON Postman collection draft", "1-page API documentation describing error status codes (e.g., 200 OK, 201 Created, 404 Not Found)"]
  },
  questions: [
    { q: "Which HTTP verbs map to Create, Read, Update, and Delete (CRUD) operations in RESTCONF?", a: "Create maps to POST, Read to GET, Update to PUT (replace) or PATCH (merge), and Delete to DELETE.", type: "Conceptual" },
    { q: "Calculate the RESTCONF latency T_latency over a link with RTT = 50ms, a payload of 40,000 bits, bandwidth B = 2 Mbps (2,000,000 bps), T_device = 10ms, and a fresh TLS session (N_hand = 2).", a: "T_latency = (1 + 2) * 0.050 + (40,000 / 2,000,000) + 0.010 = 3 * 0.050 + 0.020 + 0.010 = 0.150 + 0.020 + 0.010 = 0.180 seconds or 180 milliseconds.", type: "Numerical" },
    { q: "What is the base URI path prefix for all RESTCONF data resources?", a: "/restconf/data/ is the standard entry point path.", type: "Conceptual" },
    { q: "Why does RESTCONF not support transaction locks (<lock> and <unlock>) or the candidate datastore like NETCONF?", a: "Because RESTCONF is built on HTTP, which is inherently stateless. Transaction coordination is left to the client using resource versioning (e.g., HTTP ETags) rather than protocol-level session locking.", type: "Analytical" },
    { q: "How are YANG lists represented in RESTCONF URI paths?", a: "A YANG list element is represented as a URI path segment, with its key value enclosed in an equals sign, like: .../interfaces/interface=GigabitEthernet1.", type: "Conceptual" }
  ],
  virtualLab: {
    description: "Postman RESTCONF Client Simulator. Trigger GET, POST, PUT, and DELETE HTTP requests and monitor the response headers, JSON bodies, and status codes returned by the virtual device.",
    interpretation: "A POST request creates a list element and returns '201 Created'. A subsequent GET returns '200 OK' with the JSON representation. PUT replaces the resource entirely, while PATCH merges specific leaves, demonstrating RESTCONF resource-oriented operations.",
    parameters: [
      { id: "httpMethod", name: "HTTP Method (1=GET, 2=POST, 3=PUT, 4=DELETE)", min: 1, max: 4, default: 1, step: 1, unit: "" }
    ]
  }
};
