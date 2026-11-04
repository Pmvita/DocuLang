jest.mock('@/lib/openai', () => ({
  openai: {
    embeddings: {
      create: jest.fn(() => ({
        data: [{ embedding: new Array(1536).fill(0) }],
      })),
    },
  },
  EMBEDDING_MODEL: 'text-embedding-3-small',
}))

import { embedChunks } from '@/lib/rag/embed'

test('embedChunks returns 1536-dim vectors', async () => {
  const embeddings = await embedChunks([{
    content: 'test',
    page_number: 1,
    section_title: null,
    language: 'en',
    chunk_index: 0,
  }])
  expect(embeddings[0].length).toBe(1536)
})