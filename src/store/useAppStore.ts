import { create } from 'zustand';

interface AppState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  focusMode: boolean;
  toggleFocusMode: () => void;
  fontSize: number;
  setFontSize: (size: number) => void;
}

function loadPersistent<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function persist(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* noop */ }
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const useAppStore = create<AppState>((set) => ({
  theme: loadPersistent('nms-theme', getSystemTheme()),
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    document.documentElement.style.colorScheme = newTheme;
    persist('nms-theme', newTheme);
    return { theme: newTheme };
  }),
  sidebarOpen: loadPersistent('nms-sidebar', true),
  toggleSidebar: () => set((state) => {
    const next = !state.sidebarOpen;
    persist('nms-sidebar', next);
    return { sidebarOpen: next };
  }),
  focusMode: loadPersistent('nms-focus', false),
  toggleFocusMode: () => set((state) => {
    const next = !state.focusMode;
    persist('nms-focus', next);
    return { focusMode: next };
  }),
  fontSize: loadPersistent('nms-fontsize', 1),
  setFontSize: (size) => set(() => {
    persist('nms-fontsize', size);
    return { fontSize: size };
  }),
}));
