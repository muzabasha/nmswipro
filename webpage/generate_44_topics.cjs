const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'src', 'data');

const units = [
  {
    unitNum: 1,
    name: "Unit 1: Introduction to Network Management and Frameworks",
    topics: [
      "Understanding of Mobile Network",
      "eTOM and TMN Framework",
      "EMS and NMS Architecture",
      "FCAPS Process",
      "NMS SBI (Southbound Interface) and NBI (Northbound Interface)",
      "SNMP and YANG Data Models: SNMP Concepts & Evolution",
      "SNMP Architecture",
      "SNMP Query",
      "SNMP Commands",
      "SNMP TRAPS",
      "YANG Evolution & Background",
      "SNMP Limitations and Operators Requirement"
    ]
  },
  {
    unitNum: 2,
    name: "Unit II: Model-Driven Management and Protocols",
    topics: [
      "Introduction to Model-Driven Management",
      "YANG Data Model Structure",
      "YANG Data Model Details Explanation",
      "NETCONF Protocol Concept",
      "NETCONF Operation Commands (get, edit-config, etc.)",
      "RESTCONF",
      "Alarm Management",
      "Network Virtualization",
      "RESTCONF Protocol Concept",
      "RESTCONF Operation via Postman"
    ]
  },
  {
    unitNum: 3,
    name: "Unit III: Alarm Lifecycle Management",
    topics: [
      "Fault Correlation",
      "Root Cause Analysis",
      "Alarm Suppression Mechanism",
      "NMS Discovery",
      "NMS NBI Interface",
      "NMS FM NBI Flow",
      "REST API Concept",
      "REST API Commands and Operation Flow",
      "ONF TAPI Overview",
      "Network Function Virtualization (NFV) Concepts (VIM, VNFM, NFVO)"
    ]
  },
  {
    unitNum: 4,
    name: "Unit IV: SDN, Network Observability, and Advanced Network Management",
    topics: [
      "SDN Architecture and Concept",
      "SDN Controller Engine Functions (Route, Switch, Rollback)",
      "Key Concepts of Network Observability",
      "Network Observability vs Network Monitoring",
      "Importance of Network Observability for Business",
      "Techniques and Tools of Network Observability",
      "Data Collection and Storage for Network Observability",
      "Applying Analytics on Observability Data with AI/ML and Prediction Methods",
      "Overview of Service Orchestration",
      "Service Ordering",
      "Service Assurance",
      "Overview of Network Slicing via ONAP Framework"
    ]
  }
];

let globalIndex = 1;
const indexExports = [];
const indexMappings = { "1": [], "2": [], "3": [], "4": [] };

const template = (id, title, moduleName) => `import type { TopicData } from './types';

// @ts-nocheck
export const topic_DATA_NAME_: TopicData = {
  id: "${id}",
  title: "${title}",
  moduleName: "${moduleName}",
  context: {
    prerequisites: ["General Networking Knowledge"],
    dependentTopics: [],
    nextSteps: "Proceed to the next topic in the unit."
  },
  storytelling: {
    analogy: "A generic system processing data",
    story: "In any complex system, components must communicate. Just as a manager oversees employees, a central system oversees network nodes. This topic explores ${title}.",
    reflectiveQuestions: ["Why is this concept critical for large-scale systems?", "What happens if this component fails?"],
    technicalConnection: "This connects deeply with standard network management protocols and design patterns."
  },
  mathModelling: {
    need: "To measure the performance and reliability of this component.",
    equation: "P(x) = \\\\alpha x + \\\\beta",
    technicalDetails: "A simple linear or exponential model is often used to approximate overhead and delay. Where \\\\( x \\\\) is the load and \\\\( P(x) \\\\) is the performance impact.",
    explanation: [
      { term: "P(x)", meaning: "Performance Metric" },
      { term: "x", meaning: "System Load or Time" },
      { term: "\\\\alpha", meaning: "Scaling Factor" }
    ],
    advantages: ["Simple to compute", "Easy to visualize"],
    limitations: ["Does not account for non-linear spikes"],
    simulation: {
      description: "Adjust the scaling factor to see how load affects performance.",
      parameters: [
        { id: "alpha", name: "Scaling Factor", min: 1, max: 10, default: 2, step: 1, unit: "" },
        { id: "beta", name: "Base Overhead", min: 0, max: 100, default: 10, step: 5, unit: " ms" }
      ],
      generateData: (params) => {
        const a = params.alpha || 2;
        const b = params.beta || 10;
        const pts = [];
        for(let x=1; x<=10; x++) {
          pts.push({ x: x, y: a * x + b });
        }
        return pts;
      },
      labels: { x: "System Load", y: "Performance Impact" }
    }
  },
  activities: {
    level1: "Define the core terms.",
    level2: "Compare and contrast with related concepts.",
    level3: "Calculate the performance metric using the given equation.",
    level4: "Write a short summary of how this applies to a modern data center."
  },
  projects: {
    scope: "Analyze a hypothetical network deployment.",
    objectives: ["Identify bottlenecks", "Propose an optimization plan"],
    deliverables: ["A 2-page report", "A diagram of the proposed architecture"]
  },
  questions: [
    { q: "What is the primary function of this topic?", a: "To ensure network reliability and management.", type: "Conceptual" },
    { q: "Calculate P(5) if alpha=2 and beta=10.", a: "P(5) = 2(5) + 10 = 20.", type: "Numerical" },
    { q: "Why is this model an approximation?", a: "Because real-world networks exhibit non-linear behavior under high stress.", type: "Analytical" }
  ],
  virtualLab: {
    description: "Simulate network traffic to observe the overhead.",
    interpretation: "As load increases, overhead grows predictably until it hits a capacity threshold.",
    parameters: [
      { id: "traffic", name: "Network Traffic", min: 10, max: 100, default: 50, step: 10, unit: " Mbps" }
    ],
    generateData: (params) => {
      const t = params.traffic || 50;
      const pts = [];
      for(let time=1; time<=10; time++) {
        pts.push({ x: time, y: (t * time) / 10 });
      }
      return pts;
    },
    labels: { x: "Time (s)", y: "Overhead (MB)" }
  }
};
`;

for (const unit of units) {
  let unitTopicIndex = 1;
  for (const title of unit.topics) {
    const id = "u" + unit.unitNum + "t" + unitTopicIndex;
    const dataName = "topic" + globalIndex + "Data";
    const fileName = "topic" + globalIndex + ".ts";
    
    // Write the file
    const content = template(id, title, unit.name).replace('topic_DATA_NAME_', dataName);
    fs.writeFileSync(path.join(dataDir, fileName), content, 'utf-8');
    
    // Store mapping for index.ts
    indexExports.push("import { " + dataName + " } from './topic" + globalIndex + "';");
    indexMappings[unit.unitNum].push("    \"" + unitTopicIndex + "\": " + dataName + ",");
    
    console.log("Generated " + fileName + " (" + id + ")");
    
    unitTopicIndex++;
    globalIndex++;
  }
}

// Generate index.ts
let indexContent = "import type { TopicData } from './types';\n\n";
indexContent += indexExports.join('\n') + '\n\n';
indexContent += "export const courseData: Record<string, Record<string, TopicData>> = {\n";
for (let i=1; i<=4; i++) {
  indexContent += "  \"" + i + "\": {\n";
  indexContent += indexMappings[i].join('\n') + '\n';
  indexContent += "  },\n";
}
indexContent += "};\n";

fs.writeFileSync(path.join(dataDir, 'index.ts'), indexContent, 'utf-8');
console.log('Generated index.ts with 44 topics mapped.');
