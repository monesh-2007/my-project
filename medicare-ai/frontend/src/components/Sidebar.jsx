import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Bot,
  Stethoscope,
  Activity,
  Pill,
  Calendar,
  User,
} from 'lucide-react'
import HealthTip from './HealthTip.jsx'

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'AI Assistant', path: '/ai-assistant', icon: Bot },
  { name: 'Symptom Checker', path: '/symptoms', icon: Stethoscope },
  { name: 'Health Tracker', path: '/health-tracker', icon: Activity },
  { name: 'Medications', path: '/medications', icon: Pill },
  { name: 'Appointments', path: '/appointments', icon: Calendar },
  { name: 'Profile', path: '/profile', icon: User },
]

function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white px-4 py-6">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
          M
        </div>
        <span className="text-lg font-semibold text-gray-800">MediCare AI</span>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
        {navItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <Icon size={18} />
            {name}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4">
        <HealthTip />
      </div>
    </aside>
  )
}

export default Sidebar
