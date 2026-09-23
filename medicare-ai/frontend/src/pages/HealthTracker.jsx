import { useState } from 'react'
import { Activity, Plus } from 'lucide-react'
import Card from '../components/Card.jsx'
import { loadList, saveList } from '../utils/storage.js'

const inputClasses =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'

function HealthTracker() {
  const [readings, setReadings] = useState(() => loadList('medicare.vitals', []))
  const [form, setForm] = useState({ type: 'Blood pressure', value: '' })

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
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Health Tracker</h1>
        <p className="text-sm text-gray-500">Record simple readings and review your recent history.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <Card title="Log a Reading" icon={Plus}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Measurement
              <select
                value={form.type}
                onChange={(event) => setForm({ ...form, type: event.target.value })}
                className={`${inputClasses} mt-1`}
              >
                <option>Blood pressure</option>
                <option>Heart rate</option>
                <option>Blood glucose</option>
                <option>Temperature</option>
                <option>Weight</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Value
              <input
                required
                value={form.value}
                onChange={(event) => setForm({ ...form, value: event.target.value })}
                placeholder="e.g. 120/80 mmHg"
                className={`${inputClasses} mt-1`}
              />
            </label>
            <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              <Activity size={16} />
              Save Reading
            </button>
          </form>
        </Card>

        <Card title="Recent Readings" icon={Activity}>
          {readings.length ? (
            <div className="space-y-3">
              {readings.slice(0, 6).map((reading) => (
                <div key={reading.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{reading.type}</p>
                    <p className="text-xs text-gray-500">{reading.recordedAt}</p>
                  </div>
                  <span className="text-sm font-medium text-blue-600">{reading.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No readings yet. Add your first measurement to start tracking.</p>
          )}
        </Card>
      </div>
    </div>
  )
}

export default HealthTracker
