import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAtom, useAtomValue } from "jotai";
import RemoveMarkdown from "remove-markdown";
import { BiGlobe } from "react-icons/bi";
import { isSyncedAtom } from "@/stores/syncedAtom";
import { selectedNoteAtom } from "@/stores/postDataAtom";

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
        className="flex w-full cursor-pointer flex-col gap-2 truncate"
        onClick={() => switchNotesHandler(noteId)}
      >
        <div className="w-full truncate font-medium dark:text-slate-200">
          {title === "" ? "Untitled" : title || <Skeleton className="w-1/2" />}
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
      {isPublic && <BiGlobe title="Public" size={25} />}
    </div>
  );
};

export default PostRow;
