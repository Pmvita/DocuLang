-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Documents table
create table documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  filename text not null,
  storage_path text not null,
  page_count int,
  language text check (language in ('en', 'fr', 'mixed')),
  created_at timestamptz default now()
);

-- Document chunks with pgvector
create table document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  content text not null,
  embedding vector(1536),
  page_number int,
  section_title text,
  language text check (language in ('en', 'fr')),
  chunk_index int not null,
  created_at timestamptz default now()
);

-- Index for similarity search
create index on document_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- Index for document lookups
create index on documents(user_id, created_at desc);

-- Index for chunk lookups by document
create index on document_chunks(document_id, chunk_index);