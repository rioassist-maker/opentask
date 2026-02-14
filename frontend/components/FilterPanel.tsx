'use client'

import { Project } from '@/lib/types'
import { useState } from 'react'

interface FilterPanelProps {
  projects: Project[]
  selectedProject?: string
  onProjectChange?: (projectId: string | undefined) => void
}

export default function FilterPanel({
  projects,
  selectedProject,
  onProjectChange,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Filter by Project
          <span className="ml-2">▼</span>
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 left-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[200px]">
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${
                !selectedProject
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => {
                onProjectChange?.(undefined)
                setIsOpen(false)
              }}
            >
              All Projects
            </button>

            {projects.map(project => (
              <button
                key={project.id}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  selectedProject === project.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => {
                  onProjectChange?.(project.id)
                  setIsOpen(false)
                }}
              >
                {project.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
