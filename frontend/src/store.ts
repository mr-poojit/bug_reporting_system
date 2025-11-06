import { create } from 'zustand'

type AuthState = {
  access: string | null
  refresh: string | null
  setTokens: (access: string, refresh: string) => void
  clear: () => void
}

export const useAuth = create<AuthState>((set) => ({
  access: localStorage.getItem('access'),
  refresh: localStorage.getItem('refresh'),
  setTokens: (access, refresh) => {
    localStorage.setItem('access', access)
    localStorage.setItem('refresh', refresh)
    set({ access, refresh })
  },
  clear: () => {
    localStorage.removeItem('access'); localStorage.removeItem('refresh')
    set({ access: null, refresh: null })
  }
}))

type ThemeMode = 'light' | 'dark'
type ThemeState = {
  theme: ThemeMode
  toggleTheme: () => void
  setTheme: (mode: ThemeMode) => void
}

const systemPrefersDark = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const useTheme = create<ThemeState>((set, get) => ({
  theme: (localStorage.getItem('theme') as ThemeMode) || (systemPrefersDark() ? 'dark' : 'light'),
  toggleTheme: () => {
    const next: ThemeMode = get().theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', next)
    set({ theme: next })
  },
  setTheme: (mode) => {
    localStorage.setItem('theme', mode)
    set({ theme: mode })
  },
}))