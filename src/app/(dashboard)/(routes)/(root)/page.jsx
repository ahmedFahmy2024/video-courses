import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDashboardCourses } from "../../../../../actions/get-dashboard-courses";
import CoursesList from "@/components/dashboard/searchpage/courseslist/CoursesList";
import { CheckCircle, Clock } from "lucide-react";
import InfoCard from "./_components/InfoCard";

export default async function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    userId
  );

  return (
    <div className="p-6 space-y-4 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard icon={Clock} label="in progress" numberOfItems={coursesInProgress.length}  />
        <InfoCard icon={CheckCircle} label="Completed" numberOfItems={completedCourses.length}  variant="success"/>
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
}
