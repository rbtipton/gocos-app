import { Capacitor } from '@capacitor/core'
import { Geolocation } from '@capacitor/geolocation'

// Returns { lat, lng, accuracy } using the phone's GPS. In the native app this
// goes through Capacitor (which asks for location permission); in a browser it
// falls back to the standard web API. GPS works at sea without a data signal.
export async function getFix() {
  const opts = { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
  if (Capacitor.isNativePlatform()) {
    const perm = await Geolocation.checkPermissions()
    if (perm.location !== 'granted') {
      const req = await Geolocation.requestPermissions({ permissions: ['location'] })
      if (req.location !== 'granted') throw new Error('Location permission was not granted.')
    }
    const p = await Geolocation.getCurrentPosition(opts)
    return { lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy }
  }
  if (!('geolocation' in navigator)) throw new Error('This device has no GPS access.')
  const p = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, opts))
  return { lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy }
}

export function fmtCoord(v, pos, neg) {
  if (v === null || v === undefined || v === '') return ''
  const n = Number(v)
  return `${Math.abs(n).toFixed(5)}° ${n >= 0 ? pos : neg}`
}
