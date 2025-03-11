import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const words = await prisma.word.findMany({
      orderBy: { id: 'asc' }
    })
    
    return NextResponse.json({ words })
  } catch (error) {
    console.error('単語取得エラー:', error)
    return NextResponse.json(
      { error: '単語の取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // バリデーション
    if (!data.english || !data.japanese) {
      return NextResponse.json(
        { error: '英語と日本語は必須です' },
        { status: 400 }
      )
    }
    
    if (!data.userId) {
      return NextResponse.json(
        { error: 'ユーザーIDが必要です' },
        { status: 401 }
      )
    }
    
    const word = await prisma.word.create({
      data: {
        english: data.english,
        japanese: data.japanese,
        level: data.level || 'TOEIC 600-700',
        userId: data.userId,
        lastStudied: null,
        correctCount: 0,
        incorrectCount: 0
      }
    })
    
    return NextResponse.json({ word })
  } catch (error) {
    console.error('単語作成エラー:', error)
    return NextResponse.json(
      { error: '単語の作成に失敗しました' },
      { status: 500 }
    )
  }
} 