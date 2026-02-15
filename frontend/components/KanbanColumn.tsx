'use client'

import { Task, TaskStatus } from '@/lib/types'
import KanbanTaskCard from './KanbanTaskCard'
import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

interface KanbanColumnProps {
  status: TaskStatus
  title: string
  tasks: Task[]
  onTaskClick?: (task: Task) => void
}

const statusConfig: Record<TaskStatus, { bg: string; count?: number }> = {
  todo: { bg: 'bg-red-50' },
  in_progress: { bg: 'bg-blue-50' },
  blocked: { bg: 'bg-yellow-50' },
  done: { bg: 'bg-green-50' },
}

export default function KanbanColumn({
  status,
  title,
  tasks,
  onTaskClick,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
  })

  const config = statusConfig[status]

  return (
    <div className="flex flex-col bg-gray-50 rounded-lg p-4 w-[340px] min-w-[340px] max-w-[340px] max-h-[calc(100vh-200px)] overflow-hidden">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center justify-between">
          {title}
          <span className="bg-gray-200 text-gray-700 text-sm font-semibold px-3 py-1 rounded-full">
            {tasks.length}
          </span>
        </h2>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto space-y-3 ${config.bg} rounded-lg p-3 w-full`}
      >
        <SortableContext
          items={tasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No tasks</p>
            </div>
          ) : (
            tasks.map(task => (
              <KanbanTaskCard
                key={task.id}
                task={task}
                onClick={onTaskClick}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  )
}
