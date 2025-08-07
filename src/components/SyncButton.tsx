'use client'

import { useState } from 'react'
import { RefreshCw, Calendar, Check } from 'lucide-react'
import { SchoolEvent } from '@/types/events'

interface SyncButtonProps {
  onSync: (selectedEvents: SchoolEvent[]) => Promise<void>
  disabled: boolean
  events: SchoolEvent[]
}

export default function SyncButton({ onSync, disabled, events }: SyncButtonProps) {
  const [syncing, setSyncing] = useState(false)

  const selectedEvents = events.filter(event => event.selected && !event.synced)
  const selectedCount = selectedEvents.length

  const handleSync = async () => {
    if (selectedCount === 0) return
    
    setSyncing(true)
    try {
      await onSync(selectedEvents)
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      setSyncing(false)
    }
  }

  const buttonDisabled = disabled || syncing || selectedCount === 0

  return (
    <div className="space-y-3">
      {selectedCount > 0 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">
              {selectedCount} event{selectedCount !== 1 ? 's' : ''} ready to sync
            </span>
          </div>
        </div>
      )}

      <button
        onClick={handleSync}
        disabled={buttonDisabled}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
          buttonDisabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
        }`}
      >
        {syncing ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Syncing Events...
          </>
        ) : selectedCount > 0 ? (
          <>
            <RefreshCw className="h-4 w-4" />
            Sync {selectedCount} Event{selectedCount !== 1 ? 's' : ''} to Google Calendar
          </>
        ) : (
          <>
            <Calendar className="h-4 w-4" />
            Select Events to Sync
          </>
        )}
      </button>

      {selectedCount === 0 && !disabled && (
        <p className="text-xs text-gray-500 text-center">
          Select events from the list below to sync them to your Google Calendar
        </p>
      )}

      {disabled && (
        <p className="text-xs text-red-500 text-center">
          Connect your Google Calendar first to enable syncing
        </p>
      )}
    </div>
  )
}