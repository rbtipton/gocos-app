import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { stations } from '../data/stations'
import { getFix, fmtCoord } from '../lib/geo'
import { saveRecord, listRecords, deleteRecord, syncAll, compressPhoto, newClientId } from '../lib/fieldQueue'

const SAMPLE_TYPES = [
  'PFAS water',
  'Microplastics (surface)',
  'Microplastics (subsurface)',
  'Sediment',
  'Field blank',
  'Duplicate',
]
const SEA_STATES = ['', 'Calm (0-1)', 'Slight (2-3)', 'Moderate (4)', 'Rough (5+)']

function localNow() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

function nextStationId(records) {
  const nums = [...stations.map(s => s.id), ...records.map(r => r.station_id)]
    .map(id => /^CST-(\d+)$/.exec(id || ''))
    .filter(Boolean)
    .map(m => Number(m[1]))
  const n = (nums.length ? Math.max(...nums) : 0) + 1
  return `CST-${String(n).padStart(3, '0')}`
}

function blankForm(records) {
  return {
    station_id: nextStationId(records), site_name: '', sampled_at: localNow(),
    lat: '', lng: '', gps_accuracy_m: '', sample_types: ['PFAS water'],
    bottle_ids: '', water_temp_c: '', salinity_psu: '', sea_state: '', weather: '', notes: '',
  }
}

function CrewSignIn({ session }) {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [step, setStep] = useState('email')
  const [usePassword, setUsePassword] = useState(false)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  if (session) {
    return (
      <div className="field-crew">
        <span>Signed in as <strong>{session.user.email}</strong></span>
        <button className="btn btn-outline btn-sm" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </div>
    )
  }

  async function sendCode(e) {
    e.preventDefault()
    setBusy(true); setMsg('')
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: false } })
    setBusy(false)
    if (error) setMsg(error.message.includes('Signups not allowed') ? 'That email is not on the SSI crew list.' : error.message)
    else { setStep('code'); setMsg('Check your email for a 6-digit code.') }
  }

  async function passwordSignIn(e) {
    e.preventDefault()
    setBusy(true); setMsg('')
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (error) setMsg(error.message)
  }

  async function verify(e) {
    e.preventDefault()
    setBusy(true); setMsg('')
    const { error } = await supabase.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: 'email' })
    setBusy(false)
    if (error) setMsg(error.message)
  }

  return (
    <form className="card field-signin" onSubmit={usePassword ? passwordSignIn : step === 'email' ? sendCode : verify}>
      <div className="section-title">Crew sign-in</div>
      <p className="form-hint" style={{ marginTop: 0, marginBottom: 12 }}>
        Sign in once while you have a signal. You can log stations offline after that; uploading needs a connection.
      </p>
      {usePassword ? (
        <div className="field-row">
          <input className="form-input" type="email" required placeholder="crew email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          <input className="form-input" type="password" required placeholder="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </div>
      ) : step === 'email' ? (
        <div className="field-row">
          <input className="form-input" type="email" required placeholder="crew email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Sending…' : 'Send code'}</button>
        </div>
      ) : (
        <div className="field-row">
          <input className="form-input" inputMode="numeric" pattern="[0-9]*" maxLength={10} required placeholder="6-digit code" value={code} onChange={e => setCode(e.target.value)} autoComplete="one-time-code" />
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Checking…' : 'Sign in'}</button>
        </div>
      )}
      {msg && <div className="form-hint">{msg}</div>}
      <button type="button" className="field-del" style={{ marginTop: 8 }} onClick={() => { setUsePassword(u => !u); setMsg('') }}>
        {usePassword ? 'Sign in with an email code instead' : 'Sign in with a password instead'}
      </button>
    </form>
  )
}

export default function FieldLog() {
  const [session, setSession] = useState(null)
  const [records, setRecords] = useState([])
  const [form, setForm] = useState(() => blankForm([]))
  const [photos, setPhotos] = useState([])
  const [gpsMsg, setGpsMsg] = useState('')
  const [saving, setSaving] = useState(false)
  const [syncMsg, setSyncMsg] = useState('')
  const [online, setOnline] = useState(navigator.onLine)

  async function refresh(resetForm = false) {
    const recs = await listRecords()
    setRecords(recs)
    if (resetForm) setForm(blankForm(recs))
    return recs
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    refresh(true)
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { sub.subscription.unsubscribe(); window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  const pending = useMemo(() => records.filter(r => r.sync_status !== 'synced'), [records])

  // Upload automatically when the phone comes back into signal range.
  useEffect(() => {
    if (online && session && pending.length) doSync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online, session])

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }
  function toggleType(t) {
    set('sample_types', form.sample_types.includes(t) ? form.sample_types.filter(x => x !== t) : [...form.sample_types, t])
  }

  async function captureGps() {
    setGpsMsg('Getting GPS fix…')
    try {
      const f = await getFix()
      setForm(x => ({ ...x, lat: f.lat.toFixed(6), lng: f.lng.toFixed(6), gps_accuracy_m: Math.round(f.accuracy) }))
      setGpsMsg(`Fix recorded, accurate to about ${Math.round(f.accuracy)} m.`)
    } catch (e) {
      setGpsMsg(`Could not get a fix: ${e.message || e}. You can type the position instead.`)
    }
  }

  async function addPhotos(files) {
    const out = []
    for (const f of files) out.push(await compressPhoto(f))
    setPhotos(p => [...p, ...out])
  }

  async function submit(e) {
    e.preventDefault()
    if (!form.station_id.trim()) return alert('Enter a station ID.')
    if (!form.sample_types.length) return alert('Select at least one sample type.')
    setSaving(true)
    await saveRecord({
      ...form,
      client_id: newClientId(),
      station_id: form.station_id.trim().toUpperCase(),
      sampled_at: new Date(form.sampled_at).toISOString(),
      lat: form.lat === '' ? null : Number(form.lat),
      lng: form.lng === '' ? null : Number(form.lng),
      gps_accuracy_m: form.gps_accuracy_m === '' ? null : Number(form.gps_accuracy_m),
      water_temp_c: form.water_temp_c === '' ? null : Number(form.water_temp_c),
      salinity_psu: form.salinity_psu === '' ? null : Number(form.salinity_psu),
      photos,
      created_on_device: new Date().toISOString(),
    })
    setPhotos([]); setGpsMsg('')
    await refresh(true)
    setSaving(false)
    if (navigator.onLine && session) doSync()
  }

  async function doSync() {
    setSyncMsg('Uploading…')
    try {
      const n = await syncAll((d, t) => setSyncMsg(`Uploading ${d} of ${t}…`))
      const recs = await refresh()
      const errs = recs.filter(r => r.sync_status === 'error').length
      setSyncMsg(n === 0 ? 'Nothing to upload.' : errs ? `${errs} record(s) failed. Tap Upload to retry.` : 'All records uploaded.')
    } catch (e) {
      setSyncMsg(e.message || String(e))
    }
  }

  async function remove(r) {
    if (r.sync_status !== 'synced' && !confirm(`${r.station_id} has not been uploaded. Delete it from this phone?`)) return
    await deleteRecord(r.client_id)
    refresh()
  }

  return (
    <>
      <div className="page-hero">
        <div className="page">
          <div className="page-label">Field Tools</div>
          <h1 className="page-title">Station Log</h1>
          <p className="page-subtitle">
            Record each sampling station aboard R/V Dawn: GPS position, time, sample IDs, conditions and photos.
            Records are saved on this phone first and upload when you have a connection.
          </p>
        </div>
      </div>

      <div className="page">
        <CrewSignIn session={session} />

        <div className="field-status card">
          <div>
            <span className={`badge ${online ? 'badge-active' : 'badge-planning'}`}><span className="badge-dot" />{online ? 'Online' : 'Offline'}</span>
            <span style={{ marginLeft: 10, fontSize: 13, color: 'var(--text2)' }}>
              {pending.length ? `${pending.length} record(s) waiting to upload` : 'Everything on this phone is uploaded'}
            </span>
          </div>
          <button className="btn btn-primary btn-sm" disabled={!online || !session || !pending.length} onClick={doSync}>Upload now</button>
          {syncMsg && <div className="form-hint" style={{ width: '100%' }}>{syncMsg}</div>}
        </div>

        <form className="cs-form-card" onSubmit={submit}>
          <div className="form-section-title">New station</div>
          <div className="field-grid">
            <div className="form-group">
              <label className="form-label">Station ID <span>*</span></label>
              <input className="form-input" value={form.station_id} onChange={e => set('station_id', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Date and time</label>
              <input className="form-input" type="datetime-local" value={form.sampled_at} onChange={e => set('sampled_at', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Site name</label>
            <input className="form-input" placeholder="e.g. BVI, Road Town harbor entrance" value={form.site_name} onChange={e => set('site_name', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Position</label>
            <button type="button" className="btn btn-outline" onClick={captureGps}>Use phone GPS</button>
            <div className="field-grid" style={{ marginTop: 10 }}>
              <input className="form-input" inputMode="decimal" placeholder="Latitude (decimal)" value={form.lat} onChange={e => set('lat', e.target.value)} />
              <input className="form-input" inputMode="decimal" placeholder="Longitude (decimal)" value={form.lng} onChange={e => set('lng', e.target.value)} />
            </div>
            {gpsMsg && <div className="form-hint">{gpsMsg}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Samples taken <span>*</span></label>
            <div className="checkbox-group">
              {SAMPLE_TYPES.map(t => (
                <label key={t} className="checkbox-item">
                  <input type="checkbox" checked={form.sample_types.includes(t)} onChange={() => toggleType(t)} />{t}
                </label>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Bottle / sample IDs</label>
            <input className="form-input" placeholder="e.g. P-031, P-032, MP-014" value={form.bottle_ids} onChange={e => set('bottle_ids', e.target.value)} />
          </div>

          <div className="form-section-title" style={{ marginTop: 8 }}>Conditions</div>
          <div className="field-grid">
            <div className="form-group">
              <label className="form-label">Water temp (°C)</label>
              <input className="form-input" inputMode="decimal" value={form.water_temp_c} onChange={e => set('water_temp_c', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Salinity (PSU)</label>
              <input className="form-input" inputMode="decimal" value={form.salinity_psu} onChange={e => set('salinity_psu', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Sea state</label>
              <select className="form-select" value={form.sea_state} onChange={e => set('sea_state', e.target.value)}>
                {SEA_STATES.map(s => <option key={s} value={s}>{s || 'Select…'}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Weather</label>
              <input className="form-input" placeholder="e.g. Sunny, E 15 kt" value={form.weather} onChange={e => set('weather', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Photos</label>
            <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
              Take or add photos
              <input type="file" accept="image/*" capture="environment" multiple style={{ display: 'none' }}
                onChange={e => { addPhotos([...e.target.files]); e.target.value = '' }} />
            </label>
            {photos.length > 0 && (
              <div className="field-thumbs">
                {photos.map((p, i) => (
                  <div key={i} className="field-thumb">
                    <img src={URL.createObjectURL(p)} alt={`Photo ${i + 1}`} />
                    <button type="button" onClick={() => setPhotos(ps => ps.filter((_, j) => j !== i))} aria-label="Remove photo">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: 15 }} disabled={saving}>
            {saving ? 'Saving…' : 'Save station to this phone'}
          </button>
        </form>

        <div className="card" style={{ marginTop: 24 }}>
          <div className="section-title">Records on this phone</div>
          {records.length === 0 ? (
            <p className="form-hint">No stations logged yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="recent-table" style={{ minWidth: 560 }}>
                <thead><tr><th>Station</th><th>Time</th><th>Position</th><th>Samples</th><th>Status</th><th /></tr></thead>
                <tbody>
                  {records.map(r => (
                    <tr key={r.client_id}>
                      <td><span className="station-id">{r.station_id}</span><div style={{ fontSize: 12, color: 'var(--text3)' }}>{r.site_name}</div></td>
                      <td style={{ fontSize: 13 }}>{new Date(r.sampled_at).toLocaleString()}</td>
                      <td style={{ fontSize: 12, fontFamily: 'var(--font-mono)' }}>{fmtCoord(r.lat, 'N', 'S')}<br />{fmtCoord(r.lng, 'E', 'W')}</td>
                      <td style={{ fontSize: 12 }}>{(r.sample_types || []).join(', ')}{r.photos?.length ? ` · ${r.photos.length} photo(s)` : ''}</td>
                      <td>
                        <span className={`badge ${r.sync_status === 'synced' ? 'badge-complete' : r.sync_status === 'error' ? 'badge-elevated' : 'badge-planning'}`} title={r.sync_error || ''}>
                          <span className="badge-dot" />{r.sync_status === 'synced' ? 'uploaded' : r.sync_status === 'error' ? 'failed' : 'on phone'}
                        </span>
                      </td>
                      <td><button className="field-del" onClick={() => remove(r)} aria-label={`Delete ${r.station_id}`}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
