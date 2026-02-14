export type TaskStatus = 'todo' | 'in_progress' | 'done'

export interface User {
  id: string
  email: string
  username: string
  created: string
  updated: string
}

export interface Project {
  id: string
  name: string
  description: string
  created_by?: string
  created: string
  updated: string
  expand?: {
    created_by?: User
  }
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  project?: string
  created_by?: string
  claimed_by?: string | null
  created: string
  updated: string
  completed_at: string | null
  expand?: {
    created_by?: User
    claimed_by?: User
    project?: Project
  }
}

export interface ActivityLog {
  id: string
  task: string
  user: string
  action: 'created' | 'claimed' | 'updated' | 'completed'
  details: string
  created: string
  expand?: {
    task?: Task
    user?: User
  }
}

export interface AuthResponse {
  token: string
  record: User
}
