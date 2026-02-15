'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Task, TaskStatus, Project } from '@/lib/types'
import { updateTask, getTasks } from '@/lib/tasks'
import { getProjects } from '@/lib/projects'
import { getPocketBaseErrorMessage, logDetailedError } from '@/lib/errorHandling'
import KanbanColumn from './KanbanColumn'
import FilterPanel from './FilterPanel'
import TaskDetailPanel from './TaskDetailPanel'
import ProjectSettingsModal from './ProjectSettingsModal'
import QuickCreateButton from './QuickCreateButton'

interface KanbanBoardProps {
  initialTasks: Task[]
}

const COLUMN_ORDER: TaskStatus[] = ['todo', 'in_progress', 'blocked', 'done']
const COLUMN_TITLES: Record<TaskStatus, string> = {
  todo: 'Backlog',
  in_progress: 'In Progress',
  blocked: 'Blocked',
  done: 'Done',
}

export default function KanbanBoard({ initialTasks }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string | undefined>()
  const [selectedTask, setSelectedTask] = useState<Task | undefined>()
  const [selectedProjectForSettings, setSelectedProjectForSettings] = useState<
    Project | undefined
  >()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Load projects on mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects()
        setProjects(data)
      } catch (err) {
        console.error('Failed to load projects:', err)
      }
    }

    loadProjects()
  }, [])

  // Real-time subscription to tasks (if PocketBase supports it)
  useEffect(() => {
    const subscribeToChanges = async () => {
      try {
        // This would require PocketBase real-time subscriptions
        // For now, we'll just load tasks on component mount
        const data = await getTasks()
        setTasks(data)
      } catch (err) {
        console.error('Failed to load tasks:', err)
      }
    }

    subscribeToChanges()
  }, [])

  // Filter tasks by project
  const filteredTasks = selectedProject
    ? tasks.filter(task => task.project === selectedProject)
    : tasks

  // Group tasks by status
  const tasksByStatus: Record<TaskStatus, Task[]> = {
    todo: [],
    in_progress: [],
    blocked: [],
    done: [],
  }

  filteredTasks.forEach(task => {
    tasksByStatus[task.status].push(task)
  })

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const taskId = active.id as string
    let newStatus: TaskStatus | undefined
    const validStatuses: TaskStatus[] = ['todo', 'in_progress', 'blocked', 'done']

    // Extract the new status: over.id could be either a task ID or a column ID (status)
    if (validStatuses.includes(over.id as TaskStatus)) {
      // Direct drop on column
      newStatus = over.id as TaskStatus
    } else {
      // Drop on a task - find which column this task belongs to
      const targetTask = tasks.find(t => t.id === over.id)
      if (targetTask) {
        newStatus = targetTask.status
      }
    }

    if (!newStatus || !validStatuses.includes(newStatus)) {
      setError(`Error: Invalid drop target (${over.id}). Please try again.`)
      return
    }

    const task = tasks.find(t => t.id === taskId)
    if (!task || task.status === newStatus) return

    try {
      setLoading(true)
      const updatedTask = await updateTask(taskId, { status: newStatus })

      setTasks(prevTasks =>
        prevTasks.map(t => (t.id === taskId ? updatedTask : t))
      )

      // Update selected task if it was the one moved
      if (selectedTask?.id === taskId) {
        setSelectedTask(updatedTask)
      }

      setError('')
    } catch (err) {
      logDetailedError('KanbanBoard.handleDragEnd', err)
      const errorMessage = getPocketBaseErrorMessage(err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(t => (t.id === updatedTask.id ? updatedTask : t))
    )
    setSelectedTask(updatedTask)
  }

  const handleProjectUpdate = (updatedProject: Project) => {
    setProjects(prevProjects =>
      prevProjects.map(p => (p.id === updatedProject.id ? updatedProject : p))
    )

    // Update tasks with the updated project
    setTasks(prevTasks =>
      prevTasks.map(t =>
        t.expand?.project?.id === updatedProject.id
          ? {
              ...t,
              expand: {
                ...t.expand,
                project: updatedProject,
              },
            }
          : t
      )
    )

    setSelectedProjectForSettings(undefined)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
          <div className="flex items-center gap-3">
            {projects.length > 0 && (
              <button
                onClick={() => {
                  const project = projects.find(p => p.id === selectedProject)
                  if (project) {
                    setSelectedProjectForSettings(project)
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Settings
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded text-sm mb-4">
            {error}
          </div>
        )}

        <FilterPanel
          projects={projects}
          selectedProject={selectedProject}
          onProjectChange={setSelectedProject}
        />
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-6 bg-gray-100">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 min-w-max">
            {COLUMN_ORDER.map(status => (
              <KanbanColumn
                key={status}
                status={status}
                title={COLUMN_TITLES[status]}
                tasks={tasksByStatus[status]}
                onTaskClick={setSelectedTask}
              />
            ))}
          </div>
        </DndContext>
      </div>

      {/* Task Detail Panel */}
      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          onClose={() => setSelectedTask(undefined)}
          onUpdate={handleTaskUpdate}
        />
      )}

      {/* Project Settings Modal */}
      {selectedProjectForSettings && (
        <ProjectSettingsModal
          project={selectedProjectForSettings}
          onClose={() => setSelectedProjectForSettings(undefined)}
          onUpdate={handleProjectUpdate}
        />
      )}

      {/* Quick Create Button */}
      <QuickCreateButton />
    </div>
  )
}
