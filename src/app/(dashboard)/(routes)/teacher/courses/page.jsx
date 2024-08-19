import { columns } from "@/components/dashboard/table/columns/Columns";
import { DataTable } from "@/components/dashboard/table/data-table/DataTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { auth } from '@clerk/nextjs/server'
import { redirect } from "next/navigation";
import { db } from "@/lib/db";


const CoursesPage = async () => {
  const { userId } = auth()

  if (!userId) {
    return redirect("/")
  }

  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    }
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
