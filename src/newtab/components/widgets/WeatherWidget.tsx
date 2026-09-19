import {useCallback, useEffect, useState} from 'react'
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Droplets,
  MapPin,
  Moon,
  RefreshCw,
  Sun,
  Wind
} from 'lucide-react'
import {
  fetchWeather,
  geocodeCity,
  getCurrentCoordinates,
  type WeatherData
} from '../../services/weatherService'
import type {WeatherUnit} from '../../types'

interface WeatherWidgetProps {
  unit: WeatherUnit
  city: string
  latitude: number | null
  longitude: number | null
}

function renderWeatherIcon(iconName: string, size = 26) {
  switch (iconName) {
    case 'Sun':
      return <Sun size={size} className="weather-icon weather-icon--sun" />
    case 'Moon':
      return <Moon size={size} className="weather-icon weather-icon--moon" />
    case 'CloudSun':
      return <CloudSun size={size} className="weather-icon weather-icon--partly" />
    case 'Cloud':
      return <Cloud size={size} className="weather-icon weather-icon--cloud" />
    case 'CloudFog':
      return <CloudFog size={size} className="weather-icon weather-icon--fog" />
    case 'CloudDrizzle':
      return <CloudDrizzle size={size} className="weather-icon weather-icon--drizzle" />
    case 'CloudRain':
      return <CloudRain size={size} className="weather-icon weather-icon--rain" />
    case 'CloudSnow':
      return <CloudSnow size={size} className="weather-icon weather-icon--snow" />
    case 'CloudLightning':
      return <CloudLightning size={size} className="weather-icon weather-icon--lightning" />
    default:
      return <Cloud size={size} className="weather-icon" />
  }
}

export default function WeatherWidget({
  unit,
  city,
  latitude,
  longitude
}: WeatherWidgetProps) {
  const [data, setData] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadWeather = useCallback(
    async (force = false) => {
      setIsLoading(true)
      setError(null)
      try {
        let lat = latitude
        let lon = longitude
        let cityName = city.trim()

        if (lat === null || lon === null) {
          if (cityName) {
            const geo = await geocodeCity(cityName)
            if (geo) {
              lat = geo.latitude
              lon = geo.longitude
              cityName = geo.name
            } else {
              throw new Error(`Location "${cityName}" not found.`)
            }
          } else {
            try {
              const coords = await getCurrentCoordinates()
              lat = coords.latitude
              lon = coords.longitude
              cityName = 'Current Location'
            } catch {
              // Default fallback to London/GMT if no location given and GPS denied
              lat = 51.5074
              lon = -0.1278
              cityName = 'London'
            }
          }
        }

        const weather = await fetchWeather(lat, lon, unit, cityName, force)
        setData(weather)
      } catch (err: any) {
        setError(err.message || 'Failed to load weather')
      } finally {
        setIsLoading(false)
      }
    },
    [latitude, longitude, city, unit]
  )

  useEffect(() => {
    loadWeather(false)
  }, [loadWeather])

  const symbol = unit === 'fahrenheit' ? '°F' : '°C'
  const speedUnit = unit === 'fahrenheit' ? 'mph' : 'km/h'

  if (error && !data) {
    return (
      <button
        type="button"
        className="weather-widget weather-widget--muted"
        onClick={() => loadWeather(true)}
        title="Click to retry"
      >
        <span>{error}</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      className="weather-widget"
      onClick={() => loadWeather(true)}
      title="Click to refresh weather"
    >
      <div className="weather-widget__icon">
        {data ? renderWeatherIcon(data.condition.includes('Night') ? 'Moon' : data.condition.includes('Sun') ? 'Sun' : data.condition.includes('Rain') ? 'CloudRain' : data.condition.includes('Snow') ? 'CloudSnow' : data.condition.includes('Thunder') ? 'CloudLightning' : data.condition.includes('Drizzle') ? 'CloudDrizzle' : data.condition.includes('Fog') ? 'CloudFog' : 'Cloud', 20) : <Cloud size={20} />}
      </div>
      <div className="weather-widget__info">
        <span className="weather-widget__temp">
          {data ? `${data.temperature}${symbol}` : `--${symbol}`}
        </span>
        <span className="weather-widget__location" title={data?.city}>
          {data ? `${data.city} • ${data.condition}` : 'Loading...'}
        </span>
      </div>
      {isLoading && <div className="weather-widget__spinner" aria-label="Refreshing" />}
    </button>
  )
}

