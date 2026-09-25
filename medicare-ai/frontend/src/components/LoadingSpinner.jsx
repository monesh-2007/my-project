function LoadingSpinner({ label = 'Loading', className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-2 text-sm text-gray-500 ${className}`} role="status" aria-live="polite">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}

export default LoadingSpinner