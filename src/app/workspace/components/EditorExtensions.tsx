
import { Editor } from "@tiptap/react";
import { useAction, useMutation } from "convex/react";
import { Bold, Italic, Highlighter, Sparkle } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { chatSession } from "@/configs/AiModal";
import { buildEditorPrompt } from "@/configs/prompt";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";


interface EditorExtensionsProps {
    editor: Editor
}
interface AiAnswer {
    pageContent: string
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

    return (
        <div className="p-2">
            <div className="control-group">
                <div className="button-group flex gap-3">
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-2 rounded-md transition-all duration-200 ${editor.isActive('bold')
                            ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/50 scale-110'
                            : 'hover:bg-accent text-foreground hover:scale-110'
                            }`}
                    >
                        <Bold></Bold>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-2 rounded-md transition-all duration-200 ${editor.isActive('italic')
                            ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/50 scale-110'
                            : 'hover:bg-accent text-foreground hover:scale-110'
                            }`}
                    >
                        <Italic></Italic>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                        className={`p-2 rounded-md transition-all duration-200 ${editor.isActive('highlight')
                            ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/50 scale-110'
                            : 'hover:bg-accent text-foreground hover:scale-110'
                            }`}
                    >
                        <Highlighter></Highlighter>
                    </button>
                    <button
                        onClick={() => onAiClick()}
                        className={`p-2 rounded-md transition-all duration-200 ${editor.isActive('highlight')
                            ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/50 scale-110'
                            : 'hover:bg-accent text-foreground hover:scale-110'
                            }`}
                    >
                        <Sparkle></Sparkle>
                    </button>
                </div>
            </div>
        </div>
    )
}