import { useState } from 'react'
import { projects, themes } from '../data/projects'

const allThemes = ['all', ...Object.keys(themes)]

export default function Portfolio() {
  const [activeTheme, setActiveTheme] = useState('all')

  const visible = activeTheme === 'all'
    ? projects
    : projects.filter(p => p.theme === activeTheme)

  const counts = Object.fromEntries(
    Object.keys(themes).map(t => [t, projects.filter(p => p.theme === t).length])
  )

  return (
    <>
      <div className="page-hero">
        <div className="page">
          <div className="page-label">Research Portfolio</div>
          <h1 className="page-title">18-Project SSI Research Program</h1>
          <p className="page-subtitle">
            Spanning PFAS, microplastics, biodiversity, technology, and ocean education across the Caribbean and beyond.
          </p>
        </div>
      </div>

      <div className="page">
        <div className="portfolio-filters">
          <button
            className={`filter-btn ${activeTheme === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTheme('all')}
          >
            All ({projects.length})
          </button>
          {Object.entries(themes).map(([key, t]) => (
            <button
              key={key}
              className={`filter-btn ${activeTheme === key ? 'active' : ''}`}
              onClick={() => setActiveTheme(key)}
              style={activeTheme === key ? {} : { borderColor: t.color + '66' }}
            >
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: t.color, marginRight: 6 }} />
              {t.label} ({counts[key]})
            </button>
          ))}
        </div>

        <div className="grid-3">
          {visible.map(p => (
            <div className={`project-card theme-${p.theme}`} key={p.id}>
              <div className="project-stripe" style={{ background: themes[p.theme].color }} />
              <div className="project-body">
                <div className="project-number">Project {p.id} · {themes[p.theme].label}</div>
                <div className="project-title">{p.title}</div>
                <div className="project-desc">{p.desc}</div>

                {p.status !== 'proposed' && (
                  <div style={{ marginBottom: 12 }}>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${p.progress}%`, background: themes[p.theme].color }} />
                    </div>
                    <div className="progress-label">{p.progress}% complete</div>
                  </div>
                )}

                <div className="project-footer">
                  <span className={`badge badge-${p.status}`}>
                    <span className="badge-dot" />
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
