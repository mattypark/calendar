import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { cookies } from 'next/headers'
import { SchoolEvent, GoogleCalendarEvent } from '@/types/events'

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
    `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/google/callback`
  )

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  })

  return oauth2Client
}

function convertSchoolEventToGoogleEvent(schoolEvent: SchoolEvent): GoogleCalendarEvent {
  const isAllDay = !schoolEvent.startTime || !schoolEvent.endTime || 
                   schoolEvent.startTime === 'All Day' || schoolEvent.endTime === 'All Day'

  let startDateTime: string
  let endDateTime: string

  if (isAllDay) {
    // For all-day events, use date format
    startDateTime = schoolEvent.date
    endDateTime = schoolEvent.date
  } else {
    // For timed events, convert to proper datetime format
    const startTime24 = convertTo24Hour(schoolEvent.startTime)
    const endTime24 = convertTo24Hour(schoolEvent.endTime || schoolEvent.startTime)
    
    startDateTime = `${schoolEvent.date}T${startTime24}:00`
    endDateTime = `${schoolEvent.date}T${endTime24}:00`
    
    // If end time is same as start time, add 1 hour
    if (schoolEvent.endTime === schoolEvent.startTime || !schoolEvent.endTime) {
      const [hours, minutes] = startTime24.split(':').map(Number)
      const endHour = (hours + 1) % 24
      endDateTime = `${schoolEvent.date}T${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`
    }
  }

  console.log(`Creating event: ${schoolEvent.title}`)
  console.log(`Date: ${schoolEvent.date}`)
  console.log(`Start Time: ${schoolEvent.startTime} -> ${startDateTime}`)
  console.log(`End Time: ${schoolEvent.endTime} -> ${endDateTime}`)
  console.log(`Is All Day: ${isAllDay}`)

  return {
    summary: schoolEvent.title, // Remove [SOHS] prefix to match your preference
    description: [
      schoolEvent.description,
      `\nCategory: ${schoolEvent.category.charAt(0).toUpperCase() + schoolEvent.category.slice(1)}`,
      `Source: ${schoolEvent.source === 'district' ? 'District Calendar' : 
                 schoolEvent.source === 'athletics' ? 'Athletics' : 'School Website'}`,
      `\nSynced from SOHS Calendar Sync application`
    ].filter(Boolean).join('\n'),
    start: isAllDay 
      ? { date: schoolEvent.date, timeZone: 'America/New_York' }
      : { dateTime: startDateTime, timeZone: 'America/New_York' },
    end: isAllDay 
      ? { date: schoolEvent.date, timeZone: 'America/New_York' }
      : { dateTime: endDateTime, timeZone: 'America/New_York' },
    location: schoolEvent.location || 'South Oldham High School'
  }
}

function convertTo24Hour(timeStr: string): string {
  if (!timeStr || timeStr === 'All Day' || timeStr === 'TBD') {
    return '09:00' // Default to 9 AM for all-day events
  }

  try {
    // Handle different time formats
    const cleanTime = timeStr.trim()
    
    // If already in 24-hour format (HH:MM)
    if (/^\d{1,2}:\d{2}$/.test(cleanTime)) {
      const [hours, minutes] = cleanTime.split(':')
      return `${hours.padStart(2, '0')}:${minutes}`
    }
    
    // Handle AM/PM format
    const [time, period] = cleanTime.split(' ')
    if (!time || !period) {
      return '09:00' // Default fallback
    }
    
    const [hours, minutes = '00'] = time.split(':')
    let hour24 = parseInt(hours)
    
    if (period.toUpperCase() === 'PM' && hour24 !== 12) {
      hour24 += 12
    } else if (period.toUpperCase() === 'AM' && hour24 === 12) {
      hour24 = 0
    }
    
    return `${hour24.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`
  } catch (error) {
    console.warn(`Time conversion error for "${timeStr}":`, error)
    return '09:00' // Default fallback
  }
}

export async function POST(request: NextRequest) {
  try {
    const { events }: { events: SchoolEvent[] } = await request.json()

    if (!events || events.length === 0) {
      return NextResponse.json(
        { error: 'No events provided' },
        { status: 400 }
      )
    }

    // Get authenticated Google client
    const auth = await getAuthenticatedClient()
    const calendar = google.calendar({ version: 'v3', auth })

    const results = []
    const errors = []

    // Create events in Google Calendar
    for (const schoolEvent of events) {
      try {
        const googleEvent = convertSchoolEventToGoogleEvent(schoolEvent)
        
        const response = await calendar.events.insert({
          calendarId: 'primary',
          requestBody: googleEvent
        })

        results.push({
          schoolEventId: schoolEvent.id,
          googleEventId: response.data.id,
          title: schoolEvent.title,
          success: true
        })
      } catch (error) {
        console.error(`Failed to create event ${schoolEvent.title}:`, error)
        errors.push({
          schoolEventId: schoolEvent.id,
          title: schoolEvent.title,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      syncedCount: results.length,
      totalCount: events.length,
      results,
      errors
    })
  } catch (error) {
    console.error('Calendar sync error:', error)
    
    if (error instanceof Error && error.message.includes('No access token')) {
      return NextResponse.json(
        { error: 'Not authenticated with Google Calendar' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to sync events to Google Calendar' },
      { status: 500 }
    )
  }
}