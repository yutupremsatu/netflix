import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MaximizeIcon, MinimizeIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface iAppProps {
  title: string;
  overview: string;
  youtubeUrl: string;
  state: boolean;
  changeState: any;
  release: number;
  age: number;
  duration: number;
  videoSource: string;
}

export default function PlayVideoModal({
  changeState,
  overview,
  state,
  title,
  youtubeUrl,
  age,
  duration,
  release,
  videoSource,
}: iAppProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Dialog open={state} onOpenChange={() => {
      setIsExpanded(false);
      changeState(!state);
    }}>
      <DialogContent className={isExpanded ? "max-w-[100vw] h-[100vh] w-screen p-0 m-0 rounded-none bg-black border-none overflow-hidden flex flex-col" : "sm:max-w-[800px]"}>
        <DialogHeader className={isExpanded ? "p-4 bg-black/50 absolute top-0 left-0 w-full z-20 transition-opacity opacity-0 hover:opacity-100" : ""}>
          <div className="flex justify-between items-center w-full">
            <div>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription className="line-clamp-3">
                {overview}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2 hover:bg-white/20"
            >
              {isExpanded ? <MinimizeIcon className="h-5 w-5" /> : <MaximizeIcon className="h-5 w-5" />}
            </Button>
          </div>
          <div className="flex gap-x-2 items-center">
            <p>{release}</p>
            <p className="border py-o.5 px-1 border-gray-200 rounded">{age}+</p>
            <p>{duration}h</p>
          </div>
        </DialogHeader>
        {videoSource ? (
          videoSource.includes("vidsrc") || videoSource.includes("embed") ? (
            <iframe
              src={videoSource}
              className={isExpanded ? "w-full h-full flex-grow" : "w-full h-[400px]"}
              allowFullScreen
              allow="autoplay; encrypted-media"
              sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts"
            ></iframe>
          ) : (
            <video src={videoSource} controls className="w-full" autoPlay />
          )
        ) : (
          <iframe src={youtubeUrl} height={250} className="w-full"></iframe>
        )}
      </DialogContent>
    </Dialog>
  );
}
