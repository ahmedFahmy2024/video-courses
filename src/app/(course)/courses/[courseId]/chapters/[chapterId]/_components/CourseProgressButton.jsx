"use client";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const CourseProgressButton = ({
  chapterId,
  courseId,
  nextChapterId,
  isCompleted,
}) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
        setIsLoading(true);
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
            isCompleted: !isCompleted,
        });
        if (!isCompleted && nextChapterId) {
            confetti.onOpen();
        }

        if(!isCompleted && nextChapterId) {
            router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }

        toast.success("progress updated");
        router.refresh();
    } catch (error) {
        toast.error("something went wrong");
    } finally {
        setIsLoading(false);
    }
  }

  const Icon = isCompleted ? XCircle : CheckCircle;

  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="w-full md:w-auto"
      variant={isCompleted ? "outline" : "success"}
    >
      {isCompleted ? "Not completed" : "Mark as completed"}
      <Icon className="w-4 h-4 ml-2" />
    </Button>
  );
};

export default CourseProgressButton;
