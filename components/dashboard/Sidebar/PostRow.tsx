import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { inputAtom, titleAtom } from "@/stores/editTextAreaAtom";
import useNotes from "@/components/hooks/useNotes";
import { isSyncedAtom } from "@/stores/isSynced";
import Skeleton from "react-loading-skeleton";
import { useAtom, useAtomValue } from "jotai";
import RemoveMarkdown from "remove-markdown";
import toast from "react-hot-toast";
import React from "react";

type PostRowProps = {
  title: string;
  content: string;
  noteId: string;
  userId: string | undefined;
};

const PostRow = ({ title, content, noteId, userId }: PostRowProps) => {
  const [selectedNoteId, setSelectedNoteId] = useAtom(selectedNoteIdAtom);
  const [isSynced, setIsSynced] = useAtom(isSyncedAtom);
  const editorTitle = useAtomValue(titleAtom);
  const input = useAtomValue(inputAtom);

  const { updateNote } = useNotes({ userId: userId });

  return (
    <div
      className={`flex cursor-pointer flex-col gap-2 rounded-xl p-4 ${
        selectedNoteId === noteId
          ? "bg-slate-200"
          : "bg-slate-50 hover:bg-slate-100"
      }`}
      onClick={() => {
        setSelectedNoteId(noteId);
      }}
    >
      <h6 className="font-medium">{title || <Skeleton className="w-1/2" />}</h6>
      <button className="flex flex-col gap-2">
        <p className="w-full truncate text-left text-sm text-slate-600">
          {content === (undefined || null) && <Skeleton />}
          {RemoveMarkdown(content.slice(0, 50)) || "..."}
        </p>

        {/* TODO: Add tags  */}
        {/* <div className="flex flex-row flex-wrap gap-1">
          <Badge color="yellow">UI</Badge>
          <Badge color="green">Development</Badge>
          <Badge color="red">UX</Badge>
        </div> */}
      </button>
    </div>
  );
};

export default PostRow;
