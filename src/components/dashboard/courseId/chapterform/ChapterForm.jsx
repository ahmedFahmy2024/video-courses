"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import ChapterList from "./chapterlist/ChapterList";


const formScheme = z.object({
  title: z.string().min(1),
});

const ChapterForm = ({ courseId, initialData }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const toggleCreating = () => setIsCreating((current) => !current);
  
    const router = useRouter();
  
    const form = useForm({
      resolver: zodResolver(formScheme),
      defaultValues: { title: "", },
    });
    const { isSubmitting, isValid } = form.formState;
  
    const onSubmit = async (values) => {
      try {
          await axios.post(`/api/courses/${courseId}/chapters`, values)
          toast.success("Chapter Created");
          toggleCreating();
          router.refresh();
      } catch (error) {
          toast.error("something went wrong")
      }
    };

    const onReorder = async (updateData) => {
      try {
        setIsUpdating(true);
        await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
          list: updateData,
        });
        toast.success("Chapters reordered");
        router.refresh();
      } catch (error) {
        toast.error("something went wrong")
      } finally {
        setIsUpdating(false);
      }
    }

    const onEdit = (id) => {
      router.push(`/teacher/courses/${courseId}/chapters/${id}`);
    }
  
    return (
      <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
        {isUpdating && (
          <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-sky-700" />
          </div>
        )}
        <div className="font-medium flex items-center justify-between">
          Course chapters
          <Button onClick={toggleCreating} variant="ghost">
            {isCreating ? (
              <>cancel</>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 mr-2" />
                Add a chapter
              </>
            )}
          </Button>
        </div>

        {isCreating && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g. 'Introduction to the course'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={!isValid || isSubmitting} type="submit">
                Create
              </Button>
            </form>
          </Form>
        )}
        {!isCreating && (
          <div
            className={cn(
              "text-sm mt-2",
              !initialData?.chapters?.length && "text-slate-500 italic"
            )}
          >
            {!initialData?.chapters?.length && "No chapters"}
            <ChapterList
              onEdit={onEdit}
              onReorder={onReorder}
              items={initialData?.chapters || []}
            />
          </div>
        )}
        {!isCreating && (
          <p className="text-xs text-muted-foreground mt-4">
            Drag and Drop to reorder the chapters
          </p>
        )}
      </div>
    );
  };

export default ChapterForm