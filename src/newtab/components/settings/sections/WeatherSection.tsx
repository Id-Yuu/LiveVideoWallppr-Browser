import {useState} from 'react'
import {Locate, MapPin} from 'lucide-react'
import {WEATHER_UNIT_OPTIONS} from '../../../constants'
import {getCurrentCoordinates} from '../../../services/weatherService'
import type {Settings, WeatherUnit} from '../../../types'
import PositionPicker from '../../ui/PositionPicker'
import Toggle from '../../ui/Toggle'

interface WeatherSectionProps {
  settings: Settings
  onChange: (patch: Partial<Settings>) => void
}

export default function WeatherSection({settings, onChange}: WeatherSectionProps) {
  const [locating, setLocating] = useState(false)
  const [geoMsg, setGeoMsg] = useState<string | null>(null)

  const handleDetectLocation = async () => {
    setLocating(true)
    setGeoMsg(null)
    try {
      const coords = await getCurrentCoordinates()
      onChange({
        weatherLatitude: coords.latitude,
        weatherLongitude: coords.longitude,
        weatherCity: 'Current Location'
      })
      setGeoMsg('Location detected successfully!')
      setTimeout(() => setGeoMsg(null), 3000)
    } catch (err: any) {
      setGeoMsg(err.message || 'Could not detect location.')
    } finally {
      setLocating(false)
    }
  }

  return (
    <section className="settings-section">
      <h3 className="settings-section__title">Weather (Open-Meteo)</h3>
      <div className="settings-section__body">
        <Toggle
          label="Show Weather"
          checked={settings.showWeather}
          onChange={(v) => onChange({showWeather: v})}
        />

        {settings.showWeather && (
          <>
            <PositionPicker
              label="Weather Position"
              value={settings.weatherPosition}
              onChange={(v) => onChange({weatherPosition: v})}
            />

            <div className="field-group">
              <span className="field-group__label">Temperature Unit</span>
              <div className="radio-group">
                {WEATHER_UNIT_OPTIONS.map((opt) => (
                  <label key={opt.value} className="radio-option">
                    <input
                      type="radio"
                      name="weather-unit"
                      checked={settings.weatherUnit === opt.value}
                      onChange={() => onChange({weatherUnit: opt.value as WeatherUnit})}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="weather-city" className="field-group__label">
                City / Location Name
              </label>
              <div className="input-with-button">
                <input
                  id="weather-city"
                  type="text"
                  className="text-input"
                  placeholder="e.g. London, Tokyo, New York"
                  value={settings.weatherCity}
                  onChange={(e) => {
                    onChange({
                      weatherCity: e.target.value,
                      weatherLatitude: null,
                      weatherLongitude: null
                    })
                  }}
                />
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  onClick={handleDetectLocation}
                  disabled={locating}
                  title="Detect current location via browser GPS"
                >
                  <Locate size={14} className={locating ? 'animate-spin' : ''} />
                  <span>{locating ? 'Detecting...' : 'Auto GPS'}</span>
                </button>
              </div>
              {geoMsg && <span className="field-hint">{geoMsg}</span>}
              <span className="field-hint">
                Fetches current conditions from Open-Meteo's free weather API.
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

