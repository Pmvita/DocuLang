import Anthropic from '@anthropic-ai/sdk'

export const ANTHROPIC_CHAT_MODEL = 'claude-3-5-haiku-20241022'

let anthropicClient: Anthropic | null = null

export function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }
  return anthropicClient
}