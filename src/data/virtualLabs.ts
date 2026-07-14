export interface LabEnvironmentItem {
  label: string;
  icon: string;
  desc: string;
}

export interface LabActivity {
  id: number;
  title: string;
  desc: string;
  hint: string;
}

export interface LabStem {
  field: string;
  detail: string;
}

export interface LabChallenge {
  title: string;
  desc: string;
  steps: string[];
}

export interface LabAiTutor {
  welcome: string;
  hints: Record<number, string>;
  challengeHint: string;
  completed: string;
}

export interface VirtualLabDefinition {
  id: number;
  title: string;
  theme: string;
  role: string;
  scenario: string;
  environment: LabEnvironmentItem[];
  activities: LabActivity[];
  stem: LabStem[];
  challenge: LabChallenge;
  outcomes: string[];
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
  aiTutor: LabAiTutor;
  roleColor: string;
}

export const virtualLabs: VirtualLabDefinition[] = [
  {
    id: 1,
    title: 'SNMP Network Monitoring Lab',
    theme: 'Enterprise Network Monitoring and Management',
    role: 'Network Operations Center (NOC) Engineer',
    roleColor: 'blue',
    scenario: 'A multinational enterprise operates hundreds of routers and switches across 12 countries. You are the NOC engineer responsible for monitoring device health, identifying failures, retrieving operational data, modifying configurations, and responding to SNMP traps — all from a central SNMP management station.',
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-cyan-500',
    accentColor: 'blue',
    environment: [
      { label: 'Enterprise Topology', icon: 'Network', desc: 'Interactive map of 24 routers, 8 switches, 4 firewalls, and 12 servers across 3 data centers' },
      { label: 'SNMP Manager', icon: 'Monitor', desc: 'Central management console with GET/SET/GETNEXT operations and MIB browser' },
      { label: 'MIB Browser', icon: 'TreePine', desc: 'Animated OID tree browser with real-time value retrieval' },
      { label: 'Alarm Dashboard', icon: 'Bell', desc: 'Live alarm feed with severity-based color coding and acknowledgment workflow' },
      { label: 'Packet Analyzer', icon: 'Activity', desc: 'Real-time SNMP packet capture showing get-request, get-response, trap PDUs' },
      { label: 'Health Monitor', icon: 'HeartPulse', desc: 'Per-device CPU, memory, interface status, and uptime dashboard' },
    ],
    activities: [
      { id: 1, title: 'Discover SNMP-enabled devices', desc: 'Walk the MIB-II system group to discover all managed devices on the network.', hint: 'Use snmpwalk on .1.3.6.1.2.1.1 to enumerate sysDescr, sysObjectID, sysUpTime for each device.' },
      { id: 2, title: 'Browse the MIB hierarchy', desc: 'Navigate the MIB tree from root to leaf OIDs and understand the naming hierarchy.', hint: 'Start at .1.3.6.1 (internet) and expand mgmt(2) → mib-2(1) → interfaces(2) to see ifTable.' },
      { id: 3, title: 'Perform SNMP GET operations', desc: 'Retrieve specific OID values from managed devices using SNMP GET requests.', hint: 'Use snmpget -v2c -c public 192.168.1.1 .1.3.6.1.2.1.1.3.0 to retrieve sysUpTime.' },
      { id: 4, title: 'Modify device parameters using SET', desc: 'Change writable MIB objects such as interface admin status or community strings.', hint: 'Use snmpset -v2c -c private 192.168.1.1 .1.3.6.1.2.1.2.2.1.7.1 i 2 to disable interface 1.' },
      { id: 5, title: 'Retrieve sequential OIDs using GETNEXT', desc: 'Walk through a MIB subtree using GETNEXT to discover all available objects.', hint: 'GETNEXT returns the next lexicographic OID — ideal for walking tables like ifTable without knowing all indices.' },
      { id: 6, title: 'Observe SNMP packet exchanges', desc: 'Capture and decode SNMP get-request, get-response, and trap PDUs in the packet analyzer.', hint: 'Watch the community string in plaintext in v2c — discuss why v3 adds authentication and encryption.' },
      { id: 7, title: 'Simulate interface failures', desc: 'Bring interfaces down and observe how SNMP trap messages are generated and displayed.', hint: 'Use snmpset to set ifAdminStatus to down(2), then watch the coldStart/linkDown trap arrive at the manager.' },
      { id: 8, title: 'Analyze SNMP TRAP messages', desc: 'Examine trap v1 and v2c PDU formats, enterprise OIDs, and variable bindings.', hint: 'Compare trap PDU fields: enterprise OID, agent-addr, generic-trap (0-6), specific-trap, and var-bind list.' },
      { id: 9, title: 'Compare polling vs event-driven monitoring', desc: 'Evaluate bandwidth, latency, and freshness trade-offs between polling intervals and trap reception.', hint: 'Poll at 30s intervals generates ~2.6M packets/day for 1000 devices. Traps reduce this but risk missing lost traps.' },
    ],
    stem: [
      { field: 'Science', detail: 'Protocol communication — understand how SNMP operates at the application layer over UDP, the request/response and unidirectional trap models' },
      { field: 'Technology', detail: 'SNMP implementation across v1, v2c, and v3 — community strings, USM security models, VACM access control' },
      { field: 'Engineering', detail: 'Enterprise monitoring architecture — manager/agent paradigm, MIB design, poll interval engineering' },
      { field: 'Mathematics', detail: 'OID tree mathematics — lexicographic ordering, SMI data types (INTEGER, OCTET STRING, OID, Counter32/64, Gauge, TimeTicks)' },
    ],
    challenge: {
      title: 'Restore Network Health After Multiple Failures',
      desc: 'Three core routers have gone down simultaneously. Your monitoring dashboard is flooded with traps. Use SNMP operations to identify the failed devices, determine root cause, restore configurations, and implement trap filtering to reduce alarm noise.',
      steps: [
        'Poll all 24 routers with GET to identify which have stopped responding',
        'Walk the interfaces MIB of a failed router to check ifAdminStatus vs ifOperStatus',
        'Use SNMP SET to re-enable disabled interfaces on the backup path',
        'Configure the MIB browser to filter flapping interface traps',
        'Verify full connectivity by walking the IP routing table OIDs',
        'Generate a post-incident report comparing polling vs trap data volume',
      ],
    },
    outcomes: [
      'Operate SNMP management stations to monitor real-world networks',
      'Navigate the MIB hierarchy and retrieve specific OID values',
      'Differentiate between SNMPv1, v2c, and v3 security models',
      'Troubleshoot network faults using polled and trap data',
      'Design efficient monitoring strategies balancing polling and event-driven approaches',
      'Analyze SNMP packet exchanges to diagnose protocol-level issues',
    ],
    aiTutor: {
      welcome: 'Welcome, NOC Engineer! I am your SNMP Lab Assistant. I will guide you through enterprise network monitoring using SNMP. Start with Activity 1 to discover devices, and I will provide hints along the way. Type "help" anytime.',
      hints: {
        1: 'Try using snmpwalk with the community string "public" on the management subnet 192.168.1.0/24. The MIB-II system group OID is .1.3.6.1.2.1.1.',
        2: 'Expand mgmt(2) → mib-2(1) → interfaces(2) → ifTable(2) → ifEntry(1) to see interface indices, types, and status.',
        3: 'For sysUpTime use: snmpget -v2c -c public 192.168.1.1 .1.3.6.1.2.1.1.3.0. The .0 at the end accesses the scalar instance.',
        4: 'Before SET, verify the OID is writable (access: read-write in MIB). Use -c private community for write access.',
        5: 'Try snmpwalk or snmpgetnext to traverse ifTable. Each row index corresponds to an interface index.',
        6: 'Filter by port 161 (SNMP) in the packet analyzer. Compare the PDU type field: 0=get, 1=getnext, 2=response, 4=trap.',
        7: 'Watch for linkDown traps (generic-trap=2). The trap PDU includes ifIndex and ifAdminStatus in var-binds.',
        8: 'v1 traps have generic-trap 0-6. v2c traps use SNMPv2-MIB::snmpTrapOID and are indistinguishable from other responses.',
        9: 'Calculate: if each poll is ~100 bytes, for 1000 devices polled every 30s, that is ~2.6M packets/day or ~260MB/day.',
      },
      challengeHint: 'For the final challenge, prioritize by impact. Routers R1-R3 serve the most users. Start by polling their immediate neighbors to map the failure domain. Use trap filtering once you have confirmed the root cause.',
      completed: 'Excellent work, Engineer! You have successfully restored network health using SNMP-based monitoring, troubleshooting, and configuration management.',
    },
  },
  {
    id: 2,
    title: 'YANG Modeling Design Studio',
    theme: 'Network Data Modeling',
    role: 'Network Automation Engineer',
    roleColor: 'emerald',
    scenario: 'A telecom company wants to standardize network configurations using YANG models before deploying an automated network management platform. You must design, validate, and map YANG modules to physical network elements across the infrastructure.',
    gradientFrom: 'from-emerald-600',
    gradientTo: 'to-teal-500',
    accentColor: 'emerald',
    environment: [
      { label: 'YANG Model Editor', icon: 'FileJson', desc: 'Interactive code editor with syntax highlighting, auto-complete, and real-time validation' },
      { label: 'Data Tree Designer', icon: 'GitBranch', desc: 'Drag-and-drop hierarchical tree view of containers, lists, leafs, and leaf-lists' },
      { label: 'Device Catalog', icon: 'Server', desc: 'Searchable catalog of 30+ network devices with their supported YANG models' },
      { label: 'Config Preview', icon: 'Eye', desc: 'Side-by-side preview of YANG model and its corresponding XML/JSON instance data' },
      { label: 'Schema Validator', icon: 'CheckCircle', desc: 'AI-powered validator that checks YANG syntax, constraints, and XPath expressions' },
      { label: 'Visualization Engine', icon: 'PanelTop', desc: 'Auto-generated UML-style diagrams of module dependencies and data hierarchies' },
    ],
    activities: [
      { id: 1, title: 'Explore existing YANG modules', desc: 'Load and examine RFC YANG modules such as ietf-interfaces and ietf-ip.', hint: 'Look for the module header: namespace, prefix, imports, and the container/list structure that forms the data tree root.' },
      { id: 2, title: 'Expand containers and leaf nodes', desc: 'Navigate into container nodes and inspect their child leaf/leaf-list definitions.', hint: 'ietf-interfaces has a top-level container "interfaces" containing a list "interface" keyed by "name".' },
      { id: 3, title: 'Build hierarchical data trees', desc: 'Design a YANG module from scratch for a campus network device inventory.', hint: 'Start with a container "campus-inventory", add a list "devices" keyed by "device-id", with leafs for model, location, role.' },
      { id: 4, title: 'Map YANG nodes to physical routers', desc: 'Match YANG model paths to real router configurations (OSPF, BGP, interfaces).', hint: 'Map ietf-routing container "routing" → routing-instance/list → routing-protocols to OSPF/BGP configs on the router.' },
      { id: 5, title: 'Design new configuration parameters', desc: 'Extend a base YANG module with vendor-specific augmentation for QoS scheduling.', hint: 'Use the "augment" statement to add QoS leafs under /interfaces/interface. Specify "when" conditions to target specific interface types.' },
      { id: 6, title: 'Validate schema correctness', desc: 'Run the schema validator against your module to catch type mismatches, missing mandatory nodes, and XPath errors.', hint: 'Common errors: missing import for referenced types, invalid XPath in "when" or "must" expressions, duplicate leaf names in a choice.' },
      { id: 7, title: 'Compare standard vs vendor-specific models', desc: 'Diff an RFC-standard module against a vendor extension to identify deviations.', hint: 'Vendor deviations use the "deviation" statement with "deviate not-supported" or "deviate replace" to modify standard definitions.' },
      { id: 8, title: 'Simulate configuration inheritance', desc: 'Model a hierarchical VPN service where base parameters are inherited by child services.', hint: 'Use "uses" and "augment" with "refine" to build reusable grouping hierarchies — the backbone of service YANG models.' },
    ],
    stem: [
      { field: 'Science', detail: 'Data representation — YANG models network configuration and state as structured hierarchical data trees using formal schema definitions' },
      { field: 'Technology', detail: 'Model-driven networking — YANG is the standard data modeling language for NETCONF, RESTCONF, and gNMI' },
      { field: 'Engineering', detail: 'Configuration abstraction — design reusable, vendor-agnostic configuration models that separate specification from implementation' },
      { field: 'Mathematics', detail: 'Hierarchical structures — tree semantics, cardinality constraints (mandatory, min-elements, max-elements), and type system (string, uint32, enumeration, leafref, identityref)' },
    ],
    challenge: {
      title: 'Design a Scalable YANG Model for a Smart Campus Network',
      desc: 'Design a complete YANG module for managing a smart campus network with 5 buildings, each with multiple floors, rooms, and IoT devices. The model must support role-based access, device grouping, and automated configuration templates.',
      steps: [
        'Define the top-level containers: campus, buildings, network-devices, iot-devices',
        'Create a campus list with keys for building-id and floor-id',
        'Design network-device list with leafs for management-ip, role (core/access/distribution), and software-version',
        'Add an IoT device container with device-type, telemetry-interval, and data-format leafs',
        'Augment ietf-interfaces to add campus-specific interface properties (building-connection, port-security)',
        'Validate the complete model and generate sample XML instance data',
      ],
    },
    outcomes: [
      'Read and interpret YANG modules using standard RFC models',
      'Design hierarchical YANG data models for network configuration',
      'Use YANG augment, deviate, and refine statements for extensibility',
      'Validate YANG schema correctness using automated tools',
      'Map YANG model paths to physical network device configurations',
      'Understand the role of YANG in model-driven network management (NETCONF/RESTCONF)',
    ],
    aiTutor: {
      welcome: 'Welcome, Automation Engineer! I am your YANG Design Studio Assistant. I will guide you through creating and validating YANG data models. Let us start by exploring existing modules to understand the syntax.',
      hints: {
        1: 'ietf-interfaces.yang is the most commonly referenced module. Pay attention to the "import" statements that pull in types from ietf-yang-types and ietf-inet-types.',
        2: 'A "leaf" holds a single value of a specific type. A "leaf-list" is an ordered array. A "list" is a set of entries keyed by one or more leafs.',
        3: 'Remember to declare a namespace (your model URL) and prefix. The "container" node has no value — it just organizes children.',
        4: 'ietf-routing uses "routing-instance" to separate VRFs. Each instance contains "routing-protocols" which maps to OSPF/BGP process configs.',
        5: 'The "augment" statement targets an absolute or relative path. Combine with "when ../type = "ethernet"" for conditional extensions.',
        6: 'Use pyang with --lint for validation. Check for: undefined types, circular imports, and pattern constraint violations.',
        7: 'Vendors like Cisco and Juniper publish deviation files alongside their YANG models. Compare openconfig vs vendor-native models.',
        8: 'Groupings are like templates — they are instantiated with "uses". Refine can override default values or add constraints in the using module.',
      },
      challengeHint: 'Start by identifying the root data tree: campus has buildings, each building has floors, each floor has rooms. Model network-devices and iot-devices at the appropriate levels — think about which are building-wide vs room-specific.',
      completed: 'Outstanding work! You have designed a complete, validated YANG model for a smart campus infrastructure. This is exactly the skill needed for model-driven network automation at scale.',
    },
  },
  {
    id: 3,
    title: 'NETCONF Configuration Automation Lab',
    theme: 'Model-Driven Network Configuration',
    role: 'Network Automation Administrator',
    roleColor: 'violet',
    scenario: 'A cloud data center requires centralized configuration management of 200+ routers using NETCONF instead of manual CLI. You must establish NETCONF sessions, push configurations, validate candidate changes, and handle rollbacks when errors occur.',
    gradientFrom: 'from-violet-600',
    gradientTo: 'to-purple-500',
    accentColor: 'violet',
    environment: [
      { label: 'NETCONF Client', icon: 'Terminal', desc: 'Interactive console for sending NETCONF RPCs (get-config, edit-config, commit, discard-changes)' },
      { label: 'XML Editor', icon: 'FileCode', desc: 'Syntax-highlighted XML composer with schema-aware auto-completion for YANG-derived payloads' },
      { label: 'Config Repository', icon: 'Database', desc: 'Versioned storage of all device configurations with diff and history views' },
      { label: 'Commit History', icon: 'Clock', desc: 'Timeline of all commits with per-change metadata, author, and rollback point markers' },
      { label: 'Rollback Simulator', icon: 'Undo2', desc: 'Dry-run rollback simulation showing what changes would be reverted before executing' },
      { label: 'RPC Analyzer', icon: 'Radio', desc: 'Real-time decode of NETCONF RPC messages showing operation types, target, error-info, and OK responses' },
    ],
    activities: [
      { id: 1, title: 'Establish NETCONF sessions', desc: 'Open NETCONF sessions to multiple devices using SSH (port 830) and verify the hello message exchange with capabilities.', hint: 'The NETCONF transport uses SSH subsystem "netconf". The hello message contains <hello> with <capabilities> listing supported YANG models.' },
      { id: 2, title: 'Retrieve configurations using get-config', desc: 'Use the get-config RPC to retrieve running, candidate, or startup configuration datastores from a device.', hint: 'Specify <source><running/> in the RPC. Filter by subtree using <filter> with a YANG-defined XML subtree to get only interface configs.' },
      { id: 3, title: 'Edit configurations using edit-config', desc: 'Push configuration changes using edit-config with operations: merge, replace, create, delete, remove.', hint: 'The <target> specifies the datastore (candidate/running). <config> contains the YANG-encoded XML. <default-operation> can be "merge" or "replace".' },
      { id: 4, title: 'Validate candidate configurations', desc: 'Run the validate RPC on the candidate datastore before committing to catch syntax and semantic errors.', hint: 'Use <validate><source><candidate/>. The device returns <ok> or <rpc-error> with error-tag, error-path, and error-message.' },
      { id: 5, title: 'Commit changes', desc: 'Commit the candidate configuration to the running datastore atomically using the commit RPC.', hint: 'The <commit> RPC makes candidate configuration the new running. In confirmed-commit mode, use <confirmed/> and <confirm-timeout> for automatic rollback.' },
      { id: 6, title: 'Perform rollback', desc: 'Use discard-changes to revert uncommitted changes to the candidate datastore, then simulate rolling back a bad commit.', hint: 'Use <discard-changes/> to revert candidate to running. For rollback of committed changes, use <rollback> with rollback-id from <commit>.' },
      { id: 7, title: 'Handle configuration conflicts', desc: 'Resolve conflicts when two administrators push overlapping changes to the same device.', hint: 'NETCONF uses pessimistic locking via <lock><target>. If lock fails, <rpc-error> with error-tag "lock-denied" or "in-use" is returned.' },
      { id: 8, title: 'Resolve RPC errors', desc: 'Parse rpc-error responses, identify error severity, error-tag, and error-app-tag to fix the issue.', hint: 'rpc-error structure: error-type (transport/rpc/protocol/application), error-tag (invalid-value/missing-attribute), error-severity (error/warning).' },
    ],
    stem: [
      { field: 'Science', detail: 'Secure communication — NETCONF operates over SSH with RFC 6242, providing encrypted sessions, authentication, and integrity' },
      { field: 'Technology', detail: 'XML-based configuration — all NETCONF RPC messages and configuration data are encoded in XML with YANG-defined schema validation' },
      { field: 'Engineering', detail: 'Configuration lifecycle — candidate/edit/validate/commit/discard workflow provides transactional configuration management' },
      { field: 'Mathematics', detail: 'Transaction consistency — confirmed-commit with timeout provides atomicity, rollback ensures consistency, locking ensures isolation' },
    ],
    challenge: {
      title: 'Configure an Enterprise Network Without Service Interruption',
      desc: 'You need to push OSPF and BGP configuration changes to 12 core routers in a live network. Any mistake could cause a BGP session reset or routing loop. Use confirmed-commit, validate, and a staged rollback plan to ensure zero downtime.',
      steps: [
        'Lock the candidate datastore on all 12 routers before making changes',
        'Push OSPF area configuration changes to the first 4 routers using edit-config with merge',
        'Run validate on each modified candidate config before commit',
        'Commit with confirmed-commit (600 second timeout) on the first 4 routers',
        'Verify OSPF adjacencies formed correctly before proceeding',
        'Apply BGP prefix-list changes to remaining routers with the same validate-then-confirm workflow',
        'If any router fails validation, use discard-changes and analyze the rpc-error',
        'Unlock all datastores and generate a configuration audit report',
      ],
    },
    outcomes: [
      'Establish authenticated NETCONF sessions over SSH to network devices',
      'Use get-config, edit-config, validate, commit, and discard-changes RPCs',
      'Implement confirmed-commit for safe configuration rollback',
      'Analyze and resolve rpc-error responses',
      'Manage configuration conflicts with datastore locking',
      'Automate multi-device configuration workflows using NETCONF',
    ],
    aiTutor: {
      welcome: 'Welcome, Automation Administrator! I am your NETCONF Lab Assistant. You will learn to configure network devices safely and at scale using the NETCONF protocol. Let us start with session establishment.',
      hints: {
        1: 'The NETCONF session opens with <hello> containing your capabilities. The device responds with its own <hello>. Compare capability URIs to find common YANG models.',
        2: 'get-config without a filter returns the entire configuration. Always use targeted subtree filters in production to reduce bandwidth and parse time.',
        3: 'operation="merge" updates existing nodes or creates them. operation="replace" replaces the entire subtree. operation="remove" deletes if present but does not error if absent.',
        4: 'validate is not supported on all devices (check capabilities). If not, use confirmed-commit as an alternative safety mechanism.',
        5: 'confirmed-commit with confirm-timeout 600 gives a 10-minute window. If no follow-up <commit> is received, the device automatically reverts to the previous running config.',
        6: 'Discard-changes only works with a candidate datastore. For devices with writable-running, use edit-config with operation="remove" to manually revert.',
        7: 'Lock timeouts are common in multi-admin scenarios. Use <partial-lock> to lock only specific subtrees instead of the entire datastore.',
        8: 'Error-path contains the XPath to the problematic node. Error-message is human-readable. Error-app-tag gives vendor-specific error classification.',
      },
      challengeHint: 'Stage your rollout in rings: core → distribution → access. Use confirmed-commit on each ring before moving to the next. If ring 1 succeeds but ring 2 fails, the network still has partial connectivity through ring 1\'s working config.',
      completed: 'Excellent work! You have safely configured a live enterprise network using NETCONF with zero downtime — exactly the skill required for modern network automation roles.',
    },
  },
  {
    id: 4,
    title: 'RESTCONF API Development Lab',
    theme: 'Network API Programming',
    role: 'Network API Developer',
    roleColor: 'orange',
    scenario: 'An enterprise wants to expose network services through REST APIs for cloud automation platforms. As the API developer, you must create, test, and document RESTCONF endpoints that allow cloud orchestrators to provision network resources programmatically.',
    gradientFrom: 'from-orange-600',
    gradientTo: 'to-amber-500',
    accentColor: 'orange',
    environment: [
      { label: 'REST Client', icon: 'Globe', desc: 'Full HTTP client with method selection (GET/POST/PUT/PATCH/DELETE), header editor, and response viewer' },
      { label: 'HTTP Request Builder', icon: 'Wrench', desc: 'GUI builder for constructing RESTCONF requests with autocomplete for YANG resource paths' },
      { label: 'JSON Editor', icon: 'Code', desc: 'Schema-aware JSON editor with validation against YANG data models' },
      { label: 'URI Explorer', icon: 'Search', desc: 'Tree-based browser of the RESTCONF API root showing all available YANG resources as discoverable URIs' },
      { label: 'API Console', icon: 'Monitor', desc: 'Real-time console showing request/response history, timing, and status codes' },
      { label: 'YANG Resource Browser', icon: 'BookOpen', desc: 'Visual mapping tool showing how YANG model paths translate to RESTCONF URI templates' },
    ],
    activities: [
      { id: 1, title: 'Create REST requests', desc: 'Construct a RESTCONF GET request to the API root and explore available resources.', hint: 'RESTCONF root is typically /restconf. Use GET /restconf/data?depth=1 to see top-level YANG data resources. Accept header: application/yang-data+json.' },
      { id: 2, title: 'Perform GET operations', desc: 'Retrieve specific YANG data resources using URL-encoded XPath expressions.', hint: 'GET /restconf/data/ietf-interfaces:interfaces returns all interfaces. Encode special chars: %2F for / in YANG module prefixes.' },
      { id: 3, title: 'Create resources using POST', desc: 'Create a new interface configuration by POSTing a JSON payload to the interfaces resource.', hint: 'POST /restconf/data/ietf-interfaces:interfaces with body {"interface":[{"name":"GigabitEthernet0/1","type":"ethernetCsmacd","enabled":true}]}' },
      { id: 4, title: 'Update configurations using PUT and PATCH', desc: 'Replace a full resource with PUT or merge partial updates with PATCH.', hint: 'PUT replaces the entire target resource — include all mandatory fields. PATCH merges — only send fields you want to change. PATCH with application/yang-patch+json supports array edits.' },
      { id: 5, title: 'Delete resources', desc: 'Remove a resource using DELETE and verify the resource no longer exists.', hint: 'DELETE /restconf/data/ietf-interfaces:interfaces/interface=GigabitEthernet0/1. A 204 No Content means success. Subsequent GET should return 404.' },
      { id: 6, title: 'Validate JSON payloads', desc: 'Validate your JSON payloads against the YANG schema before sending to catch type and constraint violations.', hint: 'RESTCONF returns 400 Bad Request with error-tag "invalid-value" or "missing-element" if the JSON does not conform to the YANG schema.' },
      { id: 7, title: 'Map URIs to YANG resources', desc: 'Translate YANG model paths to RESTCONF URI templates and understand query parameters.', hint: 'YANG container "interfaces" → /restconf/data/ietf-interfaces:interfaces. List entry: /restconf/data/ietf-interfaces:interfaces/interface={name}. Query params: ?fields, ?depth, ?content, ?with-defaults.' },
      { id: 8, title: 'Analyze HTTP responses', desc: 'Interpret HTTP status codes, error response bodies, and ETags for concurrency control.', hint: '200 OK (GET success), 201 Created (POST), 204 No Content (DELETE/PUT success), 400 Bad Request (schema error), 409 Conflict (lock or constraint violation), 412 Precondition Failed (ETag mismatch).' },
    ],
    stem: [
      { field: 'Science', detail: 'Web communication — RESTCONF uses HTTP/1.1 methods and semantics, leveraging the web\'s uniform interface for network management' },
      { field: 'Technology', detail: 'REST APIs — YANG-defined resources exposed as RESTful URIs with JSON/XML representations, following REST constraints (uniform interface, stateless, cacheable)' },
      { field: 'Engineering', detail: 'Network automation — RESTCONF enables programmatic network configuration from any HTTP-capable language — Python, Go, JavaScript, Ansible' },
      { field: 'Mathematics', detail: 'Resource relationships — YANG data trees are mapped to URI paths with URL encoding and query parameter algebra for filtering, projection, and pagination' },
    ],
    challenge: {
      title: 'Develop APIs to Automate Branch Office Provisioning',
      desc: 'A retail chain is opening 50 new branch offices. You must create a set of RESTCONF API calls that provision a standardized network configuration (VLAN, OSPF, DHCP relay, ACL) for each new branch automatically.',
      steps: [
        'Design a reusable JSON template for a branch router configuration (management VRF, LAN VLAN, WAN interface)',
        'POST the template as a new configuration resource for branch router B001',
        'Use PATCH to update the OSPF area ID on B001 from 0 to 10',
        'GET the full configuration to verify all settings are correct',
        'DELETE the old management ACL entry and POST an updated one with new IP ranges',
        'Write a curl-like sequence that provisions all 50 branches using PUT with the same template on each router',
      ],
    },
    outcomes: [
      'Construct RESTCONF URIs from YANG model paths',
      'Perform CRUD operations on network resources using HTTP methods',
      'Validate JSON payloads against YANG schema constraints',
      'Interpret HTTP status codes and error responses',
      'Use query parameters for filtering, projection, and depth control',
      'Design reusable RESTCONF API workflows for automated provisioning',
    ],
    aiTutor: {
      welcome: 'Welcome, API Developer! I am your RESTCONF Development Assistant. You will build and test RESTful APIs that expose network configuration and state. Let us start by exploring the API root.',
      hints: {
        1: 'Always set Accept: application/yang-data+json. RESTCONF also supports XML (application/yang-data+xml). The api-path is /restconf/data for config data and /restconf/operational for state data.',
        2: 'Use ?content=config to get only configuration, ?content=nonconfig for state, ?content=all for both. Use ?fields=name;type to project only specific leafs.',
        3: 'POST creates a new data resource. For list entries, the key leafs must be unique. Check the response Location header for the created resource URI.',
        4: 'PATCH with application/yang-patch+json supports array operations: "ietf-yang-patch:yang-patch" with "edit" operations (insert, merge, remove, replace, move).',
        5: 'DELETE on a container deletes the entire container and all children. To delete a specific list entry, provide all key leaf values in the URI.',
        6: 'Use query parameter ?with-defaults=report-all to see default values in GET responses. This helps understand what the device will actually use.',
        7: 'Leaf-list entries are addressed by value: /restconf/data/mod:cont/list={key}/leaf-list={value}. Lists with multiple keys: /list={key1},{key2}.',
        8: 'RESTCONF uses ETags for concurrency: GET returns ETag header, include If-Match: <etag> in PUT/PATCH to prevent lost updates.',
      },
      challengeHint: 'Parameterize your branch template — create a JSON skeleton with placeholders for branch-id, vlan-id, ospf-area, and peer-ip. Use PUT to replace the full config on each branch router rather than multiple PATCH calls.',
      completed: 'Outstanding! You have built a complete RESTCONF API workflow for automated branch provisioning. This is the foundation of intent-based networking and cloud-native network management.',
    },
  },
  {
    id: 5,
    title: 'Intelligent Fault Management Center',
    theme: 'AI-Assisted Network Fault Diagnosis',
    role: 'Network Reliability Engineer',
    roleColor: 'rose',
    scenario: 'A major fiber cut in a metropolitan area network has triggered 15,000+ alarms in 30 seconds. You are the reliability engineer responsible for identifying the root cause, correlating events, suppressing duplicate alarms, and restoring services while minimizing operational noise.',
    gradientFrom: 'from-rose-600',
    gradientTo: 'to-pink-500',
    accentColor: 'rose',
    environment: [
      { label: 'Alarm Dashboard', icon: 'Bell', desc: 'Live alarm feed with severity (critical/major/minor/warning), timestamps, source, and acknowledgment workflow' },
      { label: 'Network Topology Map', icon: 'Map', desc: 'Geographic topology view showing device status, link health, and alarm propagation paths with heat-map coloring' },
      { label: 'Fault Correlation Engine', icon: 'GitMerge', desc: 'AI-powered correlation engine that groups related alarms into incidents based on time, topology, and causality' },
      { label: 'Root Cause Workspace', icon: 'Search', desc: 'Interactive workspace to trace alarm chains, view probable root causes ranked by confidence score' },
      { label: 'Event Timeline', icon: 'Clock', desc: 'Chronological timeline of all events with zoom levels from seconds to hours' },
      { label: 'AI Assistant', icon: 'Bot', desc: 'AI troubleshooting assistant that suggests probable causes, impacted services, and recommended remediation steps' },
    ],
    activities: [
      { id: 1, title: 'Classify alarms by severity', desc: 'Review the alarm feed and categorize each alarm by severity, type, and source domain.', hint: 'Critical = service-affecting, Major = capacity-impacting, Minor = non-urgent condition, Warning = informational. Prioritize critical alarms from core devices first.' },
      { id: 2, title: 'Correlate multiple events', desc: 'Use the correlation engine to group related alarms into incidents by time window and topological proximity.', hint: 'Set a 5-minute correlation window. Alarms within 3 hops of each other on the topology are likely related. The root cause alarm usually appears first in the timeline.' },
      { id: 3, title: 'Identify root causes', desc: 'Trace alarm chains from symptom to root cause using the fault correlation workspace.', hint: 'Link-down alarms on upstream interfaces cause cascade failures downstream. A fiber cut at device A causes B, C, D to lose connectivity — A is the root cause.' },
      { id: 4, title: 'Design suppression rules', desc: 'Create alarm suppression rules to hide derived alarms once the root cause is confirmed.', hint: 'Suppression rule: if "FiberCut" alarm exists on device A with status "open", suppress all LinkDown alarms from devices downstream of A for 30 minutes.' },
      { id: 5, title: 'Prioritize incidents', desc: 'Score and prioritize open incidents based on impact scope, severity, and affected customer count.', hint: 'Use impact = (number of affected subscribers)×(service tier)×(outage duration). Higher-priority incidents should be assigned first to senior engineers.' },
      { id: 6, title: 'Restore failed services', desc: 'Execute remediation actions — reroute traffic, activate redundant links, or dispatch field crews based on root cause.', hint: 'If a fiber cut is confirmed: activate protected paths via SNMP SET or NETCONF edit-config, update the maintenance window in the ticket, and dispatch field repair.' },
      { id: 7, title: 'Measure recovery time', desc: 'Track MTTR (Mean Time to Repair) across incidents and identify process bottlenecks.', hint: 'MTTR = total repair time / number of incidents. Break it into: detection time → diagnosis time → remediation time → verification time.' },
      { id: 8, title: 'Generate fault reports', desc: 'Produce a post-incident report summarizing root cause, impact, response actions, and recommendations for prevention.', hint: 'A good report includes: incident ID, root cause, timeline (detection→diagnosis→repair→verification), impacted services, action taken, and preventive measures (e.g., add diverse fiber path).' },
    ],
    stem: [
      { field: 'Science', detail: 'System behavior — fault propagation follows predictable patterns based on network topology, protocol behavior, and failure modes' },
      { field: 'Technology', detail: 'Alarm management — FCAPS fault management framework, alarm lifecycle (cleared/acknowledged/escalated), severity mapping per ITU-T X.733' },
      { field: 'Engineering', detail: 'Reliability engineering — MTTR, MTBF, availability = uptime/(uptime+downtime), redundancy modeling (1+1, 1:N, N+1)' },
      { field: 'Mathematics', detail: 'Correlation and probability — Bayesian inference for root cause analysis, time-series correlation, Jaccard similarity for alarm grouping' },
    ],
    challenge: {
      title: 'Reduce Alarm Noise While Maintaining Service Availability',
      desc: 'After a major outage, your team is overwhelmed by alarm storms. You must design and implement an alarm suppression and correlation strategy that reduces alarm volume by 90% while ensuring no critical failure goes unnoticed.',
      steps: [
        'Analyze the alarm feed and identify the top 3 most common alarm types contributing to noise',
        'Design suppression rules that group flapping interface alarms into a single "unstable link" incident',
        'Implement topological correlation — hide all downstream alarms when a root cause is confirmed upstream',
        'Create severity escalation rules: if a minor alarm persists >30 min, auto-escalate to major',
        'Configure the AI assistant to auto-acknowledge known maintenance-window alarms',
        'Measure the reduction: compare alarm volume before and after your suppression design',
      ],
    },
    outcomes: [
      'Classify and prioritize network alarms using severity and impact analysis',
      'Correlate multiple events into incidents using temporal and topological methods',
      'Identify root causes of network failures using fault propagation analysis',
      'Design alarm suppression rules to reduce operational noise',
      'Track and improve MTTR metrics for network incidents',
      'Generate comprehensive post-incident fault reports',
    ],
    aiTutor: {
      welcome: 'Welcome, Reliability Engineer! I am your Fault Management Assistant. A major fiber cut has occurred and alarms are flooding in. Let us work together to correlate events, identify root cause, and restore service. Start with Activity 1.',
      hints: {
        1: 'Check the alarm severity distribution. In a fiber cut scenario, you will see mostly critical (link down) and major (service degradation) alarms from core devices.',
        2: 'Sort alarms by timestamp ascending. The earliest alarm is often the root cause. Later alarms are typically cascading failures from downstream devices.',
        3: 'Look at the topology: if device A (core) loses all links, and devices B-H (downstream) all report "neighbor unreachable", the root cause is likely at A.',
        4: 'Effective suppression requires specifying: trigger alarm type, suppression scope (device/link/subnet), suppression duration, and re-evaluation interval.',
        5: 'Weight incidents by: number of critical alarms ⊆ incident, number of unique devices affected, number of customers potentially impacted.',
        6: 'Always verify service restoration with a GET or ping before closing the incident. False closures lead to repeat incidents and eroded trust.',
        7: 'Break MTTR into detection (time until first alarm), diagnosis (time to root cause identification), and repair (time to resolution).',
        8: 'Include a "lessons learned" section in the post-incident report. The most valuable outcome is preventing recurrence through better monitoring or redundancy.',
      },
      challengeHint: 'The Pareto principle applies: 20% of alarm types cause 80% of noise. Focus suppression on "flapping interface" and "link down" alarms. Use a sliding window correlation with 3-minute intervals for optimal grouping.',
      completed: 'Brilliant work! You have transformed a chaotic alarm flood into a manageable incident response, reduced noise by 90%, and maintained service availability. This is world-class reliability engineering.',
    },
  },
  {
    id: 6,
    title: 'Software Defined Networking Control Center',
    theme: 'Programmable Networking',
    role: 'SDN Network Engineer',
    roleColor: 'cyan',
    scenario: 'A university campus network with 10,000+ students experiences severe congestion during online examination week. You must use the SDN controller to dynamically reroute traffic, implement QoS policies, and ensure uninterrupted connectivity for exam traffic while balancing background loads.',
    gradientFrom: 'from-cyan-600',
    gradientTo: 'to-sky-500',
    accentColor: 'cyan',
    environment: [
      { label: 'SDN Controller Dashboard', icon: 'LayoutDashboard', desc: 'Central controller view with network-wide statistics, topology graph, and real-time flow metrics' },
      { label: 'OpenFlow Switch View', icon: 'Router', desc: 'Per-switch flow table viewer with match/action entries, byte/packet counters, and idle timeouts' },
      { label: 'Topology Visualization', icon: 'GitGraph', desc: 'Dynamic interactive topology graph showing switches, hosts, links, and current flow paths with bandwidth utilization' },
      { label: 'Flow Table Editor', icon: 'Table', desc: 'Visual flow rule composer with match fields (IP, port, VLAN, MPLS), instructions (output, drop, set-field), and priority' },
      { label: 'Traffic Simulator', icon: 'Activity', desc: 'Generate synthetic traffic patterns — UDP floods, TCP bulk transfers, VoIP streams — to test flow rules' },
      { label: 'Link Utilization Monitor', icon: 'LineChart', desc: 'Per-link bandwidth utilization charts with color-coded thresholds (green < 60%, yellow < 85%, red > 85%)' },
    ],
    activities: [
      { id: 1, title: 'Inspect network topology', desc: 'Use the controller to discover the full network topology — switches, hosts, and link connections.', hint: 'The controller uses LLDP to discover links. Check the topology view for all switches and their interconnections. Note redundant paths that can be used for load balancing.' },
      { id: 2, title: 'Install flow rules', desc: 'Install static flow rules to direct exam-traine traffic from student VLANs to the exam server via the fastest path.', hint: 'Use ovs-ofctl or the controller REST API. Match on in_port, dl_vlan=100 (exam VLAN), nw_dst=10.10.10.50 (exam server IP). Action=output:3 (fast port). Priority=100.' },
      { id: 3, title: 'Modify forwarding paths', desc: 'Reroute bulk download traffic away from the exam path to keep exam latency under 50ms.', hint: 'Create a separate flow for non-exam traffic with lower priority. Match on !vlan=100, send via alternate path (output:4). Use meter tables to rate-limit bulk traffic to 100Mbps.' },
      { id: 4, title: 'Simulate controller failure', desc: 'Kill the controller process and observe how switches behave in failover mode (secure vs standalone).', hint: 'In secure mode, existing flows remain but no new flows can be installed. In standalone mode, the switch reverts to traditional L2 learning switch behavior.' },
      { id: 5, title: 'Perform flow rollback', desc: 'Roll back a misconfigured flow rule that caused a routing loop and verify connectivity restoration.', hint: 'Use curl -X DELETE to the flow entry URI, or set a flow with hard_timeout=30 for automatic removal. After deletion, verify ping between endpoints succeeds.' },
      { id: 6, title: 'Balance network traffic', desc: 'Implement equal-cost multipath (ECMP) forwarding using group tables to balance traffic across multiple links.', hint: 'Use OpenFlow group table with type=select. Add buckets for each output port. The controller can implement per-flow (hash-based) or per-packet (round-robin) selection.' },
      { id: 7, title: 'Compare traditional routing with SDN', desc: 'Run the same traffic pattern with traditional L2/L3 switching vs SDN flow control and compare metrics.', hint: 'In traditional mode, remove all flow rules and let switches run as standard L2 switches. Compare: throughput, latency, link utilization balance, and convergence time after link failure.' },
      { id: 8, title: 'Measure latency improvements', desc: 'Use precision traffic monitoring to measure end-to-end latency before and after SDN optimization.', hint: 'Use the controller\'s stats API to query per-flow duration, packet_count, byte_count. Calculate: avg_latency = total_duration / packet_count. Compare before and after QoS flow installation.' },
    ],
    stem: [
      { field: 'Science', detail: 'Network communication — SDN decouples the control plane from the data plane, enabling programmable packet forwarding decisions based on global network state' },
      { field: 'Technology', detail: 'SDN controllers — OpenFlow protocol (v1.0-v1.5), southbound APIs, controller architectures (centralized vs distributed — ONOS, OpenDaylight, Ryu)' },
      { field: 'Engineering', detail: 'Traffic engineering — flow rule optimization, QoS policy enforcement, load balancing, fast reroute using group tables and meter bands' },
      { field: 'Mathematics', detail: 'Path optimization — Dijkstra\'s algorithm for shortest path, ECMP hashing, min-cost flow for traffic engineering, queue theory for latency bounds' },
    ],
    challenge: {
      title: 'Maintain Uninterrupted Connectivity During Peak Exam Traffic',
      desc: 'During the online examination, 8,000 students are simultaneously accessing the exam server. A link failure occurs between the core and distribution switches. You must rapidly reconfigure flows to ensure zero exam session drops while keeping bandwidth available for essential services.',
      steps: [
        'Detect the link failure using the controller\'s topology change notification',
        'Identify all active flows affected by the failed link',
        'Recompute paths for exam traffic (VLAN 100) using the secondary redundant link',
        'Install new flow rules on the affected switches with higher priority for exam packets',
        'Rate-limit non-exam traffic to 30% bandwidth on the backup link using meter tables',
        'Verify no exam traffic is being dropped — check per-flow counters on the new path',
        'After exam peak passes, revert to original optimal paths using group table bucket weights',
      ],
    },
    outcomes: [
      'Design and install OpenFlow flow rules for traffic steering',
      'Implement QoS and traffic shaping using meter tables and queues',
      'Handle network failures through dynamic flow reconfiguration',
      'Perform safe rollback of misconfigured flow rules',
      'Compare SDN performance against traditional routing for latency and utilization',
      'Use group tables for load balancing and fast reroute',
    ],
    aiTutor: {
      welcome: 'Welcome, SDN Engineer! I am your Software-Defined Networking Assistant. The university network is experiencing severe congestion during exams. Let us use the SDN controller to dynamically optimize traffic flows.',
      hints: {
        1: 'The topology is discovered via LLDP. Check which switches have redundant links — they are your candidates for load balancing and fast failover.',
        2: 'Start with simple match-action flows. Use priority values carefully: higher priority flows are matched first. Assign exam traffic priority=1000, normal traffic priority=500.',
        3: 'Use meter tables to rate-limit: meter_id=1, type=drop, rate=100000 (100Mbps). Reference the meter in your flow\'s instruction list.',
        4: 'Always configure the controller\'s switch failover mode to "secure" for production. This prevents the switch from flooding unknown traffic during controller outage.',
        5: 'Before deleting a flow, verify there is a backup flow with lower priority that can handle the traffic. Otherwise, packets will be sent to the controller (packet_in).',
        6: 'ECMP group table with type=select uses a hash of packet fields (src_ip, dst_ip, src_port, dst_port) to choose the bucket. This ensures all packets in a flow take the same path.',
        7: 'Key metrics to compare: avg latency, throughput under load, convergence time after failure (traditional STP convergence: 30-50s vs SDN: <50ms).',
        8: 'The controller\'s REST API at /stats/flow/<dpid> returns per-flow byte_count and packet_count. Compute instantaneous throughput: (delta_bytes / delta_time) * 8.',
      },
      challengeHint: 'The key is speed: use group table fast failover (type=ff) with watch_port to automatically switch to the backup link when the primary port goes down. This eliminates the need for controller intervention during the switchover.',
      completed: 'Outstanding! You have successfully maintained 100% exam connectivity using SDN dynamic flow control, zero packet loss during failover, and optimal bandwidth utilization. This is the power of programmable networking.',
    },
  },
  {
    id: 7,
    title: 'Network Observability Analytics Lab',
    theme: 'Network Telemetry and Monitoring',
    role: 'Site Reliability Engineer (SRE)',
    roleColor: 'indigo',
    scenario: 'A cloud service provider running 500+ microservices across 3 data centers needs complete observability. You must design and deploy a telemetry pipeline that collects metrics, logs, and traces from network infrastructure and applications, then build dashboards and alerts for the SRE team.',
    gradientFrom: 'from-indigo-600',
    gradientTo: 'to-blue-500',
    accentColor: 'indigo',
    environment: [
      { label: 'Telemetry Collector', icon: 'Antenna', desc: 'Configurable collector pipeline with inputs (SNMP, gRPC, syslog, NetFlow) and outputs (Prometheus, Elasticsearch, Grafana)' },
      { label: 'Metrics Dashboard', icon: 'BarChart3', desc: 'Grafana-style dashboard builder with panel types: time series, heatmap, stat, gauge, table — with drag-and-drop layout' },
      { label: 'Log Viewer', icon: 'ScrollText', desc: 'Centralized log aggregator with full-text search, filter by severity/service/timestamp, and pattern detection' },
      { label: 'Tracing Console', icon: 'Network', desc: 'Distributed tracing viewer for request flows across microservices with span details and waterfall view' },
      { label: 'Dashboard Designer', icon: 'Layout', desc: 'Visual dashboard composition tool with query builder, panel linking, and annotation support' },
      { label: 'Alert Configuration', icon: 'BellRing', desc: 'Alert rule designer with conditions (threshold, anomaly, rate of change), notification channels (email, Slack, PagerDuty), and escalation policies' },
    ],
    activities: [
      { id: 1, title: 'Identify telemetry sources', desc: 'Catalog all potential telemetry sources — network devices (SNMP, NetFlow), servers (Prometheus node_exporter), applications (OpenTelemetry SDKs).', hint: 'Categorize by signal type: metrics (cpu, mem, throughput → Prometheus), logs (syslog, app logs → Elasticsearch), traces (request spans → Jaeger/Zipkin).' },
      { id: 2, title: 'Configure metrics collection', desc: 'Set up Prometheus exporters on network devices and configure scrape targets with appropriate intervals.', hint: 'SNMP exporter for network devices. Configure scrape_interval: 15s for network, 5s for application. Use relabel_configs to add environment=prod labels.' },
      { id: 3, title: 'Build monitoring dashboards', desc: 'Create a "Network Health" dashboard with panels for throughput, error rates, latency, and device uptime.', hint: 'Design panels: Top-N by throughput (bar gauge), latency heatmap (per-device), error rate (time series with threshold), uptime (stat panel with sparkline).' },
      { id: 4, title: 'Create alert policies', desc: 'Define alert rules for common failure scenarios: high latency, packet loss, interface errors, device down.', hint: 'Example rule: rate(node_network_receive_errors[5m]) / rate(node_network_receive_packets[5m]) > 0.01 → critical alert. Add 5min "for" duration to avoid flapping.' },
      { id: 5, title: 'Analyze structured logs', desc: 'Search and filter logs to diagnose a slow API response time incident across multiple services.', hint: 'Trace a single request-id across service logs: service A (API gateway) → service B (auth) → service C (database). Filter by log-level=error and timestamp range.' },
      { id: 6, title: 'Trace service requests', desc: 'Use the tracing console to visualize a user request across 5 microservices and identify the latency bottleneck.', hint: 'In the waterfall view, look for spans with the longest duration. The bottleneck is often a database query or an external HTTP call. Check span tags for sql.query or http.url.' },
      { id: 7, title: 'Detect anomalies', desc: 'Configure anomaly detection on key metrics (traffic volume, error rate, response time) using statistical modeling.', hint: 'Use 3-sigma (standard deviation) for threshold anomaly detection. For seasonal patterns, use Prophet or moving window with historical baseline. Flag deviations > 3σ from the trailing 7-day average.' },
      { id: 8, title: 'Optimize monitoring coverage', desc: 'Identify gaps in monitoring coverage — services without metrics, devices without alerts, dark areas without traces.', hint: 'Map every service and device against observability signals. A service without all three (metrics, logs, traces) has incomplete observability. Prioritize filling gaps for customer-facing services.' },
    ],
    stem: [
      { field: 'Science', detail: 'Measurement systems — the three pillars of observability (metrics, logs, traces) provide complementary views of system behavior at different granularity levels' },
      { field: 'Technology', detail: 'Telemetry pipelines — Prometheus (pull), OpenTelemetry (push/gRPC), NetFlow/IPFIX (flow data), gNMI (streaming telemetry for network devices)' },
      { field: 'Engineering', detail: 'Service monitoring — SRE practices including SLIs (Service Level Indicators), SLOs (Service Level Objectives), and error budgets' },
      { field: 'Mathematics', detail: 'Statistical analysis — time-series decomposition, moving averages, percentile calculations (p50/p95/p99), anomaly detection via standard deviation and z-scores' },
    ],
    challenge: {
      title: 'Design a Complete Observability Solution for a Multi-Tier Cloud Application',
      desc: 'A retail e-commerce platform with 20 microservices (frontend, catalog, cart, checkout, payment, inventory, notification) experiences intermittent slowdowns during flash sales. Design a full observability stack to identify bottlenecks within 30 seconds.',
      steps: [
        'Deploy telemetry collectors on all 20 services using OpenTelemetry SDKs for traces and metrics',
        'Configure Prometheus to scrape all services at 10s intervals during flash sales',
        'Build a "Flash Sale Latency" dashboard with p50/p95/p99 latency panels per service',
        'Create traces with custom spans for each database query and external API call',
        'Set up log aggregation with structured JSON logging including trace_id and span_id',
        'Configure an alert that fires when cart-checkout latency exceeds 500ms for more than 10 requests',
        'Design an auto-scaling trigger based on request rate and latency SLO breach rate',
      ],
    },
    outcomes: [
      'Deploy telemetry collectors for metrics, logs, and traces',
      'Build comprehensive monitoring dashboards for network and application observability',
      'Configure alert policies with appropriate thresholds, durations, and notification channels',
      'Perform distributed tracing analysis to identify performance bottlenecks',
      'Implement anomaly detection on key service metrics',
      'Evaluate and improve monitoring coverage and observability maturity',
    ],
    aiTutor: {
      welcome: 'Welcome, SRE! I am your Observability Lab Assistant. You will build a complete telemetry pipeline and monitoring stack for a cloud application. Let us start by identifying all our telemetry sources.',
      hints: {
        1: 'Use the "Telemetry Source Catalog" view to see all possible sources. Note which devices/services are currently unmonitored — those are your observability gaps.',
        2: 'For Prometheus SNMP exporter, configure modules per device type: if_mib (interfaces), entity_mib (hardware), bgp_mib (routing). Set scrape_timeout slightly less than scrape_interval.',
        3: 'A good "Network Health" dashboard has 6-8 panels. Avoid panel overload — every panel should answer a specific operational question.',
        4: 'Use "for: 5m" to prevent alert fatigue from transient spikes. Combine multiple conditions with AND/OR for composite alerts like "high latency AND error rate > 0.1%".',
        5: 'Use logQL (Loki) or KQL (Elastic): {service="checkout", trace_id="abc123"} |= "error". Parse JSON log fields with | json | error != nil.',
        6: 'In Jaeger, look for the span with the largest "self time" (total - child spans). That is your bottleneck. Tag spans with useful metadata: db.statement, http.method, error.true.',
        7: 'For baseline calculation, use PromQL: avg_over_time(metric[7d]) gives weekly average. Compare current value: metric / avg_over_time(metric[7d]) > 1.5 → 50% above baseline.',
        8: 'Use the "Observability Maturity Matrix": Level 0 (no monitoring), Level 1 (basic metrics), Level 2 (logs + metrics), Level 3 (all three signals), Level 4 (auto-remediation based on observability).',
      },
      challengeHint: 'Instrumentation is key: add OpenTelemetry auto-instrumentation to all services. Use baggage propagation to pass context between services. Focus your dashboard on the checkout flow — that is the most critical path during flash sales.',
      completed: 'Excellent work, SRE! You have deployed a complete observability stack covering metrics, logs, and traces across all 20 microservices. Your SLO dashboard and alert policies will ensure rapid incident response during the next flash sale.',
    },
  },
  {
    id: 8,
    title: 'ONAP Network Service Orchestration Studio',
    theme: 'Service Orchestration and Network Automation',
    role: 'Telecom Service Orchestration Architect',
    roleColor: 'yellow',
    scenario: 'A 5G telecom operator needs to automate end-to-end network service provisioning across multiple domains (access, transport, core). You must use ONAP to design services, create orchestration workflows, configure closed-loop policies, and manage network slices.',
    gradientFrom: 'from-amber-600',
    gradientTo: 'to-yellow-500',
    accentColor: 'yellow',
    environment: [
      { label: 'ONAP Architecture Simulator', icon: 'Building2', desc: 'Interactive ONAP module diagram showing how SDC, SO, Policy, A&AI, DCAE, and CLAMP interconnect' },
      { label: 'Service Design Workspace', icon: 'PencilRuler', desc: 'Service design canvas (SDC) for composing VNFs, networks, and configurations into deployable services' },
      { label: 'Workflow Engine', icon: 'Workflow', desc: 'BPMN-based workflow designer (SO module) showing sequential and parallel task orchestration steps' },
      { label: 'Policy Management Console', icon: 'Shield', desc: 'Policy framework console for designing optimization, guard, and closed-loop control policies' },
      { label: 'Inventory Manager', icon: 'Database', desc: 'A&AI inventory view showing all network resources, services, and their relationships in real-time' },
      { label: 'Network Slice Simulator', icon: 'Layers', desc: 'Slice subnet simulator showing RAN, transport, and core slice components with KPI monitoring' },
    ],
    activities: [
      { id: 1, title: 'Design a network service', desc: 'Use SDC to create a service model combining a vFirewall, vRouter, and configuration templates.', hint: 'In SDC, start with a new service. Add VF (Virtual Function) modules: vFirewall (protection), vRouter (connectivity). Define service properties: name, description, category (5G/transport/enterprise).' },
      { id: 2, title: 'Create orchestration workflows', desc: 'Design a BPMN workflow in SO that provisions a VNF in sequence: allocate IP → deploy VM → configure VNF → test connectivity.', hint: 'Use sequential multi-step: 1) Create VIM instance (OpenStack), 2) Assign IP from subnet pool, 3) Deploy VNF heat template, 4) Configure VNF via NETCONF day-1 config, 5) Run health-check.' },
      { id: 3, title: 'Configure policies', desc: 'Create guard policies (resource limits) and optimization policies (placement rules) in the Policy framework.', hint: 'Guard policy: max_cpu_cores_per_vnf=8, max_instances_per_zone=50. Optimization policy: min_affinity (place VNFs in same zone for low latency) or anti-affinity (spread across zones for resilience).' },
      { id: 4, title: 'Provision virtual network functions', desc: 'Execute the service orchestration workflow to deploy a vFirewall in the target cloud platform.', hint: 'SO sends request to Multi-VIM/Cloud adapter, which creates the virtual machine in OpenStack via heat template. Monitor progress in the SO active requests view.' },
      { id: 5, title: 'Simulate service assurance', desc: 'Monitor the deployed service using DCAE (Data Collection, Analytics, and Events) with closed-loop automation.', hint: 'DCAE collects metrics from the VNF via VES (VNF Event Stream). Set up a TCA (Threshold Crossed Alert) policy: if cpu_util > 85% for 5min, trigger a control loop.' },
      { id: 6, title: 'Monitor closed-loop automation', desc: 'Observe the control loop in CLAMP: detect anomaly, analyze, decide action, execute via Policy-SO integration.', hint: 'CLAMP (Closed Loop Automation Management Platform) visualizes the loop: DCAE detects → Policy decides (scale out) → SO executes (deploy new VNF instance) → A&AI updates inventory.' },
      { id: 7, title: 'Allocate network slices', desc: 'Design and allocate a network slice for a premium enterprise 5G eMBB service with guaranteed 1Gbps throughput.', hint: 'Slice components: RAN slice (gNB with QoS), transport slice (FlexE with dedicated bandwidth), core slice (UPF with edge compute). Each sub-slice has its own SLA and lifecycle.' },
      { id: 8, title: 'Optimize service deployment', desc: 'Analyze deployed service performance and use optimization policies to relocate VNFs for better resource utilization.', hint: 'Use DCAE analytics to identify hotspots. Define a "cooling" policy: if zone CPU < 30% for 1 hour, migrate VNFs to consolidate. Use SO migration workflow with zero-downtime VNF move (live migration or blue-green).' },
    ],
    stem: [
      { field: 'Science', detail: 'Distributed systems — ONAP orchestrates services across multiple VIMs (OpenStack, Kubernetes), SDN controllers, and NFVI platforms using distributed consensus' },
      { field: 'Technology', detail: 'ONAP ecosystem — SDC (design), SO (orchestration), Policy (governance), A&AI (inventory), DCAE (analytics), CLAMP (closed loop), Multi-Cloud (infrastructure abstraction)' },
      { field: 'Engineering', detail: 'Telecom orchestration — ETSI NFV MANO architectural framework, VNF lifecycle management (instantiate, scale, heal, terminate), service chaining' },
      { field: 'Mathematics', detail: 'Resource optimization — bin packing for VNF placement, constraint satisfaction for affinity/anti-affinity rules, network flow optimization for service function chaining' },
    ],
    challenge: {
      title: 'Deploy and Manage an End-to-End 5G Network Slice',
      desc: 'An enterprise customer requires an end-to-end 5G network slice with eMBB (enhanced Mobile Broadband) for their autonomous vehicle fleet management platform. The slice must guarantee 500Mbps throughput, <10ms latency, and 99.999% availability.',
      steps: [
        'Design the slice blueprint in SDC with RAN, transport, and core sub-slices',
        'Create policies: guard (max 50 vehicles per cell), optimization (place UPF at edge for <5ms RTT), and SLA (latency <10ms)',
        'Orchestrate the slice deployment: allocate RAN resources → configure FlexE transport → deploy edge UPF → establish N6 interface',
        'Attach 10 simulated vehicle UEs to the slice and generate traffic',
        'Monitor real-time KPIs: throughput, latency, packet loss, and session continuity',
        'Simulate a transport link failure and verify closed-loop recovery (reroute within 50ms)',
        'Generate a service assurance report showing SLA compliance over 24 hours',
      ],
    },
    outcomes: [
      'Design network services using ONAP SDC with VNF composition',
      'Create BPMN orchestration workflows for multi-step service provisioning',
      'Configure guard, optimization, and closed-loop policies in ONAP Policy framework',
      'Deploy and monitor VNFs across cloud infrastructure',
      'Implement closed-loop automation for self-healing networks',
      'Design and manage 5G network slices with SLA guarantees',
    ],
    aiTutor: {
      welcome: 'Welcome, Orchestration Architect! I am your ONAP Studio Assistant. You will design, deploy, and manage end-to-end 5G network services using the ONAP orchestration platform. Let us start by designing our first service.',
      hints: {
        1: 'In SDC, use the "Service" category for network-facing services and "Product" for customer-facing offerings. A service can contain multiple VNFs and networks.',
        2: 'Use BPMN call activities to reuse common sub-processes. Create a "Deploy VNF" sub-process that can be called by any service workflow. Use parallel gateways for independent tasks.',
        3: 'Policy scope: closedLoopControl (automated), configuration (enforce), decision (placement, scaling). Use the PDP-D (drools) for real-time policy evaluation.',
        4: 'Track the request in SO activeRequests view. If failed, check error code in the request log. Common issues: cloud quota exceeded, network conflict, image not found.',
        5: 'DCAE uses microservice-based collectors and analytics. The VES collector receives JSON events from VNFs. TCA applies threshold rules and publishes to DMaAP (data movement as a platform).',
        6: 'CLAMP control loop states: CL-DESIGNED → CL-DEPLOYED → CL-RUNNING → CL-PASSIVE → CL-DELETED. Monitor loop health via the CLAMP dashboard.',
        7: 'NSSMF (Network Slice Subnet Management Function) handles per-domain slice lifecycle. The slice blueprint references NSTs (Network Slice Templates) for each subnet.',
        8: 'DCAE Holmes (root cause analysis) correlates alerts from multiple VNFs. Use Holmes topology-based analytics to find the root cause of service degradation.',
      },
      challengeHint: 'For the 5G slice challenge, focus on the transport sub-slice — it is often the bottleneck. Use FlexE (Flexible Ethernet) with dedicated 1Gbps channel. For <10ms latency, ensure the UPF is at the network edge, not centralized. Set closed-loop recovery time SLA at 50ms using fast reroute with BFD.',
      completed: 'Magnificent work, Architect! You have successfully designed, deployed, and managed a complete 5G network slice with automated assurance and closed-loop recovery. This is carrier-grade orchestration at its finest.',
    },
  },
];
