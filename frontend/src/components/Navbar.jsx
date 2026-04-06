import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const navItem = ({ isActive }) =>
    `rounded-full px-3 py-1 text-sm transition ${isActive ? 'bg-[#f25f5c] text-black' : 'text-slate-200 hover:text-white'}`

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#102542]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="text-lg font-black tracking-wide text-[#f7f4ea]">
          Clean City Reporter
        </Link>

        <nav className="flex items-center gap-2">
          {isAuthenticated && (
            <>
              {!isAdmin && (
                <>
                  <NavLink to="/dashboard" className={navItem}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/report" className={navItem}>
                    Report
                  </NavLink>
                  <NavLink to="/map" className={navItem}>
                    Bins Map
                  </NavLink>
                </>
              )}

              {isAdmin && (
                <>
                  <NavLink to="/admin" className={navItem}>
                    Admin
                  </NavLink>
                  <NavLink to="/admin/map" className={navItem}>
                    Admin Map
                  </NavLink>
                </>
              )}

              <button
                onClick={handleLogout}
                className="rounded-full bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
                type="button"
              >
                Logout
              </button>
            </>
          )}

          {!isAuthenticated && (
            <>
              <NavLink to="/login" className={navItem}>
                Login
              </NavLink>
              <NavLink to="/register" className={navItem}>
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
