import { useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { stations, statusColors } from '../data/stations'

export default function MapPage() {
  const [dataLayer, setDataLayer] = useState('pfas')

  function markerColor(s) {
    return statusColors[s.status] || statusColors.pending
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
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)' }}>
          {stations.length} stations · data analysis pending
        </span>
      </div>

      <div className="map-container">
        <MapContainer
          center={[17.5, -66]}
          zoom={6}
          style={{ width: '100%', height: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com">CARTO</a>'
          />
          {stations.map(s => (
            <CircleMarker
              key={s.id}
              center={[s.lat, s.lng]}
              radius={8}
              pathOptions={{
                fillColor: markerColor(s),
                fillOpacity: 0.85,
                color: '#fff',
                weight: 1.5,
              }}
            >
              <Popup>
                <div style={{ fontFamily: 'var(--font-body)', minWidth: 220 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#7B96A2', marginBottom: 4 }}>{s.id}</div>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 10, color: '#1A2E3B' }}>{s.name}</div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 10, color: '#7B96A2', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PFAS</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: '#74B9FF' }}>
                        {s.pfas !== null ? `${s.pfas} ng/L` : 'Pending'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: '#7B96A2', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Microplastics</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: '#74B9FF' }}>
                        {s.mp !== null ? `${s.mp} p/L` : 'Pending'}
                      </div>
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
          <div className="map-legend-title">Station status</div>
          {[
            { label: 'Data pending',  color: statusColors.pending },
            { label: 'Low',           color: statusColors.low },
            { label: 'Moderate',      color: statusColors.moderate },
            { label: 'Elevated',      color: statusColors.elevated },
            { label: 'High',          color: statusColors.high },
          ].map(l => (
            <div className="legend-row" key={l.label}>
              <div className="legend-dot" style={{ background: l.color }} />
              {l.label}
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--border)', marginTop: 8, paddingTop: 8, fontSize: 11, color: 'var(--text3)', lineHeight: 1.5 }}>
            PFAS and microplastics<br />analysis in progress
          </div>
        </div>
      </div>
    </div>
  )
}

