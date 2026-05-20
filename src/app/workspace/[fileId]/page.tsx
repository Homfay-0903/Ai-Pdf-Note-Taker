'use client'

import { useParams } from 'next/navigation'
import WorkspaceHeader from '../components/WorkspaceHeader'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import PdfViewer from '../components/PdfViewer'
import TextEditor from '../components/TextEditor'
import { Loader2 } from 'lucide-react'

export default function Workspace() {
    const { fileId } = useParams()
    const fileInfo = useQuery(api.fileStorage.getFileRecord, {
        fileId: fileId as string
    })

    if (!fileInfo?.fileUrl) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="text-muted-foreground">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <div>
            <WorkspaceHeader fileName={fileInfo.fileName}></WorkspaceHeader>


            <div className='grid grid-cols-2 gap-5'>
                <div>
                    <TextEditor fileId={fileId as string}></TextEditor>
                </div>
                <div>
                    <PdfViewer fileUrl={fileInfo.fileUrl}></PdfViewer>
                </div>
            </div>

        </div>
    )
}