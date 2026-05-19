import { NextResponse } from "next/server";
import { ZhipuAI } from 'zhipuai';
import { AI_CHAT_SYSTEM_PROMPT } from '@/configs/prompt';

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        const apiKey = process.env.NEXT_PUBLIC_ZHIPUAI_KEY;

        const client = new ZhipuAI({
            apiKey: apiKey || ''
        });

        const response = await client.chat.completions.create({
            model: 'glm-4',
            messages: [
                {
                    role: 'system',
                    content: AI_CHAT_SYSTEM_PROMPT
                },
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