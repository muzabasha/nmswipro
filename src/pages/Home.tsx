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

      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-slate-900 dark:text-white">Course Curriculum</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { unit: "1", title: "Unit 1: Introduction to Network Management", topics: [{id: "1", name: "Mobile Networks & NMS Frameworks"}, {id: "2", name: "The FCAPS Framework"}, {id: "3", name: "Information vs. Communication Models"}] },
            { unit: "2", title: "Unit 2: SNMP and Legacy Protocols", topics: [{id: "1", name: "Introduction to SNMP"}, {id: "2", name: "SMI and MIBs"}, {id: "3", name: "SNMPv1, v2c, and v3"}] },
            { unit: "3", title: "Unit 3: Modern Management", topics: [{id: "1", name: "Rise of NETCONF"}, {id: "2", name: "YANG Data Modeling"}, {id: "3", name: "RESTCONF and Web-based Management"}] },
            { unit: "4", title: "Unit 4: Next-Generation Management", topics: [{id: "1", name: "Introduction to SDN"}, {id: "2", name: "SDN Controllers and OpenFlow"}, {id: "3", name: "Intent-Based Networking"}] }
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
