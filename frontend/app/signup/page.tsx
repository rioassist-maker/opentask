import AuthForm from '@/components/AuthForm'

export default function SignupPage() {
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
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Create Account
            </h2>
            <AuthForm mode="signup" />
          </div>
        </div>
      </div>
    </div>
  )
}
