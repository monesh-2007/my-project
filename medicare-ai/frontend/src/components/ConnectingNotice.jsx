import { useEffect, useState } from 'react'

function ConnectingNotice({ active }) {
  const [waking, setWaking] = useState(false)

  useEffect(() => {
    if (!active) {
      setWaking(false)
      return undefined
    }

    const timer = setTimeout(() => setWaking(true), 2500)
    return () => clearTimeout(timer)
  }, [active])

  if (!active) return null

  return (
    <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700">
      {waking
        ? 'Connecting to server (waking up instance)...'
        : 'Sending request...'}
    </div>
  )
}

export default ConnectingNotice
