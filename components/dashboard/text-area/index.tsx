import { selectedNoteAtom } from "@/lib/atoms/post-data-atom";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import DetailsContent from "@tiptap-pro/extension-details-content";
import DetailsSummary from "@tiptap-pro/extension-details-summary";
import WritedownEditor from "@/components/writedown-editor";
import Mathematics from "@tiptap-pro/extension-mathematics";
import { LinkPreview } from "./line-preview";
import UniqueId from "@tiptap-pro/extension-unique-id";
import Details from "@tiptap-pro/extension-details";
import IconButton from "@/components/ui/IconButton";
import useNotes from "@/components/hooks/use-notes";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { isSyncedAtom } from "@/lib/atoms/sync-atom";
import { BsChevronBarLeft } from "react-icons/bs";
import Emoji from "@tiptap-pro/extension-emoji";
import StarterKit from "@tiptap/starter-kit";
import { createLowlight } from "lowlight";
import Image from "@tiptap/extension-image";
import EditorButtons from "./editor-buttons";
import { Markdown } from "tiptap-markdown";
import Code from "@tiptap/extension-code";
import Link from "@tiptap/extension-link";
import { useEditor } from "@tiptap/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import PostButtons from "./post-buttons";
import { useAtom } from "jotai";
import CollapseSidebarButton from "../side-bar/collapse-sidebar-button";
import useUser from "../../hooks/use-user";
const lowlight = createLowlight();

const DEFAULT_EDITOR_WIDTH = 768;
const MIN_EDITOR_WIDTH = 768;
const MAX_EDITOR_WIDTH = 1200;

type TextAreaProps = {
  shiftRight: boolean;
  setShiftRight: React.Dispatch<React.SetStateAction<boolean>>;
};

const TextArea = ({ shiftRight, setShiftRight }: TextAreaProps) => {
  const { user } = useUser();
  const [selectedNote, setSelectedNote] = useAtom(selectedNoteAtom);
  const [synced, setSynced] = useAtom(isSyncedAtom);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const dragCleanupRef = useRef<(() => void) | null>(null);
  const [editorWidth, setEditorWidth] = useState(DEFAULT_EDITOR_WIDTH);

  const clampWidth = useCallback((value: number) => {
    const parentWidth =
      editorContainerRef.current?.parentElement?.getBoundingClientRect()
        .width ??
      (typeof window !== "undefined" ? window.innerWidth : MAX_EDITOR_WIDTH);
    const effectiveMax = parentWidth - 40;
    const effectiveMin = Math.min(MIN_EDITOR_WIDTH, effectiveMax);
    return Math.min(Math.max(value, effectiveMin), effectiveMax);
  }, []);

  useEffect(() => {
    setEditorWidth((current) => clampWidth(current));
  }, [clampWidth]);

  useEffect(() => {
    const handleWindowResize = () => {
      setEditorWidth((current) => clampWidth(current));
    };

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [clampWidth]);

  useEffect(() => {
    return () => {
      dragCleanupRef.current?.();
    };
  }, []);

  const startResize =
    (direction: "left" | "right") => (event: React.MouseEvent) => {
      event.preventDefault();
      const startX = event.clientX;
      const startWidth =
        editorContainerRef.current?.getBoundingClientRect().width ??
        editorWidth;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX;
        const nextWidth =
          direction === "left" ? startWidth - delta : startWidth + delta;
        setEditorWidth(clampWidth(nextWidth));
      };

      const stop = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", stop);
        dragCleanupRef.current = null;
      };

      dragCleanupRef.current?.();
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", stop);
      dragCleanupRef.current = stop;
    };

  const { notes, updateNote, createNote } = useNotes({
    userId: user?.uid,
  });

  // EDITOR OPTIONS
  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          "prose max-h-none! min-h-screen max-w-none! p-2 dark:prose-invert focus:outline-hidden",
        id: "writedown-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
          HTMLAttributes: {
            class: "font-semibold",
          },
        },
        paragraph: {
          HTMLAttributes: {},
        },
      }),
      TaskList.configure({}),
      TaskItem.configure({
        nested: true,
      }),
      Link.configure({
        protocols: ["ftp", "mailto"],
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: "text-sky-500 underline cursor-pointer",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
      }),
      Code.configure({
        HTMLAttributes: {},
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          languageClassPrefix: "language-",
        },
      }),
      Mathematics,
      Details,
      DetailsSummary,
      DetailsContent,
      Emoji,
      UniqueId,
      Markdown.configure({
        html: true,
        tightLists: true,
        tightListClass: "tight",
        bulletListMarker: "-",
        linkify: true,
        breaks: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
      LinkPreview,
    ],
    content: selectedNote.content,
    onUpdate: ({ editor }) => {
      if (editor) {
        setSelectedNote((prev) => ({
          ...prev,
          content: editor.storage.markdown.getMarkdown(),
        }));
      }
    },
  });

  // EFFECTS
  useEffect(() => {
    const alertUser = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    if (!synced) {
      window.addEventListener("beforeunload", alertUser);
    } else {
      window.removeEventListener("beforeunload", alertUser);
    }
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, [synced]);

  useEffect(() => {
    if (!notes) return;
    notes.length === 0 &&
      createNote().then((note) => {
        if (!note) {
          return;
        }
        setSelectedNote({
          id: note.id,
          title: note.title,
          content: note.content,
          isPublic: note.isPublic,
          lastUpdated: note.updatedAt,
        });
      });
  }, [notes]);

  useEffect(() => {
    if (!notes) return;
    if (notes.length > 0 && !selectedNote.id) {
      setSelectedNote((prev) => ({
        ...prev,
        id: notes[0].id,
        content: notes[0].content,
        title: notes[0].title,
        lastUpdated: notes[0].updatedAt,
        isPublic: notes[0].isPublic,
      }));

      return;
    }
    if (!selectedNote.id) return;
    const foundExistingNote = notes.find((note) => note.id === selectedNote.id);
    if (!foundExistingNote) return;

    setSelectedNote((prev) => ({
      ...prev,
      content: foundExistingNote.content,
      title: foundExistingNote.title,
      lastUpdated: foundExistingNote.updatedAt,
      isPublic: foundExistingNote.isPublic,
    }));
  }, [notes, selectedNote.id]);

  useEffect(() => {
    if (!selectedNote.id || !user) return;
    const currentNote = notes?.find(
      (note) =>
        selectedNote.content === note.content &&
        selectedNote.title === note.title &&
        selectedNote.lastUpdated === note.updatedAt &&
        selectedNote.isPublic === note.isPublic
    );
    let debounceSave: NodeJS.Timeout;
    const isNoteUnchanged = currentNote?.id === selectedNote.id;
    if (isNoteUnchanged) {
      setSynced(true);
      return;
    } else {
      debounceSave = setTimeout(() => {
        setSynced(false);
        updateNote({
          id: selectedNote.id,
          title: selectedNote.title,
          content: selectedNote.content,
          isPublic: selectedNote.isPublic,
        });
        setSynced(true);
      }, 3000);
      setSynced(false);
    }
    return () => {
      clearTimeout(debounceSave);
    };
  }, [notes, selectedNote.title, selectedNote.content, selectedNote.isPublic]);

  return (
    <div
      className={`scrollbar flex w-full gap-4 flex-col items-center justify-start overflow-x-hidden overflow-y-scroll p-2 md:p-5`}
    >
      <CollapseSidebarButton className="right-auto left-[15px] bg-white dark:bg-slate-700 sm:hidden" />

      {/*BUTTONS AND OTHER STATUS ELEMENTS*/}
      <PostButtons shiftRight={shiftRight} editor={editor} />

      {/*EDITOR BUTTONS AND THE EDITOR*/}
      <EditorButtons shiftRight={shiftRight} editor={editor} />

      <div
        tabIndex={0}
        id="editor"
        ref={editorContainerRef}
        style={{ width: editorWidth }}
        className={`group relative mb-64 flex flex-col rounded-xl bg-white p-5 transition-transform duration-300 dark:bg-slate-900 ${
          shiftRight ? "translate-x-52" : "translate-x-0"
        }`}
      >
        <button
          type="button"
          aria-label="Resize editor"
          onMouseDown={startResize("left")}
          className="absolute left-0 top-0 z-10 flex h-full w-3 -translate-x-1/2 cursor-ew-resize items-center justify-center rounded-full opacity-0 transition-opacity duration-150 focus-visible:opacity-100 focus-visible:outline-hidden group-hover:opacity-100"
        >
          <span className="h-16 w-1 rounded-full bg-slate-400/20 dark:bg-slate-500/20 dark:hover:bg-slate-500 animate" />
        </button>
        <button
          type="button"
          aria-label="Resize editor"
          onMouseDown={startResize("right")}
          className="absolute right-0 top-0 z-10 flex h-full w-3 translate-x-1/2 cursor-ew-resize items-center justify-center rounded-full opacity-0 transition-opacity duration-150 focus-visible:opacity-100 focus-visible:outline-hidden group-hover:opacity-100"
        >
          <span className="h-16 w-1 rounded-full bg-slate-400/20 dark:bg-slate-500/20 dark:hover:bg-slate-500 animate" />
        </button>
        {/* TITLE OF THE POST */}
        <input
          data-testid="noteTitle"
          type="text"
          className="w-full appearance-none border-none p-0 text-5xl leading-relaxed font-bold focus:ring-0 focus:outline-hidden dark:bg-slate-900 dark:text-slate-200"
          onChange={(e) => {
            setSelectedNote((prev) => ({
              ...prev,
              title: e.target.value,
            }));
          }}
          placeholder="Untitled"
          value={selectedNote.title}
        />

        {/* SEPARATOR */}
        <div className="mt-2 mb-5 h-0.5 w-full rounded-full bg-slate-200 dark:bg-slate-800" />

        <WritedownEditor notes={notes} editor={editor} />
      </div>
    </div>
  );
};

export default TextArea;
