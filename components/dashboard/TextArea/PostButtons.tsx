import { TNotesData } from "@/types/utils/firebaseOperations";
import CloudArrowUp from "@/components/icons/CloudArrowUp";
import ArrowPath from "@/components/icons/ArrowPath";
import { isSyncingAtom } from "@/stores/isSyncing";
import { Timestamp } from "firebase/firestore";
import Skeleton from "react-loading-skeleton";
import Check from "@/components/icons/Check";
import Trash from "@/components/icons/Trash";
import { IDBObject } from "@/types/idbTypes";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import React, { useMemo } from "react";
import { del, get } from "idb-keyval";
import { useAtomValue } from "jotai";

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
  notes,
  updateNote,
  deleteNote,
  shiftRight,
}: PostButtonsProps) => {
  const isSyncing = useAtomValue(isSyncingAtom);

  const currentNote = useMemo(() => {
    if (!notes || !selectedNoteId) return;
    // Format the date for the last updated time of the note
    return formatter.format(
      (
        notes.find((note) => note.id === selectedNoteId)?.updatedAt as Timestamp
      )?.toDate()
    );
  }, [notes, selectedNoteId]);

  const getFromStore = async (
    selectedNoteId: string
  ): Promise<IDBObject | null> => {
    if (!selectedNoteId) return null;

    const idbObject = await get(selectedNoteId);

    return (
      idbObject || {
        editorTitle: "Untitled",
        editorContent: "",
      }
    );
  };

  const deleteFromStore = async (selectedNoteId: string) => {
    if (!selectedNoteId) return;

    await del(selectedNoteId);
  };

  const saveNoteHandler = async () => {
    // IF THE NOTE IS SYNCING OR ALREADY SYNCED, DON'T SAVE
    if (isSyncing || isSynced) return;

    // If there is no note selected or no note available with the selectedNoteId, don't save
    if (!selectedNoteId || !notes?.find((note) => note.id === selectedNoteId))
      return;

    const idbObject = await getFromStore(selectedNoteId);

    if (!idbObject) return;

    const { editorContent, editorTitle } = idbObject;

    updateNote({
      id: selectedNoteId,
      title: editorTitle || "Untitled",
      content: editorContent,
    });

    // Set the note as synced
    setIsSynced(true);
    await deleteFromStore(selectedNoteId);
  };

  const deleteNoteHandler = async () => {
    // If there is no note selected or no notes, don't delete
    if (!notes || !selectedNoteId) return;

    await deleteFromStore(selectedNoteId);

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
      {currentNote ? (
        <p className="flex items-center justify-center text-xs font-medium text-slate-500 md:text-sm">
          Last Updated {currentNote}
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
