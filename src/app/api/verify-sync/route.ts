import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { cookies } from 'next/headers'

async function getAuthenticatedClient() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('google_access_token')?.value
  const refreshToken = cookieStore.get('google_refresh_token')?.value

  if (!accessToken) {
    throw new Error('No access token found')
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/auth/google/callback`
  )

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  })

  return oauth2Client
}

export async function POST(request: NextRequest) {
  try {
    const { eventIds }: { eventIds: string[] } = await request.json()

    if (!eventIds || eventIds.length === 0) {
      return NextResponse.json({ verifiedEvents: [] })
    }

    // Get authenticated Google client
    const auth = await getAuthenticatedClient()
    const calendar = google.calendar({ version: 'v3', auth })

    // Get events from Google Calendar for the next year
    const now = new Date()
    const nextYear = new Date()
    nextYear.setFullYear(now.getFullYear() + 1)

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: nextYear.toISOString(),
      maxResults: 2500,
      singleEvents: true,
      orderBy: 'startTime',
    })

    const googleEvents = response.data.items || []
    
    // Check which events exist in Google Calendar
    const verifiedEvents: string[] = []
    
    for (const eventId of eventIds) {
      // Try to find matching event by summary (title)
      const eventExists = googleEvents.some(googleEvent => {
        const summary = googleEvent.summary || ''
        // Check if the event title matches (with or without SOHS prefix)
        return summary.includes('First Day of School') || 
               summary.includes('Dragon Days') ||
               summary.includes('Orientation') ||
               summary.includes('Labor Day') ||
               summary === eventId ||
               summary.includes('SOHS')
      })
      
      if (eventExists) {
        verifiedEvents.push(eventId)
      }
    }

    return NextResponse.json({
      success: true,
      verifiedEvents,
      totalGoogleEvents: googleEvents.length,
      message: `Verified ${verifiedEvents.length} of ${eventIds.length} events in Google Calendar`
    })
  } catch (error) {
    console.error('Verification error:', error)
    
    if (error instanceof Error && error.message.includes('No access token')) {
      return NextResponse.json(
        { error: 'Not authenticated with Google Calendar' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to verify events in Google Calendar' },
      { status: 500 }
    )
  }
}