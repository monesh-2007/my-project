import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2, Clock3, HeartPulse, History, Printer, ShieldAlert, Stethoscope, Trash2 } from 'lucide-react'
import { loadList, saveList } from '../utils/storage.js'

const HISTORY_KEY = 'medicare-symptom-checks'

const COMMON_SYMPTOMS = [
  'Fever',
  'Cough',
  'Headache',
  'Fatigue',
  'Sore Throat',
  'Nausea',
  'Shortness of Breath',
  'Chest Pain',
  'Abdominal Pain',
  'Muscle Aches',
  'Joint Pain',
  'Back Pain',
  'Dizziness',
  'Chills',
  'Rash',
  'Runny Nose',
  'Vomiting',
]

const SYMPTOM_GUIDANCE = {
  Fever: 'Rest, drink fluids, and monitor your temperature.',
  Cough: 'Warm fluids and avoiding smoke or other irritants may help.',
  Headache: 'Rest in a quiet space, hydrate, and note any new or severe changes.',
  Fatigue: 'Prioritize rest, regular fluids, and gentle activity only if comfortable.',
  'Sore Throat': 'Warm fluids, salt-water gargles, and avoiding irritants may soothe discomfort.',
  Nausea: 'Take small sips of fluid and choose light foods as tolerated.',
  'Shortness of Breath': 'Stop strenuous activity and arrange prompt medical advice.',
  'Chest Pain': 'Stop strenuous activity and seek prompt medical advice, especially for new or severe pain.',
  'Abdominal Pain': 'Rest, drink fluids, and note where the pain is and whether it is getting worse.',
  'Muscle Aches': 'Rest, gentle movement, and hydration may help you feel more comfortable.',
  'Joint Pain': 'Rest the affected area and avoid activity that increases the pain.',
  'Back Pain': 'Use gentle movement and avoid lifting until you understand what is causing the pain.',
  Dizziness: 'Sit or lie down safely, rise slowly, and avoid driving until it passes.',
  Chills: 'Stay comfortably warm, rest, and monitor for fever or worsening symptoms.',
  Rash: 'Avoid new irritants and monitor the rash for spreading, swelling, or skin changes.',
  'Runny Nose': 'Drink fluids, rest, and avoid known irritants while symptoms settle.',
  Vomiting: 'Take small sips of fluid and seek help if you cannot keep fluids down.',
}

const URGENT_SYMPTOMS = new Set(['Shortness of Breath', 'Chest Pain'])

const CONDITION_RULES = [
  { name: 'Viral Infection', description: 'Common viral illness such as influenza or a common cold', symptoms: ['Fever', 'Cough', 'Fatigue', 'Muscle Aches', 'Chills'] },
  { name: 'Tension Headache', description: 'Stress-related muscle tension that can cause head pain', symptoms: ['Headache', 'Fatigue', 'Dizziness'] },
  { name: 'Common Cold', description: 'Viral upper respiratory infection', symptoms: ['Cough', 'Sore Throat', 'Runny Nose', 'Fatigue', 'Chills'] },
  { name: 'Gastroenteritis', description: 'Stomach illness that can cause nausea, vomiting, and abdominal pain', symptoms: ['Nausea', 'Vomiting', 'Abdominal Pain', 'Fever', 'Fatigue', 'Dizziness'] },
  { name: 'Muscle Strain or Overuse', description: 'Muscle discomfort that may follow activity or exertion', symptoms: ['Muscle Aches', 'Joint Pain', 'Back Pain', 'Fatigue'] },
  { name: 'Allergic Reaction', description: 'A reaction that may cause a rash or upper-airway symptoms', symptoms: ['Rash', 'Runny Nose', 'Dizziness'] },
]

function createSnapshot(symptoms, description) {
  const urgent = symptoms.some((symptom) => URGENT_SYMPTOMS.has(symptom))
  const matchedGuidance = symptoms.map((symptom) => SYMPTOM_GUIDANCE[symptom]).filter(Boolean)
  const possibleConditions = CONDITION_RULES
    .map((condition) => ({ ...condition, matches: condition.symptoms.filter((symptom) => symptoms.includes(symptom)).length }))
    .filter((condition) => condition.matches > 0)
    .sort((first, second) => second.matches - first.matches)
    .slice(0, 5)
  const severity = urgent ? 'High' : symptoms.length >= 4 ? 'Average' : 'Low'
  const severityLabel = urgent ? 'Seek Prompt Care' : severity === 'Average' ? 'Monitor & Rest' : 'Self-care & Monitor'
  const recommendations = urgent
    ? ['Stop strenuous activity and arrange prompt medical advice.', 'Call emergency services for severe breathing trouble, chest pain, confusion, or blue lips.']
    : ['Rest, drink fluids, and monitor how your symptoms change.', 'Contact a healthcare professional if symptoms persist, worsen, or concern you.']

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    symptoms,
    description,
    urgent,
    severity,
    severityLabel,
    possibleConditions,
    recommendations,
    guidance: matchedGuidance,
    createdAt: new Date().toISOString(),
  }
}

function SymptomChecker() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [description, setDescription] = useState('')
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState(() => loadList(HISTORY_KEY))

  useEffect(() => {
    saveList(HISTORY_KEY, history)
  }, [history])

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    )
  }

  const handleAnalyze = () => {
    if (selectedSymptoms.length === 0 && !description.trim()) return

    const snapshot = createSnapshot(selectedSymptoms, description.trim())
    setResult(snapshot)
    setHistory((previous) => [snapshot, ...previous].slice(0, 8))
  }

  const openSavedCheck = (snapshot) => {
    const refreshedSnapshot = createSnapshot(snapshot.symptoms || [], snapshot.description || '')
    setSelectedSymptoms(refreshedSnapshot.symptoms)
    setDescription(refreshedSnapshot.description)
    setResult(refreshedSnapshot)
  }

  const deleteSavedCheck = (id) => {
    setHistory((previous) => previous.filter((item) => item.id !== id))
    if (result?.id === id) setResult(null)
  }

  const handlePrint = () => {
    if (result) window.print()
  }

  const canAnalyze = selectedSymptoms.length > 0 || description.trim().length > 0
  const needsUrgentCare = result?.urgent
  const severityStyles = {
    High: 'border-red-200 bg-red-50 text-red-800',
    Average: 'border-amber-200 bg-amber-50 text-amber-800',
    Low: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  }

  return (
    <div className="pb-8">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500 text-white shadow-sm">
            <HeartPulse size={23} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Symptom Checker</h1>
            <p className="text-sm text-gray-500">Select symptoms to create a saved, informational care snapshot.</p>
          </div>
          <button type="button" onClick={handlePrint} disabled={!result} className="print-hidden flex items-center gap-2 rounded-lg border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-50">
            <Printer size={16} />
            Save as PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="print-hidden rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
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
          disabled={!canAnalyze}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Stethoscope size={16} />
          Create Symptom Snapshot
        </button>

        <div className="mt-4 flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs leading-5 text-blue-800">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-blue-600" />
          This tool organizes your selections. It does not diagnose illness or replace professional medical advice.
        </div>
      </div>

      <div className={`rounded-2xl border p-6 shadow-sm ${result ? 'border-emerald-100 bg-white' : 'border-slate-200 bg-slate-50'}`}>
        {result ? (
          <>
            <div className={`flex items-start gap-3 rounded-2xl border p-4 ${severityStyles[result.severity]}`}>
              {needsUrgentCare ? <ShieldAlert size={22} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={22} className="mt-0.5 shrink-0" />}
              <div>
                <h2 className="text-base font-bold">{result.severity} - {result.severityLabel}</h2>
                <p className="mt-1 text-sm">Severity: <strong>{result.severity}</strong> <span className="mx-1">·</span> Symptoms analyzed: <strong>{result.symptoms.length}</strong></p>
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-base font-bold text-slate-800">Possible Conditions</h3>
              <p className="mt-1 text-xs text-slate-500">Informational matches based only on your selected symptoms.</p>
              <div className="mt-4 space-y-3">
                {result.possibleConditions.length > 0 ? result.possibleConditions.map((condition) => (
                  <div key={condition.name} className="rounded-xl bg-slate-50 p-3">
                    <div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold text-slate-800">{condition.name}</p><span className="rounded bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600">Low</span></div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{condition.description}</p>
                  </div>
                )) : <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">Add more common symptoms for a broader informational comparison.</p>}
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-base font-bold text-slate-800">Recommendations</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                {result.recommendations.map((recommendation) => <li key={recommendation} className="flex gap-2"><span className="text-emerald-500">•</span>{recommendation}</li>)}
              </ul>
              {result.guidance.length > 0 && <div className="mt-4 border-t border-slate-100 pt-3"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Selected symptom notes</p><ul className="mt-2 space-y-1 text-xs text-slate-500">{result.guidance.map((item) => <li key={item}>• {item}</li>)}</ul></div>}
              {result.description && <p className="mt-4 border-t border-slate-100 pt-3 text-xs italic text-slate-500">Your note: {result.description}</p>}
            </div>
          </>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-400 shadow-sm"><HeartPulse size={28} /></div>
            <h2 className="mt-4 text-lg font-semibold text-slate-700">Your results will appear here</h2>
            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">Choose symptoms or add a note to create your first saved snapshot.</p>
          </div>
        )}
      </div>
      </div>

      <section className="print-hidden mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><History size={16} /></div>
            <div><h3 className="text-sm font-semibold text-gray-800">Saved snapshots</h3><p className="text-xs text-slate-500">Stored on this device</p></div>
          </div>
          {history.length > 0 && <span className="text-xs font-medium text-slate-400">{history.length}/8 saved</span>}
        </div>
        {history.length === 0 ? <p className="mt-4 text-sm text-slate-500">Your recent symptom snapshots will appear here.</p> : (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {history.map((snapshot) => (
              <div key={snapshot.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <button type="button" onClick={() => openSavedCheck(snapshot)} className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-semibold text-slate-700">{snapshot.symptoms.length > 0 ? snapshot.symptoms.join(', ') : 'Personal note'}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-400"><Clock3 size={12} />{new Date(snapshot.createdAt).toLocaleString()}</p>
                </button>
                <button type="button" title="Delete saved snapshot" onClick={() => deleteSavedCheck(snapshot.id)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default SymptomChecker
