import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { ArrowUpRight, HeartPulse, Moon, Sun } from 'lucide-react'
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
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem('medicare.theme')
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  })

  useEffect(() => {
    wakeServer()
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem('medicare.theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <BrowserRouter>
      <div className="app-shell flex min-h-screen flex-col bg-gray-100 transition-colors duration-300 md:h-screen md:flex-row">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
          <header className="app-header flex items-center justify-between border-b border-gray-200 bg-white/90 px-4 py-4 backdrop-blur-xl transition-colors duration-300 sm:px-6">
            <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <HeartPulse className="text-blue-600" size={20} aria-hidden="true" />
              <span>Care, made clearer.</span>
            </Link>
            <nav aria-label="Utility navigation" className="flex items-center gap-3 text-sm text-gray-600 sm:gap-4">
              <Link className="hidden hover:text-blue-600 sm:inline" to="/">Home</Link>
              <Link className="hidden hover:text-blue-600 sm:inline" to="/health-tracker">Features</Link>
              <a className="hidden items-center gap-1 hover:text-blue-600 sm:inline-flex" href="https://github.com" target="_blank" rel="noreferrer">
                GitHub <ArrowUpRight size={14} aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={toggleTheme}
                className="theme-toggle rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-blue-400 hover:text-blue-600"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
              </button>
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

          <footer className="app-footer flex flex-col gap-2 border-t border-gray-200 bg-white px-4 py-4 text-xs text-gray-500 transition-colors duration-300 sm:flex-row sm:items-center sm:justify-between sm:px-6">
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
