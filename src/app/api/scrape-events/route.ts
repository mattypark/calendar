import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import { SchoolEvent } from '@/types/events'
import { getAllEvents } from '@/data/sohs-events'
import { 
  trackEvents, 
  apExamEvents, 
  extracurricularEvents, 
  specialEvents, 
  otherSportsEvents 
} from '@/data/sohs-events-extended'

// Helper function to generate unique IDs
function generateEventId(title: string, date: string, source: string): string {
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20)
  const cleanDate = date.replace(/[^0-9]/g, '')
  return `sohs-${source}-${cleanTitle}-${cleanDate}`
}

// Get comprehensive event data from all sources
async function getAllSchoolEvents(): Promise<SchoolEvent[]> {
  // Get base events from the main data file
  const baseEvents = getAllEvents()
  
  // Add extended events
  const extendedEvents = [
    ...trackEvents,
    ...apExamEvents,
    ...extracurricularEvents,
    ...specialEvents,
    ...otherSportsEvents
  ].map(event => ({
    id: generateEventId(event.title, event.date, event.category),
    title: event.title,
    description: `${event.title} - Official South Oldham High School Event`,
    date: event.date,
    startTime: event.startTime,
    endTime: 'endTime' in event ? event.endTime : undefined,
    location: event.location || 'South Oldham High School',
    category: event.category,
    source: (event.category === 'athletic' ? 'athletics' : 
            event.category === 'administrative' ? 'district' : 'school') as 'district' | 'school' | 'athletics',
    synced: false,
    selected: false
  }))
  
  // Combine all events
  const allEvents = [...baseEvents, ...extendedEvents]
  
  // Remove duplicates based on title and date
  const uniqueEvents = allEvents.filter((event, index, self) =>
    index === self.findIndex((e) => e.title === event.title && e.date === event.date)
  )
  
  return uniqueEvents
}



export async function GET() {
  try {
    // Get all comprehensive school events
    const allEvents = await getAllSchoolEvents()

    // Sort by date
    allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return NextResponse.json({
      success: true,
      events: allEvents,
      count: allEvents.length,
      sources: {
        district: allEvents.filter(e => e.source === 'district').length,
        school: allEvents.filter(e => e.source === 'school').length,
        athletics: allEvents.filter(e => e.source === 'athletics').length
      },
      message: `Successfully loaded ${allEvents.length} South Oldham High School events from comprehensive database`
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    
    // Still return comprehensive events even if there's an error
    const fallbackEvents = await getAllSchoolEvents()
    
    return NextResponse.json({
      success: true,
      events: fallbackEvents,
      count: fallbackEvents.length,
      warning: 'Using comprehensive event database',
      sources: {
        district: fallbackEvents.filter(e => e.source === 'district').length,
        school: fallbackEvents.filter(e => e.source === 'school').length,
        athletics: fallbackEvents.filter(e => e.source === 'athletics').length
      }
    })
  }
}