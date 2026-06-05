import type { TopicData } from './types';

export const topic12Data: TopicData = {
  id: "u4t3",
  title: "Intent-Based Networking and AI in NMS",
  moduleName: "Unit 4: Next-Generation Management",
  context: {
    prerequisites: ["SDN Controllers and OpenFlow", "RESTCONF and Web-based Management"],
    dependentTopics: [],
    nextSteps: "This concludes the course modules! You are now ready to apply these concepts to real-world network management scenarios."
  },
  storytelling: {
    analogy: "The Taxi Driver vs. The Self-Driving Car",
    story: "In legacy networks (SNMP/CLI), you are the driver. You control the steering wheel, gas, and brakes (IPs, VLANs, OSPF metrics). It's exhausting and prone to human error. In SDN, you are the passenger in a taxi. You tell the driver 'Take me to the airport' (your Intent), and the driver (SDN Controller) translates that into the specific turns and speeds required. But Intent-Based Networking (IBN) powered by AI is like a Self-Driving Car. You tell it your intent, it translates it, executes it, but crucially, it continuously uses sensors (Telemetry) to verify it's still heading to the airport. If a road closes, it automatically recalculates the route without you ever knowing.",
    reflectiveQuestions: ["Why is the 'Verification' step crucial in distinguishing IBN from traditional SDN?", "How does AI help the network adapt when the physical reality no longer matches the intent?"],
    technicalConnection: "IBN takes SDN a step further by adding continuous closed-loop verification. You declare the 'Intent' (e.g., 'The Web Server must securely reach the Database'), and the IBN system translates this into policy, configures the network via SDN, and uses streaming telemetry and machine learning to continuously verify the policy is being upheld."
  },
  mathModelling: {
    need: "To measure the accuracy of an AI model predicting network anomalies based on telemetry data.",
    equation: "F_1 = 2 \\times \\frac{\\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}}",
    technicalDetails: "In AI-driven NMS, we use Machine Learning to detect anomalies (like a subtle DDoS attack or a degrading optic fiber). We evaluate the AI's effectiveness using the $F_1$ Score, which balances Precision (how many of the flagged anomalies were actual problems) and Recall (how many of the actual problems did the AI successfully flag). An AI that flags everything as an anomaly has perfect Recall but terrible Precision (leading to alarm fatigue). The $F_1$ score forces the model to optimize both, ensuring the NMS only alerts humans when absolutely necessary.",
    explanation: [
      { term: "F_1", meaning: "The harmonic mean of Precision and Recall (ranges from 0 to 1, higher is better)." },
      { term: "Precision", meaning: "True Positives / (True Positives + False Positives). The accuracy of the alerts." },
      { term: "Recall", meaning: "True Positives / (True Positives + False Negatives). The ability to find all actual faults." }
    ],
    advantages: ["Provides a single, robust metric to evaluate an AI's performance in fault management.", "Highlights the danger of 'alarm fatigue' caused by low precision models."],
    limitations: ["Does not account for the computational cost of running the AI model."]
  },
  activities: {
    level1: "Teacher shows a Cisco DNA Center dashboard, pointing out where 'Intent' is defined and where 'Health' is monitored.",
    level2: "Teacher + Students write three plain-English 'Intents' and map them to the technical configurations required.",
    level3: "Group Activity: Students discuss a scenario where an AI model has high Recall but low Precision, and explain why the NOC (Network Operations Center) engineers would hate it.",
    level4: "Individual Task: Write a summary of the 'Closed-Loop' process in IBN (Translation -> Activation -> Assurance)."
  },
  projects: {
    scope: "Design a conceptual Intent-Translation engine.",
    objectives: ["Define a simple JSON structure for an 'Intent' (e.g., allow traffic between two departments)", "Write a pseudo-code script that translates this intent into specific firewall rules", "Write a pseudo-code check that verifies the rule is working"],
    deliverables: ["The JSON Intent definition", "The translation and verification pseudo-code"]
  },
  questions: [
    { q: "What is the key difference between Software-Defined Networking (SDN) and Intent-Based Networking (IBN)?", a: "While SDN centralizes control and makes the network programmable, IBN adds continuous 'closed-loop' verification. IBN constantly monitors the network to assure that the actual state matches the declared intent.", type: "Conceptual" },
    { q: "In the self-driving car analogy, what does continuous monitoring of the sensors represent?", a: "It represents Network Assurance and Telemetry, the process of continuously gathering data to verify that the network is actually fulfilling the intended policy.", type: "Conceptual" },
    { q: "If an AI model has a Precision of 0.8 and a Recall of 0.6, what is its $F_1$ score?", a: "$F_1 = 2 * ((0.8 * 0.6) / (0.8 + 0.6)) = 2 * (0.48 / 1.4) \\approx 0.685$.", type: "Numerical" },
    { q: "Why is 'Alarm Fatigue' a significant problem in Network Management, and how does Precision relate to it?", a: "Alarm Fatigue occurs when an NMS generates too many false positive alerts, causing engineers to ignore them. A model with low Precision generates many false positives, directly causing alarm fatigue.", type: "Analytical" },
    { q: "What are the three main phases of the IBN closed-loop cycle?", a: "Translation (converting intent to policy), Activation (deploying the policy via SDN), and Assurance (using telemetry to verify the policy is upheld).", type: "Conceptual" }
  ],
  virtualLab: {
    description: "Simulation adjusting AI Alert Thresholds to balance Precision and Recall.",
    interpretation: "As you lower the Alert Threshold, the AI flags more events. Recall approaches 100% (you catch every real problem), but Precision plummets (you get flooded with false alarms). Finding the optimal threshold maximizes the F1 Score, providing the most useful alerts to the NOC.",
    parameters: [
      { id: "threshold", name: "AI Anomaly Threshold", min: 0.1, max: 0.9, default: 0.5, step: 0.1, unit: "" },
      { id: "noise", name: "Background Network Noise", min: 1, max: 50, default: 20, step: 1, unit: "%" }
    ]
  }
};
