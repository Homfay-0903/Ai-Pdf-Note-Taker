'use client'

import { Editor } from "@tiptap/react";
import { useAction, useMutation } from "convex/react";
import { Bold, Italic, Highlighter, Sparkle, LucideIcon } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { chatSession } from "@/configs/AiModal";
import { buildEditorPrompt } from "@/configs/prompt";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";


interface EditorExtensionsProps {
    editor: Editor
}
interface AiAnswer {
    pageContent: string
}

interface ToolbarButton {
    id: string
    icon: LucideIcon
    title: string
    action: () => void
    isActive?: boolean
}

export default function EditorExtensions({ editor }: EditorExtensionsProps) {
    const { fileId } = useParams()
    const { user } = useUser()
    const SearchAi = useAction(api.myAction.search)
    const addNotes = useMutation(api.notes.addNotes)

    const onAiClick = async () => {
        toast('AI is working...')

        const seletedText = editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to,
            ' '
        )

        const result = await SearchAi({
            query: seletedText,
            fileId: fileId as string
        })

        let AllUnformattedAns = ''
        const UnformattedAns = JSON.parse(result)
        UnformattedAns && UnformattedAns.forEach((item: AiAnswer) => {
            AllUnformattedAns += item.pageContent
        })

        const prompt = buildEditorPrompt(seletedText, AllUnformattedAns)
        const AiResponse = await chatSession.sendMessage(prompt)
        let finalAns = AiResponse
        finalAns = finalAns.replace(/```html/g, '').replace(/```/g, '')

        const allText = editor.getHTML()
        editor.commands.setContent(allText + '<p><strong>Answer:</strong>' + finalAns + '</p>')

        addNotes({
            fileId: fileId as string,
            notes: editor.getHTML(),
            createdBy: user?.primaryEmailAddress?.emailAddress ?? 'unknown'
        })
    }

    const onExportPdf = () => {
        if (!editor) {
            toast.error('Editor not ready')
            return
        }

        const printContent = document.getElementById('editor-print-content')
        if (!printContent) {
            toast.error('Editor content not found')
            return
        }

        const printFrame = document.createElement('iframe')
        printFrame.style.position = 'absolute'
        printFrame.style.top = '-9999px'
        printFrame.style.left = '-9999px'
        printFrame.style.width = '0'
        printFrame.style.height = '0'
        printFrame.style.border = 'none'
        document.body.appendChild(printFrame)

        const printDocument = printFrame.contentDocument || printFrame.contentWindow?.document
        if (!printDocument) {
            document.body.removeChild(printFrame)
            toast.error('Unable to create print document')
            return
        }

        printDocument.open()
        printDocument.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Export Notes</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        padding: 20px;
                        color: #000;
                        background: #fff;
                    }
                    .ProseMirror {
                        min-height: auto;
                    }
                    .ProseMirror p {
                        margin: 0.5em 0;
                    }
                    .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 {
                        margin: 1em 0 0.5em;
                    }
                    .ProseMirror ul, .ProseMirror ol {
                        padding-left: 1.5em;
                    }
                    .ProseMirror mark {
                        background: #fef08a;
                        padding: 0 2px;
                    }
                    .ProseMirror code {
                        background: #f3f4f6;
                        padding: 2px 6px;
                        border-radius: 4px;
                        font-family: monospace;
                    }
                    .ProseMirror pre {
                        background: #1f2937;
                        color: #f9fafb;
                        padding: 12px;
                        border-radius: 6px;
                        overflow-x: auto;
                    }
                    .ProseMirror pre code {
                        background: transparent;
                        color: inherit;
                    }
                    .ProseMirror blockquote {
                        border-left: 3px solid #d1d5db;
                        padding-left: 1em;
                        margin-left: 0;
                        color: #6b7280;
                    }
                    @media print {
                        body { padding: 0; }
                    }
                </style>
            </head>
            <body>
                ${printContent.innerHTML}
            </body>
            </html>
        `)

        printDocument.close()

        const printWindow = printFrame.contentWindow
        if (printWindow) {
            printWindow.focus()
            setTimeout(() => {
                printWindow.print()
                setTimeout(() => {
                    document.body.removeChild(printFrame)
                }, 100)
            }, 250)
        } else {
            document.body.removeChild(printFrame)
            toast.error('Unable to access print window')
        }
    }

    const toolbarButtons: ToolbarButton[] = [
        {
            id: 'bold',
            icon: Bold,
            title: "Bold",
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: editor.isActive('bold')
        },
        {
            id: 'italic',
            icon: Italic,
            title: "Italic",
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: editor.isActive('italic')
        },
        {
            id: 'highlight',
            icon: Highlighter,
            title: "Highlight",
            action: () => editor.chain().focus().toggleHighlight().run(),
            isActive: editor.isActive('highlight')
        },
        {
            id: 'ai-assistant',
            icon: Sparkle,
            title: "AI Assistant",
            action: onAiClick,
            isActive: false
        }
    ]

    return (
        <div className="p-2">
            <div className="control-group">
                <div className="flex justify-between border-b">
                    <div className="button-group flex gap-3">
                        {toolbarButtons.map((button) => {
                            const Icon = button.icon
                            return (
                                <button
                                    key={button.id}
                                    onClick={button.action}
                                    title={button.title}
                                    className={`p-2 rounded-md transition-all duration-200 cursor-pointer ${button.isActive
                                        ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/50 scale-110'
                                        : 'hover:bg-accent text-foreground hover:scale-110'
                                        }`}
                                >
                                    <Icon></Icon>
                                </button>
                            )
                        })}
                    </div>
                    <Button onClick={onExportPdf}>Export</Button>
                </div>
            </div>
        </div>
    )
}