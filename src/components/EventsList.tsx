'use client'

import { useState } from 'react'
import { Calendar, MapPin, Clock, ExternalLink, Check, Filter } from 'lucide-react'
import { SchoolEvent } from '@/types/events'
import { format, parseISO } from 'date-fns'

interface EventsListProps {
  events: SchoolEvent[]
  onEventsChange: (events: SchoolEvent[]) => void
}

export default function EventsList({ events, onEventsChange }: EventsListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showSyncedOnly, setShowSyncedOnly] = useState(false)

  const categories = [
    { value: 'all', label: 'All Events', color: 'bg-gray-100' },
    { value: 'academic', label: 'Academic', color: 'bg-blue-100' },
    { value: 'athletic', label: 'Athletics', color: 'bg-green-100' },
    { value: 'extracurricular', label: 'Extracurricular', color: 'bg-purple-100' },
    { value: 'administrative', label: 'Administrative', color: 'bg-orange-100' }
  ]

  const filteredEvents = events.filter(event => {
    const categoryMatch = selectedCategory === 'all' || event.category === selectedCategory
    const syncMatch = !showSyncedOnly || event.synced
    return categoryMatch && syncMatch
  })

  const toggleEventSelection = (eventId: string) => {
    const updatedEvents = events.map(event =>
      event.id === eventId
        ? { ...event, selected: !event.selected }
        : event
    )
    onEventsChange(updatedEvents)
  }

  const toggleSelectAll = () => {
    const allSelected = filteredEvents.every(event => event.selected)
    const updatedEvents = events.map(event => {
      if (filteredEvents.find(e => e.id === event.id)) {
        return { ...event, selected: !allSelected }
      }
      return event
    })
    onEventsChange(updatedEvents)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic': return 'border-blue-500 bg-blue-50'
      case 'athletic': return 'border-green-500 bg-green-50'
      case 'extracurricular': return 'border-purple-500 bg-purple-50'
      case 'administrative': return 'border-orange-500 bg-orange-50'
      default: return 'border-gray-500 bg-gray-50'
    }
  }

  const formatEventDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy')
    } catch {
      return dateString
    }
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Events Found</h3>
        <p className="text-gray-500">
          We couldn't find any events from South Oldham High School at the moment.
          Try refreshing the events or check back later.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-600">Filter by:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showSyncedOnly}
              onChange={(e) => setShowSyncedOnly(e.target.checked)}
              className="rounded border-gray-300 focus:ring-blue-500"
            />
            Show synced only
          </label>

          <button
            onClick={toggleSelectAll}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            {filteredEvents.every(event => event.selected) ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>

      {/* Events Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredEvents.length} of {events.length} events
        {filteredEvents.filter(e => e.selected).length > 0 && (
          <span className="ml-2 text-blue-600 font-medium">
            ({filteredEvents.filter(e => e.selected).length} selected)
          </span>
        )}
      </div>

      {/* Events Grid */}
      <div className="grid gap-4">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className={`relative p-4 border-l-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer ${getCategoryColor(event.category)} ${
              event.selected ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => toggleEventSelection(event.id)}
          >
            {/* Selection Indicator */}
            <div className="absolute top-3 right-3">
              {event.synced ? (
                <div className="flex items-center gap-1 text-green-600 text-xs">
                  <Check className="h-4 w-4" />
                  <span>Synced</span>
                </div>
              ) : (
                <input
                  type="checkbox"
                  checked={event.selected || false}
                  onChange={(e) => {
                    e.stopPropagation()
                    toggleEventSelection(event.id)
                  }}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              )}
            </div>

            {/* Event Content */}
            <div className="pr-12">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-lg">{event.title}</h3>
                <span className="text-xs px-2 py-1 bg-white rounded-full border capitalize">
                  {event.category}
                </span>
              </div>

              {event.description && (
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">{event.description}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatEventDate(event.date)}</span>
                </div>

                {(event.startTime || event.endTime) && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {event.startTime && event.endTime 
                        ? `${event.startTime} - ${event.endTime}`
                        : event.startTime || event.endTime
                      }
                    </span>
                  </div>
                )}

                {event.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                )}

                {event.url && (
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View Details</span>
                  </a>
                )}
              </div>

              <div className="mt-2 text-xs text-gray-500">
                Source: {event.source === 'district' ? 'District Calendar' : 
                         event.source === 'athletics' ? 'Athletics' : 'School Website'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && events.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No events match your current filters.</p>
        </div>
      )}
    </div>
  )
}