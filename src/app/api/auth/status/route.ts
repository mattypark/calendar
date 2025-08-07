import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('google_access_token')?.value
    const userInfo = cookieStore.get('google_user_info')?.value

    if (!accessToken) {
      return NextResponse.json({
        authenticated: false,
        user: null
      })
    }

    const user = userInfo ? JSON.parse(userInfo) : null

    return NextResponse.json({
      authenticated: true,
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture
      } : null
    })
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json({
      authenticated: false,
      user: null
    })
  }
}