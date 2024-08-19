"use client"
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Loader2, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti-store";

const VideoPlayer = ({chapterId, title, courseId, nextChapterId, playbackId, isLocked, completeOnEnd}) => {
    const [isReady, setIsReady] = useState(false);
    const router = useRouter();
    const confetti = useConfettiStore();

    const onEnd = async () => {
        try {
            if (completeOnEnd) {
                await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                    isCompleted: true,
                });

                if (!nextChapterId) {
                    confetti.onOpen();
                }
                toast.success("progress updated");
                router.refresh();

                if (nextChapterId) {
                    router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
                }
            }
        } catch (error) {
            toast.error("something went wrong");
        }
    }

  return (
    <div className="relative aspect-video">
        {!isReady && !isLocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            </div>
        )}
        {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                <Lock className="h-8 w-8" />
                <p className="text-sm">
                    This Chapter is Locked
                </p>
            </div>
        )}

        {!isLocked && (
            <MuxPlayer
            title={title}
            className={cn(!isReady && "hidden")}
            onCanPlay={() => setIsReady(true)}
            onEnded={onEnd}
            autoPlay
            playbackId={playbackId}
            />
        )}
    </div>
  )
}

export default VideoPlayer