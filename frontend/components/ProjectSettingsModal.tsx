'use client'

import { Project } from '@/lib/types'
import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { updateProject } from '@/lib/projects'

interface ProjectSettingsModalProps {
  project: Project
  onClose: () => void
  onUpdate: (project: Project) => void
}

export default function ProjectSettingsModal({
  project,
  onClose,
  onUpdate,
}: ProjectSettingsModalProps) {
  const [color, setColor] = useState(project.color || '#6B7280')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    try {
      setLoading(true)
      setError('')

      const updatedProject = await updateProject(project.id, { color })
      onUpdate(updatedProject)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Project Settings: {project.name}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Project Color
          </label>
          <div className="flex flex-col gap-4">
            <HexColorPicker color={color} onChange={setColor} />
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded border-2 border-gray-300"
                style={{ backgroundColor: color }}
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{color}</p>
                <p className="text-xs text-gray-500">Hex color code</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Color'}
          </button>
        </div>
      </div>
    </div>
  )
}
