import { pb } from './pocketbase'
import { Comment } from './types'

/**
 * Get all comments for a task
 */
export async function getComments(taskId: string): Promise<Comment[]> {
  try {
    const records = await pb.collection('comments').getFullList<Comment>({
      filter: `task = "${taskId}"`,
      sort: 'created',
      expand: 'user,parent',
    })
    return records
  } catch (error) {
    console.error('Error fetching comments:', error)
    throw error
  }
}

/**
 * Create a new comment
 */
export async function createComment(data: {
  task: string
  user: string
  content: string
  parent?: string
  mentions?: string[]
}): Promise<Comment> {
  try {
    const record = await pb.collection('comments').create<Comment>(data, {
      expand: 'user',
    })
    return record
  } catch (error) {
    console.error('Error creating comment:', error)
    throw error
  }
}

/**
 * Update a comment
 */
export async function updateComment(
  id: string,
  data: {
    content: string
    mentions?: string[]
  }
): Promise<Comment> {
  try {
    const record = await pb.collection('comments').update<Comment>(id, data, {
      expand: 'user',
    })
    return record
  } catch (error) {
    console.error('Error updating comment:', error)
    throw error
  }
}

/**
 * Delete a comment
 */
export async function deleteComment(id: string): Promise<boolean> {
  try {
    await pb.collection('comments').delete(id)
    return true
  } catch (error) {
    console.error('Error deleting comment:', error)
    throw error
  }
}

/**
 * Subscribe to real-time comment updates for a task
 */
export function subscribeToComments(
  taskId: string,
  callback: (comment: Comment) => void
): () => void {
  pb.collection('comments').subscribe<Comment>('*', (e) => {
    // Only trigger for comments on this task
    if (e.record.task === taskId) {
      callback(e.record)
    }
  })

  // Return unsubscribe function
  return () => {
    pb.collection('comments').unsubscribe('*')
  }
}
