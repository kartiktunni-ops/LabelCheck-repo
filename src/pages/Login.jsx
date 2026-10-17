import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await login(username, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="bg-navy-50 py-16">
      <div className="section flex justify-center">
        <div className="card w-full max-w-sm">
          <span className="pill-badge">Officer Login</span>
          <h1 className="mt-4 text-2xl font-extrabold text-navy-900">Sign in to the Dashboard</h1>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-wide text-navy-400">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                className="mt-1.5 w-full rounded-md border border-navy-200 px-3 py-2 text-sm text-navy-900 outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/30"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wide text-navy-400">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="mt-1.5 w-full rounded-md border border-navy-200 px-3 py-2 text-sm text-navy-900 outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/30"
              />
            </div>

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{error}</p>
            )}

            <button type="submit" disabled={submitting} className="btn-solid-saffron w-full disabled:cursor-not-allowed disabled:opacity-50">
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
