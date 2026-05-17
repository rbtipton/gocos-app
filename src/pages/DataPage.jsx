import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

const oceanRegions = [
  'North Pacific Ocean',
  'North Atlantic Ocean',
  'South Atlantic Ocean',
  'Arctic Ocean',
  'Indian Ocean',
  'ANTARCTIC',
]

const inlandLocations = [
  'Cape Fear River NC USA',
  'Rhine river Neitherland',
  'Faroe Islands Denmark',
  'Okinawa Japan',
  'Ganga River India',
  'Jiulong River JLR China',
  'Greater Melbourne Area Australia',
  'Lake Victoria Africa',
  'Lake Ontario Canada',
  'Longyearbyen Spitsbergen Norway',
  'Livingstone Antarctica',
]

const compoundTypes = ['legacy', 'emerging']
const pageSize = 25

const sortColumns = [
  { key: 'location', label: 'Region / Location' },
  { key: 'year', label: 'Year' },
  { key: 'compound', label: 'Compound' },
  { key: 'concentration_ng_l', label: 'Concentration (ng/L)' },
  { key: 'type', label: 'Type' },
  { key: 'reference', label: 'Reference' },
]

function csvEscape(value) {
  if (value === null || value === undefined) return ''
  const stringValue = String(value)
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

function buildQuery(query, dataset, filterReg) {
  if (!filterReg) return query
  if (dataset === 'pfas_ocean') {
    return query.eq('region', filterReg)
  }
  return query.ilike('location', filterReg)
}

export default function DataPage() {
  const [dataset, setDataset] = useState('pfas_ocean')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [sortBy, setSortBy] = useState('year')
  const [sortDir, setSortDir] = useState('desc')
  const [locationFilter, setLocationFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [compoundSearch, setCompoundSearch] = useState('')
  const [yearMin, setYearMin] = useState('')
  const [yearMax, setYearMax] = useState('')
  const [downloadLoading, setDownloadLoading] = useState(false)

  const isOcean = dataset === 'pfas_ocean'
  const locationField = isOcean ? 'region' : 'location'
  const locationOptions = isOcean ? oceanRegions : inlandLocations
  const datasetLabel = isOcean ? 'Ocean PFAS' : 'Inland PFAS'

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const activeFilters = useMemo(() => ({
    dataset,
    locationFilter,
    typeFilter,
    compoundSearch,
    yearMin,
    yearMax,
    sortBy,
    sortDir,
    page,
  }), [dataset, locationFilter, typeFilter, compoundSearch, yearMin, yearMax, sortBy, sortDir, page])

  useEffect(() => {
    setPage(1)
  }, [dataset, locationFilter, typeFilter, compoundSearch, yearMin, yearMax])

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(null)

      try {
        const orderField = sortBy === 'location' ? locationField : sortBy
        let query = supabase
          .from(dataset)
          .select('*', { count: 'exact' })
          .order(orderField, { ascending: sortDir === 'asc' })
          .range((page - 1) * pageSize, page * pageSize - 1)

        if (locationFilter) {
          query = buildQuery(query, dataset, locationFilter)
        }
        if (typeFilter) {
          query = query.eq('type', typeFilter)
        }
        if (compoundSearch) {
          query = query.ilike('compound', `%${compoundSearch}%`)
        }
        if (yearMin) {
          query = query.gte('year', Number(yearMin))
        }
        if (yearMax) {
          query = query.lte('year', Number(yearMax))
        }

        const { data, error: queryError, count } = await query
        if (queryError) throw queryError

        setRows(data ?? [])
        setTotal(count ?? 0)
      } catch (err) {
        setError(err.message || 'Failed to load data')
        setRows([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [dataset, locationFilter, typeFilter, compoundSearch, yearMin, yearMax, sortBy, sortDir, page, locationField])

  async function downloadCsv() {
    setDownloadLoading(true)
    setError(null)

    try {
      const orderField = sortBy === 'location' ? locationField : sortBy
      let query = supabase
        .from(dataset)
        .select('*')
        .order(orderField, { ascending: sortDir === 'asc' })

      if (locationFilter) {
        query = buildQuery(query, dataset, locationFilter)
      }
      if (typeFilter) {
        query = query.eq('type', typeFilter)
      }
      if (compoundSearch) {
        query = query.ilike('compound', `%${compoundSearch}%`)
      }
      if (yearMin) {
        query = query.gte('year', Number(yearMin))
      }
      if (yearMax) {
        query = query.lte('year', Number(yearMax))
      }

      const { data: allRows, error: downloadError } = await query
      if (downloadError) throw downloadError

      const outputRows = allRows ?? []
      const headers = [locationField, 'year', 'compound', 'concentration_ng_l', 'type', 'reference']
      const csv = [headers.join(',')]
        .concat(
          outputRows.map(row => csvEscape(row[locationField]) + ',' +
            csvEscape(row.year) + ',' +
            csvEscape(row.compound) + ',' +
            csvEscape(row.concentration_ng_l) + ',' +
            csvEscape(row.type) + ',' +
            csvEscape(row.reference))
        )
        .join('\n')

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${dataset}-export.csv`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err.message || 'Download failed')
    } finally {
      setDownloadLoading(false)
    }
  }

  function toggleSort(column) {
    if (sortBy === column) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortBy(column)
    setSortDir('asc')
  }

  return (
    <>
      <div className="page-hero">
        <div className="page">
          <div className="page-label">Data Browser</div>
          <h1 className="page-title">PFAS Dataset Explorer</h1>
          <p className="page-subtitle">
            Browse ocean and inland PFAS monitoring records, filter by region, compound type, year range, and download the filtered dataset as CSV.
          </p>
        </div>
      </div>

      <div className="page">
        <div className="grid-2" style={{ marginBottom: 24 }}>
          <div className="card">
            <div className="section-title">Dataset</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`btn ${dataset === 'pfas_ocean' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setDataset('pfas_ocean')}
              >
                Ocean
              </button>
              <button
                type="button"
                className={`btn ${dataset === 'pfas_inland' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setDataset('pfas_inland')}
              >
                Inland
              </button>
            </div>
            <p className="form-hint" style={{ marginTop: 14 }}>
              Viewing <strong>{datasetLabel}</strong> records. Use the filters to narrow the dataset.
            </p>
          </div>

          <div className="card">
            <div className="section-title">Download</div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={downloadCsv}
              disabled={downloadLoading}
            >
              {downloadLoading ? 'Generating CSV…' : 'Download CSV'}
            </button>
            <p className="form-hint" style={{ marginTop: 14 }}>
              Export all filtered records from the selected dataset.
            </p>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <div className="section-title">Filters</div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">{isOcean ? 'Region' : 'Location'}</label>
              <select
                className="form-select"
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
              >
                <option value="">All</option>
                {locationOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Compound Type</label>
              <select
                className="form-select"
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
              >
                <option value="">All</option>
                {compoundTypes.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Compound Name</label>
              <input
                className="form-input"
                type="text"
                value={compoundSearch}
                onChange={e => setCompoundSearch(e.target.value)}
                placeholder="Search compound name"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Year Min</label>
              <input
                className="form-input"
                type="number"
                min="1900"
                max="2100"
                value={yearMin}
                onChange={e => setYearMin(e.target.value)}
                placeholder="e.g. 2020"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Year Max</label>
              <input
                className="form-input"
                type="number"
                min="1900"
                max="2100"
                value={yearMax}
                onChange={e => setYearMax(e.target.value)}
                placeholder="e.g. 2025"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-title">Dataset Table</div>
          {error && (
            <div className="badge badge-proposed" style={{ marginBottom: 16 }}>{error}</div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--text3)' }}>
              Showing {rows.length} / {total} filtered records
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn btn-outline" type="button" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1 || loading}>
                Previous
              </button>
              <button className="btn btn-outline" type="button" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages || loading}>
                Next
              </button>
              <span style={{ fontSize: 13, color: 'var(--text3)' }}>
                Page {page} of {totalPages}
              </span>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="recent-table" style={{ minWidth: 920 }}>
              <thead>
                <tr>
                  {sortColumns.map(column => (
                    <th
                      key={column.key}
                      style={{ cursor: 'pointer' }}
                      onClick={() => toggleSort(column.key)}
                    >
                      {column.label}
                      {sortBy === column.key ? ` ${sortDir === 'asc' ? '▲' : '▼'}` : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={sortColumns.length} style={{ padding: 24, color: 'var(--text3)' }}>
                      Loading data...
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={sortColumns.length} style={{ padding: 24, color: 'var(--text3)' }}>
                      No rows found for the selected filters.
                    </td>
                  </tr>
                ) : rows.map((row, index) => (
                  <tr key={`${row.id ?? row.reference ?? index}-${index}`}>
                    <td>{(isOcean ? row.region : row.location) ?? '-'}</td>
                    <td>{row.year ?? '-'}</td>
                    <td>{row.compound ?? '-'}</td>
                    <td>{row.concentration_ng_l ?? '-'}</td>
                    <td>{row.type ?? '-'}</td>
                    <td>{row.reference ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ marginTop: 24 }}>
          <div className="section-title">Citation</div>
          <p style={{ color: 'var(--text2)', lineHeight: 1.7 }}>
            Ocean dataset DOI <a href="https://doi.org/10.5281/zenodo.20262315" target="_blank" rel="noreferrer">10.5281/zenodo.20262315</a><br />
            Inland dataset DOI <a href="https://doi.org/10.5281/zenodo.20262399" target="_blank" rel="noreferrer">10.5281/zenodo.20262399</a>
          </p>
        </div>
      </div>
    </>
  )
}
