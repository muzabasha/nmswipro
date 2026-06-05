import type { TopicData } from './types';

export const topic5Data: TopicData = {
  id: "u2t2",
  title: "SMI and MIBs",
  moduleName: "Unit 2: SNMP and Legacy Protocols",
  context: {
    prerequisites: ["Introduction to SNMP"],
    dependentTopics: ["SNMP Versions and Security", "YANG Data Modeling Language"],
    nextSteps: "Now that we know the structure of the data, we will look at how different SNMP versions secure this data."
  },
  storytelling: {
    analogy: "The Universal Filing Cabinet",
    story: "Think of a massive, global filing cabinet. To find a specific document, you need a precise system. You start at the top drawer (ISO), go to the organization folder (DoD), then the internet folder, then private enterprises, and finally to a specific vendor's folder (like Cisco). Inside, there's a file for 'Router Uptime'. This hierarchy is the Object Identifier (OID) tree. The rules for how to write documents in these folders (what language to use, what data types are allowed) is the Structure of Management Information (SMI). The collection of all these folders for a specific device is the Management Information Base (MIB).",
    reflectiveQuestions: ["Why is a hierarchical tree structure better than a flat list of variables for managing millions of devices?", "If you invent a new type of router, how do you add it to this global filing cabinet?"],
    technicalConnection: "SMI defines the syntax and rules for creating MIBs. MIBs are virtual databases of managed objects, and OIDs are the unique numeric addresses (like 1.3.6.1.4.1...) used by SNMP to access those objects."
  },
  mathModelling: {
    need: "To calculate the storage memory required on an embedded agent device to hold its MIB tree.",
    equation: "M_{mib} = \\sum_{i=1}^{n} (S_{OID_i} + S_{Val_i} + S_{Meta_i})",
    technicalDetails: "The Memory of a MIB ($M_{mib}$) is the sum of the memory footprint of all $n$ objects it manages. Each object requires storage for its Object Identifier string ($S_{OID}$), its current value ($S_{Val}$), and metadata like access permissions and descriptions ($S_{Meta}$). Because embedded network devices (like IoT sensors or cheap switches) have very limited RAM, MIB designers must be mathematically precise about how many objects they expose, as a bloated MIB can cause the device to run out of memory.",
    explanation: [
      { term: "M_{mib}", meaning: "Total memory required to store the MIB." },
      { term: "n", meaning: "Total number of managed objects in the MIB." },
      { term: "S_{OID}", meaning: "Storage size of the Object Identifier." },
      { term: "S_{Val}", meaning: "Storage size of the object's value (e.g., 32-bit integer)." }
    ],
    advantages: ["Helps firmware developers allocate exact memory buffers for the SNMP agent.", "Prevents Out-Of-Memory (OOM) crashes on constrained network hardware."],
    limitations: ["Does not account for dynamic MIB tables whose sizes change at runtime (like a routing table)."]
  },
  activities: {
    level1: "Teacher displays an OID tree diagram and traces the path from the root down to `sysUpTime` (1.3.6.1.2.1.1.3.0).",
    level2: "Teacher + Students use a public MIB browser online to search for common OIDs and read their SMI definitions.",
    level3: "Group Activity: Students are given a list of objects (Temperature, Fan Speed, Firmware Version) and must write a pseudo-SMI definition specifying their data types (Integer, String, etc.).",
    level4: "Individual Task: Explain the difference between SMI and a MIB in a short paragraph."
  },
  projects: {
    scope: "Compile and browse a custom MIB file.",
    objectives: ["Download a vendor-specific MIB file (e.g., from a Cisco or HP switch)", "Load it into a free MIB Browser tool (like iReasoning or ManageEngine)", "Locate specific proprietary OIDs in the tree"],
    deliverables: ["Screenshots of the compiled MIB tree", "A table listing 5 interesting OIDs found and their data types"]
  },
  questions: [
    { q: "What is an Object Identifier (OID)?", a: "An OID is a sequence of numbers arranged hierarchically that uniquely identifies a specific managed object in a MIB.", type: "Conceptual" },
    { q: "In the filing cabinet analogy, what does the Structure of Management Information (SMI) represent?", a: "SMI represents the rules for how documents must be written (data types, syntax) so they can be properly stored and understood in the filing cabinet.", type: "Conceptual" },
    { q: "If an agent has 1,000 objects in its MIB, and each object requires 50 bytes for the OID, 4 bytes for the value, and 10 bytes for metadata, what is the total memory requirement $M_{mib}$?", a: "M_mib = 1000 * (50 + 4 + 10) = 1000 * 64 = 64,000 bytes (or 64 KB).", type: "Numerical" },
    { q: "Why do OIDs often end with a `.0` (like `1.3.6.1.2.1.1.3.0`)?", a: "The `.0` indicates a scalar object (an object with only a single instance, as opposed to a columnar object in a table).", type: "Analytical" },
    { q: "What is the relationship between SNMP and a MIB?", a: "A MIB is the database of objects (the 'Information Model'), while SNMP is the protocol used to read or write those objects (the 'Communication Model').", type: "Conceptual" }
  ],
  virtualLab: {
    description: "Navigate an interactive OID Tree to see how the naming hierarchy is constructed.",
    interpretation: "By expanding nodes from iso(1) -> org(3) -> dod(6) -> internet(1), you can see how the OID namespace is globally organized to prevent numbering collisions between different vendors.",
    parameters: [
      { id: "treeDepth", name: "Max Tree Depth Displayed", min: 1, max: 10, default: 4, unit: " levels" }
    ]
  }
};
