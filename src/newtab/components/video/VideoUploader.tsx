import {useRef} from 'react'
import {Plus, UploadCloud} from 'lucide-react'
import {ACCEPTED_VIDEO_TYPES} from '../../constants'
import {useFileDrop} from '../../hooks/useFileDrop'

interface VideoUploaderProps {
  onFiles: (files: File[]) => void
  variant?: 'button' | 'dropzone'
  label?: string
}

const ACCEPT_ATTR = ACCEPTED_VIDEO_TYPES.join(',')

export default function VideoUploader({
  onFiles,
  variant = 'button',
  label = '+ Add Video'
}: VideoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const {isDragActive, dragProps} = useFileDrop({onFiles})

  const openPicker = () => inputRef.current?.click()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) onFiles(Array.from(e.target.files))
    e.target.value = ''
  }

  const hiddenInput = (
    <input
      ref={inputRef}
      type="file"
      accept={ACCEPT_ATTR}
      multiple
      className="visually-hidden"
      onChange={handleInputChange}
      aria-hidden="true"
      tabIndex={-1}
    />
  )

  if (variant === 'button') {
    return (
      <>
        <button type="button" className="btn btn--primary" onClick={openPicker}>
          <Plus size={16} aria-hidden="true" />
          {label}
        </button>
        {hiddenInput}
      </>
    )
  }

  return (
    <div
      className={`dropzone ${isDragActive ? 'dropzone--active' : ''}`}
      {...dragProps}
      onClick={openPicker}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openPicker()
        }
      }}
      aria-label="Drag and drop a video here, or click to browse files"
    >
      <UploadCloud size={22} aria-hidden="true" />
      <span>{isDragActive ? 'Drop video to set as wallpaper' : 'Drag & Drop Video Here'}</span>
      <span className="dropzone__or">or</span>
      <span className="btn btn--ghost btn--small">Browse Files</span>
      {hiddenInput}
    </div>
  )
}
