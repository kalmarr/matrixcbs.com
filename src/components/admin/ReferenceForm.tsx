'use client'

import { useState } from 'react'
import { ArrowLeft, Save, Loader2, Image as ImageIcon, X } from 'lucide-react'
import RichTextEditor from './RichTextEditor'
import MediaPickerModal from './MediaPickerModal'
import Image from 'next/image'

interface Reference {
  id: number
  companyName: string
  contactName: string | null
  contactRole: string | null
  testimonial: string
  logoPath: string | null
  websiteUrl: string | null
  featured: boolean
  sortOrder: number
  isActive: boolean
}

interface ReferenceFormProps {
  reference: Reference | null
  onSubmit: (data: Partial<Reference>) => Promise<void>
  onCancel: () => void
}

export default function ReferenceForm({
  reference,
  onSubmit,
  onCancel
}: ReferenceFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showMediaPicker, setShowMediaPicker] = useState(false)

  // Form state
  const [companyName, setCompanyName] = useState(reference?.companyName || '')
  const [contactName, setContactName] = useState(reference?.contactName || '')
  const [contactRole, setContactRole] = useState(reference?.contactRole || '')
  const [testimonial, setTestimonial] = useState(reference?.testimonial || '')
  const [logoPath, setLogoPath] = useState(reference?.logoPath || '')
  const [websiteUrl, setWebsiteUrl] = useState(reference?.websiteUrl || '')
  const [featured, setFeatured] = useState(reference?.featured || false)
  const [sortOrder, setSortOrder] = useState(reference?.sortOrder || 0)
  const [isActive, setIsActive] = useState(reference?.isActive ?? true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!companyName.trim()) {
      setError('A cégnév megadása kötelező')
      return
    }
    if (!testimonial.trim() || testimonial === '<p></p>') {
      setError('A vélemény megadása kötelező')
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        companyName: companyName.trim(),
        contactName: contactName.trim() || null,
        contactRole: contactRole.trim() || null,
        testimonial: testimonial.trim(),
        logoPath: logoPath.trim() || null,
        websiteUrl: websiteUrl.trim() || null,
        featured,
        sortOrder,
        isActive
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hiba történt a mentés során')
    } finally {
      setLoading(false)
    }
  }

  const handleLogoSelect = (url: string) => {
    setLogoPath(url)
    setShowMediaPicker(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-gray-200 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-900">
          {reference ? 'Referencia szerkesztése' : 'Új referencia'}
        </h2>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Alapadatok
          </h3>

          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Cégnév <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Pl. ABC Kft."
              required
            />
          </div>

          {/* Contact Name & Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                Kapcsolattartó neve
              </label>
              <input
                type="text"
                id="contactName"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Pl. Kovács János"
              />
            </div>
            <div>
              <label htmlFor="contactRole" className="block text-sm font-medium text-gray-700 mb-1">
                Pozíció
              </label>
              <input
                type="text"
                id="contactRole"
                value={contactRole}
                onChange={(e) => setContactRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Pl. Ügyvezető igazgató"
              />
            </div>
          </div>

          {/* Website URL */}
          <div>
            <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Weboldal
            </label>
            <input
              type="url"
              id="websiteUrl"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>
        </div>

        {/* Logo */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Céglogó
          </h3>

          <div className="flex items-start gap-4">
            {logoPath ? (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <Image
                  src={logoPath}
                  alt="Logo"
                  fill
                  className="object-contain"
                />
                <button
                  type="button"
                  onClick={() => setLogoPath('')}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}

            <div className="flex-1">
              <button
                type="button"
                onClick={() => setShowMediaPicker(true)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
              >
                {logoPath ? 'Logo cseréje' : 'Logo kiválasztása'}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Ajánlott: négyzetes kép, minimum 200x200 pixel
              </p>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Vélemény <span className="text-red-500">*</span>
          </h3>
          <RichTextEditor
            content={testimonial}
            onChange={setTestimonial}
            placeholder="Írd be a véleményt..."
            minHeight="150px"
            showImageButton={false}
          />
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Beállítások
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sort Order */}
            <div>
              <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
                Sorrend
              </label>
              <input
                type="number"
                id="sortOrder"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                min={0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Kisebb szám = előrébb jelenik meg
              </p>
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Kiemelt</span>
                  <p className="text-xs text-gray-500">Előrébb jelenik meg a listában</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Aktív</span>
                  <p className="text-xs text-gray-500">Megjelenik a nyilvános oldalon</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4 bg-white rounded-lg border border-gray-200 p-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            disabled={loading}
          >
            Mégse
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Mentés folyamatban...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {reference ? 'Mentés' : 'Létrehozás'}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleLogoSelect}
      />
    </div>
  )
}
