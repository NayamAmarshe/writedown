import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAtom, useAtomValue } from "jotai";
import RemoveMarkdown from "remove-markdown";
import { isSyncedAtom } from "@/lib/atoms/sync-atom";
import { selectedNoteAtom } from "@/lib/atoms/post-data-atom";
import { GlobeIcon, Loader2, MoreHorizontal, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  isPublic: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete: (noteId: string) => Promise<void> | void;
  onToggleVisibility: (
    noteId: string,
    makePublic: boolean
  ) => Promise<void> | void;
};

const PostItem = ({
  title,
  content,
  noteId,
  isPublic,
  setShowSidebar,
  onDelete,
  onToggleVisibility,
}: PostRowProps) => {
  const [selectedNote, setSelectedNote] = useAtom(selectedNoteAtom);
  const synced = useAtomValue(isSyncedAtom);
  const [publishLoading, setPublishLoading] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

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

  const handleToggleVisibility = async () => {
    if (publishLoading) return;
    setPublishLoading(true);
    try {
      await onToggleVisibility(noteId, !isPublic);
    } finally {
      setPublishLoading(false);
    }
  };

  const handleDelete = async () => {
    if (deleteLoading) return;
    const confirm = window.confirm("Delete this post?");
    if (!confirm) return;
    setDeleteLoading(true);
    try {
      await onDelete(noteId);
      setSelectedNote((prev) =>
        prev.id === noteId
          ? {
              id: "",
              title: "",
              content: "",
              isPublic: false,
              lastUpdated: null,
            }
          : prev
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const stopPropagation = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
  };

  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-xl p-4 ${
        selectedNote.id === noteId
          ? "bg-slate-300 dark:bg-slate-700"
          : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors duration-300 ease-in-out"
      }`}
      onClick={() => switchNotesHandler(noteId)}
    >
      <div className="flex w-full cursor-pointer flex-col gap-2">
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
        <div className="flex flex-col gap-2">
          <p className="w-full truncate text-left text-sm text-slate-600 dark:text-slate-400">
            {content === null || content === undefined ? (
              <Skeleton />
            ) : (
              RemoveMarkdown(content.slice(0, 50)) || "Empty Post"
            )}
          </p>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Post actions"
            className="rounded-full p-2 text-slate-500 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:text-slate-300 dark:hover:bg-slate-700"
            onClick={stopPropagation}
          >
            <MoreHorizontal className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={6} className="w-44">
          <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(event) => {
              stopPropagation(event);
              handleToggleVisibility();
            }}
            disabled={publishLoading}
          >
            {publishLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Updating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <GlobeIcon className="size-4" />
                {isPublic ? "Unpublish" : "Publish"}
              </span>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={(event) => {
              stopPropagation(event);
              handleDelete();
            }}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Removing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Trash2 className="size-4" />
                Delete
              </span>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PostItem;
