import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { issueDetail, listComments, addComment } from '../api'
import Loader from '../components/Loader'
import { useTheme } from '../store'

export default function IssueDetail() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { id } = useParams()
  const issueId = Number(id)
  const [issue, setIssue] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)
  const [content, setContent] = useState('')

  async function load() {
    setLoading(true); setError(null)
    try {
      const [i, c] = await Promise.all([issueDetail(issueId), listComments(issueId)])
      setIssue(i); setComments(c.results || c) // DRF default paginator vs none; our view returns list
    } catch { setError('Failed to load') }
    setLoading(false)
  }
  useEffect(()=>{ load() }, [issueId])

  async function submit(e:any) {
    e.preventDefault()
    try {
      await addComment(issueId, content)
      setContent('')
      await load()
    } catch { alert('Failed to comment') }
  }

  if (loading) return <Loader/>
  const pageBg: React.CSSProperties = {
    minHeight: '100dvh',
    background: isDark
      ? 'linear-gradient(135deg, #0b1220 0%, #0f172a 50%, #0b3d2e 100%)'
      : 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #22c55e 100%)',
    padding: 24,
    color: isDark ? '#e5e7eb' : undefined,
  }
  const container: React.CSSProperties = {
    maxWidth: 1000,
    margin: '0 auto',
  }
  const card: React.CSSProperties = {
    background: isDark ? 'rgba(2,6,23,0.72)' : 'rgba(255,255,255,0.92)',
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
  const buttonPrimary: React.CSSProperties = {
    padding: '10px 14px',
    borderRadius: 10,
    border: 'none',
    color: 'white',
    background: isDark ? 'linear-gradient(135deg, #22c55e, #0ea5e9)' : 'linear-gradient(135deg, #6366f1, #0ea5e9)',
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
  if (error) return (
    <div style={pageBg}>
      <div style={container}>
        <div style={{...card, padding:24}}>
          <div style={{color:'#ef4444', fontWeight:700}}>{error}</div>
        </div>
      </div>
    </div>
  )
  if (!issue) return (
    <div style={pageBg}>
      <div style={container}>
        <div style={{...card, padding:24}}>Not found</div>
      </div>
    </div>
  )

  return (
    <div style={pageBg}>
      <div style={container}>
        <section style={{...card, padding:22, marginBottom:16}}>
          <h2 style={{margin:'0 0 6px 0'}}>{issue.title}</h2>
          <p style={{margin:'0 0 10px 0', color:'#374151'}}>{issue.description}</p>
          <div style={{display:'flex', gap:8, flexWrap:'wrap', alignItems:'center'}}>
            <span style={badge(issue.status)}>{issue.status}</span>
            <span style={badge(issue.priority)}>{issue.priority}</span>
            <small style={{color:'#374151'}}>Reporter: {issue.reporter?.username}</small>
            <small style={{color:'#374151'}}>Assignee: {issue.assignee?.username || '-'}</small>
          </div>
        </section>

        <section style={{...card, padding:20, marginBottom:16}}>
          <h3 style={{margin:'0 0 12px 0'}}>Comments</h3>
          {!comments?.length ? (
            <p style={{margin:0}}>No comments yet.</p>
          ) : (
            <ul style={{listStyle:'none', padding:0, margin:0}}>
              {comments.map((c:any)=>(
                <li key={c.id} style={{display:'grid', gridTemplateColumns:'24px 1fr', gap:10, marginBottom:12}}>
                  <div style={{display:'flex', justifyContent:'center'}}>
                    <div style={{width:8, height:8, borderRadius:999, background:'#6366f1', marginTop:6}}/>
                  </div>
                  <div>
                    <div style={{display:'flex', gap:8, alignItems:'baseline', flexWrap:'wrap'}}>
                      <strong>{c.author?.username}</strong>
                      <small style={{color:'#6b7280'}}>on {new Date(c.created_at).toLocaleString()}</small>
                    </div>
                    <div style={{marginTop:4}}>{c.content}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section style={{...card, padding:20}}>
          <h3 style={{margin:'0 0 10px 0'}}>Add a comment</h3>
          <form onSubmit={submit} style={{display:'grid', gap:10, maxWidth:640}}>
            <textarea style={{...inputStyle, minHeight:110}} value={content} onChange={e=>setContent(e.target.value)} placeholder="Share your thoughts, findings, or updates…" required />
            <div>
              <button style={buttonPrimary} type="submit">Post Comment</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}
