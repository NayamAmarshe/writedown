import {
  postContentAtom,
  postLastUpdatedAtom,
  postTitleAtom,
} from "@/stores/postDataAtom";
import {
  IoMdCheckmarkCircle,
  IoMdDownload,
  IoMdRefreshCircle,
} from "react-icons/io";
import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { useAuthState } from "react-firebase-hooks/auth";
import useNotes from "@/components/hooks/useNotes";
import { isSyncedAtom } from "@/stores/syncedAtom";
import React, { useEffect, useState } from "react";
import { UseEditorReturn } from "@milkdown/react";
import Skeleton from "react-loading-skeleton";
import { useAtom, useAtomValue } from "jotai";
import Trash from "@/components/icons/Trash";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { useTheme } from "next-themes";
import { auth } from "@/pages/_app";

type PostButtonsProps = {
  shiftRight?: boolean;
  editorRef: React.MutableRefObject<UseEditorReturn | null>;
};

const PostButtons = ({ shiftRight, editorRef }: PostButtonsProps) => {
  const [user] = useAuthState(auth);
  const { theme } = useTheme();

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
    const content = document.querySelector(".milkdown > div") as HTMLElement;
    if (!content) return;
    const originalColor = content.style.color;
    const originalBgColor = content.style.backgroundColor;
    import("html2pdf.js").then((html2pdf) => {
      content.style.color = "#000";
      content.style.backgroundColor = "#fff";
      html2pdf
        .default()
        .set({
          margin: 1,
          filename: `${postTitle}-${lastUpdated}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          jsPDF: { compress: true },
          enableLinks: true,
        })
        .from(content)
        .save()
        .then(() => {
          content.style.color = originalColor;
          content.style.backgroundColor = originalBgColor;
        });
    });
    // html2pdf()
    //   .set({
    //     margin: 1,
    //     filename: `${postTitle}-${lastUpdated}.pdf`,
    //     image: { type: "jpeg", quality: 0.98 },
    //   })
    //   .from(content)
    // function download(text: string, name: string, type: string) {
    //   var a = document.getElementById("a");
    //   var file = new Blob([text], { type: type });
    //   if (a) {
    //     a.href = URL.createObjectURL(file);
    //     a.download = name;
    //   }
    // }
    // const jsPdf = new jsPDF({
    //   orientation: "p",
    //   unit: "mm",
    // });
    // content.classList.toggle(theme === "dark" ? "bg-slate-900" : "bg-white");
    // if (!content) return;
    // if (!editorRef.current) return;
    // const pageHeight = 295;
    // const docWidth = jsPdf.internal.pageSize.getWidth();
    // let positionY = 0;
    // let currentPage = 1;
    // const addNewPage = () => {
    //   jsPdf.addPage();
    //   positionY = 0;
    //   currentPage++;
    // };
    // const renderContent = async (child: HTMLElement) => {
    //   const canvas = await html2canvas(child, {
    //     backgroundColor: theme === "dark" ? "#0f172a" : "#f8fafc",
    //   });
    //   const imgData = canvas.toDataURL("image/png");
    //   const imgHeight = (canvas.height * docWidth) / canvas.width;
    //   if (positionY + imgHeight > pageHeight) {
    //     addNewPage();
    //   }
    //   jsPdf.addImage(imgData, "PNG", 0, positionY, docWidth, imgHeight);
    //   positionY += imgHeight;
    // };
    // // const html = `<html><head><style>${
    // //   markdownStyles.github
    // // }</style></head><body>${editorRef.current
    // //   .get()
    // //   ?.action(getHTML())}</body></html>`;
    // const children = Array.from(content.children);
    // for (let i = 0; i < children.length; i++) {
    //   const child = children[i];
    //   console.log("🚀 => file: PostButtons.tsx:142 => child:", child);
    //   await renderContent(child as HTMLElement);
    // }
    // jsPdf.save(`${postTitle}-${lastUpdated}.pdf`);
    // html2canvas(content, {
    //   backgroundColor: theme === "dark" ? "#0f172a" : "#f8fafc",
    //   x: -20,
    //   y: -20,
    //   allowTaint: true,
    //   scrollY: -window.scrollY,
    // }).then(async (canvas) => {
    //   // const imgData = canvas.toDataURL("image/png");
    //   // const imgProps = jsPdf.getImageProperties(imgData);
    //   // const pdfWidth = jsPdf.internal.pageSize.getWidth();
    //   // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    //   // jsPdf.addImage(
    //   //   imgData,
    //   //   "PNG",
    //   //   0,
    //   //   position,
    //   //   jsPdf.internal.pageSize.getWidth(),
    //   //   jsPdf.internal.pageSize.getHeight()
    //   // );
    //   // while (remainingHeight > 0) {
    //   //   position = -jsPdf.internal.pageSize.getHeight();
    //   //   jsPdf.addPage();
    //   //   jsPdf.addImage(
    //   //     imgData,
    //   //     "PNG",
    //   //     0,
    //   //     position,
    //   //     jsPdf.internal.pageSize.getWidth(),
    //   //     jsPdf.internal.pageSize.getHeight()
    //   //   );
    //   //   remainingHeight = remainingHeight - jsPdf.internal.pageSize.getHeight();
    //   // }
    //   jsPdf.save(`${postTitle}-${lastUpdated}.pdf`);
    // });
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
