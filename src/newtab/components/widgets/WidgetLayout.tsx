import {WIDGET_POSITIONS} from '../../constants'
import type {Settings, Shortcut} from '../../types'
import Clock from './Clock'
import DateDisplay from './DateDisplay'
import ShortcutsGrid from './ShortcutsGrid'

interface WidgetLayoutProps {
  settings: Settings
  onAddShortcut: () => void
  onEditShortcut: (shortcut: Shortcut) => void
  onDeleteShortcut: (id: string) => void
}

export default function WidgetLayout({
  settings,
  onAddShortcut,
  onEditShortcut,
  onDeleteShortcut
}: WidgetLayoutProps) {
  return (
    <>
      {WIDGET_POSITIONS.map((pos) => {
        const widgets: React.ReactNode[] = []

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
