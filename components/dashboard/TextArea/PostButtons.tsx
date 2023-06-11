import { TNotesData } from "@/types/utils/firebaseOperations";
import CloudArrowUp from "@/components/icons/CloudArrowUp";
import { syncLoadingAtom } from "@/stores/syncLoadingAtom";
import { useAuthState } from "react-firebase-hooks/auth";
import ArrowPath from "@/components/icons/ArrowPath";
import React, { useEffect, useState } from "react";
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
  notes: TNotesData[] | undefined;
  updateNote: (note: {
    id: string;
    title: string;
    content: string;
  }) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  shiftRight?: boolean;
};

const PostButtons = ({
  isSynced,
  setIsSynced,
  selectedNoteId,
  setSelectedNoteId,
  title,
  input,
  notes,
  updateNote,
  deleteNote,
  shiftRight,
}: PostButtonsProps) => {
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const syncLoading = useAtomValue(syncLoadingAtom);

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

  /**
   * Saves the note if not already synced
   */
  const saveNoteHandler = () => {
    if (syncLoading || isSynced) return;
    if (!selectedNoteId || !notes?.find((note) => note.id === selectedNoteId))
      return;
    updateNote({
      id: selectedNoteId,
      title: title,
      content: input,
    });
    setIsSynced(true);
  };

  /**
   * Deletes the note and selects the next note in the list
   */
  const deleteNoteHandler = () => {
    if (!notes || !selectedNoteId) return;
    deleteNote(selectedNoteId);
    toast.success("Deleted!");
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
          {syncLoading && (
            <span className="flex items-center justify-center gap-1">
              <ArrowPath className="h-5 w-5" />
              <p>Saving</p>
            </span>
          )}
          {!syncLoading && isSynced && (
            <span className="flex items-center justify-center gap-1">
              <Check className="h-5 w-5" />
              <p>Saved</p>
            </span>
          )}
          {!syncLoading && !isSynced && (
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
