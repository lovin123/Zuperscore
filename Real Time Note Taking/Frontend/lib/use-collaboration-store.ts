import { create } from "zustand"

export interface ChatMessage {
  id: string
  user: string
  role: "Teacher" | "Student"
  message: string
  timestamp: number
}

export interface User {
  name: string
  role: "Teacher" | "Student"
}

interface CollaborationState {
  // Session data
  sessionId: string | null
  currentUser: User | null
  content: string
  chat: ChatMessage[]

  // Typing indicators
  typingUsers: string[]

  // Connection status
  isConnected: boolean

  // Actions
  setSessionId: (sessionId: string) => void
  setCurrentUser: (user: User) => void
  setContent: (content: string) => void
  addChatMessage: (message: ChatMessage) => void
  setChatMessages: (messages: ChatMessage[]) => void
  addTypingUser: (user: string) => void
  removeTypingUser: (user: string) => void
  setConnected: (connected: boolean) => void
  resetStore: () => void
}

export const useCollaborationStore = create<CollaborationState>((set, get) => ({
  // Initial state
  sessionId: null,
  currentUser: null,
  content: "",
  chat: [],
  typingUsers: [],
  isConnected: false,

  // Actions
  setSessionId: (sessionId) => set({ sessionId }),

  setCurrentUser: (user) => set({ currentUser: user }),

  setContent: (content) => set({ content }),

  addChatMessage: (message) =>
    set((state) => ({
      chat: [...state.chat, message],
    })),

  setChatMessages: (messages) => set({ chat: messages }),

  addTypingUser: (user) =>
    set((state) => ({
      typingUsers: state.typingUsers.includes(user) ? state.typingUsers : [...state.typingUsers, user],
    })),

  removeTypingUser: (user) =>
    set((state) => ({
      typingUsers: state.typingUsers.filter((u) => u !== user),
    })),

  setConnected: (connected) => set({ isConnected: connected }),

  resetStore: () =>
    set({
      sessionId: null,
      currentUser: null,
      content: "",
      chat: [],
      typingUsers: [],
      isConnected: false,
    }),
}))
