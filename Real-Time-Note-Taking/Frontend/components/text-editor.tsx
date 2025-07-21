"use client"

import type React from "react"
import { useEffect, useRef, useCallback } from "react"
import { useCollaborationStore } from "@/lib/use-collaboration-store"
import { getSocket } from "@/lib/socket"

export default function TextEditor() {
  const { content, setContent, sessionId, currentUser } = useCollaborationStore()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = e.target.value
      setContent(newContent)

      // Only emit if we have the required data
      if (!sessionId || !currentUser) return

      try {
        const socket = getSocket()
        socket.emit("text-change", {
          sessionId,
          content: newContent,
        })

        // Handle typing indicator
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
    },
    [setContent, sessionId, currentUser],
  )

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-50 px-4 py-2 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Shared Notes</h2>
      </div>
      <div className="flex-1 p-4">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing your notes here..."
          className="w-full h-full resize-none border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  )
}
