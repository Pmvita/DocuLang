import { streamChatOpenAI } from './openai-chat'
import { streamChatAnthropic } from './anthropic-chat'
import { ChatMessage, ChunkWithScore } from '@/types'

export async function* chat(
  messages: ChatMessage[],
  context: ChunkWithScore[],
  language: 'en' | 'fr'
): AsyncGenerator<string, void, unknown> {
  try {
    yield* streamChatOpenAI(messages, context, language)
  } catch (error) {
    console.error('OpenAI chat failed, falling back to Anthropic', error)
    yield* streamChatAnthropic(messages, context, language)
  }
}