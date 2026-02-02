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
  const [activeServer, setActiveServer] = useState(0); // 0: XYZ, 1: TO, 2: LIB

  // Extract ID from videoSource (e.g., https://vidsrc.to/embed/movie/980489)
  const extractId = (url: string) => {
    if (!url) return null;
    const match = url.match(/\/(movie|tv)\/(\d+)/);
    if (match) return { type: match[1], id: match[2] };
    return null;
  };

  const mediaInfo = extractId(videoSource);
  const servers = [
    { name: "Server 1", getUrl: (type: string, id: string) => `https://vidsrc.xyz/embed/${type}/${id}` },
    { name: "Server 2", getUrl: (type: string, id: string) => `https://vidsrc.to/embed/${type}/${id}` },
    { name: "Server 3", getUrl: (type: string, id: string) => `https://vidsrc.lib/embed/${type}/${id}` },
  ];

  const currentVideoUrl = mediaInfo
    ? servers[activeServer].getUrl(mediaInfo.type, mediaInfo.id)
    : videoSource;

  return (
    <Dialog open={state} onOpenChange={() => {
      setIsExpanded(false);
      changeState(!state);
    }}>
      <DialogContent className={isExpanded ? "max-w-[100vw] h-[100vh] w-screen p-0 m-0 rounded-none bg-black border-none overflow-hidden flex flex-col" : "sm:max-w-[800px] bg-zinc-900 border-zinc-800 text-white"}>
        <DialogHeader className={isExpanded ? "p-4 bg-black/50 absolute top-0 left-0 w-full z-20 transition-opacity opacity-0 hover:opacity-100" : "p-6"}>
          <div className="flex justify-between items-start w-full">
            <div className="flex-grow pr-4">
              <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
              <DialogDescription className="line-clamp-2 text-zinc-400 mt-1">
                {overview}
              </DialogDescription>
              <div className="flex gap-x-3 items-center mt-2 text-xs text-zinc-400">
                <p>{release}</p>
                <p className="border py-0.5 px-1 bg-zinc-800 border-zinc-700 rounded">{age}+</p>
                <p>{duration > 0 ? `${duration}h` : "TV Series"}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="hover:bg-white/10"
            >
              {isExpanded ? <MinimizeIcon className="h-5 w-5" /> : <MaximizeIcon className="h-5 w-5" />}
            </Button>
          </div>
        </DialogHeader>

        {mediaInfo && (
          <div className="flex px-6 pb-2 gap-x-2 overflow-x-auto no-scrollbar border-b border-zinc-800">
            {servers.map((server, idx) => (
              <button
                key={idx}
                onClick={() => setActiveServer(idx)}
                className={`px-3 py-1 text-[10px] rounded-full border transition whitespace-nowrap ${activeServer === idx
                    ? "bg-white text-black border-white"
                    : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white"
                  }`}
              >
                {server.name}
              </button>
            ))}
            <span className="text-[10px] text-zinc-500 py-1 italic ml-auto hidden sm:block">Switch if player fails</span>
          </div>
        )}

        <div className={isExpanded ? "flex-grow bg-black relative" : "relative w-full h-[450px] bg-black rounded-b-lg overflow-hidden"}>
          {videoSource ? (
            <iframe
              src={currentVideoUrl}
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; encrypted-media; fullscreen"
              // Removed strict sandbox to ensure cross-origin player scripts can load
              sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation allow-popups"
            ></iframe>
          ) : (
            <iframe src={youtubeUrl} className="w-full h-full" allowFullScreen></iframe>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
