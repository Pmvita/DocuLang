create or replace function search_document_chunks(
  query_embedding vector(1536),
  match_count int,
  filter_user_id uuid
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  page_number int,
  section_title text,
  language text,
  chunk_index int,
  similarity float
)
language sql stable
as $$
  select
    document_chunks.id,
    document_chunks.document_id,
    document_chunks.content,
    document_chunks.page_number,
    document_chunks.section_title,
    document_chunks.language,
    document_chunks.chunk_index,
    1 - (document_chunks.embedding <=> query_embedding) as similarity
  from document_chunks
  inner join documents on documents.id = document_chunks.document_id
  where documents.user_id = filter_user_id
  order by document_chunks.embedding <=> query_embedding
  limit match_count;
$$;