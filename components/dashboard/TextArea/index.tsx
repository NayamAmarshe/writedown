import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";
import ChevronDoubleLeft from "@/components/icons/ChevronDoubleLeft";
import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { inputAtom, titleAtom } from "@/stores/editTextAreaAtom";
import MilkdownEditor from "@/components/ui/MilkdownEditor";
import { useAuthState } from "react-firebase-hooks/auth";
import React, { useCallback, useEffect } from "react";
import IconButton from "@/components/ui/IconButton";
import useNotes from "@/components/hooks/useNotes";
import { MilkdownProvider } from "@milkdown/react";
import { isSyncedAtom } from "@/stores/isSynced";
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
  const [isSynced, setIsSynced] = useAtom(isSyncedAtom);
  const [title, setTitle] = useAtom(titleAtom);
  const [input, setInput] = useAtom(inputAtom);
  const { notes, createNote } = useNotes({
    userId: user?.uid,
  });

  /**
   * Set the title and input value to the selected note's title and content
   * when the selected note changes.
   * 1. If there is no selected note, set the selected note to the first note.
   * 2. If there is a selected note id, set the title and input to the selected note's title and content.
   */
  useEffect(() => {
    if (!notes) return;

    if (notes.length > 0 && !selectedNoteId) {
      setSelectedNoteId(notes[0].id);
      setInput(notes[0].content);
      setTitle(notes[0].title);
      return;
    } else if (notes.length > 0 && selectedNoteId) {
      const selectedNote = notes.find((note) => {
        return note.id === selectedNoteId;
      });
      if (!selectedNote) return;
      setTitle(selectedNote.title);
      setInput(selectedNote.content);
    }
  }, [notes, selectedNoteId]);

  return (
    <div
      className={`scrollbar flex w-full flex-col items-center justify-start overflow-y-scroll p-2 md:p-5`}
    >
      <IconButton
        extraClasses={`ml-auto mr-2 md:hidden transition-transform duration-400 rotate-180 ${
          shiftRight ? "translate-x-52" : "translate-x-0"
        }`}
        onClick={() => setShiftRight(true)}
      >
        <ChevronDoubleLeft className="h-4 w-4" />
      </IconButton>
      {/*BUTTONS AND OTHER STATUS ELEMENTS*/}
      <PostButtons
        selectedNoteId={selectedNoteId}
        setSelectedNoteId={setSelectedNoteId}
        isSynced={isSynced}
        setIsSynced={setIsSynced}
        input={input}
        title={title}
        shiftRight={shiftRight}
      />
      {/*EDITOR BUTTONS AND THE EDITOR*/}
      <MilkdownProvider>
        <EditorButtons shiftRight={shiftRight} />

        <div
          tabIndex={0}
          // onMouseLeave={instaSync}
          className={`w-full max-w-3xl flex-col rounded-xl bg-white p-5 transition-transform duration-300 ${
            shiftRight ? "translate-x-52" : "translate-x-0"
          }`}
        >
          {/* TITLE OF THE POST */}
          <input
            data-testid="noteTitle"
            type="text"
            placeholder={title === "" ? "Untitled" : title}
            className="w-full appearance-none border-none p-0 text-5xl font-bold leading-relaxed focus:outline-none focus:ring-0"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            value={title}
          />

          {/* SEPARATOR */}
          <div className="mb-5 h-0.5 w-full rounded-full bg-slate-200" />

          <ProsemirrorAdapterProvider>
            <MilkdownEditor
              input={input}
              setInput={setInput}
              className="prose !max-h-none min-h-screen !max-w-none p-2 focus:outline-none"
              notes={notes}
            />
          </ProsemirrorAdapterProvider>
        </div>
      </MilkdownProvider>
    </div>
  );
};

export default TextArea;
