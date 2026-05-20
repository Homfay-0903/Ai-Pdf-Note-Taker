'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import EditorExtensions from './EditorExtensions'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface TextEditorProps {
    fileId: string
}

export default function TextEditor({ fileId }: TextEditorProps) {
    const t = useTranslations('workspace.editor')

    const editor = useEditor({
        extensions: [
            StarterKit,
            Highlight,
            Placeholder.configure({
                placeholder: t('placeholder'),
            }),
        ],
        editorProps: {
            attributes: {
                class: 'focus:outline-none h-screen p-5'
            }
        },
        // Don't render immediately on the server to avoid SSR issues
        immediatelyRender: false,
    })

    const getNotes = useQuery(api.notes.getNotes, {
        fileId: fileId
    })
    useEffect(() => {
        editor && editor.commands.setContent(getNotes)
    }, [editor && getNotes])

    if (!editor) {
        return null
    }

    return (
        <div>
            <EditorExtensions editor={editor}></EditorExtensions>
            <div id="editor-print-content" className='overflow-y-auto h-[80vh]'>
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}