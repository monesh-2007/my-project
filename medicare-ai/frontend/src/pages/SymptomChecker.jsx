import { useState } from 'react'
import { Stethoscope } from 'lucide-react'

const COMMON_SYMPTOMS = [
  'Fever',
  'Cough',
  'Headache',
  'Fatigue',
  'Sore Throat',
  'Nausea',
  'Shortness of Breath',
  'Muscle Aches',
  'Dizziness',
  'Chills',
]

function SymptomChecker() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [description, setDescription] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    )
  }

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0 && !description.trim()) return

    setIsAnalyzing(true)
    setResult(null)

    // Placeholder: no dedicated symptom-analysis endpoint exists yet.
    // This simulates a short delay before showing a stand-in result.
    await new Promise((resolve) => setTimeout(resolve, 800))

    setResult(
      "Analysis isn't wired up to a backend endpoint yet — this is a placeholder result."
    )
    setIsAnalyzing(false)
  }

  const canAnalyze = selectedSymptoms.length > 0 || description.trim().length > 0

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Symptom Checker</h1>
        <p className="text-sm text-gray-500">
          Select what you're experiencing, or describe it in your own words.
        </p>
      </div>

      <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-3 text-sm font-semibold text-gray-800">
          Common Symptoms
        </h3>
        <div className="mb-6 flex flex-wrap gap-2">
          {COMMON_SYMPTOMS.map((symptom) => {
            const isSelected = selectedSymptoms.includes(symptom)
            return (
              <button
                key={symptom}
                type="button"
                onClick={() => toggleSymptom(symptom)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  isSelected
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                {symptom}
              </button>
            )
          })}
        </div>

        <h3 className="mb-2 text-sm font-semibold text-gray-800">
          Describe Your Symptoms
        </h3>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          placeholder="E.g. I've had a mild headache and sore throat since yesterday..."
          className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={!canAnalyze || isAnalyzing}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Stethoscope size={16} />
          {isAnalyzing ? 'Analyzing...' : 'Analyze Symptoms'}
        </button>

        {result && (
          <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
            {result}
          </div>
        )}
      </div>
    </div>
  )
}

export default SymptomChecker