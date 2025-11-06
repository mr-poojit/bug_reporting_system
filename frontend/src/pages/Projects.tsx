import { useEffect, useState } from 'react'
import { createProject, listProjects } from '../api'
import Loader from '../components/Loader'
import { Link } from 'react-router-dom'
import { useTheme } from '../store'

export default function Projects() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string|null>(null)

  async function load(p=1) {
    setLoading(true); setError(null)
    try { setData(await listProjects(p)) } catch(e:any){ setError('Failed to load') }
    setLoading(false)
  }
  useEffect(()=>{ load(page) }, [page])

  async function create(e:any) {
    e.preventDefault()
    try {
      await createProject({name, description: desc})
      setName(''); setDesc('')
      await load(page)
    } catch { alert('Failed to create') }
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
    background: isDark ? 'rgba(2,6,23,0.7)' : 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    borderRadius: 16,
    boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
    border: isDark ? '1px solid rgba(148,163,184,0.18)' : '1px solid rgba(255,255,255,0.6)',
    animation: 'fadeIn .25s ease',
  }
  const inputStyle: React.CSSProperties = {
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    outline: 'none',
    fontSize: 14,
  }
  const buttonPrimary: React.CSSProperties = {
    padding: '12px 16px',
    borderRadius: 12,
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
  const badge: React.CSSProperties = {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 999,
    background: isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.12)',
    color: isDark ? '#c7d2fe' : '#3730a3',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.3,
  }

  if (loading) return <Loader/>
  if (error) return (
    <div style={pageBg}>
      <div style={container}>
        <div style={{...card, padding: 24}}>
          <div style={{color:'#ef4444', fontWeight:700}}>{error}</div>
        </div>
      </div>
    </div>
  )
  if (!data?.results?.length) return (
    <div style={pageBg}>
      <div style={container}>
        <header style={{marginBottom:16, color:'white'}}>
          <h1 style={{margin:0, fontSize:28}}>Projects</h1>
          <p style={{margin:'6px 0 0', opacity:0.9}}>Start by creating your first project.</p>
        </header>
        <div style={{...card, padding:24}}>
          <div style={{marginBottom:12}}>
            <span style={badge}>New</span>
          </div>
          <p style={{marginTop:0, color:'#111827'}}>No projects yet.</p>
          <form onSubmit={create} style={{display:'grid', gap:12, maxWidth:480}}>
            <input style={inputStyle} value={name} onChange={e=>setName(e.target.value)} placeholder="Project name" required/>
            <textarea style={{...inputStyle, minHeight:90}} value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description (optional)"/>
            <div style={{display:'flex', gap:10}}>
              <button style={buttonPrimary} type="submit">Create Project</button>
              <button type="button" style={buttonSecondary} onClick={()=>{ setName(''); setDesc('') }}>Clear</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )

  return (
    <div style={pageBg}>
      <div style={container}>
        <header style={{marginBottom:20, color:'white'}}>
          <h1 style={{margin:0, fontSize:28}}>Projects</h1>
          <p style={{margin:'6px 0 0', opacity:0.9}}>Manage your teams and issues by project.</p>
        </header>

        <section style={{...card, padding:20, marginBottom:16}}>
          <h3 style={{margin:'0 0 12px 0'}}>Create a project</h3>
          <form onSubmit={create} style={{display:'grid', gap:12, maxWidth:520}}>
            <div style={{display:'grid', gap:8}}>
              <label style={{fontSize:12, color:'#4b5563', fontWeight:600}}>Name</label>
              <input style={inputStyle} value={name} onChange={e=>setName(e.target.value)} placeholder="Project name" required/>
            </div>
            <div style={{display:'grid', gap:8}}>
              <label style={{fontSize:12, color:'#4b5563', fontWeight:600}}>Description</label>
              <textarea style={{...inputStyle, minHeight:90}} value={desc} onChange={e=>setDesc(e.target.value)} placeholder="What is this project about?"/>
            </div>
            <div style={{display:'flex', gap:10}}>
              <button style={buttonPrimary} type="submit">Create</button>
              <button type="button" style={buttonSecondary} onClick={()=>{ setName(''); setDesc('') }}>Clear</button>
            </div>
          </form>
        </section>

        <section style={{display:'grid', gap:16, gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))'}}>
          {data.results.map((p:any)=>(
            <div key={p.id} style={{...card, padding:18, display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
              <div>
                <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:8}}>
                  <div style={{width:10, height:10, borderRadius:999, background:'#22c55e'}}/>
                  <h3 style={{margin:0}}>
                    <Link style={{textDecoration:'none', color:'#111827'}} to={`/projects/${p.id}/issues`}>{p.name}</Link>
                  </h3>
                </div>
                <p style={{margin:'4px 0 0', color:'#374151'}}>{p.description || 'No description provided.'}</p>
              </div>
              <div style={{marginTop:12, display:'flex', gap:8}}>
                <Link to={`/projects/${p.id}/issues`} style={{...buttonSecondary, textDecoration:'none'}}>View Issues</Link>
              </div>
            </div>
          ))}
        </section>

        <div style={{marginTop:16, display:'flex', gap:10}}>
          <button
            style={{...buttonSecondary, opacity: data.previous ? 1 : 0.6, cursor: data.previous ? 'pointer' : 'not-allowed'}}
            disabled={!data.previous}
            onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
          <button
            style={{...buttonSecondary, opacity: data.next ? 1 : 0.6, cursor: data.next ? 'pointer' : 'not-allowed'}}
            disabled={!data.next}
            onClick={()=>setPage(p=>p+1)}>Next</button>
        </div>
      </div>
    </div>
  )
}
