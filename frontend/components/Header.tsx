'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, logout } from '@/lib/auth'
import { initPocketBase, getPocketBase } from '@/lib/pocketbase'
import { User } from '@/lib/types'

interface HeaderProps {
  onLogout?: () => void
}

export default function Header({ onLogout }: HeaderProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Initialize PocketBase and load auth from localStorage
    initPocketBase()
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const updateUser = () => setUser(getCurrentUser())

    // Set user now (in case auth was already loaded)
    updateUser()

    // On refresh, auth can load from localStorage after first tick; subscribe so we update when it does
    const pb = getPocketBase()
    const unsub = pb.authStore.onChange(() => {
      updateUser()
    })

    return () => {
      unsub()
    }
  }, [mounted])

  const handleLogout = () => {
    logout()
    setUser(null)
    onLogout?.()
    router.push('/')
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-gray-900">OpenTask</h1>
            {user && (
              <nav className="flex items-center space-x-4">
                <a href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Tasks
                </a>
                <a href="/projects" className="text-gray-600 hover:text-gray-900">
                  Projects
                </a>
              </nav>
            )}
          </div>

          <nav className="flex items-center space-x-4">
            <a
              href="/tasks/new"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              New Task
            </a>

            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <span className="text-gray-600">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
