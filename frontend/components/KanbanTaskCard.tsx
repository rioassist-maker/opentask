'use client'

import { Task } from '@/lib/types'
import ProjectBadge from './ProjectBadge'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'

interface KanbanTaskCardProps {
  task: Task
  onClick?: (task: Task) => void
}

const priorityColors: Record<string, string> = {
  low: 'bg-blue-50 border-blue-200 text-blue-700',
  medium: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  high: 'bg-orange-50 border-orange-200 text-orange-700',
  urgent: 'bg-red-50 border-red-200 text-red-700',
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
      {...attributes}
      {...listeners}
      className="w-full bg-white rounded-lg shadow-sm border-l-4 p-4 cursor-move hover:shadow-md transition-shadow overflow-hidden"
      onClick={() => onClick?.(task)}
      style={{
        ...style,
        borderLeftColor: projectColor,
      }}
    >
      <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-3 word-wrap break-words whitespace-normal">
        {task.title}
      </h3>

      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {task.expand?.project && (
            <ProjectBadge project={task.expand.project} />
          )}
          {task.priority && (
            <span
              className={`text-xs px-2 py-1 rounded border ${
                priorityColors[task.priority] || 'bg-gray-100 text-gray-700'
              }`}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500 flex-shrink-0">
          #{task.id.slice(0, 8)}
        </span>
      </div>

      {task.description && (
        <p className="text-xs text-gray-600 line-clamp-2 mb-3 break-words whitespace-normal">
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
