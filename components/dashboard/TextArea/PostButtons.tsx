import { TNotesData } from "@/types/utils/firebaseOperations";
import CloudArrowUp from "@/components/icons/CloudArrowUp";
import ArrowPath from "@/components/icons/ArrowPath";
import { isSyncingAtom } from "@/stores/isSyncing";
import { Timestamp } from "firebase/firestore";
import Skeleton from "react-loading-skeleton";
import Check from "@/components/icons/Check";
import Trash from "@/components/icons/Trash";
import { toast } from "react-hot-toast";
import React, { useMemo } from "react";
import { useAtom } from "jotai";

type PostButtonsProps = {
  isSynced: boolean;
  setIsSynced: React.Dispatch<React.SetStateAction<boolean>>;
  selectedNoteId: string | null;
  setSelectedNoteId: React.Dispatch<React.SetStateAction<string | null>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  notes: TNotesData[] | undefined;
  updateNote: (note: {
    id: string;
    title: string;
    content: string;
  }) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  shiftRight?: boolean;
};

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: undefined,
  hour12: true,
});

const PostButtons = ({
  isSynced,
  setIsSynced,
  selectedNoteId,
  setSelectedNoteId,
  title,
  setTitle,
  input,
  setInput,
  notes,
  updateNote,
  deleteNote,
  shiftRight,
}: PostButtonsProps) => {
  const [isSyncing, setIsSyncing] = useAtom(isSyncingAtom);

  const currentNote = useMemo(() => {
    if (!notes || !selectedNoteId) return;
    return notes.find((note) => note.id === selectedNoteId);
  }, [notes, selectedNoteId]);

  const saveNoteHandler = () => {
    if (isSyncing || isSynced) return;

    if (!selectedNoteId || !notes?.find((note) => note.id === selectedNoteId))
      return;
    updateNote({
      id: selectedNoteId,
      title: title === "" ? "Untitled" : title,
      content: input,
    });
    setIsSynced(true);
    toast.success("Saved!");
  };

  const deleteNoteHandler = () => {
    if (!notes || !selectedNoteId) return;
    deleteNote(selectedNoteId);
    toast.success("Deleted!");

    const noteIndex = notes.findIndex((note) => note.id === selectedNoteId);
    const newIndex = noteIndex > 0 ? noteIndex - 1 : noteIndex + 1;
    setSelectedNoteId(notes[newIndex]?.id || null);
    if (notes.length < 2) {
      setTitle("");
      setInput("");
      return;
    }
  };

  return (
    <div
      className={`mt-4 flex w-full max-w-3xl select-none flex-col gap-4 transition-transform duration-300 md:mt-52 md:flex-row md:items-center md:justify-between md:px-4 ${
        shiftRight ? "translate-x-52" : "translate-x-0"
      }`}
    >
      {/* LAST UPDATED */}
      {currentNote ? (
        <p className="flex items-center justify-center text-xs font-medium text-slate-500 md:text-sm">
          Last Updated{" "}
          {formatter.format((currentNote.updatedAt as Timestamp)?.toDate())}
        </p>
      ) : (
        <Skeleton className="w-44" baseColor="#cbd5e1" />
      )}

      {/* DELETE BUTTON */}
      <div className="flex items-center justify-center gap-4 md:items-start">
        <button
          data-testid="del"
          type="button"
          className="rounded-full bg-red-200 py-1 px-3 text-sm font-medium text-red-800 shadow-md shadow-red-900/20 transition-colors duration-300 hover:bg-red-300"
          onClick={deleteNoteHandler}
        >
          <span className="flex items-center justify-center gap-1">
            <Trash className="h-5 w-5" />
            <p>Delete Post</p>
          </span>
        </button>

        {/* SAVE BUTTON */}
        <button
          data-testid="save"
          type="button"
          className="rounded-full bg-emerald-200 py-1 px-3 text-sm font-medium text-emerald-800 shadow-md shadow-emerald-900/20 transition-colors duration-300 hover:bg-emerald-300"
          onClick={saveNoteHandler}
        >
          {isSyncing && (
            <span className="flex items-center justify-center gap-1">
              <ArrowPath className="h-5 w-5" />
              <p>Saving</p>
            </span>
          )}
          {!isSyncing && isSynced && (
            <span className="flex items-center justify-center gap-1">
              <Check className="h-5 w-5" />
              <p>Saved</p>
            </span>
          )}
          {!isSyncing && !isSynced && (
            <span className="flex items-center justify-center gap-1">
              <CloudArrowUp className="h-5 w-5" />
              <p>Save Note</p>
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default React.memo(PostButtons);
