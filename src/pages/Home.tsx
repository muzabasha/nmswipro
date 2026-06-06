import { Link } from 'react-router-dom';
import { ArrowRight, Activity, BookOpen, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import revaLogo from '../assets/reva-logo.png';
import sdg4Logo from '../assets/SDG4.png';

export default function Home() {
  return (
    <div className="space-y-12">
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 py-12 flex flex-col items-center"
      >
        <div className="flex items-center justify-center gap-8 mb-2">
          <img src={revaLogo} alt="REVA University" className="h-24 object-contain drop-shadow-sm" />
          <img src={sdg4Logo} alt="SDG 4 Quality Education" className="h-24 object-contain drop-shadow-sm" />
        </div>
        
        <div className="inline-block bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-primary-200 dark:border-primary-800/50">
          Course Code: B22EF711 • Credits: 3
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          Network Management System
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
          An interactive, immersive course on NMS fundamentals, models, and next-generation SDN management.
        </p>

        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-2xl mx-auto mt-4">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <span className="text-primary-600 dark:text-primary-400 font-semibold">Faculty:</span> Dr. Syed Muzamil Basha, Professor<br/>
            School of Computer Science and Engineering, REVA University
          </p>
        </div>

        <div className="pt-8 flex justify-center space-x-4">
          <Link to="/module/1/topic/1" className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-full font-semibold transition-transform transform hover:scale-105 shadow-lg shadow-primary-500/30">
            <span>Start Learning</span>
            <ArrowRight size={20} />
          </Link>
          <a href="https://scholar-sparkle-web.lovable.app/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-full font-semibold transition-transform transform hover:scale-105 shadow-sm">
            <span>Professor</span>
            <ArrowRight size={20} className="opacity-50" />
          </a>
        </div>
      </motion.section>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: <BookOpen className="text-blue-500" size={32} />, title: "Complete Syllabus Coverage", desc: "4 Units covering FCAPS, SNMP, YANG, RESTCONF, and SDN." },
          { icon: <Activity className="text-green-500" size={32} />, title: "Interactive Labs", desc: "Experiment with parameters in real-time virtual simulations." },
          { icon: <Target className="text-purple-500" size={32} />, title: "Project Based Learning", desc: "60 unique projects to cement your understanding through doing." }
        ].map((feature, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-2xl glass hover:-translate-y-1 transition-transform"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{feature.title}</h3>
            <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-700">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Course Outcomes */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="text-primary-500" />
              Course Outcomes
            </h2>
            <ul className="space-y-4">
              {[
                "CO1: Describe, illustrate, and differentiate fundamentals of Network Management, protocols, standards, and their evolution.",
                "CO2: Explain, analyze, and summarize the various models/frameworks (OSI, TCP/IP, TMN, MIB) used in Network Management.",
                "CO3: Compare, demonstrate, and implement SNMP operations and architecture including security features and RMON.",
                "CO4: Select, evaluate, and use commercial and open-source Network Management tools and applications.",
                "CO5: Apply, organize, and integrate FCAPS functionalities in managing real-time networks.",
                "CO6: Investigate, interpret, and adapt future trends in Cloud and Software-Defined Network (SDN) Management."
              ].map((co, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-primary-600 dark:text-primary-400 mt-0.5">{co.split(':')[0]}:</span>
                  <span>{co.split(':')[1]}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Textbooks & References */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="text-blue-500" />
                Textbooks
              </h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-2">
                <li>Mani Subramanian, Network Management, Hardcover, 2010</li>
                <li>Raouf Boutaba, "Network Management: Basics, Standards and Evolution toward Distributed, Intelligent and Cost-effective Architectures"</li>
                <li>William Stallings, "SNMP, SNMPv2, SNMPv3, and RMON 1 and 2"</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="text-green-500" />
                References
              </h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-2 text-sm">
                <li>Mark Burgess, "Principles of Network and System Administration"</li>
                <li>Relevant IEEE/ISO standards documentation</li>
                <li>Model-Driven Network Management with YANG – IETF RFCs and Tutorials, NETCONF Specification – RFC 6241</li>
                <li>RESTCONF Specification – RFC 8040, ONF TAPI Overview Documentation, ETSI NFV Framework Documentation</li>
                <li>NETCONF4J API and Java Client Library Documentation, Practical Guides on Network Telemetry, Event Handling, and RESTCONF in Java</li>
                <li>Online Tutorials and Code, Repositories for NETCONF4J and RESTCONF Java implementations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-slate-900 dark:text-white">Course Curriculum</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { 
              unit: "1", 
              title: "Unit 1: Introduction to Network Management", 
              topics: [
                {id: "1", name: "Mobile Networks, eTOM, and TMN Framework"}, 
                {id: "2", name: "EMS and NMS Architecture (SBI & NBI)"}, 
                {id: "3", name: "The FCAPS Process"},
                {id: "4", name: "Introduction to SNMP (Architecture, Queries, Traps)"},
                {id: "5", name: "YANG Background & SNMP Limitations"}
              ] 
            },
            { 
              unit: "2", 
              title: "Unit 2: Model-Driven Management and Protocols", 
              topics: [
                {id: "1", name: "Introduction to Model-Driven Management"}, 
                {id: "2", name: "YANG Data Model Structure Details"}, 
                {id: "3", name: "NETCONF Protocol and Operations"},
                {id: "4", name: "RESTCONF Protocol and Postman Operations"}
              ] 
            },
            { 
              unit: "3", 
              title: "Unit 3: Alarm Lifecycle Management", 
              topics: [
                {id: "1", name: "Alarm Management & Fault Correlation (RCA & Suppression)"}, 
                {id: "2", name: "NMS Discovery and FM NBI Flow"}, 
                {id: "3", name: "REST APIs and ONF TAPI Overview"},
                {id: "4", name: "Network Function Virtualization (NFV) Concepts"}
              ] 
            },
            { 
              unit: "4", 
              title: "Unit 4: SDN, Network Observability, and Advanced Management", 
              topics: [
                {id: "1", name: "SDN Architecture and Controller Engine Functions"}, 
                {id: "2", name: "Network Observability vs. Monitoring"}, 
                {id: "3", name: "Data Analytics with AI/ML in Observability"},
                {id: "4", name: "Service Orchestration, Assurance, and Network Slicing (ONAP)"}
              ] 
            }
          ].map((unit) => (
            <div key={unit.unit} className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-primary-700 dark:text-primary-400 mb-4">{unit.title}</h3>
              <ul className="space-y-3">
                {unit.topics.map(topic => (
                  <li key={topic.id}>
                    <Link to={`/module/${unit.unit}/topic/${topic.id}`} className="group flex items-center justify-between p-3 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                      <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        Topic {topic.id}: {topic.name}
                      </span>
                      <ArrowRight size={16} className="text-slate-400 group-hover:text-primary-600 transform group-hover:translate-x-1 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
