export const stations = [
  // ── St. Maarten / St. Barts ───────────────────────────────────────────
  { id: 'CST-017', name: 'St. Maarten — Philipsburg',         lat: 18.02, lng: -63.06, pfas: null, mp: null, status: 'pending', date: '2025-01-08', notes: 'Data collection complete. Analysis pending.' },
  { id: 'CST-018', name: 'St. Barts — Gustavia',              lat: 17.90, lng: -62.85, pfas: null, mp: null, status: 'pending', date: '2025-01-10', notes: 'Data collection complete. Analysis pending.' },

  // ── Lesser Antilles ───────────────────────────────────────────────────
  { id: 'CST-001', name: 'St. Kitts — Basseterre',            lat: 17.30, lng: -62.73, pfas: null, mp: null, status: 'pending', date: '2024-09-15', notes: 'Data collection complete. Analysis pending.' },
  { id: 'CST-002', name: "Antigua — St. John's",              lat: 17.07, lng: -61.80, pfas: null, mp: null, status: 'pending', date: '2024-09-17', notes: 'Data collection complete. Analysis pending.' },
  { id: 'CST-003', name: 'Guadeloupe — Pointe-à-Pitre',       lat: 16.27, lng: -61.58, pfas: null, mp: null, status: 'pending', date: '2024-09-20', notes: 'Data collection complete. Analysis pending.' },
  { id: 'CST-004', name: 'Dominica — Roseau',                 lat: 15.41, lng: -61.37, pfas: null, mp: null, status: 'pending', date: '2024-10-02', notes: 'Data collection complete. Analysis pending.' },
  { id: 'CST-005', name: 'Martinique — Fort-de-France',       lat: 14.68, lng: -61.02, pfas: null, mp: null, status: 'pending', date: '2024-10-05', notes: 'Data collection complete. Analysis pending.' },
  { id: 'CST-006', name: 'St. Lucia — Castries',              lat: 13.90, lng: -60.98, pfas: null, mp: null, status: 'pending', date: '2024-10-08', notes: 'Data collection complete. Analysis pending.' },

  // ── British Virgin Islands ────────────────────────────────────────────
  { id: 'CST-019', name: 'BVI — Jost Van Dyke',               lat: 18.46, lng: -64.75, pfas: null, mp: null, status: 'pending', date: '2026-06-20', notes: '2026 mission. Sample collected. Analysis pending.' },
  { id: 'CST-020', name: 'BVI — Spanish Town, Virgin Gorda',  lat: 18.46, lng: -64.43, pfas: null, mp: null, status: 'pending', date: '2026-06-21', notes: '2026 mission. Sample collected. Analysis pending.' },

  // ── US Virgin Islands ─────────────────────────────────────────────────
  { id: 'CST-011', name: 'USVI — St. Thomas',                 lat: 18.34, lng: -64.93, pfas: null, mp: null, status: 'pending', date: '2024-11-03', notes: 'Data collection complete. Analysis pending.' },
  { id: 'CST-012', name: 'USVI — St. John',                   lat: 18.33, lng: -64.73, pfas: null, mp: null, status: 'pending', date: '2024-11-05', notes: 'Data collection complete. Analysis pending.' },
  { id: 'CST-013', name: 'USVI — St. Croix',                  lat: 17.73, lng: -64.74, pfas: null, mp: null, status: 'pending', date: '2024-11-07', notes: 'Data collection complete. Analysis pending.' },

  // ── Puerto Rico ───────────────────────────────────────────────────────
  { id: 'CST-014', name: 'Puerto Rico — San Juan',            lat: 18.47, lng: -66.12, pfas: null, mp: null, status: 'pending', date: '2024-11-10', notes: 'Data collection complete. Analysis pending.' },
  { id: 'CST-015', name: 'Puerto Rico — Ponce',               lat: 17.99, lng: -66.61, pfas: null, mp: null, status: 'pending', date: '2024-11-12', notes: 'Data collection complete. Analysis pending.' },

  // ── Bahamas ───────────────────────────────────────────────────────────
  { id: 'CST-016', name: 'Bahamas — Nassau',                  lat: 25.08, lng: -77.34, pfas: null, mp: null, status: 'pending', date: '2024-12-01', notes: 'Data collection complete. Analysis pending.' },
]

export const statusColors = {
  low:      '#00B894',
  moderate: '#FDCB6E',
  elevated: '#E17055',
  high:     '#D63031',
  pending:  '#74B9FF',
}
