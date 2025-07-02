import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAtom, useAtomValue } from "jotai";
import RemoveMarkdown from "remove-markdown";
import { isSyncedAtom } from "@/lib/atoms/sync-atom";
import { selectedNoteAtom } from "@/lib/atoms/post-data-atom";
import { GlobeIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Scrolling text component
const ScrollingText = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [isOverflowing, setIsOverflowing] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        setIsOverflowing(
          textRef.current.scrollWidth > containerRef.current.clientWidth
        );
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [children]);

  return (
    <div ref={containerRef} className={`${className} overflow-hidden`}>
      <div
        ref={textRef}
        className={`whitespace-nowrap ${isOverflowing ? "animate-scroll-text" : ""}`}
      >
        <span>{children}</span>
        {isOverflowing && <span className="pl-10">{children}</span>}
      </div>
    </div>
  );
};

type PostRowProps = {
  title: string;
  content: string;
  noteId: string;
  userId: string | undefined;
  isPublic: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const PostRow = ({
  title,
  content,
  noteId,
  isPublic,
  setShowSidebar,
}: PostRowProps) => {
  const [selectedNote, setSelectedNote] = useAtom(selectedNoteAtom);
  const synced = useAtomValue(isSyncedAtom);

  const switchNotesHandler = async (noteId: string) => {
    if (!synced) {
      const confirm = window.confirm(
        "You have unsaved changes. Are you sure you want to switch notes?"
      );
      if (!confirm) return;
    }
    setSelectedNote((prev) => ({ ...prev, id: noteId }));
    window.innerWidth <= 768 && setShowSidebar(false);
  };

  return (
    <div
      className={`flex items-center justify-between rounded-xl p-4 ${
        selectedNote.id === noteId
          ? "bg-slate-200 dark:bg-slate-700"
          : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
      }`}
      onClick={() => switchNotesHandler(noteId)}
    >
      <div
        className="flex w-full cursor-pointer flex-col gap-2"
        onClick={() => switchNotesHandler(noteId)}
      >
        <div className="flex w-full items-center gap-2">
          {isPublic && (
            <Tooltip>
              <TooltipTrigger>
                <GlobeIcon className="size-4 shrink-0 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>This post is public</p>
              </TooltipContent>
            </Tooltip>
          )}
          <ScrollingText className="flex-1 min-w-0 font-medium dark:text-slate-200">
            {title === ""
              ? "Untitled"
              : title || <Skeleton className="w-1/2" />}
          </ScrollingText>
        </div>
        <button className="flex flex-col gap-2">
          <p className="w-full truncate text-left text-sm text-slate-600 dark:text-slate-400">
            {content === null || content === undefined ? (
              <Skeleton />
            ) : (
              RemoveMarkdown(content.slice(0, 50)) || "Empty Post"
            )}
          </p>

          {/* TODO: Add tags  */}
          {/* <div className="flex flex-row flex-wrap gap-1">
          <Badge color="yellow">UI</Badge>
          <Badge color="green">Development</Badge>
          <Badge color="red">UX</Badge>
        </div> */}
        </button>
      </div>
    </div>
  );
};

export default PostRow;
