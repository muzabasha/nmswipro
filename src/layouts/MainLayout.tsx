import { Outlet, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { curriculum } from '../data';

export default function MainLayout() {
  const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)] font-sans transition-colors duration-300">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900/95 border-r border-[var(--border)]
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen
          ? 'translate-x-0 lg:relative lg:translate-x-0'
          : '-translate-x-full lg:fixed lg:-translate-x-full'
        }
      `}>
        <div className="flex items-center justify-between h-16 px-5 border-b border-[var(--border)]">
          <Link to="/" className="flex items-center gap-2.5 text-primary-600 dark:text-primary-400 font-bold text-lg tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              N
            </div>
            <span>NMS Course</span>
          </Link>
          <button onClick={toggleSidebar} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X size={18} />
          </button>
        </div>
        <nav className="p-3 space-y-5 overflow-y-auto h-[calc(100vh-65px)]">
          {curriculum.map((unit) => (
            <div key={unit.unit}>
              <div className="flex items-center gap-2 px-2 mb-2">
                <div className="w-1 h-3 rounded-full bg-primary-400" />
                <span className="section-header">{unit.title}</span>
              </div>
              <div className="space-y-0.5">
                {unit.topics.map((topic) => (
                  <Link key={topic.id} to={`/module/${unit.unit}/topic/${topic.id}`}
                    className="group flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-150"
                  >
                    <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 flex items-center justify-center text-[10px] font-bold text-slate-400 dark:text-slate-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors shrink-0">
                      {topic.id}
                    </span>
                    <span className="truncate">{topic.name}</span>
                  </Link>
                ))}
              </div>
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
        <header className="h-16 glass border-b border-[var(--border)] px-4 md:px-6 flex items-center justify-between z-40 relative">
          <button onClick={toggleSidebar} className="btn-ghost p-2" title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="flex-1"></div>

          <button onClick={toggleTheme} className="btn-ghost p-2 rounded-full" title="Toggle theme">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </header>

        {/* Main Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[var(--background)]">
          <div className="mx-auto px-4 md:px-6 py-6 md:py-8 max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
