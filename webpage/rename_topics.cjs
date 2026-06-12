const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'src', 'data');

const topics = [
  // Unit 1
  { file: 'topic1.ts', id: 'u1t1', moduleName: 'Unit 1: Introduction to Network Management and Frameworks', title: 'Understanding of Mobile Network, eTOM and TMN Framework' },
  { file: 'topic2.ts', id: 'u1t2', moduleName: 'Unit 1: Introduction to Network Management and Frameworks', title: 'EMS and NMS Architecture, FCAPS Process, NMS SBI and NBI' },
  { file: 'topic3.ts', id: 'u1t3', moduleName: 'Unit 1: Introduction to Network Management and Frameworks', title: 'SNMP and YANG Data Models: SNMP Concepts & Evolution, SNMP Architecture, SNMP Query, SNMP Commands, SNMP TRAPS' },
  { file: 'topic4.ts', id: 'u1t4', moduleName: 'Unit 1: Introduction to Network Management and Frameworks', title: 'YANG Evolution & Background, SNMP Limitations and Operators Requirement' },

  // Unit 2
  { file: 'topic5.ts', id: 'u2t1', moduleName: 'Unit II: Model-Driven Management and Protocols', title: 'Introduction to Model-Driven Management, YANG Data Model Structure, YANG Data Model Details Explanation' },
  { file: 'topic6.ts', id: 'u2t2', moduleName: 'Unit II: Model-Driven Management and Protocols', title: 'NETCONF Protocol Concept, NETCONF Operation Commands (get, edit-config, etc.)' },
  { file: 'topic7.ts', id: 'u2t3', moduleName: 'Unit II: Model-Driven Management and Protocols', title: 'RESTCONF, Alarm Management, and Network Virtualization' },
  { file: 'topic8.ts', id: 'u2t4', moduleName: 'Unit II: Model-Driven Management and Protocols', title: 'RESTCONF Protocol Concept, RESTCONF Operation via Postman' },

  // Unit 3
  { file: 'topic9.ts', id: 'u3t1', moduleName: 'Unit III: Alarm Lifecycle Management', title: 'Fault Correlation, Root Cause Analysis, Alarm Suppression Mechanism' },
  { file: 'topic10.ts', id: 'u3t2', moduleName: 'Unit III: Alarm Lifecycle Management', title: 'NMS Discovery, NMS NBI Interface, NMS FM NBI Flow' },
  { file: 'topic11.ts', id: 'u3t3', moduleName: 'Unit III: Alarm Lifecycle Management', title: 'REST API Concept, REST API Commands and Operation Flow, ONF TAPI Overview' },
  { file: 'topic12.ts', id: 'u3t4', moduleName: 'Unit III: Alarm Lifecycle Management', title: 'Network Function Virtualization (NFV) Concepts (VIM, VNFM, NFVO)' },

  // Unit 4
  { file: 'topic13.ts', id: 'u4t1', moduleName: 'Unit IV: SDN, Network Observability, and Advanced Network Management', title: 'SDN Architecture and Concept, SDN Controller Engine Functions (Route, Switch, Rollback)' },
  { file: 'topic14.ts', id: 'u4t2', moduleName: 'Unit IV: SDN, Network Observability, and Advanced Network Management', title: 'Key Concepts of Network Observability, Network Observability vs Network Monitoring, Importance of Network Observability for Business' },
  { file: 'topic15.ts', id: 'u4t3', moduleName: 'Unit IV: SDN, Network Observability, and Advanced Network Management', title: 'Techniques and Tools of Network Observability, Data Collection and Storage for Network Observability' },
  { file: 'topic16.ts', id: 'u4t4', moduleName: 'Unit IV: SDN, Network Observability, and Advanced Network Management', title: 'Applying Analytics on Observability Data with AI/ML and Prediction Methods' },
  { file: 'topic17.ts', id: 'u4t5', moduleName: 'Unit IV: SDN, Network Observability, and Advanced Network Management', title: 'Overview of Service Orchestration, Service Ordering, and Service Assurance, Overview of Network Slicing via ONAP Framework' }
];

for (const t of topics) {
  const filePath = path.join(dataDir, t.file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace id
  content = content.replace(/id:\s*"[^"]+"/, `id: "${t.id}"`);
  // Replace title
  content = content.replace(/title:\s*"[^"]+"/, `title: "${t.title}"`);
  // Replace moduleName
  content = content.replace(/moduleName:\s*"[^"]+"/, `moduleName: "${t.moduleName}"`);

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${t.file}`);
}
