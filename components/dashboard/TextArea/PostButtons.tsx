import {
  IoMdCheckmarkCircle,
  IoMdCloudDownload,
  IoMdDownload,
  IoMdRefreshCircle,
} from "react-icons/io";
import {
  postContentAtom,
  postLastUpdatedAtom,
  postTitleAtom,
} from "@/stores/postDataAtom";
import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { useAuthState } from "react-firebase-hooks/auth";
import { markdownStyles } from "@/utils/markdownStyles";
import { getHTML, getMarkdown } from "@milkdown/utils";
import useNotes from "@/components/hooks/useNotes";
import { isSyncedAtom } from "@/stores/syncedAtom";
import React, { useEffect, useState } from "react";
import { UseEditorReturn } from "@milkdown/react";
import Skeleton from "react-loading-skeleton";
import { useAtom, useAtomValue } from "jotai";
import Trash from "@/components/icons/Trash";
import Button from "@/components/ui/Button";
import { editorCtx } from "@milkdown/core";
import { toast } from "react-hot-toast";
import html2canvas from "html2canvas";
import { auth } from "@/pages/_app";
import { marked } from "marked";
import jsPDF from "jspdf";

type PostButtonsProps = {
  shiftRight?: boolean;
  editorRef: React.MutableRefObject<UseEditorReturn | null>;
};

const PostButtons = ({ shiftRight, editorRef }: PostButtonsProps) => {
  const [user] = useAuthState(auth);

  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const [selectedNoteId, setSelectedNoteId] = useAtom(selectedNoteIdAtom);
  const postContent = useAtomValue(postContentAtom);
  const postTitle = useAtomValue(postTitleAtom);
  const postUpdatedAt = useAtomValue(postLastUpdatedAtom);
  const [synced, setSynced] = useAtom(isSyncedAtom);

  const { notes, updateNote, deleteNote, refreshNotes } = useNotes({
    userId: user?.uid,
  });

  useEffect(() => {
    if (!postUpdatedAt) return;
    const formattingOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formattedDate = new Date(postUpdatedAt).toLocaleString(
      "en-US",
      formattingOptions
    );
    setLastUpdated(formattedDate);
  }, [postUpdatedAt, selectedNoteId]);

  /**
   * Saves the note if not already synced
   */
  const saveNoteHandler = async () => {
    if (synced) return;
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

  const downloadNoteHandler = async () => {
    const jsPdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
      hotfixes: ["px_scaling"],
    });
    const content = document.querySelector(".milkdown") as HTMLElement;
    if (!content) return;
    if (!editorRef.current) return;

    // const html = `<html><head><style>${
    //   markdownStyles.github
    // }</style></head><body>${editorRef.current
    //   .get()
    //   ?.action(getHTML())}</body></html>`;

    html2canvas(content, {
      width: jsPdf.internal.pageSize.getWidth(),
      height: jsPdf.internal.pageSize.getHeight(),
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      jsPdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        jsPdf.internal.pageSize.getWidth(),
        jsPdf.internal.pageSize.getHeight()
      );
      jsPdf.save("note.pdf");
    });
  };

  return (
    <div
      className={`mt-14 flex w-full max-w-3xl select-none flex-col gap-4 transition-transform duration-300 md:mt-52 md:flex-row md:items-center md:justify-between md:px-4 ${
        shiftRight ? "translate-x-52" : "translate-x-0"
      }`}
    >
      {/* LAST UPDATED */}
      {lastUpdated ? (
        <p className="flex items-center justify-center text-xs font-medium text-slate-500 dark:text-slate-400 md:text-sm">
          Last Updated {lastUpdated}
        </p>
      ) : (
        <Skeleton className="w-44" baseColor="#cbd5e1" />
      )}

      {/* DELETE BUTTON */}
      <div className="flex flex-wrap items-center justify-center gap-4 md:items-start">
        {/* SAVE BUTTON */}
        <Button
          data-testid="download"
          type="button"
          onClick={downloadNoteHandler}
          size="sm"
          variant="blue"
        >
          <span className="flex items-center justify-center gap-1">
            <IoMdDownload className="h-5 w-5" />
            <p>Download</p>
          </span>
        </Button>

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
          className="w-28"
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
