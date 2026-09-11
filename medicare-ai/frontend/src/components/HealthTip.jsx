import { Heart } from 'lucide-react'

function HealthTip() {
  return (
    <div className="rounded-lg bg-blue-50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Heart size={16} className="text-blue-600" fill="currentColor" />
        <span className="text-sm font-semibold text-blue-700">Health Tip</span>
      </div>
      <p className="text-xs leading-relaxed text-blue-900">
        Try to drink at least 8 glasses of water a day to stay hydrated and support
        your body's natural functions.
      </p>
    </div>
  )
}

export default HealthTip