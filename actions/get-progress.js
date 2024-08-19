import { db } from "@/lib/db";

export const getProgress = async ({ userId, courseId }) => {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId: userId,
        chapterId: {
          in: publishedChapterIds,
        },
        isCompleted: true,
      },
    });

    const progressPercentage =
      (validCompletedChapters / publishedChapterIds.length) * 100;
    return progressPercentage;
  } catch (error) {
    console.log("[get-progress]", error);
    return 0;
  }
};
