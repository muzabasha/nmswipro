import { Link } from 'react-router-dom';
import { ArrowRight, Activity, BookOpen, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="space-y-12">
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 py-12"
      >
        <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          Network Management System
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
          An interactive, immersive course on NMS fundamentals, models, and next-generation SDN management.
        </p>
        <div className="pt-8">
          <Link to="/module/1/topic/1" className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-full font-semibold transition-transform transform hover:scale-105 shadow-lg shadow-primary-500/30">
            <span>Start Learning</span>
            <ArrowRight size={20} />
          </Link>
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
    </div>
  );
}
