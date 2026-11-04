import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { searchSimilar } from '@/lib/rag/search'
import { chat } from '@/lib/chat/chat'
import { ChatMessage } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { messages, documentId } = (await request.json()) as {
      messages: ChatMessage[]
      documentId?: string
    }

    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')
    const language = detectLanguage(lastUserMessage?.content || 'en')

    let context = []
    if (documentId) {
      const query = lastUserMessage?.content || ''
      context = await searchSimilar(query, user.id, 5)
    }

    const stream = chat(messages, context, language)
    const encoder = new TextEncoder()

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`))
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Stream error:', error)
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat error:', error)
    return new Response('Chat failed', { status: 500 })
  }
}

function detectLanguage(text: string): 'en' | 'fr' {
  const lower = text.toLowerCase()
  const frenchWords = ['le', 'la', 'les', 'un', 'une', 'des', 'et', 'est', 'que', 'qui', 'dans', 'pour']
  const englishWords = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for']

  const frenchCount = frenchWords.filter((w) => lower.includes(w)).length
  const englishCount = englishWords.filter((w) => lower.includes(w)).length

  return frenchCount > englishCount ? 'fr' : 'en'
}