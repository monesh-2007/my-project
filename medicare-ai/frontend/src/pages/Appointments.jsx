import { useState } from 'react'
import { Calendar, Plus, Trash2 } from 'lucide-react'
import Card from '../components/Card.jsx'
import { loadList, saveList } from '../utils/storage.js'

const inputClasses =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'

function Appointments() {
  const [appointments, setAppointments] = useState(() => loadList('medicare.appointments', []))
  const [form, setForm] = useState({ title: '', provider: '', date: '', time: '' })

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.title.trim() || !form.provider.trim() || !form.date || !form.time) return

    const nextAppointments = [
      { id: Date.now(), title: form.title.trim(), provider: form.provider.trim(), date: form.date, time: form.time },
      ...appointments,
    ]
    setAppointments(nextAppointments)
    saveList('medicare.appointments', nextAppointments)
    setForm({ title: '', provider: '', date: '', time: '' })
  }

  const removeAppointment = (id) => {
    const nextAppointments = appointments.filter((appointment) => appointment.id !== id)
    setAppointments(nextAppointments)
    saveList('medicare.appointments', nextAppointments)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Appointments</h1>
        <p className="text-sm text-gray-500">Keep upcoming visits organized in one place.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <Card title="Schedule Appointment" icon={Plus}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Appointment
              <input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="e.g. Annual checkup" className={`${inputClasses} mt-1`} />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Provider
              <input required value={form.provider} onChange={(event) => setForm({ ...form, provider: event.target.value })} placeholder="e.g. Dr. Patel" className={`${inputClasses} mt-1`} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium text-gray-700">
                Date
                <input required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className={`${inputClasses} mt-1`} />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Time
                <input required type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} className={`${inputClasses} mt-1`} />
              </label>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              <Calendar size={16} />
              Add Appointment
            </button>
          </form>
        </Card>

        <Card title="Upcoming Appointments" icon={Calendar}>
          {appointments.length ? (
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{appointment.title}</p>
                    <p className="text-xs text-gray-500">{appointment.provider} · {appointment.date} at {appointment.time}</p>
                  </div>
                  <button type="button" onClick={() => removeAppointment(appointment.id)} aria-label={`Remove ${appointment.title}`} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No appointments scheduled yet.</p>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Appointments
