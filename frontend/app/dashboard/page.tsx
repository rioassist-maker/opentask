'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import TaskList from '@/components/TaskList'
import { getTasks } from '@/lib/tasks'
import { isAuthenticated } from '@/lib/auth'
import { Task } from '@/lib/types'

/**
 * Dashboard Page - Displays all tasks
 * Fixed: Removed unnecessary 5-second polling interval
 */
export default function DashboardPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/')
      return
    }

    const loadTasks = async () => {
      try {
        setLoading(true)
        const data = await getTasks()
        // Sort by status: todo first, then in_progress, then done
        const statusOrder = { todo: 0, in_progress: 1, done: 2 }
        data.sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
        setTasks(data)
        setError('')
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Failed to load tasks')
        }
      } finally {
        setLoading(false)
      }
    }

    // Load tasks on mount only
    loadTasks()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
          <p className="text-gray-600 mt-1">
            Manage your tasks below. Click a task to see its description.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading tasks...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <TaskList tasks={tasks} />
          </div>
        )}
      </main>
    </div>
  )
}
