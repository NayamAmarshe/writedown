import {
  IoMdCheckmarkCircle,
  IoMdCopy,
  IoMdRefresh,
  IoMdRefreshCircle,
  IoMdSend,
  IoMdTrash,
} from "react-icons/io";
import {
  postContentAtom,
  postLastUpdatedAtom,
  postPublicAtom,
  postTitleAtom,
} from "@/stores/postDataAtom";
import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { userDocConverter } from "@/utils/firestoreDataConverter";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import useNotes from "@/components/hooks/useNotes";
import { isSyncedAtom } from "@/stores/syncedAtom";
import React, { useEffect, useState } from "react";
import useUser from "@/components/hooks/useUser";
import Skeleton from "react-loading-skeleton";
import { useAtom, useAtomValue } from "jotai";
import Button from "@/components/ui/Button";
import Toggle from "@/components/ui/Toggle";
import Modal from "@/components/ui/Modal";
import { doc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { Editor } from "@tiptap/react";
import { useTheme } from "next-themes";
import { db } from "@/lib/firebase";
import { auth } from "@/pages/_app";

type PostButtonsProps = {
  shiftRight?: boolean;
  editor: Editor | null;
};

export const formatTimeStamp = (time: number | undefined) => {
  if (!time) return "never";
  const formattingOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const formattedDate = new Date(time).toLocaleString(
    "en-US",
    formattingOptions
  );
  return formattedDate;
};

const PostButtons = ({ shiftRight, editor }: PostButtonsProps) => {
  // HOOKS
  const { theme } = useTheme();

  // LOCAL STATE
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  // ATOMIC STATE
  const [selectedNoteId, setSelectedNoteId] = useAtom(selectedNoteIdAtom);
  const [postPublic, setPostPublic] = useAtom(postPublicAtom);
  const postUpdatedAt = useAtomValue(postLastUpdatedAtom);
  const [synced, setSynced] = useAtom(isSyncedAtom);
  const postContent = useAtomValue(postContentAtom);
  const postTitle = useAtomValue(postTitleAtom);

  const { user } = useUser();

  // CUSTOM HOOKS
  const { notes, updateNote, deleteNote, refreshNotes } = useNotes({
    userId: user?.uid,
  });

  const [userDetails] = useDocumentData(
    user ? doc(db, "users", user?.uid).withConverter(userDocConverter) : null
  );

  // EFFECTS
  useEffect(() => {
    if (!postUpdatedAt) return;
    const formattedDate = formatTimeStamp(postUpdatedAt);
    setLastUpdated(formattedDate);
  }, [postUpdatedAt, selectedNoteId]);

  /**
   * Saves the note if not already synced
   */
  const saveNoteHandler = async () => {
    if (!selectedNoteId || !notes?.find((note) => note.id === selectedNoteId))
      return;
    setSynced(false);
    await updateNote({
      id: selectedNoteId,
      title: postTitle,
      content: postContent,
      public: postPublic,
    });
    refreshNotes();
    setSynced(true);
  };

  /**
   * Deletes the note and selects the next note in the list
   */
  const deleteNoteHandler = async () => {
    if (!notes || !selectedNoteId) return;
    // Confirm deletion
    const confirm = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirm) return;
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
    setSelectedNoteId(notes[0]?.id || null);
  };

  const downloadPDFHandler = async () => {
    if (!editor) return;
    setDownloadLoading(true);
    const content = document.querySelector("#writedown-editor") as HTMLElement;
    if (!content) return;
    // const originalColor = content.style.color;
    const originalBgColor = content.style.backgroundColor;
    import("html2pdf.js").then((html2pdf) => {
      // content.style.color = "#000 !important";
      content.style.backgroundColor = theme === "dark" ? "#000" : "#fff";
      html2pdf
        .default()
        .set({
          margin: 1,
          filename: `${postTitle}-${lastUpdated}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          jsPDF: { compress: true, backgroundColor: "#000" },
          enableLinks: true,
        })
        .from(content)
        .save()
        .then(() => {
          // content.style.color = originalColor;
          content.style.backgroundColor = originalBgColor;
        })
        .finally(() => {
          setDownloadLoading(false);
        });
    });
  };

  const downloadMarkdownHandler = () => {
    if (!editor) return;
    setDownloadLoading(true);
    const markdown = postContent;
    if (!markdown) return;
    const blob = new Blob([markdown], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${postTitle}-${lastUpdated}.md`;
    a.click();
    setDownloadLoading(false);
  };

  const downloadHTMLHandler = () => {
    if (!editor) return;
    setDownloadLoading(true);
    const html = editor.getHTML();
    if (!html) return;
    const blob = new Blob([html], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${postTitle}-${lastUpdated}.html`;
    a.click();
    setDownloadLoading(false);
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
        <Skeleton className="w-44" />
      )}

      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap items-center justify-center gap-4 md:items-start">
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

        <Button
          data-testid="del"
          type="button"
          onClick={deleteNoteHandler}
          variant="red"
          size="sm"
        >
          <span className="flex items-center justify-center gap-1">
            <IoMdTrash className="h-5 w-5" />
            <p>Delete Post</p>
          </span>
        </Button>

        {/* SAVE BUTTON */}
        <Button
          data-testid="download"
          type="button"
          onClick={() => {
            setShowPublishModal(true);
          }}
          size="sm"
          variant="blue"
        >
          <span className="flex items-center justify-center gap-1">
            <IoMdSend className="h-5 w-5" />
            <p>Publish</p>
          </span>
        </Button>

        <Modal
          isOpen={showPublishModal}
          setIsOpen={setShowPublishModal}
          title="Publish and Share"
        >
          <div className="p-2">
            <div className="mb-4 flex flex-row items-center gap-2">
              <label
                htmlFor="toggle"
                className="cursor-pointer select-none font-medium dark:text-slate-300"
                onClick={() => {
                  setPostPublic((prev) => !prev);
                  saveNoteHandler();
                }}
              >
                Enable Public Viewing
              </label>
              <Toggle
                enabled={postPublic}
                onChange={() => {
                  setPostPublic((prev) => !prev);
                  saveNoteHandler();
                }}
                screenReaderPrompt="Toggle Public Sharing"
              />
            </div>
            <p
              className={`relative rounded-lg p-2 text-sm transition-all duration-500 ${
                postPublic
                  ? "cursor-pointer bg-emerald-50 text-slate-900 ring-2 ring-emerald-300 hover:scale-95 dark:bg-emerald-950 dark:text-emerald-100 dark:ring-emerald-400"
                  : "select-none bg-slate-200 text-slate-400 ring-2 ring-slate-300 dark:bg-slate-800 dark:text-slate-500 dark:ring-slate-500"
              }`}
              onClick={() => {
                if (!postPublic) return;
                toast.success("Copied link to clipboard!");
                const isDev = process.env.NODE_ENV === "development";
                navigator.clipboard.writeText(
                  isDev
                    ? `http://localhost:3000/${
                        userDetails?.username || userDetails?.uid
                      }/posts/${selectedNoteId}`
                    : `https://writedown.app/${
                        userDetails?.username || userDetails?.uid
                      }/posts/${selectedNoteId}`
                );
              }}
            >
              <div className="w-11/12 truncate">
                {/* PROD */}
                {process.env.NODE_ENV !== "development" &&
                  postPublic &&
                  `https://writedown.app/${
                    userDetails?.username || userDetails?.uid
                  }/posts/${selectedNoteId}`}
                {process.env.NODE_ENV !== "development" &&
                  !postPublic &&
                  `https://writedown.app/...`}
                {/* DEV */}
                {process.env.NODE_ENV === "development" &&
                  postPublic &&
                  `http://localhost:3000/${
                    userDetails?.username || userDetails?.uid
                  }/posts/${selectedNoteId}`}
                {process.env.NODE_ENV === "development" &&
                  !postPublic &&
                  `http://localhost:3000/...`}
              </div>
              {postPublic && (
                <IoMdCopy className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2" />
              )}
            </p>

            <div className="mt-5">
              <label className="font-medium dark:text-slate-300">
                {!downloadLoading ? (
                  "Download Post"
                ) : (
                  <div className="flex items-center gap-1">
                    Downloading
                    <IoMdRefresh className="h-5 w-5 animate-spin" />
                  </div>
                )}
              </label>
              <div className="mt-4 flex flex-row flex-wrap items-center justify-center gap-4">
                <Button variant="red" size="sm" onClick={downloadPDFHandler}>
                  Download PDF
                </Button>
                <Button
                  variant="green"
                  size="sm"
                  onClick={downloadMarkdownHandler}
                >
                  Download Markdown
                </Button>
                <Button variant="blue" size="sm" onClick={downloadHTMLHandler}>
                  Download HTML
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default PostButtons;
