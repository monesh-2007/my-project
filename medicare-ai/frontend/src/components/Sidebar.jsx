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
    <aside className="flex w-full shrink-0 flex-col border-b border-gray-200 bg-white px-3 py-3 md:h-screen md:w-64 md:border-b-0 md:border-r md:px-4 md:py-6">
      <div className="mb-3 flex items-center gap-2 px-2 md:mb-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
          M
        </div>
        <span className="text-lg font-semibold text-gray-800">MediCare AI</span>
      </div>

      <nav className="flex min-h-0 flex-1 gap-1 overflow-x-auto pb-1 md:flex-col md:overflow-y-auto md:pb-0">
        {navItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors md:shrink ${
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

      <div className="mt-4 hidden md:block">
        <HealthTip />
      </div>
    </aside>
  )
}

export default Sidebar
