'use client'

import { useState, useEffect, useCallback } from 'react'
import { Document } from '@/types'

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/documents')
      if (res.ok) {
        const data = await res.json()
        setDocuments(data)
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const uploadDocument = useCallback(async (file: File) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        await fetchDocuments()
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsLoading(false)
    }
  }, [fetchDocuments])

  const deleteDocument = useCallback(async (id: string) => {
    try {
      await fetch(`/api/documents/${id}`, { method: 'DELETE' })
      setDocuments((prev) => prev.filter((doc) => doc.id !== id))
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }, [])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  return { documents, uploadDocument, deleteDocument, isLoading, refetch: fetchDocuments }
}