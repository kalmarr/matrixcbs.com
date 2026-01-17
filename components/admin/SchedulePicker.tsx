'use client'

// MATRIX CBS - Schedule Picker Component
// Date and time picker for scheduling post publication

import React, { useState, useEffect } from 'react'

interface SchedulePickerProps {
  value: Date | null
  onChange: (date: Date | null) => void
}

export default function SchedulePicker({ value, onChange }: SchedulePickerProps) {
  const [dateValue, setDateValue] = useState('')
  const [timeValue, setTimeValue] = useState('')

  // Initialize date and time inputs from value prop
  useEffect(() => {
    if (value) {
      // Format date as YYYY-MM-DD
      const year = value.getFullYear()
      const month = String(value.getMonth() + 1).padStart(2, '0')
      const day = String(value.getDate()).padStart(2, '0')
      setDateValue(`${year}-${month}-${day}`)

      // Format time as HH:mm
      const hours = String(value.getHours()).padStart(2, '0')
      const minutes = String(value.getMinutes()).padStart(2, '0')
      setTimeValue(`${hours}:${minutes}`)
    } else {
      setDateValue('')
      setTimeValue('')
    }
  }, [value])

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value
    setDateValue(newDate)

    if (newDate && timeValue) {
      // Combine date and time
      const combinedDateTime = new Date(`${newDate}T${timeValue}`)
      onChange(combinedDateTime)
    } else if (!newDate) {
      // Clear schedule if date is removed
      onChange(null)
    }
  }

  // Handle time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setTimeValue(newTime)

    if (dateValue && newTime) {
      // Combine date and time
      const combinedDateTime = new Date(`${dateValue}T${newTime}`)
      onChange(combinedDateTime)
    } else if (!newTime) {
      // Clear schedule if time is removed
      onChange(null)
    }
  }

  // Clear schedule
  const handleClear = () => {
    setDateValue('')
    setTimeValue('')
    onChange(null)
  }

  // Get minimum date (today) in YYYY-MM-DD format
  const getMinDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Format date for display
  const getFormattedPreview = () => {
    if (!value) return null

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Budapest'
    }

    return new Intl.DateTimeFormat('hu-HU', options).format(value)
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Ütemezett publikálás
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Date Input */}
        <div>
          <label htmlFor="schedule-date" className="block text-xs text-gray-600 mb-1">
            Dátum
          </label>
          <input
            type="date"
            id="schedule-date"
            value={dateValue}
            onChange={handleDateChange}
            min={getMinDate()}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        {/* Time Input */}
        <div>
          <label htmlFor="schedule-time" className="block text-xs text-gray-600 mb-1">
            Időpont
          </label>
          <input
            type="time"
            id="schedule-time"
            value={timeValue}
            onChange={handleTimeChange}
            disabled={!dateValue}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Preview and Clear */}
      {value && (
        <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-md">
          <div>
            <p className="text-xs text-orange-600 font-medium">
              Publikálás időpontja:
            </p>
            <p className="text-sm text-orange-900 font-semibold">
              {getFormattedPreview()}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-1 text-sm text-orange-700 hover:text-orange-900 hover:bg-orange-100 rounded transition-colors"
          >
            Törlés
          </button>
        </div>
      )}

      {/* Helper Text */}
      {!value && (
        <p className="text-xs text-gray-500">
          A poszt automatikusan publikálva lesz a megadott időpontban. Ha nem ad meg időpontot,
          a poszt vázlat marad.
        </p>
      )}
    </div>
  )
}
