import axios from 'axios'
import { useAuth } from './store'

// Adjust per backend host
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

const api = axios.create({ baseURL: API_BASE })

api.interceptors.request.use((config) => {
  const token = useAuth.getState().access
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export async function login(username: string, password: string) {
  const r = await axios.post(`${API_BASE}/auth/token/`, { username, password })
  return r.data
}

export async function register(payload: {username:string; email?:string; password:string}) {
  const r = await axios.post(`${API_BASE}/auth/register/`, payload)
  return r.data
}

// Projects
export const listProjects = async (page=1) => (await api.get(`/projects/?page=${page}`)).data
export const createProject = async (data:{name:string; description?:string}) => (await api.post(`/projects/`, data)).data

// Issues
export const listIssues = async (projectId:number, params: Record<string,string|number> = {}) =>
  (await api.get(`/projects/${projectId}/issues/`, { params })).data

export const createIssue = async (projectId:number, data:{title:string; description?:string; status?:string; priority?:string; assignee?:number|null}) =>
  (await api.post(`/projects/${projectId}/issues/`, data)).data

export const patchIssue = async (issueId:number, data: Partial<{status:string; assignee:number|null; title:string; description:string; priority:string}>) =>
  (await api.patch(`/issues/${issueId}/patch/`, data)).data

export const issueDetail = async (issueId:number) => (await api.get(`/issues/${issueId}/`)).data

// Comments
export const listComments = async (issueId:number) => (await api.get(`/issues/${issueId}/comments/`)).data
export const addComment = async (issueId:number, content:string) => (await api.post(`/issues/${issueId}/comments/`, { content })).data

// Users (for assignee dropdown)
export const listUsers = async () => (await api.get(`/users/`)).data
