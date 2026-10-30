// Offline queue for field station records, stored in IndexedDB on the device.
// Records stay here until they are uploaded to Supabase, so nothing is lost
// when R/V Dawn is out of signal range.
import { supabase } from './supabase'

const DB_NAME = 'gocos-field'
const STORE = 'records'
const PHOTO_BUCKET = 'field-photos'

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'client_id' })
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function tx(mode, fn) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode)
    const store = t.objectStore(STORE)
    let out
    Promise.resolve(fn(store)).then(v => { out = v })
    t.oncomplete = () => resolve(out)
    t.onerror = () => reject(t.error)
  })
}

const reqP = r => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error) })

export function newClientId() {
  return crypto.randomUUID ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
      })
}

export async function saveRecord(rec) {
  return tx('readwrite', store => reqP(store.put({ ...rec, sync_status: rec.sync_status || 'queued' })))
}

export async function listRecords() {
  const all = await tx('readonly', store => reqP(store.getAll()))
  return (all || []).sort((a, b) => (b.sampled_at || '').localeCompare(a.sampled_at || ''))
}

export async function deleteRecord(clientId) {
  return tx('readwrite', store => reqP(store.delete(clientId)))
}

// Shrink a camera photo to at most 1600 px on the long side (JPEG) so uploads
// work on slow marina Wi-Fi and the device does not fill up.
export async function compressPhoto(file, maxSide = 1600, quality = 0.8) {
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise((res, rej) => {
      const i = new Image()
      i.onload = () => res(i)
      i.onerror = rej
      i.src = url
    })
    const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(img.width * scale)
    canvas.height = Math.round(img.height * scale)
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
    return await new Promise(res => canvas.toBlob(res, 'image/jpeg', quality))
  } finally {
    URL.revokeObjectURL(url)
  }
}

// Upload every queued record. Safe to run repeatedly: rows are keyed on
// client_id, so a record that was half-sent is simply sent again.
export async function syncAll(onProgress) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Sign in as crew to upload records.')
  const pending = (await listRecords()).filter(r => r.sync_status !== 'synced')
  let done = 0
  for (const rec of pending) {
    try {
      const photoPaths = []
      for (let i = 0; i < (rec.photos || []).length; i++) {
        const path = `${rec.station_id}/${rec.client_id}-${i + 1}.jpg`
        const { error } = await supabase.storage.from(PHOTO_BUCKET)
          .upload(path, rec.photos[i], { contentType: 'image/jpeg', upsert: true })
        if (error) throw error
        photoPaths.push(path)
      }
      const row = {
        client_id: rec.client_id,
        station_id: rec.station_id,
        site_name: rec.site_name || null,
        sampled_at: rec.sampled_at,
        lat: rec.lat ?? null,
        lng: rec.lng ?? null,
        gps_accuracy_m: rec.gps_accuracy_m ?? null,
        sample_types: rec.sample_types || [],
        bottle_ids: rec.bottle_ids || null,
        water_temp_c: rec.water_temp_c === '' ? null : rec.water_temp_c ?? null,
        salinity_psu: rec.salinity_psu === '' ? null : rec.salinity_psu ?? null,
        sea_state: rec.sea_state || null,
        weather: rec.weather || null,
        notes: rec.notes || null,
        photo_paths: photoPaths,
      }
      const { error } = await supabase.from('field_samples').upsert(row, { onConflict: 'client_id' })
      if (error) throw error
      await saveRecord({ ...rec, sync_status: 'synced', sync_error: null, synced_at: new Date().toISOString() })
    } catch (e) {
      await saveRecord({ ...rec, sync_status: 'error', sync_error: String(e.message || e) })
    }
    done++
    onProgress && onProgress(done, pending.length)
  }
  return pending.length
}
