"use client"

import { useEffect, useRef, useCallback } from "react"
import { useForm } from "react-hook-form"
import { useCollaborationStore } from "@/lib/use-collaboration-store"
import { getSocket } from "@/lib/socket"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChatFormData {
  message: string
}

export default function ChatWindow() {
  const { chat, sessionId, currentUser } = useCollaborationStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { register, handleSubmit, reset } = useForm<ChatFormData>()
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [chat, scrollToBottom])

  const onSubmit = useCallback(
    (data: ChatFormData) => {
      if (!data.message.trim() || !currentUser || !sessionId) return

      try {
        const socket = getSocket()
        const chatMessage = {
          sessionId,
          user: currentUser.name,
          role: currentUser.role,
          message: data.message.trim(),
          timestamp: Date.now(),
        }

        socket.emit("chat-message", chatMessage)
        reset()
      } catch (error) {
        console.error("Socket error:", error)
      }
    },
    [currentUser, sessionId, reset],
  )

  const handleInputChange = useCallback(() => {
    if (!currentUser || !sessionId) return

    try {
      const socket = getSocket()
      socket.emit("typing", {
        sessionId,
        user: currentUser.name,
      })

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Set new timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stop-typing", {
          sessionId,
          user: currentUser.name,
        })
      }, 2000)
    } catch (error) {
      console.error("Socket error:", error)
    }
  }, [currentUser, sessionId])

  const getRoleColor = useCallback((role: "Teacher" | "Student") => {
    return role === "Teacher" ? "bg-green-500" : "bg-blue-500"
  }, [])

  const formatTime = useCallback((timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }, [])

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="bg-gray-50 px-4 py-2 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Chat</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chat.map((message) => (
          <div key={message.id} className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-1 rounded-full text-xs text-white ${getRoleColor(message.role)}`}>
                {message.role}
              </span>
              <span className="text-sm font-medium text-gray-700">{message.user}</span>
              <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
            </div>
            <div className="bg-gray-100 rounded-lg p-3 ml-4">
              <p className="text-gray-800">{message.message}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
          <Input
            {...register("message", { required: true })}
            placeholder="Type your message..."
            className="flex-1"
            onChange={handleInputChange}
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  )
}
