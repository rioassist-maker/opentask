'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import KanbanBoard from '@/components/KanbanBoard'
import { getTasks } from '@/lib/tasks'
import { isAuthenticated } from '@/lib/auth'
import { initPocketBase } from '@/lib/pocketbase'
import { Task } from '@/lib/types'

/**
 * Dashboard Page - Displays all tasks in Kanban board
 */
export default function DashboardPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Ensure PocketBase is initialized and auth is loaded from localStorage
    initPocketBase()
    
    // Mark as mounted (client-side)
    setMounted(true)
  }, [])

  useEffect(() => {
    // Wait for client-side mount
    if (!mounted) return

    // Check authentication after PocketBase is initialized
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

    loadTasks()
  }, [mounted, router])

  // Show loading shell so the route has content and replaces previous page (e.g. login).
  // Returning null here caused "URL is /dashboard but login view still visible" in prod.
  if (!mounted) {
    return (
      <div className="flex flex-col h-screen bg-red-100">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-red-100">
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
