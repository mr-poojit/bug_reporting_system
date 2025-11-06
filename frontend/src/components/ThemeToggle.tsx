import { useEffect } from 'react'
import { useTheme } from '../store'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const el = document.documentElement
    el.setAttribute('data-theme', theme)
    el.style.colorScheme = theme
  }, [theme])

  const isDark = theme === 'dark'
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={isDark ? 'Switch to light' : 'Switch to dark'}
      style={{
        display:'inline-flex', alignItems:'center', gap:8,
        padding:'8px 12px', borderRadius:999,
        border:'1px solid #e5e7eb',
        background:'white', cursor:'pointer', fontWeight:700,
        boxShadow:'0 4px 12px rgba(0,0,0,0.08)',
        transition:'transform .15s ease',
      }}
      onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform='scale(0.98)' }}
      onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform='scale(1)' }}
    >
      <span style={{fontSize:16}}>{isDark ? '🌙' : '🌞'}</span>
      <span style={{fontSize:12, color:'#374151'}}>{isDark ? 'Dark' : 'Light'}</span>
    </button>
  )
}


