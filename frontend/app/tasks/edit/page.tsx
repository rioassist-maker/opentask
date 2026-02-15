'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import EditTaskForm from '@/components/EditTaskForm'
import { isAuthenticated } from '@/lib/auth'

function EditTaskContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id') ?? ''

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/')
    }
  }, [router])

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-gray-600">No task ID provided.</p>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Back to dashboard
          </button>
        </main>
      </div>
    )
  }

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
          <EditTaskForm taskId={id} />
        </div>
      </main>
    </div>
  )
}

export default function EditTaskPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <EditTaskContent />
    </Suspense>
  )
}
