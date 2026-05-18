'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import EditorExtensions from './EditorExtensions'

export default function TextEditor() {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Highlight,
            Placeholder.configure({
                placeholder: 'Start taking your notes here …',
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

    if (!editor) {
        return null
    }

    return (
        <div>
            <EditorExtensions editor={editor}></EditorExtensions>
            <div>
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}