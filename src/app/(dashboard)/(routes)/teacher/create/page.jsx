'use client'

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


const schema = z.object({
    title: z.string().min(3, {
        message: "Title must be at least 3 characters.",
    }),
})

const CreatePage = () => {
    const router = useRouter()
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            title: ""
        },
    });

    const { isSubmitting, isValid } = form.formState

    const onSubmit = async (values) => {
        try {
            const response = await axios.post("/api/courses", values)
            // console.log(response)
            router.push(`/teacher/courses/${response.data.course.id}`)
            toast.success("Course created successfully")
        } catch (error) {
            toast.error("something went wrong")
        }
    }

    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
                <h1 className="text-2xl">Name Your Course</h1>
                <p className="text-slate-600 text-sm">What would you like to name your course? Dont worry, you can change it anytime.</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course Title</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} placeholder="e.g. 'Advanced web development'" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        what will you teach in this course?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center gap-x-2 ">
                            <Link href="/">
                                <Button variant="ghost" type="button">
                                    Cancel
                                </Button>
                            </Link>

                            <Button type="submit" disabled={!isValid || isSubmitting}>
                                Continue
                            </Button>
                        </div>

                    </form>
                </Form>
            </div>
        </div>
    )
}

export default CreatePage