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
  })),
}))

jest.mock('@/lib/rag/search', () => ({
  searchSimilar: jest.fn(() => []),
}))

jest.mock('@/lib/chat/chat', () => ({
  chat: jest.fn(async function* () {
    yield 'hello'
  }),
}))

import { POST } from '@/app/api/chat/route'

test('POST /api/chat returns streaming response', async () => {
  const req = new Request('http://localhost', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'Hello' }] }),
  }) as any
  const res = await POST(req)
  expect(res.status).toBe(200)
  expect(res.headers.get('Content-Type')).toContain('text/event-stream')
})