import { pb } from './pocketbase'
import { Task, TaskStatus } from './types'

export const getTasks = async (status?: TaskStatus): Promise<Task[]> => {
  try {
    const filter = status ? `(status='${status}')` : ''
    const response = await pb.collection('tasks').getList(1, 100, {
      filter,
      expand: 'created_by,claimed_by',
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
      expand: 'created_by,claimed_by',
      $autoCancel: false,
    })) as any as Task
  } catch (error) {
    throw error
  }
}

export const createTask = async (
  title: string,
  description: string
): Promise<Task> => {
  try {
    const user = pb.authStore.model as any
    return (await pb.collection('tasks').create({
      title,
      description,
      status: 'todo',
      created_by: user.id,
    })) as any as Task
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
