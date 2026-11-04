import { chunkPages } from '@/lib/pdf/chunk'

test('chunkPages splits text into chunks with page numbers', () => {
  const pages = [
    { pageNumber: 1, text: 'This is a long document. ' .repeat(100) },
    { pageNumber: 2, text: 'Second page content. ' .repeat(50) },
  ]
  const chunks = chunkPages(pages)
  expect(chunks.length).toBeGreaterThan(0)
  expect(chunks[0].page_number).toBe(1)
  expect(chunks[0].content.length).toBeGreaterThan(0)
})