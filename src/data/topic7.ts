import type { TopicData } from './types';

export const topic7Data: TopicData = {
  id: "u3t1",
  title: "The Limitations of SNMP & Rise of NETCONF",
  moduleName: "Unit 3: Modern Management",
  context: {
    prerequisites: ["SNMP Versions and Security", "SMI and MIBs"],
    dependentTopics: ["YANG Data Modeling Language"],
    nextSteps: "We will learn how NETCONF structures its configuration data using the YANG language in the next topic."
  },
  storytelling: {
    analogy: "The Mechanic vs. The Factory Assembly Line",
    story: "SNMP is like a mechanic tuning a car. They tweak one screw (OID), test it, tweak another, and test again. This is fine for monitoring, but terrible for configuring a thousand cars at once. If the mechanic makes a mistake on the 5th screw, they have to manually undo the first 4. NETCONF is like a modern assembly line. You send an entire blueprint (XML payload) for the car to the factory. The factory checks if the whole blueprint is valid. If it is, the car is built perfectly. If there's an error, the factory rejects the whole blueprint, leaving the car untouched (a rollback).",
    reflectiveQuestions: ["Why is it dangerous to change network configurations one variable at a time (like SNMP)?", "How does treating configuration as a 'blueprint' reduce human error?"],
    technicalConnection: "SNMP lacks a transaction model, meaning partial configurations can leave routers broken. NETCONF uses an RPC (Remote Procedure Call) model over SSH, passing XML payloads with full transactional support, allowing for atomic commits and rollbacks."
  },
  mathModelling: {
    need: "To quantify the downtime risk ($R_{down}$) of non-transactional configuration changes.",
    equation: "R_{down} = P_{error} \\times \\left( t_{detect} + \\sum_{i=1}^{k} t_{rollback_i} \\right)",
    technicalDetails: "When using SNMP to configure $k$ related variables sequentially, an error on the $k^{th}$ variable requires manually rolling back $k-1$ variables. The risk of downtime ($R_{down}$) depends on the probability of human error ($P_{error}$), the time it takes to detect the broken state ($t_{detect}$), and the time required to manually reverse the previous changes ($t_{rollback_i}$). NETCONF virtually eliminates this risk by making $t_{rollback}$ instantaneous via atomic transactions.",
    explanation: [
      { term: "R_{down}", meaning: "Total expected downtime risk in minutes." },
      { term: "P_{error}", meaning: "Probability of a configuration error occurring." },
      { term: "t_{detect}", meaning: "Time to realize the network is broken." },
      { term: "t_{rollback_i}", meaning: "Time to manually revert the $i$-th variable." }
    ],
    advantages: ["Clearly demonstrates the financial risk of manual CLI or SNMP configuration.", "Highlights the value of atomic transactions in NETCONF."],
    limitations: ["Does not account for automated scripts that might fail faster or slower than humans."]
  },
  activities: {
    level1: "Teacher shows a failed SNMP script that leaves a router with an IP address but no routing protocol.",
    level2: "Teacher + Students examine a simple NETCONF `<edit-config>` XML payload.",
    level3: "Group Activity: Students list 3 scenarios where a 'partial configuration' would cause a massive network outage.",
    level4: "Individual Task: Write a short explanation of why NETCONF relies on SSH rather than UDP."
  },
  projects: {
    scope: "Establish a NETCONF session using a Python script.",
    objectives: ["Use the `ncclient` library in Python", "Connect to a simulated router over SSH port 830", "Retrieve the `<running/>` configuration"],
    deliverables: ["A working Python script snippet", "The XML output received from the router"]
  },
  questions: [
    { q: "What is a major limitation of using SNMP for configuring devices?", a: "SNMP lacks a transaction model, meaning changes are applied one by one. A failure halfway through leaves the device in an unstable, partially configured state.", type: "Conceptual" },
    { q: "What transport protocol does NETCONF use to secure its communications?", a: "NETCONF operates over SSH (Secure Shell), typically on TCP port 830, ensuring strong encryption and authentication.", type: "Conceptual" },
    { q: "If an engineer takes 5 minutes to detect an error ($t_{detect}$) and 2 minutes to roll back each of 5 variables ($t_{rollback}$), what is the total recovery time?", a: "Recovery Time = 5 + (5 * 2) = 15 minutes.", type: "Numerical" },
    { q: "How does NETCONF solve the problem of partial configurations?", a: "NETCONF supports 'atomic transactions'. An entire configuration payload is validated before application; if any part fails, the entire change is rejected (rolled back) automatically.", type: "Analytical" },
    { q: "What data format does NETCONF primarily use to encode its Remote Procedure Calls (RPCs)?", a: "NETCONF uses XML (eXtensible Markup Language) to structure its requests and responses.", type: "Conceptual" }
  ],
  virtualLab: {
    description: "Simulation comparing Configuration Rollback Time between SNMP (Sequential) and NETCONF (Atomic).",
    interpretation: "Notice how, as the number of configuration variables increases, the recovery time for a failed SNMP script scales linearly, causing significant downtime. The NETCONF atomic transaction recovers instantly.",
    parameters: [
      { id: "varCount", name: "Number of Config Variables", min: 1, max: 50, default: 10, step: 1, unit: "" }
    ]
  }
};
