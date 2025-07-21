"use client";

import { useCollaborationStore } from "@/lib/use-collaboration-store";

export default function TypingIndicator() {
  const { typingUsers, currentUser } = useCollaborationStore();
  console.log(typingUsers);

  // Filter out current user from typing indicators
  const otherTypingUsers = typingUsers.filter(
    (user) => user !== currentUser?.name
  );

  if (otherTypingUsers.length === 0) return null;

  return (
    <div className="px-4 py-2 text-sm text-gray-600 italic border-t bg-gray-50">
      {otherTypingUsers.length === 1
        ? `${otherTypingUsers[0]} is typing...`
        : `${otherTypingUsers.join(", ")} are typing...`}
    </div>
  );
}
