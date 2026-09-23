import { useState, useRef, useEffect } from 'react'
import { AlertTriangle, Bot, User, Send, Sparkles } from 'lucide-react'
import ConnectingNotice from '../components/ConnectingNotice.jsx'
import { apiJson } from '../utils/api.js'

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

function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your MediCare AI assistant. How can I help you today?",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  const suggestions = [
    'How can I improve my sleep routine?',
    'What are simple ways to stay hydrated?',
    'How should I prepare for my next doctor visit?',
    'What can help me manage everyday stress?',
  ]

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
    setInput(suggestion)
    inputRef.current?.focus()
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
            <ChatBubble
              role="assistant"
              content="Connecting to server (waking up instance)..."
            />
          )}

          {messages.length === 1 && !isLoading && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-900">
                <Sparkles size={16} className="text-blue-600" />
                Try asking about...
              </div>
              <div className="flex flex-wrap gap-2">
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
