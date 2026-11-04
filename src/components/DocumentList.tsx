'use client'

import { Document } from '@/types'

export function DocumentList({
  documents,
  onSelect,
  onDelete,
}: {
  documents: Document[]
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
        >
          <div className="flex-1">
            <p className="font-medium truncate">{doc.filename}</p>
            <p className="text-sm text-gray-500">
              {doc.page_count} pages • {doc.language} • {new Date(doc.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-2 ml-4">
            <button
              onClick={() => onSelect(doc.id)}
              className="text-primary hover:text-primary/80 text-sm"
            >
              Chat
            </button>
            <button
              onClick={() => onDelete(doc.id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}