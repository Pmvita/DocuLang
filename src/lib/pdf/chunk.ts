import { ChunkInput } from '@/types'

const CHUNK_SIZE = 500
const CHUNK_OVERLAP = 50

export function chunkPages(
  pages: Array<{ pageNumber: number; text: string }>,
  options?: { chunkSize?: number; overlap?: number }
): ChunkInput[] {
  const chunkSize = options?.chunkSize ?? CHUNK_SIZE
  const overlap = options?.overlap ?? CHUNK_OVERLAP
  const chunks: ChunkInput[] = []

  for (const page of pages) {
    const sections = splitByHeadings(page.text)
    for (const section of sections) {
      const pageChunks = splitIntoChunks(section.text, chunkSize, overlap)
      for (const chunkText of pageChunks) {
        chunks.push({
          content: chunkText,
          page_number: page.pageNumber,
          section_title: section.title || null,
          language: 'en',
          chunk_index: chunks.length,
        })
      }
    }
  }

  return chunks
}

interface Section {
  title: string | null
  text: string
}

function splitByHeadings(text: string): Section[] {
  const headingRegex = /^#{1,3}\s+.*$/gm
  const matches = Array.from(text.matchAll(headingRegex))

  if (matches.length === 0) {
    return [{ title: null, text }]
  }

  const sections: Section[] = []
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length
    const heading = matches[i][0].replace(/^#+\s+/, '')
    sections.push({
      title: heading,
      text: text.slice(start, end).trim(),
    })
  }

  return sections
}

function splitIntoChunks(text: string, chunkSize: number, overlap: number): string[] {
  if (text.length <= chunkSize) return [text]

  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    chunks.push(text.slice(start, end))
    start += chunkSize - overlap
  }

  return chunks
}