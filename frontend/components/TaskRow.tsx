'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Task } from '@/lib/types'
import { formatDate, getStatusColor } from '@/lib/tasks'

interface TaskRowProps {
  task: Task
}

export default function TaskRow({ task }: TaskRowProps) {
  const [expanded, setExpanded] = useState(false)

  const createdByEmail = task.expand?.created_by?.email || task.expand?.created_by?.username || 'Unknown'
  const claimedByEmail = task.expand?.claimed_by?.email || task.expand?.claimed_by?.username || 'Unclaimed'
  const projectName = task.expand?.project?.name || '-'

  return (
    <>
      <tr
        onClick={() => setExpanded(!expanded)}
        className="border-b hover:bg-gray-50 cursor-pointer"
      >
        <td className="px-6 py-4 text-sm font-medium text-gray-900">
          {task.title}
        </td>
        <td className="px-6 py-4 text-sm text-gray-600">
          {projectName}
        </td>
        <td className="px-6 py-4 text-sm">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
              task.status
            )}`}
          >
            {task.status}
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-gray-600">{createdByEmail}</td>
        <td className="px-6 py-4 text-sm text-gray-600">
          {task.claimed_by ? claimedByEmail : '-'}
        </td>
        <td className="px-6 py-4 text-sm text-gray-600">
          {formatDate(task.created)}
        </td>
      </tr>

      {expanded && (
        <tr className="border-b bg-gray-50">
          <td colSpan={6} className="px-6 py-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900">Description</h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {task.description || 'No description provided'}
                </p>
              </div>
              {task.status === 'done' && task.completed_at && (
                <p className="text-sm text-gray-600">
                  Completed: {formatDate(task.completed_at)}
                </p>
              )}
              <div className="flex gap-2 pt-2">
                <Link
                  href={`/tasks/edit?id=${task.id}`}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  Edit
                </Link>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
