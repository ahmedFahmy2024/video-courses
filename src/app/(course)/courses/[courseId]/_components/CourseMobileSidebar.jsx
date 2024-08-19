import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"

  import { Menu } from "lucide-react"
  import CourseSidebar from "./CourseSidebar"
  

const CourseMobileSidebar = ({ course, progressCount }) => {
  return (
    <Sheet>
        <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
            <Menu />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-white w-72 ">
            <CourseSidebar course={course} progressCount={progressCount} />
        </SheetContent>
    </Sheet>
  )
}

export default CourseMobileSidebar