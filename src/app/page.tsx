'use client'

import { useState, useEffect } from 'react'
import { Calendar, RefreshCw, Link, CheckCircle, Clock, MapPin, Users } from 'lucide-react'
import GoogleAuthButton from '@/components/GoogleAuthButton'
import EventsList from '@/components/EventsList'
import SyncButton from '@/components/SyncButton'
import { SchoolEvent } from '@/types/events'
import { useGoogleAuth } from '@/hooks/useGoogleAuth'

export default function Home() {
  const { isAuthenticated: isGoogleConnected, user, loading: authLoading } = useGoogleAuth()
  const [events, setEvents] = useState<SchoolEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load events from SOHS on component mount
  useEffect(() => {
    if (mounted) {
      loadSchoolEvents()
    }
  }, [mounted])

  // Re-verify events when authentication status changes
  useEffect(() => {
    if (mounted && events.length > 0) {
      loadSchoolEvents() // This will trigger verification if authenticated
    }
  }, [isGoogleConnected, mounted])

  const loadSchoolEvents = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/scrape-events')
      const data = await response.json()
      let loadedEvents = data.events || []
      
      // Restore last sync time from localStorage
      if (mounted) {
        const lastSyncStr = localStorage.getItem('sohs-last-sync')
        if (lastSyncStr) {
          setLastSync(new Date(lastSyncStr))
        }
        
        // If user is authenticated, verify events against Google Calendar
        if (isGoogleConnected) {
          try {
            const syncedEventIds = JSON.parse(localStorage.getItem('sohs-synced-events') || '[]')
            
            if (syncedEventIds.length > 0) {
              const verifyResponse = await fetch('/api/verify-sync', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ eventIds: syncedEventIds }),
              })
            
              if (verifyResponse.ok) {
                const verifyData = await verifyResponse.json()
                const actuallyVerified = verifyData.verifiedEvents || []
                
                // Update localStorage with only verified events
                localStorage.setItem('sohs-synced-events', JSON.stringify(actuallyVerified))
                
                // Update loaded events to reflect actual sync status
                loadedEvents = loadedEvents.map((event: SchoolEvent) => ({
                  ...event,
                  synced: actuallyVerified.includes(event.id)
                }))
                
                console.log(`Verified ${actuallyVerified.length} of ${syncedEventIds.length} events in Google Calendar`)
              }
            } else {
              // If no synced events, just mark all as not synced
              loadedEvents = loadedEvents.map((event: SchoolEvent) => ({
                ...event,
                synced: false
              }))
            }
          } catch (verifyError) {
            console.warn('Could not verify events against Google Calendar:', verifyError)
          }
        }
      }
      
      setEvents(loadedEvents)
    } catch (error) {
      console.error('Failed to load school events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleConnect = (connected: boolean) => {
    // This will be handled by the useGoogleAuth hook
    // The component will automatically update when auth status changes
  }

  const handleSync = async (selectedEvents: SchoolEvent[]) => {
    if (!isGoogleConnected) return
    
    setLoading(true)
    try {
      console.log('Syncing events:', selectedEvents.map(e => e.title))
      
      const response = await fetch('/api/sync-calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: selectedEvents }),
      })
      
      const data = await response.json()
      console.log('Sync response:', data)
      
      if (response.ok && data.success) {
        const syncTime = new Date()
        setLastSync(syncTime)
        localStorage.setItem('sohs-last-sync', syncTime.toISOString())
        
        console.log(`Successfully synced ${data.syncedCount} of ${data.totalCount} events`)
        
        if (data.errors && data.errors.length > 0) {
          console.warn('Some events failed to sync:', data.errors)
        }
        
        // Re-verify all events against Google Calendar after sync
        try {
          const verifyResponse = await fetch('/api/verify-events', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ events: events }),
          })
          
          if (verifyResponse.ok) {
            const verifyData = await verifyResponse.json()
            setEvents(verifyData.events || events)
            console.log(`Post-sync verification: ${verifyData.events.filter((e: SchoolEvent) => e.synced).length} events confirmed in Google Calendar`)
          }
        } catch (verifyError) {
          console.warn('Could not verify events after sync:', verifyError)
          // Fallback: just reload events
          loadSchoolEvents()
        }
      } else {
        console.error('Sync failed:', data.error)
        alert(`Sync failed: ${data.error || 'Unknown error'}`)
      }
    } catch (error: unknown) {
      console.error('Sync failed:', error)
      alert(`Sync failed: ${error instanceof Error ? error.message : 'Network error'}`)
    } finally {
      setLoading(false)
    }
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="school-gradient text-white rounded-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Calendar className="h-10 w-10" />
            SOHS Calendar Sync
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Sync all South Oldham High School events to your Google Calendar. 
            Never miss important school activities, sports events, or deadlines.
          </p>
        </div>
      </div>

      {/* Connection Status & Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Google Connection Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Link className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Google Calendar Connection</h2>
          </div>
          
          {isGoogleConnected ? (
            <div className="flex items-center gap-2 text-green-600 mb-4">
              <CheckCircle className="h-5 w-5" />
              <span>Connected to Google Calendar</span>
            </div>
          ) : (
            <div className="text-gray-600 mb-4">
              Connect your Google account to sync events
            </div>
          )}
          
          <GoogleAuthButton 
            onConnect={handleGoogleConnect}
            isConnected={isGoogleConnected}
          />
        </div>

        {/* Sync Status Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCw className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Sync Status</h2>
          </div>
          
          {lastSync ? (
            <div className="flex items-center gap-2 text-green-600 mb-4">
              <Clock className="h-5 w-5" />
              <span>Last synced: {lastSync.toLocaleString()}</span>
            </div>
          ) : (
            <div className="text-gray-600 mb-4">
              No events synced yet
            </div>
          )}
          
          <SyncButton 
            onSync={handleSync}
            disabled={!isGoogleConnected || loading}
            events={events}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg p-6 text-center shadow-md">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {events.length}
          </div>
          <div className="text-gray-600">Total Events</div>
        </div>
        <div className="bg-white rounded-lg p-6 text-center shadow-md">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {events.filter(e => e.synced).length}
          </div>
          <div className="text-gray-600">Synced Events</div>
        </div>
        <div className="bg-white rounded-lg p-6 text-center shadow-md">
          <div className="text-2xl font-bold text-orange-600 mb-2">
            {events.filter(e => !e.synced).length}
          </div>
          <div className="text-gray-600">Pending Sync</div>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold">South Oldham High School Events</h2>
          </div>
          <button
            onClick={loadSchoolEvents}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Events
          </button>
        </div>

        {loading && events.length === 0 ? (
          <div className="text-center py-12">
            <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading school events...</p>
          </div>
        ) : (
          <EventsList 
            events={events}
            onEventsChange={setEvents}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="text-center mt-12 text-gray-600">
        <p className="mb-2">
          Built for South Oldham High School students, parents, and staff
        </p>
        <p className="text-sm">
          Events are automatically fetched from official school sources
        </p>
      </footer>
    </main>
  )
}