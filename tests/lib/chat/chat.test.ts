jest.mock('@/lib/openai', () => ({
  openai: {
    chat: {
      completions: {
        create: jest.fn(async function* () {
          yield { choices: [{ delta: { content: 'deadline' } }] }
        }),
      },
    },
  },
  CHAT_MODEL: 'gpt-4o-mini',
}))

jest.mock('@/lib/anthropic', () => ({
  anthropic: {
    messages: {
      stream: jest.fn(async function* () {
        yield { type: 'content_block_delta', delta: { type: 'text_delta', text: 'fallback' } }
      }),
    },
  },
  ANTHROPIC_CHAT_MODEL: 'claude-3-5-haiku-20241022',
}))

import { chat } from '@/lib/chat/chat'

test('chat streams response in detected language', async () => {
  const stream = chat([{ role: 'user', content: 'What is the deadline?' }], [], 'en')
  const chunks = []
  for await (const chunk of stream) chunks.push(chunk)
  expect(chunks.join('')).toContain('deadline')
})