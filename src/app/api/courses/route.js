import { db } from "@/lib/db";
import { auth } from '@clerk/nextjs/server'

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = auth()
    const { title } = await request.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });

    return NextResponse.json({ course });
  } catch (error) {
    console.log("[courses]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}