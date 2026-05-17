import { useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { stations, statusColors } from '../data/stations'

const filters = ['All', 'Low', 'Moderate', 'Elevated', 'High']

export default function MapPage() {
  const [dataLayer, setDataLayer] = useState('pfas')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  const visible = stations.filter(s =>
    statusFilter === 'All' || s.status === statusFilter.toLowerCase()
  )

  function markerColor(s) {
    if (dataLayer === 'pfas') return statusColors[s.status]
    const mp = s.mp
    if (mp < 2)  return statusColors.low
    if (mp < 4)  return statusColors.moderate
    if (mp < 7)  return statusColors.elevated
    return statusColors.high
  }

  function markerRadius(s) {
    const val = dataLayer === 'pfas' ? s.pfas : s.mp
    return Math.max(7, Math.min(18, val * 2.2))
  }

  return (
    <div className="map-page">
      <div className="map-controls">
        <span className="map-controls-label">Data layer</span>
        <div className="filter-group">
          {[['pfas', 'PFAS (ng/L)'], ['mp', 'Microplastics (p/L)']].map(([key, label]) => (
            <button
              key={key}
              className={`filter-btn ${dataLayer === key ? 'active' : ''}`}
              onClick={() => setDataLayer(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <span className="map-controls-label" style={{ marginLeft: 12 }}>Status</span>
        <div className="filter-group">
          {filters.map(f => (
            <button
              key={f}
              className={`filter-btn ${statusFilter === f ? 'active' : ''}`}
              onClick={() => setStatusFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)' }}>
          {visible.length} / {stations.length} stations
        </span>
      </div>

      <div className="map-container">
        <MapContainer
          center={[15.5, -65]}
          zoom={6}
          style={{ width: '100%', height: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com">CARTO</a>'
          />
          {visible.map(s => (
            <CircleMarker
              key={s.id}
              center={[s.lat, s.lng]}
              radius={markerRadius(s)}
              pathOptions={{
                fillColor: markerColor(s),
                fillOpacity: 0.8,
                color: '#fff',
                weight: 1.5,
              }}
              eventHandlers={{ click: () => setSelected(s) }}
            >
              <Popup>
                <div style={{ fontFamily: 'var(--font-body)', minWidth: 220 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#7B96A2', marginBottom: 4 }}>{s.id}</div>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8, color: '#1A2E3B' }}>{s.name}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 10, color: '#7B96A2', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PFAS</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: '#0D5C8E' }}>{s.pfas} ng/L</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: '#7B96A2', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Microplastics</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: '#0D5C8E' }}>{s.mp} p/L</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: '#4A6572', lineHeight: 1.5, marginBottom: 8 }}>{s.notes}</div>
                  <div style={{ fontSize: 11, color: '#7B96A2' }}>Sampled: {s.date}</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        <div className="map-legend">
          <div className="map-legend-title">
            {dataLayer === 'pfas' ? 'PFAS Level' : 'Microplastics'}
          </div>
          {[
            { label: 'Low',      color: statusColors.low },
            { label: 'Moderate', color: statusColors.moderate },
            { label: 'Elevated', color: statusColors.elevated },
            { label: 'High',     color: statusColors.high },
          ].map(l => (
            <div className="legend-row" key={l.label}>
              <div className="legend-dot" style={{ background: l.color }} />
              {l.label}
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--border)', marginTop: 8, paddingTop: 8 }}>
            <div className="legend-row" style={{ fontSize: 11, color: 'var(--text3)' }}>
              Marker size scales with concentration
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
