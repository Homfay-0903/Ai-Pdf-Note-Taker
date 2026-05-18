'use client'

import { useParams } from 'next/navigation'
import WorkspaceHeader from '../components/WorkspaceHeader'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import PdfViewer from '../components/PdfViewer'

export default function Workspace() {
    const { fileId } = useParams()
    const fileInfo = useQuery(api.fileStorage.getFileRecord, {
        fileId: fileId
    })

    return (
        <div>
            <WorkspaceHeader></WorkspaceHeader>


            <div className='grid grid-cols-2 gap-5'>
                <div>

                </div>
                <div>
                    <PdfViewer fileUrl={fileInfo?.fileUrl}></PdfViewer>
                </div>
            </div>

        </div>
    )
}
