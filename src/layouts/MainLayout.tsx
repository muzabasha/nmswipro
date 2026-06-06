import { Outlet, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Menu, X, Moon, Sun, BookOpen } from 'lucide-react';

export default function MainLayout() {
  const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <div className="flex h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 glass border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 font-bold text-xl">
            <BookOpen size={24} />
            <span>NMS Course</span>
          </Link>
          <button onClick={toggleSidebar} className="lg:hidden p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-73px)]">
          {[
            { 
              unit: "1", 
              title: "Unit 1: Intro to NMS", 
              topics: [
                {id: "1", name: "Mobile Networks & TMN"}, 
                {id: "2", name: "EMS & NMS (SBI/NBI)"}, 
                {id: "3", name: "The FCAPS Process"},
                {id: "4", name: "Introduction to SNMP"},
                {id: "5", name: "YANG & SNMP Limits"}
              ] 
            },
            { 
              unit: "2", 
              title: "Unit 2: Model-Driven Mgmt", 
              topics: [
                {id: "1", name: "Model-Driven Intro"}, 
                {id: "2", name: "YANG Structure Details"}, 
                {id: "3", name: "NETCONF Protocol"},
                {id: "4", name: "RESTCONF & Postman"}
              ] 
            },
            { 
              unit: "3", 
              title: "Unit 3: Alarm Management", 
              topics: [
                {id: "1", name: "Alarm RCA & Suppression"}, 
                {id: "2", name: "Discovery & FM Flow"}, 
                {id: "3", name: "REST APIs & ONF TAPI"},
                {id: "4", name: "NFV Concepts"}
              ] 
            },
            { 
              unit: "4", 
              title: "Unit 4: SDN & Advanced Mgmt", 
              topics: [
                {id: "1", name: "SDN & Controllers"}, 
                {id: "2", name: "Observability vs Monitoring"}, 
                {id: "3", name: "AI/ML in Observability"},
                {id: "4", name: "Orchestration & ONAP"}
              ] 
            }
          ].map((unit) => (
            <div key={unit.unit} className="space-y-1">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{unit.title}</div>
              {unit.topics.map((topic) => (
                <Link key={topic.id} to={`/module/${unit.unit}/topic/${topic.id}`} className="block p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors">
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Topic {topic.id}: {topic.name}</div>
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="glass border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between z-40 relative">
          <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden">
            <Menu size={20} />
          </button>
          
          <div className="flex-1"></div>
          
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </header>

        {/* Main Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-[#0b1120]">
          <div className="container mx-auto px-4 py-8 max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
