import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const ANTHROPIC_CHAT_MODEL = 'claude-3-5-haiku-20241022'