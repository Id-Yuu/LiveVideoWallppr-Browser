import {WIDGET_POSITIONS} from '../../constants'
import type {Settings, Shortcut} from '../../types'
import Clock from './Clock'
import DateDisplay from './DateDisplay'
import Greeting from './Greeting'
import SearchBar from './SearchBar'
import ShortcutsGrid from './ShortcutsGrid'
import StickyNotes from './StickyNotes'
import WeatherWidget from './WeatherWidget'

interface WidgetLayoutProps {
  settings: Settings
  onAddShortcut: () => void
  onEditShortcut: (shortcut: Shortcut) => void
  onDeleteShortcut: (id: string) => void
  onUpdateSettings?: (patch: Partial<Settings>) => void
}

export default function WidgetLayout({
  settings,
  onAddShortcut,
  onEditShortcut,
  onDeleteShortcut,
  onUpdateSettings
}: WidgetLayoutProps) {
  return (
    <>
      {WIDGET_POSITIONS.map((pos) => {
        const widgets: React.ReactNode[] = []

        if (settings.showGreeting && settings.greetingPosition === pos) {
          widgets.push(<Greeting key="greeting" name={settings.greetingName} />)
        }

        if (settings.showClock && settings.clockPosition === pos) {
          widgets.push(<Clock key="clock" format={settings.clockFormat} />)
        }

        if (settings.showDate && settings.datePosition === pos) {
          widgets.push(<DateDisplay key="date" />)
        }

        if (settings.customText.trim().length > 0 && settings.customTextPosition === pos) {
          widgets.push(
            <div key="custom-text" className="custom-text">
              {settings.customText}
            </div>
          )
        }

        if (settings.showSearchBar && settings.searchBarPosition === pos) {
          widgets.push(
            <SearchBar
              key="search-bar"
              engine={settings.searchEngine}
              customUrl={settings.customSearchEngineUrl}
              openInNewTab={settings.searchOpenInNewTab}
              onChangeEngine={(eng) => onUpdateSettings?.({searchEngine: eng})}
            />
          )
        }

        if (settings.showWeather && settings.weatherPosition === pos) {
          widgets.push(
            <WeatherWidget
              key="weather"
              unit={settings.weatherUnit}
              city={settings.weatherCity}
              latitude={settings.weatherLatitude}
              longitude={settings.weatherLongitude}
            />
          )
        }

        if (settings.showStickyNotes && settings.stickyNotesPosition === pos) {
          widgets.push(
            <StickyNotes
              key="sticky-notes"
              content={settings.stickyNotesContent}
              onChange={(content) => onUpdateSettings?.({stickyNotesContent: content})}
            />
          )
        }

        if (settings.showShortcuts && settings.shortcutsPosition === pos) {
          widgets.push(
            <ShortcutsGrid
              key="shortcuts"
              shortcuts={settings.shortcuts}
              openInNewTab={settings.openShortcutsInNewTab}
              onAddShortcut={onAddShortcut}
              onEditShortcut={onEditShortcut}
              onDeleteShortcut={onDeleteShortcut}
            />
          )
        }

        if (widgets.length === 0) return null

        return (
          <div key={pos} className={`widget-slot widget-slot--${pos}`}>
            {widgets}
          </div>
        )
      })}
    </>
  )
}
