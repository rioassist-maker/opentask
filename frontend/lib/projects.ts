import { pb } from './pocketbase'
import { Project } from './types'

export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await pb.collection('projects').getList(1, 100, {
      expand: 'created_by',
      sort: '-created',
      $autoCancel: false,
    })
    return response.items as any as Project[]
  } catch (error) {
    throw error
  }
}

export const getProject = async (id: string): Promise<Project> => {
  try {
    return (await pb.collection('projects').getOne(id, {
      expand: 'created_by',
      $autoCancel: false,
    })) as any as Project
  } catch (error) {
    throw error
  }
}

export const createProject = async (
  name: string,
  description?: string
): Promise<Project> => {
  try {
    const user = pb.authStore.model as any
    return (await pb.collection('projects').create({
      name,
      description: description || '',
      created_by: user.id,
    })) as any as Project
  } catch (error) {
    throw error
  }
}

export const updateProject = async (
  id: string,
  name: string,
  description?: string
): Promise<Project> => {
  try {
    return (await pb.collection('projects').update(id, {
      name,
      description: description || '',
    })) as any as Project
  } catch (error) {
    throw error
  }
}

export const deleteProject = async (id: string): Promise<void> => {
  try {
    await pb.collection('projects').delete(id)
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
