import { Outlet, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Menu, X, Moon, Sun, Focus, Minimize2, Maximize2, Type, BookOpen } from 'lucide-react';
import { curriculum } from '../data';
import { useEffect, useRef, useCallback } from 'react';
import revaLogo from '../assets/reva-logo.png';
import sdg4Logo from '../assets/SDG4.png';

export default function MainLayout() {
  const { theme, toggleTheme, sidebarOpen, toggleSidebar, focusMode, toggleFocusMode, fontSize, setFontSize } = useAppStore();
  const mainRef = useRef<HTMLElement>(null);
  const themeBtnRef = useRef<HTMLButtonElement>(null);
  /* ── sync colorScheme + dark class on mount ── */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  /* ── keyboard shortcut: toggle focus mode with Ctrl+Shift+F ── */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        toggleFocusMode();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [toggleFocusMode]);

  /* ── apply font-size scale to document ── */
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize * 100}%`;
  }, [fontSize]);

  const cycleFontSize = () => {
    const sizes = [0.875, 1, 1.125];
    const idx = sizes.indexOf(fontSize);
    setFontSize(sizes[(idx + 1) % sizes.length]);
  };

  const handleToggleTheme = useCallback(() => {
    const btn = themeBtnRef.current;
    if (btn) {
      btn.classList.remove('toggling');
      /* force reflow so the animation restarts */
      void btn.offsetWidth;
      btn.classList.add('toggling');
      setTimeout(() => btn.classList.remove('toggling'), 500);
    }
    /* briefly add transition class to root for smooth colour crossfade */
    const root = document.documentElement;
    root.classList.add('theme-transitioning');
    toggleTheme();
    setTimeout(() => root.classList.remove('theme-transitioning'), 400);
  }, [toggleTheme]);

  return (
    <div className={`flex h-screen bg-[var(--background)] text-[var(--foreground)] font-sans transition-colors duration-300 ${focusMode ? 'focus-mode' : ''}`}>
      {/* Skip to main content (visually hidden, focusable) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Sidebar — hidden in focus mode */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900/95 border-r border-[var(--border)]
        transform transition-transform duration-300 ease-in-out
        ${focusMode || !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
      `}
        aria-label="Course navigation sidebar"
        role="navigation"
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-[var(--border)]">
          <Link to="/" className="flex items-center gap-2.5 text-primary-600 dark:text-primary-400 font-bold text-lg tracking-tight" aria-label="NMS Course Home">
            <div className="w-8 h-8 rounded-lg bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              N
            </div>
            <span>NMS Course</span>
          </Link>
          <button onClick={toggleSidebar} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400" aria-label="Close sidebar">
            <X size={18} />
          </button>
        </div>
        <nav className="p-3 space-y-5 overflow-y-auto h-[calc(100vh-65px)]" aria-label="Topics by unit">
          {curriculum.map((unit) => {
            return (
              <div key={unit.unit}>
                <div className="flex items-center gap-2 px-2 mb-2">
                  <div className="w-1 h-3 rounded-full bg-primary-400" />
                  <span className="section-header">{unit.title}</span>
                </div>
                <div className="space-y-0.5" role="list">
                  {unit.topics.map((topic) => (
                    <Link key={topic.id} to={`/module/${unit.unit}/topic/${topic.id}`}
                      className="group flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-150"
                      role="listitem"
                      aria-label={`Topic ${topic.id}: ${topic.name}`}
                    >
                      <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 flex items-center justify-center text-[10px] font-bold text-slate-400 dark:text-slate-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors shrink-0">
                        {topic.id}
                      </span>
                      <span className="truncate">{topic.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && !focusMode && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={toggleSidebar} aria-hidden="true" />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${sidebarOpen && !focusMode ? 'lg:ml-64' : ''}`}>
        {/* Header */}
        <header className="glass border-b border-[var(--border)] px-2 sm:px-4 md:px-6 z-40 relative" role="banner">
          {/* top row: hamburger + controls */}
          <div className="flex items-center gap-1 sm:gap-2 h-12 min-h-0">
            <button onClick={toggleSidebar} className="btn-ghost p-2 shrink-0" aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'} title={sidebarOpen ? 'Close sidebar' : 'Open sidebar (Ctrl+Shift+F to focus)'}>
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <Link to="/" className="btn-ghost p-2 shrink-0" aria-label="Home">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </Link>

            {/* logos — visible from sm up */}
            <span className="hidden sm:flex items-center gap-2 shrink-0 ml-1">
              <img src={revaLogo} alt="REVA University" className="h-8 w-auto object-contain" />
              <img src={sdg4Logo} alt="SDG 4 Quality Education" className="h-8 w-auto object-contain" />
            </span>

            {/* course info — hidden on very narrow screens */}
            <div className="hidden md:flex flex-col leading-tight ml-2 min-w-0">
              <span className="text-sm font-bold text-slate-800 dark:text-white truncate">Network Management System</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Course Code: B22EF711 · Credits: 3
              </span>
            </div>

            <div className="flex-1 min-w-[4px]" />

            {/* Focus mode toggle */}
            <button
              onClick={toggleFocusMode}
              className={`btn-ghost p-2 shrink-0 ${focusMode ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : ''}`}
              aria-label={focusMode ? 'Exit focus mode' : 'Enter focus mode'}
              title={`${focusMode ? 'Exit' : 'Enter'} focus mode (Ctrl+Shift+F)`}
            >
              {focusMode ? <Minimize2 size={18} /> : <Focus size={18} />}
            </button>

            {/* Font size control */}
            <button
              onClick={cycleFontSize}
              className="btn-ghost p-2 shrink-0"
              aria-label={`Font size: ${fontSize === 0.875 ? 'Small' : fontSize === 1 ? 'Medium' : 'Large'}`}
              title={`Font size: ${fontSize === 0.875 ? 'Small' : fontSize === 1 ? 'Medium' : 'Large'} — click to cycle`}
            >
              <Type size={18} />
            </button>

            <button
              ref={themeBtnRef}
              onClick={handleToggleTheme}
              className="theme-toggle btn-ghost p-2 rounded-full shrink-0 relative"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              title={`Toggle theme (currently ${theme})`}
            >
              <span className="theme-icon grid place-items-center">
                <Moon
                  size={18}
                  className="col-start-1 row-start-1 transition-all duration-300"
                  style={{ opacity: theme === 'light' ? 1 : 0, transform: theme === 'light' ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0.5)' }}
                />
                <Sun
                  size={18}
                  className="col-start-1 row-start-1 transition-all duration-300"
                  style={{ opacity: theme === 'dark' ? 1 : 0, transform: theme === 'dark' ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.5)' }}
                />
              </span>
            </button>
          </div>

          {/* bottom row: faculty info — hidden on mobile */}
          <div className="hidden lg:flex items-center gap-2 pb-2 pl-1">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Dr. Syed Muzamil Basha, Professor &mdash; School of Computer Science and Engineering, REVA University
            </span>
          </div>
        </header>

        {/* Main Area */}
        <main ref={mainRef} id="main-content" className="flex-1 overflow-x-hidden overflow-y-auto bg-[var(--background)] focus:outline-none" tabIndex={-1}>
          <div className="mx-auto px-4 md:px-6 py-6 md:py-8 max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
