jest.mock('@/lib/supabase/server', () => ({
  createServerClient: jest.fn(() => ({
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
      delete: jest.fn(),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(),
        })),
      })),
    })),
    rpc: jest.fn(),
  })),
}))

import { createDocument, getDocuments } from '@/lib/db/documents'

test('createDocument inserts and getDocuments returns it', async () => {
  const mockInsert = jest.fn(() => ({
    select: jest.fn(() => ({
      single: jest.fn().mockResolvedValue({
        data: { id: '1', user_id: 'test', filename: 'test.pdf', storage_path: 'test.pdf', page_count: 1, language: 'en' },
        error: null,
      }),
    })),
  }))

  const mockSelect = jest.fn(() => ({
    eq: jest.fn(() => ({
      order: jest.fn().mockResolvedValue({
        data: [{ id: '1', user_id: 'test', filename: 'test.pdf', storage_path: 'test.pdf', page_count: 1, language: 'en' }],
        error: null,
      }),
    })),
  }))

  const mockFrom = jest.fn(() => ({
    insert: mockInsert,
    select: mockSelect,
    delete: jest.fn(),
  }))

  const mockRpc = jest.fn()

  const { createServerClient } = require('@/lib/supabase/server')
  createServerClient.mockReturnValue({
    from: mockFrom,
    rpc: mockRpc,
  })

  const doc = await createDocument({
    userId: 'test',
    filename: 'test.pdf',
    storagePath: 'test.pdf',
    pageCount: 1,
    language: 'en',
  })
  expect(doc.id).toBe('1')

  const docs = await getDocuments('test')
  expect(docs.length).toBe(1)
  expect(docs[0].filename).toBe('test.pdf')
})