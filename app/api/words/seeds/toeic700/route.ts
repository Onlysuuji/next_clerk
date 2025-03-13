import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { words } from "../../../../data/words/toeic700/route"; // 🔥 データファイルをインポート

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId, level } = await req.json();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // userId を付与してデータを登録
  const wordsWithUserId = words.map((word: any) => ({
    ...word,
    userId, // 🔥 userId をデータに追加
    level,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  // Prisma で大量データを一括登録
  await prisma.word.createMany({ data: wordsWithUserId });

  return NextResponse.json({ message: `${wordsWithUserId.length} 件のデータを登録しました！` }, { status: 201 });
}
