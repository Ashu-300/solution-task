import { createContext, useEffect, useMemo, useState } from 'react'
import { parseJwt } from '../utils/jwt'
import { clearToken, getToken, setToken } from '../utils/storage'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken())

  useEffect(() => {
    if (token) setToken(token)
    else clearToken()
  }, [token])

  const user = useMemo(() => parseJwt(token), [token])
  const role = user?.role || ''
  const isAuthenticated = Boolean(token)
  const isAdmin = role === 'admin'

  const loginWithToken = (nextToken) => setTokenState(nextToken)
  const logout = () => setTokenState(null)

  return (
    <AuthContext.Provider value={{ token, user, role, isAuthenticated, isAdmin, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
