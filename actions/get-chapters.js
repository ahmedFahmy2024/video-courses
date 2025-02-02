import { db } from "@/lib/db";


export const getChapter = async({ chapterId, courseId, userId }) => {
    try {
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });

        const course = await db.course.findUnique({
            where: {
                isPublished: true,
                id: courseId
            },
            select: {
                price: true
            }
        });

        const chapter = await db.chapter.findUnique({
            where: {
                isPublished: true,
                id: chapterId
            },
        });

        if (!chapter || !course) {
            throw new Error("Chapter or course not found");
        }

        let muxData = null;
        let attachments = [];
        let nextChapter = null;

        if (purchase) {
            attachments = await db.attachment.findMany({
                where: {
                    courseId: courseId
                }
            })
        }

        if (chapter.isFree || purchase) {
            muxData = await db.muxData.findUnique({
                where: {
                    chapterId: chapterId
                }
            });

            nextChapter = await db.chapter.findFirst({
                where: {
                    courseId: courseId,
                    isPublished: true,
                    position: {
                        gt: chapter?.position
                    }
                },
                orderBy: {
                    position: "asc"
                }
            })
        }

        const userProgtress = await db.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId
                }
            }
        });

        return {
            chapter,
            course,
            muxData,
            attachments,
            nextChapter,
            userProgress: userProgtress,
            purchase
        };
        
    } catch (error) {
        console.log("[get-chapter]", error);
        return {
            chapter: null,
            course: null,
            muxData: null,
            attachments: [],
            nextChapter: null,
            userProgress: null,
            purchase: null,
        };
    }
}