import Mux from "@mux/mux-node";
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

const { Video } = new Mux (
    process.env.MUX_TOKEN_ID,
    process.env.MUX_TOKEN_SECRET
)

export async function DELETE(request, { params }) {
    try {
        const { userId } = auth()

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId : params.courseId
            }
        })

        if (!chapter) {
            return new NextResponse("Not found", { status: 404 })
        }

        if (chapter.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            });

            if (existingMuxData) {
                await Video.Assets.del(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                });
            }
        }

        const deletedChapter = await db.chapter.delete({
            where: {
                id: params.chapterId
            }
        })

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true
            }
        })

        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: params.courseId
                },
                data: {
                    isPublished: false
                }
            })
        }

        return NextResponse.json(deletedChapter)

    } catch (error) {
        console.log("Chapter_id_delete", error)
        return new NextResponse("Error", { status: 500 })
    }
}

export async function PATCH(request, { params }) {
    try {
        const { userId } = auth()
        const {isPublished, ...values} = await request.json()

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId : params.courseId
            },
            data: {
                ...values
            }
        })

        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            });

            if (existingMuxData) {
                await Video.Assets.del(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                })
            }

            const asset = await Video.Assets.create({
                input: values.videoUrl,
                playback_policy: "public",
                test: false
            });

            await db.muxData.create({
                data: {
                    assetId: asset.id,
                    chapterId: params.chapterId,
                    playbackId: asset.playback_ids?.[0]?.id,
                }
            })
        }

        return NextResponse.json({ chapter })

    } catch (error) {
        console.log("[COURSE_CHAPTER_ID]", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}