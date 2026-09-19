import {useCallback, useEffect, useRef, useState} from 'react'
import {ArrowRight, Globe, Search, X} from 'lucide-react'
import {SEARCH_ENGINES} from '../../constants'
import type {SearchEngineId} from '../../types'
import {buildSearchUrl, isDirectUrl} from '../../utils/searchUtils'

interface SearchBarProps {
  engine: SearchEngineId
  customUrl: string
  openInNewTab: boolean
  onChangeEngine?: (engine: SearchEngineId) => void
}

export default function SearchBar({
  engine,
  customUrl,
  openInNewTab,
  onChangeEngine
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const activeEngineObj =
    SEARCH_ENGINES.find((e) => e.id === engine) ?? SEARCH_ENGINES[0]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault()
      const trimmed = query.trim()
      if (!trimmed) return

      const destinationUrl = buildSearchUrl(trimmed, engine, customUrl)
      if (!destinationUrl) return

      if (openInNewTab) {
        window.open(destinationUrl, '_blank')
      } else {
        window.location.href = destinationUrl
      }
    },
    [query, engine, customUrl, openInNewTab]
  )

  const handleSelectEngine = (engineId: SearchEngineId) => {
    setIsDropdownOpen(false)
    onChangeEngine?.(engineId)
    inputRef.current?.focus()
  }

  const isUrl = isDirectUrl(query)

  return (
    <div className="search-bar">
      <form className="search-bar__form" onSubmit={handleSubmit} role="search">
        {/* Search Engine Switcher */}
        <button
          type="button"
          className="search-bar__engine"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          title={`Search engine: ${activeEngineObj.name}. Click to change`}
          aria-label="Change search engine"
          aria-expanded={isDropdownOpen}
        >
          {isUrl ? <Globe size={14} /> : <Search size={14} />}
          <span className="search-bar__engine-label">{activeEngineObj.name}</span>
        </button>

        {isDropdownOpen && (
          <ul className="search-bar__picker" ref={dropdownRef} role="menu">
            {SEARCH_ENGINES.map((eng) => (
              <li key={eng.id}>
                <button
                  type="button"
                  className={`search-bar__picker-option ${
                    eng.id === engine ? 'search-bar__picker-option--active' : ''
                  }`}
                  onClick={() => handleSelectEngine(eng.id)}
                  role="menuitem"
                >
                  {eng.name}
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          className="search-bar__input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={activeEngineObj.placeholder}
          aria-label="Search or enter URL"
          autoComplete="off"
          spellCheck={false}
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            className="icon-btn icon-btn--tiny"
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            title="Clear search"
            aria-label="Clear search text"
          >
            <X size={12} />
          </button>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="search-bar__submit"
          title={isUrl ? 'Navigate to URL' : 'Search'}
          aria-label={isUrl ? 'Navigate to URL' : 'Search'}
          disabled={!query.trim()}
        >
          <ArrowRight size={16} />
        </button>
      </form>
    </div>
  )
}

