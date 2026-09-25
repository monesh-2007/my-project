import { useMemo } from 'react'
import { Activity, Pill, Calendar, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../components/Card.jsx'
import { loadList, loadObject } from '../utils/storage.js'

function Dashboard() {
  const vitals = useMemo(
    () => loadList('medicare.vitals', []),
    []
  )
  const medications = useMemo(
    () => loadList('medicare.medications', []),
    []
  )
  const appointments = useMemo(
    () => loadList('medicare.appointments', []),
    []
  )
  const profile = useMemo(
    () => loadObject('medicare.profile', {}),
    []
  )

  const latestVital = vitals[0]
  const upcoming = appointments[0]

  return (
    <div>
      <div className="mb-6">
        <section className="hero-panel relative mb-6 overflow-hidden rounded-2xl border border-white/80 bg-white/75 px-6 py-8 text-slate-950 shadow-[0_24px_70px_rgba(94,111,160,0.16)] backdrop-blur-xl sm:px-8 sm:py-10">
          <div className="hero-orb hero-orb-cyan" aria-hidden="true" />
          <div className="hero-orb hero-orb-violet" aria-hidden="true" />
          <p className="relative mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">MediCare AI / Personal health intelligence</p>
          <h1 className="relative max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">Your health, clearer.</h1>
          <p className="relative mt-3 max-w-lg text-sm leading-6 text-slate-600 sm:text-base">
            Understand your health, keep your care organized, and make your next step feel more manageable.
          </p>
          <Link to="/ai-assistant" className="relative mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,23,42,0.2)] transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_14px_30px_rgba(37,99,235,0.3)]">
            Get Started <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </section>

        <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
        <p className="text-sm text-gray-500">
          {profile.age
            ? `Welcome back. Profile on file: age ${profile.age}.`
            : 'A quick overview of your health at a glance.'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Latest Vitals" icon={Activity}>
          {latestVital ? (
            <div>
              <p className="text-lg font-semibold text-gray-800">
                {latestVital.value}
              </p>
              <p className="text-sm text-gray-500">{latestVital.type}</p>
              <p className="mt-1 text-xs text-gray-400">{latestVital.recordedAt}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No vitals recorded yet.{' '}
              <Link className="text-blue-600 hover:underline" to="/health-tracker">
                Log a reading
              </Link>
              .
            </p>
          )}
        </Card>

        <Card title="Active Medications" icon={Pill}>
          {medications.length ? (
            <ul className="space-y-2 text-sm text-gray-700">
              {medications.slice(0, 3).map((med) => (
                <li key={med.id}>
                  <span className="font-medium">{med.name}</span>
                  <span className="text-gray-500"> · {med.dosage}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              No medications added yet.{' '}
              <Link className="text-blue-600 hover:underline" to="/medications">
                Add one
              </Link>
              .
            </p>
          )}
        </Card>

        <Card title="Next Appointment" icon={Calendar}>
          {upcoming ? (
            <div>
              <p className="text-lg font-semibold text-gray-800">{upcoming.title}</p>
              <p className="text-sm text-gray-500">{upcoming.provider}</p>
              <p className="mt-1 text-xs text-gray-400">
                {upcoming.date} at {upcoming.time}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No appointments scheduled.{' '}
              <Link className="text-blue-600 hover:underline" to="/appointments">
                Book one
              </Link>
              .
            </p>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
