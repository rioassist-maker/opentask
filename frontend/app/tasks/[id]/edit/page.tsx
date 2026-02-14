'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import EditTaskForm from '@/components/EditTaskForm'
import { isAuthenticated } from '@/lib/auth'

interface EditTaskPageProps {
  params: {
    id: string
  }
}

export default function EditTaskPage({ params }: EditTaskPageProps) {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Edit Task</h2>
          <p className="text-gray-600 mt-1">
            Update task details and properties.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <EditTaskForm taskId={params.id} />
        </div>
      </main>
    </div>
  )
}
