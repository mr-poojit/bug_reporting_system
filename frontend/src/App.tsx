import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Projects from './pages/Projects'
import ProjectIssues from './pages/ProjectIssues'
import IssueDetail from './pages/IssueDetail'
import { useAuth } from './store'
import ThemeToggle from './components/ThemeToggle'

function Nav() {
  const { access, clear } = useAuth()
  const nav = useNavigate()
  return (
    <div style={{display:'flex', gap:12, padding:12, borderBottom:'1px solid #e5e7eb', alignItems:'center'}}>
      <Link to="/" style={{textDecoration:'none', fontWeight:800}}>🐞 Bug Tracker</Link>
      <div style={{marginLeft:'auto', display:'flex', gap:8, alignItems:'center'}}>
        <ThemeToggle />
        {access ? <button style={{padding:'8px 12px', border:'1px solid #e5e7eb', borderRadius:10, background:'white', cursor:'pointer'}} onClick={()=>{clear(); nav('/login')}}>↩ Logout</button> : <Link to="/login">Login</Link>}
      </div>
    </div>
  )
}

import Protected from './components/Protected'
export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Protected><Projects/></Protected>} />
        <Route path="/projects/:id/issues" element={<Protected><ProjectIssues/></Protected>} />
        <Route path="/issues/:id" element={<Protected><IssueDetail/></Protected>} />
      </Routes>
    </>
  )
}
