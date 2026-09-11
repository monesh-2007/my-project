function Card({ title, icon: Icon, children }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      {(title || Icon) && (
        <div className="mb-4 flex items-center gap-2">
          {Icon && <Icon size={18} className="text-blue-600" />}
          {title && <h3 className="text-sm font-semibold text-gray-800">{title}</h3>}
        </div>
      )}
      <div>{children}</div>
    </div>
  )
}

export default Card