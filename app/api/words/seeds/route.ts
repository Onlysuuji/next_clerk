import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { clerkClient, currentUser } from "@clerk/nextjs/server"
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
    "hsk6": hsk6
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

        const result = await prisma.$transaction(
            data.map(word =>
                prisma.word.create({
                    data: {
                        question: word.question,
                        japanese: word.japanese,
                        tag: tag,
                        language: word.language,
                        userId: user.id,
                    }
                })
            )
        )

        await client.users.updateUserMetadata(user.id, {
            publicMetadata: {
                ignoreList: [...ignoreList, tag],
            },
        })

        return NextResponse.json({ success: true, count: result.length })
    } catch (error) {
        console.error('Error seeding words:', error)
        return NextResponse.json(
            { error: 'Failed to seed words' },
            { status: 500 }
        )
    }


}
