import { Outlet, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Menu, X, Moon, Sun, BookOpen } from 'lucide-react';
import { curriculum } from '../data';

export default function MainLayout() {
  const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <div className="flex h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Sidebar */}
      <aside className={`fixed lg:relative inset-y-0 left-0 z-50 w-64 glass border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:-ml-64'}`}>
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
          {curriculum.map((unit) => (
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

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={toggleSidebar} />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        {/* Header */}
        <header className="glass border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between z-40 relative">
          <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
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
