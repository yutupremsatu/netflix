"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Maximize2, Minimize2, X } from "lucide-react";

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
  const [isMaximized, setIsMaximized] = useState(false);

  // VidSrc.to has better subtitle support, though more ads.
  // We will respect the seed data domain (vidsrc.to) for now to ensure subtitles work.
  const getOptimizedSource = (source: string) => {
    // Return source directly to allow vidsrc.to if seeded
    return source;
  };

  const optimizedSource = videoSource ? getOptimizedSource(videoSource) : "";

  return (
    <Dialog open={state} onOpenChange={() => changeState(!state)}>
      <DialogContent
        className={`${isMaximized
          ? "!fixed !inset-0 !w-screen !h-screen !max-w-none !max-h-none !rounded-none !border-none !translate-x-0 !translate-y-0 !top-0 !left-0 z-50 transform-none"
          : "sm:max-w-[900px]"
          } bg-black/95 border-gray-800 transition-all duration-300`}
      >
        <DialogHeader className="relative">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-xl">{title}</DialogTitle>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title={isMaximized ? "Minimize" : "Maximize"}
              >
                {isMaximized ? (
                  <Minimize2 className="w-5 h-5 text-white" />
                ) : (
                  <Maximize2 className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
          {!isMaximized && (
            <>
              <DialogDescription className="line-clamp-2 text-gray-400">
                {overview}
              </DialogDescription>
              <div className="flex gap-x-3 items-center text-sm text-gray-300">
                <span>{release}</span>
                <span className="border py-0.5 px-2 border-gray-600 rounded text-xs">
                  {age}+
                </span>
                <span>{duration}h</span>
              </div>
            </>
          )}
        </DialogHeader>

        <div className={`${isMaximized ? "h-[calc(100vh-80px)]" : "h-[500px]"} w-full`}>
          {optimizedSource ? (
            optimizedSource.includes("vidsrc") || optimizedSource.includes("embed") ? (
              <iframe
                src={optimizedSource}
                className="w-full h-full rounded-lg"
                allowFullScreen
                allow="autoplay; encrypted-media; fullscreen"
              ></iframe>
            ) : (
              <video
                src={optimizedSource}
                controls
                className="w-full h-full rounded-lg"
                autoPlay
              />
            )
          ) : (
            <iframe
              src={youtubeUrl}
              className="w-full h-full rounded-lg"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
