import { clerkClient } from "@clerk/nextjs/server"

export async function POST(req: Request) {
    const { language, userId } = await req.json()
    const client = await clerkClient()

    await client.users.updateUserMetadata(userId, {
        publicMetadata: {
            language: language,
        },
    })

    return Response.json({ success: true })
}