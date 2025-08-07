import { SchoolEvent } from '@/types/events'

// Helper function to generate unique IDs
function generateEventId(title: string, date: string, source: string): string {
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20)
  const cleanDate = date.replace(/[^0-9]/g, '')
  return `sohs-${source}-${cleanTitle}-${cleanDate}`
}

// Academic Calendar Events (from OCS 2025-2026 Calendar)
export const academicEvents = [
  { title: 'Dragon Days - Morning Session', date: '2025-07-29', startTime: '10:00 AM', endTime: '1:00 PM', category: 'academic' as const },
  { title: 'Dragon Days - Afternoon Session', date: '2025-07-29', startTime: '3:00 PM', endTime: '6:00 PM', category: 'academic' as const },
  { title: 'Dragon Days - Morning Session', date: '2025-07-30', startTime: '10:00 AM', endTime: '1:00 PM', category: 'academic' as const },
  { title: 'Dragon Days - Afternoon Session', date: '2025-07-30', startTime: '3:00 PM', endTime: '6:00 PM', category: 'academic' as const },
  { title: 'Freshmen Orientation', date: '2025-08-11', startTime: '8:00 AM', endTime: '12:00 PM', location: 'SOHS Main Building', category: 'academic' as const },
  { title: 'Freshmen Parent Lounge', date: '2025-08-11', startTime: '8:30 AM', endTime: '9:30 AM', location: 'SOHS Cafeteria', category: 'academic' as const },
  { title: 'Opening Day for Teachers', date: '2025-08-12', category: 'administrative' as const },
  { title: 'First Day of School', date: '2025-08-13', startTime: '7:30 AM', endTime: '2:30 PM', category: 'academic' as const },
  { title: 'Staff Workday - No School', date: '2025-08-29', category: 'administrative' as const },
  { title: 'Labor Day - No School', date: '2025-09-01', category: 'administrative' as const },
  { title: 'Fall Break', date: '2025-10-06', category: 'administrative' as const },
  { title: 'Fall Break', date: '2025-10-07', category: 'administrative' as const },
  { title: 'Election Day - No School', date: '2025-11-04', category: 'administrative' as const },
  { title: 'Veterans Day - No School', date: '2025-11-11', category: 'administrative' as const },
  { title: 'Thanksgiving Break', date: '2025-11-26', category: 'administrative' as const },
  { title: 'Thanksgiving Break', date: '2025-11-27', category: 'administrative' as const },
  { title: 'Thanksgiving Break', date: '2025-11-28', category: 'administrative' as const },
  { title: 'Winter Break Begins', date: '2025-12-23', category: 'administrative' as const },
  { title: 'Winter Break', date: '2025-12-24', category: 'administrative' as const },
  { title: 'Winter Break - Christmas', date: '2025-12-25', category: 'administrative' as const },
  { title: 'Winter Break', date: '2025-12-26', category: 'administrative' as const },
  { title: 'Winter Break', date: '2025-12-29', category: 'administrative' as const },
  { title: 'Winter Break', date: '2025-12-30', category: 'administrative' as const },
  { title: 'Winter Break - New Years Eve', date: '2025-12-31', category: 'administrative' as const },
  { title: 'Winter Break - New Years Day', date: '2026-01-01', category: 'administrative' as const },
  { title: 'Winter Break', date: '2026-01-02', category: 'administrative' as const },
  { title: 'Classes Resume', date: '2026-01-05', startTime: '7:30 AM', category: 'academic' as const },
  { title: 'Martin Luther King Jr. Day - No School', date: '2026-01-19', category: 'administrative' as const },
  { title: 'Presidents Day - No School', date: '2026-02-16', category: 'administrative' as const },
  { title: 'Spring Break', date: '2026-03-30', category: 'administrative' as const },
  { title: 'Spring Break', date: '2026-03-31', category: 'administrative' as const },
  { title: 'Spring Break', date: '2026-04-01', category: 'administrative' as const },
  { title: 'Spring Break', date: '2026-04-02', category: 'administrative' as const },
  { title: 'Spring Break', date: '2026-04-03', category: 'administrative' as const },
  { title: 'Oaks Day - No School', date: '2026-05-01', category: 'administrative' as const },
  { title: 'Last Day of School', date: '2026-05-21', startTime: '7:30 AM', endTime: '12:00 PM', category: 'academic' as const },
  { title: 'Graduation Ceremony', date: '2026-05-22', startTime: '7:00 PM', location: 'SOHS Gymnasium', category: 'academic' as const },
]

// Basketball Events (from Arbiter Live)
export const basketballEvents = [
  { title: 'Boys Varsity Basketball vs Eastern High School', date: '2025-12-01', startTime: '7:30 PM', location: 'SOHS Gym', category: 'athletic' as const },
  { title: 'Boys Varsity Basketball vs Bardstown High School', date: '2025-12-03', startTime: '7:30 PM', location: 'SOHS Gym', category: 'athletic' as const },
  { title: 'Boys Varsity Basketball vs Collins High School', date: '2025-12-09', startTime: '7:30 PM', location: 'SOHS Gym', category: 'athletic' as const },
  { title: 'Boys Varsity Basketball vs DeSales High School', date: '2026-01-03', startTime: '7:30 PM', location: 'SOHS Gym', category: 'athletic' as const },
  { title: 'Boys Varsity Basketball vs Frankfort High School', date: '2026-01-06', startTime: '7:30 PM', location: 'SOHS Gym', category: 'athletic' as const },
  { title: 'Boys Varsity Basketball vs Elizabethtown High School', date: '2026-01-13', startTime: '7:30 PM', location: 'SOHS Gym', category: 'athletic' as const },
  { title: 'Boys Varsity Basketball vs Oldham County High School', date: '2026-01-16', startTime: '8:00 PM', location: 'SOHS Gym', category: 'athletic' as const },
  { title: 'Boys Varsity Basketball @ Spencer County High School', date: '2026-01-20', startTime: '7:30 PM', location: 'Spencer County HS', category: 'athletic' as const },
  { title: 'Boys Varsity Basketball @ North Oldham High School', date: '2026-01-23', startTime: '7:30 PM', location: 'North Oldham HS', category: 'athletic' as const },
  { title: 'Boys Varsity Basketball vs Waggener High School', date: '2026-01-27', startTime: '7:30 PM', location: 'SOHS Gym', category: 'athletic' as const },
  { title: 'Boys Varsity Basketball @ Shelby County High School', date: '2026-01-30', startTime: '7:30 PM', location: 'Shelby County HS', category: 'athletic' as const },
  { title: 'Boys Varsity Basketball vs Anderson County High School', date: '2026-02-03', startTime: '7:30 PM', location: 'SOHS Gym', category: 'athletic' as const },
  { title: 'Boys Varsity Basketball @ Collins High School', date: '2026-02-06', startTime: '7:30 PM', location: 'Collins HS', category: 'athletic' as const },
  { title: 'Boys Varsity Basketball vs Spencer County High School', date: '2026-02-10', startTime: '7:30 PM', location: 'SOHS Gym', category: 'athletic' as const },
  { title: 'Boys Varsity Basketball vs North Oldham High School', date: '2026-02-13', startTime: '7:30 PM', location: 'SOHS Gym', category: 'athletic' as const },
  { title: 'Boys Varsity Basketball @ Oldham County High School', date: '2026-02-17', startTime: '8:00 PM', location: 'Oldham County HS', category: 'athletic' as const },
  { title: 'Boys Varsity Basketball vs Shelby County High School', date: '2026-02-20', startTime: '7:30 PM', location: 'SOHS Gym', category: 'athletic' as const },
]

// Football Events (Fall 2025)
export const footballEvents = [
  { title: 'Varsity Football vs North Oldham', date: '2025-08-22', startTime: '7:30 PM', location: 'SOHS Football Stadium', category: 'athletic' as const },
  { title: 'Varsity Football @ Oldham County', date: '2025-08-29', startTime: '7:30 PM', location: 'Oldham County HS', category: 'athletic' as const },
  { title: 'Varsity Football vs Spencer County', date: '2025-09-05', startTime: '7:30 PM', location: 'SOHS Football Stadium', category: 'athletic' as const },
  { title: 'Varsity Football @ Shelby County', date: '2025-09-12', startTime: '7:30 PM', location: 'Shelby County HS', category: 'athletic' as const },
  { title: 'Varsity Football vs Anderson County', date: '2025-09-19', startTime: '7:30 PM', location: 'SOHS Football Stadium', category: 'athletic' as const },
  { title: 'Homecoming Game vs Collins', date: '2025-09-26', startTime: '7:30 PM', location: 'SOHS Football Stadium', category: 'athletic' as const },
  { title: 'Varsity Football @ Western Hills', date: '2025-10-03', startTime: '7:30 PM', location: 'Western Hills HS', category: 'athletic' as const },
  { title: 'Varsity Football vs Franklin County', date: '2025-10-10', startTime: '7:30 PM', location: 'SOHS Football Stadium', category: 'athletic' as const },
  { title: 'Varsity Football @ Grant County', date: '2025-10-17', startTime: '7:30 PM', location: 'Grant County HS', category: 'athletic' as const },
  { title: 'Senior Night vs Woodford County', date: '2025-10-24', startTime: '7:30 PM', location: 'SOHS Football Stadium', category: 'athletic' as const },
  { title: 'Varsity Football Playoffs Round 1', date: '2025-10-31', startTime: '7:30 PM', location: 'TBD', category: 'athletic' as const },
]

// Baseball Events (Spring 2026)
export const baseballEvents = [
  { title: 'Baseball Tryouts Begin', date: '2026-02-15', startTime: '3:30 PM', endTime: '5:30 PM', location: 'SOHS Baseball Field', category: 'athletic' as const },
  { title: 'Baseball Tryouts Day 2', date: '2026-02-16', startTime: '3:30 PM', endTime: '5:30 PM', location: 'SOHS Baseball Field', category: 'athletic' as const },
  { title: 'Baseball Tryouts Final', date: '2026-02-17', startTime: '3:30 PM', endTime: '5:30 PM', location: 'SOHS Baseball Field', category: 'athletic' as const },
  { title: 'Baseball Season Opener vs Trinity', date: '2026-03-09', startTime: '5:00 PM', location: 'SOHS Baseball Field', category: 'athletic' as const },
  { title: 'Baseball vs St. Xavier', date: '2026-03-12', startTime: '5:00 PM', location: 'SOHS Baseball Field', category: 'athletic' as const },
  { title: 'Baseball @ Male High School', date: '2026-03-16', startTime: '5:00 PM', location: 'Male HS', category: 'athletic' as const },
  { title: 'Baseball vs PRP', date: '2026-03-19', startTime: '5:00 PM', location: 'SOHS Baseball Field', category: 'athletic' as const },
  { title: 'Baseball @ Ballard', date: '2026-03-23', startTime: '5:00 PM', location: 'Ballard HS', category: 'athletic' as const },
  { title: 'Baseball vs North Oldham', date: '2026-03-26', startTime: '5:00 PM', location: 'SOHS Baseball Field', category: 'athletic' as const },
  { title: 'Baseball @ Oldham County', date: '2026-03-30', startTime: '5:00 PM', location: 'Oldham County HS', category: 'athletic' as const },
  { title: 'Baseball vs Eastern', date: '2026-04-06', startTime: '5:00 PM', location: 'SOHS Baseball Field', category: 'athletic' as const },
  { title: 'Baseball @ Seneca', date: '2026-04-09', startTime: '5:00 PM', location: 'Seneca HS', category: 'athletic' as const },
  { title: 'Baseball vs Fern Creek', date: '2026-04-13', startTime: '5:00 PM', location: 'SOHS Baseball Field', category: 'athletic' as const },
  { title: 'Baseball @ Jeffersontown', date: '2026-04-16', startTime: '5:00 PM', location: 'Jeffersontown HS', category: 'athletic' as const },
  { title: 'Baseball vs Waggener', date: '2026-04-20', startTime: '5:00 PM', location: 'SOHS Baseball Field', category: 'athletic' as const },
  { title: 'Baseball Senior Night vs Moore', date: '2026-04-27', startTime: '5:00 PM', location: 'SOHS Baseball Field', category: 'athletic' as const },
  { title: 'Baseball District Tournament', date: '2026-05-11', startTime: 'TBD', location: 'TBD', category: 'athletic' as const },
]

// Process and format all events
export function getAllEvents(): SchoolEvent[] {
  const allEvents = [
    ...academicEvents,
    ...basketballEvents,
    ...footballEvents,
    ...baseballEvents,
  ]

  return allEvents.map(event => ({
    id: generateEventId(event.title, event.date, event.category),
    title: event.title,
    description: `${event.title} - Official South Oldham High School Event`,
    date: event.date,
    startTime: event.startTime,
    endTime: event.endTime,
    location: event.location || 'South Oldham High School',
    category: event.category,
    source: event.category === 'athletic' ? 'athletics' : 
            event.category === 'administrative' ? 'district' : 'school',
    synced: false,
    selected: false
  }))
}