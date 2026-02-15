import { pb } from './pocketbase'
import { User } from './types'

/**
 * Get all users
 */
export async function getUsers(): Promise<User[]> {
  try {
    const records = await pb.collection('users').getFullList<User>({
      sort: 'email',
    })
    return records
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}
