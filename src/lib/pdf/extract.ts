import { extractText } from 'unpdf'
import { franc } from 'franc-min'

export interface PDFExtractResult {
  pages: Array<{ pageNumber: number; text: string }>
  language: 'en' | 'fr' | 'mixed'
}

export async function extractTextFromPDF(buffer: Buffer): Promise<PDFExtractResult> {
  const { text, totalPages } = await extractText(buffer, { mergePages: false })

  const pages = text.map((pageText: string, index: number) => ({
    pageNumber: index + 1,
    text: pageText.trim(),
  }))

  // Detect language from first few pages
  const sampleText = pages.slice(0, 3).map((p) => p.text).join(' ')
  const detected = detectLanguage(sampleText)

  return { pages, language: detected }
}

function detectLanguage(text: string): 'en' | 'fr' | 'mixed' {
  if (!text || text.length < 50) return 'en'

  const lang = franc(text, { only: ['eng', 'fra'] })
  if (lang === 'eng') return 'en'
  if (lang === 'fra') return 'fr'
  return 'mixed'
}