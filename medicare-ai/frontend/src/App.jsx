import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
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
      </div>
    </BrowserRouter>
  )
}

export default App
