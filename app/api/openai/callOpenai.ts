export const callOpenai = async (prompt: string): Promise<string> => {
    try {
        const response = await fetch('/api/openai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt })
        })

        if (!response.ok) {
            throw new Error('ネットワークエラーが発生しました')
        }

        const data: { content: string } = await response.json()
        return data.content || ''
    } catch (error) {
        console.error('エラー:', error)
        return ''
    }
}