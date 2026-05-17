import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/Nav'
import Dashboard from './pages/Dashboard'
import MapPage from './pages/MapPage'
import Portfolio from './pages/Portfolio'
import Education from './pages/Education'
import CitizenScience from './pages/CitizenScience'
import DataPage from './pages/DataPage'

export default function App() {
  return (
    <Router>
      <Nav />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/data" element={<DataPage />} />
          <Route path="/education" element={<Education />} />
          <Route path="/submit" element={<CitizenScience />} />
        </Routes>
      </main>
    </Router>
  )
}
