export default function Privacy() {
  const h = { fontSize: 18, margin: '28px 0 8px', color: 'var(--navy)' }
  const p = { fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 10 }
  return (
    <>
      <div className="page-hero">
        <div className="page">
          <div className="page-label">GOCOS</div>
          <h1 className="page-title">Privacy Policy</h1>
          <p className="page-subtitle">Last updated October 30, 2026</p>
        </div>
      </div>
      <div className="page" style={{ maxWidth: 780 }}>
        <p style={p}>
          GOCOS (Global Ocean Contamination Open-Source Ecosystem) is operated by the Sustainable Seas Institute (SSI),
          a 501(c)(3) nonprofit, with UNC Charlotte. This policy covers the GOCOS website and the GOCOS apps for iPhone and Android.
        </p>

        <h2 style={h}>Public use</h2>
        <p style={p}>
          Browsing the dashboard, map, research portfolio, datasets and education pages requires no account. GOCOS does not
          use advertising, does not use third-party analytics or tracking, and does not sell or share personal information.
        </p>

        <h2 style={h}>Observation reports</h2>
        <p style={p}>
          If you submit a water quality observation, we receive the location and observation details you enter. Your name and
          email are collected only if you choose not to report anonymously, and are used only to follow up on your report.
        </p>

        <h2 style={h}>Field tools for SSI crew</h2>
        <p style={p}>
          The Station Log is for SSI research crew. Crew sign in with an email address on SSI's crew list. When a crew member logs
          a sampling station, the app records the information they enter, the phone's GPS position (only when they tap
          "Use phone GPS"), and any photos they take. Records are stored on the phone until uploaded, then stored securely with
          our database provider (Supabase) and used for scientific research. The app does not track location in the background.
        </p>

        <h2 style={h}>Device permissions</h2>
        <p style={p}>
          Location: used only to record a sampling station's position when requested. Camera and photos: used only to attach
          photos to a station record. You can decline or withdraw these permissions in your phone's settings; the rest of the app keeps working.
        </p>

        <h2 style={h}>Data on your device</h2>
        <p style={p}>
          The app stores copies of public datasets and map tiles on your device so they work offline. Unsent station records are kept
          on the device until uploaded or deleted. Uninstalling the app removes this stored data.
        </p>

        <h2 style={h}>Published research data</h2>
        <p style={p}>
          Scientific results derived from field samples (for example PFAS concentrations at a station) may be published openly,
          including on Zenodo. Published datasets do not include crew email addresses or personal information.
        </p>

        <h2 style={h}>Children</h2>
        <p style={p}>GOCOS is a general-audience educational resource and does not knowingly collect personal information from children.</p>

        <h2 style={h}>Contact and deletion requests</h2>
        <p style={p}>
          To ask about your information or request deletion, contact SSI through{' '}
          <a href="https://sustainableseasinstitute.org" target="_blank" rel="noopener noreferrer">sustainableseasinstitute.org</a>.
        </p>
      </div>
    </>
  )
}
