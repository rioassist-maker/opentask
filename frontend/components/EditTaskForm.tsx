'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { updateTask, getTask } from '@/lib/tasks'
import { getProjects } from '@/lib/projects'
import { Project, Task, TaskStatus } from '@/lib/types'
import { getPocketBaseErrorMessage, logDetailedError } from '@/lib/errorHandling'

interface EditTaskFormProps {
  taskId: string
}

const TASK_STATUSES: TaskStatus[] = ['todo', 'in_progress', 'done']

export default function EditTaskForm({ taskId }: EditTaskFormProps) {
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [project, setProject] = useState('')
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  // Load task and projects
  useEffect(() => {
    const loadData = async () => {
      try {
        const [taskData, projectsData] = await Promise.all([
          getTask(taskId),
          getProjects(),
        ])

        setTask(taskData)
        setTitle(taskData.title)
        setDescription(taskData.description || '')
        setStatus(taskData.status as TaskStatus)
        setProject(taskData.project || '')
        setProjects(projectsData)
      } catch (err) {
        logDetailedError('EditTaskForm.loadData', err)
        const errorMessage = getPocketBaseErrorMessage(err)
        setError(`Failed to load task data: ${errorMessage}`)
      } finally {
        setPageLoading(false)
      }
    }

    loadData()
  }, [taskId])

  const validateForm = (): string | null => {
    if (!title.trim()) {
      return 'Title is required'
    }
    if (title.length > 200) {
      return 'Title must be 200 characters or less'
    }
    if (description.length > 2000) {
      return 'Description must be 2000 characters or less'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      await updateTask(taskId, {
        title,
        description,
        status,
        project: project || undefined,
      })
      setSuccess('Task updated successfully!')
      setTimeout(() => {
        router.push('/dashboard')
      }, 500)
    } catch (err) {
      logDetailedError('EditTaskForm.handleSubmit', err)
      const errorMessage = getPocketBaseErrorMessage(err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return <div className="text-center py-8">Loading task...</div>
  }

  if (!task) {
    return <div className="text-center py-8 text-red-600">Task not found</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
          placeholder="Task title"
        />
        <p className="mt-1 text-xs text-gray-500">
          {title.length}/200 characters
        </p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={2000}
          rows={4}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
          placeholder="Task description (optional)"
        />
        <p className="mt-1 text-xs text-gray-500">
          {description.length}/2000 characters
        </p>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
        >
          {TASK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, ' ').toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="project" className="block text-sm font-medium text-gray-700">
          Project
        </label>
        <select
          id="project"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
        >
          <option value="">-- No project --</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? 'Updating...' : 'Update Task'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
