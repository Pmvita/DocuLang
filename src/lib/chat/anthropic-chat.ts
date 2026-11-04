import { anthropic, ANTHROPIC_CHAT_MODEL } from '@/lib/anthropic'
import { ChatMessage, ChunkWithScore } from '@/types'

export async function* streamChatAnthropic(
  messages: ChatMessage[],
  context: ChunkWithScore[],
  language: 'en' | 'fr'
): AsyncGenerator<string, void, unknown> {
  const contextText = context
    .map((chunk) => `[Page ${chunk.page_number}] ${chunk.content}`)
    .join('\n\n')

  const systemPrompt = language === 'fr'
    ? `Vous êtes un assistant IA bilingue spécialisé dans les documents d'approvisionnement du gouvernement canadien. Utilisez uniquement le contexte suivant pour répondre.\n\nContexte :\n${contextText}`
    : `You are a bilingual AI assistant specialized in Canadian government procurement documents. Use only the following context to answer.\n\nContext:\n${contextText}`

  const stream = anthropic.messages.stream({
    model: ANTHROPIC_CHAT_MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  })

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      yield event.delta.text
    }
  }
}