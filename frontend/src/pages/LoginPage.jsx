import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { parseJwt } from '../utils/jwt'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await login({ email, password })
      if (!data?.token) throw new Error('Token not received')
      const payload = parseJwt(data.token)
      loginWithToken(data.token)
      navigate(payload?.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto mt-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#16324f] p-6 shadow-xl">
      <h1 className="mb-1 text-3xl font-black text-[#f7f4ea]">Welcome Back</h1>
      <p className="mb-6 text-sm text-slate-300">Log in to report and track city cleanliness issues.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-white outline-none focus:border-[#f25f5c]"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-white outline-none focus:border-[#f25f5c]"
        />

        {error && <p className="text-sm text-rose-300">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#f25f5c] px-4 py-2 font-bold text-black transition hover:brightness-110 disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-300">
        New here?{' '}
        <Link to="/register" className="font-bold text-[#f7f4ea] underline">
          Create account
        </Link>
      </p>
    </section>
  )
}
