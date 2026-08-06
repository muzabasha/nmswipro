import type { TopicData } from './types';

export const topic42Data: TopicData = {
  id: "u4t10",
  title: "Service Ordering",
  moduleName: "Unit IV: SDN, Network Observability, and Advanced Network Management",
  context: {
    prerequisites: ["Overview of Service Orchestration", "REST API Commands and Operation Flow"],
    dependentTopics: ["Service Assurance"],
    nextSteps: "Study Service Assurance to understand how ordered services are continuously monitored against SLA commitments after they go live.",
    rfcReferences: [
      { name: "TM Forum TMF622", relevance: "Product Ordering Management API — standardises the customer-facing order lifecycle from submission through validation, provisioning, and completion with state tracking." },
      { name: "TM Forum TMF641", relevance: "Service Ordering Management API — defines the decomposition of product orders into service/resource orders with compensating transaction support for rollback." },
      { rfc: "RFC 7807", title: "Problem Details for HTTP APIs", summary: "Standard error response format for REST APIs — used by service ordering systems to return structured error details for failed order validation.", url: "https://www.rfc-editor.org/rfc/rfc7807" },
      { rfc: "RFC 7231", title: "HTTP Semantics and Content", summary: "Defines HTTP methods (GET, POST, PUT, PATCH, DELETE) and status codes used in RESTful order management API implementations.", url: "https://www.rfc-editor.org/rfc/rfc7231" },
      { name: "ONAP SO BPMN Workflow Documentation", relevance: "Defines the BPMN-based saga pattern implementation for multi-step service orders — each forward action registers a compensating rollback action." },
      { name: "Event Sourcing and CQRS Pattern", relevance: "Architectural pattern for asynchronous order processing — event-sourced order state enables reliable status tracking and replay for audit/compliance." }
    ]
  },
  storytelling: {
    analogy: "An Online Order Management System for Network Services",
    story: "Service ordering in telecom is identical to e-commerce order management — just with network resources instead of physical goods. A customer requests a new L3 VPN service (places an order). The BSS validates the order against the product catalog (checks availability). The OSS decomposes the service order into resource orders: reserve MPLS circuits, configure PE routers, provision WAN bandwidth, activate CPE. Each resource order is fulfilled by the relevant domain. Progress is tracked through states: pending → validating → in_progress → completed or failed. If CPE activation fails after the MPLS circuit is provisioned, a compensating transaction rolls back the circuit reservation — just like an e-commerce refund reverses a payment when a warehouse is out of stock. TMF Open API TMF622 (Product Ordering Management API) standardises this flow so any BSS/OSS combination can interoperate — a customer placing an order through Salesforce CRM can trigger provisioning in Nokia NSP without custom integration code.",
    reflectiveQuestions: [
      "Why is a synchronous REST API chain unsuitable for multi-domain service orders with VNF instantiation steps that take minutes?",
      "How does the saga pattern with compensating transactions prevent partial service states when one provisioning domain fails?",
      "What is the role of TMF622 in decoupling the customer-facing order portal from the internal provisioning workflow?"
    ],
    technicalConnection: "**TM Forum TMF622 Product Order API**: POST /productOrder body: {externalId: 'CRM-12345', description: 'SD-WAN 100Mbps', requestedStartDate: '2025-01-20T00:00:00Z', requestedCompletionDate: '2025-01-25T23:59:59Z', productOrderItem: [{id: '1', action: 'add', product: {productCharacteristic: [{name: 'bandwidth', value: '100Mbps'}, {name: 'site_count', value: '5'}], productSpecification: {id: 'sdwan-spec-v2', href: '/productCatalog/productSpecification/sdwan-v2'}}}]}. Response: 201 Created, Location: /productOrder/ORDER-789, body: {id: 'ORDER-789', state: 'acknowledged', orderDate: '2025-01-15T10:30:00Z', productOrderItem: [{id: '1', state: 'acknowledged'}]}. **TMF622 State Machine**: acknowledged → [validation: check inventory, credit, feasibility] → [pass: pending | fail: rejected] → pending → [resource allocation begins] → inProgress → [provisioning completes] → completed | [any step fails] → failed | [manual hold] → held → [resume] → inProgress. Terminal states: completed, failed, partial, cancelled. **TMF641 Service Order Decomposition**: Product Order (customer-facing) → Service Order (service-layer: underlay MPLS + overlay SD-WAN) → Resource Order (network-element-layer: PE router config + VNF instantiate + CPE activate). TMF641 POST /serviceOrder body: {serviceOrderItem: [{service: {serviceType: 'MPLS_VPN', serviceCharacteristic: [{name: 'vrf_name', value: 'CUST-A-VRF'}, {name: 'route_target', value: '65000:100'}]}}]}. Each serviceOrderItem maps to domain-specific provisioning API calls. **RFC 7807 Problem Details for HTTP**: Error response format for failed validation. HTTP 400 Bad Request, body: {type: '/errors/invalid-bandwidth', title: 'Invalid Bandwidth Value', status: 400, detail: 'Requested bandwidth 100Mbps exceeds customer entitlement of 50Mbps', instance: '/productOrder/ORDER-789/item/1', invalidParams: [{name: 'bandwidth', reason: 'exceeds entitlement'}]}. Client parses 'type' URI to determine error category. **Event Sourcing Pattern**: Order state stored as immutable event log, not mutable record. Events: OrderSubmitted(orderId, customerId, items), OrderAcknowledged(orderId, timestamp), ProvisioningStarted(orderId, domainId), ProvisioningCompleted(orderId, domainId, resourceIds), OrderCompleted(orderId). Current order state = fold(events, initialState). Enables audit trail, replay for debugging, and temporal queries ('what was order state at 14:00 yesterday?'). Event store: Kafka topic 'order-events' with key=orderId, compaction disabled (retain all events). **ONAP SO BPMN Order Processing**: External API receives TMF622 order → publishes OrderSubmitted event → SO consumes event → executes BPMN workflow 'ProvisionSDWAN'. Workflow tasks: [ValidateOrder serviceTask → queries inventory], [ReserveMPLS callActivity → calls NFVO], [InstantiateSDWAN_VNF callActivity → calls VNFM], [ActivateCPE callActivity → calls ZTP server], [UpdateOrderState serviceTask → publishes OrderCompleted event]. Async execution: client polls GET /productOrder/ORDER-789 which queries event-sourced state projection. **Compensating Transaction Registration**: Step 1: ReserveMPLS succeeds → register compensation ReleaseMPLS(circuit_id=C123). Step 2: InstantiateVNF succeeds → register TerminateVNF(vnf_instance_id=VNF-456). Step 3: ActivateCPE fails → saga engine executes [TerminateVNF(VNF-456), ReleaseMPLS(C123)] in reverse. BPMN: each callActivity has <boundaryEvent><errorEventDefinition errorRef='ProvisioningError'/></boundaryEvent> → triggers compensation subprocess. **Asynchronous 202 Accepted Pattern**: POST /productOrder returns immediately with HTTP 202 Accepted, Location: /productOrder/ORDER-789, body: {id: 'ORDER-789', state: 'acknowledged', '@baseType': 'ProductOrder', href: '/productOrder/ORDER-789'}. Customer portal displays 'Order submitted' and polls GET /productOrder/ORDER-789 every 5 seconds. Webhook callback (optional): customer registers callback URL in order submission → OSS POSTs state changes to customer webhook: POST https://customer.com/orderNotifications body: {eventType: 'ProductOrderStateChangeEvent', event: {productOrder: {id: 'ORDER-789', state: 'completed'}}}."
  },
  mathModelling: {
    need: "A large telco's BSS team is designing the order management flow for a new SD-WAN managed service sold to 500 enterprise customers. Each order involves: BSS product catalog validation, credit check, OSS resource inventory check, and provisioning across 3 domains (underlay MPLS, overlay SD-WAN VNF, CPE activation). The team evaluates: synchronous (blocking) REST API chain, asynchronous event-driven workflow, or a saga pattern with compensating transactions. Constraint: customer portal must respond within 3 seconds of order submission. 500 orders/day peak. Any single domain failure must not leave the customer in an unrecoverable partial state.",
    equation: "DECISION CONSTRAINT: Customer portal response ≤ 3 seconds (latency budget). Peak throughput: 500 orders/day = ~0.006 orders/second. Partial order state is unacceptable — a failed domain provisioning must trigger automatic rollback. Order status must be queryable at any point during processing.",
    technicalDetails: "Synchronous REST API chain: Order UI → BSS → OSS (inventory) → Domain 1 (MPLS) → Domain 2 (SD-WAN VNF) → Domain 3 (CPE). Total latency: 500ms (BSS) + 300ms (inventory) + 2000ms (MPLS) + 3000ms (VNF instantiation) + 5000ms (CPE activation) = 10.8 seconds. Violates the 3-second portal response constraint by 3.6×. Asynchronous event-driven (Kafka/NATS): Order UI receives immediate 202 Accepted (50ms) with an order ID. Provisioning proceeds asynchronously via event topics: order-submitted → inventory-reserved → domain-provisioned. Customer polls GET /orders/{id} for status. Portal response = 50ms — well within 3 seconds. Individual domain failures publish compensation events to reverse previous steps. Saga Pattern with Compensating Transactions: Extends the async pattern with explicit rollback actions per step. If CPE activation fails after MPLS and VNF are provisioned, the saga engine calls rollback-VNF and release-MPLS in reverse order. Guarantees eventual consistency without distributed transactions.",
    explanation: [
      { term: "Synchronous REST API Chain", meaning: "Adopted for simple, fast, single-domain operations where all steps complete in <1 second total (e.g., DNS record creation, VLAN assignment on a single switch). Fails the 3-second constraint for multi-domain service orders with VNF instantiation. Never appropriate when any individual step can take >500ms in a user-facing workflow." },
      { term: "Asynchronous Event-Driven Workflow (Recommended)", meaning: "Adopted for multi-step, multi-domain order management where individual steps have variable and long execution times. Returns 202 Accepted immediately (50ms), meeting the 3-second portal constraint. Standard pattern in all modern telco BSS/OSS stacks (ONAP BPMN workflows, TM Forum Order Management). Combined with the saga pattern for rollback safety." },
      { term: "Saga Pattern with Compensating Transactions", meaning: "Adopted as the rollback mechanism within the asynchronous workflow. Each provisioning step registers a compensating action (rollback-MPLS, terminate-VNF, factory-reset-CPE). If any step fails, the saga engine executes compensating actions in reverse order. Prevents partial order states from persisting. Standard in microservices-based BSS architectures where distributed 2PC transactions are impractical across domain boundaries." }
    ],
    advantages: [
      "Asynchronous 202 Accepted pattern meets the 3-second portal response constraint with a 98% margin (50ms vs 3000ms budget)",
      "Event-driven architecture decouples the BSS from domain provisioning latency — CPE activation taking 30 minutes does not block the order API",
      "Saga compensating transactions guarantee no partial order state persists — every order either fully completes or fully rolls back regardless of which domain fails"
    ],
    limitations: [
      "Synchronous chaining is adopted for internal microservice calls within a single domain where all steps complete in milliseconds and strong consistency is required",
      "Two-phase commit (2PC) is adopted in legacy monolithic BSS systems that share a single database and cannot tolerate eventual consistency",
      "Workflow orchestration engines (Camunda, Temporal) are adopted as an alternative to raw event queues — they provide both async execution and saga semantics with built-in audit trails and human task escalation"
    ]
  },
  activities: {
    level1: "Define the TMF622 Product Ordering API order states: acknowledged, rejected, pending, inProgress, completed, failed, partial. For each state, describe the triggering event and the expected next state transition.",
    level2: "Draw a sequence diagram showing the complete order flow for an L3 VPN service: customer portal → BSS (TMF622) → OSS decomposition → MPLS domain → SD-WAN VNF domain → CPE activation. Include the 202 Accepted response at the start and the asynchronous completion callback at the end.",
    level3: "A service order has 4 provisioning steps with individual failure probabilities of 2%, 3%, 1%, and 4%. Calculate: (a) the probability that at least one step fails (without compensation), (b) the probability that a saga rollback successfully compensates a step-3 failure (assuming each compensating action has a 99% success rate).",
    level4: "Review TMF622 Product Ordering Management API v4.0 (available at tmforum.org). Identify the 5 mandatory fields in a POST /productOrder request body and explain the role of each. Then design a minimal productOrder JSON payload for a new 100 Mbps internet service."
  },
  projects: {
    scope: "Design and implement a service ordering microservice in Python (FastAPI) that handles SD-WAN service orders with asynchronous processing and saga-based rollback.",
    objectives: [
      "Implement POST /productOrder endpoint that returns 202 Accepted with an order ID within 100ms regardless of provisioning complexity",
      "Implement the 3-step provisioning workflow (MPLS reserve, VNF instantiate, CPE activate) using a task queue (Celery/Redis or asyncio tasks)",
      "Implement saga compensating transactions: if step N fails, execute rollback for all completed steps N-1 through 1 in reverse order"
    ],
    deliverables: [
      "FastAPI service with documented /productOrder (POST), /productOrder/{id} (GET status), /productOrder/{id}/cancel (DELETE) endpoints",
      "Saga workflow engine with forward and compensating task definitions for all 3 provisioning steps",
      "Test report demonstrating: happy path completion, step-2 failure with rollback of step-1, step-3 failure with rollback of steps 1-2"
    ]
  },
  questions: [
    {
      q: "What is the TMF622 Product Ordering Management API and why is it significant for telco service ordering?",
      a: "TMF622 is a TM Forum Open API standard that defines a RESTful interface for creating, retrieving, updating, and cancelling product orders in a telco environment. It is significant because: (1) It standardises the data model for product orders (productOrder, orderItem, productOrderItem states) enabling any BSS system to place orders into any OSS without custom integration; (2) It defines a standard state machine for order lifecycle management that all participating systems implement consistently; (3) It enables multi-vendor BSS/OSS ecosystems — a Salesforce CRM order portal can trigger provisioning in Nokia NSP, Ericsson ENM, or ONAP SO without bespoke adapters; (4) It is part of the TM Forum Open Digital Architecture, making it the standard choice for digital transformation programmes.",
      type: "Conceptual"
    },
    {
      q: "Explain the saga pattern and how compensating transactions prevent partial service states in multi-domain provisioning.",
      a: "The saga pattern is a design pattern for managing distributed transactions across multiple services without using a global lock (2PC). In service ordering: each provisioning step is a local transaction within one domain. Each step also registers a compensating transaction — the action that undoes the step if a later step fails. Execution: Step 1 (reserve MPLS circuit) completes and registers compensating action (release MPLS circuit). Step 2 (instantiate VNF) completes and registers compensating action (terminate VNF). Step 3 (activate CPE) fails. The saga engine detects the failure and executes compensating actions in reverse: terminate VNF → release MPLS circuit. Result: all resources return to their pre-order state — no partial provisioning persists. The customer's order moves to 'failed' state with a meaningful error reason. This is preferable to 2PC (which requires all domains to hold locks simultaneously) in microservices architectures where domains are independently owned and operated by different teams or vendors.",
      type: "Analytical"
    },
    {
      q: "A 4-step service order has step failure probabilities of 5%, 3%, 2%, 4%. Calculate: (a) the probability that all 4 steps succeed, (b) the probability that at least one step fails.",
      a: "(a) P(all succeed) = (1-0.05) × (1-0.03) × (1-0.02) × (1-0.04) = 0.95 × 0.97 × 0.98 × 0.96 = 0.95 × 0.97 = 0.9215; × 0.98 = 0.9031; × 0.96 = 0.867 = 86.7%. (b) P(at least one fails) = 1 - P(all succeed) = 1 - 0.867 = 0.133 = 13.3%. This means roughly 1 in 7 orders would fail without a retry mechanism. With saga rollback and automatic retry for transient failures (each step retried up to 3 times), the effective failure rate drops to near zero for transient issues, with only permanent failures triggering rollback.",
      type: "Numerical"
    },
    {
      q: "Why is a synchronous REST API chain unsuitable for a multi-domain service order that includes VNF instantiation?",
      a: "A synchronous REST API chain holds the client's HTTP connection open until all provisioning steps complete. VNF instantiation on an NFV platform (NFVO → VNFM → VIM → OpenStack Nova) typically takes 2-8 minutes depending on image pull, VM scheduling, and boot time. CPE activation (shipping configuration to a customer's physical router) can take 5-30 minutes. The customer's browser would display a loading spinner for 10+ minutes — an unacceptable UX that most clients and load balancers will timeout after 30-60 seconds, causing the request to be abandoned mid-provisioning. Even if the client waits, the BSS server is holding an open HTTP connection and blocking a thread for the entire duration — severely limiting the number of concurrent orders the system can handle. The correct pattern is: accept the order synchronously (202 Accepted in <100ms), process asynchronously, and provide a status polling or webhook callback mechanism.",
      type: "Analytical"
    },
    {
      q: "What are the key differences between TMF622 order states 'inProgress', 'partial', and 'failed'?",
      a: "'inProgress': The order has been validated and at least one provisioning action has been initiated but not all orderItems have completed. This is the normal executing state during multi-step provisioning. All subsequent poll responses will show this state until terminal. 'partial': A terminal state indicating that the order completed but some orderItems failed while others succeeded — the service is partially provisioned. This occurs when the operator explicitly designs the workflow to succeed partially (e.g., 8 of 10 site activations succeeded) rather than rolling back all sites on any single failure. Used for batch orders where partial delivery is acceptable. 'failed': A terminal state where the order could not be fulfilled and all provisioning actions have been rolled back (via saga compensating transactions). No service is active. The customer must place a new order to retry. The distinction between 'partial' and 'failed' depends on the operator's business decision — whether partial delivery provides business value to the customer or leaves them in an unusable state.",
      type: "Conceptual"
    }
  ],
  virtualLab: {
    description: "You are processing customer service orders through a multi-domain provisioning pipeline. Your task: determine the maximum number of orders your system can handle per hour given the order processing time per domain and the number of provisioning domains involved. Adjust the number of provisioning domains and the average processing time per domain. The chart shows synchronous chaining time — each domain adds linearly. Calculate the throughput limit: if each order takes 180 seconds (3 domains × 60 s), your system caps at 20 orders/hour. Use this to decide when parallel execution becomes necessary.",
    interpretation: "Synchronous chaining across 3 domains at 60 s each takes 180 s per order — capping throughput at 20 orders per hour. With 5 domains, each order takes 300 s — only 12 orders/hour. With asynchronous parallel execution, total time is bounded by the slowest domain (60 s), boosting throughput to 60 orders/hour. This is why modern service orchestrators decompose orders into independent domain-level subtasks and execute them concurrently. Use this lab to determine whether your order volume justifies async orchestration investment.",
    parameters: [
      { id: "domains", name: "Provisioning Domains", min: 1, max: 10, default: 3, step: 1, unit: "" },
      { id: "stepTime", name: "Avg Step Duration", min: 10, max: 300, default: 60, step: 10, unit: " s" }
    ],
    generateData: (params) => {
      const maxDomains = params.domains || 3;
      const stepTime = params.stepTime || 60;
      const pts: Array<{ x: number; y: number }> = [];
      for (let x = 1; x <= maxDomains; x++) {
        const syncTime = x * stepTime;
        pts.push({ x, y: syncTime });
      }
      return pts;
    },
    labels: { x: "Provisioning Domains", y: "Synchronous Total Time (s)" }
  }
};
