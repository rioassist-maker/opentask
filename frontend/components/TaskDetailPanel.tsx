'use client'

import { Task, TaskStatus } from '@/lib/types'
import { updateTask } from '@/lib/tasks'
import ProjectBadge from './ProjectBadge'
import { useState } from 'react'

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      setLoading(true)
      setError('')

      const updatedTask = await updateTask(task.id, { status: newStatus })
      setStatus(newStatus)
      onUpdate(updatedTask)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-40 p-4">
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md h-full max-h-screen overflow-y-auto flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {task.title}
            </h2>
            <p className="text-sm text-gray-500">ID: {task.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          {/* Description */}
          {task.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Description
              </h3>
              <p className="text-gray-600 text-sm">{task.description}</p>
            </div>
          )}

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
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs mb-1">Created</p>
              <p className="text-gray-900 font-medium">
                {new Date(task.created).toLocaleDateString()}
              </p>
            </div>
            {task.completed_at && (
              <div>
                <p className="text-gray-500 text-xs mb-1">Completed</p>
                <p className="text-gray-900 font-medium">
                  {new Date(task.completed_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
