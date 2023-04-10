import ChevronDoubleLeft from "@/components/icons/ChevronDoubleLeft";
import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { inputAtom, titleAtom } from "@/stores/editTextAreaAtom";
import { notesConverter } from "@/utils/firestoreDataConverter";
import { collection, orderBy, query } from "firebase/firestore";
import MilkdownEditor from "@/components/ui/MilkdownEditor";
import { useAuthState } from "react-firebase-hooks/auth";
import IconButton from "@/components/ui/IconButton";
import useNotes from "@/components/hooks/useNotes";
import { MilkdownProvider } from "@milkdown/react";
import { isSyncedAtom } from "@/stores/isSynced";
import EditorButtons from "./EditorButtons";
import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import PostButtons from "./PostButtons";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";
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
  const { updateNote, deleteNote, createNote } = useNotes({
    userId: user?.uid,
  });

  const [notes] = useCollectionData(
    user &&
      query(
        collection(db, "users", user.uid, "notes"),
        orderBy("updatedAt", "desc")
      ).withConverter(notesConverter)
  );

  // SELECT THE FIRST NOTE WHEN selectedNoteId IS NULL
  useEffect(() => {
    if (!notes) return;

    if (notes.length > 0 && !selectedNoteId) {
      setSelectedNoteId(notes[0].id);
      setInput(notes[0].content);
      setTitle(notes[0].title);
      return;
    }
  }, [notes, selectedNoteId]);

  // SET INPUT AND TITLE WHEN SELECTEDNOTEID CHANGES
  useEffect(() => {
    if (!notes) return;

    const selectedNote = notes.find((note) => note.id === selectedNoteId);
    if (!selectedNote) return;

    setInput(selectedNote.content);
    setTitle(selectedNote.title);
  }, [selectedNoteId, setInput, setTitle, notes]);

  // CREATE A NEW NOTE WHEN NOTES IS EMPTY
  useEffect(() => {
    if (!notes) return;

    if (notes.length === 0) {
      createNote().then((newId) => {
        if (!newId) return;

        if (!isSynced && selectedNoteId) {
          updateNote({
            id: selectedNoteId,
            title: title,
            content: input,
          });

          toast.success("Synced Successfully", {
            position: "bottom-right",
          });

          setIsSynced(true);
        }
        setSelectedNoteId(newId);
      });
    }
  }, [notes]);

  //CHECKING IF SELECTEDNOTEID HAS CHANGED ALONGSIDE TITLE AND INPUT
  useEffect(() => {
    // FIND A NOTE WITH THE SAME TITLE AND CONTENT AS CURRENT INPUT AND TITLE
    const currentNote = notes?.find(
      (note) => input === note.content && title === note.title
    );
    const isNoteUnchanged = selectedNoteId === currentNote?.id;

    if (isNoteUnchanged || !selectedNoteId || !user) return;

    setIsSynced(false);

    // DEBOUNCING THE UPDATE NOTE FUNCTION
    const interval = setTimeout(() => {
      updateNote({
        id: selectedNoteId,
        title: title === "" ? "Untitled" : title,
        content: input,
      });

      toast.success("Synced Succesfully", {
        position: "bottom-right",
      });

      setIsSynced(true);
    }, 3000);

    return () => clearInterval(interval);
  }, [title, input, selectedNoteId, notes, user]);

  return (
    <div
      className={`flex w-full flex-col items-center justify-start overflow-y-scroll p-2 md:p-5`}
    >
      <IconButton
        extraClasses={`ml-auto md:hidden transition-transform duration-400 rotate-180 ${
          shiftRight ? "translate-x-52" : "translate-x-0"
        }`}
        onClick={() => setShiftRight(true)}
      >
        <ChevronDoubleLeft className="h-5 w-5" />
      </IconButton>

      {/*BUTTONS AND OTHER STATUS ELEMENTS*/}
      <PostButtons
        deleteNote={deleteNote}
        selectedNoteId={selectedNoteId}
        setSelectedNoteId={setSelectedNoteId}
        isSynced={isSynced}
        setIsSynced={setIsSynced}
        input={input}
        title={title}
        setInput={setInput}
        setTitle={setTitle}
        notes={notes}
        updateNote={updateNote}
        shiftRight={shiftRight}
      />

      {/*EDITOR BUTTONS AND THE EDITOR*/}
      <MilkdownProvider>
        <EditorButtons shiftRight={shiftRight} />

        <div
          className={`w-full max-w-3xl flex-col rounded-xl bg-white p-5 transition-transform duration-300 ${
            shiftRight ? "translate-x-52" : "translate-x-0"
          }`}
        >
          {/* TITLE OF THE POST */}
          <input
            data-testid="noteTitle"
            type="text"
            className="w-full appearance-none border-none p-0 text-5xl font-bold leading-relaxed focus:outline-none focus:ring-0"
            onChange={(e) => {
              if (title === "") {
                setTitle("Untitled");
              }
              setTitle(e.target.value);
            }}
            value={title}
          />

          {/* SEPARATOR */}
          <div className="mb-5 h-0.5 w-full rounded-full bg-slate-200" />

          <MilkdownEditor
            input={input}
            setInput={setInput}
            className="prose !max-h-none min-h-screen !max-w-none p-2 focus:outline-none"
            notes={notes}
          />
        </div>
      </MilkdownProvider>
    </div>
  );
};

export default TextArea;
