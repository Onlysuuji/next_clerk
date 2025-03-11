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
    
    // JSONレスポンスを求められた場合、応答形式を調整
    const isJsonRequest = prompt.includes('JSON') || prompt.includes('json')
    
    // 回答評価に関するリクエストかどうか判断
    const isEvaluationRequest = prompt.includes('評価') || prompt.includes('isCorrect')
    
    // TOEIC関連のリクエストかどうか判断
    const isToeicRequest = prompt.includes('TOEIC') || prompt.includes('toeic')
    
    // システムプロンプトを設定
    let systemPrompt = 'あなたは簡潔で役立つ情報を提供する英語学習アシスタントです。'
    
    if (isEvaluationRequest) {
      systemPrompt = '英語学習者の回答を評価する教師です。回答を詳細に分析し、丁寧で具体的なフィードバックを提供してください。JSON形式で応答する場合は、必ず有効なJSONオブジェクトを返してください。'
    }
    
    if (isToeicRequest) {
      systemPrompt += ' 特にTOEIC 700点レベルの英語表現に詳しく、ビジネスシーンで使用される実用的な英語を重視します。'
    }
    
    // APIリクエスト
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: isEvaluationRequest ? 0.3 : 0.7, // 評価の場合は一貫性を重視
        max_tokens: 1024,
        response_format: isJsonRequest ? { type: "json_object" } : undefined
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