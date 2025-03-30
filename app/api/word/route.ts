import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const language = searchParams.get('language')
        if (!language) {
            return NextResponse.json({ error: 'Language parameter is required' }, { status: 400 })
        }

        const word = await prisma.word.findFirst(
            {
                where: {
                    language: language
                },
                orderBy: {
                    lastStudied: 'asc'
                }
            }
        )

        return NextResponse.json(word)
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

