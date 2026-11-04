jest.mock('next/headers', () => ({
  cookies: () => ({
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
  }),
}))

jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(() => ({
    auth: { getUser: jest.fn() },
  })),
}))

import { createServerClient } from '@/lib/supabase/server'

test('createServerClient returns typed client', async () => {
  const client = await createServerClient()
  expect(client).toBeDefined()
  expect(typeof client.auth.getUser).toBe('function')
})