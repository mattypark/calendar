import { useState, useEffect } from 'react'

interface GoogleUser {
  id: string
  email: string
  name: string
  picture?: string
}

interface UseGoogleAuthReturn {
  isAuthenticated: boolean
  user: GoogleUser | null
  loading: boolean
  checkAuthStatus: () => Promise<void>
}

export function useGoogleAuth(): UseGoogleAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<GoogleUser | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status')
      const data = await response.json()
      
      setIsAuthenticated(data.authenticated)
      setUser(data.user)
    } catch (error) {
      console.error('Failed to check auth status:', error)
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuthStatus()
    
    // Check for connection status in URL params (after OAuth callback)
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('connected') === 'true') {
      // Remove the parameter from URL
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
      // Recheck auth status
      setTimeout(checkAuthStatus, 1000)
    }
  }, [])

  return {
    isAuthenticated,
    user,
    loading,
    checkAuthStatus
  }
}