import { useState, useRef, useEffect } from 'react'
import { Bot, User, Send } from 'lucide-react'
import ConnectingNotice from '../components/ConnectingNotice.jsx'
import { apiJson } from '../utils/api.js'

function ChatBubble({ role, content }) {
  const isUser = role === 'user'
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

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">AI Assistant</h1>
        <p className="text-sm text-gray-500">Ask a general health question.</p>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((msg, idx) => (
            <ChatBubble key={idx} role={msg.role} content={msg.content} />
          ))}

          {isLoading && (
            <ChatBubble
              role="assistant"
              content="Connecting to server (waking up instance)..."
            />
          )}

          <div ref={scrollRef} />
        </div>

        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <textarea
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
