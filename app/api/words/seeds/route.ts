import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { clerkClient, currentUser } from "@clerk/nextjs/server"
import { toeic600 } from "../../../../data/words/toeic600";
import { toeic700 } from "../../../../data/words/toeic700";
import { toeic800 } from "../../../../data/words/toeic800";

const prisma = new PrismaClient();
const words = {
    "toeic600": toeic600,
    "toeic700": toeic700,
    "toeic800": toeic800
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
