import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { adminRegister } from '../services/api'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { loginWithToken } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await adminRegister(name, email, password)
      loginWithToken(data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto mt-16 w-full max-w-md rounded-2xl border border-white/10 bg-slate-800/80 p-6 shadow-2xl">
      <h2 className="text-3xl font-black text-cyan-300">Admin Register</h2>
      <p className="mt-1 text-sm text-slate-300">Create a new admin account for municipal operations.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="text"
          required
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-white outline-none focus:border-cyan-400"
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-white outline-none focus:border-cyan-400"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-white outline-none focus:border-cyan-400"
        />

        {error && <p className="text-sm text-rose-300">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-cyan-400 px-4 py-2 font-bold text-slate-900 transition hover:brightness-110 disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Register Admin'}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-300">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-cyan-300 underline">
          Login
        </Link>
      </p>
    </div>
  )
}
