export const stations = [
  { id: 'CST-001', name: 'St. Kitts — Basseterre', lat: 17.30, lng: -62.73, pfas: 0.8,  mp: 1.2, status: 'low',      date: '2024-09-15', notes: 'Background levels. Reference station.' },
  { id: 'CST-002', name: 'Antigua — St. John\'s',   lat: 17.07, lng: -61.80, pfas: 1.4,  mp: 2.8, status: 'moderate', date: '2024-09-17', notes: 'Nearshore marina proximity detected.' },
  { id: 'CST-003', name: 'Guadeloupe — Pointe-à-Pitre', lat: 16.27, lng: -61.58, pfas: 2.1, mp: 4.1, status: 'moderate', date: '2024-09-20', notes: 'Industrial port influence noted.' },
  { id: 'CST-004', name: 'Dominica — Roseau',       lat: 15.41, lng: -61.37, pfas: 0.6,  mp: 0.9, status: 'low',      date: '2024-10-02', notes: 'Pristine volcanic island. Lowest PFAS in survey.' },
  { id: 'CST-005', name: 'Martinique — Fort-de-France', lat: 14.68, lng: -61.02, pfas: 3.2, mp: 5.7, status: 'elevated', date: '2024-10-05', notes: 'Airport and military base proximity.' },
  { id: 'CST-006', name: 'St. Lucia — Castries',    lat: 13.90, lng: -60.98, pfas: 1.8,  mp: 3.2, status: 'moderate', date: '2024-10-08', notes: 'Cruise ship port activity.' },
  { id: 'CST-007', name: 'St. Vincent — Kingstown', lat: 13.25, lng: -61.20, pfas: 0.9,  mp: 1.5, status: 'low',      date: '2024-10-11', notes: 'Low contamination consistent with limited industrial activity.' },
  { id: 'CST-008', name: 'Barbados — Bridgetown',   lat: 13.19, lng: -59.54, pfas: 4.7,  mp: 7.3, status: 'elevated', date: '2024-10-14', notes: 'High shipping traffic. PFAS foam firefighting agent signatures.' },
  { id: 'CST-009', name: 'Grenada — St. George\'s', lat: 12.11, lng: -61.68, pfas: 1.1,  mp: 2.0, status: 'low',      date: '2024-10-17', notes: 'Spice island. Low contamination baseline.' },
  { id: 'CST-010', name: 'Trinidad — Port of Spain', lat: 10.65, lng: -61.52, pfas: 5.9,  mp: 9.2, status: 'high',     date: '2024-10-20', notes: 'Petroleum and industrial complex. Highest PFAS in survey.' },
  { id: 'CST-011', name: 'USVI — St. Thomas',       lat: 18.34, lng: -64.93, pfas: 2.4,  mp: 3.8, status: 'moderate', date: '2024-11-03', notes: 'Major tourism hub. Moderate contamination.' },
  { id: 'CST-012', name: 'USVI — St. John',         lat: 18.33, lng: -64.73, pfas: 0.7,  mp: 1.1, status: 'low',      date: '2024-11-05', notes: 'National Park waters. Low contamination.' },
  { id: 'CST-013', name: 'USVI — St. Croix',        lat: 17.73, lng: -64.74, pfas: 1.6,  mp: 2.5, status: 'moderate', date: '2024-11-07', notes: 'Agricultural runoff component identified.' },
  { id: 'CST-014', name: 'Puerto Rico — San Juan',  lat: 18.47, lng: -66.12, pfas: 3.8,  mp: 6.4, status: 'elevated', date: '2024-11-10', notes: 'Urban runoff and Navy base PFAS signatures.' },
  { id: 'CST-015', name: 'Puerto Rico — Ponce',     lat: 17.99, lng: -66.61, pfas: 2.9,  mp: 4.6, status: 'moderate', date: '2024-11-12', notes: 'Industrial port on south coast.' },
  { id: 'CST-016', name: 'Bahamas — Nassau',        lat: 25.08, lng: -77.34, pfas: 1.3,  mp: 2.2, status: 'low',      date: '2024-12-01', notes: 'Northern Caribbean reference. Tourism-related microplastics.' },
  { id: 'CST-017', name: 'St. Maarten — Philipsburg', lat: 18.02, lng: -63.06, pfas: 3.5, mp: 5.9, status: 'elevated', date: '2025-01-08', notes: 'High cruise ship and charter boat density.' },
  { id: 'CST-018', name: 'St. Barts — Gustavia',   lat: 17.90, lng: -62.85, pfas: 0.5,  mp: 0.8, status: 'low',      date: '2025-01-10', notes: 'Lowest contamination in survey. Open-ocean reference.' },
]

export const statusColors = {
  low:      '#00B894',
  moderate: '#FDCB6E',
  elevated: '#E17055',
  high:     '#D63031',
}
