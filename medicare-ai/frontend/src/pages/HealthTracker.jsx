import { useState } from 'react'
import {
  Activity,
  Droplets,
  Footprints,
  Gauge,
  HeartPulse,
  Moon,
  Plus,
  Thermometer,
  Weight,
  X,
} from 'lucide-react'
import { loadList, saveList } from '../utils/storage.js'

const inputClasses =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'

const metricDefinitions = [
  { type: 'Blood pressure', label: 'Blood Pressure', unit: 'mmHg', icon: HeartPulse, tone: 'rose', empty: 'No data yet' },
  { type: 'Heart rate', label: 'Heart Rate', unit: 'bpm', icon: Activity, tone: 'red', empty: 'No data yet' },
  { type: 'Blood glucose', label: 'Blood Glucose', unit: 'mg/dL', icon: Droplets, tone: 'blue', empty: 'No data yet' },
  { type: 'Temperature', label: 'Temperature', unit: '°F', icon: Thermometer, tone: 'orange', empty: 'No data yet' },
  { type: 'Oxygen saturation', label: 'Oxygen Sat', unit: '%', icon: Gauge, tone: 'cyan', empty: 'No data yet' },
  { type: 'Sleep', label: 'Sleep', unit: 'hours', icon: Moon, tone: 'indigo', empty: 'No data yet' },
  { type: 'Steps', label: 'Steps', unit: 'steps', icon: Footprints, tone: 'emerald', empty: 'No data yet' },
  { type: 'Weight', label: 'Weight', unit: 'kg', icon: Weight, tone: 'teal', empty: 'No data yet' },
]

const toneClasses = {
  rose: 'bg-rose-50 text-rose-500',
  red: 'bg-red-50 text-red-500',
  blue: 'bg-blue-50 text-blue-500',
  orange: 'bg-orange-50 text-orange-500',
  cyan: 'bg-cyan-50 text-cyan-500',
  indigo: 'bg-indigo-50 text-indigo-500',
  emerald: 'bg-emerald-50 text-emerald-500',
  teal: 'bg-teal-50 text-teal-500',
}

function HealthTracker() {
  const [readings, setReadings] = useState(() =>
    loadList('medicare.vitals', [
      { id: 'demo-bp', type: 'Blood pressure', value: '120/80', recordedAt: 'Today' },
    ])
  )
  const [isLogging, setIsLogging] = useState(false)
  const [form, setForm] = useState({ type: 'Blood pressure', value: '' })

  const getLatest = (type) => readings.find((reading) => reading.type === type)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.value.trim()) return

    const reading = {
      id: Date.now(),
      type: form.type,
      value: form.value.trim(),
      recordedAt: new Date().toLocaleString(),
    }
    const nextReadings = [reading, ...readings]
    setReadings(nextReadings)
    saveList('medicare.vitals', nextReadings)
    setForm((prev) => ({ ...prev, value: '' }))
    setIsLogging(false)
  }

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500 text-white shadow-sm">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Health Tracker</h1>
            <p className="text-sm text-slate-500">Monitor and log your vital signs</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsLogging(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={17} />
          Log Vital
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {metricDefinitions.map(({ type, label, unit, icon: Icon, tone, empty }) => {
          const latest = getLatest(type)
          return (
            <div key={type} className="min-h-40 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${toneClasses[tone]}`}>
                  <Icon size={18} />
                </div>
                <button type="button" onClick={() => { setForm({ type, value: latest?.value || '' }); setIsLogging(true) }} aria-label={`Log ${label}`} className="text-slate-300 hover:text-blue-500">
                  <Plus size={17} />
                </button>
              </div>
              <p className="mt-3 text-xs font-medium text-slate-400">{label}</p>
              {latest ? (
                <div className="mt-2">
                  <p className="text-2xl font-semibold text-slate-800">{latest.value} <span className="text-xs font-medium text-slate-400">{unit}</span></p>
                  <p className="mt-7 text-xs text-slate-400">{latest.recordedAt} · 1 record</p>
                </div>
              ) : (
                <p className="mt-7 text-center text-sm text-slate-400">{empty}</p>
              )}
            </div>
          )
        })}
      </div>

      {isLogging && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/30 p-4" role="dialog" aria-modal="true" aria-label="Log vital sign">
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Log Vital Sign</h2>
                <p className="text-sm text-slate-500">Add your latest reading to the tracker.</p>
              </div>
              <button type="button" onClick={() => setIsLogging(false)} aria-label="Close log vital dialog" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Measurement
                <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} className={`${inputClasses} mt-1`}>
                  {metricDefinitions.map(({ type, label }) => <option key={type} value={type}>{label}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Value
                <input required autoFocus value={form.value} onChange={(event) => setForm({ ...form, value: event.target.value })} placeholder="e.g. 120/80" className={`${inputClasses} mt-1`} />
              </label>
            </div>
            <button className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Save Reading</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default HealthTracker
