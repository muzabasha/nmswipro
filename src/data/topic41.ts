import type { TopicData } from './types';

export const topic41Data: TopicData = {
  id: "u4t9",
  title: "Overview of Service Orchestration",
  moduleName: "Unit IV: SDN, Network Observability, and Advanced Network Management",
  context: {
    prerequisites: ["Network Function Virtualization (NFV) Concepts (VIM, VNFM, NFVO)", "SDN Architecture and Concept"],
    dependentTopics: ["Service Ordering", "Service Assurance"],
    nextSteps: "Study Service Ordering to understand how customer orders trigger the orchestration workflows introduced in this topic.",
    rfcReferences: [
      { rfc: "ETSI GS NFV-SOL 001", title: "NFV Descriptors Based on TOSCA Specification", summary: "Defines the TOSCA-YAML schema for VNF Descriptors (VNFD) and Network Service Descriptors (NSD) — the foundation for TOSCA-based service orchestration.", url: "https://www.etsi.org/deliver/etsi_gs/NFV-SOL/001_099/001/" },
      { rfc: "ETSI GS NFV-SOL 005", title: "NFV Management and Orchestration — Interface Specification", summary: "Specifies Os-Ma-nfvo and Or-Vnfm interfaces for network service lifecycle management — the standard interface for ONAP SO to NFVO communication.", url: "https://www.etsi.org/deliver/etsi_gs/NFV-SOL/005_099/005/" },
      { rfc: "OASIS TOSCA v1.0", title: "Topology and Orchestration Specification for Cloud Applications", summary: "Standard for defining service topologies, workflows, and relationships — separates service design from orchestration engine implementation.", url: "https://docs.oasis-open.org/tosca/TOSCA/v1.0/TOSCA-v1.0.html" },
      { rfc: "RFC 6241", title: "NETCONF Protocol", summary: "Network Configuration Protocol for device configuration — used by orchestrator's CDS component for pre/post-instantiation NE configuration via NETCONF.", url: "https://www.rfc-editor.org/rfc/rfc6241" },
      { name: "TM Forum TMF640", relevance: "Service Activation and Configuration API — standardises service activation workflows triggered by the orchestrator across physical, virtual, and cloud domains." },
      { name: "ONAP Service Orchestrator (SO) Documentation", relevance: "ONAP SO BPMN workflow engine — translates TOSCA NSD into coordinated domain adapter calls with rollback-safe execution." }
    ]
  },
  storytelling: {
    analogy: "A Symphony Orchestra Conductor",
    story: "Service orchestration is the conductor of the network's symphony orchestra. Each instrument section — the VNF deployment team, the SDN controller, the physical NE configuration engine, the cloud resource manager — can play its part independently. But without a conductor, they produce noise rather than music: the strings (IP core) finish before the brass (cloud connectivity) even starts, creating a half-provisioned service with no customer value. The orchestrator receives a service order (play Beethoven's 9th — deploy an enterprise L3 VPN) and translates it into timed, coordinated instructions: activate the MPLS tunnel at bar 1, instantiate the vFirewall VNF at bar 8, configure the SD-WAN overlay at bar 12, provision the customer CPE at bar 16. Each domain executes its part on cue. If the vFirewall fails to come up (a musician drops their bow), the conductor pauses the performance, signals the strings to hold, and either retries or executes a clean abort — rolling back in reverse order. ONAP (Open Network Automation Platform) is the conductor for multi-domain 5G network services, translating customer intent into coordinated, auditable, rollback-safe provisioning across physical, virtual, and cloud-native domains.",
    reflectiveQuestions: [
      "Why is multi-domain service orchestration fundamentally different from single-domain automation — what makes it require a dedicated orchestrator?",
      "How does TOSCA (Topology and Orchestration Specification for Cloud Applications) abstract service design from the specific orchestration engine implementing it?",
      "What is the difference between a Network Service Descriptor (NSD) and the live Network Service Instance (NSI) it creates, and why must both be managed?"
    ],
    technicalConnection: "**ETSI GS NFV-SOL 001 TOSCA Schema**: node_types: tosca.nodes.nfv.VNF (VNF node template), tosca.nodes.nfv.VDU (Virtual Deployment Unit), tosca.nodes.nfv.VL (Virtual Link). VNFD example: node_type: tosca.nodes.nfv.VNF.vFirewall, properties: {descriptor_id: vfw-001, provider: vendor-X, version: 2.3.1, vnfm_info: [gvnfm-driver-v1]}, requirements: [{virtual_link: management_vl}, {virtual_link: data_vl}]. VDU specification: vdu_profile: {min_number_of_instances: 1, max: 3}, virtual_compute: {vcpu: 4, vmem: 8GB}, virtual_storage: {size: 40GB, type: ephemeral}, sw_image_data: {image: vfw-image-v2.3.1.qcow2, checksum: sha256:abc123...}. **ONAP SO BPMN Workflow Structure**: BPMN 2.0 XML — StartEvent → ServiceTask[ValidateInput] → ServiceTask[AllocateResources] → CallActivity[InstantiateVNF subprocess] → ServiceTask[ConfigureVNF via CDS] → Exclusive Gateway[Success?] → [Yes:CompletionEvent | No:ServiceTask[RollbackAll]]. BPMN subprocess for VNF instantiation: CallActivity[NFVO.instantiateVNF] with input {nsInstanceId, flavourId, instantiationLevelId, extVirtualLinks[]}. Compensation: BoundaryEvent(error) on InstantiateVNF → CompensationHandler[NFVO.terminateVNF]. **ETSI SOL005 Or-Vnfm Interface**: POST /vnf_instances creates VNFI (returns vnfInstanceId). POST /vnf_instances/{id}/instantiate body: {flavourId: 'default', instantiationLevelId: 'small', extVirtualLinks: [{id:'mgmt_net', resourceId:'neutron-net-uuid'}], vimConnectionInfo: {vimId: 'openstack-dc1', accessInfo: {project: 'nfv-project'}}}. VNFM responds 202 Accepted, begins async instantiation. Polling: GET /vnf_lcm_op_occs/{opId} returns {operationState: 'PROCESSING' | 'COMPLETED' | 'FAILED', vnfInstanceId}. **OASIS TOSCA Node Templates**: topology_template: node_templates: PE_Router_Config: type: netconf.nodes.Device, properties: {host: 10.0.1.1, port: 830, username: admin}, interfaces: Standard: {create: scripts/configure_bgp.py, delete: scripts/cleanup_bgp.py}. Relationship template: PE_to_VPN_Link: type: tosca.relationships.ConnectsTo, source: PE_Router, target: VPN_Overlay. **ONAP SO to NFVO API Call Sequence**: SO → POST http://nfvo:8080/nslcm/v1/ns_instances body: {nsdId: 'l3vpn-nsd-v1', nsName: 'customer-A-vpn', nsDescription: '100Mbps L3VPN'}. NFVO returns {nsInstanceId: 'ns-12345'}. SO → POST http://nfvo:8080/nslcm/v1/ns_instances/ns-12345/instantiate body: {nsFlavourId: 'default', sapData: [{sapdId: 'sap1', sapName: 'PE1-Gi0/1'}]}. NFVO orchestrates VNF instantiation across VNFMs. **CDS (Controller Design Studio) Workflow**: CDS Blueprint: resource-assignment processor resolves template variables by querying A&AI (Active and Available Inventory). Blueprint package: Templates/bgp-config.vtl (Velocity template with YANG-compliant XML), Scripts/pre-check.py (Python script validates reachability), Definitions/data-dictionary.json (maps variable 'customer_asn' to A&AI query path). CDS execution: ONAP SO calls POST /api/v1/execution-service/process with {blueprintName: 'configure-pe-router', blueprintVersion: '1.0', actionName: 'assign', payload: {customer_id: 'CUST-001'}}. CDS resolves all variables, renders config, pushes via NETCONF edit-config RPC. **Saga Pattern Compensating Transactions**: Forward action: InstantiateVNF → register compensation DeleteVNF with vnfInstanceId. Forward: ConfigurePE → register compensation RevertPEConfig with config_snapshot. Failure at step 3: saga engine executes compensations [RevertPEConfig(snapshot), DeleteVNF(vnfId)] in reverse order. BPMN compensation: <boundaryEvent attachedToRef='InstantiateVNF'><compensateEventDefinition /></boundaryEvent> → <serviceTask id='CompensateVNF' isForCompensation='true'>NFVO.terminate</serviceTask>. **NETCONF edit-config for Post-Instantiation**: <rpc message-id='101' xmlns='urn:ietf:params:xml:ns:netconf:base:1.0'><edit-config><target><candidate/></target><config><bgp xmlns='urn:ietf:params:xml:ns:yang:ietf-bgp'><global><as>65001</as></global><neighbors><neighbor><neighbor-address>10.0.1.2</neighbor-address><peer-as>65002</peer-as></neighbor></neighbors></bgp></config></edit-config></rpc>. CDS pushes this after VNF instantiation completes."
  },
  mathModelling: {
    need: "A cloud service provider must automate deployment of a new L3 VPN service across 5 operator domains (IP core, 4G RAN, 5G SA, SD-WAN, and cloud connectivity). The service has 47 distinct configuration steps spanning physical NEs, VNFs, and cloud resources. The team must choose an orchestration approach: manual NETCONF scripts per domain, TOSCA-based ETSI NFV orchestration (ONAP SO), or Kubernetes Helm chart orchestration for cloud-native NFs. Constraints: time-to-service must be <30 minutes, rollback must complete in <5 minutes on failure, and the solution must support all 5 domains without separate toolchains.",
    equation: "DECISION CONSTRAINT: Time-to-service ≤ 30 minutes for a 47-step deployment. Rollback time ≤ 5 minutes. Single toolchain must cover physical NEs, VNFs, and CNFs. Retry logic must handle transient failures without operator intervention.",
    technicalDetails: "Manual NETCONF Scripts per domain: Each domain team writes Python/ncclient scripts independently. 47 steps distributed across 5 teams with inter-domain dependencies managed via email/Slack coordination. Average deployment time: 4-8 hours (coordination overhead dominates). Rollback requires contacting each team. Violates both time constraints. TOSCA + ONAP SO: TOSCA NSD defines all 47 steps as nodes, relationships, and workflows. ONAP SO executes the workflow via BPMN engine, calling domain adapters (NFVO for VNFs, CDS for NE config, Kubernetes adapter for CNFs). Deployment time: 18-25 minutes. Rollback: ONAP SO reverse-workflow in 2-4 minutes. Meets all constraints. Kubernetes Helm Charts: Native for cloud-native NFs (AMF/SMF/UPF on K8s). helm rollback in <60 seconds for CNF portion. Cannot manage physical NEs or OpenStack VNFs without bridging adapters. TOSCA+Helm hybrid extends ONAP SO with a Kubernetes adapter, covering all 5 domains.",
    explanation: [
      { term: "Manual NETCONF Scripts Per Domain", meaning: "Adopted for simple, single-domain, infrequent changes where orchestration investment is not justified. Fails the time-to-service and rollback constraints for multi-domain services. Still used for emergency break-glass changes when the orchestration platform is unavailable." },
      { term: "TOSCA + ONAP SO Orchestration (Recommended)", meaning: "Adopted for multi-domain service orchestration where physical NEs, VNFs, and cloud resources must be managed from a single workflow engine. TOSCA templates are vendor-agnostic and define intent; ONAP SO translates intent into domain-specific API calls. Meets all three constraints: <25 minutes deployment, <4 minutes rollback, single toolchain across all 5 domains. The standard approach for Tier-1 operator service automation." },
      { term: "Kubernetes Helm Charts", meaning: "Adopted for cloud-native network function (CNF) deployments where all NFs are containerised on Kubernetes. Ideal for 5G SA cloud-native stacks. Native helm rollback in seconds. Scope-limited to CNFs — cannot manage physical NEs or OpenStack VNFs. Used alongside TOSCA in hybrid orchestration architectures." }
    ],
    advantages: [
      "TOSCA + ONAP SO meets the <30 minute time-to-service constraint with a 5-7 minute safety margin across all 5 domains",
      "Single BPMN workflow engine manages inter-domain step dependencies and retry logic — no manual coordination overhead between domain teams",
      "ONAP SO's reverse-workflow provides deterministic, automated rollback across all 5 domains in <4 minutes"
    ],
    limitations: [
      "Manual NETCONF scripts are adopted for break-glass emergency changes when orchestration is unavailable and first-action speed overrides rollback safety",
      "Helm-only orchestration is adopted for greenfield 5G SA cloud-native networks where all NFs are containerised and no physical NE or OpenStack VNF management is required",
      "Custom DSL orchestration (Ansible + AWX, SaltStack) is sometimes adopted by operators who already have large infrastructure automation teams skilled in those tools and want to avoid ONAP's learning curve"
    ]
  },
  activities: {
    level1: "Define the following service orchestration terms with one sentence each: NSD (Network Service Descriptor), VNF Descriptor, TOSCA, BPMN workflow, ONAP SO, and CDS. For each, identify whether it is a design-time artefact, a runtime component, or both.",
    level2: "Draw the ONAP service orchestration workflow for an L3 VPN service order: customer order → SO BPMN execution → NFVO VNF instantiation → CDS NE configuration → completion callback. Label each ONAP component, the API protocol between them (REST/NETCONF/gRPC), and the domain adapter used for each domain.",
    level3: "A service deployment has 5 sequential steps with individual durations of 3, 8, 12, 5, and 7 minutes (synchronous). Calculate: (a) total deployment time, (b) time saved if steps 1 and 2 can be parallelised, (c) time saved if steps 4 and 5 can also be parallelised. What is the minimum achievable deployment time?",
    level4: "Review the ETSI SOL001 standard (TOSCA profile for NFV) and write a minimal TOSCA node template for a virtual Firewall VNF. Include: node_type, properties (vCPU count, vRAM, VDU image URL), requirements (virtual_link for management and data interfaces), and one TOSCA workflow step (instantiate)."
  },
  projects: {
    scope: "Design a multi-domain service orchestration workflow for a campus SD-WAN deployment using ONAP SO concepts.",
    objectives: [
      "Define a TOSCA NSD (as a YAML file) for a 3-domain SD-WAN service: underlay MPLS circuit (IP core domain), SD-WAN overlay VNF (NFV domain), and CPE on-boarding (physical domain)",
      "Implement a Python simulation of the ONAP SO BPMN workflow: execute each step in dependency order, implement retry (max 3 attempts per step), and implement rollback (reverse order) on permanent failure",
      "Demonstrate the rollback workflow: simulate a VNF instantiation failure at step 2, verify that step 1 (MPLS circuit) is released in the rollback sequence"
    ],
    deliverables: [
      "TOSCA NSD YAML file with all 3 domain nodes, relationships, and instantiate/rollback workflow definitions",
      "Python SO simulation with logged execution: forward steps with timestamps, retry attempts, and rollback sequence on failure",
      "Deployment time analysis: sequential vs parallelised execution, showing the time savings when independent steps run concurrently"
    ]
  },
  questions: [
    {
      q: "What is the difference between a Network Service Descriptor (NSD) and a Network Service Instance (NSI)?",
      a: "An NSD (Network Service Descriptor) is a design-time template — a TOSCA document that defines the blueprint of a network service: the VNF components it requires, their connectivity, the resource profiles, SLA requirements, and the instantiation/scaling/termination workflows. It is created once by a service designer and stored in the ONAP SDC catalogue. It is reusable — the same NSD can be used to create many service instances. An NSI (Network Service Instance) is a runtime entity — the live deployment created by executing the NSD's instantiation workflow. It has a unique instance ID, references the specific VNF instances (VNFI), the specific virtual links, and the current operational state (instantiated, scaling, terminating). When a customer orders a service, SO creates one NSI from the NSD. When the service is terminated, the NSI is deleted but the NSD remains for future use. The distinction mirrors object-oriented programming: NSD is the class definition; NSI is an object instance.",
      type: "Conceptual"
    },
    {
      q: "What is TOSCA and why is it used as the service description language in ONAP rather than a proprietary format?",
      a: "TOSCA (Topology and Orchestration Specification for Cloud Applications) is an OASIS standard that provides a vendor-neutral language for describing cloud application topologies, their component relationships, and their management workflows. In ONAP: (1) Portability — a TOSCA NSD written for ONAP can theoretically be executed on any TOSCA-compatible orchestrator (OpenTOSCA, Cloudify). Vendor lock-in to a proprietary format is avoided. (2) Ecosystem — TOSCA has tooling support from multiple vendors: validation tools, design IDEs, and documentation generators. (3) ETSI NFV alignment — ETSI SOL001 defines a specific TOSCA profile for NFV, creating a direct mapping between ETSI NFV concepts (NSD, VNFD, VDU, VL) and TOSCA constructs. This means ETSI-compliant descriptors from any vendor's NFVO can be onboarded into ONAP SDC. (4) Expressiveness — TOSCA's node type, relationship type, and workflow constructs are rich enough to express complex multi-domain service topologies that proprietary JSON/YAML formats cannot capture without custom extensions.",
      type: "Conceptual"
    },
    {
      q: "A 6-step service deployment has step durations of 2, 5, 10, 3, 8, and 4 minutes. Steps 1-2 must be sequential. Steps 3 and 4 can be parallelised. Steps 5-6 must follow steps 3-4 and can be parallelised with each other. Calculate the minimum deployment time.",
      a: "Phase 1 (sequential): Step 1 (2 min) + Step 2 (5 min) = 7 minutes. Phase 2 (parallel): max(Step 3, Step 4) = max(10, 3) = 10 minutes. Phase 3 (parallel): max(Step 5, Step 6) = max(8, 4) = 8 minutes. Minimum total deployment time = 7 + 10 + 8 = 25 minutes. Compare to sequential execution: 2+5+10+3+8+4 = 32 minutes. Parallelisation saves 7 minutes (22% reduction). The critical path is steps 1→2→3→5 = 2+5+10+8 = 25 minutes.",
      type: "Numerical"
    },
    {
      q: "How does ONAP's CDS (Controller Design Studio) complement ONAP SO in service orchestration, and why are they separate components?",
      a: "ONAP SO (Service Orchestrator) manages the high-level service lifecycle workflow — it knows the sequence of steps to deploy a service (instantiate VNF A, configure NE B, connect virtual link C) and coordinates between NFVO, VNFM, and domain adapters. However, SO does not contain device-specific configuration logic. CDS (Controller Design Studio) fills this gap: it is a template-driven configuration execution engine that stores device-specific configuration templates (Jinja2/Velocity templates mapped to YANG data models) and resolves template variables by querying the ONAP inventory (AAI). When SO reaches a 'configure PE router' step in its workflow, it calls CDS with the instance context (VPN ID, customer AS number, interface allocations). CDS resolves all template variables, renders the NETCONF/RESTCONF payload, and sends it to the device. The separation exists because: (1) SO logic is service-level and vendor-agnostic; (2) CDS logic is device-level and vendor-specific. This separation allows device configuration templates to be updated independently when new software versions require different YANG paths, without modifying the SO workflow.",
      type: "Analytical"
    },
    {
      q: "What is a closed-loop automation policy in ONAP, and how does it extend service orchestration beyond initial deployment?",
      a: "A closed-loop automation policy in ONAP is an Event-Condition-Action (ECA) rule that enables the network to react to operational events without human intervention. Structure: Event = a DCAE-generated alert (e.g., 'VNF throughput >90% for 60 seconds'); Condition = additional guard conditions (e.g., 'service is in operational state', 'scale-out not already in progress'); Action = an ONAP SO API call (e.g., 'scale-out VNF instance, add 2 vCPUs'). Closed-loop policies extend orchestration beyond initial deployment by: (1) Auto-scaling — increasing or decreasing VNF capacity in response to demand changes without operator involvement; (2) Auto-healing — detecting a VNF health failure and triggering SO to terminate and re-instantiate the VNF on a healthy compute node; (3) SLA enforcement — detecting an impending SLA breach (rising latency) and triggering a traffic engineering reroute via the SDN controller before the breach occurs. This transforms ONAP from a one-time provisioning tool into a continuous service lifecycle management system — maintaining service quality from instantiation to decommissioning.",
      type: "Analytical"
    }
  ],
  virtualLab: {
    description: "You are orchestrating a 4-phase service deployment where phases execute sequentially but steps within each phase run in parallel. Your task: determine the total deployment time for sequential vs parallelised execution. Adjust the number of sequential phases and the maximum duration of the slowest step within each phase. The chart shows total time assuming all steps in a phase run in parallel (time = longest step per phase). Compare this to sequential execution where all steps run one after another — the gap shows the time-to-value benefit of parallel orchestration.",
    interpretation: "With 3 phases each containing 3-4 parallel steps, deployment time drops 40-60% vs sequential. A 4-phase deployment with 8-minute max steps completes in 32 minutes with parallelisation vs ~120 minutes sequentially (assuming 10 steps). This is why ONAP SO uses parallel BPMN gateway constructs: independent vCPU allocation, VNF image download, and network connectivity provisioning all happen concurrently. The time saving directly improves customer experience and reduces time-to-revenue for new services.",
    parameters: [
      { id: "phases", name: "Sequential Phases", min: 1, max: 6, default: 3, step: 1, unit: "" },
      { id: "stepDuration", name: "Max Step Duration", min: 1, max: 20, default: 8, step: 1, unit: " min" }
    ],
    generateData: (params) => {
      const maxPhases = params.phases || 3;
      const stepDuration = params.stepDuration || 8;
      const pts: Array<{ x: number; y: number }> = [];
      for (let x = 1; x <= maxPhases; x++) {
        const parallelTime = x * stepDuration;
        pts.push({ x, y: parallelTime });
      }
      return pts;
    },
    labels: { x: "Sequential Phases", y: "Minimum Deployment Time (min)" }
  }
};
