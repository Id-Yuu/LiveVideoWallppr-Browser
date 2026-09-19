import {SEARCH_ENGINES} from '../../../constants'
import type {SearchEngineId, Settings} from '../../../types'
import PositionPicker from '../../ui/PositionPicker'
import Toggle from '../../ui/Toggle'

interface SearchSectionProps {
  settings: Settings
  onChange: (patch: Partial<Settings>) => void
}

export default function SearchSection({settings, onChange}: SearchSectionProps) {
  return (
    <section className="settings-section">
      <h3 className="settings-section__title">Address & Search Bar</h3>
      <div className="settings-section__body">
        <Toggle
          label="Show Search Bar"
          checked={settings.showSearchBar}
          onChange={(v) => onChange({showSearchBar: v})}
        />

        {settings.showSearchBar && (
          <>
            <PositionPicker
              label="Search Bar Position"
              value={settings.searchBarPosition}
              onChange={(v) => onChange({searchBarPosition: v})}
            />

            <div className="field-group">
              <label htmlFor="search-engine-select" className="field-group__label">
                Default Search Engine
              </label>
              <select
                id="search-engine-select"
                className="select-input"
                value={settings.searchEngine}
                onChange={(e) =>
                  onChange({searchEngine: e.target.value as SearchEngineId})
                }
              >
                {SEARCH_ENGINES.map((eng) => (
                  <option key={eng.id} value={eng.id}>
                    {eng.name}
                  </option>
                ))}
              </select>
            </div>

            {settings.searchEngine === 'custom' && (
              <div className="field-group">
                <label htmlFor="custom-search-url" className="field-group__label">
                  Custom Search URL (%s = query)
                </label>
                <input
                  id="custom-search-url"
                  type="text"
                  className="text-input"
                  placeholder="https://example.com/search?q=%s"
                  value={settings.customSearchEngineUrl}
                  onChange={(e) =>
                    onChange({customSearchEngineUrl: e.target.value})
                  }
                />
              </div>
            )}

            <Toggle
              label="Open in New Tab"
              checked={settings.searchOpenInNewTab}
              onChange={(v) => onChange({searchOpenInNewTab: v})}
            />
          </>
        )}
      </div>
    </section>
  )
}

