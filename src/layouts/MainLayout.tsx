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
              title: "Unit I: Introduction to NMS & Frameworks",
              topics: [
                { id: "1", name: "Understanding of Mobile Network" },
                { id: "2", name: "eTOM and TMN Framework" },
                { id: "3", name: "EMS and NMS Architecture" },
                { id: "4", name: "FCAPS Process" },
                { id: "5", name: "NMS SBI and NBI" },
                { id: "6", name: "SNMP Concepts & Evolution" },
                { id: "7", name: "SNMP Architecture" },
                { id: "8", name: "SNMP Query" },
                { id: "9", name: "SNMP Commands" },
                { id: "10", name: "SNMP TRAPS" },
                { id: "11", name: "YANG Evolution & Background" },
                { id: "12", name: "SNMP Limitations and Operators Requirement" }
              ]
            },
            {
              unit: "2",
              title: "Unit II: Model-Driven Management",
              topics: [
                { id: "1", name: "Introduction to Model-Driven Management" },
                { id: "2", name: "YANG Data Model Structure" },
                { id: "3", name: "YANG Data Model Details Explanation" },
                { id: "4", name: "NETCONF Protocol Concept" },
                { id: "5", name: "NETCONF Operation Commands" },
                { id: "6", name: "RESTCONF" },
                { id: "7", name: "Alarm Management" },
                { id: "8", name: "Network Virtualization" },
                { id: "9", name: "RESTCONF Protocol Concept" },
                { id: "10", name: "RESTCONF Operation via Postman" }
              ]
            },
            {
              unit: "3",
              title: "Unit III: Alarm Lifecycle Management",
              topics: [
                { id: "1", name: "Fault Correlation" },
                { id: "2", name: "Root Cause Analysis" },
                { id: "3", name: "Alarm Suppression Mechanism" },
                { id: "4", name: "NMS Discovery" },
                { id: "5", name: "NMS NBI Interface" },
                { id: "6", name: "NMS FM NBI Flow" },
                { id: "7", name: "REST API Concept" },
                { id: "8", name: "REST API Commands and Operation Flow" },
                { id: "9", name: "ONF TAPI Overview" },
                { id: "10", name: "NFV Concepts (VIM, VNFM, NFVO)" }
              ]
            },
            {
              unit: "4",
              title: "Unit IV: SDN & Advanced Management",
              topics: [
                { id: "1", name: "SDN Architecture and Concept" },
                { id: "2", name: "SDN Controller Engine Functions" },
                { id: "3", name: "Key Concepts of Network Observability" },
                { id: "4", name: "Network Observability vs Monitoring" },
                { id: "5", name: "Importance of Network Observability" },
                { id: "6", name: "Techniques and Tools of Observability" },
                { id: "7", name: "Data Collection and Storage" },
                { id: "8", name: "Analytics with AI/ML and Prediction" },
                { id: "9", name: "Overview of Service Orchestration" },
                { id: "10", name: "Service Ordering" },
                { id: "11", name: "Service Assurance" },
                { id: "12", name: "Network Slicing via ONAP Framework" }
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
