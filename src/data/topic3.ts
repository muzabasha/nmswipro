import type { TopicData } from './types';

export const topic3Data: TopicData = {
  id: "u1t3",
  title: "EMS and NMS Architecture",
  moduleName: "Unit I: Introduction to Network Management and Frameworks",
  context: {
    prerequisites: ["eTOM and TMN Framework", "Understanding of Mobile Network"],
    dependentTopics: ["FCAPS Process", "NMS SBI and NBI"],
    nextSteps: "Learn about the FCAPS management framework that defines what functions EMS and NMS must implement.",
    rfcReferences: [
      { rfc: "ITU-T M.3060", title: "Principles for the Management of Next Generation Networks", summary: "Defines the NMS/EMS hierarchical architecture and the interfaces between management layers relevant to this topic.", url: "https://www.itu.int/rec/T-REC-M.3060/en" },
      { rfc: "3GPP TS 32.101", title: "Telecommunication Management — Principles and High Level Requirements", summary: "3GPP's specification for the management system hierarchy including EMS and NMS roles in mobile networks.", url: "https://www.3gpp.org/ftp/Specs/archive/32_series/32.101/" },
      { rfc: "ITU-T M.3400", title: "TMN Management Functions", summary: "Specifies the management functions implemented by EMS and NMS systems, directly mapping to the alarm aggregation and correlation concepts in this topic.", url: "https://www.itu.int/rec/T-REC-M.3400/en" }
    ]
  },
  storytelling: {
    analogy: "A Hospital's Department Structure",
    story: "An EMS (Element Management System) is like a hospital department — it manages all the specialised equipment within one ward. For example, the Cardiology department (Ericsson EMS) manages all cardiac monitors and ECG machines (4G base stations). The Radiology department (Nokia EMS) manages all MRI and X-ray machines (5G gNBs). The hospital's central administration (NMS) doesn't interact directly with individual machines — it receives department-level reports and coordinates across all wards. When an MRI machine fails (network element fault), Radiology raises an alert to hospital administration, which orchestrates a response: notifying the on-call engineer, logging the incident, and tracking resolution. The NMS sees the whole hospital; the EMS only sees its ward. This separation is intentional — hospital administration cannot be expected to understand the clinical specifics of every machine, just as an NMS cannot hold vendor-specific knowledge for every network element type. Vendor-specific expertise lives in the EMS layer.",
    reflectiveQuestions: [
      "Why is it better to have domain-specific EMS systems rather than one monolithic NMS that manages everything directly?",
      "How does an NMS aggregate alarms from multiple EMS systems without being overwhelmed by raw event volume?",
      "What happens to NMS visibility and service assurance when one of its upstream EMS systems goes offline?"
    ],
    technicalConnection: "EMS manages a single-vendor or single-technology domain via the TMN Element Layer using the Q3 interface (SNMP/NETCONF/vendor proprietary). NMS sits above multiple EMSs at the TMN Network Management Layer, providing an end-to-end cross-domain network view. The NBI (Northbound Interface) exposes NMS data upward to OSS/BSS systems (typically REST APIs, SOAP, or CORBA/XML). The SBI (Southbound Interface) connects NMS downward to EMS layers, and EMS downward to NEs. Alarm correlation, root-cause analysis, and topology aggregation all happen at the NMS layer."
  },
  mathModelling: {
    need: "A mobile operator with 3 RAN vendors (Ericsson 4G, Nokia 5G NR, Huawei microwave transport) must deploy an NMS architecture. The constraint: a single operator dashboard must show all 20,000 network elements, alarm correlation must complete in under 5 seconds, and the architecture must survive failure of any single EMS without causing total management outage. Three architectures are evaluated: single monolithic NMS, three vendor-specific EMSes feeding one NMS, or a federated NMS with domain proxies.",
    equation: "DECISION CONSTRAINT: Alarm correlation time ≤ 5 seconds. EMS failure must not blind more than 33% of the network. All 20,000 NEs must be visible from single NOC screen. Polling cycle ≤ 15 minutes for all NEs.",
    technicalDetails: "Single monolithic NMS (no EMS): NMS directly manages all 20K NEs via SNMP/NETCONF. Single point of failure — NMS crash loses all visibility. Polling cycle for 20K devices with 500-byte PDUs at 1 Mbps SBI = 20K×500/125000 = 80 seconds. Meets polling target but correlation requires all 20K events in memory. Vendor EMS + central NMS: Ericsson ENM (6000 NEs), Nokia NetAct (7000 NEs), Huawei U2020 (7000 NEs) each pre-correlate domain alarms and forward root-cause alarms to central NMS. Single EMS failure blinds only one domain (33% max). Alarm correlation <1 second at NMS (receives pre-correlated events). Federated NMS with domain proxies: similar to EMS+NMS but uses standard NETCONF/YANG and REST APIs between layers, enabling vendor replacement without NMS changes.",
    explanation: [
      { term: "Single Monolithic NMS", meaning: "Adopted for small homogeneous networks (<2000 NEs, single vendor) where simplicity is paramount. Fails the resilience and polling constraints at 20K NE scale. Not suitable for multi-vendor production environments." },
      { term: "Vendor EMS + Central NMS (Recommended)", meaning: "Adopted when the operator has a multi-vendor network and requires vendor-specific deep management (SON, advanced KPIs) alongside cross-domain correlation. Each vendor EMS handles domain-specific events; the NMS handles cross-domain service correlation. Meets all constraints: resilience, correlation time, and unified visibility." },
      { term: "Federated NMS with Domain Proxies", meaning: "Adopted when the operator plans to change vendors frequently and needs a vendor-agnostic architecture. Domain proxies implement standard interfaces (NETCONF, 3GPP IRP REST) regardless of the underlying EMS vendor. Higher upfront design cost but lower long-term vendor lock-in." }
    ],
    advantages: [
      "EMS per domain provides vendor-specific deep management capabilities that a generic NMS cannot match",
      "Pre-correlation at EMS reduces NMS alarm volume by 5-10x, enabling sub-second cross-domain correlation",
      "Domain isolation means a vendor EMS outage affects only that domain — 2/3 of the network remains visible"
    ],
    limitations: [
      "Monolithic NMS is appropriate for small single-vendor networks where simplicity outweighs resilience",
      "Federated proxies are adopted when vendor independence is a strategic priority over short-term deployment speed",
      "Vendor EMS + NMS is sometimes replaced by ONAP in cloud-native environments for end-to-end automation"
    ]
  },
  activities: {
    level1: "Define the following management systems and draw the four-tier management hierarchy diagram: NE (Network Element), EMS (Element Management System), NMS (Network Management System), OSS (Operations Support System), BSS (Business Support System). Label the interfaces between each tier.",
    level2: "Explain the role of the Northbound Interface (NBI) and Southbound Interface (SBI) in NMS architecture. For each interface, state: (a) which systems it connects, (b) the protocols commonly used (REST, SNMP, NETCONF, CORBA), and (c) what data flows across it.",
    level3: "Given 5 EMS domains each generating 80 raw alarms in a 15-minute window, and the NMS correlates these into 60 root-cause alarms, calculate R_agg. Interpret the result: is this a good aggregation ratio?",
    level4: "Research a commercial NMS product — Nokia NetAct, Ericsson ENM (Evolved Network Manager), or Huawei U2000 — and document its architecture. Identify: how many EMS domains it supports, what NBIs it exposes, and how it implements alarm correlation."
  },
  projects: {
    scope: "Design a complete NMS architecture for a hypothetical multi-vendor mobile operator with three technology domains: 4G LTE (Ericsson RAN), 5G NR (Nokia RAN), and Microwave Transport (Huawei).",
    objectives: [
      "Define the EMS system for each domain, specify their vendor protocols (Q3/SNMP/NETCONF), and draw all interface connections",
      "Design the NMS alarm aggregation pipeline: raw alarm ingestion, de-duplication, correlation engine, and root-cause alarm presentation",
      "Specify three NBI API endpoints that the NMS exposes to the OSS for alarm retrieval, performance data collection, and configuration push"
    ],
    deliverables: [
      "Architecture diagram showing all NEs, EMS systems, NMS, OSS/BSS with labeled interfaces (SBI, Q3, NBI, X)",
      "Alarm aggregation calculation table showing raw alarm counts per domain, total, correlated count, and R_agg",
      "API specification document defining 3 NBI REST endpoints (URL, method, request/response schema, authentication)"
    ]
  },
  questions: [
    {
      q: "What is the key architectural difference between an EMS and an NMS?",
      a: "An EMS (Element Management System) manages a single-vendor or single-technology domain. It uses vendor-specific protocols (proprietary CLI, SNMP MIBs, NETCONF YANG models) to communicate directly with network elements via the Q3 interface. It has deep, vendor-specific knowledge of each element type. An NMS (Network Management System) sits one layer above, managing multiple EMS domains. It receives normalised, vendor-agnostic events from each EMS and provides a cross-domain, end-to-end network view. The NMS does not communicate directly with NEs — it relies on EMS for element-level data and adds correlation, topology aggregation, and service-level visibility that no single EMS can provide alone.",
      type: "Conceptual"
    },
    {
      q: "What interfaces connect EMS to NMS (SBI) and NMS to OSS/BSS (NBI), and what protocols are typically used?",
      a: "The Southbound Interface (SBI) connects the NMS downward to EMS systems. It commonly uses SNMP (trap forwarding, polling), NETCONF/YANG (configuration and state), CORBA/CMIP (legacy TMN Q3 implementations), or vendor REST APIs. The Northbound Interface (NBI) connects the NMS upward to OSS/BSS platforms. It typically exposes REST/HTTP APIs (JSON/XML), SOAP/XML Web Services, or 3GPP-defined interfaces (Itf-N for 3GPP OSS). The NBI is the integration point for service assurance platforms, ticketing systems (ServiceNow), and analytics engines.",
      type: "Conceptual"
    },
    {
      q: "Calculate R_agg given 4 EMS domains each generating 60 raw alarms, and the NMS correlates these into 48 root-cause alarms.",
      a: "Total raw alarms = 4 × 60 = 240. Correlated alarms at NMS = 48. R_agg = 240 / 48 = 5.0. An aggregation ratio of 5 means the operator sees 1 actionable alarm for every 5 raw events — a reasonable level of alarm compression. To further improve this, additional correlation rules and topology-aware grouping could be applied.",
      type: "Numerical"
    },
    {
      q: "What are the risks of operating a large network with a single NMS that manages all NEs directly, without an intermediate EMS layer?",
      a: "Without EMS, the NMS must handle: (1) Scale — directly polling thousands of NEs floods the NMS with raw SNMP/NETCONF traffic, creating a single point of performance bottleneck; (2) Vendor heterogeneity — the NMS must implement vendor-specific protocol drivers, MIBs, and YANG models for every NE type, creating maintenance complexity; (3) Alarm volume — unfiltered raw events from all elements simultaneously cause extreme alarm fatigue with no domain-level pre-correlation; (4) Single point of failure — if the NMS is overwhelmed or fails, all visibility is lost across the entire network; (5) Change management — software upgrades to the NMS affect all element management simultaneously, increasing operational risk.",
      type: "Analytical"
    },
    {
      q: "How does an NMS support multi-vendor environments where each vendor uses different management protocols?",
      a: "An NMS supports multi-vendor environments through: (1) EMS abstraction — each vendor's EMS translates vendor-specific protocols (proprietary TL1, SNMP MIBs, NETCONF YANG) into a normalised interface before delivering data to the NMS; (2) Protocol adapters / mediation layer — for NEs without a dedicated EMS, the NMS uses mediation adapters that handle protocol translation internally; (3) Unified data model — the NMS normalises all incoming data into a common information model (e.g., 3GPP IRP, TM Forum SID) regardless of source vendor; (4) Open APIs — the NMS exposes vendor-agnostic REST/JSON NBIs to OSS/BSS, shielding upstream systems from vendor differences; (5) Standards compliance — adoption of NETCONF/YANG with standard YANG modules (IETF, OpenConfig, 3GPP) reduces per-vendor customisation.",
      type: "Conceptual"
    }
  ],
  virtualLab: {
    description: "This lab simulates how the NMS alarm aggregation ratio changes as more EMS domains are added to the managed network. Each domain generates a fixed number of raw alarms, and the NMS correlates approximately 15% of total alarms into root-cause alarms. Adjust domain count and raw alarms per domain to explore the aggregation benefit.",
    interpretation: "As the number of managed EMS domains increases, the total alarm volume grows — but the aggregation ratio remains stable around 1/0.15 ≈ 6.67. This demonstrates that the NMS provides consistent compression regardless of scale, and why hierarchical EMS→NMS management is essential in large multi-domain networks: the EMS pre-filters domain-specific noise, and the NMS applies cross-domain correlation to produce a manageable alert stream for operators.",
    parameters: [
      { id: "domains", name: "EMS Domains", min: 1, max: 10, default: 4, step: 1, unit: "" },
      { id: "rawAlarms", name: "Raw Alarms per Domain", min: 10, max: 200, default: 50, step: 10, unit: "" }
    ],
    generateData: (params) => {
      const maxDomains = params.domains || 4;
      const rawAlarms = params.rawAlarms || 50;
      const pts: Array<{ x: number; y: number }> = [];
      for (let x = 1; x <= maxDomains; x++) {
        const total = x * rawAlarms;
        const correlated = Math.ceil(total * 0.15);
        const ratio = total / correlated;
        pts.push({ x, y: parseFloat(ratio.toFixed(2)) });
      }
      return pts;
    },
    labels: { x: "EMS Domains", y: "Aggregation Ratio" }
  }
};
