import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { clerkClient, currentUser } from "@clerk/nextjs/server"
import { eiken1 } from "../../../../data/words/eiken1";
import { eikenjun1 } from "../../../../data/words/eikenjun1";
import { eiken2 } from "../../../../data/words/eiken2";
import { eikenjun2 } from "../../../../data/words/eikenjun2";
import { toeic500 } from "../../../../data/words/toeic500";
import { toeic700 } from "../../../../data/words/toeic700";
import { toeic900 } from "../../../../data/words/toeic900";
import { hsk4 } from "../../../../data/words/hsk4";
import { hsk5 } from "../../../../data/words/hsk5";
import { hsk6 } from "../../../../data/words/hsk6";

const prisma = new PrismaClient();
const words = {
    "toeic500": toeic500,
    "toeic700": toeic700,
    "toeic900": toeic900,
    "hsk4": hsk4,
    "hsk5": hsk5,
    "hsk6": hsk6,
    "eiken1": eiken1,
    "eikenjun1": eikenjun1,
    "eiken2": eiken2,
    "eikenjun2": eikenjun2
}
export async function POST(request: Request) {
    try {
        const { tag } = await request.json();

        const data = words[tag as keyof typeof words];

        const client = await clerkClient()

        const user = await currentUser();
        const ignoreList = Array.isArray(user?.publicMetadata?.ignoreList)
            ? (user.publicMetadata.ignoreList as string[])
            : [];

        if (ignoreList?.includes(tag as string)) {
            return NextResponse.json({ error: "このパックはすでに登録されています" }, { status: 401 });
        }
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // ✅ 1. 既存のデータを一括取得
        const existingWords = await prisma.word.findMany({
            where: {
                userId: user.id, // ユーザーごとの重複を確認
                question: { in: data.map((word) => word.question) },
            },
            select: {
                question: true,
            },
        });

        // ✅ 2. 既存の question をセットで保持
        const existingQuestions = new Set(existingWords.map((word) => word.question));

        // ✅ 3. 重複していないデータだけを抽出
        const wordsToInsert = data.filter((word) => !existingQuestions.has(word.question));

        if (wordsToInsert.length > 0) {
            // ✅ 4. 新規データを一括挿入（重複はスキップ）
            await prisma.word.createMany({
                data: wordsToInsert.map((word) => ({
                    question: word.question,
                    japanese: word.japanese,
                    tag: tag,
                    language: word.language,
                    userId: user.id,
                })),
                skipDuplicates: true, // ✅ 重複データをスキップ
            });

            console.log(`✅ ${wordsToInsert.length} 件のデータを新規作成しました`);
        } else {
            console.log('⚠️ すべてのデータが重複していたため、登録なし');
        }

        // ✅ 5. 重複したデータをログに出力
        const duplicates = data.filter((word) => existingQuestions.has(word.question));

        await client.users.updateUserMetadata(user.id, {
            publicMetadata: {
                ignoreList: [...ignoreList, tag],
            },
        })

        return NextResponse.json({ success: true, duplicates: duplicates })
    } catch (error) {
        console.error('Error seeding words:', error)
        return NextResponse.json(
            { error: 'Failed to seed words' },
            { status: 500 }
        )
    }


}
