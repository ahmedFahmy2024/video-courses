import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function PUT(request, { params }) {
    try {
        const { userId } = auth();
        const { isCompleted } = await request.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userProfress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId: params.chapterId
                }
            },
            update: {
                isCompleted
            },
            create: {
                userId,
                chapterId: params.chapterId,
                isCompleted
            }
        })

        return NextResponse.json(userProfress);

    } catch (error) {
        console.log("[CHAPTER_ID_PROGRESS]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}