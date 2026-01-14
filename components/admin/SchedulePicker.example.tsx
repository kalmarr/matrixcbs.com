// MATRIX CBS - SchedulePicker Integration Example
// This file demonstrates how to integrate the SchedulePicker component into a post editor

'use client'

import { useState, useEffect } from 'react'
import SchedulePicker from './SchedulePicker'
import { PostStatus } from '@prisma/client'

interface PostFormData {
  title: string
  slug: string
  content: string
  status: PostStatus
  scheduledAt: Date | null
}

export default function PostEditorExample() {
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug: '',
    content: '',
    status: PostStatus.DRAFT,
    scheduledAt: null,
  })

  // Automatically set status to SCHEDULED when a date is selected
  useEffect(() => {
    if (formData.scheduledAt) {
      setFormData(prev => ({
        ...prev,
        status: PostStatus.SCHEDULED
      }))
    }
  }, [formData.scheduledAt])

  const handleScheduleChange = (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      scheduledAt: date,
      // Reset to DRAFT if schedule is cleared
      status: date ? PostStatus.SCHEDULED : PostStatus.DRAFT
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          status: formData.status,
          scheduledAt: formData.scheduledAt?.toISOString(),
          // ... other fields
        }),
      })

      if (response.ok) {
        const post = await response.json()
        console.log('Post saved:', post)
        // Redirect or show success message
      } else {
        const error = await response.json()
        console.error('Error saving post:', error)
      }
    } catch (error) {
      console.error('Failed to save post:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Create/Edit Post</h1>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Slug
        </label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={10}
          required
        />
      </div>

      {/* Schedule Picker Component */}
      <SchedulePicker
        value={formData.scheduledAt}
        onChange={handleScheduleChange}
      />

      {/* Status Display */}
      <div className="p-4 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-600">
          Current Status: <span className="font-semibold">{formData.status}</span>
        </p>
        {formData.status === PostStatus.SCHEDULED && formData.scheduledAt && (
          <p className="text-sm text-orange-600 mt-1">
            This post will be automatically published on{' '}
            {formData.scheduledAt.toLocaleString('hu-HU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
        >
          Save Post
        </button>

        <button
          type="button"
          onClick={() => {
            setFormData(prev => ({
              ...prev,
              status: PostStatus.DRAFT,
              scheduledAt: null
            }))
          }}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          Save as Draft
        </button>

        <button
          type="button"
          onClick={() => {
            setFormData(prev => ({
              ...prev,
              status: PostStatus.PUBLISHED,
              scheduledAt: null
            }))
          }}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Publish Now
        </button>
      </div>
    </form>
  )
}
