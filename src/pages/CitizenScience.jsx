import { useState } from 'react'

const observationTypes = [
  'Unusual color or discoloration',
  'Foam or froth on surface',
  'Visible floating debris',
  'Plastic particles or film',
  'Unusual odor',
  'Oil sheen',
  'Algal bloom or green water',
  'Dead fish or marine life',
  'Other anomaly',
]

const islands = [
  'Antigua and Barbuda', 'Bahamas', 'Barbados', 'Dominica', 'Grenada',
  'Guadeloupe', 'Jamaica', 'Martinique', 'Puerto Rico', 'St. Barts',
  'St. Kitts and Nevis', 'St. Lucia', 'St. Maarten', 'St. Vincent and the Grenadines',
  'Trinidad and Tobago', 'USVI — St. Thomas', 'USVI — St. John', 'USVI — St. Croix',
  'Other',
]

export default function CitizenScience() {
  const [form, setForm] = useState({
    island: '', location: '', observations: [], severity: '', description: '', anonymous: true,
    name: '', email: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  function toggleObs(type) {
    set('observations', form.observations.includes(type)
      ? form.observations.filter(o => o !== type)
      : [...form.observations, type]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.island || form.observations.length === 0) {
      alert('Please select a location and at least one observation type.')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="page">
        <div className="success-banner">
          <div className="success-icon">🌊</div>
          <div className="success-title">Observation Submitted</div>
          <p className="success-sub" style={{ margin: '8px auto', maxWidth: 440 }}>
            Thank you for contributing to GOCOS. Your observation from {form.island} has been recorded.
            SSI researchers will review it and may follow up with a sampling visit to your location.
          </p>
          <button
            className="btn btn-primary"
            style={{ margin: '20px auto 0', display: 'flex' }}
            onClick={() => { setSubmitted(false); setForm({ island: '', location: '', observations: [], severity: '', description: '', anonymous: true, name: '', email: '' }) }}
          >
            Submit Another Observation
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="page-hero">
        <div className="page">
          <div className="page-label">Citizen Science</div>
          <h1 className="page-title">Report a Water Quality Observation</h1>
          <p className="page-subtitle">
            Island residents, fishers, and coastal community members: your observations help SSI prioritize sampling locations across the Caribbean.
          </p>
        </div>
      </div>

      <div className="page">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
          <form className="cs-form-card" onSubmit={handleSubmit}>

            <div className="form-section-title">1. Location</div>
            <div className="form-group">
              <label className="form-label">Island / Territory <span>*</span></label>
              <select className="form-select" value={form.island} onChange={e => set('island', e.target.value)}>
                <option value="">Select your island...</option>
                {islands.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Specific Location</label>
              <input
                className="form-input"
                placeholder="e.g. North beach near the marina, or GPS coordinates"
                value={form.location}
                onChange={e => set('location', e.target.value)}
              />
              <div className="form-hint">As precise as you can be — a beach name, bay name, or approximate GPS helps SSI respond faster.</div>
            </div>

            <div className="form-section-title" style={{ marginTop: 8 }}>2. What Did You Observe?</div>
            <div className="form-group">
              <label className="form-label">Observation type <span>*</span> (select all that apply)</label>
              <div className="checkbox-group">
                {observationTypes.map(type => (
                  <label className="checkbox-item" key={type}>
                    <input
                      type="checkbox"
                      checked={form.observations.includes(type)}
                      onChange={() => toggleObs(type)}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Severity</label>
              <select className="form-select" value={form.severity} onChange={e => set('severity', e.target.value)}>
                <option value="">Select severity...</option>
                <option value="minor">Minor — small area, limited impact</option>
                <option value="moderate">Moderate — noticeable area, some impact</option>
                <option value="severe">Severe — large area or significant impact</option>
                <option value="unsure">Not sure</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Describe what you saw, smelled, or noticed. Include any details about the time of day, weather conditions, or recent activity nearby."
                value={form.description}
                onChange={e => set('description', e.target.value)}
                rows={4}
              />
            </div>

            <div className="form-section-title" style={{ marginTop: 8 }}>3. Photo (Optional)</div>
            <div className="form-group">
              <div className="upload-zone">
                <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>Tap to add a photo</div>
                <div style={{ fontSize: 12 }}>Photo upload will be available in the next update</div>
              </div>
            </div>

            <div className="form-section-title" style={{ marginTop: 8 }}>4. Contact (Optional)</div>
            <div className="form-group">
              <div className="toggle-row">
                <div>
                  <div className="toggle-label">Submit anonymously</div>
                  <div className="toggle-sub">Your identity will not be stored with this observation.</div>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={form.anonymous} onChange={e => set('anonymous', e.target.checked)} />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>

            {!form.anonymous && (
              <>
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input className="form-input" placeholder="First name or full name" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email (for follow-up)</label>
                  <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
                  <div className="form-hint">SSI will only contact you if researchers plan to sample near your location.</div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '14px', fontSize: 15 }}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Observation to GOCOS'}
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card" style={{ borderLeft: '3px solid var(--teal)' }}>
              <div className="card-label">Why This Matters</div>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginTop: 8 }}>
                SSI cannot sample everywhere. Your eyes on the water help researchers identify where to deploy the vessel next. Every observation is reviewed by SSI scientists.
              </p>
            </div>
            <div className="card">
              <div className="card-label">Privacy</div>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginTop: 8 }}>
                Anonymous observations are stored without any identifying information. Contact details, if provided, are never shared outside SSI and are used only for follow-up.
              </p>
            </div>
            <div className="card">
              <div className="card-label">What Happens Next</div>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginTop: 8 }}>
                Your observation enters a review queue. SSI researchers assess the report and may add the location to an upcoming R/V Dawn expedition. Aggregate findings appear on the contamination map.
              </p>
            </div>
            <div className="card" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)', lineHeight: 1.8 }}>
              <div style={{ marginBottom: 4, color: 'var(--teal)' }}>GOCOS — Open Science</div>
              Observations contribute to the open GOCOS dataset. Anonymized aggregate data is publicly available via the GOCOS REST API. No individual records are shared.
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
