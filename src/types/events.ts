export interface SchoolEvent {
  id: string
  title: string
  description?: string
  date: string
  startTime?: string
  endTime?: string
  location?: string
  category: 'academic' | 'athletic' | 'extracurricular' | 'administrative'
  source: 'district' | 'school' | 'athletics'
  url?: string
  synced?: boolean
  selected?: boolean
}

export interface GoogleCalendarEvent {
  summary: string
  description?: string
  start: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  end: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  location?: string
  source?: {
    title: string
    url?: string
  }
}

export interface SyncResult {
  success: boolean
  syncedCount: number
  errors: string[]
}