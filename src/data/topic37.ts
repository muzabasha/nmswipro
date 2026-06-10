import type { TopicData } from './types';

export const topic37Data: TopicData = {
  id: "u4t5",
  title: "Importance of Network Observability for Business",
  moduleName: "Unit IV: SDN, Network Observability, and Advanced Network Management",
  context: {
    prerequisites: ["Network Observability vs Network Monitoring"],
    dependentTopics: ["Techniques and Tools of Network Observability"],
    nextSteps: "Study Techniques and Tools of Network Observability to understand the technical instruments — streaming telemetry, EBPF, distributed tracing, log aggregation, and flow telemetry — that make business-impacting observability operationally achievable.",
    rfcReferences: [
      { name: "TM Forum TMF641", relevance: "Service Ordering Management API — links network configuration events to business service orders, enabling end-to-end SLA tracking from order to activation." },
      { name: "TM Forum TMF640", relevance: "Service Activation and Configuration API — tracks service provisioning impact on business SLAs, ensuring activation time and quality meet contractual commitments." },
      { name: "TM Forum TMF642", relevance: "Alarm Management API — correlates network alarms with business service impact, enabling service-level fault management beyond element-level alarm handling." },
      { name: "OpenTelemetry Baggage", relevance: "Context propagation standard — carries customer_id, transaction_id, and order_value through distributed traces for business-aware observability." },
      { rfc: "RFC 8639", title: "Subscription to YANG Notifications", summary: "YANG-Push streaming telemetry protocol — enables real-time SLA compliance monitoring with sub-second telemetry granularity.", url: "https://www.rfc-editor.org/rfc/rfc8639" },
      { name: "ITU-T E.800", relevance: "Quality of Service (QoS) framework — defines availability (percentage uptime), reliability (MTBF), and serviceability metrics for business SLA measurement." }
    ]
  },
  storytelling: {
    analogy: "A Business Intelligence Dashboard for the Network",
    story: "For decades, the network team operated as a cost centre — a technical department that kept the lights on but had limited visibility in boardroom discussions. Network monitoring produced availability reports (99.7% uptime last quarter) that meant little to a CFO who cared about revenue and customer satisfaction. Network observability transforms this dynamic by closing the loop between network performance and business outcomes, making the network team a strategic business partner. Every minute of network downtime now has a precise dollar figure: an e-commerce platform at $5,000/minute revenue loses $15,000 during a 3-minute outage at 9:15 AM. Observability answers the business questions that monitoring cannot: which 2,847 customers were affected by the VLAN 50 degradation from 14:32 to 14:37? What was the exact revenue impact? Is our SLA with that enterprise customer breached, triggering the penalty clause? These answers require correlating network telemetry with business data — customer identifiers, transaction IDs, application service maps, revenue data — capabilities that only a full observability stack provides. The cost avoidance argument extends beyond outages: observability reveals that 80% of expensive MPLS WAN bandwidth is consumed by a single application (Microsoft Teams video) that could be redirected to cheaper internet with SD-WAN, saving $200,000/year in WAN costs. It reveals that three servers are consuming 60% of core switch capacity but representing only 2% of business revenue — candidates for rate limiting that frees bandwidth for revenue-critical applications. Observability also underpins SLA management: automated SLA compliance reports generated directly from observability data replace manual measurement, reduce dispute resolution time from weeks to hours, and provide legally defensible evidence for SLA credits. The business case for observability investment is not a technology argument — it is a financial one. The ROI calculation is straightforward: (ΔMTTD × revenue_loss_per_second + SLA_penalties_avoided + WAN_cost_savings) ÷ (observability_platform_cost + ops_overhead) > 1. For most organisations above $10M annual revenue, this ratio exceeds 3:1 within the first year.",
    reflectiveQuestions: [
      "How would you present the business case for a $200,000 observability platform investment to a CFO who currently approves only $50,000 for network monitoring tools?",
      "What data from an observability system would you use to justify adding a second MPLS circuit vs switching to SD-WAN — and how does observability make this decision data-driven rather than opinion-driven?",
      "How does per-customer observability change the relationship between a telecom operator and its enterprise customers — and what new service products does it enable?"
    ],
    technicalConnection: "Business-network integration: OpenTelemetry's baggage propagation carries business context (customer_id, transaction_id, order_value) through distributed traces, correlating network-layer events with application-layer business transactions. Grafana's business metrics can join network performance data (latency, packet loss) with business KPIs (conversion rate, revenue per minute) from the same dashboard. TMF Open API TMF641 (Service Order Management) and TMF640 (Service Activation and Configuration) link network provisioning events to business service orders, enabling end-to-end service SLA tracking from order placement through activation to ongoing operation. ONAP's DCAE (Data Collection, Analytics and Events) collects observability data and feeds it to policy engines for automated SLA enforcement."
  },
  mathModelling: {
    need: "To model the financial impact of network downtime as a function of revenue loss rate, downtime duration, and SLA penalty clauses. This model gives business stakeholders a concrete dollar figure for network reliability investments and justifies observability platform expenditure.",
    equation: "I_{down} = R_{rate} \\times T_{down} + P_{sla}",
    technicalDetails: "The total business impact of a network outage has two components. Direct revenue impact: \\( R_{rate} \\times T_{down} \\) — the revenue loss rate (dollars per minute) multiplied by the downtime duration in minutes. For an e-commerce site with $300,000/hour peak revenue: \\( R_{rate} = 5{,}000 \\) $/min. A 15-minute outage causes direct loss of \\( 5{,}000 \\times 15 = \\$75{,}000 \\). Indirect SLA penalty: \\( P_{sla} \\) — the contractual penalty triggered when cumulative downtime exceeds the SLA threshold. Enterprise SLA agreements typically define: 99.9% uptime = 43.8 min/month allowed downtime; breach triggers 10% monthly recurring charge (MRC) credit. For a $50,000/month service, a breach penalty is \\( P_{sla} = \\$5{,}000 \\). Total impact: \\( I_{down} = 75{,}000 + 5{,}000 = \\$80{,}000 \\). Observability reduces \\( T_{down} \\) by reducing MTTD + MTTR. If observability reduces total incident duration by 8 minutes: savings = \\( 5{,}000 \\times 8 + \\$5{,}000 \\) (penalty avoided) = \\$45{,}000 per incident.",
    explanation: [
      { term: "I_{down}", meaning: "Total business impact of network downtime in dollars — combining direct revenue loss and contractual SLA penalties" },
      { term: "R_{rate}", meaning: "Revenue loss rate during downtime in dollars per minute — varies by business type, time of day, and affected customer segment" },
      { term: "T_{down}", meaning: "Total downtime duration in minutes — reduced by faster MTTD and MTTR enabled by observability" },
      { term: "P_{sla}", meaning: "SLA penalty triggered when downtime exceeds the contractual availability threshold — typically a percentage of monthly recurring charge" }
    ],
    advantages: [
      "Provides a direct financial justification for observability investment — comparing platform cost against I_down avoided per year",
      "Enables business-level SLA discussions: operators can quote exact penalty exposure for a given outage scenario before committing to SLA terms",
      "Motivates proactive observability: if I_down for a 30-minute outage is $200,000, spending $5,000/month on observability has a break-even at less than 2 incidents avoided per year"
    ],
    limitations: [
      "R_rate is highly variable by time of day, season, and affected customer segment — a single average value masks the true variance in impact",
      "Does not include indirect costs: reputational damage, customer churn, SLA renegotiation effort, or support call costs during and after outages",
      "Assumes linear revenue loss during downtime — some businesses recover quickly after restoration (deferred transactions complete) while others have permanent revenue loss"
    ],
    simulation: {
      description: "Adjust the revenue loss rate and downtime duration to see total business impact. The SLA penalty is modelled as a fixed trigger at 10 minutes downtime. This illustrates why even small improvements in MTTD+MTTR translate to large financial savings.",
      parameters: [
        { id: "revenue_rate", name: "Revenue Loss Rate ($/min)", min: 100, max: 10000, default: 5000, step: 100, unit: " $/min" },
        { id: "downtime", name: "Downtime Duration (min)", min: 1, max: 60, default: 15, step: 1, unit: " min" }
      ],
      generateData: (params: Record<string, number>): Array<{ x: number; y: number }> => {
        const revenue_rate = params.revenue_rate || 5000;
        const downtime = params.downtime || 15;
        const sla_penalty = 5000;
        const sla_threshold = 10;
        const pts: Array<{ x: number; y: number }> = [];
        for (let x = 1; x <= downtime; x++) {
          const direct = revenue_rate * x;
          const penalty = x >= sla_threshold ? sla_penalty : 0;
          pts.push({ x, y: direct + penalty });
        }
        return pts;
      },
      labels: { x: "Downtime Duration (min)", y: "Business Impact ($)" }
    }
  },
  activities: {
    level1: "List five specific business questions that network observability can answer but traditional monitoring cannot. For each question, identify: (a) which observability pillar(s) (metrics, logs, traces) provide the data needed, (b) which specific tool would provide the answer, and (c) the business decision that answer enables.",
    level2: "Construct a business case for observability investment for a mid-size e-commerce company with: 5 incidents/month averaging 10 minutes each, revenue loss rate of $2,000/minute, and SLA penalties of $3,000 per breach above 10 minutes downtime. Calculate: (a) current annual incident cost without observability, (b) projected annual cost if observability reduces average incident duration to 4 minutes, (c) savings per year, (d) ROI if the observability platform costs $80,000/year.",
    level3: "Using the downtime impact formula I_down = R_rate × T_down + P_sla, calculate the total annual savings from observability for: R_rate=$3,000/min, 8 incidents/year, average T_down reduced from 20 min to 6 min by observability, SLA penalty of $10,000 triggered when T_down > 15 min. Show the calculation for each incident and total annual savings.",
    level4: "Design an observability-based SLA dashboard for a telecom operator serving 50 enterprise customers. Define: (a) the metrics and queries needed for real-time per-customer SLA compliance tracking, (b) the automated breach detection and notification workflow, (c) the data retention and audit trail requirements for legal defensibility, (d) the KPIs the dashboard exposes to both the NOC team and account managers."
  },
  projects: {
    scope: "Build an automated SLA compliance and business impact monitoring system that connects network observability data to business KPIs for a simulated telecom operator serving enterprise customers.",
    objectives: [
      "Integrate Prometheus network metrics with a synthetic business transaction generator to correlate network performance (latency, packet loss) with application-layer KPIs (response time, transaction success rate, revenue per minute)",
      "Build automated SLA compliance calculations for 10 simulated enterprise customers with different SLA tiers (99.5%, 99.9%, 99.99%) using real observability data",
      "Implement an incident cost calculator that computes I_down for each detected outage in real time, feeding into a monthly business impact dashboard",
      "Generate monthly SLA compliance reports with penalty calculations, providing the data needed for automated credit issuance"
    ],
    deliverables: [
      "Python SLA compliance engine that reads Prometheus metrics and computes per-customer availability, MTTD, and SLA credit calculations",
      "Grafana dashboard showing per-customer SLA compliance, current downtime budget remaining, and projected monthly penalty exposure",
      "Business impact report template: incident log with I_down calculations, SLA compliance summary, and recommended observability investment ROI for the next quarter",
      "Automated alert rules that notify account managers when a customer's SLA is within 20% of breach, enabling proactive customer communication"
    ]
  },
  questions: [
    {
      q: "How does network observability transform the role of the network team from a cost centre to a strategic business partner?",
      a: "Traditional network monitoring produces infrastructure-centric reports (uptime %, packet loss %, throughput Mbps) that are not directly meaningful to business stakeholders. The network team is seen as a cost centre — necessary but not value-generating. Network observability transforms this by connecting network performance data to business outcomes. With observability, the network team can report: 'During yesterday's 7-minute degradation, 3,842 customers experienced >2x normal latency. Based on historical conversion rate data, this likely caused $23,000 in abandoned transactions and affected 2 enterprise customers who are within 15 minutes of their monthly SLA threshold.' This language resonates with CFOs, account managers, and product teams. Furthermore, observability enables the network team to proactively identify cost optimisations (redirect Teams video traffic from MPLS to internet, saving $200K/year) and capacity investments (provision 10 Gbps upgrade on the London-Frankfurt link before the marketing campaign launch based on 90-day traffic growth trend). These contributions make the network team a data-driven strategic partner rather than a reactive break-fix team.",
      type: "Analytical"
    },
    {
      q: "Calculate I_down for: R_rate=$8,000/min, T_down=12 min, P_sla=$15,000 (triggered at T_down>10 min).",
      a: "I_down = R_rate × T_down + P_sla = $8,000 × 12 + $15,000 = $96,000 + $15,000 = $111,000. This represents the total business impact of a 12-minute outage for a high-revenue operation. If observability reduces T_down from 12 to 5 minutes (by reducing MTTD from 8 min to 1 min): New I_down = $8,000 × 5 + $0 (no SLA breach, T_down < 10 min threshold) = $40,000. Savings per incident = $111,000 - $40,000 = $71,000. For an organisation experiencing 12 such incidents per year, annual savings = 12 × $71,000 = $852,000. An observability platform at $150,000/year generates 5.7x ROI on this calculation alone.",
      type: "Numerical"
    },
    {
      q: "What is SLA-based observability and how does it differ from traditional fault monitoring for enterprise customers?",
      a: "Traditional fault monitoring tracks device health — whether a router is up or down. It cannot answer: 'Is this customer's L3 VPN service meeting its committed 99.9% availability SLA?' because device uptime is not equivalent to service availability. A customer's L3 VPN service can be degraded (packet loss 5%, latency 3x normal) while all devices show green in the monitoring dashboard. SLA-based observability measures customer experience, not device state. It uses: synthetic traffic probes (Y.1731 OAM, IP SLA) that inject test packets into the customer's service path at regular intervals and measure latency, jitter, and packet loss against SLA thresholds; passive monitoring of NetFlow data to detect bandwidth utilisation against committed information rate (CIR); real-time SLA compliance calculations that accumulate unavailability minutes and compare against the monthly SLA budget. When the SLA is approaching breach, automated alerts notify account managers before the customer complains — enabling proactive credit offers and remediation communication. This transforms SLA management from a monthly manual audit process to a continuous, automated, real-time customer service capability.",
      type: "Conceptual"
    },
    {
      q: "How does observability data support data-driven capacity planning for WAN bandwidth upgrades?",
      a: "Traditional capacity planning relies on periodic traffic reports (monthly average bandwidth per interface) and gut-feel estimates for growth. This leads to either over-provisioning (wasted capex) or under-provisioning (latency spikes and SLA breaches before the upgrade is approved and delivered). Observability-driven capacity planning uses: (1) Long-term trend analysis — 90-day rolling bandwidth utilisation with percentile statistics (95th percentile utilisation) from Prometheus or InfluxDB, identifying which links are approaching saturation. (2) Growth rate modelling — ARIMA or linear regression on historical traffic to project when the link will reach 80% utilisation (the engineering threshold), generating a hard date for upgrade order placement. (3) Application decomposition — NetFlow/IPFIX analysis identifying which applications drive bandwidth growth, enabling targeted interventions (SD-WAN offload for certain applications) rather than blanket capacity upgrades. (4) Business event correlation — traffic spikes correlated with business events (product launches, quarterly reports) that require pre-planned temporary capacity augmentation. This data-driven approach has been shown to reduce both capex waste (over-provisioning) and SLA breach incidents (under-provisioning) by 30-40% in enterprise WAN operations.",
      type: "Analytical"
    },
    {
      q: "What are the three categories of business value that network observability delivers, and give a concrete example of each?",
      a: "First, incident cost reduction: faster MTTD and MTTR directly reduce revenue loss per incident. Example: An airline's reservation system outage costs $120,000/minute. Observability reduces average incident duration from 22 minutes to 9 minutes, saving $1,560,000 per incident. Second, cost optimisation and resource efficiency: observability reveals wasteful resource usage that monitoring misses. Example: Flow telemetry analysis reveals that Microsoft Teams traffic consumes 78% of a $300,000/year MPLS circuit. Moving Teams to internet breakout with QoS saves $230,000/year while maintaining call quality. Third, new service and revenue enablement: observability provides the data infrastructure for premium service products. Example: A telecom operator uses per-customer observability to offer 'SLA Assurance Premium' — a $500/month add-on that gives enterprise customers a real-time dashboard of their own service metrics, automated SLA reports, and guaranteed 4-hour restoration — a product impossible to deliver without observability infrastructure. Together these categories mean observability generates positive ROI through multiple simultaneous value streams, making the investment justification robust even if any single category underperforms projections.",
      type: "Conceptual"
    }
  ],
  virtualLab: {
    description: "Model the financial impact of network downtime as a function of duration. Adjust the revenue loss rate and maximum downtime duration to explore how business impact scales. An SLA penalty of $5,000 is triggered when downtime exceeds 10 minutes, creating a step-change in the impact curve.",
    interpretation: "The impact curve shows two distinct phases: below the SLA threshold (10 minutes), impact grows linearly with downtime at R_rate dollars per minute. At the threshold, a step-change adds the SLA penalty instantly. This explains why operators target near-zero SLA breaches rather than just minimising downtime — the penalty is a cliff, not a slope. Observability's primary value is enabling faster detection and diagnosis to keep T_down below the SLA penalty threshold as often as possible.",
    parameters: [
      { id: "revenue_rate", name: "Revenue Loss Rate ($/min)", min: 100, max: 10000, default: 5000, step: 100, unit: " $/min" },
      { id: "downtime", name: "Downtime Duration (min)", min: 1, max: 60, default: 15, step: 1, unit: " min" }
    ],
    generateData: (params: Record<string, number>): Array<{ x: number; y: number }> => {
      const revenue_rate = params.revenue_rate || 5000;
      const downtime = params.downtime || 15;
      const sla_penalty = 5000;
      const sla_threshold = 10;
      const pts: Array<{ x: number; y: number }> = [];
      for (let x = 1; x <= downtime; x++) {
        const direct = revenue_rate * x;
        const penalty = x >= sla_threshold ? sla_penalty : 0;
        pts.push({ x, y: direct + penalty });
      }
      return pts;
    },
    labels: { x: "Downtime Duration (min)", y: "Business Impact ($)" }
  }
};
