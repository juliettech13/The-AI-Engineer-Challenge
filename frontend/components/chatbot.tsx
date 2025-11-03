"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Settings } from "lucide-react"
import { SettingsDialog } from "./settings-dialog"
import { streamChat } from "@/lib/api"
import type { ChatRequest } from "@/lib/api"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [settings, setSettings] = useState({
    apiKey: "",
    developerMessage: "",
    model: "gpt-4o-mini",
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentMessageRef = useRef<string>("")

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("chatbot-settings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(parsed)
      } catch (error) {
        console.error("Failed to parse saved settings", error)
      }
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatbot-settings", JSON.stringify(settings))
  }, [settings])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    if (!settings.apiKey) {
      setIsSettingsOpen(true)
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Create assistant message placeholder
    const assistantMessageId = (Date.now() + 1).toString()
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    currentMessageRef.current = ""

    const chatRequest: ChatRequest = {
      developer_message: settings.developerMessage || "",
      user_message: userMessage.content,
      model: settings.model,
      api_key: settings.apiKey,
    }

    try {
      await streamChat(
        chatRequest,
        (chunk) => {
          currentMessageRef.current += chunk
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: currentMessageRef.current }
                : msg
            )
          )
        },
        (error) => {
          console.error("Chat error:", error)
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: `Error: ${error.message}` }
                : msg
            )
          )
          setIsLoading(false)
        }
      )
    } catch (error) {
      console.error("Stream chat exception:", error)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`,
              }
            : msg
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-semibold">AI Chatbot</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSettingsOpen(true)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center space-y-2">
              <p className="text-lg">Start a conversation</p>
              <p className="text-sm">
                Type a message below to begin chatting with AI
              </p>
            </div>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <Card
              className={`max-w-[80%] p-4 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card"
              }`}
            >
              <div className="whitespace-pre-wrap break-words">
                {message.content || (
                  <span className="text-muted-foreground">Thinking...</span>
                )}
              </div>
            </Card>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here... (Enter to send, Shift+Enter for new line)"
            className="min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="self-end"
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>

      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  )
}

