import { selectedNoteAtom } from "@/stores/postDataAtom";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import DetailsContent from "@tiptap-pro/extension-details-content";
import DetailsSummary from "@tiptap-pro/extension-details-summary";
import WritedownEditor from "@/components/ui/WritedownEditor";
import Mathematics from "@tiptap-pro/extension-mathematics";
import { useAuthState } from "react-firebase-hooks/auth";
import { LinkPreview } from "./LinkPreview";
import UniqueId from "@tiptap-pro/extension-unique-id";
import Details from "@tiptap-pro/extension-details";
import IconButton from "@/components/ui/IconButton";
import useNotes from "@/components/hooks/useNotes";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { isSyncedAtom } from "@/stores/syncedAtom";
import { BsChevronBarLeft } from "react-icons/bs";
import Emoji from "@tiptap-pro/extension-emoji";
import StarterKit from "@tiptap/starter-kit";
import { createLowlight } from "lowlight";
import Image from "@tiptap/extension-image";
import EditorButtons from "./EditorButtons";
import { Markdown } from "tiptap-markdown";
import Code from "@tiptap/extension-code";
import Link from "@tiptap/extension-link";
import { useEditor } from "@tiptap/react";
import React, { useEffect } from "react";
import PostButtons from "./PostButtons";
import { auth } from "@/lib/firebase";
import { useAtom } from "jotai";

const lowlight = createLowlight();

type TextAreaProps = {
  shiftRight: boolean;
  setShiftRight: React.Dispatch<React.SetStateAction<boolean>>;
};

const TextArea = ({ shiftRight, setShiftRight }: TextAreaProps) => {
  const [user] = useAuthState(auth);
  const [selectedNoteId, setSelectedNoteId] = useAtom(selectedNoteIdAtom);
  const [synced, setSynced] = useAtom(isSyncedAtom);

  const [selectedNote, setSelectedNote] = useAtom(selectedNoteAtom);

  const { notes, updateNote, createNote, refreshNotes } = useNotes({
    userId: user?.uid,
  });

  // EDITOR OPTIONS
  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          "prose !max-h-none min-h-screen !max-w-none p-2 dark:prose-invert focus:outline-none",
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
      createNote().then((id) => {
        if (!id) {
          return;
        }
        setSelectedNoteId(id);
      });
  }, [notes]);

  useEffect(() => {
    if (!notes) return;
    if (notes.length > 0 && !selectedNoteId) {
      setSelectedNoteId(notes[0].id);

      setSelectedNote((prev) => ({
        ...prev,
        content: notes[0].content,
        title: notes[0].title,
        lastUpdated: notes[0].updatedAt,
        isPublic: notes[0].public,
      }));

      return;
    }
    if (!selectedNoteId) return;
    const selectedNote = notes.find((note) => note.id === selectedNoteId);
    if (!selectedNote) return;

    setSelectedNote((prev) => ({
      ...prev,
      content: selectedNote.content,
      title: selectedNote.title,
      lastUpdated: selectedNote.updatedAt,
      isPublic: selectedNote.public,
    }));
  }, [notes, selectedNoteId]);

  useEffect(() => {
    if (!selectedNoteId || !user) return;
    const currentNote = notes?.find(
      (note) =>
        selectedNote.content === note.content &&
        selectedNote.title === note.title &&
        selectedNote.lastUpdated === note.updatedAt &&
        selectedNote.isPublic === note.public
    );
    let debounceSave: NodeJS.Timeout;
    const isNoteUnchanged = currentNote?.id === selectedNoteId;
    if (isNoteUnchanged) {
      setSynced(true);
      return;
    } else {
      debounceSave = setTimeout(() => {
        setSynced(false);
        updateNote({
          id: selectedNoteId,
          title: selectedNote.title,
          content: selectedNote.content,
          public: selectedNote.isPublic,
        });
        setSynced(true);
      }, 3000);
      setSynced(false);
    }
    return () => {
      clearTimeout(debounceSave);
    };
  }, [notes, selectedNote.title, selectedNote.content, selectedNote.isPublic]);

  useEffect(() => {
    refreshNotes();
  }, [selectedNoteId]);

  return (
    <div
      className={`scrollbar flex w-full flex-col items-center justify-start overflow-x-hidden overflow-y-scroll p-2 md:p-5`}
    >
      <IconButton
        extraClasses={`fixed z-10 ml-auto top-[10px] right-[15px] md:hidden transition-transform duration-400 rotate-180 ${
          shiftRight ? "translate-x-52" : "translate-x-0"
        }`}
        onClick={() => setShiftRight(true)}
      >
        <BsChevronBarLeft
          className={`duration-400 h-4 w-4 text-black transition-transform dark:text-slate-100`}
        />
      </IconButton>

      {/*BUTTONS AND OTHER STATUS ELEMENTS*/}
      <PostButtons shiftRight={shiftRight} editor={editor} />

      {/*EDITOR BUTTONS AND THE EDITOR*/}
      <EditorButtons shiftRight={shiftRight} editor={editor} />

      <div
        tabIndex={0}
        id="editor"
        className={`mb-64 w-full max-w-3xl flex-col rounded-xl bg-white p-5 transition-transform duration-300 dark:bg-slate-900 ${
          shiftRight ? "translate-x-52" : "translate-x-0"
        }`}
      >
        {/* TITLE OF THE POST */}
        <input
          data-testid="noteTitle"
          type="text"
          className="w-full appearance-none border-none p-0 text-5xl font-bold leading-relaxed focus:outline-none focus:ring-0 dark:bg-slate-900 dark:text-slate-200"
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
        <div className="mb-5 mt-2 h-0.5 w-full rounded-full bg-slate-200 dark:bg-slate-800" />

        <WritedownEditor notes={notes} editor={editor} />
      </div>
    </div>
  );
};

export default TextArea;
