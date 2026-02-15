'use client'

import { Task } from '@/lib/types'
import ProjectBadge from './ProjectBadge'
import { useRef } from 'react'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'

interface KanbanTaskCardProps {
  task: Task
  onClick?: (task: Task) => void
}

export default function KanbanTaskCard({ task, onClick }: KanbanTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const projectColor = task.expand?.project?.color || '#6B7280'

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg shadow-sm border-l-4 p-4 cursor-move hover:shadow-md transition-shadow"
      onClick={() => onClick?.(task)}
      style={{
        ...style,
        borderLeftColor: projectColor,
      }}
    >
      <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
        {task.title}
      </h3>

      <div className="flex items-center justify-between mb-3">
        {task.expand?.project && (
          <ProjectBadge project={task.expand.project} />
        )}
        <span className="text-xs text-gray-500">
          #{task.id.slice(0, 8)}
        </span>
      </div>

      {task.description && (
        <p className="text-xs text-gray-600 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        {task.expand?.claimed_by ? (
          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
            {task.expand.claimed_by.username}
          </span>
        ) : (
          <span className="text-gray-400">Unclaimed</span>
        )}
        <span>{new Date(task.created).toLocaleDateString()}</span>
      </div>
    </div>
  )
}
