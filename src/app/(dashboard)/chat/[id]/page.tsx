'use client'

import { useChat } from '@/hooks/useChat'
import { ChatPanel } from '@/components/ChatPanel'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function ChatPage() {
  const params = useParams()
  const { messages, sendMessage, isLoading } = useChat(params.id as string)

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Chat</h2>
        <Link href="/dashboard" className="text-primary hover:underline">
          ← Back to Documents
        </Link>
      </div>
      <div className="border rounded-lg h-full bg-white">
        <ChatPanel messages={messages} onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  )
}