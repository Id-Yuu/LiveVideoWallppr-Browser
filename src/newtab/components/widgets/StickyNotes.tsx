import {useCallback, useEffect, useRef, useState} from 'react'
import {Check, Copy, Pencil, Trash2} from 'lucide-react'
import {STICKY_NOTES_MAX_WORDS} from '../../constants'

interface StickyNotesProps {
  content: string
  onChange: (content: string) => void
}

function countWords(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

function enforceWordLimit(text: string, maxWords: number): string {
  const trimmed = text.trim()
  if (!trimmed) return text
  const words = trimmed.split(/\s+/)
  if (words.length <= maxWords) return text
  return words.slice(0, maxWords).join(' ')
}

export default function StickyNotes({content, onChange}: StickyNotesProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localText, setLocalText] = useState(content)
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const saveTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    setLocalText(content)
  }, [content])

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus()
    }
  }, [isEditing])

  // Handle clicking outside to finish editing
  useEffect(() => {
    if (!isEditing) return

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsEditing(false)
        onChange(localText)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isEditing, localText, onChange])

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value
      const wordCount = countWords(val)
      let finalVal = val
      if (wordCount > STICKY_NOTES_MAX_WORDS) {
        finalVal = enforceWordLimit(val, STICKY_NOTES_MAX_WORDS)
      }

      setLocalText(finalVal)

      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current)
      }
      saveTimeoutRef.current = window.setTimeout(() => {
        onChange(finalVal)
      }, 350)
    },
    [onChange]
  )

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!localText) return
      try {
        await navigator.clipboard.writeText(localText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        // Fallback
      }
    },
    [localText]
  )

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!localText) return
      if (window.confirm('Clear sticky note contents?')) {
        setLocalText('')
        onChange('')
      }
    },
    [localText, onChange]
  )

  const handleFinishEditing = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setIsEditing(false)
    onChange(localText)
  }

  const wordCount = countWords(localText)
  const isNearLimit = wordCount >= STICKY_NOTES_MAX_WORDS * 0.9
  const isOver = wordCount >= STICKY_NOTES_MAX_WORDS

  if (isEditing) {
    return (
      <div ref={containerRef} className="sticky-note sticky-note--editing">
        <textarea
          ref={textareaRef}
          className="sticky-note__textarea"
          value={localText}
          onChange={handleTextChange}
          placeholder="Write your note here... (supports up to 2000 words)"
          rows={6}
        />
        <div className="sticky-note__footer">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span
              className={isOver ? 'sticky-note__count--over' : ''}
              style={{color: isNearLimit ? '#a13b3b' : undefined, fontWeight: isNearLimit ? 650 : undefined}}
            >
              {wordCount} / {STICKY_NOTES_MAX_WORDS} words
            </span>
            <div style={{display: 'flex', gap: '0.35rem', alignItems: 'center'}}>
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={handleCopy}
                title="Copy note text"
                disabled={!localText}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                className="btn btn--danger btn--small"
                onClick={handleClear}
                title="Clear note"
                disabled={!localText}
              >
                <Trash2 size={12} />
              </button>
              <button
                type="button"
                className="btn btn--primary btn--small"
                onClick={handleFinishEditing}
                title="Done editing"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="sticky-note"
      onClick={() => setIsEditing(true)}
      title="Click to edit sticky note"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setIsEditing(true)
        }
      }}
    >
      <button
        type="button"
        className="sticky-note__edit"
        onClick={(e) => {
          e.stopPropagation()
          setIsEditing(true)
        }}
        title="Edit note"
        aria-label="Edit note"
      >
        <Pencil size={12} />
      </button>

      <div className="sticky-note__body">
        {localText ? (
          localText
        ) : (
          <span style={{opacity: 0.45, fontStyle: 'italic', fontWeight: 500}}>
            Click to write a note...
          </span>
        )}
      </div>

      <div className="sticky-note__footer" style={{borderTop: 'none', padding: 0, marginTop: '0.4rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <span style={{fontSize: '0.66rem', opacity: 0.6}}>
            {wordCount > 0 ? `${wordCount} words` : 'Empty'}
          </span>
          {localText && (
            <button
              type="button"
              className="icon-btn icon-btn--tiny"
              style={{width: 18, height: 18, background: 'rgba(0,0,0,0.08)', border: 'none'}}
              onClick={handleCopy}
              title="Copy note"
            >
              {copied ? <Check size={10} /> : <Copy size={10} />}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
