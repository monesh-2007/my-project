import { useState } from 'react'
import { AlertTriangle, CheckCircle2, HeartPulse, Lightbulb, ShieldAlert, Stethoscope } from 'lucide-react'
import ConnectingNotice from '../components/ConnectingNotice.jsx'
import { apiJson } from '../utils/api.js'

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
  const [error, setError] = useState(null)

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
    setError(null)

    try {
      const data = await apiJson('/api/analyze', {
        method: 'POST',
        body: JSON.stringify({
          symptoms: selectedSymptoms,
          description: description.trim(),
        }),
      })
      setResult(data.analysis || 'No analysis was returned. Please try again.')
    } catch (err) {
      setError(
        err.message ||
          "Couldn't reach the symptom checker right now. Please try again."
      )
    } finally {
      setIsAnalyzing(false)
    }
  }

  const canAnalyze = selectedSymptoms.length > 0 || description.trim().length > 0
  const needsUrgentCare = result && /urgent|emergency|immediate medical|seek immediate/i.test(result)

  return (
    <div className="pb-8">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500 text-white shadow-sm">
            <HeartPulse size={23} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Symptom Checker</h1>
            <p className="text-sm text-gray-500">A calm, informative starting point for your next step.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600"><Stethoscope size={16} /></div>
          <h3 className="text-sm font-semibold text-gray-800">
          Common Symptoms
          </h3>
        </div>
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
                    ? 'border-violet-600 bg-violet-600 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700'
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
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
        />

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={!canAnalyze || isAnalyzing}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Stethoscope size={16} />
          {isAnalyzing
            ? 'Connecting to server (waking up instance)...'
            : 'Analyze Symptoms'}
        </button>

        <ConnectingNotice active={isAnalyzing} />

        {error && (
          <div className="mt-4 flex gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}
      </div>

      <div className={`rounded-2xl border p-6 shadow-sm ${result ? 'border-emerald-100 bg-white' : 'border-slate-200 bg-slate-50'}`}>
        {result ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${needsUrgentCare ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {needsUrgentCare ? <ShieldAlert size={21} /> : <CheckCircle2 size={21} />}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Care Snapshot</p>
                  <h2 className="text-lg font-semibold text-slate-800">Your personalized overview</h2>
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${needsUrgentCare ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {needsUrgentCare ? 'Review warning signs' : 'Informational guidance'}
              </span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {selectedSymptoms.map((symptom) => <span key={symptom} className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">{symptom}</span>)}
            </div>
            <div className="mt-5 rounded-xl bg-slate-50 p-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">{result}</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-blue-50 p-4"><Lightbulb size={18} className="text-blue-600" /><p className="mt-2 text-xs font-semibold text-blue-900">Helpful next step</p><p className="mt-1 text-xs leading-5 text-blue-800">Rest, hydrate, and keep track of changes over the next few hours.</p></div>
              <div className="rounded-xl bg-rose-50 p-4"><ShieldAlert size={18} className="text-rose-600" /><p className="mt-2 text-xs font-semibold text-rose-900">Stay safety-aware</p><p className="mt-1 text-xs leading-5 text-rose-800">Seek urgent care for sudden, severe, or rapidly worsening symptoms.</p></div>
            </div>
          </>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-400 shadow-sm"><HeartPulse size={28} /></div>
            <h2 className="mt-4 text-lg font-semibold text-slate-700">Your results will appear here</h2>
            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">Choose symptoms or add a note, then let MediCare AI organize the guidance for you.</p>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

export default SymptomChecker
