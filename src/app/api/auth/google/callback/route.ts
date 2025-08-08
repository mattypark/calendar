import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { cookies } from 'next/headers'
import type { Credentials } from 'google-auth-library'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/google/callback`
)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    console.error('Google OAuth error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=auth_failed`)
  }

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=no_code`)
  }

  try {
    // Exchange the authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    
    if (!tokens.access_token) {
      throw new Error('No access token received')
    }

    // Set the credentials
    oauth2Client.setCredentials(tokens)

    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const userInfo = await oauth2.userinfo.get()

    // Store tokens in httpOnly cookies (in production, use a proper session store)
    const cookieStore = await cookies()
    
    // Calculate expiry time from expiry_date
    const secondsUntilExpiry = typeof tokens.expiry_date === 'number'
      ? Math.max(0, Math.floor((tokens.expiry_date - Date.now()) / 1000))
      : 3600 // fallback to 1h if Google didn't send expiry
    
    // Set cookies with tokens (encrypted in production)
    const response = NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?connected=true`)
    
    response.cookies.set('google_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: secondsUntilExpiry
    })

    if (tokens.refresh_token) {
      response.cookies.set('google_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      })
    }

    response.cookies.set('google_user_info', JSON.stringify({
      id: userInfo.data.id,
      email: userInfo.data.email,
      name: userInfo.data.name,
      picture: userInfo.data.picture
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    })

    return response
  } catch (error) {
    console.error('Token exchange error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=token_exchange_failed`)
  }
}