export const AI_CHAT_SYSTEM_PROMPT = '你是一个专业的助手，' +
    '能够将文本内容转换为格式良好的HTML片段。' +
    '请只返回HTML内容片段，' +
    '不要包含<!DOCTYPE html>、<html>、<head>、<body>等完整文档结构，也不要包含<style>标签和CSS样式。' +
    '只返回可以在编辑器中直接使用的HTML标签和内容。';

export const buildEditorPrompt = (question: string, pdfContent: string): string => {
    return `基于以下PDF文档内容回答用户的问题。
如果内容不足以回答问题，请诚实说明。

用户问题：${question}

PDF文档相关内容：
${pdfContent}

请用中文回答，并使用HTML格式组织答案。可以使用<p>、<ul>、<li>、<strong>、<em>等标签来格式化内容。`;
};