import { TNotesData } from "@/types/utils/firebaseOperations";
import React, { useEffect, useMemo, useState } from "react";
import CloudArrowUp from "@/components/icons/CloudArrowUp";
import { useAuthState } from "react-firebase-hooks/auth";
import ArrowPath from "@/components/icons/ArrowPath";
import useNotes from "@/components/hooks/useNotes";
import { isSyncingAtom } from "@/stores/isSyncing";
import { Timestamp } from "firebase/firestore";
import Skeleton from "react-loading-skeleton";
import Check from "@/components/icons/Check";
import Trash from "@/components/icons/Trash";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { useAtomValue } from "jotai";
import { auth } from "@/pages/_app";

type PostButtonsProps = {
  isSynced: boolean;
  setIsSynced: React.Dispatch<React.SetStateAction<boolean>>;
  selectedNoteId: string | null;
  setSelectedNoteId: React.Dispatch<React.SetStateAction<string | null>>;
  title: string;
  input: string;
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
  input,
  shiftRight,
}: PostButtonsProps) => {
  const isSyncing = useAtomValue(isSyncingAtom);
  const [user] = useAuthState(auth);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const { notes, updateNote, deleteNote } = useNotes({
    userId: user?.uid,
  });

  useEffect(() => {
    if (!notes || !selectedNoteId) return;

    const note = notes.find((note) => {
      return note.id === selectedNoteId;
    });

    if (!note || !note.updatedAt) return;

    const updatedAt = note.updatedAt;
    const formattedDate = new Date(updatedAt).toLocaleString();
    setLastUpdated(formattedDate);
  }, [notes, selectedNoteId]);

  const saveNoteHandler = () => {
    // IF THE NOTE IS SYNCING OR ALREADY SYNCED, DON'T SAVE
    if (isSyncing || isSynced) return;

    // If there is no note selected or no note available with the selectedNoteId, don't save
    if (!selectedNoteId || !notes?.find((note) => note.id === selectedNoteId))
      return;

    updateNote({
      id: selectedNoteId,
      title: title === "" ? "Untitled" : title,
      content: input,
    });

    // Set the note as synced
    setIsSynced(true);
  };

  const deleteNoteHandler = () => {
    // If there is no note selected or no notes, don't delete
    if (!notes || !selectedNoteId) return;

    deleteNote(selectedNoteId);

    toast.success("Deleted!");

    // Set the selected note to the next note in the array
    const noteIndex = notes.findIndex((note) => note.id === selectedNoteId);
    const newIndex = noteIndex > 0 ? noteIndex - 1 : noteIndex + 1;
    setSelectedNoteId(notes[newIndex]?.id || null);
  };

  return (
    <div
      className={`mt-4 flex w-full max-w-3xl select-none flex-col gap-4 transition-transform duration-300 md:mt-52 md:flex-row md:items-center md:justify-between md:px-4 ${
        shiftRight ? "translate-x-52" : "translate-x-0"
      }`}
    >
      {/* LAST UPDATED */}
      {lastUpdated ? (
        <p className="flex items-center justify-center text-xs font-medium text-slate-500 md:text-sm">
          Last Updated {lastUpdated}
        </p>
      ) : (
        <Skeleton className="w-44" baseColor="#cbd5e1" />
      )}

      {/* DELETE BUTTON */}
      <div className="flex items-center justify-center gap-4 md:items-start">
        <Button
          data-testid="del"
          type="button"
          onClick={deleteNoteHandler}
          variant="red"
          size="sm"
        >
          <span className="flex items-center justify-center gap-1">
            <Trash className="h-5 w-5" />
            <p>Delete Post</p>
          </span>
        </Button>

        {/* SAVE BUTTON */}
        <Button
          data-testid="save"
          type="button"
          onClick={saveNoteHandler}
          size="sm"
          variant="green"
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
        </Button>
      </div>
    </div>
  );
};

export default React.memo(PostButtons);
