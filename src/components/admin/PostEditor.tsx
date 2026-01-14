'use client'

import { useState } from 'react'
import RichTextEditor from './RichTextEditor'
import MediaPickerModal from './MediaPickerModal'

interface PostEditorProps {
  content: string
  onChange: (html: string) => void
}

export default function PostEditor({ content, onChange }: PostEditorProps) {
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [editorInstance, setEditorInstance] = useState<{
    insertImage: (url: string) => void
  } | null>(null)

  const handleImageInsert = () => {
    setShowMediaPicker(true)
  }

  const handleMediaSelect = (url: string) => {
    // Insert image into editor
    if (typeof window !== 'undefined') {
      const insertFn = (window as unknown as { __richTextInsertImage?: (url: string) => void }).__richTextInsertImage
      if (insertFn) {
        insertFn(url)
      }
    }
    setShowMediaPicker(false)
  }

  return (
    <>
      <RichTextEditor
        content={content}
        onChange={onChange}
        placeholder="Kezdj el írni..."
        minHeight="400px"
        onImageInsert={handleImageInsert}
        showImageButton={true}
      />

      <MediaPickerModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleMediaSelect}
      />
    </>
  )
}
