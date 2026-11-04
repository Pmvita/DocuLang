import { createServerClient } from '@/lib/supabase/server'
import { Document, DocumentChunk, ChunkInput } from '@/types'

export async function createDocument(data: {
  userId: string
  filename: string
  storagePath: string
  pageCount: number
  language: Document['language']
}): Promise<Document> {
  const supabase = createServerClient()
  const { data: doc, error } = await supabase
    .from('documents')
    .insert({
      user_id: data.userId,
      filename: data.filename,
      storage_path: data.storagePath,
      page_count: data.pageCount,
      language: data.language,
    })
    .select()
    .single()

  if (error) throw error
  return doc as Document
}

export async function getDocuments(userId: string): Promise<Document[]> {
  const supabase = createServerClient()
  const { data: docs, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (docs || []) as Document[]
}

export async function deleteDocument(documentId: string, userId: string): Promise<void> {
  const supabase = createServerClient()
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId)
    .eq('user_id', userId)

  if (error) throw error
}

export async function createChunks(documentId: string, chunks: ChunkInput[]): Promise<DocumentChunk[]> {
  const supabase = createServerClient()
  const rows = chunks.map((chunk) => ({
    document_id: documentId,
    content: chunk.content,
    page_number: chunk.page_number,
    section_title: chunk.section_title,
    language: chunk.language,
    chunk_index: chunk.chunk_index,
  }))

  const { data: inserted, error } = await supabase
    .from('document_chunks')
    .insert(rows)
    .select()

  if (error) throw error
  return (inserted || []) as DocumentChunk[]
}

export async function searchChunks(
  queryEmbedding: number[],
  userId: string,
  k = 5
): Promise<Array<DocumentChunk & { similarity: number }>> {
  const supabase = createServerClient()
  const { data, error } = await supabase.rpc('search_document_chunks', {
    query_embedding: queryEmbedding,
    match_count: k,
    filter_user_id: userId,
  })

  if (error) throw error
  return (data || []) as Array<DocumentChunk & { similarity: number }>
}