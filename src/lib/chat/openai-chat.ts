import { getOpenAIClient, CHAT_MODEL } from '@/lib/openai'
import { ChatMessage, ChunkWithScore } from '@/types'

export async function* streamChatOpenAI(
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

  const openai = getOpenAIClient()
  const stream = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    stream: true,
    temperature: 0.3,
  })

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content || ''
    if (text) yield text
  }
}