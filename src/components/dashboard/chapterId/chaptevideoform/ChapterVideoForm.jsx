"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import MuxPlayer from "@mux/mux-player-react";

import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Video } from "lucide-react";
// import { FileUpload } from "@/components/dashboard/fileUpload/FileUpload";

const ChapterVideoForm = ({ courseId, initialData, chapterId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();


  const onSubmit = async (values) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
      toast.success("Chapter updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("something went wrong")
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>cancel</>}

          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add a video
            </>
          )}

          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>

      {!isEditing && !initialData.videoUrl ? (
        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
          <Video className="h-10 w-10 text-slate-500" />
        </div>
      ) : (
        <div className="relative aspect-video mt-2">
          <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} />
        </div>
      )}

      {isEditing && (
        <div>
          {/* <FileUpload endpoint="chapterVideo" onChange={(url) => {
            if (url) {
              onSubmit({ videoUrl: url });
            }
          }} /> */}
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter video
          </div>
        </div>
      )}
      {
        initialData.videoUrl && !isEditing && (
          <div className="text-xs text-muted-foreground mt-2">
            Videos can take a few minutes to process, Refresh the page if video does not appear
          </div>
        )
      }
    </div>
  );
};

export default ChapterVideoForm;
