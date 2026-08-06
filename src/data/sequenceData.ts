import type { SequenceDiagramDef } from '../components/SequenceDiagram';

export const snmpSequence: SequenceDiagramDef = {
  title: 'SNMP GET/SET/TRAP Data Flow',
  participants: [
    { id: 'user', label: 'NOC Engineer' },
    { id: 'nms', label: 'SNMP Manager' },
    { id: 'agent', label: 'SNMP Agent\n(Core-R1)' },
    { id: 'mib', label: 'MIB Database' },
  ],
  messages: [
    {
      id: 1, from: 'user', to: 'nms', label: 'Select device + OID', stepNumber: 1,
      direction: 'request', protocol: 'User Input',
      pduSyntax: 'Action: Select target device = 192.168.1.1 (Core-R1)\nOID: .1.3.6.1.2.1.1.3.0 (sysUpTime)\nSNMP version: v2c\nCommunity: public (read-only)',
      pduSemantics: 'User Input — NOC engineer selects:\n- Target device: Core-R1 router at 192.168.1.1\n- OID to query: .1.3.6.1.2.1.1.3.0 (sysUpTime — time since last reboot)\n- SNMP version: v2c (community-based security)\n- Community string: "public" (default read-only community)',
      processing: 'SNMP Manager receives the request from the NOC console. It constructs a GetRequest PDU with:\n  • version: v2c (1)\n  • community: "public"\n  • PDU type: 0xA0 (GetRequest)\n  • request-id: unique 32-bit integer for matching response\n  • var-bind list: the requested OID with NULL value (to be filled by agent)',
    },
    {
      id: 2, from: 'nms', to: 'agent', label: 'SNMPv2c GetRequest', stepNumber: 2,
      direction: 'request', protocol: 'SNMPv2c',
      pduSyntax: 'SNMP GetRequest PDU (BER encoding):\n30 2e 02 01 01 04 06 70 75 62 6c 69 63 a0 21\n02 04 60 b1 92 81 02 01 00 02 01 00 30 13\n30 11 06 0c 2b 06 01 02 01 01 03 00 05 00\n\nDecoded:\n- SEQUENCE {\n  - INTEGER { version = 1 (v2c) }\n  - OCTET STRING { "public" }\n  - [0xA0] GetRequest {\n    - INTEGER { request-id = 1623849217 }\n    - INTEGER { error-status = 0 (noError) }\n    - INTEGER { error-index = 0 }\n    - SEQUENCE (var-bind list) {\n      - SEQUENCE {\n        - OID { 1.3.6.1.2.1.1.3.0 }\n        - NULL (value to be filled)\n      }\n    }\n  }\n}',
      pduSemantics: 'Field-by-field breakdown:\n• SEQUENCE (0x30): ASN.1 wrapper for the entire SNMP message\n• version (INTEGER 0x02 0x01 0x01): SNMP version 1 = v2c\n• community (OCTET STRING 0x04 0x06 "public"): Community string sent in cleartext — NO encryption in v2c\n• GetRequest (0xA0 context tag): Identifies this as a GetRequest PDU. The agent MUST respond with GetResponse\n• request-id (INTEGER 0x02 0x04 0x60B19281): Unique ID = 1623849217. The response will carry the same ID for matching\n• error-status (0x02 0x01 0x00): Set to 0 in request; agent fills on error\n• error-index (0x02 0x01 0x00): Set to 0 in request; agent fills on error\n• var-bind list: Contains the OID being queried with NULL value — agent replaces NULL with actual value',
      processing: 'SNMP Agent (Core-R1) receives GetRequest on UDP port 161. It:\n1. Parses BER-encoded message\n2. Extracts and validates community string "public"\n3. Looks up OID .1.3.6.1.2.1.1.3.0 in its MIB tree\n4. Retrieves sysUpTime value from system group (time since boot in hundredths of seconds)\n5. Constructs GetResponse PDU with the actual value\n6. Sends response back to manager on ephemeral UDP port',
    },
    {
      id: 3, from: 'agent', to: 'mib', label: 'MIB lookup sysUpTime', stepNumber: 3,
      direction: 'request', protocol: 'Internal',
      pduSyntax: 'MIB-II System Group Walk:\nOID: .1.3.6.1.2.1.1 (system)\n├── .1.3.6.1.2.1.1.1.0 = sysDescr — "Cisco IOS XR 7.8.1"\n├── .1.3.6.1.2.1.1.2.0 = sysObjectID — .1.3.6.1.4.1.9.1.1\n├── .1.3.6.1.2.1.1.3.0 = sysUpTime — 4129857 timeticks ← TARGET\n├── .1.3.6.1.2.1.1.4.0 = sysContact — "noc@example.com"\n├── .1.3.6.1.2.1.1.5.0 = sysName — "Core-R1.nms.example.com"\n└── .1.3.6.1.2.1.1.6.0 = sysLocation — "DataCenter-1 Rack-03"\n\nValue at .1.3.6.1.2.1.1.3.0:\n  Type: TimeTicks (application-specific, 0x43)\n  Value: 0x003EFC41 = 4129857 hundredths of a second\n  = 41,298.57 seconds = 11h 28min 18.57s since last boot',
      pduSemantics: 'MIB tree walk semantics:\n• MIB-II (RFC 1213): Standard MIB for TCP/IP management\n• system group (1.3.6.1.2.1.1): Contains basic device info\n• sysUpTime instance (1.3.6.1.2.1.1.3.0): The scalar object (indicated by .0 suffix)\n• TimeTicks: SNMP application type representing time in 1/100ths of a second\n• The agent\'s SNMP engine maintains sysUpTime as a monotonically increasing counter\n• Value wraps to 0 after 497 days (2^32 hundredths of a second)',
      processing: 'The SNMP agent engine traverses its internal MIB tree:\n1. The agent holds the MIB-II system group in memory (updated by OS kernel)\n2. sysUpTime is incremented every 10ms by a system timer interrupt\n3. The agent locks the MIB variable to ensure atomic read\n4. Current value 4129857 timeticks = ~11.5 hours uptime\n5. This value is prepared for insertion into the GetResponse PDU',
    },
    {
      id: 4, from: 'agent', to: 'nms', label: 'SNMPv2c GetResponse', stepNumber: 4,
      direction: 'response', protocol: 'SNMPv2c',
      pduSyntax: 'SNMP GetResponse PDU (BER encoding):\n30 2e 02 01 01 04 06 70 75 62 6c 69 63 a2 21\n02 04 60 b1 92 81 02 01 00 02 01 00 30 13\n30 11 06 0c 2b 06 01 02 01 01 03 00 43 02 3e f4 41\n\nDecoded:\n- SEQUENCE {\n  - INTEGER { version = 1 }\n  - OCTET STRING { "public" }\n  - [0xA2] GetResponse {\n    - INTEGER { request-id = 1623849217 }\n    - INTEGER { error-status = 0 }\n    - INTEGER { error-index = 0 }\n    - SEQUENCE (var-bind list) {\n      - SEQUENCE {\n        - OID { 1.3.6.1.2.1.1.3.0 }\n        - TimeTicks { 4129857 }  ← ACTUAL VALUE\n      }\n    }\n  }\n}',
      pduSemantics: 'Response field analysis:\n• GetResponse (0xA2 context tag): Differentiates response from request (0xA0 vs 0xA2)\n• request-id = 1623849217: MATCHES the request — client uses this to correlate response\n• error-status = 0 (noError): No error occurred. Possible values: 0=noError, 1=tooBig, 2=noSuchName, 3=badValue, 4=readOnly, 5=genErr\n• error-index = 0: Index in var-bind list where error occurred (0 if no error)\n• var-bind: OID unchanged + value now populated as TimeTicks(4129857)\n• TimeTicks (0x43): SNMP application-specific type displayed as "timeticks"\n• 4129857 timeticks = 11:28:25.57 — engineer reads this as "device has been up for ~11.5 hours"',
      processing: 'SNMP Manager processes the response:\n1. Receives UDP packet from agent on ephemeral port\n2. Matches request-id (1623849217) against pending request table\n3. Parses the value as TimeTicks type\n4. Formats output: "4129857 (timeticks) 11:28:25.57"\n5. Updates the NOC console display\n6. If error-status were non-zero, it would display the error instead',
    },
    {
      id: 5, from: 'nms', to: 'user', label: 'Display sysUpTime result', stepNumber: 5,
      direction: 'response', protocol: 'Console Output',
      pduSyntax: 'Console output displayed to NOC engineer:\n─────────────────────────────────\nSNMPv2c GET 192.168.1.1\nOID: .1.3.6.1.2.1.1.3.0\nValue: 4129857 (timeticks) 11:28:25.57\nStatus: Success (0x00)\n─────────────────────────────────\n\nInterpretation: Device Core-R1 has been operational for\n11 hours, 28 minutes, and 25 seconds since its last restart.',
      pduSemantics: 'Output semantics:\n• Device IP 192.168.1.1: The managed device address\n• OID .1.3.6.1.2.1.1.3.0: sysUpTime = System uptime\n• Value 4129857: Raw timeticks counter value\n• "11:28:25.57": Human-readable format (HH:MM:SS.hundredths)\n• Status "Success (0x00)": SNMP error-status 0 means no error\n\nPractical use: NOC engineers poll sysUpTime periodically (e.g., every 5 min) to:\n- Detect router reboots (uptime suddenly drops)\n- Track device stability\n- Schedule maintenance windows',
      processing: 'Engineer interprets result: Router Core-R1 has uptime of 11.5 hours — normal. If uptime were < 5 min, it would indicate a recent crash or power cycle requiring investigation.',
    },
    {
      id: 6, from: 'user', to: 'nms', label: 'SET ifAdminStatus = down', stepNumber: 6,
      direction: 'request', protocol: 'User Input',
      pduSyntax: 'Action: SNMP SET operation\nOID: .1.3.6.1.2.1.2.2.1.7.1 (ifAdminStatus.1)\nValue: 2 (down)\nCommunity: private (write-access)\nDevice: 192.168.1.1 (Core-R1)\nInterface: Gi0/0/0 (ifIndex = 1)',
      pduSemantics: 'SET operation semantics:\n• ifAdminStatus (1.3.6.1.2.1.2.2.1.7): MIB-II interface MIB — desired interface state\n• Instance .1 = interface index 1 (Gi0/0/0)\n• Value: INTEGER { up(1), down(2), testing(3) } — setting to 2 = administratively disable\n• Requires private community string — "public" community is read-only and will return "noSuchName" or "badValue" error\n• This is a DESTRUCTIVE operation — will immediately bring down the interface',
      processing: 'Manager validates the SET request: checks that community "private" has write access for the target OID. Constructs SetRequest PDU with the new value. Generates a unique request-id for this SET operation.',
    },
    {
      id: 7, from: 'nms', to: 'agent', label: 'SNMPv2c SetRequest (down)', stepNumber: 7,
      direction: 'request', protocol: 'SNMPv2c',
      pduSyntax: 'SNMP SetRequest PDU (BER encoding):\n30 2f 02 01 01 04 07 70 72 69 76 61 74 65 a3 21\n02 04 60 b1 92 82 02 01 00 02 01 00 30 13\n30 11 06 0c 2b 06 01 02 01 02 02 01 07 01 02 01 02\n\nDecoded:\n- SEQUENCE {\n  - INTEGER { version = 1 }\n  - OCTET STRING { "private" }  ← DIFFERENT community!\n  - [0xA3] SetRequest {\n    - INTEGER { request-id = 1623849218 }\n    - INTEGER { error-status = 0 }\n    - INTEGER { error-index = 0 }\n    - SEQUENCE {\n      - SEQUENCE {\n        - OID { 1.3.6.1.2.1.2.2.1.7.1 }\n        - INTEGER { 2 }  ← NEW VALUE = down\n      }\n    }\n  }\n}',
      pduSemantics: 'SetRequest-specific fields:\n• [0xA3] SetRequest: Different PDU type from GetRequest (0xA0). Agent will enforce write permissions\n• community = "private": NOT "public" — this is the write-access community\n• OID 1.3.6.1.2.1.2.2.1.7.1: ifAdminStatus for interface ifIndex=1 (Gi0/0/0)\n• Value INTEGER 2: down(2) — the new admin state\n• The agent MUST check: (a) OID is writable, (b) community has write access, (c) value type is correct\n\nASN.1 BER encoding: INTEGER 2 = 0x02 0x01 0x02 (type=0x02, length=1, value=2)',
      processing: 'Agent receives SetRequest on UDP 161. It:\n1. Checks community "private" against configured community strings (typically stored in snmpd.conf)\n2. Verifies OID .1.3.6.1.2.1.2.2.1.7.1 has access = read-write in MIB\n3. Validates value type: INTEGER (expected by MIB definition)\n4. Calls the device driver to set ifAdminStatus to down(2)\n5. This causes the OS to administratively disable Gi0/0/0 — link physically goes down\n6. Constructs SetResponse with error-status=0 on success',
    },
    {
      id: 8, from: 'agent', to: 'nms', label: 'linkDown Trap (unsolicited)', stepNumber: 8,
      direction: 'notification', protocol: 'SNMPv2c Trap',
      pduSyntax: 'SNMPv2 Trap PDU (BER encoding):\n30 3a 02 01 01 04 06 70 75 62 6c 69 63 a7 2d\n02 04 00 00 00 00 02 01 00 02 01 00 30 1f\n30 0e 06 08 2b 06 01 02 01 01 03 00 43 02 3e 8f\n30 0d 06 0a 2b 06 01 06 03 01 01 05 03 05 00\n\nDecoded:\n- [0xA7] SNMPv2-Trap {\n  - request-id = 0 (always 0 for traps — no response expected)\n  - error-status = 0\n  - error-index = 0\n  - var-bind list {\n    - sysUpTime.0 = TimeTicks(4130431)\n    - snmpTrapOID.0 = OID(1.3.6.1.6.3.1.1.5.3) = linkDown\n  }\n}',
      pduSemantics: 'Trap PDU semantics:\n• [0xA7] SNMPv2-Trap: Unsolicited notification from agent to manager on UDP port 162\n• request-id = 0: Traps have no request-id matching — they are one-way notifications\n• sysUpTime.0: Timeticks when the trap was generated (4130431 ≈ 11h28min)\n• snmpTrapOID.0 = linkDown (1.3.6.1.6.3.1.1.5.3): Standard OID identifying the trap type\n  - linkDown = .1.3.6.1.6.3.1.1.5.3\n  - linkUp = .1.3.6.1.6.3.1.1.5.4\n  - authenticationFailure = .1.3.6.1.6.3.1.1.5.5\n  - coldStart = .1.3.6.1.6.3.1.1.5.1\n  - warmStart = .1.3.6.1.6.3.1.1.5.2\n• Additional varbinds may carry ifIndex, ifAdminStatus, ifOperStatus for root cause analysis',
      processing: 'Manager receives trap on UDP 162. It:\n1. Identifies PDU type as Trap (0xA7) — no response will be sent\n2. Extracts snmpTrapOID to identify the trap type: linkDown\n3. Records the event in the alarm log with timestamp\n4. Updates the NOC dashboard — shows red alert for Core-R1\n5. The trap is asynchronous — the manager did NOT request this; the agent sent it proactively\n6. This demonstrates event-driven monitoring vs polling: traps reduce polling overhead but are unreliable (UDP — may be lost)',
    },
  ],
};

export const netconfSequence: SequenceDiagramDef = {
  title: 'NETCONF RPC Data Flow',
  participants: [
    { id: 'admin', label: 'Admin' },
    { id: 'client', label: 'NETCONF Client' },
    { id: 'server', label: 'NETCONF Server\n(192.168.1.1:830)' },
    { id: 'datastore', label: 'Candidate\nDatastore' },
  ],
  messages: [
    {
      id: 1, from: 'admin', to: 'client', label: 'Initiate NETCONF session', stepNumber: 1,
      direction: 'request', protocol: 'User Input',
      pduSyntax: 'Command: ssh -p 830 admin@192.168.1.1 -s netconf\n\nParameters:\n- SSH port: 830 (standard NETCONF port)\n- User: admin\n- Host: 192.168.1.1 (Core-R1)\n- Subsystem: netconf (required by RFC 6242)',
      pduSemantics: 'User initiates SSH session to the NETCONF server:\n• Port 830: IANA-assigned port for NETCONF over SSH (RFC 6242)\n• Subsystem "netconf": The SSH server has a netconf subsystem that handles NETCONF messages\n• SSH provides: encryption, authentication, integrity, compression\n• SSH message exchange: TCP handshake → SSH version → key exchange → authentication → channel open → subsystem request',
      processing: 'SSH connection is established. Upon successful authentication, the SSH server starts the NETCONF subsystem. Both sides immediately send <hello> messages containing their capabilities — this is the NETCONF capability exchange phase.',
    },
    {
      id: 2, from: 'client', to: 'server', label: '<hello> Capability Exchange', stepNumber: 2,
      direction: 'request', protocol: 'NETCONF 1.1',
      pduSyntax: '<?xml version="1.0" encoding="UTF-8"?>\n<hello xmlns="urn:ietf:params:netconf:base:1.0">\n  <capabilities>\n    <capability>\n      urn:ietf:params:netconf:base:1.1\n    </capability>\n    <capability>\n      urn:ietf:params:netconf:candidate:1.0\n    </capability>\n  </capabilities>\n  <session-id>1042</session-id>\n</hello>\n\n--- NETCONF 1.1 chunked framing ---\n\n\\n\\n  <?xml...?>...  \\n\\n\n(Layer: SSH encrypted tunnel)',
      pduSemantics: '<hello> message fields:\n• xmlns="urn:ietf:params:netconf:base:1.0": XML namespace for NETCONF base protocol\n• <capabilities>: List of YANG models and protocol features supported\n  - urn:ietf:params:netconf:base:1.1: NETCONF protocol version 1.1 (supports chunked framing)\n  - candidate:1.0: Supports candidate datastore (edit-validate-commit workflow)\n  - validate:1.1: Supports &lt;validate&gt; RPC\n  - confirmed-commit:1.1: Supports confirmed-commit with automatic rollback\n• <session-id>: Unique identifier assigned by server for this session (1042)\n\nNETCONF 1.1 chunked framing: Messages are delimited by \\n\\n # \\n\\n (length-prefixed) replacing the EOM marker ||]]>]]> used in NETCONF 1.0',
      processing: 'Both sides compare capability sets. The common capabilities determine which operations are available:\n1. Server sees client supports base:1.1 — enables chunked framing\n2. Client sees server supports:candidate — can use candidate datastore\n3. Client sees server supports:confirmed-commit — can use safe commit with rollback\n4. The session is now active. All subsequent messages are &lt;rpc&gt; / &lt;rpc-reply&gt; pairs\n5. The server increments session counter; rpc-error if session count exceeds max-sessions',
    },
    {
      id: 3, from: 'admin', to: 'client', label: 'Request get-config', stepNumber: 3,
      direction: 'request', protocol: 'User Input',
      pduSyntax: 'Action: Click "get-config" button in RPC Console\n\nRPC to execute:\n<rpc message-id="101" xmlns="urn:ietf:params:netconf:base:1.0">\n  <get-config>\n    <source>\n      <running/>\n    </source>\n  </get-config>\n</rpc>',
      pduSemantics: 'User triggers get-config RPC:\n• &lt;rpc&gt;: Root element of every NETCONF RPC request\n• message-id="101": Application-layer sequence number — used to match request with response\n• &lt;get-config&gt;: The RPC operation to retrieve configuration\n• &lt;source&gt;&lt;running/&gt;&lt;/source&gt;: Specifies which datastore to read from\n  - running: The currently active configuration\n  - candidate: The working configuration (not yet committed)\n  - startup: Configuration loaded on device boot',
      processing: 'NETCONF client constructs the RPC XML document, wraps it in NETCONF 1.1 chunked framing, and sends it over the encrypted SSH channel. The message-id is incremented for each RPC to allow pipelining (multiple outstanding RPCs).',
    },
    {
      id: 4, from: 'client', to: 'server', label: '&lt;rpc&gt; get-config', stepNumber: 4,
      direction: 'request', protocol: 'NETCONF 1.1',
      pduSyntax: '\\n\\n#356\n<rpc message-id="101"\n     xmlns="urn:ietf:params:netconf:base:1.0">\n  <get-config>\n    <source>\n      <running/>\n    </source>\n    <filter type="subtree">\n      <interfaces\n        xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces"/>\n    </filter>\n  </get-config>\n</rpc>\n\\n\\n\n\n--- Chunked framing ---\n\\n\\n#356\\n... \\n\\n\n(356 = octet count of the following XML chunk)',
      pduSemantics: 'RPC document structure:\n• message-id="101": Correlated with server\'s &lt;rpc-reply&gt; which echoes back the message-id\n• &lt;get-config&gt;: Read operation — does NOT modify device state\n• &lt;source&gt;&lt;running/&gt;: Read from the running datastore (active configuration)\n• &lt;filter type="subtree"&gt;: Optional subtree filter to retrieve only specific parts\n  - Without filter: returns entire configuration (potentially very large)\n  - With filter: returns only &lt;interfaces&gt; subtree for efficiency\n• Channel: data flows inside the encrypted SSH tunnel (AES-256-GCM)',
      processing: 'NETCONF server processes the RPC:\n1. Validates XML well-formedness against YANG schema\n2. Checks that &lt;get-config&gt; operation is permitted\n3. Reads the running datastore from device memory\n4. Applies the subtree filter (returns only if:interfaces)\n5. Serializes the configuration as YANG-derived XML\n6. Prepares &lt;rpc-reply&gt; with the same message-id=101',
    },
    {
      id: 5, from: 'server', to: 'client', label: '&lt;rpc-reply&gt; config data', stepNumber: 5,
      direction: 'response', protocol: 'NETCONF 1.1',
      pduSyntax: '\\n\\n#892\n<rpc-reply message-id="101"\n           xmlns="urn:ietf:params:netconf:base:1.0">\n  <data>\n    <interfaces xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces">\n      <interface>\n        <name>GigabitEthernet0/0</name>\n        <type xmlns:ianaift="urn:ietf:params:xml:ns:yang:iana-if-type">\n          ianaift:ethernetCsmacd\n        </type>\n        <enabled>true</enabled>\n        <ipv4 xmlns="urn:ietf:params:xml:ns:yang:ietf-ip">\n          <address>\n            <ip>10.0.0.1</ip>\n            <netmask>255.255.255.0</netmask>\n          </address>\n        </ipv4>\n      </interface>\n    </interfaces>\n  </data>\n</rpc-reply>\n\\n\\n',
      pduSemantics: 'Response field analysis:\n• message-id="101": Echoes the request message-id — client uses this to match request-response pair\n• &lt;data&gt;: Wrapper for the retrieved configuration data\n• YANG-prefixed XML: Each element carries its YANG module namespace\n  - ietf-interfaces: Standard YANG model for interface management\n  - ietf-ip: Standard YANG model for IP addresses\n  - iana-if-type: IANA interface type definitions\n• &lt;enabled&gt;true&lt;/enabled&gt: Interface admin state (YANG leaf of type boolean)\n• &lt;ip&gt;10.0.0.1&lt;/ip&gt: IPv4 address assigned to interface\n\nData is structured exactly as defined by the YANG model — this is model-driven management',
      processing: 'Client receives &lt;rpc-reply&gt;:\n1. Matches message-id=101 to pending RPC\n2. Extracts &lt;data&gt; content (the configuration)\n3. Validates XML against expected YANG schema\n4. Displays the configuration to admin in formatted output\n5. If &lt;rpc-error&gt; was returned instead of &lt;data&gt;, would parse error fields: error-type, error-tag, error-severity, error-path, error-message',
    },
    {
      id: 6, from: 'admin', to: 'client', label: 'Request edit-config (disable G0/0)', stepNumber: 6,
      direction: 'request', protocol: 'User Input',
      pduSyntax: 'Action: Click "edit-config" button\n\nRPC to execute:\n<rpc message-id="102" xmlns="urn:ietf:params:netconf:base:1.0">\n  <edit-config>\n    <target>\n      <candidate/>\n    </target>\n    <default-operation>merge</default-operation>\n    <config>\n      <interfaces xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces">\n        <interface>\n          <name>GigabitEthernet0/0</name>\n          <enabled>false</enabled>\n        </interface>\n      </interfaces>\n    </config>\n  </edit-config>\n</rpc>',
      pduSemantics: 'edit-config RPC semantics:\n• &lt;target&gt;&lt;candidate/&gt;: Modify the candidate datastore (NOT running — changes are staged)\n• &lt;default-operation&gt;merge&lt;/default-operation&gt;: Merge strategy\n  - merge: Update existing nodes or create new ones (default)\n  - replace: Replace entire target subtree with provided config\n  - none: Only set explicitly provided values\n  - remove: Delete nodes if they exist (no error if absent)\n• &lt;config&gt;: The YANG-encoded configuration changes to apply\n• <enabled>false</enabled>: Setting the admin state to disabled\n\nUsing candidate datastore: Changes are NOT applied until &lt;commit&gt; is called',
      processing: 'Admin chooses to modify the candidate (not running) — this is the SAFE approach. Changes are staged in the candidate datastore and can be validated before commit. This prevents partial/incorrect configs from affecting live traffic.',
    },
    {
      id: 7, from: 'client', to: 'server', label: '&lt;rpc&gt; edit-config (candidate)', stepNumber: 7,
      direction: 'request', protocol: 'NETCONF 1.1',
      pduSyntax: '\\n\\n#512\n<rpc message-id="102"\n     xmlns="urn:ietf:params:netconf:base:1.0">\n  <edit-config>\n    <target>\n      <candidate/>\n    </target>\n    <default-operation>merge</default-operation>\n    <config>\n      <interfaces\n        xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces">\n        <interface>\n          <name>GigabitEthernet0/0</name>\n          <enabled>false</enabled>\n        </interface>\n      </interfaces>\n    </config>\n  </edit-config>\n</rpc>\n\\n\\n',
      pduSemantics: 'XML validation semantics:\n• The server validates the entire &lt;config&gt; against the YANG schema before applying\n• YANG validation checks:\n  - Mandatory leafs are present (e.g., &lt;name&gt; is required for interface list entry)\n  - Data types match (enabled must be boolean: true/false)\n  - Range constraints are satisfied\n  - Must/When expressions evaluate correctly\n• If validation fails → &lt;rpc-error&gt; with error-tag "invalid-value" or "missing-element"\n• If validation passes → config is written to candidate datastore\n\nThe candidate datastore now has the modified config BUT running config is unchanged',
      processing: 'Server processes edit-config:\n1. Locks candidate datastore (prevents concurrent modifications)\n2. Validates config XML against YANG schema for ietf-interfaces\n3. Merges the provided config into candidate datastore\n4. On success, returns &lt;rpc-reply&gt;&lt;ok/&gt;&lt;/rpc-reply&gt;\n5. Candidate now differs from running — changes are staged but NOT active\n6. Locks are released (lock is per-session)',
    },
    {
      id: 8, from: 'admin', to: 'client', label: 'Request commit', stepNumber: 8,
      direction: 'request', protocol: 'User Input',
      pduSyntax: 'Action: Click "commit" button\n\nRPC to execute:\n<rpc message-id="103" xmlns="urn:ietf:params:netconf:base:1.0">\n  <commit>\n    <confirmed/>\n    <confirm-timeout>600</confirm-timeout>\n  </commit>\n</rpc>\n\nNote: confirmed-commit means changes will auto-rollback\nafter 600 seconds if no confirming commit is received.',
      pduSemantics: 'commit RPC options:\n• Simple commit: <commit/> — immediately applies candidate to running\n• Confirmed commit: <commit><confirmed/><confirm-timeout>600</confirm-timeout></commit>\n  - Saves the current running config as rollback point\n  - Applies candidate to running\n  - Starts 600-second timer\n  - If no confirming &lt;commit/&gt; is received within 600s → auto-rollback to previous running\n  - SAFETY MECHANISM: prevents lock-out if commit breaks connectivity\n• Without confirmed-commit: changes are permanent immediately — any mistake requires manual correction',
      processing: 'Admin chooses confirmed-commit for safety. This is the production best practice for remote device configuration — if the commit disconnects the NETCONF session (e.g., interface shutdown kills the management path), the device automatically reverts after 600 seconds.',
    },
    {
      id: 9, from: 'client', to: 'server', label: '&lt;rpc&gt; commit (confirmed)', stepNumber: 9,
      direction: 'request', protocol: 'NETCONF 1.1',
      pduSyntax: '\\n\\n#168\n<rpc message-id="103"\n     xmlns="urn:ietf:params:netconf:base:1.0">\n  <commit>\n    <confirmed/>\n    <confirm-timeout>600</confirm-timeout>\n  </commit>\n</rpc>\n\n--- What happens atomically ---\n1. Lock running and candidate datastores\n2. Copy candidate → running (merge/replace per edit-config)\n3. Save old running config as rollback snapshot\n4. Start 600-second rollback timer\n5. Enable GigabitEthernet0/0 -> admin DOWN\n6. Unlock datastores\n7. Reply <ok>',
      pduSemantics: 'Atomic commit operation (all-or-nothing):\n• The commit operation is ATOMIC: either ALL changes are applied or NONE\n• If any part of the candidate config fails validation at commit time, the entire commit is rejected\n• The device now has the new running configuration with Gi0/0/0 admin down\n• The 600-second timer is active — admin must send another &lt;commit/&gt; (without confirmed) to make permanent\n• If the SSH/NETCONF session drops before confirming, the device rolls back automatically\n\nThis prevents the "locked out of the network" scenario that plagues traditional CLI-based mgmt',
      processing: 'Server performs atomic commit:\n1. Validates entire candidate config is consistent\n2. Creates rollback snapshot of current running config\n3. Atomically replaces running with candidate\n4. Starts 600-second timer\n5. If GigabitEthernet0/0 is the management interface, the SSH connection will drop!\n6. With confirmed-commit: device detects connection drop, starts rollback\n7. Without confirmed-commit: admin is locked out and must use out-of-band console access',
    },
    {
      id: 10, from: 'server', to: 'client', label: '&lt;rpc-reply&gt;&lt;ok/&gt;', stepNumber: 10,
      direction: 'response', protocol: 'NETCONF 1.1',
      pduSyntax: '\\n\\n#98\n<rpc-reply message-id="103"\n           xmlns="urn:ietf:params:netconf:base:1.0">\n  <ok/>\n</rpc-reply>',
      pduSemantics: 'Response interpretation:\n• &lt;ok/&gt;: Empty element indicating success (NETCONF standard success indicator)\n• The commit was applied successfully\n• If a rollback occurs, the device reloads the snapshot and the next NETCONF session will see the old config\n• Admin should verify connectivity, then send a confirming &lt;commit/&gt; (without confirmed flag) to make the change permanent',
      processing: 'Admin sees OK — the interface is now disabled in the running config. Admin should:\n1. Verify the change with get-config\n2. Check if connectivity is affected\n3. Send a standard commit (without confirmed) to make the change permanent, cancelling the rollback timer',
    },
  ],
};

export const restconfSequence: SequenceDiagramDef = {
  title: 'RESTCONF CRUD Data Flow',
  participants: [
    { id: 'dev', label: 'API Developer' },
    { id: 'client', label: 'RESTCONF Client' },
    { id: 'server', label: 'RESTCONF Server\n(192.168.1.1:443)' },
    { id: 'yang', label: 'YANG Datastore' },
  ],
  messages: [
    {
      id: 1, from: 'dev', to: 'client', label: 'GET /interfaces', stepNumber: 1,
      direction: 'request', protocol: 'User Input',
      pduSyntax: 'HTTP Request:\nGET /restconf/data/ietf-interfaces:interfaces HTTP/1.1\nHost: 192.168.1.1:443\nAccept: application/yang-data+json\nAuthorization: Basic YWRtaW46cGFzc3dvcmQ=\n\nURI: /restconf/data/ietf-interfaces:interfaces\n- /restconf: API root (RFC 8040)\n- /data: Configuration datastore\n- /ietf-interfaces:interfaces: YANG module:container',
      pduSemantics: 'RESTCONF URI structure:\n• /restconf: Well-known API entry point (RFC 8040)\n• /data: Access to configuration datastore (equivalent to NETCONF &lt;get-config&gt;)\n• /ietf-interfaces: YANG module name (module = ietf-interfaces)\n• :interfaces: Top-level container within the module\n• Accept: application/yang-data+json — REQUIRED header for RESTCONF JSON encoding\n• Authorization: Basic — RESTCONF uses HTTP authentication (Basic or Digest)\n\nEquivalent NETCONF RPC: &lt;get-config&gt;&lt;source&gt;&lt;running/&gt;&lt;/source&gt;&lt;filter type="subtree"&gt;&lt;interfaces/&gt;&lt;/filter&gt;&lt;/get-config&gt;',
      processing: 'RESTCONF client constructs HTTP GET request with proper headers. The URI encodes the YANG model path: module-name:container. The Accept header tells the server to respond with JSON-encoded YANG data.',
    },
    {
      id: 2, from: 'client', to: 'server', label: 'HTTP GET (retrieve)', stepNumber: 2,
      direction: 'request', protocol: 'HTTP/1.1',
      pduSyntax: 'REQUEST:\nGET /restconf/data/ietf-interfaces:interfaces HTTP/1.1\nHost: 192.168.1.1:443\nAccept: application/yang-data+json\nAuthorization: Basic YWRtaW46cGFzc3dvcmQ=\n\n---\nHTTP Request line: METHOD URI HTTP_VERSION\nHeaders:\n- Host: Virtual hosting identifier\n- Accept: Response format negotiation (must be yang-data+json or yang-data+xml)\n- Authorization: RFC 7617 Basic Auth (Base64 of "admin:password")',
      pduSemantics: 'HTTP GET semantics (RFC 7231):\n• Safe: MUST NOT modify state (read-only)\n• Idempotent: N identical requests = same result\n• Cacheable: Response may be cached\n• RESTCONF uses query parameters:\n  - ?content=config|nonconfig|all (default: config)\n  - ?depth=1..unbounded (limit nesting depth)\n  - ?fields=name;type (project only specific leafs)\n  - ?with-defaults=report-all|trim|explicit\n\nStatus codes: 200 OK (success), 400 Bad Request (invalid URI), 404 Not Found (resource unknown)',
      processing: 'Server receives GET request:\n1. Authenticates via HTTP Basic Auth\n2. Parses URI to identify YANG module and resource path\n3. ietf-interfaces:interfaces → top-level container in the YANG datastore\n4. Queries the internal YANG datastore for the interfaces subtree\n5. Serializes as JSON according to RFC 7951 (JSON Encoding of YANG)\n6. Prepares HTTP response with Content-Type: application/yang-data+json',
    },
    {
      id: 3, from: 'server', to: 'yang', label: 'Query YANG datastore', stepNumber: 3,
      direction: 'request', protocol: 'Internal',
      pduSyntax: 'YANG datastore query:\nModule: ietf-interfaces (urn:ietf:params:xml:ns:yang:ietf-interfaces)\nPath: /interfaces\nFilter: (none — full subtree)\n\nYANG tree for ietf-interfaces:\nmodule: ietf-interfaces\n  +--rw interfaces\n     +--rw interface* [name]\n        +--rw name                        string\n        +--rw description?                string\n        +--rw type                        identityref\n        +--rw enabled?                    boolean\n        +--rw link-up-down-trap-enable?   enumeration\n        +--rw ipv4!\n           +--rw address* [ip]\n              +--rw ip      inet:ipv4-address\n              +--rw netmask? inet:ipv4-prefix',
      pduSemantics: 'YANG datastore model:\n• interfaces: Top-level container (holds all interfaces)\n• interface [name]: List keyed by interface name (YANG list with key "name")\n  - type: IdentityRef referencing iana-if-type\n  - enabled: Boolean (true = admin up, false = admin down)\n  - ipv4: Container (presence container — created when IPv4 is configured)\n  - address [ip]: List of IPv4 addresses keyed by IP\n\nRESTCONF maps this to JSON:\n{\n  "ietf-interfaces:interfaces": {\n    "interface": [\n      { "name": "GigabitEthernet0/0", "type": "ethernetCsmacd", "enabled": true, ... }\n    ]\n  }\n}',
      processing: 'Server retrieves the requested YANG data subtree from its operational datastore (which mirrors the device\'s running config). The YANG schema is used to validate the structure and serialize to JSON.',
    },
    {
      id: 4, from: 'yang', to: 'server', label: 'Return JSON data', stepNumber: 4,
      direction: 'response', protocol: 'Internal',
      pduSyntax: 'YANG-encoded JSON (RFC 7951):\n{\n  "ietf-interfaces:interfaces": {\n    "interface": [\n      {\n        "name": "GigabitEthernet0/0",\n        "type": "iana-if-type:ethernetCsmacd",\n        "enabled": true,\n        "ipv4": {\n          "address": [\n            { "ip": "10.0.0.1", "netmask": "255.255.255.0" }\n          ]\n        }\n      },\n      {\n        "name": "GigabitEthernet0/1",\n        "type": "iana-if-type:ethernetCsmacd",\n        "enabled": false\n      }\n    ]\n  }\n}',
      pduSemantics: 'JSON→YANG mapping rules:\n• Module namespace: \n  - "ietf-interfaces:interfaces" → module-name:container\n  - Module name prefix REQUIRED for top-level, OPTIONAL for nested (recommended)\n• Data types:\n  - boolean: true/false (not "true"/"false" strings)\n  - identityref: "prefix:identity-name" (string with namespace prefix)\n  - uint32: JSON number\n  - string: JSON string\n• List entries: JSON array of objects\n• Container: JSON object\n• Leaf presence: "null" if not configured, omitted if not present\n\nRESTCONF does NOT use XML — JSON is preferred for web APIs',
      processing: 'Server formats the HTTP response with the JSON body, status code, and ETag header for caching and concurrency control.',
    },
    {
      id: 5, from: 'server', to: 'client', label: 'HTTP 200 + JSON body', stepNumber: 5,
      direction: 'response', protocol: 'HTTP/1.1',
      pduSyntax: 'HTTP/1.1 200 OK\nDate: Mon, 15 Jul 2024 10:23:01 GMT\nContent-Type: application/yang-data+json\nETag: "a3e1b2c4"\nLast-Modified: Mon, 15 Jul 2024 10:23:01 GMT\nContent-Length: 312\n\n{\n  "ietf-interfaces:interfaces": {\n    "interface": [\n      {\n        "name": "GigabitEthernet0/0",\n        "type": "iana-if-type:ethernetCsmacd",\n        "enabled": true,\n        "description": "Uplink to Core",\n        "ipv4": {\n          "address": [\n            { "ip": "10.0.0.1", "netmask": "255.255.255.0" }\n          ]\n        }\n      }\n    ]\n  }\n}',
      pduSemantics: 'HTTP response semantics:\n• 200 OK: Standard success for GET\n• Content-Type: application/yang-data+json — RESTCONF-specific media type\n• ETag: Entity tag for HTTP cache validation and concurrency control (If-Match / If-None-Match)\n• Last-Modified: Timestamp of last modification — used for conditional GETs\n\nConditional requests:\n  - GET with If-None-Match: returns 304 Not Modified if unchanged\n  - PUT with If-Match: ensures you\'re updating the version you read (prevents lost updates)\n\nThis implements RESTful concurrency — RESTCONF uses HTTP native mechanisms',
      processing: 'Client receives 200 OK:\n1. Parses JSON body using application/yang-data+json handler\n2. Validates JSON structure against YANG schema\n3. Displays formatted response to developer\n4. Caches ETag for subsequent conditional requests\n5. If 4XX status: parse error body per RFC 8040 (error-tag, error-message, error-path)',
    },
  ],
};

export const faultSequence: SequenceDiagramDef = {
  title: 'Fault Detection & Root Cause Analysis',
  participants: [
    { id: 'device', label: 'Network Device\n(Core-R1)' },
    { id: 'agent', label: 'SNMP Agent' },
    { id: 'nms', label: 'NMS / Fault\nManager' },
    { id: 'engine', label: 'Correlation\nEngine' },
    { id: 'noc', label: 'NOC Engineer' },
  ],
  messages: [
    {
      id: 1, from: 'device', to: 'agent', label: 'Interface Gi0/0/0 link down', stepNumber: 1,
      direction: 'notification', protocol: 'Hardware Event',
      pduSyntax: 'Hardware Interrupt: Link DOWN detected\nPhysical layer signal: LOSS OF LIGHT (Rx power: -35dBm, threshold: -25dBm)\nInterface: GigabitEthernet0/0/0\nPHY status register: 0x0000 (Link NOT OK, Autoneg FAIL)\n\nOS kernel notification:\n  net_device_watchdog: NETDEV WATCHDOG: eth0: transmit queue 0 timed out\n  e1000e: eth0 NIC Link is Down\n\nDriver state: ifAdminStatus=up(1), ifOperStatus=down(2)',
      pduSemantics: 'Physical layer event:\n• Loss of light (LOL): Optical signal power dropped below receiver threshold\n• Interface Gi0/0/0: Physical port on Core-R1\n• The PHY (Physical Layer Transceiver) detects loss of carrier\n• OS kernel generates a hardware interrupt → netif_carrier_off() called\n• Driver updates ifOperStatus from up(1) to down(2)\n• ifAdminStatus remains up(1) — this is a physical failure, not administrative shutdown\n\nKey distinction: ifAdminStatus = what SHOULD be | ifOperStatus = what IS',
      processing: 'The device hardware detects carrier loss. The NIC driver transitions the interface to oper-down state. The kernel routing table is updated — all routes via Gi0/0/0 are withdrawn. The SNMP sub-agent detects the ifOperStatus transition via kernel notification.',
    },
    {
      id: 2, from: 'agent', to: 'nms', label: 'linkDown Trap (SNMPv2)', stepNumber: 2,
      direction: 'notification', protocol: 'SNMPv2c Trap',
      pduSyntax: 'SNMPv2-Trap PDU:\n- sysUpTime.0 = 4129857 timeticks\n- snmpTrapOID.0 = linkDown (1.3.6.1.6.3.1.1.5.3)\n- ifIndex.3 = 3\n- ifAdminStatus.3 = up(1)\n- ifOperStatus.3 = down(2)\n\nSent from 192.168.1.1:161 → NMS:162 (UDP)\n\nTransport: unreliable (UDP, best-effort)',
      pduSemantics: 'Trap analysis:\n• Immediate notification sent within milliseconds of link failure\n• No polling required = zero detection latency\n• sysUpTime: 4129857 ticks (~11.5 hours) — device uptime at trap generation\n• snmpTrapOID = linkDown: Standard trap type, OID .1.3.6.1.6.3.1.1.5.3\n• ifIndex=3: The interface index (3 = third interface on device)\n• ifAdminStatus=up: Interface was enabled administratively — this is a physical failure\n• ifOperStatus=down: Interface is actually down (confirmed by hardware)\n\nv2c traps are unreliable (UDP). For critical infrastructure, use SNMPv3 with informs (confirmed notification)',
      processing: 'NMS receives trap on port 162:\n1. Creates alarm record: CRITICAL, source=Core-R1, ifIndex=3\n2. Cross-references ifIndex=3 against LLDP/CDP neighbors → identifies connected device\n3. Triggers correlation rule: "linkDown on core router" → start incident INC-2024-001\n4. Updates topology map: Core-R1 Gi0/0/0 turns RED\n5. Polls the device sysUpTime to verify device is still up (distinguishes link failure vs device crash)',
    },
    {
      id: 3, from: 'nms', to: 'engine', label: 'Correlate with topology', stepNumber: 3,
      direction: 'request', protocol: 'Topology DB',
      pduSyntax: 'Correlation Query:\n  alarm: linkDown Core-R1 Gi0/0/0\n  timestamp: 10:23:01.000\n\n→ Find downstream devices:\n  LLDP neighbor via Gi0/0/0 = Core-R2 Gi0/0/1\n\n→ Check Core-R2 status:\n  - sysUpTime response: YES (device alive)\n  - ifOperStatus Gi0/0/1: down(2)\n  - ifAdminStatus Gi0/0/1: up(1)\n  - BGP neighbor 10.0.0.2: DOWN\n  - OSPF adjacency 10.0.0.2: DOWN\n\n→ Create incident cluster:\n  INC-2024-001: 7 correlated alarms\n  ├── Core-R1: ifOperStatus down (10:23:01)  ← ROOT\n  ├── Core-R1: OSPF adj lost (10:23:03)\n  ├── Core-R2: BGP session down (10:23:05)\n  ├── Edge-R2: BGP session down (10:23:06)\n  ├── Dist-S1: Latency spike (10:23:08)\n  ├── Acc-S2: CRC errors (10:23:12)\n  └── FW-Main: CPU > 80% (10:23:15)',
      pduSemantics: 'Correlation algorithm:\n• Time window: Events within ±5 minutes are correlated\n• Topological proximity: Events within 3 hops are likely related\n• Clockwise causation: Earlier events are potential root causes\n• The FIRST event (Core-R1 linkDown at 10:23:01) is the most likely root cause\n• All downstream symptoms (OSPF loss, BGP loss, latency, CRC) are DERIVED alarms\n\nCorrelation reduces 7 individual alarms into 1 incident for faster diagnosis',
      processing: 'Correlation engine groups alarms into incidents. The topological analysis reveals that Core-R1 Gi0/0/0 connects to Core-R2. All downstream alarms are consequences of this single failure. The engine assigns root-cause confidence score: Core-R1 linkDown = 97% probability.',
    },
    {
      id: 4, from: 'engine', to: 'noc', label: 'Root cause: Fiber cut', stepNumber: 4,
      direction: 'response', protocol: 'Analysis Report',
      pduSyntax: 'ROOT CAUSE ANALYSIS REPORT\n═══════════════════════════\nIncident ID: INC-2024-001\nStatus: OPEN\nSeverity: CRITICAL\n\nRoot Cause:\n  Device: Core-R1 (192.168.1.1)\n  Component: GigabitEthernet0/0/0\n  Failure: Fiber Cut / Physical Layer Break\n  Confidence: 97%\n\nCascade Chain:\n  [10:23:01] Fiber Cut ← ROOT\n  → [10:23:03] OSPF adjacency lost (Core-R1→Core-R2)\n  → [10:23:05] BGP session down (Edge-R2)\n  → [10:23:06] BGP session down (Peer AS 65002)\n  → [10:23:08] Latency spike on alternative path\n  → [10:23:12] CRC errors on backup link\n  → [10:23:15] CPU overload on firewall\n\nImpact:\n  • 12 sites unreachable\n  • ~2000 users affected\n  • 15 BGP prefixes withdrawn\n\nRecommended Action:\n  Activate backup path via Core-R2 → Edge-R2',
      pduSemantics: 'Root cause report fields:\n• Confidence (97%): Statistical probability based on:\n  - Temporal: first event in the timeline\n  - Topological: root device is at the network core\n  - Causal: all other alarms are known consequences\n• Cascade chain: Shows how one failure propagates through protocols\n  - Physical (fiber cut) → Data Link (linkDown) → Routing (OSPF/BGP) → Application (latency)\n  - Each step takes time — visible in the timestamps\n• Impact assessment: Automatically calculated from topology and subscriber database',
      processing: 'NOC engineer receives the root cause analysis. Now can take targeted action:\n1. Dispatch field crew to inspect fiber path between Core-R1 and Core-R2\n2. Activate backup link (if available) to restore connectivity\n3. Suppress derived alarms (OSPF, BGP) to reduce noise — only fiber cut needs action\n4. Update incident ticket with root cause findings\n5. Begin MTTR timer (Mean Time To Repair)',
    },
  ],
};

export const sdnSequence: SequenceDiagramDef = {
  title: 'SDN OpenFlow Data Flow',
  participants: [
    { id: 'admin', label: 'SDN Admin' },
    { id: 'ctrl', label: 'SDN Controller' },
    { id: 's1', label: 'Switch S1' },
    { id: 's3', label: 'Switch S3' },
    { id: 'h1', label: 'Host H1\n(VLAN 100)' },
  ],
  messages: [
    {
      id: 1, from: 'admin', to: 'ctrl', label: 'Install flow rule', stepNumber: 1,
      direction: 'request', protocol: 'REST API',
      pduSyntax: 'REST API call to controller:\nPOST /stats/flowentry/add HTTP/1.1\n{\n  "dpid": "0000000000000001",\n  "priority": 100,\n  "match": {\n    "dl_vlan": 100,\n    "nw_dst": "10.10.10.50"\n  },\n  "actions": [\n    { "type": "OUTPUT", "port": 3 }\n  ]\n}\n\nMatch fields:\n- dl_vlan=100 (VLAN 100 = exam traffic)\n- nw_dst=10.10.10.50 (Exam server IP)',
      pduSemantics: 'REST API to SDN controller:\n• dpid: Datapath ID — unique switch identifier (MAC-based)\n• priority=100: Higher priority than default flow (typically 0-10)\n• match: OpenFlow match structure (OXM — OpenFlow Extensible Match)\n  - dl_vlan: VLAN ID match (802.1Q tag)\n  - nw_dst: Destination IPv4 address\n• actions: Instruction list (apply-actions, write-actions, goto-table, meter, group)\n  - OUTPUT:3: Forward packet out of physical port 3\n\nThe controller will translate this REST API call into an OpenFlow OFPT_FLOW_MOD message',
      processing: 'SDN Controller receives REST API request. Validates the flow parameters (DPID exists, port 3 is valid, VLAN is configured). Constructs an OpenFlow OFPT_FLOW_MOD message with the match-action rules serialized in OXM format.',
    },
    {
      id: 2, from: 'ctrl', to: 's1', label: 'OFPT_FLOW_MOD (add)', stepNumber: 2,
      direction: 'request', protocol: 'OpenFlow 1.5',
      pduSyntax: 'OpenFlow 1.5 FLOW_MOD message (TCP):\nVersion: 5 (OF 1.5)\nType: 14 (OFPT_FLOW_MOD)\nLength: 96 bytes\nXID: 0x3a1f5c8d\n\nHeader:\n  cookie: 0x0000000000000001\n  cookie_mask: 0\n  table_id: 0\n  command: OFPFC_ADD (0)\n  idle_timeout: 0 (permanent)\n  hard_timeout: 0 (permanent)\n  priority: 100\n  buffer_id: 0xFFFFFFFF\n  out_port: ANY\n  out_group: ANY\n  flags: 0x0001 (SEND_FLOW_REM)\n  importance: 0\n\nMatch (OXM):\n  OXM_OF_VLAN_VID: 100\n    Type: 0x8000 (with mask) / Value: 0x0064 (100)\n    Length: 4 bytes\n  OXM_OF_IPV4_DST: 10.10.10.50\n    Type: 0x8000 / Value: 0x0a0a0a32 (10.10.10.50)\n    Length: 4 bytes\n\nInstructions:\n  Apply-Actions [OUTPUT:3]\n    Action type: 0 (OFPAT_OUTPUT)\n    Port: 3\n    Max length: 0 (send full packet)',
      pduSemantics: 'OFPT_FLOW_MOD field breakdown:\n• Version (5): OpenFlow 1.5 protocol version identifier\n• Type (14): OFPT_FLOW_MOD — add/delete/modify flow table entry\n• XID: Transaction ID — switch uses this in OFPT_BARRIER_REPLY\n• command=OFPFC_ADD: Add new flow entry (other values: MODIFY, DELETE)\n• priority=100: Flow matching priority — higher = matched first\n• idle_timeout=0: Flow never expires due to inactivity\n• hard_timeout=0: Flow never expires due to time\n• buffer_id=0xFFFFFFFF: No packet buffer (metadata-only modification)\n• OXM match: OpenFlow Extensible Match — TLV-encoded match fields\n  - VLAN VID 100: Matches VLAN-tagged packets with ID 100\n  - IPv4 DST 10.10.10.50: Matches destination IP address (exam server)\n• Apply-Actions: Immediately execute the action list\n  - OUTPUT:3: Forward matched packets to physical port 3',
      processing: 'Switch S1 receives FLOW_MOD:\n1. Validates message format and XID\n2. Installs flow entry in flow table 0\n3. Flow entry format: [match fields] → [instructions] → [counters]\n4. Counter initialized: packet_count=0, byte_count=0, duration_sec=0\n5. Flow is now ACTIVE — subsequent matching packets will be forwarded via port 3\n6. Switch sends no explicit acknowledgment (unless OFPBFC_ADD_WITH_BARRIER flag is set)',
    },
    {
      id: 3, from: 'h1', to: 's1', label: 'Packet arrives (VLAN 100 → S3)', stepNumber: 3,
      direction: 'notification', protocol: 'Ethernet Frame',
      pduSyntax: 'Ingress packet on Switch S1, Port 1:\n\nEthernet Frame (64 bytes):\n  MAC DA: 00:11:22:33:44:55 (Exam Server)\n  MAC SA: 00:AA:BB:CC:DD:EE (Host H1)\n  EtherType: 0x8100 (802.1Q VLAN)\n    VLAN ID: 100 (Exam Traffic)\n    Priority: 5 (High — EF PHB)\n  EtherType: 0x0800 (IPv4)\n  IP Header:\n    Version: 4, IHL: 5\n    DSCP: 46 (Expedited Forwarding)\n    Total Length: 64\n    SRC: 10.10.10.10\n    DST: 10.10.10.50  ← MATCH!\n\nIngress port: 1 (connected to H1)',
      pduSemantics: 'Packet arriving at switch:\n• VLAN 100: Isolated broadcast domain for exam traffic\n• DSCP 46 (EF): Expedited Forwarding — low latency, low jitter\n• DST IP 10.10.10.50: Exam server — matches the flow rule\n• The switch performs flow table lookup:\n  1. Hash packet fields (VLAN, IP DA) → lookup in flow table\n  2. Match on the installed flow (priority 100)\n  3. Execute actions: OUTPUT:3 (forward to port 3 toward S3)\n  4. Update counters: packet_count++, byte_count+=64\n\nIf NO match: Packet is sent to controller as OFPT_PACKET_IN',
      processing: 'Switch S1 performs hardware flow lookup:\n1. TCAM (Ternary Content Addressable Memory) search — O(1) lookup\n2. Match found (VLAN=100, DST=10.10.10.50 matches flow entry)\n3. Apply-Actions instruction executed: forward to port 3\n4. Packet emerges from port 3 onto the link toward S3\n5. Flow counters updated\n6. Processing latency: ~1-5 microseconds (hardware switching)',
    },
    {
      id: 4, from: 's1', to: 's3', label: 'Forwarded via port 3', stepNumber: 4,
      direction: 'request', protocol: 'Data Plane',
      pduSyntax: 'Transmitted frame on Port 3 (S1→S3 link):\n\nEthernet Frame (64 bytes):\n  MAC DA: 00:11:22:33:44:55 (Exam Server @ S3)\n  MAC SA: 00:AA:BB:CC:DD:EE (Host H1)\n  VLAN: 100, PCP: 5\n  IP: 10.10.10.10 → 10.10.10.50\n  Payload: TCP SYN (exam session initiation)\n\nSwitch S3 receives on its ingress port:\n1. Flow table lookup on S3\n2. Default table-miss flow → send to controller\n3. OR: Flow installed on S3 → direct forward to H3 port',
      pduSemantics: 'Data plane forwarding:\n• The packet traverses the network entirely in hardware\n• No controller involvement for this packet (flow was pre-installed)\n• Switch S3 must also have a flow for the exam traffic (or learn via PACKET_IN)\n\nKey SDN advantage: Flow installation is proactive (push flows before traffic arrives)\nvs. reactive (first packet triggers PACKET_IN → controller installs flow).\nProactive = zero first-packet latency; Reactive = higher control plane load',
      processing: 'Packet successfully forwarded from H1 to Exam Server (H3) via S1 and S3. The SDN flow rule ensures the shortest path is used. If multiple flows match the same packet, the highest priority flow wins. If link S1↔S3 fails, the controller must update flows to use the backup path via S2.',
    },
    {
      id: 5, from: 's1', to: 'ctrl', label: 'OFPT_PORT_STATUS (link down)', stepNumber: 5,
      direction: 'notification', protocol: 'OpenFlow 1.5',
      pduSyntax: 'OpenFlow 1.5 PORT_STATUS message:\nVersion: 5\nType: 12 (OFPT_PORT_STATUS)\nLength: 64 bytes\nXID: 0x0000000b\n\nReason: OFPPR_MODIFY (0) — port state changed\n\nPort description:\n  Port: 3\n  HW addr: 00:DE:AD:BE:EF:03\n  Name: "Gi0/0/3"\n  Config: 0 (PORT_DOWN? No)\n  State: 0x00000002 (LINK_DOWN)\n    Bit 0: LINK_DOWN (1 = down, 0 = up)\n  Curr: 0 (no current speed/duplex — link is down)\n  Advertised: 0x0000 (nothing advertised)\n  Supported: 0x0060 (1Gbps-FD, 10Gbps-FD)\n  Peer: 0x0000\n  Curr Speed: 0 bps\n  Max Speed: 10 Gbps',
      pduSemantics: 'PORT_STATUS notification:\n• Reason=OFPPR_MODIFY: Port configuration or state changed\n  - OFPPR_ADD: New port added\n  - OFPPR_DELETE: Port removed\n  - OFPPR_MODIFY: Port state changed (most common for link flapping)\n• State bit 0 (LINK_DOWN): Hardware has detected link loss\n• The switch sends this to controller immediately\n• Config field: OFPPC_PORT_DOWN if admin disabled, 0 if physical failure\n\nThis is ASYNCHRONOUS — switch sends without controller polling',
      processing: 'Controller receives PORT_STATUS:\n1. Updates network topology graph: mark link S1-S3 as DOWN\n2. Recomputes paths affected by the failure\n3. For each affected flow:\n   a. Identify flows using port 3 on S1\n   b. Recompute alternative paths (via S2)\n   c. Install MODIFY flows on affected switches\n   d. Remove old flows on S1\n4. Updates flow statistics display\n5. Logs failover event with timestamp for SLA tracking (<50ms convergence target)',
    },
    {
      id: 6, from: 'ctrl', to: 's1', label: 'OFPT_FLOW_MOD (reroute via S2)', stepNumber: 6,
      direction: 'request', protocol: 'OpenFlow 1.5',
      pduSyntax: 'New FLOW_MOD to reroute:\nType: 14 (OFPT_FLOW_MOD)\nCommand: OFPFC_MODIFY (1) — modify existing flow\n\nMatch: (same) VLAN=100, DST=10.10.10.50\nInstructions → NEW ACTION:\n  Apply-Actions [OUTPUT:2]\n  (was OUTPUT:3, now OUTPUT:2 — different port!)\n\nPriority: 100 (same)\n\nAlso install on intermediate switches as needed:\n- S1: VLAN=100, DST=10.10.10.50 → OUTPUT:2 (to S2)\n- S2: VLAN=100, DST=10.10.10.50 → OUTPUT:3 (to S3)',
      pduSemantics: 'Flow modification for fast reroute:\n• OFPFC_MODIFY: Updates existing flow entry (same match → new actions)\n• The switch replaces the action set atomically\n• New path: H1 → S1 port 2 → S2 → S3 → H3 (Exam Server)\n• No disruption to ongoing flows:\n  - Existing packets in flight on the old path complete (they\'re already sent)\n  - New packets immediately use the new path\n  - TCP sessions survive (IP addresses unchanged)\n\nConvergence time: <50ms (typically 10-30ms) vs 30-50s for traditional STP convergence',
      processing: 'Controller completes failover. The backup path via S2 is now active. Key achievements:\n- Exam traffic continues uninterrupted\n- Zero packet loss (if failover is hitless)\n- Controller logs: "Failover complete — 42ms convergence"\n- Exam server still reachable at 10.10.10.50\n- The SDN controller maintains a consistent network-wide view at all times',
    },
  ],
};

export const observabilitySequence: SequenceDiagramDef = {
  title: 'Prometheus Telemetry Scrape & Alert Flow',
  participants: [
    { id: 'target', label: 'Exporter\n(Core-R1)' },
    { id: 'prom', label: 'Prometheus\nServer' },
    { id: 'graf', label: 'Grafana\nDashboard' },
    { id: 'alert', label: 'Alertmanager' },
    { id: 'sre', label: 'SRE' },
  ],
  messages: [
    {
      id: 1, from: 'prom', to: 'target', label: 'HTTP GET /metrics', stepNumber: 1,
      direction: 'request', protocol: 'HTTP',
      pduSyntax: 'Prometheus scrape request:\nGET /metrics HTTP/1.1\nHost: 192.168.1.1:9116\nAccept: text/plain; version=0.0.4\n\nTarget: snmp_exporter on Core-R1\nPort: 9116 (default snmp_exporter)\n\n--- Prometheus config ---\nscrape_configs:\n  - job_name: "network_devices"\n    scrape_interval: 15s\n    static_configs:\n      - targets:\n        - "192.168.1.1:9116"  # Core-R1\n',
      pduSemantics: 'Prometheus pull-based monitoring:\n• Prometheus SCRAPES targets on a schedule (15s interval here)\n• GET /metrics: Standard Prometheus exposition format endpoint\n• Accept: text/plain; version=0.0.4 — Prometheus text-based metrics format\n• snmp_exporter: A Prometheus exporter that translates SNMP OIDs into Prometheus metrics\n  - The exporter handles SNMP GET to the device\n  - Exposes the result as Prometheus metrics at /metrics\n\nThis is fundamentally different from SNMP polling:\n- Prometheus pulls → central timing control\n- SNMP agent pushes traps → event-driven',
      processing: 'Prometheus sends HTTP GET to the snmp_exporter /metrics endpoint. The exporter then queries the device via SNMP, caches the results, and returns them in Prometheus text format. This happens every 15s.',
    },
    {
      id: 2, from: 'target', to: 'prom', label: 'Prometheus metrics text', stepNumber: 2,
      direction: 'response', protocol: 'Prometheus Format',
      pduSyntax: 'HTTP/1.1 200 OK\nContent-Type: text/plain; version=0.0.4\n\n# HELP node_network_receive_bytes_total Network device receive bytes\n# TYPE node_network_receive_bytes_total counter\nnode_network_receive_bytes_total{device="Core-R1",interface="Gi0/0/0",type="ethernetCsmacd"} 5284710239 1721047381\n\n# HELP snmp_scrape_duration_seconds Duration of SNMP scrape\n# TYPE snmp_scrape_duration_seconds gauge\nsnmp_scrape_duration_seconds{device="Core-R1"} 0.387\n\n# HELP ifAdminStatus Admin status of interface (1=up, 2=down)\n# TYPE ifAdminStatus gauge\nifAdminStatus{device="Core-R1",ifIndex="1"} 1\n\n# HELP ifOperStatus Operational status (1=up, 2=down)\n# TYPE ifOperStatus gauge\nifOperStatus{device="Core-R1",ifIndex="1"} 1',
      pduSemantics: 'Prometheus exposition format:\n• # HELP: Human-readable description (metadata)\n• # TYPE: Metric type — counter (cumulative, only increases) or gauge (up/down)\n• Metric line format:\n  <metric_name>{<label_name>="<label_value>",...} <value> <timestamp>\n  \n  - node_network_receive_bytes_total: Counter metric (total bytes received)\n    Labels: device=Core-R1, interface=Gi0/0/0, type=ethernetCsmacd\n    Value: 5284710239 bytes (~5 GB)\n    Timestamp: 1721047381 (Unix epoch)\n  \n  - snmp_scrape_duration_seconds: Gauge — how long the SNMP scrape took\n  - ifAdminStatus/ifOperStatus: Gauges — 1=up, 2=down\n\nLabels create dimensionality — a single metric name can have many label combinations',
      processing: 'Prometheus receives and processes metrics:\n1. Parses text format line by line\n2. Applies relabel_configs (add, drop, modify labels)\n3. Stores in TSDB (Time Series Database) with index\n4. The metric is now queryable via PromQL\n5. Scrape duration 0.387s indicates the SNMP GET took ~387ms total\n6. If scrape fails: up{job="network_devices",instance="192.168.1.1:9116"} = 0',
    },
    {
      id: 3, from: 'graf', to: 'prom', label: 'PromQL query for dashboard', stepNumber: 3,
      direction: 'request', protocol: 'PromQL/HTTP',
      pduSyntax: 'Grafana dashboard query to Prometheus:\nGET /api/v1/query_range?query=\n  rate(node_network_receive_bytes_total{device="Core-R1"}[5m])\n&start=1721046000&end=1721047381&step=15s HTTP/1.1\n\nPromQL breakdown:\n  rate() = per-second rate of increase over the time range\n  node_network_receive_bytes_total = counter metric\n  {device="Core-R1"} = label selector\n  [5m] = lookback window for rate calculation\n\nResult: throughput in bytes/second over time',
      pduSemantics: 'PromQL (Prometheus Query Language):\n• rate(metric[5m]): Calculates per-second average rate of increase\n  - counter must be rate-converted to be meaningful (otherwise it\'s just cumulative)\n  - [5m] window smooths out spikes but adds 5-min latency to detection\n• {device="Core-R1"}: Label matcher — only return time series for Core-R1\n• Query returns a range vector: multiple (timestamp, value) pairs\n\nOther common PromQL functions:\n  - avg_over_time(metric[5m]): Average value over window\n  - histogram_quantile(0.95, ...): P95 latency calculation\n  - delta(metric[5m]): Difference between start and end\n  - predict_linear(metric[5h], 3600): Predict value 1 hour ahead',
      processing: 'Prometheus executes the PromQL query against its TSDB:\n1. Finds all time series matching node_network_receive_bytes_total{device="Core-R1"}\n2. For each series, extracts raw samples in the [5m] window\n3. Applies rate() function: (last_value - first_value) / time_difference_seconds\n4. Returns as JSON array of [timestamp, value] pairs\n5. Grafana receives the data and renders as a time-series panel',
    },
    {
      id: 4, from: 'prom', to: 'graf', label: 'Time-series data (JSON)', stepNumber: 4,
      direction: 'response', protocol: 'HTTP/JSON',
      pduSyntax: 'Prometheus HTTP API response:\n{\n  "status": "success",\n  "data": {\n    "resultType": "matrix",\n    "result": [\n      {\n        "metric": {\n          "__name__": "node_network_receive_bytes_total",\n          "device": "Core-R1",\n          "interface": "Gi0/0/0"\n        },\n        "values": [\n          [1721046000, "1420.5"],\n          [1721046015, "1398.2"],\n          [1721046030, "1455.7"],\n          ...\n        ]\n      }\n    ]\n  }\n}\n\nResult = throughput in bytes/sec for Core-R1 Gi0/0/0\nEach value pair = [timestamp (epoch seconds), value (string number)]',
      pduSemantics: 'API response semantics:\n• resultType: matrix (range query), vector (instant query), scalar, string\n• metric: The label set identifying this unique time series\n• values: Array of [timestamp, value] pairs at 15s intervals\n  - 1721046000: Unix timestamp (2024-07-15T10:20:00Z)\n  - "1420.5": ~1.4 KB/s receive throughput\n\nGrafana processes this into the panel:\n- X-axis: timestamps (converted to human-readable)\n- Y-axis: bytes/second (unit-scaled to MB/s or Gb/s)\n- Line chart with threshold coloring',
      processing: 'Grafana renders the Network Health dashboard. SRE can see:\n- Throughput trends\n- Error rates\n- Latency distributions\n- Device uptime\nThe dashboard auto-refreshes every 15s (matching Prometheus scrape interval).',
    },
    {
      id: 5, from: 'prom', to: 'alert', label: 'Alert rule evaluation fire', stepNumber: 5,
      direction: 'notification', protocol: 'PromQL',
      pduSyntax: 'Prometheus alert rule evaluation:\n\nRule: \n  alert: HighErrorRate\n  expr: |\n    rate(node_network_receive_errors_total{device="App-B"}[5m])\n    /\n    rate(node_network_receive_bytes_total{device="App-B"}[5m])\n    > 0.01\n  for: 5m\n  labels:\n    severity: critical\n  annotations:\n    summary: "Error rate > 1% for App-B"\n\nEvaluation: \n  Current error fraction: 2.3%\n  Threshold: 1%\n  Duration: 8 minutes (alarm for condition: 5m)\n  → FIRE alert!\n\nAlert sent to Alertmanager via HTTP POST:\n{\n  "labels": { "alertname": "HighErrorRate", "severity": "critical" },\n  "annotations": { "summary": "Error rate > 1% for App-B" },\n  "startsAt": "2024-07-15T10:20:00Z",\n  "status": "firing"\n}',
      pduSemantics: 'Alert rule evaluation:\n• expr: PromQL expression that returns a result when the condition is true\n  - error_rate = (error_bytes_rate / total_bytes_rate) * 100\n  - > 0.01 means > 1% error rate\n• for: 5m — the condition must persist for 5 minutes before firing\n  - Prevents alert fatigue from transient spikes\n  - During this period, the alert state is "PENDING"\n• After 5m if still true → state becomes "FIRING"\n• Alertmanager receives the firing alert and handles notification routing\n\nAlert states lifecycle: INACTIVE → PENDING → FIRING → RESOLVED',
      processing: 'Alertmanager receives the firing alert. Based on routing configuration:\n1. Matches route: severity=critical → route to pagerduty\n2. Groups alerts by: alertname (prevents duplicate notifications)\n3. Sends notification to PagerDuty\n4. PagerDuty pages the on-call SRE\n5. If no acknowledgment within 5 minutes, escalates to secondary',
    },
    {
      id: 6, from: 'alert', to: 'sre', label: 'PagerDuty notification', stepNumber: 6,
      direction: 'notification', protocol: 'PagerDuty',
      pduSyntax: 'PAGERDUTY INCIDENT\n══════════════════\nTitle: [CRITICAL] HighErrorRate - App-B\nService: Production Backend\n\nDetails:\n  Alert: HighErrorRate\n  Severity: critical\n  Device: App-B\n  Error rate: 2.3% (threshold: 1%)\n  Duration: 8m\n\nLinks:\n  - Grafana Dashboard: /d/net-health\n  - Runbook: /docs/error-rate-runbook\n\nAssigned to: SRE Primary (you)\nPolicy: Escalate after 5 min no ack\n\nAction required: Investigate error rate spike on App-B',
      pduSemantics: 'Incident response workflow:\n• SRE receives the page (mobile push, SMS, or phone call)\n• The notification includes:\n  - Severity: critical (P1 — highest priority)\n  - Summary: What\'s wrong and where\n  - Links: Dashboards and runbooks for faster diagnosis\n  - Escalation policy: If no acknowledgment within 5 min, escalate\n\nSRE acknowledges the incident and begins diagnosis:\n1. Opens Grafana dashboard for App-B\n2. Checks logs in Loki/Elasticsearch\n3. Traces recent requests in Jaeger\n4. Identifies root cause: database connection pool exhaustion\n5. Takes remediation action: restart connection pool or scale up',
      processing: 'SRE acknowledges and investigates. The observability pipeline (Prometheus → Alertmanager → PagerDuty) has successfully detected, alerted, and notified the right person within minutes of the error rate threshold breach. This is the complete observability feedback loop.',
    },
  ],
};

export const onapSequence: SequenceDiagramDef = {
  title: 'ONAP Service Orchestration Data Flow',
  participants: [
    { id: 'arch', label: 'Orch Architect' },
    { id: 'sdc', label: 'SDC (Design)' },
    { id: 'so', label: 'SO (Orch)' },
    { id: 'aai', label: 'A&AI (Inv)' },
    { id: 'vim', label: 'Multi-VIM\n(OpenStack)' },
  ],
  messages: [
    {
      id: 1, from: 'arch', to: 'sdc', label: 'Design network service (vFirewall+vRouter)', stepNumber: 1,
      direction: 'request', protocol: 'SDC GUI',
      pduSyntax: 'SDC Service Design:\n  Service name: 5G-EMBB-SLICE-V1\n  Category: 5G\n  ECOMP generated ID: b3c8a2e1-f4d7-4a1b-9e2c-8d6f5a4b3c2d\n\n  VF Modules:\n  ├── vFirewall (VF-001)\n  │   ├── VFC: vFirewall::VNF\n  │   ├── Heat template: vfw_heat.yaml\n  │   ├── Properties:\n  │   │   ├── vnf_name: "vFirewall"\n  │   │   ├── vnf_type: "Firewall"\n  │   │   ├── max_instances: 4\n  │   │   └── min_instances: 1\n  │   └── Networks:\n  │       ├── protected (management)\n  │       └── internal (data)\n  │\n  └── vRouter (VF-002)\n      ├── VFC: vRouter::VNF\n      ├── Heat template: vrouter_heat.yaml\n      └── Properties:\n          ├── vnf_name: "vRouter"\n          ├── vnf_type: "Router"\n          └── routing_protocols: ["OSPF","BGP"]',
      pduSemantics: 'SDC (Service Design & Creation) artifact:\n• Service: A deployable network service composed of VNFs and networks\n• VF Module: Virtual Function — a deployable unit (VM + configuration)\n• VFC: Virtual Function Component — the actual VNF image\n• Heat template: OpenStack HOT (Heat Orchestration Template) for VNF deployment\n• Properties: Deployment parameters that will be bound at instantiation time\n• Networks: Virtual networks connecting VNF components\n\nSDC produces a service model that SO (Service Orchestrator) can interpret',
      processing: 'SDC validates the service model: checks all required fields, verifies Heat templates are valid, assigns UUIDs, and stores the model in the SDC catalog. The service model is now ready for distribution to SO and A&AI.',
    },
    {
      id: 2, from: 'sdc', to: 'so', label: 'Distribute model to SO', stepNumber: 2,
      direction: 'request', protocol: 'SDC→SO API',
      pduSyntax: 'SDC Model Distribution (TOSCA CSAR):\n<?xml version="1.0" encoding="UTF-8"?>\n<ServiceModel>\n  <service-uuid>b3c8a2e1-f4d7-4a1b-9e2c-8d6f5a4b3c2d</service-uuid>\n  <service-name>5G-EMBB-SLICE-V1</service-name>\n  <vf-modules>\n    <vf-module>\n      <vf-id>VF-001</vf-id>\n      <vf-name>vFirewall</vf-name>\n      <heat-template-ref>vfw_heat.yaml</heat-template-ref>\n      <max-instances>4</max-instances>\n      <network-requirements>\n        <network>protected</network>\n        <network>internal</network>\n      </network-requirements>\n    </vf-module>\n  </vf-modules>\n  <orchestration-params>\n    <param name="cloud_region">RegionOne</param>\n    <param name="tenant">5G-slice-42</param>\n  </orchestration-params>\n</ServiceModel>\n\nFormat: TOSCA CSAR (Cloud Service Archive) — standard NFV descriptor format',
      pduSemantics: 'SDC→SO distribution:\n• TOSCA CSAR: Topology and Orchestration Specification for Cloud Applications\n  - Standardized format for NFV descriptors (ETSI NFV MANO)\n  - Contains: service topology, VNF descriptors, network requirements, deployment templates\n• SDC publishes model to the catalog — SO subscribes to catalog updates\n• SO receives the model and stores it in its internal database\n• Orchestration params: Deployment-time parameters (cloud region, tenant, availability zone)\n\nThis is the DESIGN-TIME → RUN-TIME handoff',
      processing: 'SO receives the service model and:\n1. Validates the TOSCA CSAR structure\n2. Maps VF modules to available cloud resources (flavors, images, networks)\n3. Creates a deployment workflow (BPMN) based on the model\n4. Queries A&AI for resource availability\n5. The service is now ready for instantiation',
    },
    {
      id: 3, from: 'arch', to: 'so', label: 'Instantiate service', stepNumber: 3,
      direction: 'request', protocol: 'SO API',
      pduSyntax: 'SO Instantiation Request (REST):\nPOST /api/v1/instantiateService HTTP/1.1\nContent-Type: application/json\n\n{\n  "service-uuid": "b3c8a2e1-f4d7-4a1b-9e2c-8d6f5a4b3c2d",\n  "service-instance-name": "5G-EMBB-SLICE-042",\n  "cloud-parameters": {\n    "cloud-region": "RegionOne",\n    "tenant-id": "5g-slice-42",\n    "availability-zone": "az-1"\n  },\n  "vf-modules": [\n    {\n      "vf-name": "vFirewall",\n      "instance-name": "vfw-042-1",\n      "inputs": {\n        "vnf_name": "vfw-042-1",\n        "mgmt_network": "protected"\n      }\n    },\n    {\n      "vf-name": "vRouter",\n      "instance-name": "vrouter-042-1",\n      "inputs": {\n        "vnf_name": "vrouter-042-1"\n      }\n    }\n  ]\n}',
      pduSemantics: 'Instantiation request:\n• Service UUID: References the service model designed in SDC\n• Cloud parameters: Target cloud platform (OpenStack region, tenant, AZ)\n• VF modules: List of VNF instances to deploy with instance-specific inputs\n  - instance-name: Unique name for this VNF instance\n  - inputs: Parameters bound at instantiation time\n\nSO will execute the BPMN workflow:\n1. Allocate resources in A&AI\n2. Create virtual networks\n3. Deploy VNFs via Multi-VIM adapter\n4. Configure VNFs via NETCONF (Day-1 config)\n5. Update A&AI inventory',
      processing: 'SO orchestrates deployment:\n1. Locks service instance in A&AI\n2. Sends create request to Multi-VIM (OpenStack adapter)\n3. Multi-VIM translates to OpenStack API calls\n4. Monitors deployment progress via OpenStack callbacks\n5. On completion, updates A&AI with active VNF records\n6. Service instance state changes to "ACTIVE"\n7. Returns success to architect with VNF IDs and IP addresses',
    },
    {
      id: 4, from: 'so', to: 'vim', label: 'Multi-VIM create VNF instance', stepNumber: 4,
      direction: 'request', protocol: 'Heat/OpenStack',
      pduSyntax: 'Multi-VIM adapter → OpenStack Heat:\nPOST /v2/tenant-id/stacks HTTP/1.1\nContent-Type: application/json\n\n{\n  "stack_name": "5G-EMBB-SLICE-042-vfw",\n  "template": "vfw_heat.yaml",\n  "parameters": {\n    "vnf_name": "vfw-042-1",\n    "flavor": "m1.medium",\n    "image": "Ubuntu-22.04-NFV",\n    "mgmt_network_id": "net-protected",\n    "data_network_id": "net-internal",\n    "availability_zone": "az-1",\n    "key_name": "onap-key"\n  },\n  "timeout_mins": 30\n}\n\nOpenStack Heat Orchestration Template (excerpt):\nresources:\n  vfw_port_1:\n    type: OS::Neutron::Port\n    properties:\n      network: { get_param: mgmt_network }\n  vfw_server:\n    type: OS::Nova::Server\n    properties:\n      flavor: { get_param: flavor }\n      image: { get_param: image }\n      networks:\n        - port: { get_resource: vfw_port_1 }',
      pduSemantics: 'OpenStack Heat deployment:\n• stack_name: Unique CloudFormation-like stack for this VNF instance\n• template: Heat Orchestration Template (YAML) — describes the VNF infrastructure\n  - Networks: Neutron ports (virtual network interfaces)\n  - Compute: Nova server (VM instance)\n  - Storage: Cinder volumes (if needed)\n• Parameters: Binding actual values to template parameters\n• timeout_mins: 30 minutes to deploy before timeout\n\nMulti-VIM abstracts the cloud API — SO doesn\'t need to know if the target is OpenStack, Kubernetes, or VMware',
      processing: 'OpenStack executes the Heat template:\n1. Creates Neutron port on management network\n2. Creates Nova server with specified flavor and image\n3. Attaches network port to the server\n4. Server boots with cloud-init (Day-0 config)\n5. Returns stack status: CREATE_COMPLETE, outputs: VM IP, VNF ID\n6. Total time: typically 2-5 minutes for a single VNF',
    },
  ],
};

export const yangSequence: SequenceDiagramDef = {
  title: 'YANG Model Design & Validation Data Flow',
  participants: [
    { id: 'arch', label: 'Network Architect' },
    { id: 'editor', label: 'YANG Editor\n(Studio)' },
    { id: 'validator', label: 'Schema\nValidator' },
    { id: 'device', label: 'Target Device\n(Netconf)' },
  ],
  messages: [
    {
      id: 1, from: 'arch', to: 'editor', label: 'Define module header', stepNumber: 1,
      direction: 'request', protocol: 'User Input',
      pduSyntax: 'module campus-network {\n  namespace "http://campus.example.com/ns/yang";\n  prefix campus;\n\n  import ietf-inet-types {\n    prefix inet;\n  }\n\n  organization "Campus IT";\n  contact "noc@campus.example.com";\n  description\n    "YANG module for campus network device management";\n\n  revision 2024-07-15 {\n    description "Initial revision";\n  }\n}',
      pduSemantics: 'YANG module header semantics:\n• module: Top-level statement — defines the YANG module name (campus-network)\n• namespace: XML namespace URI — uniquely identifies the module\n  - Used in NETCONF XML and RESTCONF JSON encoding\n• prefix: Shorthand alias for the namespace (used in imports)\n• import: References external modules (ietf-inet-types for IP address types)\n• organization/contact/description: Metadata for module documentation\n• revision: Version history — every change increments revision date\n\nThis is the required header for ALL YANG modules',
      processing: 'Editor validates the module header: checks namespace uniqueness, verifies imports exist, confirms revision date format. The module skeleton is created in the editor workspace.',
    },
    {
      id: 2, from: 'editor', to: 'validator', label: 'container campus-inventory', stepNumber: 2,
      direction: 'request', protocol: 'YANG 1.1',
      pduSyntax: 'container campus-inventory {\n  description\n    "Top-level container for all campus device inventory";\n\n  leaf campus-name {\n    type string;\n    mandatory true;\n    description "Name of the campus";\n  }\n\n  leaf location {\n    type string;\n    default "Main Campus";\n  }\n}',
      pduSemantics: 'YANG container structure:\n• container: Interior node that groups related leafs (has no value itself)\n  - Like a JSON object or XML element with children\n• leaf: Single scalar value of a specific type\n  - type string: YANG built-in type (string, uint32, boolean, enumeration, etc.)\n  - mandatory true: The leaf MUST exist in any valid configuration\n  - default "Main Campus": Value used if not explicitly configured\n\nXPath equivalent: /campus-inventory/location\nRESTCONF URI: /restconf/data/campus-campus-inventory:inventory',
      processing: 'Validator checks:\n1. Container name is unique within the module\n2. Leaf names do not conflict\n3. Type "string" is valid YANG built-in type\n4. mandatory true is valid on a leaf\n5. default value type matches leaf type\n6. No circular references or import errors',
    },
    {
      id: 3, from: 'arch', to: 'editor', label: 'Add devices list with key', stepNumber: 3,
      direction: 'request', protocol: 'User Input',
      pduSyntax: 'list devices {\n  key "device-id";\n  description "List of managed network devices";\n\n  leaf device-id {\n    type string;\n    description "Unique device identifier (hostname)";\n  }\n\n  leaf ip-address {\n    type inet:ipv4-address;\n    mandatory true;\n    description "Management IP address";\n  }\n\n  leaf role {\n    type enumeration {\n      enum "core-router";\n      enum "access-switch";\n      enum "distribution-switch";\n      enum "firewall";\n    }\n    default "access-switch";\n    description "Device role in the network";\n  }\n\n  leaf software-version {\n    type string;\n  }\n\n  leaf location {\n    type leafref {\n      path "/campus-inventory/location";\n    }\n    description "Reference to campus location";\n  }\n}',
      pduSemantics: 'YANG list with key semantics:\n• list: Ordered set of entries (like a database table)\n• key "device-id": Uniquely identifies each list entry\n  - Must be a leaf within the list\n  - Can be multiple keys: key "device-id device-type"\n• inet:ipv4-address: Type imported from ietf-inet-types module\n• enumeration: Restricted set of string values (like an enum)\n• leafref: Reference to another leaf in the data tree\n  - path: XPath expression pointing to the target leaf\n  - Ensures referential integrity\n\nXML instance:\n<devices><device-id>Core-R1</device-id><role>core-router</role></devices>\n\nRESTCONF URI: /restconf/data/campus-inventory:devices=device-id=Core-R1',
      processing: 'Validator performs comprehensive checks:\n1. Key leaf "device-id" exists in the list\n2. enum values are unique and follow YANG identifier rules\n3. leafref path is valid XPath pointing to an existing leaf\n4. Type inet:ipv4-address correctly imported from ietf-inet-types\n5. The data tree can be serialized correctly to XML/JSON\n6. No duplicate leaf names, no type conflicts',
    },
    {
      id: 4, from: 'validator', to: 'device', label: 'Schema valid — deploy', stepNumber: 4,
      direction: 'response', protocol: 'YANG 1.1',
      pduSyntax: 'Validation result:\n✓ Schema valid YANG 1.1 — all constraints passed\n\nModule: campus-network\nNamespace: http://campus.example.com/ns/yang\nPrefix: campus\n\n  Validated components:\n  ├── container campus-inventory ✓\n  │   ├── leaf campus-name (mandatory) ✓\n  │   └── leaf location (default: "Main Campus") ✓\n  └── list devices ✓\n      ├── key: device-id ✓\n      ├── leaf device-id (string) ✓\n      ├── leaf ip-address (inet:ipv4-address, mandatory) ✓\n      ├── leaf role (enumeration: 4 values, default: "access-switch") ✓\n      ├── leaf software-version (string) ✓\n      └── leaf location (leafref → /campus-inventory/location) ✓\n\n  0 errors, 0 warnings\n\nGenerated pyang tree output:\nmodule: campus-network\n  +--rw campus-inventory\n     +--rw campus-name?   string\n     +--rw location?      string\n     +--rw devices* [device-id]\n        +--rw device-id          string\n        +--rw ip-address         inet:ipv4-address\n        +--rw role?              enumeration\n        +--rw software-version?  string\n        +--rw location?          leafref',
      pduSemantics: 'Validation success output:\n• pyang: Open-source YANG validation tool\n• Tree output: Visual representation of the YANG data model\n  +--rw = read-write config node\n  * = list node\n  ? = optional leaf (not mandatory)\n  [device-id] = key field\n\nFailed validation errors:\n  - Error: missing mandatory leaf "ip-address"\n  - Error: type mismatch in leafref path\n  - Error: duplicate enum value\n  - Warning: unused import statement\n\nYANG validation ensures model correctness BEFORE deployment — prevents runtime errors',
      processing: 'The validated YANG module can now be:\n1. Loaded onto a NETCONF-enabled device\n2. Used to generate XML/JSON instance data\n3. Published to a YANG catalog for API documentation\n4. Used with RESTCONF for browser-based configuration\n5. The device can parse configuration using this schema — rejects invalid configs at the protocol level',
    },
  ],
};

/* ════════════════════════════════════════════
   Unit I Topic-Specific Sequence Diagrams
════════════════════════════════════════════ */

export const cliProbeSequence: SequenceDiagramDef = {
  title: 'Networking Commands Probing Sequence (Ping / Traceroute / SNMP)',
  participants: [
    { id: 'admin', label: 'NOC Admin / NMS Probe' },
    { id: 'kernel', label: 'Local OS Kernel' },
    { id: 'router', label: 'Transit Router' },
    { id: 'target', label: 'Target Device / Host' },
  ],
  messages: [
    {
      id: 1, from: 'admin', to: 'kernel', label: 'ping -c 3 10.0.0.1', stepNumber: 1,
      direction: 'request', protocol: 'CLI / System Call',
      pduSyntax: 'socket(AF_INET, SOCK_RAW, IPPROTO_ICMP)\nTarget: 10.0.0.1, Count: 3, Timeout: 1000ms',
      pduSemantics: 'CLI command opens raw ICMP socket to send Echo Request. Kernel constructs IP + ICMP headers.',
      processing: 'Local kernel allocates socket buffer, timestamps packet start time t0, and forwards IP packet to NIC driver.',
    },
    {
      id: 2, from: 'kernel', to: 'target', label: 'ICMP Echo Request (Type 8)', stepNumber: 2,
      direction: 'request', protocol: 'ICMP / IP',
      pduSyntax: 'IP Header: Src=10.0.0.50, Dst=10.0.0.1, TTL=64\nICMP Header: Type=8, Code=0, Seq=1, Identifier=0x1A2B',
      pduSemantics: 'Layer 3 diagnostic probe asking target host to echo back packet.',
      processing: 'Target host receives ICMP Echo Request, verifies checksum, and generates ICMP Echo Reply.',
    },
    {
      id: 3, from: 'target', to: 'kernel', label: 'ICMP Echo Reply (Type 0)', stepNumber: 3,
      direction: 'response', protocol: 'ICMP / IP',
      pduSyntax: 'IP Header: Src=10.0.0.1, Dst=10.0.0.50, TTL=64\nICMP Header: Type=0, Code=0, Seq=1, Identifier=0x1A2B',
      pduSemantics: 'Layer 3 echo response containing matching sequence number and payload.',
      processing: 'Local kernel captures arrival timestamp t1, computes RTT = t1 - t0 = 1.45 ms, and updates probe statistics.',
    },
    {
      id: 4, from: 'admin', to: 'kernel', label: 'traceroute 10.0.0.1 (TTL=1)', stepNumber: 4,
      direction: 'request', protocol: 'CLI / System Call',
      pduSyntax: 'traceroute -n 10.0.0.1\nSet IP TTL=1, send UDP packet to high port 33434',
      pduSemantics: 'Path discovery technique using incrementing Time-To-Live fields to discover intermediate hop IPs.',
      processing: 'Kernel sends UDP packet with TTL=1. First hop router decrements TTL to 0 and drops packet.',
    },
    {
      id: 5, from: 'router', to: 'kernel', label: 'ICMP Time Exceeded (Type 11)', stepNumber: 5,
      direction: 'response', protocol: 'ICMP / IP',
      pduSyntax: 'ICMP Type=11 (Time Exceeded), Code=0 (TTL expired in transit)\nPayload: Original IP header + first 8 bytes of UDP datagram',
      pduSemantics: 'Intermediate router identifies itself as Hop 1 (10.0.0.254) and reports TTL expiration.',
      processing: 'Local CLI tool displays Hop 1 IP and measured RTT. Next probe increments TTL to 2.',
    },
  ],
};

export const mobileNetworkSequence: SequenceDiagramDef = {
  title: 'Mobile Network Data Session & Management Flow',
  participants: [
    { id: 'ue', label: 'User Equipment (UE)' },
    { id: 'ran', label: 'gNB / RAN Node' },
    { id: 'core', label: 'AMF / UPF (5G Core)' },
    { id: 'nms', label: 'NMS / Management' },
  ],
  messages: [
    {
      id: 1, from: 'ue', to: 'ran', label: 'RRC Setup Request', stepNumber: 1,
      direction: 'request', protocol: 'NR-Uu Air Interface',
      pduSyntax: 'RRCSetupRequest {\n  rrc-SetupEstablishmentCause: mo-Data,\n  ue-Identity: randomValue 0x9A8B7C\n}',
      pduSemantics: 'UE requests radio resource allocation on gNB over 5G NR air interface.',
      processing: 'gNB schedules physical random access channel (PRACH) resources and returns RRC Setup.',
    },
    {
      id: 2, from: 'ran', to: 'core', label: 'N2 Initial UE Message', stepNumber: 2,
      direction: 'request', protocol: 'NGAP / N2',
      pduSyntax: 'NGAP InitialUEMessage {\n  RAN-UE-NGAP-ID: 104,\n  NAS-PDU: Registration Request (SUCI),\n  UserLocationInformation: TAC 0x0001, CellID 0x12345\n}',
      pduSemantics: 'gNB forwards NAS Registration Request to 5G Core Access & Mobility Management Function (AMF).',
      processing: 'AMF authenticates UE via AUSF/UDM and selects User Plane Function (UPF) for session anchor.',
    },
    {
      id: 3, from: 'core', to: 'ran', label: 'N2 PDU Session Resource Setup', stepNumber: 3,
      direction: 'response', protocol: 'NGAP / N2',
      pduSyntax: 'NGAP PDUSessionResourceSetupRequest {\n  PDU Session ID: 1,\n  UPF GTP-U Tunnel IP: 10.200.1.1, TEID: 0x8899AA,\n  QoS Flow Level Parameters: 5QI=9, ARP=1\n}',
      pduSemantics: 'Core configures user-plane GTP tunnel parameters and QoS rules for data transfer.',
      processing: 'gNB configures data radio bearer (DRB) and establishes GTP-U tunnel toward UPF.',
    },
    {
      id: 4, from: 'ran', to: 'nms', label: 'gNB Performance Counter Stream', stepNumber: 4,
      direction: 'notification', protocol: 'gNMI / Telemetry',
      pduSyntax: 'gNMI Telemetry Update {\n  path: "components/component[gNB-101]/ran/counters",\n  val: { active_users: 142, rrc_success_rate: 99.8, throughput_mbps: 450.2 }\n}',
      pduSemantics: 'gNB streams cell throughput and RRC KPI metrics to NMS telemetry collector every second.',
      processing: 'NMS updates cell site dashboard and monitors SLA compliance.',
    },
  ],
};

export const tmnEtomSequence: SequenceDiagramDef = {
  title: 'TMN 5-Layer SLA-to-Element Provisioning Flow',
  participants: [
    { id: 'bml', label: 'BML (Business)' },
    { id: 'nml', label: 'NML (Network)' },
    { id: 'eml', label: 'EML (Element Mgmt)' },
    { id: 'nel', label: 'NEL (Network Element)' },
  ],
  messages: [
    {
      id: 1, from: 'bml', to: 'nml', label: 'Provision 1 Gbps Enterprise SLA', stepNumber: 1,
      direction: 'request', protocol: 'eTOM / TMF API',
      pduSyntax: 'TMF641 ServiceOrder {\n  customer: "Acme Corp",\n  serviceType: "E-LINE 1Gbps",\n  sla: { latency_max_ms: 10, availability: 99.999 }\n}',
      pduSemantics: 'Business layer negotiates customer contract and issues high-level service order to Network Management Layer.',
      processing: 'NML calculates end-to-end path, selects optimal transit nodes, and divides SLA parameters into node-level configs.',
    },
    {
      id: 2, from: 'nml', to: 'eml', label: 'Allocate VLAN & Rate-Limit Config', stepNumber: 2,
      direction: 'request', protocol: 'NML-EML Interface',
      pduSyntax: 'CreateDomainConfig {\n  domain: "Transport-West",\n  vlanId: 204,\n  ingressRateLimit: 1000Mbps,\n  shapingBurst: 64KB\n}',
      pduSemantics: 'Network layer requests domain-specific Element Management System to configure target domain devices.',
      processing: 'EML translates domain config into vendor-specific MIB/YANG definitions for managed devices.',
    },
    {
      id: 3, from: 'eml', to: 'nel', label: 'Push Device YANG Configuration', stepNumber: 3,
      direction: 'request', protocol: 'NETCONF / SBI',
      pduSyntax: '<edit-config><target><candidate/></target><config><interfaces><interface><name>Gi0/1</name><vlan>204</vlan></interface></interfaces></edit-config>',
      pduSemantics: 'Element layer provisions physical router interface on Network Element layer.',
      processing: 'NE validates schema, applies configuration, and returns OK PDU to EML.',
    },
    {
      id: 4, from: 'nel', to: 'bml', label: 'SLA Active & Billing Start', stepNumber: 4,
      direction: 'response', protocol: 'eTOM Assurance',
      pduSyntax: 'ServiceStateChangeNotification { orderId: "ORD-9021", status: "ACTIVE", billingStartDate: "2026-08-06T19:30:00Z" }',
      pduSemantics: 'Confirmation flows up through TMN layers to trigger business billing mediation.',
      processing: 'BML activates monthly billing contract for Acme Corp.',
    },
  ],
};

export const nmsHierarchySequence: SequenceDiagramDef = {
  title: '4-Tier Hierarchy Alarm Aggregation & NBI Push Flow',
  participants: [
    { id: 'ne', label: 'Network Element (NE)' },
    { id: 'ems', label: 'Element Mgmt (EMS)' },
    { id: 'nms', label: 'Network Mgmt (NMS)' },
    { id: 'oss', label: 'OSS / BSS (Northbound)' },
  ],
  messages: [
    {
      id: 1, from: 'ne', to: 'ems', label: 'Raw Device Trap (linkDown)', stepNumber: 1,
      direction: 'notification', protocol: 'SNMPv2c Trap',
      pduSyntax: 'SNMPv2-Trap PDU: sysUpTime=542100, snmpTrapOID=linkDown, ifIndex=4',
      pduSemantics: 'Physical network element detects link drop and emits raw unformatted SNMP trap on UDP port 162.',
      processing: 'EMS normalizes vendor OID to human-readable format and logs domain event.',
    },
    {
      id: 2, from: 'ems', to: 'nms', label: 'Domain Alarm Event', stepNumber: 2,
      direction: 'notification', protocol: 'RESTCONF / JSON',
      pduSyntax: 'POST /restconf/data/alarm-list\n{ "alarmId": "ALM-801", "source": "RAN-EMS-01", "ne": "eNB-104", "severity": "CRITICAL", "cause": "linkDown" }',
      pduSemantics: 'EMS passes normalized domain alarm to cross-domain NMS.',
      processing: 'NMS correlation engine deduplicates alarm and checks topology database for root cause.',
    },
    {
      id: 3, from: 'nms', to: 'oss', label: 'Correlated Root-Cause NBI Alert', stepNumber: 3,
      direction: 'notification', protocol: 'TMF642 Alarm API',
      pduSyntax: 'POST /tmf-api/alarmManagement/v4/alarm\n{ "id": "INC-2024-99", "state": "ACKNOWLEDGED", "affectedServices": ["VoLTE", "5G-Data"], "rootCause": "Fiber Cut Hop 3" }',
      pduSemantics: 'NMS suppresses 40 secondary alarms and pushes single correlated root-cause incident to OSS via Northbound REST API.',
      processing: 'OSS opens trouble ticket in ServiceNow and dispatches field technician.',
    },
  ],
};

export const fcapsSequence: SequenceDiagramDef = {
  title: 'Integrated FCAPS Lifecycle Data Flow',
  participants: [
    { id: 'fm', label: 'Fault (FM)' },
    { id: 'cm', label: 'Config (CM)' },
    { id: 'pm', label: 'Performance (PM)' },
    { id: 'sm', label: 'Security (SM)' },
    { id: 'am', label: 'Accounting (AM)' },
  ],
  messages: [
    {
      id: 1, from: 'fm', to: 'cm', label: 'Fault Detected -> Trigger Backup', stepNumber: 1,
      direction: 'request', protocol: 'Internal NMS Bus',
      pduSyntax: 'Event: Port Error Burst -> Trigger CM Snapshot (Device: Core-R1)',
      pduSemantics: 'Fault management system detects interface CRC errors and requests Configuration Management to snapshot active running config.',
      processing: 'CM executes NETCONF get-config to store pre-remediation baseline.',
    },
    {
      id: 2, from: 'cm', to: 'sm', label: 'Config Edit -> Audit Security Log', stepNumber: 2,
      direction: 'notification', protocol: 'Syslog / AAA Audit',
      pduSyntax: 'AAA-AUDIT: User "admin" pushed CLI/NETCONF edit to Core-R1 interface Gi0/1',
      pduSemantics: 'Configuration change triggers Security Management audit log to verify admin RBAC authorization.',
      processing: 'SM logs action with SHA-256 hash in tamper-evident compliance audit database.',
    },
    {
      id: 3, from: 'pm', to: 'am', label: 'KPI Metrics -> Billing Mediation', stepNumber: 3,
      direction: 'notification', protocol: 'IPFIX / CDR Flow',
      pduSyntax: 'CDR Record: Subscriber ID 9042, Transferred: 4.2 GB, Peak Rate: 850 Mbps',
      pduSemantics: 'Performance telemetry feeds bandwidth usage metrics to Accounting Management for tariff rating.',
      processing: 'AM updates subscriber monthly quota and triggers real-time OCS credit check.',
    },
  ],
};

export const nbiSbiSequence: SequenceDiagramDef = {
  title: 'NBI REST to SBI NETCONF Protocol Translation Flow',
  participants: [
    { id: 'oss', label: 'OSS / BSS App' },
    { id: 'nbi', label: 'NMS Northbound API' },
    { id: 'engine', label: 'NMS Mediation Core' },
    { id: 'sbi', label: 'Southbound (NETCONF)' },
    { id: 'device', label: 'Target Router' },
  ],
  messages: [
    {
      id: 1, from: 'oss', to: 'nbi', label: 'POST /api/v1/services/interface', stepNumber: 1,
      direction: 'request', protocol: 'HTTP REST / JSON',
      pduSyntax: 'POST /api/v1/services/interface HTTP/1.1\nHost: nms.example.com\nAuthorization: Bearer eyJhbGci...\n{ "deviceId": "RTR-01", "port": "Gi0/0", "description": "Core Link", "mtu": 9000 }',
      pduSemantics: 'Northbound client sends high-level JSON REST request to modify network interface.',
      processing: 'NBI authenticates OAuth2 token and forwards REST request payload to NMS Mediation Engine.',
    },
    {
      id: 2, from: 'engine', to: 'sbi', label: 'Translate JSON to YANG XML RPC', stepNumber: 2,
      direction: 'request', protocol: 'Internal Model Translation',
      pduSyntax: 'YANG Schema Mapping:\nJSON "mtu": 9000 -> <mtu xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces">9000</mtu>',
      pduSemantics: 'Mediation engine maps REST JSON attributes into exact RFC 7950 YANG XML elements.',
      processing: 'Engine prepares NETCONF <edit-config> RPC targeting candidate datastore.',
    },
    {
      id: 3, from: 'sbi', to: 'device', label: '<rpc> edit-config (NETCONF over SSH)', stepNumber: 3,
      direction: 'request', protocol: 'NETCONF / SSH Port 830',
      pduSyntax: '<rpc message-id="101" xmlns="urn:ietf:params:netconf:base:1.0"><edit-config><target><candidate/></target><config><interfaces xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces"><interface><name>Gi0/0</name><description>Core Link</description><mtu>9000</mtu></interface></interfaces></config></edit-config>',
      pduSemantics: 'Southbound interface sends transactional XML payload over encrypted SSH channel to target router.',
      processing: 'Target device validates schema, applies edit to candidate datastore, and returns <rpc-reply><ok/></rpc-reply>.',
    },
    {
      id: 4, from: 'device', to: 'oss', label: 'HTTP 201 Created + JSON Response', stepNumber: 4,
      direction: 'response', protocol: 'HTTP REST / JSON',
      pduSyntax: 'HTTP/1.1 201 Created\nContent-Type: application/json\n{ "status": "SUCCESS", "deviceId": "RTR-01", "port": "Gi0/0", "appliedMtu": 9000 }',
      pduSemantics: 'NMS converts successful device NETCONF response back into HTTP 201 JSON payload for OSS app.',
      processing: 'OSS application updates service inventory.',
    },
  ],
};

export const snmpEvolutionSequence: SequenceDiagramDef = {
  title: 'SNMP Protocol Evolution (v1 vs v2c vs v3 Security)',
  participants: [
    { id: 'nms', label: 'SNMP Manager' },
    { id: 'v1', label: 'v1 Device (Cleartext)' },
    { id: 'v2', label: 'v2c Device (GETBULK)' },
    { id: 'v3', label: 'v3 Device (USM authPriv)' },
  ],
  messages: [
    {
      id: 1, from: 'nms', to: 'v1', label: 'SNMPv1 GET sysUpTime', stepNumber: 1,
      direction: 'request', protocol: 'SNMPv1 / UDP 161',
      pduSyntax: 'Community: "public" (Cleartext!)\nPDU: GetRequest(OID: 1.3.6.1.2.1.1.3.0)',
      pduSemantics: 'SNMPv1 uses plain community string without authentication or privacy encryption.',
      processing: 'Target device verifies community string and returns single scalar value.',
    },
    {
      id: 2, from: 'nms', to: 'v2', label: 'SNMPv2c GETBULK (max-rep=20)', stepNumber: 2,
      direction: 'request', protocol: 'SNMPv2c / UDP 161',
      pduSyntax: 'Community: "public"\nPDU: GetBulkRequest(non-repeaters=0, max-repetitions=20, OID: 1.3.6.1.2.1.2.2)',
      pduSemantics: 'SNMPv2c introduces GETBULK operation to retrieve 20 table rows in a single PDU exchange.',
      processing: 'Device returns 20 variable bindings in single GetResponse PDU, reducing RTT overhead by 20x.',
    },
    {
      id: 3, from: 'nms', to: 'v3', label: 'SNMPv3 Encrypted authPriv GET', stepNumber: 3,
      direction: 'request', protocol: 'SNMPv3 / USM+VACM',
      pduSyntax: 'User: "admin_user"\nAuth: HMAC-SHA1 ("AuthPass123")\nPriv: AES-128 ("PrivPass456")\nEncrypted ScopedPDU payload',
      pduSemantics: 'SNMPv3 USM authenticates sender identity via HMAC and encrypts PDU payload via AES-128.',
      processing: 'Agent verifies HMAC tag, decrypts AES ciphertext, checks VACM MIB view privileges, and returns encrypted response.',
    },
  ],
};

export const snmpMibQuerySequence: SequenceDiagramDef = {
  title: 'SNMP MIB Tree Traversal & OID Lookup Sequence',
  participants: [
    { id: 'nms', label: 'SNMP Manager' },
    { id: 'agent', label: 'SNMP Agent' },
    { id: 'mib', label: 'MIB-II Tree' },
  ],
  messages: [
    {
      id: 1, from: 'nms', to: 'agent', label: 'GETNEXT 1.3.6.1.2.1.1', stepNumber: 1,
      direction: 'request', protocol: 'SNMPv2c',
      pduSyntax: 'GetNextRequest PDU: OID = 1.3.6.1.2.1.1 (system group root)',
      pduSemantics: 'Manager requests the lexicographically next OID in the MIB hierarchy.',
      processing: 'Agent searches MIB tree starting at system root.',
    },
    {
      id: 2, from: 'agent', to: 'mib', label: 'Lookup next node after 1.3.6.1.2.1.1', stepNumber: 2,
      direction: 'request', protocol: 'Internal MIB Search',
      pduSyntax: 'MIB Node Search:\n1.3.6.1.2.1.1 -> 1.3.6.1.2.1.1.1.0 (sysDescr.0)',
      pduSemantics: 'Agent locates first leaf node sysDescr.0 in MIB-II system group.',
      processing: 'Agent reads sysDescr string value from system kernel memory.',
    },
    {
      id: 3, from: 'agent', to: 'nms', label: 'GetResponse (sysDescr.0 = "Cisco IOS")', stepNumber: 3,
      direction: 'response', protocol: 'SNMPv2c',
      pduSyntax: 'GetResponse PDU: OID = 1.3.6.1.2.1.1.1.0, Value = OCTET STRING "Cisco IOS XR 7.8.1"',
      pduSemantics: 'Agent returns discovered next OID and its bound text value.',
      processing: 'Manager records sysDescr.0 and issues next GETNEXT for 1.3.6.1.2.1.1.1.0 to continue MIB walk.',
    },
  ],
};

export const snmpWalkSequence: SequenceDiagramDef = {
  title: 'snmpwalk vs snmpbulkwalk Iteration Performance Comparison',
  participants: [
    { id: 'cli', label: 'Net-SNMP CLI Tool' },
    { id: 'agent', label: 'SNMP Agent (ifTable)' },
  ],
  messages: [
    {
      id: 1, from: 'cli', to: 'agent', label: 'snmpwalk (GETNEXT Step 1)', stepNumber: 1,
      direction: 'request', protocol: 'SNMPv2c',
      pduSyntax: 'GetNextRequest(1.3.6.1.2.1.2.2.1.2.1) [ifDescr.1]',
      pduSemantics: 'snmpwalk sends single GETNEXT per PDU to traverse table rows sequentially.',
      processing: 'Agent returns ifDescr.2. Total round trips needed for 48 ports = 48 PDUs.',
    },
    {
      id: 2, from: 'cli', to: 'agent', label: 'snmpbulkwalk -Cr20 (GETBULK Step 1)', stepNumber: 2,
      direction: 'request', protocol: 'SNMPv2c',
      pduSyntax: 'GetBulkRequest(non-repeaters=0, max-repetitions=20, OID=1.3.6.1.2.1.2.2.1.2)',
      pduSemantics: 'snmpbulkwalk requests 20 table rows in a single PDU request.',
      processing: 'Agent returns 20 OID varbinds in 1 GetResponse. Total round trips for 48 ports = 3 PDUs (16x faster!).',
    },
  ],
};

export const snmpTrapInformSequence: SequenceDiagramDef = {
  title: 'Asynchronous TRAP vs Confirmed INFORM Notification Flow',
  participants: [
    { id: 'agent', label: 'SNMP Agent (Device)' },
    { id: 'nms', label: 'NMS Trap Receiver (UDP 162)' },
  ],
  messages: [
    {
      id: 1, from: 'agent', to: 'nms', label: 'Unsolicited TRAP PDU (Unconfirmed)', stepNumber: 1,
      direction: 'notification', protocol: 'SNMPv2c Trap',
      pduSyntax: 'SNMPv2-Trap PDU: snmpTrapOID = coldStart, sysUpTime = 1200\nNo ACK requested',
      pduSemantics: 'Fire-and-forget UDP notification. If UDP packet is lost in transit, NMS never receives alert.',
      processing: 'NMS logs trap if received. Agent does not track receipt.',
    },
    {
      id: 2, from: 'agent', to: 'nms', label: 'INFORM PDU (Confirmed Delivery)', stepNumber: 2,
      direction: 'request', protocol: 'SNMPv2c Inform',
      pduSyntax: 'InformRequest PDU: Request-ID = 9041, snmpTrapOID = linkDown\nACK required!',
      pduSemantics: 'Agent sends notification expecting an explicit Response ACK PDU from NMS.',
      processing: 'NMS trap receiver decodes Inform and generates Response ACK PDU with matching Request-ID.',
    },
    {
      id: 3, from: 'nms', to: 'agent', label: 'Response ACK (Inform Confirmed)', stepNumber: 3,
      direction: 'response', protocol: 'SNMPv2c Response',
      pduSyntax: 'GetResponse PDU: Request-ID = 9041, error-status = noError(0)',
      pduSemantics: 'NMS acknowledges receipt. If ACK is not received within timeout, Agent retransmits Inform PDU.',
      processing: 'Agent cancels retransmission timer for Request-ID 9041.',
    },
  ],
};

export const snmpVsNetconfSequence: SequenceDiagramDef = {
  title: 'Partial SNMP SET Failure vs NETCONF Candidate Commit/Rollback',
  participants: [
    { id: 'nms', label: 'NMS Manager' },
    { id: 'snmp', label: 'SNMP Agent (No Transaction)' },
    { id: 'netconf', label: 'NETCONF Server (Candidate)' },
  ],
  messages: [
    {
      id: 1, from: 'nms', to: 'snmp', label: 'SNMP SET 8 BGP OIDs (Fails at Step 5)', stepNumber: 1,
      direction: 'request', protocol: 'SNMPv2c SET',
      pduSyntax: 'SetRequest PDU: Set BGP AS=65001, Neighbor=10.0.0.2, HoldTime=INVALID',
      pduSemantics: 'SNMP SET attempts non-transactional direct writes to running config.',
      processing: 'Steps 1-4 apply to device memory. Step 5 fails with badValue error. Steps 1-4 remain applied, leaving device in CORRUPTED partial config state!',
    },
    {
      id: 2, from: 'nms', to: 'netconf', label: 'NETCONF edit-config (target=candidate)', stepNumber: 2,
      direction: 'request', protocol: 'NETCONF / XML',
      pduSyntax: '<edit-config><target><candidate/></target><config>...8 BGP fields...</config></edit-config>',
      pduSemantics: 'NETCONF writes configuration changes safely into isolated candidate datastore without affecting live network.',
      processing: 'NETCONF server validates XML schema. Candidate updated. Running config remains 100% untouched.',
    },
    {
      id: 3, from: 'nms', to: 'netconf', label: 'NETCONF validate + commit confirmed 60', stepNumber: 3,
      direction: 'request', protocol: 'NETCONF / XML',
      pduSyntax: '<commit><confirmed/><confirm-timeout>60</confirm-timeout></commit>',
      pduSemantics: 'Atomic commit applies all changes simultaneously with an automatic 60-second rollback safety timer.',
      processing: 'Device validates cross-field constraints. On success, applies atomic swap. If session drops, auto-rolls back to pre-commit snapshot!',
    },
  ],
};

/* ════════════════════════════════════════════
   Unit I Master Sequence Mapping Dictionary
════════════════════════════════════════════ */

export const unit1SequenceData: Record<string, SequenceDiagramDef> = {
  u1t0: cliProbeSequence,
  u1t1: mobileNetworkSequence,
  u1t2: tmnEtomSequence,
  u1t3: nmsHierarchySequence,
  u1t4: fcapsSequence,
  u1t5: nbiSbiSequence,
  u1t6: snmpEvolutionSequence,
  u1t7: snmpMibQuerySequence,
  u1t8: snmpSequence,
  u1t9: snmpWalkSequence,
  u1t10: snmpTrapInformSequence,
  u1t11: yangSequence,
  u1t12: snmpVsNetconfSequence,
};

