'use client'

import { Project } from '@/lib/types'
import { formatDate } from '@/lib/projects'

interface ProjectListProps {
  projects: Project[]
}

export default function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No projects found. Create one to get started!</p>
      </div>
    )
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200 bg-gray-50">
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Description</th>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Created By</th>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Created</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <tr key={project.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{project.name}</td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {project.description ? project.description.substring(0, 100) : '-'}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {project.expand?.created_by?.email || 'Unknown'}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">{formatDate(project.created)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
