'use client'

import { useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { FontFamily } from '@tiptap/extension-font-family'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { toast } from 'sonner'
import TextAlign from '@tiptap/extension-text-align'
import {
  Bold, Italic, Strikethrough, List, ListOrdered,
  Quote, Code2, Link2, ImageIcon, Undo2, Redo2,
  Heading1, Heading2, Heading3,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Minus,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  folder: string
  placeholder?: string
  minHeight?: number
}

const FONT_OPTIONS = [
  { label: 'Default (DM Sans)', value: '' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Merriweather', value: 'Merriweather, serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Courier New', value: 'Courier New, monospace' },
]

export default function RichTextEditor({
  content,
  onChange,
  folder,
  placeholder = 'Start writing…',
  minHeight = 400,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false }),
      TextStyle,
      FontFamily,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
    ],
    content,
    editorProps: {
      attributes: { class: 'tiptap-editor' },
      handleDrop(view, event, _slice, moved) {
        if (!moved && event.dataTransfer?.files.length) {
          const file = event.dataTransfer.files[0]
          if (file.type.startsWith('image/')) {
            event.preventDefault()
            uploadInlineImage(file, view.state.selection.anchor)
            return true
          }
        }
        return false
      },
      handlePaste(_view, event) {
        const file = event.clipboardData?.files[0]
        if (file?.type.startsWith('image/')) {
          event.preventDefault()
          uploadInlineImage(file)
          return true
        }
        return false
      },
    },
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  })

  const uploadInlineImage = useCallback(async (file: File, _pos?: number) => {
    if (!editor) return
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const json = await res.json() as { url?: string; error?: string }
      if (!res.ok || json.error) {
        toast.error(json.error ?? 'Image upload failed.')
        return
      }
      editor.chain().focus().setImage({ src: json.url! }).run()
    } catch {
      toast.error('Image upload failed.')
    }
  }, [editor, folder])

  async function handleToolbarImage() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/jpeg,image/png,image/webp,image/svg+xml,image/avif'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (file) await uploadInlineImage(file)
    }
    input.click()
  }

  function handleSetLink() {
    const prev = editor?.getAttributes('link').href as string | undefined
    const url = window.prompt('Enter URL', prev ?? 'https://')
    if (!url) return
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }

  if (!editor) return null

  const btnClass = (active: boolean) =>
    cn(
      'p-1.5 rounded cursor-pointer transition-colors',
      active
        ? 'bg-[var(--color-brand-teal)] text-white'
        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)] hover:text-[var(--color-text-primary)] dark:hover:text-[#e8ecec]'
    )

  const charCount = editor.storage.characterCount?.characters?.() ?? 0

  return (
    <div className="rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)]">
        {/* History */}
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btnClass(false)} title="Undo">
          <Undo2 className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btnClass(false)} title="Redo">
          <Redo2 className="h-4 w-4" />
        </button>

        <div className="w-px h-5 bg-[var(--color-border)] dark:bg-[var(--color-dark-border)] mx-1" />

        {/* Headings */}
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))} title="Heading 1">
          <Heading1 className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))} title="Heading 2">
          <Heading2 className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive('heading', { level: 3 }))} title="Heading 3">
          <Heading3 className="h-4 w-4" />
        </button>

        <div className="w-px h-5 bg-[var(--color-border)] dark:bg-[var(--color-dark-border)] mx-1" />

        {/* Inline marks */}
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))} title="Bold">
          <Bold className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))} title="Italic">
          <Italic className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={btnClass(editor.isActive('strike'))} title="Strikethrough">
          <Strikethrough className="h-4 w-4" />
        </button>

        <div className="w-px h-5 bg-[var(--color-border)] dark:bg-[var(--color-dark-border)] mx-1" />

        {/* Lists */}
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))} title="Bullet list">
          <List className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))} title="Ordered list">
          <ListOrdered className="h-4 w-4" />
        </button>

        <div className="w-px h-5 bg-[var(--color-border)] dark:bg-[var(--color-dark-border)] mx-1" />

        {/* Blocks */}
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))} title="Blockquote">
          <Quote className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btnClass(editor.isActive('codeBlock'))} title="Code block">
          <Code2 className="h-4 w-4" />
        </button>

        <div className="w-px h-5 bg-[var(--color-border)] dark:bg-[var(--color-dark-border)] mx-1" />

        {/* Text alignment */}
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btnClass(editor.isActive({ textAlign: 'left' }))} title="Align left">
          <AlignLeft className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btnClass(editor.isActive({ textAlign: 'center' }))} title="Align center">
          <AlignCenter className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btnClass(editor.isActive({ textAlign: 'right' }))} title="Align right">
          <AlignRight className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={btnClass(editor.isActive({ textAlign: 'justify' }))} title="Justify">
          <AlignJustify className="h-4 w-4" />
        </button>

        <div className="w-px h-5 bg-[var(--color-border)] dark:bg-[var(--color-dark-border)] mx-1" />

        {/* Divider */}
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btnClass(false)} title="Insert divider">
          <Minus className="h-4 w-4" />
        </button>

        <div className="w-px h-5 bg-[var(--color-border)] dark:bg-[var(--color-dark-border)] mx-1" />

        {/* Link & Image */}
        <button type="button" onClick={handleSetLink} className={btnClass(editor.isActive('link'))} title="Insert link">
          <Link2 className="h-4 w-4" />
        </button>
        <button type="button" onClick={handleToolbarImage} className={btnClass(false)} title="Insert image">
          <ImageIcon className="h-4 w-4" />
        </button>

        <div className="w-px h-5 bg-[var(--color-border)] dark:bg-[var(--color-dark-border)] mx-1" />

        {/* Font family */}
        <select
          value={editor.getAttributes('textStyle').fontFamily ?? ''}
          onChange={(e) => {
            if (e.target.value === '') {
              editor.chain().focus().unsetFontFamily().run()
            } else {
              editor.chain().focus().setFontFamily(e.target.value).run()
            }
          }}
          className="text-xs rounded border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] text-[var(--color-text-primary)] dark:text-[#e8ecec] px-1.5 py-1 cursor-pointer"
          title="Font family"
        >
          {FONT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Editor canvas */}
      <div style={{ minHeight }}>
        <EditorContent editor={editor} />
      </div>

      {/* Character count */}
      <div className="px-3 py-1.5 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)]">
        <span className="text-xs text-[var(--color-text-muted)]">
          {charCount.toLocaleString()} characters
        </span>
      </div>
    </div>
  )
}
