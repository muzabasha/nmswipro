import type { TopicData } from './types';

export const topic3Data: TopicData = {
  id: "u1t3",
  title: "The FCAPS Process",
  moduleName: "Unit 1: Introduction to Network Management",
  context: {
    prerequisites: ["Topic 1.2: EMS and NMS Architecture (SBI & NBI)", "Basic Troubleshooting"],
    dependentTopics: ["Topic 1.4: Introduction to SNMP (Architecture, Queries, Traps)", "Topic 3.1: Alarm Management & Fault Correlation (RCA & Suppression)"],
    nextSteps: "Study how SNMP is structured to query and trap events for the FCAPS management domains."
  },
  storytelling: {
    analogy: "The Airport Operations Tower",
    story: "Running an airport requires different specialized departments. The maintenance crew repairs runways and planes (Fault Management). The gate schedulers assign planes to gates and update flight paths (Configuration Management). The ticketing and baggage counters charge passengers for services (Accounting Management). The control tower monitors take-off speeds and fuel efficiency to optimize flow (Performance Management). Finally, the security checkpoints screen passengers and guard the perimeter (Security Management). If any department fails, the airport grinds to a halt. In networks, ISO defined the FCAPS model to represent these 5 essential domains.",
    reflectiveQuestions: ["What happens if an airport repairs runways (Fault) but forgets to update pilot flight paths (Configuration)?", "Why is accounting necessary even in internal private networks?"],
    technicalConnection: "FCAPS is the ISO standard management framework. Fault management detects and alerts on failures; Configuration manages device settings and provisioning; Accounting tracks usage for billing; Performance monitors network bandwidth, latency, and CPU usage; Security controls access keys, firewalls, and authentication."
  },
  mathModelling: {
    need: "To calculate network availability based on Mean Time Between Failures (MTBF) and Mean Time To Repair (MTTR), which are critical KPIs for Performance and Fault Management.",
    equation: "A = \\frac{MTBF}{MTBF + MTTR}",
    technicalDetails: "Availability \\(A\\) is the probability that a network service is operational at any given time. Mean Time Between Failures (MTBF) is the average time a device operates before failing, representing reliability. Mean Time To Repair (MTTR) is the average time taken to detect, diagnose, and fix a failure, representing maintainability. Minimizing MTTR via NMS automated alerting and fault isolation directly increases the overall availability of the network.",
    explanation: [
      { term: "A", meaning: "Availability: The ratio of uptime to total time (value between 0 and 1)." },
      { term: "MTBF", meaning: "Mean Time Between Failures: Expected operational lifetime of a component (hours)." },
      { term: "MTTR", meaning: "Mean Time To Repair: Expected time required to restore the service after a failure (hours)." }
    ],
    advantages: ["Directly maps to Service Level Agreement (SLA) percentage metrics.", "Helps evaluate the economic impact of investing in faster monitoring systems to reduce MTTR."],
    limitations: ["Does not account for scheduled downtime for maintenance or upgrades, which is typically excluded from SLAs."],
    simulation: {
      description: "Vary MTBF and MTTR to observe their effect on network availability. Watch how reducing MTTR recovers availability even with frequent failures.",
      parameters: [
        { id: "mtbf", name: "Mean Time Between Failures (MTBF)", min: 100, max: 10000, default: 2000, step: 100, unit: " hours" },
        { id: "mttr", name: "Mean Time To Repair (MTTR)", min: 0.1, max: 24, default: 2, step: 0.1, unit: " hours" }
      ]
    }
  },
  activities: {
    level1: "Teacher presents the five sectors of FCAPS with examples: Fault = Red Alarm, Config = VLAN change, Accounting = Billing log, Performance = Bandwidth chart, Security = Firewall logs.",
    level2: "Students classify a list of 10 daily network engineer tasks into one of the 5 FCAPS categories.",
    level3: "Roleplay: Students act as network administrators responding to a fiber cut, demonstrating the sequence of Fault detection, Config backup, Performance check, and Security logging.",
    level4: "Write a short essay (150 words) arguing which of the five FCAPS domains is most critical to a bank versus a university campus."
  },
  projects: {
    scope: "Create a set of operational templates for an enterprise network's FCAPS compliance.",
    objectives: ["Design a Fault severity scale (Critical, Major, Minor)", "Draft a Configuration change-control workflow checklist", "Draft a security incident reporting format"],
    deliverables: ["Operations Manual template (Word/PDF)", "FCAPS dashboard conceptual layout"]
  },
  questions: [
    { q: "What does the acronym FCAPS stand for in network management?", a: "Fault, Configuration, Accounting, Performance, and Security.", type: "Conceptual" },
    { q: "If a network router has an MTBF of 8000 hours and an MTTR of 4 hours, what is its percentage availability?", a: "A = 8000 / (8000 + 4) = 8000 / 8004 ≈ 0.9995 or 99.95% availability.", type: "Numerical" },
    { q: "Which FCAPS domain handles bandwidth utilization, packet loss rates, and link latency metrics?", a: "Performance Management.", type: "Conceptual" },
    { q: "How does Accounting Management differ from Performance Management?", a: "Performance Management focuses on link quality and resource utilization to keep the network healthy, whereas Accounting Management tracks user and resource usage metrics primarily for billing, auditing, or quota allocation.", type: "Analytical" },
    { q: "What role does an NMS play in minimizing the MTTR component of network availability?", a: "An NMS automates fault detection through polling or traps and correlates alarms to pinpoint the exact root cause of a failure, thereby reducing the discovery and diagnostic stages of MTTR.", type: "Analytical" }
  ],
  virtualLab: {
    description: "SLA Availability & Downtime Calculator. Calculate how many minutes of downtime are allowed per year for 'three-nines' up to 'five-nines' availability.",
    interpretation: "A 'five-nines' availability (99.999%) allows only 5.26 minutes of total downtime per year. To achieve this, the network must have instant fault detection and automated failovers, highlighting the role of performance metrics and rapid fault correlation.",
    parameters: [
      { id: "slaTarget", name: "SLA Target Availability (%)", min: 99.0, max: 99.999, default: 99.9, step: 0.001, unit: "%" }
    ]
  }
};
