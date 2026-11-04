jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(() => ({
        data: { user: null },
      })),
    },
  })),
}))

jest.mock('next/server', () => ({
  NextRequest: class NextRequest extends Request {
    cookies = { get: jest.fn(), set: jest.fn(), remove: jest.fn() }
    nextUrl = new URL('http://localhost')
  },
  NextResponse: {
    redirect: (url) => new Response(null, { status: 307, headers: { location: url.toString() } }),
    next: () => new Response(null, { status: 200 }),
  },
}))

import { middleware } from '@/middleware'

test('middleware redirects unauthenticated to /login', async () => {
  const req = new Request('http://localhost/dashboard') as any
  const res = await middleware(req)
  expect(res.headers.get('location')).toContain('/login')
})