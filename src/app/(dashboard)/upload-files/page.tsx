'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { IconCloudUpload, IconUpload } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { fetchDocuments, uploadDocument } from './actions'
import { useToast } from '../../../utilities/show-toasts'
import Pdf from '../../../assets/pdf'

type Document = {
  file_url: string
  file_name: string
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadDocuments()
  }, [])

  async function loadDocuments() {
    setIsLoading(true)
    try {
      const docs = await fetchDocuments()
      setDocuments(docs)
    } catch (error) {
      showToast({
        message: 'Failed to fetch documents',
        type: 'info'
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf' && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      showToast({
        message: 'Invalid file type, please choose a PDF or Excel file.',
        type: 'error'
      })
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast({
        message: 'File size exceeds 10MB limit. Please choose a smaller file.',
        type: 'info'
      })
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setIsLoading(true)
    try {
      await uploadDocument(formData)
      showToast({
        type: 'success',
        message: 'File uploaded successfully',
      })
      loadDocuments()
    } catch (error) {
      showToast({
        message: 'File upload failed',
        type: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleDocumentClick(docUrl: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://64.227.135.153:8000'
    window.open(`${baseUrl}${docUrl}`, "_blank")
  }

  return (
    <div className="min-h-screen mt-10">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      <div className="mt-15 pb-10 rounded-lg flex flex-col gap-12">
        <h1 className="text-3xl text-white font-semibold text-center py-5">Files & Documents</h1>

        <div className="flex justify-center gap-20 mx-6">
          {documents.length > 0 ? (
            documents.map((doc, index) => (
              <div
                key={index}
                className="text-center cursor-pointer grid gap-5"
                onClick={() => handleDocumentClick(doc.file_url)}
              >
                <Pdf />
                <div className="text-zinc-300">{doc.file_name}</div>
              </div>
            ))
          ) : (
            <div className="text-center text-zinc-300">No documents available</div>
          )}
        </div>

        <div className="mt-10 text-center">
          <Button
            onClick={() => document.getElementById('fileInput')?.click()}
            variant="expandIcon"
            Icon={IconCloudUpload}
            iconPlacement='right'
            className='text-sm font-normal'
          >
            Upload file
          </Button>
          <input
            id="fileInput"
            type="file"
            accept=".pdf,.xlsx"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  )
}
