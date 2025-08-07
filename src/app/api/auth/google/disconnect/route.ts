import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    
    // Clear all Google-related cookies
    const response = NextResponse.json({ success: true })
    
    response.cookies.delete('google_access_token')
    response.cookies.delete('google_refresh_token')
    response.cookies.delete('google_user_info')
    
    return response
  } catch (error) {
    console.error('Disconnect error:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect Google account' },
      { status: 500 }
    )
  }
}