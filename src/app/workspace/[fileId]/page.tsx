'use client'

import { useParams } from 'next/navigation'
import WorkspaceHeader from '../components/WorkspaceHeader'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import PdfViewer from '../components/PdfViewer'
import TextEditor from '../components/TextEditor'

export default function Workspace() {
    const { fileId } = useParams()
    const fileInfo = useQuery(api.fileStorage.getFileRecord, {
        fileId: fileId as string
    })

    if (!fileInfo?.fileUrl) {
        return <div>Loading...</div>
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