import { openai, EMBEDDING_MODEL } from '@/lib/openai'
import { ChunkInput } from '@/types'

export async function embedChunks(chunks: ChunkInput[]): Promise<number[][]> {
  if (chunks.length === 0) return []

  const texts = chunks.map((chunk) => chunk.content)
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  })

  return response.data.map((item) => item.embedding)
}

export async function embedQuery(query: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: query,
  })

  return response.data[0].embedding
}