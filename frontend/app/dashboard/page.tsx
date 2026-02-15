'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import KanbanBoard from '@/components/KanbanBoard'
import { getTasks } from '@/lib/tasks'
import { isAuthenticated } from '@/lib/auth'
import { Task } from '@/lib/types'

/**
 * Dashboard Page - Displays all tasks in Kanban board
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
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />

      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-lg">Loading tasks...</p>
        </div>
      ) : (
        <KanbanBoard initialTasks={tasks} />
      )}
    </div>
  )
}
