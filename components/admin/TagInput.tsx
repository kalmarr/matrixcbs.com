'use client'

// MATRIX CBS - Címke Beviteli Komponens
// Autocomplete funkcióval és új címke létrehozással

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
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Tag[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Kattintás kívülre bezárja a dropdown-t
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keresés debounce-al
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        searchTags(query)
      } else {
        setSuggestions([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const searchTags = async (searchQuery: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/tags?search=${encodeURIComponent(searchQuery)}`)
      if (res.ok) {
        const data = await res.json()
        // Kiszűrjük a már kiválasztott címkéket
        const filtered = data.filter(
          (tag: Tag) => !selectedTags.some((t) => t.id === tag.id)
        )
        setSuggestions(filtered)
      }
    } catch (err) {
      console.error('Error searching tags:', err)
    } finally {
      setLoading(false)
    }
  }

  // Slug generálás
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // Címke hozzáadása
  const addTag = (tag: Tag) => {
    onChange([...selectedTags, tag])
    setQuery('')
    setSuggestions([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  // Új címke létrehozása
  const createTag = async () => {
    if (!query.trim()) return

    try {
      const res = await fetch('/api/admin/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: query.trim(),
          slug: generateSlug(query.trim())
        })
      })

      if (res.ok) {
        const newTag = await res.json()
        addTag(newTag)
      }
    } catch (err) {
      console.error('Error creating tag:', err)
    }
  }

  // Címke eltávolítása
  const removeTag = (tagId: number) => {
    onChange(selectedTags.filter((t) => t.id !== tagId))
  }

  // Enter kezelése
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (suggestions.length > 0) {
        addTag(suggestions[0])
      } else if (query.trim()) {
        createTag()
      }
    } else if (e.key === 'Backspace' && !query && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1].id)
    }
  }

  return (
    <div className="relative">
      {/* Kiválasztott címkék és beviteli mező */}
      <div
        className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent bg-white min-h-[42px]"
        onClick={() => inputRef.current?.focus()}
      >
        {selectedTags.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-md text-sm"
          >
            {tag.name}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                removeTag(tag.id)
              }}
              className="hover:text-orange-900"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-[120px] outline-none text-sm"
          placeholder={selectedTags.length === 0 ? 'Címkék hozzáadása...' : ''}
        />
      </div>

      {/* Dropdown javaslatok */}
      {isOpen && (query.length >= 2 || suggestions.length > 0) && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {loading ? (
            <div className="px-4 py-2 text-gray-500 text-sm">Keresés...</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => addTag(tag)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
              >
                {tag.name}
              </button>
            ))
          ) : query.trim() ? (
            <button
              type="button"
              onClick={createTag}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm flex items-center gap-2 text-orange-600"
            >
              <Plus className="w-4 h-4" />
              &quot;{query}&quot; létrehozása
            </button>
          ) : null}
        </div>
      )}
    </div>
  )
}
