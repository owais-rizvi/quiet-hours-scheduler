export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Quiet Hours Scheduler
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Schedule and manage your quiet hours with ease
        </p>
        <div className="space-x-4">
          <a
            href="/auth/login"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Login
          </a>
          <a
            href="/auth/signup"
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
