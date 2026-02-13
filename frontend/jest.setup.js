import '@testing-library/jest-dom'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock PocketBase
jest.mock('@/lib/pocketbase', () => ({
  pb: {
    collection: jest.fn(),
    authStore: { 
      isValid: false,
      token: null,
      model: null,
    },
  },
}))
