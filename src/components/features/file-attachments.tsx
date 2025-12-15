'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { Heading } from '@/components/ui/heading'
import { deleteFileAttachment } from '@/actions/file-attachments'
import { useRouter } from 'next/navigation'
import {
  DocumentIcon,
  TrashIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/20/solid'

interface FileAttachment {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  url: string
  createdAt: Date
}

interface FileAttachmentsProps {
  entityType: string
  entityId: string
  files: FileAttachment[]
}

export function FileAttachments({ entityType, entityId, files: initialFiles }: FileAttachmentsProps) {
  const router = useRouter()
  const [files, setFiles] = useState(initialFiles)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('entityType', entityType)
      formData.append('entityId', entityId)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      // Add new file to list
      setFiles([data.fileAttachment, ...files])
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      router.refresh()
    } catch (error: any) {
      alert(`Upload error: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this file?')) {
      return
    }

    try {
      await deleteFileAttachment(id, entityType, entityId)
      setFiles(files.filter((f) => f.id !== id))
      router.refresh()
    } catch (error: any) {
      alert(`Delete error: ${error.message}`)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Heading level={2}>Files</Heading>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="file-upload"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-zinc-500">No files attached.</Text>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {files.map((file) => (
              <div key={file.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <DocumentIcon className="h-8 w-8 text-zinc-400" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-zinc-900 dark:text-white truncate">
                      {file.fileName}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <span>{formatFileSize(file.fileSize)}</span>
                      <span>•</span>
                      <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    plain
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    plain
                    onClick={() => handleDelete(file.id)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

