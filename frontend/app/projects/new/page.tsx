'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import CreateProjectForm from '@/components/CreateProjectForm'
import { isAuthenticated } from '@/lib/auth'

export default function CreateProjectPage() {
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
          <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
          <p className="text-gray-600 mt-1">
            Set up a new project to organize your tasks.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <CreateProjectForm />
        </div>
      </main>
    </div>
  )
}
