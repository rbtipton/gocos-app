import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const PAGE_SIZE = 25

const DATASETS = {
  ocean: {
    table: 'pfas_ocean', label: 'Global Marine PFAS', sublabel: 'Oceanic Waters',
    doi: '10.5281/zenodo.20262315', doiUrl: 'https://doi.org/10.5281/zenodo.20262315',
    description: 'Legacy and emerging PFAS in oceanic waters worldwide (2002–2023). 664 observations across 76 sampling locations.',
    totalRows: 664, sites: 76, compounds: 41, yearRange: '2002–2023',
    color: '#00B4D8', filterLabel: 'Ocean region', hasRegion: true, hasCoords: false, hasDepth: false,
    regions: ['ANTARCTIC','Arctic Ocean','Indian Ocean','North Atlantic Ocean','North Pacific Ocean','South Atlantic Ocean'],
    columns: ['region','location','year','compound','concentration_ng_l','type','reference'],
  },
  inland: {
    table: 'pfas_inland', label: 'Global Inland & Freshwater PFAS', sublabel: 'Rivers, Lakes & Polar Waters',
    doi: '10.5281/zenodo.20262399', doiUrl: 'https://doi.org/10.5281/zenodo.20262399',
    description: 'PFAS in rivers, lakes, surface runoff, and polar freshwaters worldwide (2006–2023). 376 observations across 11 sites.',
    totalRows: 376, sites: 11, compounds: 73, yearRange: '2006–2023',
    color: '#A29BFE', filterLabel: 'Location', hasRegion: false, hasCoords: false, hasDepth: false,
    regions: [
      'Cape Fear River, NC, USA','Faroe Islands, Denmark','Ganga River, India',
      'Greater Melbourne Area, Australia','Jiulong River (JLR), China',
      'Lake Ontario, Canada','Lake Victoria, Africa','Livingstone, Antarctica',
      'Longyearbyen, Spitsbergen, Norway','Okinawa, Japan','Rhine river, Neitherland',
    ],
    columns: ['location','year','compound','concentration_ng_l','type','reference'],
  },
  arctic: {
    table: 'pfas_arctic', label: 'Arctic & Global In-Situ PFAS', sublabel: 'Multi-Depth Field Observations',
    doi: null, doiUrl: null,
    description: 'In-situ PFAS field measurements with GPS coordinates, sampling depth, and detection limits. 5,004 observations across 73 regions (2005–2018). Sourced from 9 peer-reviewed publications.',
    totalRows: 5004, sites: 73, compounds: 29, yearRange: '2005–2018',
    color: '#55EFC4', filterLabel: 'Region (search)', hasRegion: true, hasCoords: true, hasDepth: true,
    regions: [],
    columns: ['region','lat','lon','depth_m','year','compound','concentration_ng_l','below_detection_limit','reference'],
  },
}

function downloadCSV(rows, filename) {
  if (!rows.length) return
  const keys = Object.keys(rows[0])
  const csv = [keys.join(','), ...rows.map(r => keys.map(k => JSON.stringify(r[k] ?? '')).join(','))].join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = filename; a.click()
}

export default function DataPage() {
  const [activeKey,   setActiveKey]   = useState('ocean')
  const [rows,        setRows]        = useState([])
  const [total,       setTotal]       = useState(0)
  const [page,        setPage]        = useState(0)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [sortCol,     setSortCol]     = useState('year')
  const [sortAsc,     setSortAsc]     = useState(false)
  const [filterReg,   setFilterReg]   = useState('')
  const [filterType,  setFilterType]  = useState('all')
  const [filterComp,  setFilterComp]  = useState('')
  const [yearMin,     setYearMin]     = useState('')
  const [yearMax,     setYearMax]     = useState('')
  const [depthMax,    setDepthMax]    = useState('')
  const [belowDet,    setBelowDet]    = useState('all')

  const ds = DATASETS[activeKey]

  const buildQuery = useCallback((forDownload = false) => {
    let q = supabase.from(ds.table).select('*', { count: 'exact' })
    if (filterReg) {
      if (ds.hasRegion) q = q.ilike('region', `%${filterReg}%`)
      else              q = q.ilike('location', `%${filterReg}%`)
    }
    if (filterType !== 'all' && !ds.hasCoords) q = q.ilike('type', `%${filterType}%`)
    if (filterComp)  q = q.ilike('compound', `%${filterComp}%`)
    if (yearMin)     q = q.gte('year', Number(yearMin))
    if (yearMax)     q = q.lte('year', Number(yearMax))
    if (ds.hasDepth && depthMax) q = q.lte('depth_m', Number(depthMax))
    if (ds.hasCoords && belowDet !== 'all') q = q.eq('below_detection_limit', belowDet === 'below')
    q = q.order(sortCol, { ascending: sortAsc })
    if (!forDownload) q = q.range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1)
    return q
  }, [ds, page, sortCol, sortAsc, filterReg, filterType, filterComp, yearMin, yearMax, depthMax, belowDet])

  useEffect(() => {
    let cancelled = false
    setLoading(true); setError(null)
    buildQuery().then(({ data, error: err, count }) => {
      if (cancelled) return
      if (err) { setError(err.message); setLoading(false); return }
      setRows(data || []); setTotal(count || 0); setLoading(false)
    })
    return () => { cancelled = true }
  }, [buildQuery])

  useEffect(() => { setPage(0) }, [activeKey, filterReg, filterType, filterComp, yearMin, yearMax, depthMax, belowDet])

  async function handleDownload() {
    const { data, error: err } = await buildQuery(true)
    if (err) { alert('Download failed: ' + err.message); return }
    downloadCSV(data || [], `gocos_${activeKey}_pfas.csv`)
  }

  function switchDataset(key) {
    setActiveKey(key); setFilterReg(''); setFilterType('all')
    setFilterComp(''); setYearMin(''); setYearMax(''); setDepthMax(''); setBelowDet('all'); setPage(0)
    setSortCol('year'); setSortAsc(false)
  }

  function toggleSort(col) {
    if (sortCol === col) setSortAsc(a => !a)
    else { setSortCol(col); setSortAsc(false) }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  function ColHead({ col, label }) {
    return (
      <th onClick={() => toggleSort(col)} style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
        {label} {sortCol === col ? (sortAsc ? '↑' : '↓') : ''}
      </th>
    )
  }

  return (
    <>
      <div className="page-hero">
        <div className="page">
          <div className="page-label">Open Data</div>
          <h1 className="page-title">GOCOS PFAS Dataset Repository</h1>
          <p className="page-subtitle">Peer-reviewed, openly licensed datasets. Free to download, cite, and use.</p>
        </div>
      </div>

      <div className="page">

        {/* Dataset switcher */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          {Object.entries(DATASETS).map(([key, d]) => (
            <button key={key} onClick={() => switchDataset(key)} style={{
              flex: 1, minWidth: 200, padding: '14px 18px', borderRadius: 12, cursor: 'pointer',
              border: `2px solid ${activeKey === key ? d.color : 'var(--border)'}`,
              background: activeKey === key ? `${d.color}18` : 'var(--white)',
              textAlign: 'left', transition: 'all 0.15s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>{d.label}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 6 }}>{d.sublabel}</div>
              <div style={{ display: 'flex', gap: 10, fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text3)' }}>
                <span>{d.totalRows.toLocaleString()} records</span>
                <span>{d.sites} sites</span>
                <span>{d.yearRange}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Metadata card */}
        <div className="card" style={{ marginBottom: 20, borderLeft: `4px solid ${ds.color}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div className="page-label" style={{ color: ds.color }}>
                {ds.doiUrl ? 'Published Dataset' : 'SSI Field Dataset'}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--navy)', margin: '4px 0 8px' }}>{ds.label}</div>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 8 }}>{ds.description}</p>
              {ds.doiUrl && (
                <a href={ds.doiUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: ds.color, textDecoration: 'none', fontFamily: 'var(--font-mono)', background: `${ds.color}15`, padding: '4px 10px', borderRadius: 6 }}>
                  DOI: {ds.doi} ↗
                </a>
              )}
              {ds.hasCoords && (
                <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                  {[['GPS coords','lat/lon per record'],['Depth','0–3,117m'],['Detection limits','included'],['Sources','9 peer-reviewed DOIs']].map(([k,v]) => (
                    <span key={k} style={{ fontSize: 11, fontFamily: 'var(--font-mono)', background: `${ds.color}15`, color: 'var(--text2)', padding: '3px 8px', borderRadius: 5 }}>
                      {k}: {v}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[[ds.totalRows.toLocaleString(),'records'],[ds.sites,'sites'],[ds.compounds,'compounds']].map(([v,l]) => (
                <div key={l} style={{ textAlign: 'center', background: 'var(--surface2)', borderRadius: 8, padding: '10px 14px', minWidth: 68 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: ds.color }}>{v}</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: 16, padding: '14px 20px' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 180px' }}>
              <div className="card-label" style={{ marginBottom: 4 }}>{ds.filterLabel}</div>
              {ds.regions.length > 0 ? (
                <select className="form-select" style={{ padding: '7px 10px', fontSize: 13 }}
                  value={filterReg} onChange={e => setFilterReg(e.target.value)}>
                  <option value="">All</option>
                  {ds.regions.map(r => <option key={r}>{r}</option>)}
                </select>
              ) : (
                <input className="form-input" style={{ padding: '7px 10px', fontSize: 13 }}
                  placeholder="Type to search…" value={filterReg} onChange={e => setFilterReg(e.target.value)} />
              )}
            </div>

            {!ds.hasCoords && (
              <div style={{ flex: '1 1 130px' }}>
                <div className="card-label" style={{ marginBottom: 4 }}>Compound type</div>
                <select className="form-select" style={{ padding: '7px 10px', fontSize: 13 }}
                  value={filterType} onChange={e => setFilterType(e.target.value)}>
                  <option value="all">All types</option>
                  <option value="legacy">Legacy</option>
                  <option value="emerging">Emerging</option>
                </select>
              </div>
            )}

            {ds.hasCoords && (
              <div style={{ flex: '1 1 130px' }}>
                <div className="card-label" style={{ marginBottom: 4 }}>Detection status</div>
                <select className="form-select" style={{ padding: '7px 10px', fontSize: 13 }}
                  value={belowDet} onChange={e => setBelowDet(e.target.value)}>
                  <option value="all">All readings</option>
                  <option value="detected">Detected only</option>
                  <option value="below">Below detection limit</option>
                </select>
              </div>
            )}

            <div style={{ flex: '1 1 150px' }}>
              <div className="card-label" style={{ marginBottom: 4 }}>Compound name</div>
              <input className="form-input" style={{ padding: '7px 10px', fontSize: 13 }}
                placeholder="e.g. PFOS, PFOA…" value={filterComp} onChange={e => setFilterComp(e.target.value)} />
            </div>

            <div style={{ flex: '0 1 90px' }}>
              <div className="card-label" style={{ marginBottom: 4 }}>Year from</div>
              <input className="form-input" style={{ padding: '7px 10px', fontSize: 13 }}
                type="number" placeholder={ds.yearRange.split('–')[0]} value={yearMin} onChange={e => setYearMin(e.target.value)} />
            </div>

            <div style={{ flex: '0 1 90px' }}>
              <div className="card-label" style={{ marginBottom: 4 }}>Year to</div>
              <input className="form-input" style={{ padding: '7px 10px', fontSize: 13 }}
                type="number" placeholder={ds.yearRange.split('–')[1]} value={yearMax} onChange={e => setYearMax(e.target.value)} />
            </div>

            {ds.hasDepth && (
              <div style={{ flex: '0 1 100px' }}>
                <div className="card-label" style={{ marginBottom: 4 }}>Max depth (m)</div>
                <input className="form-input" style={{ padding: '7px 10px', fontSize: 13 }}
                  type="number" placeholder="3117" value={depthMax} onChange={e => setDepthMax(e.target.value)} />
              </div>
            )}

            <button className="btn btn-outline" style={{ fontSize: 13, padding: '8px 14px' }}
              onClick={() => { setFilterReg(''); setFilterType('all'); setFilterComp(''); setYearMin(''); setYearMax(''); setDepthMax(''); setBelowDet('all') }}>
              Clear
            </button>
            <button className="btn btn-primary" style={{ fontSize: 13, padding: '8px 14px' }} onClick={handleDownload}>
              ↓ Download CSV
            </button>
          </div>
        </div>

        {/* Results bar + pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)' }}>
            {loading ? 'Loading…' : `${total.toLocaleString()} records · Page ${page + 1} of ${totalPages || 1}`}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-outline" style={{ padding: '5px 12px', fontSize: 12 }}
              disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <button className="btn btn-outline" style={{ padding: '5px 12px', fontSize: 12 }}
              disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        </div>

        {/* Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {error && (
            <div style={{ padding: 24, color: 'var(--elevated)', fontSize: 14 }}>
              Could not load data: {error}
            </div>
          )}
          {!error && (
            <div style={{ overflowX: 'auto' }}>
              <table className="recent-table" style={{ minWidth: ds.hasCoords ? 900 : 780 }}>
                <thead>
                  <tr>
                    <ColHead col="region" label={ds.hasRegion ? 'Region' : 'Location'} />
                    {!ds.hasRegion && <ColHead col="location" label="Location" />}
                    {ds.hasCoords && <><ColHead col="lat" label="Lat" /><ColHead col="lon" label="Lon" /></>}
                    {ds.hasDepth && <ColHead col="depth_m" label="Depth (m)" />}
                    <ColHead col="year" label="Year" />
                    <ColHead col="compound" label="Compound" />
                    <ColHead col="concentration_ng_l" label="Conc. (ng/L)" />
                    {ds.hasCoords && <th>Detected</th>}
                    {!ds.hasCoords && <th>Type</th>}
                    <th>Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={10} style={{ textAlign: 'center', padding: 32, color: 'var(--text3)' }}>Loading data…</td></tr>
                  )}
                  {!loading && rows.length === 0 && (
                    <tr><td colSpan={10} style={{ textAlign: 'center', padding: 32, color: 'var(--text3)' }}>No records match the current filters.</td></tr>
                  )}
                  {!loading && rows.map((r, i) => (
                    <tr key={i}>
                      <td style={{ fontSize: 12 }}>{r.region || r.location}</td>
                      {!ds.hasRegion && <td style={{ fontSize: 12 }}>{r.location}</td>}
                      {ds.hasCoords && (
                        <>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{Number(r.lat).toFixed(3)}</td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{Number(r.lon).toFixed(3)}</td>
                        </>
                      )}
                      {ds.hasDepth && <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{r.depth_m}</td>}
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{r.year}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--teal)', fontWeight: 700 }}>{r.compound}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                        {typeof r.concentration_ng_l === 'number' ? r.concentration_ng_l.toFixed(4) : r.concentration_ng_l}
                      </td>
                      {ds.hasCoords && (
                        <td>
                          <span className={`badge badge-${r.below_detection_limit ? 'moderate' : 'active'}`} style={{ fontSize: 10 }}>
                            {r.below_detection_limit ? 'Below limit' : 'Detected'}
                          </span>
                        </td>
                      )}
                      {!ds.hasCoords && (
                        <td>
                          <span className={`badge badge-${(r.type||'').includes('leg') ? 'moderate' : 'active'}`} style={{ fontSize: 10 }}>
                            {r.type}
                          </span>
                        </td>
                      )}
                      <td style={{ fontSize: 11, color: 'var(--text3)', maxWidth: 200 }}>
                        <span title={r.reference} style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>
                          {r.reference}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
          <button className="btn btn-outline" style={{ padding: '6px 16px', fontSize: 13 }}
            disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Previous</button>
          <span style={{ padding: '6px 12px', fontSize: 13, color: 'var(--text2)' }}>Page {page + 1} of {totalPages || 1}</span>
          <button className="btn btn-outline" style={{ padding: '6px 16px', fontSize: 13 }}
            disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>

        {/* Citation */}
        {ds.doiUrl && (
          <div className="card" style={{ marginTop: 24, background: 'var(--surface2)' }}>
            <div className="card-label" style={{ marginBottom: 8 }}>How to cite this dataset</div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)', lineHeight: 1.8, background: 'var(--white)', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)' }}>
              Arafin, Md Shah Nawaz. ({ds.yearRange.split('–')[1]}). {ds.label}. Zenodo. {ds.doiUrl}
            </p>
            <div style={{ marginTop: 12 }}>
              <a href={ds.doiUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: 12, padding: '6px 14px' }}>
                View on Zenodo ↗
              </a>
            </div>
          </div>
        )}
        {!ds.doiUrl && (
          <div className="card" style={{ marginTop: 24, background: 'var(--surface2)', borderLeft: `4px solid ${ds.color}` }}>
            <div className="card-label" style={{ marginBottom: 6 }}>About this dataset</div>
            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
              This dataset aggregates in-situ PFAS field measurements from 9 peer-reviewed publications. Each record includes the original source DOI in the reference column. When citing data from this dataset, please cite the original publication listed in the reference field for each record.
            </p>
          </div>
        )}

      </div>
    </>
  )
}
