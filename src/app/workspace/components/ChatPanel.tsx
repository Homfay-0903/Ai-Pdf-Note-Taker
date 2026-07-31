'use client'

import { useState, useRef, useEffect } from 'react'
import { useAction, useMutation, useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { chatSession, type ChatMessage } from '@/configs/AiModal'
import { buildEditorPrompt } from '@/configs/prompt'
import { useParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { Send, Loader2, User, Bot } from 'lucide-react'
import type { Locale } from '@/i18n/config'

interface AiAnswer {
    pageContent: string
}

interface ChatPanelProps {
    initialQuestion: string | null
    onQuestionProcessed: () => void
}

export default function ChatPanel({ initialQuestion, onQuestionProcessed }: ChatPanelProps) {
    const { fileId } = useParams()
    const locale = useLocale() as Locale
    const t = useTranslations('workspace.chat')
    const { user } = useUser()
    const SearchAi = useAction(api.myAction.search)
    const saveChatHistory = useMutation(api.chatHistory.saveChatHistory)

    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [historyLoaded, setHistoryLoaded] = useState(false)
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const chatHistory = useQuery(api.chatHistory.getChatHistory, {
        fileId: fileId as string
    })

    useEffect(() => {
        if (chatHistory !== undefined && !historyLoaded) {
            setMessages(chatHistory)
            setHistoryLoaded(true)
        }
    }, [chatHistory, historyLoaded])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const persistHistory = (nextMessages: ChatMessage[]) => {
        saveChatHistory({
            fileId: fileId as string,
            messages: nextMessages,
            createdBy: user?.primaryEmailAddress?.emailAddress ?? 'unknown'
        })
    }

    const handleSend = async (question: string) => {
        if (!question.trim() || loading) return

        const userMessage: ChatMessage = { role: 'user', content: question.trim() }
        const withUser = [...messages, userMessage]
        setMessages(withUser)
        setInput('')
        setLoading(true)
        persistHistory(withUser)

        try {
            const result = await SearchAi({
                query: question.trim(),
                fileId: fileId as string
            })

            let allContent = ''
            const parsed = JSON.parse(result)
            parsed && parsed.forEach((item: AiAnswer) => {
                allContent += item.pageContent
            })

            const prompt = buildEditorPrompt(question.trim(), allContent, locale)
            const aiResponse = await chatSession.sendMessage(prompt, locale, withUser.slice(0, -1))
            let finalAns = aiResponse.replace(/```html/g, '').replace(/```/g, '')

            const assistantMessage: ChatMessage = { role: 'assistant', content: finalAns }
            const withAssistant = [...withUser, assistantMessage]
            setMessages(withAssistant)
            persistHistory(withAssistant)
        } catch {
            toast.error(t('error'))
        } finally {
            setLoading(false)
        }
    }

    // Process initial question from editor selection
    useEffect(() => {
        if (initialQuestion && historyLoaded) {
            handleSend(initialQuestion)
            onQuestionProcessed()
        }
    }, [initialQuestion, historyLoaded])

    const onSendClick = () => {
        handleSend(input)
    }

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend(input)
        }
    }

    return (
        <div className="flex flex-col h-[80vh]">
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {messages.length === 0 && !loading && historyLoaded && (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <p>{t('emptyHint')}</p>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.role === 'assistant' && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                                <Bot className="w-4 h-4 text-primary" />
                            </div>
                        )}

                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                msg.role === 'user'
                                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                                    : 'bg-muted rounded-bl-sm'
                            }`}
                        >
                            {msg.role === 'assistant' ? (
                                <div
                                    className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                                    dangerouslySetInnerHTML={{ __html: msg.content }}
                                />
                            ) : (
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                            )}
                        </div>

                        {msg.role === 'user' && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center mt-1">
                                <User className="w-4 h-4 text-primary-foreground" />
                            </div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="flex gap-3 justify-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                            <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t px-4 py-3">
                <div className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder={t('inputPlaceholder')}
                        disabled={loading}
                        className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    />
                    <button
                        onClick={onSendClick}
                        disabled={loading || !input.trim()}
                        className="rounded-xl bg-primary text-primary-foreground px-4 py-2.5 hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
