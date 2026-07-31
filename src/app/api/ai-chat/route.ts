import { NextResponse } from "next/server";
import { ZhipuAI } from 'zhipuai';
import { getSystemPrompt } from '@/configs/prompt';
import { defaultLocale, isValidLocale } from '@/i18n/config';

export async function POST(req: Request) {
    try {
        const { prompt, locale: requestLocale, history } = await req.json();
        const locale = isValidLocale(requestLocale) ? requestLocale : defaultLocale;

        const apiKey = process.env.NEXT_PUBLIC_ZHIPUAI_KEY;

        const client = new ZhipuAI({
            apiKey: apiKey || ''
        });

        const historyMessages: { role: 'user' | 'assistant'; content: string }[] =
            (Array.isArray(history) ? history : [])
                .filter((m: { role?: string }) => m?.role === 'user' || m?.role === 'assistant')
                .map((m: { role: 'user' | 'assistant'; content: string }) => ({
                    role: m.role,
                    content: m.content
                }));

        const response = await client.chat.completions.create({
            model: 'glm-4.7',
            messages: [
                {
                    role: 'system',
                    content: getSystemPrompt(locale)
                },
                ...historyMessages,
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 2000
        });

        const content = response.choices[0]?.message?.content || '';

        return NextResponse.json({ content });
    } catch (error) {
        console.error('智谱AI调用失败:', error);
        return NextResponse.json(
            { error: 'AI调用失败' },
            { status: 500 }
        );
    }
}