jest.mock('next/server', () => ({
  NextRequest: class NextRequest extends Request {
    cookies = {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
    }
    nextUrl = new URL('http://localhost')
  } as any,
  NextResponse: {
    json: jest.fn((data, init) => new Response(JSON.stringify(data), { status: init?.status || 200, headers: { 'Content-Type': 'application/json' } })),
  } as any,
}))

jest.mock('@/lib/supabase/server', () => ({
  createServerClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(() => ({
        data: { user: { id: 'test-user' } },
      })),
    },
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(() => ({ error: null })),
      })),
    },
  })),
}))

jest.mock('@/lib/pdf/extract', () => ({
  extractTextFromPDF: jest.fn(() => ({
    pages: [{ pageNumber: 1, text: 'test' }],
    language: 'en',
  })),
}))

jest.mock('@/lib/pdf/chunk', () => ({
  chunkPages: jest.fn(() => [
    { content: 'chunk1', page_number: 1, section_title: null, language: 'en', chunk_index: 0 },
  ]),
}))

jest.mock('@/lib/rag/embed', () => ({
  embedChunks: jest.fn(() => [[0.1, 0.2]]),
}))

jest.mock('@/lib/db/documents', () => ({
  createDocument: jest.fn(() => ({ id: 'doc-1' })),
  createChunks: jest.fn(() => []),
}))

import { POST } from '@/app/api/documents/upload/route'

test('POST /api/documents/upload returns documentId', async () => {
  const formData = new FormData()
  formData.append('file', new Blob(['%PDF...'], { type: 'application/pdf' }), 'test.pdf')
  const req = new Request('http://localhost', { method: 'POST', body: formData }) as any
  const res = await POST(req)
  expect(res.status).toBe(200)
  const json = await res.json()
  expect(json.documentId).toBeDefined()
})