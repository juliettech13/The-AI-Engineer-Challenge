"use client"

import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
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
        <h1 className="text-2xl font-semibold">🤖 Jules bot</h1>
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
          <div className="flex items-center justify-center h-full text-[#121f1c]">
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
              className={`max-w-[80%] p-4 font-ubuntu-mono ${
                message.role === "user"
                  ? "bg-user-chat-bubble text-foreground"
                  : "bg-llm-chat-bubble text-foreground"
              }`}
            >
              {message.content ? (
                message.role === "assistant" ? (
                  <div className="prose dark:prose-invert max-w-none break-words font-ubuntu-mono prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-code:text-base prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-pre:p-3 prose-blockquote:border-l-4">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }: { children?: React.ReactNode }) => (
                          <p className="mb-2 last:mb-0">{children}</p>
                        ),
                        ul: ({ children }: { children?: React.ReactNode }) => (
                          <ul className="mb-2 list-disc list-inside">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }: { children?: React.ReactNode }) => (
                          <ol className="mb-2 list-decimal list-inside">
                            {children}
                          </ol>
                        ),
                        li: ({ children }: { children?: React.ReactNode }) => (
                          <li className="mb-1">{children}</li>
                        ),
                        code: ({
                          inline,
                          children,
                          ...props
                        }: {
                          inline?: boolean;
                          children?: React.ReactNode;
                          [key: string]: any;
                        }) => {
                          if (inline) {
                            return (
                              <code
                                className="bg-muted px-1 py-0.5 rounded text-base"
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          }
                          return (
                            <code
                              className="block bg-muted p-3 rounded overflow-x-auto text-base"
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        },
                        pre: ({ children }: { children?: React.ReactNode }) => (
                          <pre className="bg-muted p-3 rounded overflow-x-auto mb-2">
                            {children}
                          </pre>
                        ),
                        blockquote: ({
                          children,
                        }: {
                          children?: React.ReactNode;
                        }) => (
                          <blockquote className="border-l-4 border-muted-foreground pl-4 italic my-2">
                            {children}
                          </blockquote>
                        ),
                        h1: ({ children }: { children?: React.ReactNode }) => (
                          <h1 className="text-2xl font-bold mb-3 mt-4">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }: { children?: React.ReactNode }) => (
                          <h2 className="text-xl font-bold mb-2 mt-3">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }: { children?: React.ReactNode }) => (
                          <h3 className="text-lg font-bold mb-2 mt-3">
                            {children}
                          </h3>
                        ),
                        strong: ({
                          children,
                        }: {
                          children?: React.ReactNode;
                        }) => (
                          <strong className="font-semibold">{children}</strong>
                        ),
                        em: ({ children }: { children?: React.ReactNode }) => (
                          <em className="italic">{children}</em>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                )
              ) : (
                <span className="text-muted-foreground">Thinking...</span>
              )}
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
            className="min-h-[60px] resize-none font-ubuntu-mono bg-[#F7CCD7]"
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
  );
}

