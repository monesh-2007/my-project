import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { ArrowUpRight, HeartPulse } from 'lucide-react'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AIAssistant from './pages/AIAssistant.jsx'
import SymptomChecker from './pages/SymptomChecker.jsx'
import HealthTracker from './pages/HealthTracker.jsx'
import Medications from './pages/Medications.jsx'
import Appointments from './pages/Appointments.jsx'
import Profile from './pages/Profile.jsx'
import { wakeServer } from './utils/api.js'

function App() {
  useEffect(() => {
    wakeServer()
  }, [])

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-gray-100 md:h-screen md:flex-row">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
          <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
            <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <HeartPulse className="text-blue-600" size={20} aria-hidden="true" />
              <span>Care, made clearer.</span>
            </Link>
            <nav aria-label="Utility navigation" className="flex items-center gap-4 text-sm text-gray-600">
              <Link className="hover:text-blue-600" to="/">Home</Link>
              <Link className="hover:text-blue-600" to="/health-tracker">Features</Link>
              <a className="inline-flex items-center gap-1 hover:text-blue-600" href="https://github.com" target="_blank" rel="noreferrer">
                GitHub <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </nav>
          </header>

          <main className="min-w-0 flex-1 p-4 sm:p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/symptoms" element={<SymptomChecker />} />
              <Route path="/health-tracker" element={<HealthTracker />} />
              <Route path="/medications" element={<Medications />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>

          <footer className="flex flex-col gap-2 border-t border-gray-200 bg-white px-4 py-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>© {new Date().getFullYear()} MediCare AI. Built for better everyday care.</p>
            <div className="flex gap-4">
              <a className="hover:text-blue-600" href="https://twitter.com" target="_blank" rel="noreferrer">X / Twitter</a>
              <a className="hover:text-blue-600" href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </footer>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
