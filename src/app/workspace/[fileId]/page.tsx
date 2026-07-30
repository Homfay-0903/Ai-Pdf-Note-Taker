'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import WorkspaceHeader from '../components/WorkspaceHeader'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import PdfViewer from '../components/PdfViewer'
import TextEditor from '../components/TextEditor'
import ChatPanel from '../components/ChatPanel'
import { Loader2, MessageCircle, PencilLine } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function Workspace() {
    const { fileId } = useParams()
    const t = useTranslations('workspace')
    const fileInfo = useQuery(api.fileStorage.getFileRecord, {
        fileId: fileId as string
    })

    const [activeTab, setActiveTab] = useState<'notes' | 'chat'>('notes')
    const [chatQuestion, setChatQuestion] = useState<string | null>(null)

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
                    {/* Tab switcher */}
                    <div className="flex border-b mx-5 mt-3">
                        <button
                            onClick={() => setActiveTab('notes')}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'notes'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <PencilLine className="w-4 h-4" />
                            {t('tabs.notes')}
                        </button>
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'chat'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <MessageCircle className="w-4 h-4" />
                            {t('tabs.chat')}
                        </button>
                    </div>

                    {/* Tab content */}
                    {activeTab === 'notes' ? (
                        <TextEditor
                            fileId={fileId as string}
                            onAskAI={(question: string) => {
                                setChatQuestion(question)
                                setActiveTab('chat')
                            }}
                        />
                    ) : (
                        <div className="pt-3">
                            <ChatPanel
                                initialQuestion={chatQuestion}
                                onQuestionProcessed={() => setChatQuestion(null)}
                            />
                        </div>
                    )}
                </div>
                <div>
                    <PdfViewer fileUrl={fileInfo.fileUrl}></PdfViewer>
                </div>
            </div>

        </div>
    )
}