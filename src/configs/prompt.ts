import type { Locale } from '@/i18n/config'

const SYSTEM_PROMPTS: Record<Locale, string> = {
    zh: '你是一个专业的助手，' +
        '能够将文本内容转换为格式良好的HTML片段。' +
        '请只返回HTML内容片段，' +
        '不要包含<!DOCTYPE html>、<html>、<head>、<body>等完整文档结构，也不要包含<style>标签和CSS样式。' +
        '只返回可以在编辑器中直接使用的HTML标签和内容。',
    en: 'You are a professional assistant that converts text into well-formatted HTML fragments. ' +
        'Return only HTML content fragments. ' +
        'Do not include <!DOCTYPE html>, <html>, <head>, <body>, or full document structure, and do not include <style> tags or CSS. ' +
        'Return only HTML tags and content that can be used directly in an editor.',
}

export function getSystemPrompt(locale: Locale): string {
    return SYSTEM_PROMPTS[locale]
}

/** @deprecated Use getSystemPrompt(locale) instead */
export const AI_CHAT_SYSTEM_PROMPT = SYSTEM_PROMPTS.zh

export const buildEditorPrompt = (
    question: string,
    pdfContent: string,
    locale: Locale
): string => {
    const answerInstruction = locale === 'zh'
        ? '请用中文回答，并使用HTML格式组织答案。可以使用<p>、<ul>、<li>、<strong>、<em>等标签来格式化内容。'
        : 'Answer in English and organize the answer in HTML format. You may use tags such as <p>, <ul>, <li>, <strong>, and <em> for formatting.'

    const intro = locale === 'zh'
        ? '基于以下PDF文档内容回答用户的问题。\n如果内容不足以回答问题，请诚实说明。'
        : 'Answer the user question based on the following PDF content.\nIf the content is insufficient, say so honestly.'

    const questionLabel = locale === 'zh' ? '用户问题' : 'User question'
    const contentLabel = locale === 'zh' ? 'PDF文档相关内容' : 'Relevant PDF content'

    return `${intro}

${questionLabel}：${question}

${contentLabel}：
${pdfContent}

${answerInstruction}`
}
