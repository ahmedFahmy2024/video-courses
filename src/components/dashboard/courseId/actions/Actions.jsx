"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import ConfirmModal from "../../modals/Modals";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useConfettiStore } from "@/hooks/use-confetti-store";

const Actions = ({ disabled, courseId, isPublished }) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const confetti =    useConfettiStore();
  
    const onClick = async () => {
      try {
        setIsLoading(true);
        if (isPublished) {
          await axios.patch(`/api/courses/${courseId}/unpublish`);
          toast.success("Course unpublished");
        } else {
          await axios.patch(`/api/courses/${courseId}/publish`);
          toast.success("Course published");
          confetti.onOpen();
        }
  
        router.refresh();
      } catch (error) {
        toast.error("something went wrong");
      } finally {
        setIsLoading(false);
      }
    }
  
    const onDelete = async () => {
      try {
       setIsLoading(true);
       await axios.delete(`/api/courses/${courseId}`);
       toast.success("course deleted"); 
       router.refresh();
       router.push(`/teacher/courses`);
      } catch (error) {
        toast.error("something went wrong");
      } finally {
        setIsLoading(false);
      }
    }
  
    return (
      <div className="flex items-center gap-x-2">
        <Button
          disabled={disabled || isLoading}
          onClick={onClick}
          variant="outline"
          size="sm"
        >
          {isPublished ? "Unpublish" : "Publish"}
        </Button>
        <ConfirmModal onConfirm={onDelete}>
          <Button size="sm" disabled={isLoading}>
            <Trash className="w-4 h-4" />
          </Button>
        </ConfirmModal>
      </div>
    );
  };
export default Actions