import { stations } from '../data/stations'

const metrics = [
  { label: 'Stations Sampled', value: '18', unit: 'sites', color: '#00B4D8' },
  { label: 'PFAS Compounds', value: '14', unit: 'analyzed', color: '#A29BFE' },
  { label: 'Days at Sea', value: '127', unit: 'cumulative', color: '#55EFC4' },
  { label: 'Publications', value: '2', unit: 'peer-reviewed', color: '#FFA07A' },
]

const recentStations = [...stations].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)

const statusColor = { low: '#00B894', moderate: '#FDCB6E', elevated: '#E17055', high: '#D63031' }

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
        <div className="vessel-banner">
          <div>
            <div className="vessel-name">R/V Dawn</div>
            <div className="vessel-sub">47-ft Sailing Research Vessel · Eastern Caribbean</div>
          </div>
          <div className="vessel-coords">
            <span>Current Position (AIS)</span>
            17.07°N, 61.80°W
          </div>
        </div>

        <div className="grid-4">
          {metrics.map(m => (
            <div className="card" key={m.label} style={{ borderTop: `3px solid ${m.color}` }}>
              <div className="card-label">{m.label}</div>
              <div className="card-value">
                {m.value}
                <span className="card-unit">{m.unit}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ marginBottom: 24 }}>
          <div className="card">
            <div className="section-title">Current Mission</div>
            <table className="recent-table">
              <tbody>
                {[
                  ['Vessel',       'R/V Dawn (SSI)'],
                  ['Current leg',  'Eastern Caribbean — Jan 2025'],
                  ['PI aboard',    'Dr. Roger Tipton'],
                  ['Objective',    'Microplastics density survey'],
                  ['Next port',    'Gustavia, St. Barts'],
                  ['Ocean region', 'Eastern Caribbean Sea'],
                  ['Dataset',      '18 stations complete'],
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
              { label: 'PFAS Publication', val: 'Published', badge: 'complete' },
              { label: 'Microplastics Paper', val: 'In preparation', badge: 'active' },
              { label: 'NSF PESOSE Proposal', val: 'Submitted', badge: 'active' },
              { label: 'NSF Award 2444939', val: 'Active — Arctic data collection', badge: 'active' },
              { label: 'GOCOS App', val: 'Phase 1 development', badge: 'active' },
              { label: 'UNC Charlotte undergrads', val: '3 students active', badge: 'active' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--surface2)' }}>
                <span style={{ fontSize: 13, color: 'var(--text2)' }}>{r.label}</span>
                <span className={`badge badge-${r.badge}`}>
                  <span className="badge-dot" />
                  {r.val}
                </span>
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
                  <th>Station ID</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>PFAS (ng/L)</th>
                  <th>Microplastics (p/L)</th>
                  <th>Status</th>
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
                    <td>
                      <span className={`badge badge-${s.status}`}>
                        <span className="badge-dot" />
                        {s.status}
                      </span>
                    </td>
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
