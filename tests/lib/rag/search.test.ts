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

jest.mock('@/lib/db/documents', () => ({
  searchChunks: jest.fn(() => [
    {
      id: '1',
      document_id: 'doc-1',
      content: 'test content',
      page_number: 1,
      section_title: null,
      language: 'en',
      chunk_index: 0,
      similarity: 0.9,
    },
  ]),
}))

import { searchSimilar } from '@/lib/rag/search'

test('searchSimilar returns chunks with similarity scores', async () => {
  const results = await searchSimilar('test query', 'user-123', 3)
  expect(results.length).toBeLessThanOrEqual(3)
  expect(results[0].similarity).toBeDefined()
  expect(typeof results[0].similarity).toBe('number')
})