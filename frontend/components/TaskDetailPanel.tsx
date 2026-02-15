'use client'

import { Task, TaskStatus } from '@/lib/types'
import { updateTask } from '@/lib/tasks'
import ProjectBadge from './ProjectBadge'
import { useState, useEffect, useRef } from 'react'

interface TaskDetailPanelProps {
  task: Task
  onClose: () => void
  onUpdate: (task: Task) => void
}

const statuses: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'Backlog' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'done', label: 'Done' },
]

export default function TaskDetailPanel({
  task,
  onClose,
  onUpdate,
}: TaskDetailPanelProps) {
  const [status, setStatus] = useState<TaskStatus>(task.status)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingDescription, setEditingDescription] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const modalRef = useRef<HTMLDivElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null)

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Focus input when editing
  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
      titleInputRef.current.select()
    }
  }, [editingTitle])

  useEffect(() => {
    if (editingDescription && descriptionTextareaRef.current) {
      descriptionTextareaRef.current.focus()
      descriptionTextareaRef.current.select()
    }
  }, [editingDescription])

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const updatedTask = await updateTask(task.id, { status: newStatus })
      setStatus(newStatus)
      onUpdate(updatedTask)
      setSuccess('Status updated')
      setTimeout(() => setSuccess(''), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTitle = async () => {
    if (title.trim() === task.title) {
      setEditingTitle(false)
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const updatedTask = await updateTask(task.id, { title: title.trim() })
      onUpdate(updatedTask)
      setEditingTitle(false)
      setSuccess('Title updated')
      setTimeout(() => setSuccess(''), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update title')
      setTitle(task.title)
      setEditingTitle(false)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDescription = async () => {
    if (description === task.description) {
      setEditingDescription(false)
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const updatedTask = await updateTask(task.id, {
        description: description.trim(),
      })
      onUpdate(updatedTask)
      setEditingDescription(false)
      setSuccess('Description updated')
      setTimeout(() => setSuccess(''), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update description')
      setDescription(task.description)
      setEditingDescription(false)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelTitle = () => {
    setTitle(task.title)
    setEditingTitle(false)
  }

  const handleCancelDescription = () => {
    setDescription(task.description)
    setEditingDescription(false)
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-40 p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex items-start justify-between sticky top-0 bg-white z-10">
          <div className="flex-1 min-w-0">
            {editingTitle ? (
              <div className="space-y-2">
                <input
                  ref={titleInputRef}
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full text-2xl font-bold text-gray-900 border border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveTitle}
                    disabled={loading}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelTitle}
                    disabled={loading}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setEditingTitle(true)}
                className="cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2 break-words">
                  {task.title}
                </h2>
                <p className="text-xs text-gray-500">
                  ID: {task.id.slice(0, 12)}...
                </p>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl leading-none ml-2 flex-shrink-0"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded text-sm animate-in">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-100 text-green-700 rounded text-sm animate-in">
              {success}
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Description
            </h3>
            {editingDescription ? (
              <div className="space-y-2">
                <textarea
                  ref={descriptionTextareaRef}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full border border-blue-500 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] font-sans"
                  disabled={loading}
                  placeholder="Enter task description"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveDescription}
                    disabled={loading}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelDescription}
                    disabled={loading}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setEditingDescription(true)}
                className="cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors min-h-[60px] flex items-center"
              >
                {description ? (
                  <p className="text-gray-600 text-sm whitespace-pre-wrap break-words">
                    {task.description}
                  </p>
                ) : (
                  <p className="text-gray-400 text-sm italic">
                    Click to add description
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Project */}
          {task.expand?.project && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Project
              </h3>
              <ProjectBadge project={task.expand.project} />
            </div>
          )}

          {/* Status */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Status
            </h3>
            <div className="space-y-2">
              {statuses.map(s => (
                <button
                  key={s.value}
                  onClick={() => handleStatusChange(s.value)}
                  className={`block w-full text-left px-4 py-2 rounded text-sm font-medium transition-colors ${
                    status === s.value
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  } disabled:opacity-50`}
                  disabled={loading}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Created By */}
          {task.expand?.created_by && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Created By
              </h3>
              <p className="text-sm text-gray-600">
                {task.expand.created_by.username}
              </p>
            </div>
          )}

          {/* Claimed By */}
          {task.expand?.claimed_by && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Claimed By
              </h3>
              <p className="text-sm text-gray-600">
                {task.expand.claimed_by.username}
              </p>
            </div>
          )}

          {/* Dates */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs mb-1">Created</p>
                <p className="text-gray-900 font-medium">
                  {new Date(task.created).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-gray-500 text-xs">
                  {new Date(task.created).toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Updated</p>
                <p className="text-gray-900 font-medium">
                  {new Date(task.updated).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-gray-500 text-xs">
                  {new Date(task.updated).toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            {task.completed_at && (
              <div className="pt-2">
                <p className="text-gray-500 text-xs mb-1">Completed</p>
                <p className="text-gray-900 font-medium">
                  {new Date(task.completed_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
