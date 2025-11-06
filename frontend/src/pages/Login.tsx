import { useState } from 'react'
import { login, register } from '../api'
import { useAuth, useTheme } from '../store'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [email,setEmail] = useState('')
  const [error,setError] = useState<string|null>(null)
  const { setTokens } = useAuth()
  const nav = useNavigate()

  async function submit(e:any) {
    e.preventDefault()
    try {
      setError(null)
      if (isRegister) {
        await register({ username, email, password })
      }
      const data = await login(username, password)
      setTokens(data.access, data.refresh)
      nav('/')
    } catch (err:any) {
      const data = err?.response?.data
      if (!data) { setError('Network error'); return }
      // Handle DRF field errors or JWT error detail
      if (typeof data === 'string') { setError(data); return }
      if (data.detail) { setError(data.detail); return }
      const parts:string[] = []
      for (const k of Object.keys(data)) {
        const v = Array.isArray(data[k]) ? data[k].join(', ') : String(data[k])
        parts.push(`${k}: ${v}`)
      }
      setError(parts.join(' | ') || 'Failed')
    }
  }
  return (
    <div style={{
      minHeight:'100dvh',
      background: isDark
        ? 'linear-gradient(135deg, #0b1220 0%, #0f172a 50%, #0b3d2e 100%)'
        : 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #22c55e 100%)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:24
    }}>
      <div style={{
        width:'100%', maxWidth:420,
        background: isDark ? 'rgba(2,6,23,0.72)' : 'rgba(255,255,255,0.9)',
        backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)',
        borderRadius:16, border: isDark ? '1px solid rgba(148,163,184,0.18)' : '1px solid rgba(255,255,255,0.6)',
        boxShadow:'0 10px 30px rgba(0,0,0,0.15)',
        padding:22
      }}>
        <div style={{textAlign:'center', marginBottom:12}}>
          <div style={{fontSize:28, fontWeight:800, color: isDark ? '#e5e7eb':'#111827'}}>{isRegister? 'Create account 🧑‍🚀' : 'Welcome back 👋'}</div>
          <div style={{fontSize:14, color: isDark ? '#9ca3af':'#6b7280'}}>{isRegister? 'Join the bug tracker' : 'Sign in to continue'}</div>
        </div>
        <form onSubmit={submit} style={{display:'grid', gap:12}}>
          <div style={{display:'grid', gap:6}}>
            <label style={{fontSize:12, color:'#4b5563', fontWeight:600}}>Username</label>
            <input style={{padding:'12px 14px', borderRadius:10, border:'1px solid #e5e7eb', outline:'none'}} value={username} onChange={e=>setUsername(e.target.value)} placeholder="Your username" required/>
          </div>
          {isRegister && (
            <div style={{display:'grid', gap:6}}>
              <label style={{fontSize:12, color:'#4b5563', fontWeight:600}}>Email</label>
              <input style={{padding:'12px 14px', borderRadius:10, border:'1px solid #e5e7eb', outline:'none'}} value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/>
            </div>
          )}
          <div style={{display:'grid', gap:6}}>
            <label style={{fontSize:12, color:'#4b5563', fontWeight:600}}>Password</label>
            <input type="password" minLength={8} style={{padding:'12px 14px', borderRadius:10, border:'1px solid #e5e7eb', outline:'none'}} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required/>
            {isRegister && <small style={{color:'#6b7280'}}>Minimum 8 characters (Django default policy).</small>}
          </div>
          <button type="submit" style={{
            padding:'12px 16px', borderRadius:12, border:'none', color:'white',
            background:'linear-gradient(135deg, #6366f1, #0ea5e9)', cursor:'pointer', fontWeight:700
          }}>
            {isRegister? 'Create account' : 'Login'}
          </button>
        </form>
        <div style={{marginTop:12, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <button onClick={()=>setIsRegister(v=>!v)} style={{
            background:'white', border:'1px solid #e5e7eb', padding:'8px 12px', borderRadius:10, cursor:'pointer', fontWeight:600
          }}>
            {isRegister? 'Have an account? Login' : 'New here? Register'}
          </button>
          {error && <div style={{color:'#b91c1c', fontSize:13}}>{error}</div>}
        </div>
      </div>
    </div>
  )
}
