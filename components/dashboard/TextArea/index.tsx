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

  useEffect(() => {
    if (!notes) return;

    // IF THERE ARE NOTES AND NO NOTE IS SELECTED, SELECT THE FIRST NOTE
    if (notes.length > 0 && !selectedNoteId) {
      setSelectedNoteId(notes[0].id);
      setInput(notes[0].content);
      setTitle(notes[0].title);
      return;
    }

    if (!selectedNoteId) return;

    // IF THERE ARE NOTES AND A NOTE IS SELECTED, FIND THE NOTE AND SET THE INPUT AND TITLE
    const selectedNote = notes.find((note) => note.id === selectedNoteId);
    if (!selectedNote) return;
    setInput(selectedNote.content);
    setTitle(selectedNote.title);
  }, [notes, selectedNoteId]);

  useEffect(() => {
    if (!notes) return;

    const createNewNote = async () => {
      const newId = await createNote();
      if (!newId) return;

      if (!isSynced && selectedNoteId) {
        await updateNote({
          id: selectedNoteId,
          title: title,
          content: input,
        });
        setIsSynced(true);
        toast.success("Synced Successfully", {
          position: "bottom-right",
        });
      }

      setSelectedNoteId(newId);
    };

    if (notes.length === 0) {
      createNewNote();
    }
  }, [notes]);

  useEffect(() => {
    // FIND THE CURRENT NOTE AND CHECK IF IT IS UNCHANGED
    const currentNote = notes?.find(
      (note) => input === note.content && title === note.title
    );
    const isNoteUnchanged = currentNote?.id === selectedNoteId;

    if (isNoteUnchanged || !selectedNoteId || !user) return;

    setIsSynced(false);

    // DEBOUNCE THE UPDATE FUNCTION
    const interval = setTimeout(() => {
      updateNote({
        id: selectedNoteId,
        title: title === "" ? "Untitled" : title,
        content: input,
      });

      toast.success("Synced Successfully", {
        position: "bottom-right",
      });

      setIsSynced(true);
    }, 2000);

    return () => clearInterval(interval);
  }, [title, input]);

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
