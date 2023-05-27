import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";
import ChevronDoubleLeft from "@/components/icons/ChevronDoubleLeft";
import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { inputAtom, titleAtom } from "@/stores/editTextAreaAtom";
import { TNotesData } from "@/types/utils/firebaseOperations";
import MilkdownEditor from "@/components/ui/MilkdownEditor";
import { useAuthState } from "react-firebase-hooks/auth";
import React, { useCallback, useEffect } from "react";
import IconButton from "@/components/ui/IconButton";
import useNotes from "@/components/hooks/useNotes";
import { MilkdownProvider } from "@milkdown/react";
import { isSyncedAtom } from "@/stores/isSynced";
import EditorButtons from "./EditorButtons";
import PostButtons from "./PostButtons";
import localForage from "localforage";
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
  const { notes, createNote, updateNote, deleteNote } = useNotes({
    userId: user?.uid,
  });
  console.log("🚀 => file: index.tsx:33 => notes:", notes);

  // const [dataFetched, setDataFetched] = useState(false);

  // const [isInitialRender, setIsInitialRender] = useState(true);

  // useEffect(() => {
  //   setIsInitialRender(false);
  // }, []);

  const createNewNote = useCallback(async () => {
    const newId = await createNote();
    if (!newId) return;
    setSelectedNoteId(newId);
  }, [createNote, setSelectedNoteId, notes, selectedNoteId]);

  /**
   * Set the title and input value to the selected note's title and content
   * when the selected note changes.
   * 1. If there are no notes, create a new note.
   * 2. If there are notes, but no selected note, set the selected note to the first note.
   * 3. If there are notes and a selected note id, set the title and input to the selected note's title and content.
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
    } else if (notes.length === 0) {
      createNewNote();
    }
  }, [notes, selectedNoteId]);

  useEffect(() => {
    const setLocalForageNotes = async () => {
      const localNotes = await localForage.getItem<TNotesData[]>("notes");
      const cloudNote = notes.find((note) => note.id === selectedNoteId);

      if (!localNotes) {
        localForage.setItem("notes", []);
        return;
      }

      let localNote = localNotes.find(
        (localNoteElement) => localNoteElement.id === selectedNoteId
      );

      if (!localNote) {
        if (!cloudNote) {
          console.log("No local note or cloud note found");
          return;
        }

        console.log("No local note found, creating one from cloudNote");
        localNote = {
          ...cloudNote,
          title,
          content: input,
        };
        localNotes.push(localNote);
        await localForage.setItem("notes", localNotes);
        return;
      }

      if (localNote.content === input && localNote.title === title) {
        console.log("Local note and cloud note are the same");
        return;
      }

      localNote.content = input;
      localNote.title = title;

      const selectedNoteIndex = localNotes.findIndex(
        (note) => note.id === selectedNoteId
      );
      if (selectedNoteIndex === -1) {
        console.log("No local note found with the selectedNoteId");
        return;
      }

      localNotes[selectedNoteIndex] = localNote;
      await localForage.setItem("notes", localNotes);
    };

    if (!selectedNoteId) return;
    setLocalForageNotes();
  }, [title, input, selectedNoteId]);

  // const saveNoteChanges = async (noteId: string) => {
  //   const localStorageInput = localStorage.getItem("editorContent");
  //   const localStorageTitle = localStorage.getItem("editorTitle");
  //   if (!isSynced && selectedNoteId && localStorageInput && localStorageTitle) {
  //     await updateNote({
  //       id: noteId,
  //       title: localStorageTitle,
  //       content: localStorageInput,
  //     });
  //     setIsSynced(true);
  //   }
  // };

  // // SHOW SYNCED SUCCESSFULLY TOAST WHENEVER isSynced BECOMES TRUE
  // useEffect(() => {
  //   if (!isSynced || isInitialRender) return;
  //   toast.success("Synced Successfully", {
  //     position: "bottom-right",
  //   });
  // }, [isSynced, isInitialRender]);

  // // IF THERE ARE NOTES AND NO NOTE IS SELECTED, SELECT THE FIRST NOTE
  // useEffect(() => {
  //   if (!notes) return;
  //   if (notes.length > 0 && !selectedNoteId) {
  //     setSelectedNoteId(notes[0].id);
  //     setInput(notes[0].content);
  //     setTitle(notes[0].title);
  //     return;
  //   }
  //   // IF THERE ARE NOTES AND A NOTE IS SELECTED, FIND THE NOTE AND POPULATE THE EDITOR
  //   if (!selectedNoteId) return;
  //   const selectedNote = notes.find((note) => {
  //     return note.id === selectedNoteId;
  //   });
  //   if (!selectedNote) return;
  //   setInput(selectedNote.content);
  //   setTitle(selectedNote.title);
  // }, [notes, selectedNoteId]);

  // // IF THERE ARE NO NOTES, CREATE A NEW NOTE
  // useEffect(() => {
  //   if (!notes) return;
  // const createNoteIfEmpty = async () => {
  //   const newId = await createNote();
  //   if (!newId) return;
  //   // IF THE NOTE CONTENT ALREADY EXISTS, SYNC IT
  //   saveNoteChanges(newId);
  //   setSelectedNoteId(newId);
  // };
  //   if (notes.length === 0) {
  //     createNoteIfEmpty();
  //   }
  //   localForage.setItem("notes", notes);
  // }, [notes]);

  // // DEB
  // useEffect(() => {
  //   const getLocalForageNotes = async () => {
  // const localForageNotes = await localForage.getItem<TNotesData[]>("notes");
  //     if (!localForageNotes) return;

  //     // FIND THE CURRENT NOTE AND CHECK IF IT IS UNCHANGED
  //     const currentNote = localForageNotes.find(
  //       (note) => input === note.content && title === note.title
  //     );

  //     const isNoteUnchanged = currentNote?.id === selectedNoteId;
  //     if (isNoteUnchanged || !selectedNoteId || !user) return;

  //     // IF THIS IS THE FIRST FETCHING, DO NOT SET isSynced TO FALSE AS THIS CHANGE IS SUPPOSED TO HAPPEN
  //     if (!dataFetched) {
  //       setDataFetched(true);
  //       return;
  //     }

  //     setIsSynced(false);

  //     const localForageNote = localForageNotes.find(
  //       (note) => note.id === selectedNoteId
  //     );

  //     if (!localForageNote) return;

  //     if (
  //       localForageNote.content === input &&
  //       localForageNote.title === title
  //     ) {
  //       return;
  //     }

  //     setInput(localForageNote.content);
  //     setTitle(localForageNote.title);
  //   };

  //   getLocalForageNotes();
  // }, [title, input]);

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
