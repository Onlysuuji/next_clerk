import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { currentUser } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 401 })
    }
    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language') as string

    const words = await prisma.word.findMany({
      where: {
        language,
        userId: user.id
      }
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
    if (!data.question || !data.japanese) {
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
        question: data.question,
        japanese: data.japanese,
        tag: data.tag || 'TOEIC 600-700',
        userId: data.userId,
        language: data.language || 'english',
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