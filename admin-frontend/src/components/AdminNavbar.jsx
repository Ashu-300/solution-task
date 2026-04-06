import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AdminNavbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const linkClass = ({ isActive }) =>
    `rounded-full px-3 py-1 text-sm transition ${isActive ? 'bg-cyan-400 text-slate-900' : 'text-slate-300 hover:text-white'}`

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-900/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <h1 className="text-lg font-black tracking-wide text-cyan-300">Clean City Admin Portal</h1>
        <nav className="flex items-center gap-2">
          <NavLink to="/dashboard" className={linkClass}>Complaints</NavLink>
          <NavLink to="/map" className={linkClass}>Map Ops</NavLink>
          <NavLink to="/bins/new" className={linkClass}>Add Bin</NavLink>
          <button
            onClick={handleLogout}
            type="button"
            className="rounded-full bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  )
}
