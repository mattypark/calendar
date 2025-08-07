'use client'

import { useState } from 'react'
import { LogIn, LogOut, Calendar } from 'lucide-react'
import { useGoogleAuth } from '@/hooks/useGoogleAuth'

interface GoogleAuthButtonProps {
  onConnect: (connected: boolean) => void
  isConnected: boolean
}

export default function GoogleAuthButton({ onConnect, isConnected }: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false)
  const { checkAuthStatus, user } = useGoogleAuth()

  const handleAuth = async () => {
    setLoading(true)
    try {
      if (isConnected) {
        // Disconnect from Google
        const response = await fetch('/api/auth/google/disconnect', {
          method: 'POST'
        })
        if (response.ok) {
          // Clear sync data when disconnecting
          localStorage.removeItem('sohs-synced-events')
          localStorage.removeItem('sohs-last-sync')
          await checkAuthStatus()
          onConnect(false)
        }
      } else {
        // Connect to Google
        window.location.href = '/api/auth/google'
      }
    } catch (error) {
      console.error('Auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (isConnected) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <Calendar className="h-5 w-5 text-green-600" />
          <div className="flex flex-col">
            <span className="text-green-800 font-medium">Google Calendar Connected</span>
            {user && (
              <span className="text-green-600 text-sm">{user.email}</span>
            )}
          </div>
        </div>
        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {loading ? 'Disconnecting...' : 'Disconnect Google Calendar'}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleAuth}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 transition-colors shadow-sm"
    >
      <div className="flex items-center gap-2">
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <LogIn className="h-4 w-4" />
      </div>
      {loading ? 'Connecting...' : 'Connect Google Calendar'}
    </button>
  )
}