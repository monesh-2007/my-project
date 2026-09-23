import { useState } from 'react'
import { Pill, Plus, Trash2 } from 'lucide-react'
import Card from '../components/Card.jsx'
import { loadList, saveList } from '../utils/storage.js'

const inputClasses =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'

function Medications() {
  const [medications, setMedications] = useState(() => loadList('medicare.medications', []))
  const [form, setForm] = useState({ name: '', dosage: '', schedule: 'Once daily' })

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.dosage.trim()) return

    const nextMedications = [
      { id: Date.now(), name: form.name.trim(), dosage: form.dosage.trim(), schedule: form.schedule },
      ...medications,
    ]
    setMedications(nextMedications)
    saveList('medicare.medications', nextMedications)
    setForm({ name: '', dosage: '', schedule: 'Once daily' })
  }

  const removeMedication = (id) => {
    const nextMedications = medications.filter((medication) => medication.id !== id)
    setMedications(nextMedications)
    saveList('medicare.medications', nextMedications)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Medications</h1>
        <p className="text-sm text-gray-500">Keep a simple list of current medications and schedules.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <Card title="Add Medication" icon={Plus}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Medication name
              <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Vitamin D" className={`${inputClasses} mt-1`} />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Dosage
              <input required value={form.dosage} onChange={(event) => setForm({ ...form, dosage: event.target.value })} placeholder="e.g. 1000 IU" className={`${inputClasses} mt-1`} />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Schedule
              <select value={form.schedule} onChange={(event) => setForm({ ...form, schedule: event.target.value })} className={`${inputClasses} mt-1`}>
                <option>Once daily</option>
                <option>Twice daily</option>
                <option>As needed</option>
                <option>Weekly</option>
              </select>
            </label>
            <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              <Pill size={16} />
              Add Medication
            </button>
          </form>
        </Card>

        <Card title="Current Medications" icon={Pill}>
          {medications.length ? (
            <div className="space-y-3">
              {medications.map((medication) => (
                <div key={medication.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{medication.name}</p>
                    <p className="text-xs text-gray-500">{medication.dosage} · {medication.schedule}</p>
                  </div>
                  <button type="button" onClick={() => removeMedication(medication.id)} aria-label={`Remove ${medication.name}`} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No medications added yet.</p>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Medications
