import { searchChunks } from '@/lib/db/documents'
import { embedQuery } from './embed'
import { ChunkWithScore } from '@/types'

export async function searchSimilar(
  query: string,
  userId: string,
  k = 5
): Promise<ChunkWithScore[]> {
  const queryEmbedding = await embedQuery(query)
  const results = await searchChunks(queryEmbedding, userId, k)

  return results.map((row) => ({
    ...row,
    similarity: row.similarity,
  }))
}