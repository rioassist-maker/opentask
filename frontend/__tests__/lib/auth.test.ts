import { isAuthenticated, getCurrentUser, getErrorMessage } from '@/lib/auth'
import { pb } from '@/lib/pocketbase'

describe('Auth Helper Functions', () => {
  beforeEach(() => {
    ;(pb.authStore as any) = {
      isValid: false,
      token: null,
      model: null,
    }
  })

  describe('isAuthenticated', () => {
    it('returns false when not authenticated', () => {
      expect(isAuthenticated()).toBe(false)
    })

    it('returns true when authenticated', () => {
      ;(pb.authStore as any).isValid = true
      expect(isAuthenticated()).toBe(true)
    })
  })

  describe('getCurrentUser', () => {
    it('returns null when not authenticated', () => {
      expect(getCurrentUser()).toBeNull()
    })

    it('returns user model when authenticated', () => {
      const user = { id: '123', email: 'test@example.com' }
      ;(pb.authStore as any).isValid = true
      ;(pb.authStore as any).model = user
      expect(getCurrentUser()).toEqual(user)
    })
  })

  describe('getErrorMessage', () => {
    it('returns formatted error for invalid credentials', () => {
      const error = new Error('Invalid email or password')
      expect(getErrorMessage(error)).toContain('Invalid')
    })

    it('returns generic message for unknown errors', () => {
      const error = new Error('Unknown error')
      expect(getErrorMessage(error)).toBe('Unknown error')
    })

    it('handles non-Error objects', () => {
      const error = { message: 'Not an Error' }
      expect(getErrorMessage(error)).toBe('An error occurred')
    })
  })
})
