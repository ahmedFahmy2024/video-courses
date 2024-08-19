import { db } from "@/lib/db";
import { getProgress } from "./get-progress";

export const getDashboardCourses = async (userId) => {
  try {
    const purchaseCourses = await db.purchase.findMany({
      where: {
        userId,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    const courses = purchaseCourses.map((purchase) => purchase.course);

    for (let course of courses) {
      const progress = await getProgress( userId, course.id );
      course["progress"] = progress;
    }
    const completedCourses = courses.filter(
      (course) => course.progress === 100
    );

    const coursesInProgress = courses.filter((course) => (course.progress ?? 0) < 100);

    return {
      completedCourses,
      coursesInProgress,
    }

  } catch (error) {
    console.log("[get-dashboard-courses]", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};
