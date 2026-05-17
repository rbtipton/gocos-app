const topics = [
  {
    icon: '⚗️',
    tag: 'Contaminants',
    title: 'What is PFAS?',
    color: '#00B4D8',
    stat: { num: '14,000+', label: 'known PFAS compounds worldwide' },
    content: [
      'PFAS — per- and polyfluoroalkyl substances — are a family of more than 14,000 synthetic chemicals that have been manufactured and used in industry and consumer products since the 1940s. They are found in non-stick cookware, waterproof clothing, food packaging, firefighting foam, and hundreds of other applications.',
      'Because their carbon-fluorine bond is one of the strongest in chemistry, PFAS do not break down naturally in the environment or in the human body. They are known as "forever chemicals." PFAS accumulate over time in soil, groundwater, surface water, and ocean water, where they can persist for decades to centuries.',
      'In Caribbean island communities, PFAS enter nearshore waters through stormwater runoff, airport firefighting foam, and atmospheric deposition. SSI\'s research is the first systematic survey of PFAS in Caribbean surface waters, establishing the baselines needed to understand contamination trends over time.',
    ],
  },
  {
    icon: '🔬',
    tag: 'Contaminants',
    title: 'What are Microplastics?',
    color: '#A29BFE',
    stat: { num: '5.25 trillion', label: 'plastic particles estimated in global oceans' },
    content: [
      'Microplastics are plastic fragments smaller than 5 millimeters — ranging from visible flakes down to particles smaller than a grain of sand. They enter the ocean through the breakdown of larger plastic debris, synthetic textile washing, tire wear particles, and industrial manufacturing.',
      'In the Caribbean, microplastics accumulate through a combination of island-generated coastal runoff, container ship activity, and transport from the Atlantic subtropical gyre. Remote islands with no local plastic industry can still show elevated microplastics concentrations due to long-range transport.',
      'SSI\'s manta trawl sampling protocol captures surface microplastics across a standardized transect. Particle size, color, and polymer type are analyzed by Fourier Transform Infrared Spectroscopy (FTIR), allowing SSI to identify plastic sources by polymer signature.',
    ],
  },
  {
    icon: '🌊',
    tag: 'Ocean Science',
    title: 'Caribbean Ocean Science',
    color: '#55EFC4',
    stat: { num: '2.75 million km²', label: 'Caribbean Sea surface area' },
    content: [
      'The Caribbean Sea is a semi-enclosed tropical ocean basin bounded by the Lesser Antilles island arc to the east, Central America to the west, South America to the south, and Cuba and Hispaniola to the north. Its waters are warm, clear, and biologically rich — home to some of the most diverse coral reef ecosystems on Earth.',
      'The Eastern Caribbean island arc consists of volcanic islands formed by the subduction of the Atlantic tectonic plate beneath the Caribbean plate. Each island sits within a unique oceanographic setting shaped by the North Equatorial Current, trade wind patterns, and the influence of river outflow from South America\'s Orinoco basin.',
      'For Caribbean island communities, the ocean is both a resource and a risk. Subsistence fishing, recreation, tourism, and drinking water desalination all depend on ocean health. SSI\'s research directly serves these communities by generating contamination data that island environmental agencies need but lack the vessels and resources to collect independently.',
    ],
  },
  {
    icon: '💻',
    tag: 'Platform',
    title: 'The GOCOS Platform',
    color: '#FFA07A',
    stat: { num: '4 ocean regions', label: 'in the GOCOS dataset' },
    content: [
      'GOCOS — the Global Ocean Contamination Open-Source Ecosystem — is a four-layer open-source software and data platform being developed by SSI and UNC Charlotte under the NSF PESOSE program. The four layers are: a mobile application, a REST API, a four-ocean scientific dataset, and an open-source ocean transport model repository.',
      'The GOCOS dataset spans four oceanographically distinct regions: the Eastern Caribbean (SSI core program, 18 stations, peer-reviewed and published), the central Arctic Ocean (NSF Award 2444939, 16 trans-polar stations from Norway to Alaska at depths to 500 feet), the Baltic Sea (Science in the Wild, November 2026), and the South Pacific in French Polynesia (Science in the Wild, 2026).',
      'The citizen science module — which this Submit page is the first version of — enables island residents, fishers, teachers, and coastal community members to contribute water quality observations that feed the same open dataset used by peer researchers worldwide. GOCOS is the infrastructure layer that makes all four ocean datasets usable, interoperable, and extendable.',
    ],
  },
]

export default function Education() {
  return (
    <>
      <div className="page-hero">
        <div className="page">
          <div className="page-label">Ocean Science Education</div>
          <h1 className="page-title">Understanding Ocean Contamination</h1>
          <p className="page-subtitle">
            Plain-language science from SSI researchers aboard R/V Dawn.
          </p>
        </div>
      </div>

      <div className="page">
        <div className="edu-grid">
          {topics.map(t => (
            <div className="edu-card" key={t.title}>
              <div className="edu-card-header" style={{ borderBottom: `3px solid ${t.color}` }}>
                <div className="edu-card-icon">{t.icon}</div>
                <div className="edu-card-tag">{t.tag}</div>
                <div className="edu-card-title">{t.title}</div>
              </div>
              <div className="edu-card-body">
                {t.content.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
                <div className="edu-stat">
                  <span className="edu-stat-num" style={{ color: t.color }}>{t.stat.num}</span>
                  <span className="edu-stat-label">{t.stat.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: 24, borderLeft: '4px solid var(--teal)' }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <div className="page-label" style={{ color: 'var(--teal)' }}>Open Science</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--navy)', marginBottom: 6 }}>
                SSI data is free and open access
              </div>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>
                All PFAS and microplastics data collected by SSI is made publicly available in peer-reviewed publications and, through GOCOS, via open API. Island environmental agencies, researchers, and the public can access station data at no cost. This is a core SSI commitment.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
              {[
                ['Published stations', '18'],
                ['PFAS compounds tested', '14'],
                ['Microplastics samples', '18'],
                ['Arctic stations (NSF)', '16'],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 24, padding: '6px 12px', background: 'var(--surface2)', borderRadius: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--text2)' }}>{label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--teal)' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
