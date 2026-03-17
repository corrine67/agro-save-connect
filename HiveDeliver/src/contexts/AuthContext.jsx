import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  getCurrentUser as loadCurrentUser,
  getDefaultRouteForRole,
  login as authLogin,
  logout as authLogout,
  register as authRegister,
} from '../services/authService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadCurrentUser())

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === 'hiveDeliver_currentUser') {
        setUser(loadCurrentUser())
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const login = async (credentials) => {
    const loggedIn = authLogin(credentials)
    setUser(loggedIn)
    return loggedIn
  }

  const register = async (info) => {
    const registered = authRegister(info)
    return registered
  }

  const logout = () => {
    authLogout()
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      register,
      defaultRoute: user ? getDefaultRouteForRole(user.role) : '/',
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
