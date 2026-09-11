
import { useState } from 'react'
import { Save } from 'lucide-react'

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown']
const SEX_OPTIONS = ['Female', 'Male', 'Other', 'Prefer not to say']

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputClasses =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'

function Profile() {
  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    height: '',
    weight: '',
    bloodType: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    setSaved(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    // Placeholder: wire this up to POST /patients/ once a logged-in user's
    // ID is available; blood type currently has no backing field on the
    // User model, so it isn't persisted yet.
    await new Promise((resolve) => setTimeout(resolve, 600))

    setIsSaving(false)
    setSaved(true)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
        <p className="text-sm text-gray-500">
          Keep your basic information up to date.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6"
      >
        <h3 className="mb-4 text-sm font-semibold text-gray-800">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Age">
            <input
              type="number"
              min="0"
              value={formData.age}
              onChange={handleChange('age')}
              placeholder="e.g. 32"
              className={inputClasses}
            />
          </Field>

          <Field label="Sex">
            <select
              value={formData.sex}
              onChange={handleChange('sex')}
              className={inputClasses}
            >
              <option value="" disabled>
                Select...
              </option>
              {SEX_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Height (cm)">
            <input
              type="number"
              min="0"
              value={formData.height}
              onChange={handleChange('height')}
              placeholder="e.g. 170"
              className={inputClasses}
            />
          </Field>

          <Field label="Weight (kg)">
            <input
              type="number"
              min="0"
              value={formData.weight}
              onChange={handleChange('weight')}
              placeholder="e.g. 65"
              className={inputClasses}
            />
          </Field>

          <Field label="Blood Type">
            <select
              value={formData.bloodType}
              onChange={handleChange('bloodType')}
              className={inputClasses}
            >
              <option value="" disabled>
                Select...
              </option>
              {BLOOD_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>

          {saved && (
            <span className="text-sm text-green-600">Saved successfully.</span>
          )}
        </div>
      </form>
    </div>
  )
}

export default Profile