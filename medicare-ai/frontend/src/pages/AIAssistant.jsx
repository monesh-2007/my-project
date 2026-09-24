import { useState, useRef, useEffect } from 'react'
import { AlertTriangle, Bot, User, Send, Sparkles } from 'lucide-react'
import ConnectingNotice from '../components/ConnectingNotice.jsx'
import { apiJson } from '../utils/api.js'
import { loadList, saveList } from '../utils/storage.js'

const MESSAGE_HISTORY_KEY = 'medicare-ai-assistant-messages'

const SUGGESTION_ANSWERS = {
  'How can I improve my sleep routine?': 'Keep a consistent sleep and wake time, dim screens before bed, avoid caffeine late in the day, and make your bedroom cool, quiet, and comfortable. If sleep problems continue, discuss them with a healthcare professional.',
  'What are simple ways to stay hydrated?': 'Keep water nearby, drink regularly throughout the day, and add water-rich foods such as fruit, soup, or vegetables. Your fluid needs can vary with activity, weather, and health conditions.',
  'How should I prepare for my next doctor visit?': 'Write down your main concerns, current medicines, allergies, recent symptoms, and questions. Bring relevant readings such as blood pressure or glucose, and note when symptoms started or changed.',
  'What can help me manage everyday stress?': 'Try a short walk, slow breathing, a regular sleep routine, time away from screens, and talking with someone you trust. If stress feels overwhelming or affects daily life, seek professional support.',
  'What are healthy habits for better energy?': 'Aim for regular meals, enough water, consistent sleep, and gentle movement. Increase activity gradually and ask for medical advice if tiredness is new, severe, or persistent.',
  'How can I remember my medicines?': 'Take medicines at the same time each day, use a pill organizer or phone reminder, and keep an updated medicine list. Never change a dose or stop a medicine without medical advice.',
  'What should I track about my symptoms?': 'Record the symptom, when it started, its intensity, possible triggers, what helps, and any related changes. A simple dated note can make your next healthcare conversation more useful.',
  'When should I contact a doctor?': 'Contact a healthcare professional for symptoms that are worsening, persistent, unusual for you, or affecting daily activities. Seek urgent help for severe breathing trouble, chest pain, confusion, or sudden weakness.',
}

function ChatBubble({ role, content, suggestions, onSuggestion }) {
  const isUser = role === 'user'
  const isQuotaNotice = !isUser && content.startsWith('The AI service has reached')

  if (isQuotaNotice) {
    const guidance = content.split('\n\nDisclaimer:')[0]
    return (
      <div className="flex items-start gap-2">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <AlertTriangle size={16} />
        </div>
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <p className="font-semibold">AI limit reached for today</p>
          <p className="mt-1 leading-relaxed">{guidance.replace('The AI service has reached its daily limit. ', '')}</p>
          <p className="mt-3 text-xs leading-relaxed text-amber-800">You can still use the tracker and symptom tools while the daily limit resets.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestions.slice(0, 2).map((suggestion) => (
              <button key={suggestion} type="button" onClick={() => onSuggestion(suggestion)} className="rounded-full border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100">
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
          isUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'rounded-tr-sm bg-blue-600 text-white'
            : 'rounded-tl-sm bg-gray-100 text-gray-800'
        }`}
      >
        {content}
      </div>
    </div>
  )
}

function LoadingBubble() {
  return (
    <div className="flex items-start gap-2">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-700">
        <Bot size={16} />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3">
        <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" />
        <span className="ml-2 text-xs text-gray-500">Preparing your answer</span>
      </div>
    </div>
  )
}

function AIAssistant() {
  const [messages, setMessages] = useState(() => loadList(MESSAGE_HISTORY_KEY, [{
    role: 'assistant',
    content: "Hi! I'm your MediCare AI assistant. Choose a suggestion for a quick saved answer, or type your own question.",
  }]))
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)
  const suggestionTimerRef = useRef(null)

  const suggestions = Object.keys(SUGGESTION_ANSWERS)

  useEffect(() => {
    saveList(MESSAGE_HISTORY_KEY, messages.slice(-30))
  }, [messages])

  useEffect(() => () => clearTimeout(suggestionTimerRef.current), [])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    setMessages((prev) => [...prev, { role: 'user', content: trimmed }])
    setInput('')
    setIsLoading(true)

    try {
      const data = await apiJson('/api/assistant/chat', {
        method: 'POST',
        body: JSON.stringify({ message: trimmed }),
      })
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.response || 'No response was returned. Please try again.',
        },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            err.message ||
            "Sorry, I couldn't reach the assistant right now. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const chooseSuggestion = (suggestion) => {
    if (isLoading) return
    setIsLoading(true)
    setMessages((prev) => [...prev, { role: 'user', content: suggestion }])
    suggestionTimerRef.current = setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', content: SUGGESTION_ANSWERS[suggestion] }])
      setIsLoading(false)
    }, 5000)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">AI Assistant</h1>
        <p className="text-sm text-gray-500">Ask a general health question.</p>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((msg, idx) => (
            <ChatBubble
              key={idx}
              role={msg.role}
              content={msg.content}
              suggestions={suggestions}
              onSuggestion={chooseSuggestion}
            />
          ))}

          {isLoading && (
            <LoadingBubble />
          )}

          {messages.length > 1 && !isLoading && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-900">
                <Sparkles size={16} className="text-blue-600" />
                Continue with a saved answer
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={`follow-up-${suggestion}`}
                    type="button"
                    onClick={() => chooseSuggestion(suggestion)}
                    className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-left text-xs font-medium text-blue-700 transition hover:border-blue-400 hover:bg-blue-100"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.length === 1 && !isLoading && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-900">
                <Sparkles size={16} className="text-blue-600" />
                Try asking about...
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => chooseSuggestion(suggestion)}
                    className="rounded-full border border-blue-200 bg-white px-3 py-2 text-left text-xs font-medium text-blue-700 transition hover:border-blue-400 hover:bg-blue-100"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your health question..."
              className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>

          <ConnectingNotice active={isLoading} />

          <p className="mt-2 text-center text-xs text-gray-400">
            This assistant provides general information only and is not a
            substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AIAssistant
