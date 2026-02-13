import Link from 'next/link'
import AuthForm from '@/components/AuthForm'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto pt-12 px-4">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            OpenTask
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Task management with AI agent integration
          </p>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Login</h2>
            <AuthForm mode="login" />
          </div>

          <div className="border-t pt-6">
            <p className="text-center text-sm text-gray-600 mb-4">
              Create an account to get started
            </p>
            <Link
              href="/signup"
              className="block w-full px-4 py-2 text-center border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
