import {
  postContentAtom,
  postLastUpdatedAtom,
  postTitleAtom,
} from "@/stores/postDataAtom";
import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";
import ChevronDoubleLeft from "@/components/icons/ChevronDoubleLeft";
import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { MilkdownProvider, UseEditorReturn } from "@milkdown/react";
import MilkdownEditor from "@/components/ui/MilkdownEditor";
import React, { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import IconButton from "@/components/ui/IconButton";
import useNotes from "@/components/hooks/useNotes";
import { isSyncedAtom } from "@/stores/syncedAtom";
import { BsChevronBarLeft } from "react-icons/bs";
import EditorButtons from "./EditorButtons";
import PostButtons from "./PostButtons";
import { auth } from "@/pages/_app";
import { useAtom } from "jotai";

type TextAreaProps = {
  shiftRight: boolean;
  setShiftRight: React.Dispatch<React.SetStateAction<boolean>>;
};

const TextArea = ({ shiftRight, setShiftRight }: TextAreaProps) => {
  const [user] = useAuthState(auth);
  const [selectedNoteId, setSelectedNoteId] = useAtom(selectedNoteIdAtom);
  const [synced, setSynced] = useAtom(isSyncedAtom);
  const [postTitle, setPostTitle] = useAtom(postTitleAtom);
  const [postContent, setPostContent] = useAtom(postContentAtom);
  const [postUpdatedAt, setPostUpdatedAt] = useAtom(postLastUpdatedAtom);
  const { notes, updateNote, createNote, refreshNotes } = useNotes({
    userId: user?.uid,
  });
  // LOCAL STATES
  const editorRef = React.useRef<UseEditorReturn>(null);
  const pdfRef = useRef(null);

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
      setPostContent(notes[0].content);
      setPostTitle(notes[0].title);
      setPostUpdatedAt(notes[0].updatedAt);
      return;
    }
    if (!selectedNoteId) return;
    const selectedNote = notes.find((note) => note.id === selectedNoteId);
    if (!selectedNote) return;
    setPostContent(selectedNote.content);
    setPostTitle(selectedNote.title);
    setPostUpdatedAt(selectedNote.updatedAt);
  }, [notes, selectedNoteId]);

  useEffect(() => {
    if (!selectedNoteId || !user) return;
    const currentNote = notes?.find(
      (note) =>
        postContent === note.content &&
        postTitle === note.title &&
        postUpdatedAt === note.updatedAt
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
          title: postTitle,
          content: postContent,
        });
        setSynced(true);
      }, 3000);
      setSynced(false);
    }
    return () => {
      clearTimeout(debounceSave);
    };
  }, [notes, postTitle, postContent]);

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
      <PostButtons shiftRight={shiftRight} editorRef={editorRef} />

      {/*EDITOR BUTTONS AND THE EDITOR*/}
      <MilkdownProvider>
        <EditorButtons shiftRight={shiftRight} />

        <div
          tabIndex={0}
          id="editor"
          // onMouseLeave={instaSync}
          className={`w-full max-w-3xl flex-col rounded-xl bg-white p-5 transition-transform duration-300 dark:bg-slate-900 ${
            shiftRight ? "translate-x-52" : "translate-x-0"
          }`}
        >
          {/* TITLE OF THE POST */}
          <input
            data-testid="noteTitle"
            type="text"
            className="w-full appearance-none border-none p-0 text-5xl font-bold leading-relaxed focus:outline-none focus:ring-0 dark:bg-slate-900 dark:text-slate-200"
            onChange={(e) => {
              setPostTitle(e.target.value);
            }}
            placeholder="Untitled"
            value={postTitle}
          />

          {/* SEPARATOR */}
          <div className="mb-5 h-0.5 w-full rounded-full bg-slate-200 dark:bg-slate-800" />

          <ProsemirrorAdapterProvider>
            <MilkdownEditor
              input={postContent}
              setInput={setPostContent}
              className="prose !max-h-none min-h-screen !max-w-none p-2 dark:prose-invert focus:outline-none"
              notes={notes}
              editorRef={editorRef}
            />
          </ProsemirrorAdapterProvider>
        </div>
      </MilkdownProvider>
    </div>
  );
};

export default TextArea;
