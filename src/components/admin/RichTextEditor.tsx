'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { useCallback, useState, useMemo } from 'react'
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Unlink,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react'
import TextAlign from '@tiptap/extension-text-align'
import DOMPurify from 'isomorphic-dompurify'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: string
  onImageInsert?: () => void
  showImageButton?: boolean
}

interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}

function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded transition-colors ${
        isActive
          ? 'bg-orange-100 text-orange-600'
          : 'hover:bg-gray-100 text-gray-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-gray-300 mx-1" />
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Kezdj el írni...',
  minHeight = '200px',
  onImageInsert,
  showImageButton = true
}: RichTextEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  const extensions = useMemo(() => [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3]
      }
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-orange-600 underline hover:text-orange-700'
      }
    }),
    Image.configure({
      HTMLAttributes: {
        class: 'max-w-full h-auto rounded-lg my-4'
      }
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph', 'image']
    })
  ], [])

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content,
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none`,
        style: `min-height: ${minHeight}`
      }
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      // Sanitize HTML before passing to parent
      const sanitizedHtml = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
          'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3',
          'ul', 'ol', 'li', 'a', 'img', 'blockquote'
        ],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class', 'style']
      })
      onChange(sanitizedHtml)
    }
  })

  const setLink = useCallback(() => {
    if (!editor) return

    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl, target: '_blank' })
        .run()
    }
    setLinkUrl('')
    setShowLinkInput(false)
  }, [editor, linkUrl])

  const removeLink = useCallback(() => {
    if (!editor) return
    editor.chain().focus().unsetLink().run()
  }, [editor])

  const insertImage = useCallback(
    (url: string) => {
      if (!editor) return
      editor.chain().focus().setImage({ src: url }).run()
    },
    [editor]
  )

  // Expose insertImage method for external use (MediaPicker)
  if (editor && typeof window !== 'undefined') {
    (window as unknown as { __richTextInsertImage?: (url: string) => void }).__richTextInsertImage = insertImage
  }

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-lg p-4 min-h-[200px] animate-pulse bg-gray-50">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    )
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-300 bg-gray-50">
        {/* Text Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Félkövér (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Dőlt (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Címsor 1"
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Címsor 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Címsor 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Felsorolás"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Számozás"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Text Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Balra igazítás"
        >
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Középre igazítás"
        >
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Jobbra igazítás"
        >
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Link */}
        {showLinkInput ? (
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
              className="px-2 py-1 border border-gray-300 rounded text-sm w-48 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  setLink()
                } else if (e.key === 'Escape') {
                  setShowLinkInput(false)
                  setLinkUrl('')
                }
              }}
              autoFocus
            />
            <button
              type="button"
              onClick={setLink}
              className="px-2 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors"
            >
              OK
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLinkInput(false)
                setLinkUrl('')
              }}
              className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-sm hover:bg-gray-300 transition-colors"
            >
              Mégse
            </button>
          </div>
        ) : (
          <>
            <ToolbarButton
              onClick={() => {
                const currentUrl = editor.getAttributes('link').href || ''
                setLinkUrl(currentUrl)
                setShowLinkInput(true)
              }}
              isActive={editor.isActive('link')}
              title="Link beszúrás"
            >
              <LinkIcon className="w-4 h-4" />
            </ToolbarButton>
            {editor.isActive('link') && (
              <ToolbarButton onClick={removeLink} title="Link törlése">
                <Unlink className="w-4 h-4" />
              </ToolbarButton>
            )}
          </>
        )}

        {/* Image */}
        {showImageButton && (
          <>
            <ToolbarDivider />
            <ToolbarButton
              onClick={() => onImageInsert?.()}
              title="Kép beszúrás"
            >
              <ImageIcon className="w-4 h-4" />
            </ToolbarButton>
          </>
        )}
      </div>

      {/* Editor Content */}
      <div className="p-4 bg-white">
        <EditorContent
          editor={editor}
          className="[&_.ProseMirror]:outline-none [&_.ProseMirror]:text-gray-900 [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror_p]:mb-2 [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mb-4 [&_.ProseMirror_h1]:text-gray-900 [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:mb-3 [&_.ProseMirror_h2]:text-gray-900 [&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mb-2 [&_.ProseMirror_h3]:text-gray-900 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5 [&_.ProseMirror_ul]:mb-2 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5 [&_.ProseMirror_ol]:mb-2 [&_.ProseMirror_li]:mb-1"
        />
        {editor.isEmpty && (
          <p className="text-gray-400 pointer-events-none absolute top-4 left-4">
            {placeholder}
          </p>
        )}
      </div>

      {/* Character count */}
      <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-right text-xs text-gray-500">
        {editor.storage.characterCount?.characters?.() ?? editor.getText().length} karakter
      </div>
    </div>
  )
}
