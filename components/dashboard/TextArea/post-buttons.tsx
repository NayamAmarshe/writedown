import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useAtom } from "jotai";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  IoMdCheckmarkCircle,
  IoMdCopy,
  IoMdRefreshCircle,
  IoMdSend,
  IoMdTrash,
} from "react-icons/io";
import { selectedNoteAtom } from "@/stores/postDataAtom";
import useNotes from "@/components/hooks/useNotes";
import { isSyncedAtom } from "@/stores/syncedAtom";
import useUser from "@/components/hooks/useUser";
import { Editor } from "@tiptap/react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2Icon } from "lucide-react";

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
  const [synced, setSynced] = useAtom(isSyncedAtom);
  const [selectedNote, setSelectedNote] = useAtom(selectedNoteAtom);

  const { user, publicUserDetails } = useUser();

  // CUSTOM HOOKS
  const { notes, updateNote, deleteNote, refreshNotes } = useNotes({
    userId: user?.uid,
  });

  // EFFECTS
  useEffect(() => {
    if (!selectedNote.lastUpdated) return;
    const formattedDate = formatTimeStamp(selectedNote.lastUpdated);
    setLastUpdated(formattedDate);
  }, [selectedNote.lastUpdated, selectedNote.id]);

  /**
   * Saves the note if not already synced
   */
  const saveNoteHandler = async () => {
    setSelectedNote((prev) => ({
      ...prev,
      isPublic: !prev.isPublic,
    }));
    if (!selectedNote.id || !notes?.find((note) => note.id === selectedNote.id))
      return;
    setSynced(false);
    await updateNote({
      id: selectedNote.id,
      title: selectedNote.title,
      content: selectedNote.content,
      public: selectedNote.isPublic,
    });
    refreshNotes();
    setSynced(true);
  };

  /**
   * Deletes the note and selects the next note in the list
   */
  const deleteNoteHandler = async () => {
    if (!notes || !selectedNote.id) return;
    // Confirm deletion
    const confirm = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirm) return;
    await deleteNote(selectedNote.id);
    await refreshNotes();
    toast.success("Deleted Post!");
    const noteIndex = notes.findIndex((note) => note.id === selectedNote.id);
    const newIndex = noteIndex > 0 ? noteIndex - 1 : noteIndex + 1;
    setSelectedNote((prev) => ({ ...prev, id: notes[0]?.id || "" }));
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
          filename: `${selectedNote.title}-${lastUpdated}.pdf`,
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
    const markdown = selectedNote.content;
    if (!markdown) return;
    const blob = new Blob([markdown], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedNote.title}-${lastUpdated}.md`;
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
    a.download = `${selectedNote.title}-${lastUpdated}.html`;
    a.click();
    setDownloadLoading(false);
  };

  return (
    <div
      className={`mt-14 flex w-full max-w-3xl flex-col gap-4 transition-transform duration-300 select-none md:mt-52 md:flex-row md:items-center md:justify-between md:px-4 ${
        shiftRight ? "translate-x-52" : "translate-x-0"
      }`}
    >
      {/* LAST UPDATED */}
      {lastUpdated ? (
        <p className="flex items-center justify-center text-xs font-medium text-slate-500 md:text-sm dark:text-slate-400">
          Last Updated {lastUpdated}
        </p>
      ) : (
        <Skeleton className="w-44" />
      )}

      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap items-center justify-center gap-4 md:items-start">
        {/* SAVE BUTTON */}
        <Button type="button" size="sm" variant="green" className="w-28">
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

        <Dialog open={showPublishModal} onOpenChange={setShowPublishModal}>
          <DialogTrigger asChild>
            {/* SAVE BUTTON */}
            <Button size="sm" variant="blue">
              <span className="flex items-center justify-center gap-1">
                <IoMdSend className="h-5 w-5" />
                <p>Publish</p>
              </span>
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Publish & Share</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col overflow-hidden p-2">
              <div className="mb-4 flex flex-row items-center gap-2">
                <Label htmlFor="toggle" onClick={saveNoteHandler}>
                  Enable Public Viewing
                </Label>
                <Switch
                  id="toggle"
                  size="lg"
                  variant="destructive"
                  checked={selectedNote.isPublic}
                  onCheckedChange={saveNoteHandler}
                />
              </div>
              <p
                className={`relative rounded-sm p-2 text-sm transition-all duration-500 ${
                  selectedNote.isPublic
                    ? "cursor-pointer bg-emerald-50 text-slate-900 ring-2 ring-emerald-300 hover:scale-95 dark:bg-emerald-950 dark:text-emerald-100 dark:ring-emerald-400"
                    : "bg-slate-200 text-slate-400 ring-2 ring-slate-300 select-none dark:bg-slate-800 dark:text-slate-500 dark:ring-slate-500"
                }`}
                onClick={() => {
                  if (!selectedNote.isPublic) return;
                  toast.success("Copied link to clipboard!");
                  const isDev = process.env.NODE_ENV === "development";
                  navigator.clipboard.writeText(
                    isDev
                      ? `http://localhost:3000/${
                          publicUserDetails?.username || publicUserDetails?.uid
                        }/posts/${selectedNote.id}`
                      : `https://writedown.app/${
                          publicUserDetails?.username || publicUserDetails?.uid
                        }/posts/${selectedNote.id}`
                  );
                }}
              >
                <div className="w-11/12 truncate">
                  {/* PROD */}
                  {process.env.NODE_ENV !== "development" &&
                    selectedNote.isPublic &&
                    `https://writedown.app/${
                      publicUserDetails?.username ||
                      publicUserDetails?.uid ||
                      ""
                    }/posts/${selectedNote.id}`}
                  {process.env.NODE_ENV !== "development" &&
                    !selectedNote.isPublic &&
                    `https://writedown.app/...`}
                  {/* DEV */}
                  {process.env.NODE_ENV === "development" &&
                    selectedNote.isPublic &&
                    `http://localhost:3000/${
                      publicUserDetails?.username || publicUserDetails?.uid
                    }/posts/${selectedNote.id}`}
                  {process.env.NODE_ENV === "development" &&
                    !selectedNote.isPublic &&
                    `http://localhost:3000/...`}
                </div>
                {selectedNote.isPublic && (
                  <IoMdCopy className="absolute top-1/2 right-2 h-5 w-5 -translate-y-1/2" />
                )}
              </p>

              <div className="mt-5">
                <Label className="font-medium dark:text-slate-300">
                  {!downloadLoading ? (
                    "Download Post"
                  ) : (
                    <div className="flex items-center gap-1">
                      Downloading
                      <Loader2Icon className="size-4 animate-spin" />
                    </div>
                  )}
                </Label>

                <div className="mt-4 flex flex-row flex-wrap items-center justify-center gap-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={downloadPDFHandler}
                  >
                    Download PDF
                  </Button>
                  <Button
                    variant="green"
                    size="sm"
                    onClick={downloadMarkdownHandler}
                  >
                    Download Markdown
                  </Button>
                  <Button
                    variant="blue"
                    size="sm"
                    onClick={downloadHTMLHandler}
                  >
                    Download HTML
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PostButtons;
