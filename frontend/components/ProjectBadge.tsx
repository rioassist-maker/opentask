'use client'

import { Project } from '@/lib/types'

interface ProjectBadgeProps {
  project?: Project
  onClick?: (e: React.MouseEvent) => void
}

export default function ProjectBadge({ project, onClick }: ProjectBadgeProps) {
  if (!project) {
    return (
      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        No Project
      </span>
    )
  }

  const color = project.color || '#6B7280'
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
      : '107,114,128'
  }

  const rgb = hexToRgb(color)
  const bgColor = `rgba(${rgb},0.2)`
  const textColor = color

  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
      onClick={onClick}
    >
      {project.name}
    </span>
  )
}
