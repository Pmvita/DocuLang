jest.mock('franc-min', () => ({
  franc: jest.fn(() => 'eng'),
}))

jest.mock('unpdf', () => ({
  extractText: jest.fn(() => ({
    text: ['Page 1 text', 'Page 2 text'],
    totalPages: 2,
  })),
}))

import { extractTextFromPDF } from '@/lib/pdf/extract'

test('extractTextFromPDF returns pages with text', async () => {
  const pdfBuffer = Buffer.from('%PDF-1.4...')
  const result = await extractTextFromPDF(pdfBuffer)
  expect(result.pages.length).toBeGreaterThan(0)
  expect(result.pages[0].text).toBeTruthy()
})