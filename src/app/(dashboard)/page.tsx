'use client'

import { UploadZone } from '@/components/UploadZone'
import { DocumentList } from '@/components/DocumentList'
import { useDocuments } from '@/hooks/useDocuments'
import Link from 'next/link'

export default function DashboardPage() {
  const { documents, uploadDocument, deleteDocument } = useDocuments()

  const handleUpload = async (file: File) => {
    await uploadDocument(file)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
        <p className="text-gray-600 mt-1">Upload and manage your documents</p>
      </div>

      <UploadZone onUpload={handleUpload} />

      <div>
        <h3 className="text-lg font-semibold mb-4">Your Documents</h3>
        <DocumentList
          documents={documents}
          onSelect={(id) => {
            window.location.href = `/dashboard/chat/${id}`
          }}
          onDelete={deleteDocument}
        />
      </div>
    </div>
  )
}