import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AuthForm from '@/components/AuthForm'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

describe('AuthForm Component', () => {
  describe('Login Mode', () => {
    it('renders login form with email and password fields', () => {
      render(<AuthForm mode="login" />)
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    })

    it('shows signup link in login mode', () => {
      render(<AuthForm mode="login" />)
      expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument()
    })
  })

  describe('Signup Mode', () => {
    it('renders signup form with all fields', () => {
      render(<AuthForm mode="signup" />)
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
    })

    it('shows login link in signup mode', () => {
      render(<AuthForm mode="signup" />)
      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('shows error if password is less than 8 characters', async () => {
      render(<AuthForm mode="signup" />)

      fireEvent.change(screen.getByLabelText(/^email/i), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getAllByLabelText(/^password$/i)[0], {
        target: { value: 'short' },
      })
      fireEvent.change(screen.getAllByLabelText(/confirm password/i)[0], {
        target: { value: 'short' },
      })
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

      await waitFor(() => {
        expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument()
      })
    })

    it('shows error if passwords do not match', async () => {
      render(<AuthForm mode="signup" />)

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getAllByLabelText(/^password$/i)[0], {
        target: { value: 'password123' },
      })
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'different123' },
      })
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

      await waitFor(() => {
        expect(screen.getByText(/do not match/i)).toBeInTheDocument()
      })
    })
  })

  describe('Submit Button', () => {
    it('disables submit button while loading', async () => {
      render(<AuthForm mode="login" />)
      const button = screen.getByRole('button', { name: /login/i })

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/^password$/i), {
        target: { value: 'password123' },
      })
      fireEvent.click(button)

      // Button should be disabled after click
      expect(button).toBeDisabled()
    })
  })
})
