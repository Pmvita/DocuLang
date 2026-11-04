export interface Document {
  id: string
  user_id: string
  filename: string
  storage_path: string
  page_count: number
  language: 'en' | 'fr' | 'mixed'
  created_at: string
}

export interface DocumentChunk {
  id: string
  document_id: string
  content: string
  embedding: number[]
  page_number: number
  section_title: string | null
  language: 'en' | 'fr'
  chunk_index: number
  created_at: string
}

export interface ChunkWithScore extends DocumentChunk {
  similarity: number
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  language?: 'en' | 'fr'
  sources?: ChunkWithScore[]
}

export interface ComplianceFlag {
  type: 'deadline' | 'clearance' | 'mandatory_clause' | 'other'
  label: string
  value: string
  confidence: number
  source_chunk_id: string
}

export interface ExtractedCompliance {
  deadlines: ComplianceFlag[]
  clearances: ComplianceFlag[]
  mandatory_clauses: ComplianceFlag[]
  other: ComplianceFlag[]
}

export interface ChunkInput {
  content: string
  page_number: number
  section_title: string | null
  language: 'en' | 'fr'
  chunk_index: number
}