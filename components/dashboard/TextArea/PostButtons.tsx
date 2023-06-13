import { postContentAtom, postTitleAtom } from "@/stores/editTextAreaAtom";
import { IoMdCheckmarkCircle, IoMdRefreshCircle } from "react-icons/io";
import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { syncLoadingAtom } from "@/stores/syncLoadingAtom";
import { useAuthState } from "react-firebase-hooks/auth";
import useNotes from "@/components/hooks/useNotes";
import { isSyncedAtom } from "@/stores/syncedAtom";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useAtom, useAtomValue } from "jotai";
import Trash from "@/components/icons/Trash";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { auth } from "@/pages/_app";

type PostButtonsProps = {
  shiftRight?: boolean;
};

const PostButtons = ({ shiftRight }: PostButtonsProps) => {
  const [user] = useAuthState(auth);

  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const [selectedNoteId, setSelectedNoteId] = useAtom(selectedNoteIdAtom);
  const postContent = useAtomValue(postContentAtom);
  const postTitle = useAtomValue(postTitleAtom);
  const [syncLoading, setSyncLoading] = useAtom(syncLoadingAtom);
  const [synced, setSynced] = useAtom(isSyncedAtom);

  const { notes, updateNote, deleteNote, refreshNotes } = useNotes({
    userId: user?.uid,
  });

  useEffect(() => {
    if (!notes || !selectedNoteId) return;
    const note = notes.find((note) => {
      return note.id === selectedNoteId;
    });
    if (!note || !note.updatedAt) return;
    const updatedAt = note.updatedAt;
    const formattingOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formattedDate = new Date(updatedAt).toLocaleString(
      "en-US",
      formattingOptions
    );
    setLastUpdated(formattedDate);
  }, [notes, selectedNoteId]);

  /**
   * Saves the note if not already synced
   */
  const saveNoteHandler = async () => {
    if (syncLoading || synced) return;
    if (!selectedNoteId || !notes?.find((note) => note.id === selectedNoteId))
      return;
    await updateNote({
      id: selectedNoteId,
      title: postTitle,
      content: postContent,
    });
    refreshNotes();
    setSynced(true);
  };

  /**
   * Deletes the note and selects the next note in the list
   */
  const deleteNoteHandler = async () => {
    if (!notes || !selectedNoteId) return;
    await deleteNote(selectedNoteId);
    await refreshNotes();
    toast.success("Deleted Post!", {
      iconTheme: {
        primary: "#f00",
        secondary: "#ffffff",
      },
    });
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
          extraClasses="w-28"
        >
          {!synced && (
            <span className="flex items-center justify-center gap-1">
              <IoMdRefreshCircle className="h-5 w-5 animate-spin" />
              <p>Saving</p>
            </span>
          )}
          {synced && (
            <span className="flex items-center justify-center gap-1">
              <IoMdCheckmarkCircle className="h-5 w-5" />
              <p>Saved</p>
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PostButtons;
