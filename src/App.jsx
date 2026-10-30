import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import Nav from './components/Nav'
import AppBanners from './components/AppBanners'
import Dashboard from './pages/Dashboard'
import MapPage from './pages/MapPage'
import Portfolio from './pages/Portfolio'
import Education from './pages/Education'
import CitizenScience from './pages/CitizenScience'
import DataPage from './pages/DataPage'
import FieldLog from './pages/FieldLog'
import Privacy from './pages/Privacy'

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
          <Route path="/field" element={<FieldLog />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
        <footer className="app-footer">
          <span>Sustainable Seas Institute · UNC Charlotte</span>
          <a href="https://sustainableseasinstitute.org" target="_blank" rel="noopener noreferrer">SSI website</a>
          <a href="https://github.com/rbtipton/gocos-app" target="_blank" rel="noopener noreferrer">Source code</a>
          <Link to="/privacy">Privacy</Link>
        </footer>
      </main>
      <AppBanners />
    </Router>
  )
}
