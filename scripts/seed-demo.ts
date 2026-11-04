import { createServerClient } from '@/lib/supabase/server'

async function main() {
  // Minimal valid PDF with procurement-like text
  const pdfBuffer = Buffer.from(
    '%PDF-1.4\n' +
    '1 0 obj\n' +
    '<< /Type /Catalog /Pages 2 0 R >>\n' +
    'endobj\n' +
    '2 0 obj\n' +
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>\n' +
    'endobj\n' +
    '3 0 obj\n' +
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\n' +
    'endobj\n' +
    '4 0 obj\n' +
    '<< /Length 200 >>\n' +
    'stream\n' +
    'BT\n' +
    '/F1 12 Tf\n' +
    '100 700 Td\n' +
    '(Government Procurement Document) Tj\n' +
    '0 -20 Td\n' +
    '(Deadline: December 31, 2026) Tj\n' +
    '0 -20 Td\n' +
    '(Security Clearance: Secret) Tj\n' +
    '0 -20 Td\n' +
    '(This is a mandatory requirement for all bidders.) Tj\n' +
    'ET\n' +
    'endstream\n' +
    'endobj\n' +
    'xref\n' +
    '0 5\n' +
    '0000000000 65535 f \n' +
    '0000000009 00000 n \n' +
    '0000000058 00000 n \n' +
    '0000000115 00000 n \n' +
    '0000000214 00000 n \n' +
    'trailer\n' +
    '<< /Size 5 /Root 1 0 R >>\n' +
    'startxref\n' +
    '314\n' +
    '%%EOF'
  )

  // Create a test user first (or use existing)
  const supabase = createServerClient()
  
  // Upload via API
  const formData = new FormData()
  formData.append('file', new Blob([pdfBuffer], { type: 'application/pdf' }), 'sample-procurement.pdf')

  const res = await fetch('http://localhost:3000/api/documents/upload', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    console.error('Upload failed:', await res.text())
    process.exit(1)
  }

  const result = await res.json()
  console.log('✓ Uploaded document:', result)

  // Test chat
  const chatRes = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'What is the deadline?' }],
      documentId: result.documentId,
    }),
  })

  if (!chatRes.ok) {
    console.error('Chat failed:', await chatRes.text())
    process.exit(1)
  }

  const reader = chatRes.body?.getReader()
  const decoder = new TextDecoder()
  let chatText = ''

  while (true) {
    const { done, value } = await reader?.read() || {}
    if (done) break
    chatText += decoder.decode(value)
  }

  console.log('✓ Chat response:', chatText)
  console.log('\n✓ Demo seeding complete!')
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})