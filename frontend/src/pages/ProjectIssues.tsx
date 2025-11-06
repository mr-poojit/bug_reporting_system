import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { createIssue, listIssues, listUsers, patchIssue } from '../api'
import Loader from '../components/Loader'
import { useTheme } from '../store'

const statuses = ["open","in_progress","closed"]
const priorities = ["low","medium","high","critical"]

export default function ProjectIssues() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { id } = useParams()
  const projectId = Number(id)
  const [data, setData] = useState<any>(null)
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState<string|null>(null)
  const [users,setUsers] = useState<any[]>([])

  const [form, setForm] = useState({title:'', description:'', priority:'medium'})

  const [filters, setFilters] = useState<{status?:string; priority?:string; search?:string}>({})

  async function load() {
    setLoading(true); setError(null)
    try {
      const users = await listUsers(); setUsers(users)
      const issues = await listIssues(projectId, filters as any)
      setData(issues)
    } catch { setError('Failed to load') }
    setLoading(false)
  }
  useEffect(()=>{ load() }, [projectId, JSON.stringify(filters)])

  async function create(e:any) {
    e.preventDefault()
    try {
      await createIssue(projectId, form as any)
      setForm({title:'', description:'', priority:'medium'})
      await load()
    } catch { alert('Failed to create issue') }
  }

  async function quickUpdate(id:number, patch: any) {
    try { await patchIssue(id, patch); await load() } catch { alert('Failed to update') }
  }

  const pageBg: React.CSSProperties = {
    minHeight: '100dvh',
    background: isDark
      ? 'linear-gradient(135deg, #0b1220 0%, #0f172a 50%, #0b3d2e 100%)'
      : 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #22c55e 100%)',
    padding: 24,
    color: isDark ? '#e5e7eb' : undefined,
  }
  const container: React.CSSProperties = {
    maxWidth: 1100,
    margin: '0 auto',
  }
  const card: React.CSSProperties = {
    background: isDark ? 'rgba(2,6,23,0.7)' : 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    borderRadius: 16,
    boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
    border: isDark ? '1px solid rgba(148,163,184,0.18)' : '1px solid rgba(255,255,255,0.6)',
    animation: 'fadeIn .25s ease',
  }
  const inputStyle: React.CSSProperties = {
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    outline: 'none',
    fontSize: 14,
  }
  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    background: isDark ? '#0b1220' : 'white',
  }
  const buttonPrimary: React.CSSProperties = {
    padding: '10px 14px',
    borderRadius: 10,
    border: 'none',
    color: 'white',
    background: isDark ? 'linear-gradient(135deg, #22c55e, #0ea5e9)' : 'linear-gradient(135deg, #6366f1, #0ea5e9)',
    cursor: 'pointer',
    fontWeight: 600,
  }
  const buttonSecondary: React.CSSProperties = {
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    background: isDark ? '#0b1220' : 'white',
    cursor: 'pointer',
    fontWeight: 600,
  }
  const badge = (text:string): React.CSSProperties => {
    const colorMaps: Record<string, {bg:string; fg:string}> = {
      open: { bg: 'rgba(14,165,233,0.12)', fg: '#075985' },
      in_progress: { bg: 'rgba(250,204,21,0.18)', fg: '#92400e' },
      closed: { bg: 'rgba(34,197,94,0.15)', fg: '#14532d' },
      low: { bg: 'rgba(148,163,184,0.2)', fg: '#334155' },
      medium: { bg: 'rgba(14,165,233,0.15)', fg: '#075985' },
      high: { bg: 'rgba(249,115,22,0.18)', fg: '#7c2d12' },
      critical: { bg: 'rgba(239,68,68,0.18)', fg: '#7f1d1d' },
    }
    const key = (text || '').toLowerCase()
    const colors = colorMaps[key] || { bg: 'rgba(148,163,184,0.2)', fg: '#334155' }
    return {
      display:'inline-block', padding:'4px 10px', borderRadius:999, fontSize:12, fontWeight:700,
      background: colors.bg, color: colors.fg, letterSpacing: 0.3
    }
  }

  if (loading) return <Loader/>
  if (error) return (
    <div style={pageBg}>
      <div style={container}>
        <div style={{...card, padding:24}}>
          <div style={{color:'#ef4444', fontWeight:700}}>{error}</div>
        </div>
      </div>
    </div>
  )

  return (
    <div style={pageBg}>
      <div style={container}>
        <header style={{marginBottom:16, color:'white'}}>
          <h1 style={{margin:0, fontSize:26}}>Project #{projectId} — Issues</h1>
          <p style={{margin:'6px 0 0', opacity:0.9}}>Track and triage your work efficiently.</p>
        </header>

        <section style={{...card, padding:16, marginBottom:14}}>
          <div style={{display:'flex', gap:10, flexWrap:'wrap', alignItems:'center'}}>
            <select style={selectStyle} value={filters.status||''} onChange={e=>setFilters(f=>({...f, status: e.target.value||undefined}))}>
              <option value="">All Status</option>
              {statuses.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
            <select style={selectStyle} value={filters.priority||''} onChange={e=>setFilters(f=>({...f, priority: e.target.value||undefined}))}>
              <option value="">All Priority</option>
              {priorities.map(p=><option key={p} value={p}>{p}</option>)}
            </select>
            <input style={{...inputStyle, flex:'1 1 220px'}} placeholder="Search…" value={filters.search||''} onChange={e=>setFilters(f=>({...f, search:e.target.value||undefined}))}/>
            <button style={buttonSecondary} onClick={()=>setFilters({})}>Clear</button>
          </div>
        </section>

        <section style={{...card, padding:16, marginBottom:16}}>
          <h3 style={{margin:'0 0 12px 0'}}>Create issue</h3>
          <form onSubmit={create} style={{display:'grid', gap:12, maxWidth:560}}>
            <div style={{display:'grid', gap:6}}>
              <label style={{fontSize:12, color:'#4b5563', fontWeight:600}}>Title</label>
              <input style={inputStyle} placeholder="Short, descriptive title" value={form.title} onChange={e=>setForm(f=>({...f, title:e.target.value}))} required/>
            </div>
            <div style={{display:'grid', gap:6}}>
              <label style={{fontSize:12, color:'#4b5563', fontWeight:600}}>Description</label>
              <textarea style={{...inputStyle, minHeight:100}} placeholder="Steps to reproduce, expected vs actual, etc." value={form.description} onChange={e=>setForm(f=>({...f, description:e.target.value}))}/>
            </div>
            <div style={{display:'flex', gap:10, alignItems:'center'}}>
              <label style={{fontSize:12, color:'#4b5563', fontWeight:600}}>Priority</label>
              <select style={selectStyle} value={form.priority} onChange={e=>setForm(f=>({...f, priority:e.target.value}))}>
                {priorities.map(p=><option key={p} value={p}>{p}</option>)}
              </select>
              <div style={{marginLeft:'auto'}}>
                <button style={buttonPrimary} type="submit">Create Issue</button>
              </div>
            </div>
          </form>
        </section>

        {!data?.results?.length ? (
          <div style={{...card, padding:18}}>
            <p style={{margin:0}}>No issues found.</p>
          </div>
        ) : (
          <ul style={{display:'grid', gap:14, listStyle:'none', padding:0, margin:0}}>
            {data.results.map((i:any)=>(
              <li key={i.id} style={{...card, padding:16}}>
                <div style={{display:'flex', justifyContent:'space-between', gap:10, alignItems:'flex-start'}}>
                  <div style={{minWidth:0}}>
                    <Link to={`/issues/${i.id}`} style={{textDecoration:'none', color:'#111827'}}><strong>{i.title}</strong></Link>
                    <div style={{marginTop:6, display:'flex', gap:8, flexWrap:'wrap', alignItems:'center'}}>
                      <span style={badge(i.status)}>{i.status}</span>
                      <span style={badge(i.priority)}>{i.priority}</span>
                      <small style={{color:'#374151'}}>Reporter: {i.reporter?.username}</small>
                      <small style={{color:'#374151'}}>Assignee: {i.assignee?.username||'-'}</small>
                    </div>
                  </div>
                  <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                    <select style={selectStyle} value={i.status} onChange={e=>quickUpdate(i.id, {status:e.target.value})}>
                      {statuses.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                    <select style={selectStyle} value={i.assignee?.id||''} onChange={e=>quickUpdate(i.id, {assignee: e.target.value? Number(e.target.value): null})}>
                      <option value="">Unassigned</option>
                      {users.map(u=><option key={u.id} value={u.id}>{u.username}</option>)}
                    </select>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
