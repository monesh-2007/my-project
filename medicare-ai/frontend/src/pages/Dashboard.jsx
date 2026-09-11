import { Activity, Pill, ClipboardList } from 'lucide-react'
import Card from '../components/Card.jsx'

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-8 text-center">
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  )
}

function Dashboard() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">
          A quick overview of your health at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Latest Vitals" icon={Activity}>
          <EmptyState message="No vitals recorded yet. Log a reading to see it here." />
        </Card>

        <Card title="Active Medications" icon={Pill}>
          <EmptyState message="No medications added yet. Add one to start tracking." />
        </Card>

        <Card title="Recent Symptom Assessments" icon={ClipboardList}>
          <EmptyState message="No symptom checks yet. Run a check to see your history." />
        </Card>
      </div>
    </div>
  )
}

export default Dashboard