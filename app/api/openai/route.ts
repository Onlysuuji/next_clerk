import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    // 環境変数からAPIキーを取得
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    // OpenAI APIのエンドポイント
    const apiUrl = 'https://api.openai.com/v1/chat/completions'

    // APIリクエスト
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1024,
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: 'Failed to fetch from OpenAI API', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()

    // レスポンスからテキストを抽出
    const responseText = data.choices?.[0]?.message?.content || ''

    return NextResponse.json({ content: responseText })
  } catch (error) {
    console.error('Error processing OpenAI request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 