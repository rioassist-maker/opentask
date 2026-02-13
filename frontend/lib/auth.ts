import { pb } from './pocketbase'
import { User } from './types'

export const isAuthenticated = (): boolean => {
  return pb.authStore.isValid
}

export const getCurrentUser = (): User | null => {
  if (!pb.authStore.isValid) {
    return null
  }
  return pb.authStore.model as User
}

export const login = async (email: string, password: string): Promise<void> => {
  try {
    await pb.collection('users').authWithPassword(email, password)
  } catch (error) {
    throw error
  }
}

export const signup = async (
  email: string,
  password: string,
  passwordConfirm: string
): Promise<void> => {
  try {
    await pb.collection('users').create({
      email,
      password,
      passwordConfirm,
    })
    // Auto-login after signup
    await login(email, password)
  } catch (error) {
    throw error
  }
}

export const logout = (): void => {
  pb.authStore.clear()
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.message.includes('invalid')) {
      return 'Invalid email or password'
    }
    if (error.message.includes('already exists')) {
      return 'Email already registered'
    }
    return error.message
  }
  return 'An error occurred'
}
