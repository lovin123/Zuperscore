"use client";

import { useEffect, useCallback, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useCollaborationStore } from "@/lib/use-collaboration-store";
import { initializeSocket, disconnectSocket } from "@/lib/socket";
import TextEditor from "@/components/text-editor";
import ChatWindow from "@/components/chat-window";
import TypingIndicator from "@/components/typing-indicator";
import RoleSelector from "@/components/role-selector";
import { toast } from "sonner";

export default function CollaborationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = params.sessionId as string;

  const {
    currentUser,
    setSessionId,
    setCurrentUser,
    setContent,
    addChatMessage,
    setChatMessages,
    addTypingUser,
    removeTypingUser,
    setConnected,
    resetStore,
    isConnected,
  } = useCollaborationStore();

  const socketInitializedRef = useRef(false);

  // Initialize session ID only once
  useEffect(() => {
    if (sessionId && !useCollaborationStore.getState().sessionId) {
      setSessionId(sessionId);
    }
  }, [sessionId, setSessionId]);

  // Check for query params only once
  useEffect(() => {
    if (!currentUser) {
      const role = searchParams.get("role") as "Teacher" | "Student" | null;
      const name = searchParams.get("name");

      if (role && name) {
        setCurrentUser({ name, role });
      }
    }
  }, [searchParams, currentUser, setCurrentUser]);

  // Memoized socket event handlers
  const handleSessionJoined = useCallback(
    (data: any) => {
      if (data.content) {
        setContent(data.content);
      }
      if (data.chat) {
        setChatMessages(data.chat);
      }
      toast.success("Successfully joined the session!");
    },
    [setContent, setChatMessages]
  );

  const handleTextChange = useCallback(
    (data: any) => {
      setContent(data);
    },
    [setContent]
  );

  const handleChatMessage = useCallback(
    (message: any) => {
      addChatMessage({
        id: `${message.timestamp}-${message.user}`,
        user: message.user,
        role: message.role,
        message: message.message,
        timestamp: message.timestamp,
      });
    },
    [addChatMessage]
  );

  const handleTyping = useCallback(
    (data: any) => {
      addTypingUser(data);
    },
    [addTypingUser]
  );

  const handleStopTyping = useCallback(
    (data: any) => {
      removeTypingUser(data);
    },
    [removeTypingUser]
  );

  const handleUserJoined = useCallback((data: any) => {
    toast.info(`${data} joined the session`);
  }, []);

  const handleUserLeft = useCallback(
    (data: any) => {
      toast.info(`${data} left the session`);
      removeTypingUser(data);
    },
    [removeTypingUser]
  );

  // Socket connection effect
  useEffect(() => {
    if (!currentUser || !sessionId || socketInitializedRef.current) {
      return;
    }

    const socket = initializeSocket();

    // Connection events
    const handleConnect = () => {
      setConnected(true);
      socket.emit("join-session", {
        sessionId,
        user: currentUser.name,
        role: currentUser.role,
      });
    };

    const handleDisconnect = () => {
      setConnected(false);
    };

    // Set up event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("session-joined", handleSessionJoined);
    socket.on("text-change", handleTextChange);
    socket.on("chat-message", handleChatMessage);
    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);
    socket.on("user-joined", handleUserJoined);
    socket.on("user-left", handleUserLeft);

    socketInitializedRef.current = true;

    // Cleanup function
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("session-joined", handleSessionJoined);
      socket.off("text-change", handleTextChange);
      socket.off("chat-message", handleChatMessage);
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);
      socket.off("user-joined", handleUserJoined);
      socket.off("user-left", handleUserLeft);

      disconnectSocket();
      socketInitializedRef.current = false;
    };
  }, [
    currentUser,
    sessionId,
    setConnected,
    handleSessionJoined,
    handleTextChange,
    handleChatMessage,
    handleTyping,
    handleStopTyping,
    handleUserJoined,
    handleUserLeft,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetStore();
    };
  }, [resetStore]);

  const handleRoleSelect = useCallback(
    (name: string, role: "Teacher" | "Student") => {
      setCurrentUser({ name, role });
    },
    [setCurrentUser]
  );

  // Show role selector if user hasn't selected a role
  if (!currentUser) {
    return <RoleSelector onRoleSelect={handleRoleSelect} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Collaboration Session
            </h1>
            <p className="text-sm text-gray-600">
              Session ID: {sessionId} | Role: {currentUser.role} | Name:{" "}
              {currentUser.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-sm text-gray-600">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Text Editor - Takes more space */}
        <div className="flex-1 lg:flex-[2] border-r border-gray-200">
          <TextEditor />
        </div>

        {/* Chat Window - Takes less space */}
        <div className="h-64 lg:h-auto lg:flex-1 flex flex-col border-t lg:border-t-0">
          <ChatWindow />
          <TypingIndicator />
        </div>
      </div>
    </div>
  );
}
