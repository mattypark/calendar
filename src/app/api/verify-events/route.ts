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
    refresh_token: refreshToken,
  })

  return oauth2Client
}

export async function POST(request: NextRequest) {
  try {
    const { events } = await request.json()
    
    if (!events || !Array.isArray(events)) {
      return NextResponse.json(
        { error: 'Invalid events data' },
        { status: 400 }
      )
    }

    // Get authenticated Google client
    const auth = await getAuthenticatedClient()
    const calendar = google.calendar({ version: 'v3', auth })

    // Get events from Google Calendar for the date range
    const now = new Date()
    const oneYearFromNow = new Date()
    oneYearFromNow.setFullYear(now.getFullYear() + 1)

    const calendarResponse = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: oneYearFromNow.toISOString(),
      maxResults: 2500,
      singleEvents: true,
      orderBy: 'startTime',
    })

    const googleEvents = calendarResponse.data.items || []
    
    // Check each event against Google Calendar
    const verifiedEvents = events.map(schoolEvent => {
      // Look for matching events in Google Calendar
      const matchingGoogleEvent = googleEvents.find(googleEvent => {
        // Check if titles match (with or without SOHS prefix)
        const titleMatch = googleEvent.summary === schoolEvent.title || 
                           googleEvent.summary === `[SOHS] ${schoolEvent.title}` ||
                           googleEvent.summary?.includes(schoolEvent.title)

        // Check if dates match
        let dateMatch = false
        if (googleEvent.start?.date === schoolEvent.date) {
          dateMatch = true // All-day event match
        } else if (googleEvent.start?.dateTime) {
          const googleDate = googleEvent.start.dateTime.split('T')[0]
          dateMatch = googleDate === schoolEvent.date
        }

        return titleMatch && dateMatch
      })

      return {
        ...schoolEvent,
        synced: !!matchingGoogleEvent,
        googleEventId: matchingGoogleEvent?.id || null
      }
    })

    return NextResponse.json({
      success: true,
      events: verifiedEvents,
      totalGoogleEvents: googleEvents.length,
      message: `Verified ${verifiedEvents.length} events against Google Calendar`
    })
  } catch (error) {
    console.error('Event verification error:', error)
    
    if (error instanceof Error && error.message.includes('No access token')) {
      return NextResponse.json(
        { error: 'Not authenticated with Google Calendar' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to verify events against Google Calendar' },
      { status: 500 }
    )
  }
}