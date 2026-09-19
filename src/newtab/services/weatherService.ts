import type {WeatherUnit} from '../types'

export interface WeatherData {
  temperature: number
  apparentTemperature: number
  humidity: number
  windSpeed: number
  weatherCode: number
  isDay: boolean
  condition: string
  unit: WeatherUnit
  city: string
  fetchedAt: number
}

const CACHE_KEY = 'livevideowallppr_weather_cache'
const CACHE_TTL_MS = 15 * 60 * 1000 // 15 minutes

export function getWeatherCondition(code: number, isDay: boolean = true): {label: string; icon: string} {
  switch (code) {
    case 0:
      return {label: isDay ? 'Clear Sky' : 'Clear Night', icon: isDay ? 'Sun' : 'Moon'}
    case 1:
      return {label: isDay ? 'Mainly Clear' : 'Mainly Clear Night', icon: isDay ? 'Sun' : 'Moon'}
    case 2:
      return {label: 'Partly Cloudy', icon: 'CloudSun'}
    case 3:
      return {label: 'Overcast', icon: 'Cloud'}
    case 45:
    case 48:
      return {label: 'Foggy', icon: 'CloudFog'}
    case 51:
    case 53:
    case 55:
      return {label: 'Drizzle', icon: 'CloudDrizzle'}
    case 56:
    case 57:
      return {label: 'Freezing Drizzle', icon: 'CloudSnow'}
    case 61:
      return {label: 'Light Rain', icon: 'CloudRain'}
    case 63:
      return {label: 'Moderate Rain', icon: 'CloudRain'}
    case 65:
      return {label: 'Heavy Rain', icon: 'CloudRain'}
    case 66:
    case 67:
      return {label: 'Freezing Rain', icon: 'CloudSnow'}
    case 71:
    case 73:
    case 75:
    case 77:
      return {label: 'Snowfall', icon: 'CloudSnow'}
    case 80:
    case 81:
    case 82:
      return {label: 'Rain Showers', icon: 'CloudRain'}
    case 85:
    case 86:
      return {label: 'Snow Showers', icon: 'CloudSnow'}
    case 95:
      return {label: 'Thunderstorm', icon: 'CloudLightning'}
    case 96:
    case 99:
      return {label: 'Severe Thunderstorm', icon: 'CloudLightning'}
    default:
      return {label: 'Cloudy', icon: 'Cloud'}
  }
}

export function getCachedWeather(): WeatherData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as WeatherData
    if (Date.now() - parsed.fetchedAt < CACHE_TTL_MS) {
      return parsed
    }
  } catch {
    // Ignore cache parse errors
  }
  return null
}

export function saveCachedWeather(data: WeatherData): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    // Ignore storage quota errors
  }
}

export async function geocodeCity(query: string): Promise<{
  name: string
  latitude: number
  longitude: number
  country?: string
} | null> {
  const trimmed = query.trim()
  if (!trimmed) return null

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=1&language=en&format=json`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Geocoding error: ${res.statusText}`)
  }

  const data = await res.json()
  if (!data.results || data.results.length === 0) {
    return null
  }

  const first = data.results[0]
  return {
    name: first.name,
    latitude: first.latitude,
    longitude: first.longitude,
    country: first.country
  }
}

export async function getCurrentCoordinates(): Promise<{latitude: number; longitude: number}> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is not supported by your browser.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      (error) => {
        reject(new Error(error.message || 'Unable to retrieve location.'))
      },
      {timeout: 10000, maximumAge: 600000}
    )
  })
}

export async function fetchWeather(
  lat: number,
  lon: number,
  unit: WeatherUnit = 'celsius',
  cityName: string = 'Current Location',
  force: boolean = false
): Promise<WeatherData> {
  if (!force) {
    const cached = getCachedWeather()
    if (cached && cached.unit === unit && (!cityName || cached.city === cityName)) {
      return cached
    }
  }

  const tempUnit = unit === 'fahrenheit' ? 'fahrenheit' : 'celsius'
  const windUnit = unit === 'fahrenheit' ? 'mph' : 'kmh'
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Open-Meteo weather fetch failed: ${response.statusText}`)
  }

  const data = await response.json()
  const current = data.current

  const isDay = current.is_day === 1
  const weatherCode = current.weather_code ?? 0
  const conditionInfo = getWeatherCondition(weatherCode, isDay)

  const weatherData: WeatherData = {
    temperature: Math.round(current.temperature_2m),
    apparentTemperature: Math.round(current.apparent_temperature),
    humidity: Math.round(current.relative_humidity_2m),
    windSpeed: Math.round(current.wind_speed_10m),
    weatherCode,
    isDay,
    condition: conditionInfo.label,
    unit,
    city: cityName || 'Local',
    fetchedAt: Date.now()
  }

  saveCachedWeather(weatherData)
  return weatherData
}

