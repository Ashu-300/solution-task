import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminNavbar from './components/AdminNavbar'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import MapOpsPage from './pages/MapOpsPage'
import RegisterPage from './pages/RegisterPage'
import AddBinPage from './pages/AddBinPage'

function HomeRedirect() {
  const { isAuthenticated, isAdmin } = useAuth()
  if (!isAuthenticated || !isAdmin) return <Navigate to="/login" replace />
  return <Navigate to="/dashboard" replace />
}

function Layout() {
  const { isAuthenticated, isAdmin } = useAuth()
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#155e75_0%,#0f172a_45%,#020617_100%)] text-white">
      {isAuthenticated && isAdmin && <AdminNavbar />}
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <MapOpsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bins/new"
            element={
              <ProtectedRoute>
                <AddBinPage />
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
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  )
}
