import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { extractTextFromPDF } from '@/lib/pdf/extract'
import { chunkPages } from '@/lib/pdf/chunk'
import { embedChunks } from '@/lib/rag/embed'
import { createDocument, createChunks } from '@/lib/db/documents'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const { pages, language } = await extractTextFromPDF(buffer)
    const chunks = chunkPages(pages)
    const embeddings = await embedChunks(chunks)

    // Attach embeddings to chunks
    const chunksWithEmbeddings = chunks.map((chunk, index) => ({
      ...chunk,
      embedding: embeddings[index],
    }))

    // Upload to Supabase Storage
    const filePath = `${user.id}/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, buffer, { contentType: file.type })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Create document record
    const document = await createDocument({
      userId: user.id,
      filename: file.name,
      storagePath: filePath,
      pageCount: pages.length,
      language,
    })

    // Store chunks with embeddings
    await createChunks(document.id, chunksWithEmbeddings)

    return NextResponse.json({
      documentId: document.id,
      chunkCount: chunks.length,
      pageCount: pages.length,
      language,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    )
  }
}