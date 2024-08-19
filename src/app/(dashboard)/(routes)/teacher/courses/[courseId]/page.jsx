import { db } from "@/lib/db";
import AttachmentForm from "@/components/dashboard/courseId/attachmentform/AttachmentForm";
import CategoryForm from "@/components/dashboard/courseId/categoryform/CategoryForm";
import ChapterForm from "@/components/dashboard/courseId/chapterform/ChapterForm";
import DescriptionForm from "@/components/dashboard/courseId/descriptionform/DescriptionForm";
import ImageForm from "@/components/dashboard/courseId/imageform/ImageForm";
import PriceForm from "@/components/dashboard/courseId/priceform/PriceForm";
import TitleForm from "@/components/dashboard/courseId/titleform/TitleForm";
import { IconBadge } from "@/components/dashboard/iconBadge/IconBadge";
import { auth } from "@clerk/nextjs/server";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { redirect } from "next/navigation";
import Banner from "@/components/dashboard/banner/Banner";
import Actions from "@/components/dashboard/courseId/actions/Actions";

const CourseIdPage = async ({ params }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId: userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
    {
      !course.isPublished && (
        <Banner label="This course is not published. it will not be visisble to students" />
      )
    }
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">course setup</h1>
            <span className="text-sm tesxt-slate-700">
              Complete all fields {completionText}
            </span>
          </div>

          <Actions
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={course.isPublished}
          />
          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>

            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm
              courseId={course.id}
              initialData={course}
              options={categories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
            />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">course chapters</h2>
              </div>
              <ChapterForm initialData={course} courseId={course.id} />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <PriceForm initialData={course} courseId={course.id} />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <AttachmentForm initialData={course} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
