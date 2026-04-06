import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminMapPage from './pages/AdminMapPage'
import LoginPage from './pages/LoginPage'
import MapPage from './pages/MapPage'
import RegisterPage from './pages/RegisterPage'
import ReportComplaintPage from './pages/ReportComplaintPage'
import UserDashboardPage from './pages/UserDashboardPage'

function HomeRedirect() {
  const { isAuthenticated, isAdmin } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />
}

function AppShell() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_20%,#1f4e5f_0%,#102542_42%,#0b1626_100%)] text-white">
      <div className="pointer-events-none fixed inset-0 -z-0 opacity-30 [background-image:linear-gradient(to_right,rgba(242,95,92,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(247,244,234,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />
      <Navbar />
      <main className="relative z-10 mx-auto max-w-6xl px-4 py-6 md:px-6">
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <ReportComplaintPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <MapPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/map"
            element={
              <ProtectedRoute adminOnly>
                <AdminMapPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  )
}
