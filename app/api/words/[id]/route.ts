import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    const word = await prisma.word.findUnique({
      where: { id }
    })

    if (!word) {
      return NextResponse.json(
        { error: '単語が見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json({ word })
  } catch (error) {
    console.error('単語取得エラー:', error)
    return NextResponse.json(
      { error: '単語の取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const data = await request.json()

    // 学習状況の更新
    const word = await prisma.word.findUnique({ where: { id } })

    if (!word) {
      return NextResponse.json(
        { error: '単語が見つかりません' },
        { status: 404 }
      )
    }

    // 正解・不正解を記録
    const correctCount = word.correctCount + (data.isCorrect ? 1 : 0)
    const incorrectCount = word.incorrectCount + (data.isCorrect ? 0 : 1)

    const updatedWord = await prisma.word.update({
      where: { id },
      data: {
        lastStudied: data.lastStudied || new Date().toISOString(),
        correctCount,
        incorrectCount
      }
    })

    return NextResponse.json({ word: updatedWord })
  } catch (error) {
    console.error('単語更新エラー:', error)
    return NextResponse.json(
      { error: '単語の更新に失敗しました' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    // 単語の存在確認
    const word = await prisma.word.findUnique({ where: { id } })

    if (!word) {
      return NextResponse.json(
        { error: '単語が見つかりません' },
        { status: 404 }
      )
    }

    // 単語を削除
    await prisma.word.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('単語削除エラー:', error)
    return NextResponse.json(
      { error: '単語の削除に失敗しました' },
      { status: 500 }
    )
  }
} 