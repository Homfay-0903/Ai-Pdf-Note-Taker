export async function sendMessage(prompt: string): Promise<string> {
    try {
        const response = await fetch('/api/ai-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        })

        if (!response.ok) {
            throw new Error('AI请求失败')
        }

        const data = await response.json()
        return data.content
    } catch (error) {
        console.error('智谱AI调用失败:', error)
        throw error
    }
}

export const chatSession = {
    sendMessage
}