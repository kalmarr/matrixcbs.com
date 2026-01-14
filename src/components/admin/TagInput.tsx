'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Plus } from 'lucide-react'

interface Tag {
  id: number
  name: string
  slug: string
}

interface TagInputProps {
  selectedTags: Tag[]
  onChange: (tags: Tag[]) => void
}

export default function TagInput({ selectedTags, onChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<Tag[]>([])
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Fetch all tags on mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch('/api/admin/tags')
        if (res.ok) {
          const data = await res.json()
          setAllTags(data)
        }
      } catch (error) {
        console.error('Failed to fetch tags:', error)
      }
    }
    fetchTags()
  }, [])

  // Filter suggestions based on input
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = allTags.filter(
        (tag) =>
          tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedTags.some((t) => t.id === tag.id)
      )
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [inputValue, allTags, selectedTags])

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const addTag = (tag: Tag) => {
    if (!selectedTags.some((t) => t.id === tag.id)) {
      onChange([...selectedTags, tag])
    }
    setInputValue('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const removeTag = (tagId: number) => {
    onChange(selectedTags.filter((t) => t.id !== tagId))
  }

  const createTag = async (name: string) => {
    if (!name.trim()) return

    setCreating(true)
    try {
      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      const res = await fetch('/api/admin/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), slug })
      })

      if (res.ok) {
        const newTag = await res.json()
        setAllTags([...allTags, newTag])
        addTag(newTag)
      } else {
        const error = await res.json()
        console.error('Failed to create tag:', error)
      }
    } catch (error) {
      console.error('Error creating tag:', error)
    } finally {
      setCreating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (suggestions.length > 0) {
        // Add first suggestion
        addTag(suggestions[0])
      } else if (inputValue.trim()) {
        // Create new tag
        createTag(inputValue.trim())
      }
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      // Remove last tag on backspace when input is empty
      removeTag(selectedTags[selectedTags.length - 1].id)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-lg bg-white min-h-[42px] focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent">
        {/* Selected Tags */}
        {selectedTags.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-sm font-medium"
          >
            {tag.name}
            <button
              type="button"
              onClick={() => removeTag(tag.id)}
              className="p-0.5 hover:bg-orange-200 rounded transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue.trim() && setShowSuggestions(true)}
          placeholder={selectedTags.length === 0 ? 'Adj hozzá címkéket...' : ''}
          className="flex-1 min-w-[120px] outline-none text-sm"
          disabled={creating}
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {suggestions.length > 0 ? (
            <>
              {suggestions.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                >
                  {tag.name}
                </button>
              ))}
            </>
          ) : (
            inputValue.trim() && (
              <button
                type="button"
                onClick={() => createTag(inputValue.trim())}
                disabled={creating}
                className="w-full px-3 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {creating ? 'Létrehozás...' : `"${inputValue.trim()}" létrehozása`}
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}
