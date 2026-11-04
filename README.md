# DocuLang

**Bilingual AI Document Assistant for Canadian Government Procurement**

Upload a PDF (policy, form, contract) and get a Q&A chat in **English / French**. Summarizes documents, extracts key dates, and flags compliance issues — built for departments that need to move fast while respecting the *Official Languages Act*.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green?logo=supabase)](https://supabase.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?logo=openai)](https://openai.com/)
[![Anthropic](https://img.shields.io/badge/Anthropic-Claude_3.5_Haiku-d4a373?logo=anthropic)](https://www.anthropic.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Why DocuLang?

Canadian federal departments process thousands of pages of procurement documents, contracts, and policy forms. Most teams are stuck doing manual reviews, copying deadlines into spreadsheets, and hoping they didn’t miss a security-clearance requirement or mandatory clause.

**DocuLang turns that workload into a conversation.**

- **Bilingual by design** — detects English or French queries and responds in the same language.
- **RAG-powered answers** — grounded in your uploaded documents via pgvector + OpenAI embeddings.
- **Compliance-ready** — surfaces deadlines, clearance levels, and mandatory requirements automatically.
- **Dual LLM reliability** — OpenAI GPT-4o-mini primary, Anthropic Claude 3.5 Haiku fallback for gov continuity.

### Demo hook

> Upload a real government procurement document and ask:  
> *“What’s the deadline and what security clearance is needed?”*  
> DocuLang answers from the document itself, in English or French.

---

## Features

| Feature | Description |
|---|---|
| **PDF Upload** | Drag-and-drop or click to upload policy PDFs |
| **Bilingual Q&A** | Ask questions in EN or FR; answers match your language |
| **RAG Chat** | Context-aware responses using pgvector semantic search |
| **Key Extraction** | Auto-detects deadlines, clearance levels, and mandatory clauses |
| **Document Management** | List, view, and delete uploaded documents |
| **Auth Guarded** | Dashboard protected via Supabase auth middleware |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Backend** | Next.js API Routes (Server Actions ready) |
| **Database** | Supabase Postgres + pgvector |
| **Embeddings** | OpenAI `text-embedding-3-small` (1536 dim) |
| **Chat** | OpenAI GPT-4o-mini → Anthropic Claude 3.5 Haiku fallback |
| **PDF Pipeline** | unpdf + franc-min language detection |
| **Testing** | Jest + ts-jest + Testing Library |

---

## Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/doculang.git
cd doculang
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase, OpenAI, and Anthropic credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run database migrations

Apply the Supabase migrations in `supabase/migrations/` to create:
- `documents`
- `document_chunks` (with `vector(1536)` and cosine similarity index)

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Lint codebase |
| `npm test` | Run test suite |

---

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/          # Protected dashboard routes
│   ├── api/                  # API routes (upload, chat, documents)
│   ├── auth/                 # Supabase auth callback
│   ├── login/                # Login page
│   ├── layout.tsx
│   └── globals.css
├── components/               # Reusable UI components
├── hooks/                    # React hooks (chat, documents)
├── lib/
│   ├── anthropic.ts          # Anthropic client
│   ├── chat/                 # Chat system prompts + streaming
│   ├── db/                   # Document & chunk DB layer
│   ├── openai.ts             # OpenAI client
│   ├── pdf/                  # Extraction + chunking
│   ├── rag/                  # Embeddings + vector search
│   └── supabase/             # Server + browser clients
├── middleware.ts             # Auth middleware
└── types/                    # TypeScript types
```

---

## Testing

All features are covered by unit and integration tests:

```bash
npm test
```

Current coverage includes:
- Supabase server/browser clients
- PDF extraction and chunking
- RAG embedding and vector search
- Chat streaming (OpenAI + Anthropic fallback)
- API routes (upload, chat, document list/delete)
- Middleware auth guards
- UI components

---

## Security & Privacy

- `.env` and secrets are **never** committed.
- Sensitive planning documents are excluded via `.gitignore`.
- Use `SUPABASE_SERVICE_ROLE_KEY` only in server-side code.
- Row-level security should be enforced in Supabase for production.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Contributing

Contributions are welcome. Please open an issue or PR.

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

*Built for the Canadian government AI Source List — machine interactions + cognitive automation.*
