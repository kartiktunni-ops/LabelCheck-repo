import { createContext, useContext, useEffect, useState } from 'react'

// Use the same host the page was loaded from (localhost on this PC, or its
// LAN IP when opened from a phone) so the API call reaches the right machine.
export const API_BASE = `http://${window.location.hostname}:5000`

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE}/api/me`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setUsername(data.logged_in ? data.username : null))
      .catch(() => setUsername(null))
      .finally(() => setChecked(true))
  }, [])

  async function login(user, password) {
    const response = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username: user, password }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Login failed')
    setUsername(data.username)
  }

  async function logout() {
    await fetch(`${API_BASE}/api/logout`, { method: 'POST', credentials: 'include' })
    setUsername(null)
  }

  return (
    <AuthContext.Provider value={{ username, isLoggedIn: !!username, checked, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
