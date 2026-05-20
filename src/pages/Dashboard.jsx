import { stations } from '../data/stations'

const metrics = [
  { label: 'Stations Sampled', value: '18',  unit: 'Caribbean sites', color: '#00B4D8' },
  { label: 'PFAS Records',     value: '6,040', unit: 'open dataset',    color: '#A29BFE' },
  { label: 'Days at Sea',      value: '127', unit: 'cumulative',       color: '#55EFC4' },
  { label: 'Publications',     value: '2',   unit: 'peer-reviewed',    color: '#FFA07A' },
]

const recentStations = [...stations].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)

export default function Dashboard() {
  return (
    <>
      <div className="page-hero">
        <div className="page">
          <div className="page-label">Mission Control</div>
          <h1 className="page-title">R/V Dawn — Active Operations</h1>
          <p className="page-subtitle">
            Sustainable Seas Institute research vessel. Eastern Caribbean PFAS and microplastics survey program.
          </p>
        </div>
      </div>

      <div className="page">

        {/* About GOCOS */}
        <div className="card" style={{ marginBottom: 24, borderLeft: '4px solid var(--teal)', background: 'var(--deep)', padding: '24px 28px' }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--teal)', letterSpacing: 2, marginBottom: 8 }}>
                WHAT IS GOCOS?
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--white)', marginBottom: 4, lineHeight: 1.3 }}>
                Global Ocean Contamination<br />Open-Source Ecosystem
              </div>
              <p style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.7, marginTop: 10 }}>
                GOCOS is a free, open-source platform for PFAS and microplastics monitoring across four ocean regions — Caribbean, Arctic, South Pacific, and Baltic Sea. Built by the Sustainable Seas Institute and UNC Charlotte, GOCOS makes peer-reviewed ocean contamination data freely available to researchers, island communities, and the public worldwide.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
              {[
                ['Open data',    'All datasets published on Zenodo with DOI'],
                ['Open code',    'Full source code on GitHub'],
                ['Open access',  'No login, no paywall, no fees'],
                ['Open science', 'NSF PESOSE proposal submitted'],
              ].map(([label, desc]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', marginTop: 5, flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--bright)' }}>{label}</span>
                    <span style={{ fontSize: 12, color: 'var(--text3)', marginLeft: 6 }}>{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vessel banner */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24, border: '1px solid rgba(0,180,216,0.2)' }}>
          <div style={{ background: 'var(--navy)', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--white)' }}>R/V Dawn</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bright)', marginTop: 2 }}>
                39-ft Sailing Research Vessel · Ketch Rig · MMSI 368308940
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <a href="https://sustainableseasinstitute.org/track-r-v-dawn/" target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: 'var(--teal)', color: 'var(--deep)', borderRadius: 8, textDecoration: 'none', fontWeight: 500, fontSize: 13 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--deep)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                Live Map — SSI Website ↗
              </a>
              <a href="https://www.vesselfinder.com/?mmsi=368308940" target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: 'rgba(255,255,255,0.08)', color: 'var(--bright)', borderRadius: 8, textDecoration: 'none', fontSize: 13, border: '1px solid rgba(144,224,239,0.2)' }}>
                VesselFinder ↗
              </a>
            </div>
          </div>
          <div style={{ background: 'var(--deep)', padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 20 }}>
            {[
              { label: 'Current mission', value: 'St. Martin → Dominican Republic' },
              { label: 'Mission dates',   value: 'Mid-June – July 2026' },
              { label: 'Duration',        value: '3 weeks' },
              { label: 'Ocean region',    value: 'Eastern Caribbean Sea' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 13, color: 'var(--white)', fontWeight: 500, lineHeight: 1.4 }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid-4">
          {metrics.map(m => (
            <div className="card" key={m.label} style={{ borderTop: `3px solid ${m.color}` }}>
              <div className="card-label">{m.label}</div>
              <div className="card-value">{m.value}<span className="card-unit">{m.unit}</span></div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ marginBottom: 24 }}>
          <div className="card">
            <div className="section-title">Current Mission</div>
            <table className="recent-table">
              <tbody>
                {[
                  ['Vessel',        'R/V Dawn (SSI)'],
                  ['MMSI',          '368308940'],
                  ['Mission dates', 'Mid-June – early July 2026 (3 weeks)'],
                  ['Route',         'St. Martin → BVI → USVI → Spanish VI → Puerto Rico → Dominican Republic'],
                  ['PI aboard',     'Dr. Roger Tipton'],
                  ['Objective',     'PFAS and microplastics survey — Leeward Islands'],
                  ['Ocean region',  'Eastern Caribbean Sea'],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <td style={{ color: 'var(--text3)', width: 130, fontFamily: 'var(--font-mono)', fontSize: 11 }}>{k}</td>
                    <td style={{ fontWeight: 500 }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="section-title">Program Status</div>
            {[
              { label: 'PFAS Publication',        val: 'Published',                 badge: 'complete' },
              { label: 'Microplastics Paper',      val: 'In preparation',            badge: 'active' },
              { label: 'NSF PESOSE Proposal',      val: 'Submitted',                 badge: 'active' },
              { label: 'NSF Award 2444939',        val: 'Active — Arctic sampling',  badge: 'active' },
              { label: 'South Pacific Expedition', val: 'Active — French Polynesia', badge: 'active' },
              { label: 'GOCOS Platform',           val: 'Phase 1 live',              badge: 'active' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--surface2)' }}>
                <span style={{ fontSize: 13, color: 'var(--text2)' }}>{r.label}</span>
                <span className={`badge badge-${r.badge}`}><span className="badge-dot" />{r.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-title">Station Log</div>
          <div style={{ overflowX: 'auto' }}>
            <table className="recent-table" style={{ minWidth: 600 }}>
              <thead>
                <tr>
                  <th>Station ID</th><th>Location</th><th>Date</th>
                  <th>PFAS (ng/L)</th><th>Microplastics (p/L)</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentStations.map(s => (
                  <tr key={s.id}>
                    <td><span className="station-id">{s.id}</span></td>
                    <td style={{ fontWeight: 500 }}>{s.name}</td>
                    <td>{s.date}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{s.pfas.toFixed(1)}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{s.mp.toFixed(1)}</td>
                    <td><span className={`badge badge-${s.status}`}><span className="badge-dot" />{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
