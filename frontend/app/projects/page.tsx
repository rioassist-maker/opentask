'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import ProjectList from '@/components/ProjectList'
import { getProjects } from '@/lib/projects'
import { isAuthenticated } from '@/lib/auth'
import { Project } from '@/lib/types'

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/')
      return
    }

    const loadProjects = async () => {
      try {
        setLoading(true)
        const data = await getProjects()
        setProjects(data)
        setError('')
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Failed to load projects')
        }
      } finally {
        setLoading(false)
      }
    }

    // Load projects on mount only
    loadProjects()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          <p className="text-gray-600 mt-1">
            Manage your projects below.
          </p>
        </div>

        <div className="mb-4">
          <a
            href="/projects/new"
            className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Create New Project
          </a>
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading projects...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <ProjectList projects={projects} />
          </div>
        )}
      </main>
    </div>
  )
}
