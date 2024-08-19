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
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import Editor from "../../richtext/editor/Editor";
import Preview from "../../richtext/preview/Preview";


const formScheme = z.object({
  description: z.string().min(3),
});

const ChapterDescriptionForm = ({ courseId, initialData, chapterId }) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current) => !current);
  
    const router = useRouter();
  
    const form = useForm({
      resolver: zodResolver(formScheme),
      defaultValues: { description: initialData?.description || ""},
    });
    const { isSubmitting, isValid } = form.formState;
  
    const onSubmit = async (values) => {
      try {
          await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
          toast.success("Chapter updated successfully");
          toggleEdit();
          router.refresh();
      } catch (error) {
          toast.error("something went wrong")
      }
    };
  
    return (
      <div className="mt-6 border bg-slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
          Chapter description
          <Button onClick={toggleEdit} variant="ghost">
            {isEditing ? (
              <>cancel</>
            ) : (
              <>
                <Pencil className="w-4 h-4 mr-2" />
                Edit description
              </>
            )}
          </Button>
        </div>

        {!isEditing && (
          <div
            className={cn(
              "text-sm mt-2",
              !initialData.description && "text-slate-500 italic"
            )}
          >
            {!initialData.description && "No description"}
            {initialData.description && (
              <Preview value={initialData.description} />
            )}
          </div>
        )}

        {isEditing && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-x-2 ">
                <Button disabled={!isValid || isSubmitting} type="submit">
                  save
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    );
  };

export default ChapterDescriptionForm