import { pb } from './pocketbase'
import { Task, TaskStatus } from './types'

export const getTasks = async (status?: TaskStatus): Promise<Task[]> => {
  try {
    const filter = status ? `(status='${status}')` : ''
    const response = await pb.collection('tasks').getList(1, 100, {
      filter,
      expand: 'created_by,claimed_by,project',
      sort: '-created',
      $autoCancel: false,
    })
    return response.items as any as Task[]
  } catch (error) {
    throw error
  }
}

export const getTask = async (id: string): Promise<Task> => {
  try {
    return (await pb.collection('tasks').getOne(id, {
      expand: 'created_by,claimed_by,project',
      $autoCancel: false,
    })) as any as Task
  } catch (error) {
    throw error
  }
}

export const createTask = async (
  title: string,
  description: string,
  project?: string
): Promise<Task> => {
  try {
    const user = pb.authStore.model as any
    const data: any = {
      title,
      description,
      status: 'todo',
      created_by: user.id,
    }
    if (project) {
      data.project = project
    }
    return (await pb.collection('tasks').create(data)) as any as Task
  } catch (error) {
    throw error
  }
}

export const updateTaskStatus = async (
  id: string,
  status: TaskStatus
): Promise<Task> => {
  try {
    return (await pb.collection('tasks').update(id, {
      status,
    })) as any as Task
  } catch (error) {
    throw error
  }
}

export const updateTask = async (
  id: string,
  data: {
    title?: string
    description?: string
    status?: TaskStatus
    project?: string
  }
): Promise<Task> => {
  try {
    const updateData: any = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.status !== undefined) updateData.status = data.status
    if (data.project !== undefined) updateData.project = data.project || null

    return (await pb.collection('tasks').update(id, updateData)) as any as Task
  } catch (error) {
    throw error
  }
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const getStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case 'todo':
      return 'bg-gray-200 text-gray-800'
    case 'in_progress':
      return 'bg-blue-200 text-blue-800'
    case 'done':
      return 'bg-green-200 text-green-800'
    default:
      return 'bg-gray-200 text-gray-800'
  }
}
