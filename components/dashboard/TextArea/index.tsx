import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { inputAtom, titleAtom } from "@/stores/editTextAreaAtom";
import { notesConverter } from "@/utils/firestoreDataConverter";
import { collection, orderBy, query } from "firebase/firestore";
import MilkdownEditor from "@/components/ui/MilkdownEditor";
import React, { useEffect, useMemo, useState } from "react";
import EditorButtons from "@/components/ui/EditorButtons";
import useNotes from "@/components/hooks/useNotes";
import { isSyncingAtom } from "@/stores/isSyncing";
import { MilkdownProvider } from "@milkdown/react";
import { isSyncedAtom } from "@/stores/isSynced";
import { useAtom, useAtomValue } from "jotai";
import { toast } from "react-hot-toast";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";
type TextAreaProps = {
  user?: User | null;
  shiftRight?: boolean;
};

const TextArea = ({ user, shiftRight }: TextAreaProps) => {
  const [selectedNoteId, setSelectedNoteId] = useAtom(selectedNoteIdAtom);
  const [isSynced, setIsSynced] = useAtom(isSyncedAtom);
  const [title, setTitle] = useAtom(titleAtom);
  const [input, setInput] = useAtom(inputAtom);
  const [isSyncing, setIsSyncing] = useAtom(isSyncingAtom);
  const { updateNote, deleteNote, createNote } = useNotes({
    userId: user?.uid,
  });

  const [firestoreNotes] = useCollectionData(
    user &&
      query(
        collection(db, "users", user.uid, "notes"),
        orderBy("updatedAt", "desc")
      ).withConverter(notesConverter)
  );

  const notes = useMemo(() => {
    if (!firestoreNotes) return;
    if (firestoreNotes.length > 0 && !selectedNoteId) {
      setSelectedNoteId(firestoreNotes[0].id);
    }
    return firestoreNotes;
  }, [firestoreNotes]);

  const saveNoteHandler = () => {
    if (!selectedNoteId || !notes?.find((note) => note.id === selectedNoteId))
      return;
    updateNote({
      id: selectedNoteId,
      title: title === "" ? "Untitled" : title,
      content: input,
    });
    setIsSynced(true);
    toast.success("Saved!");
  };

  const deleteNoteHandler = () => {
    if (!firestoreNotes || !selectedNoteId) return;
    deleteNote(selectedNoteId);
    toast.success("Deleted!");

    const noteIndex = firestoreNotes.findIndex(
      (note) => note.id === selectedNoteId
    );
    const newIndex = noteIndex > 0 ? noteIndex - 1 : noteIndex + 1;
    setSelectedNoteId(firestoreNotes[newIndex]?.id || null);
    if (firestoreNotes.length < 2) {
      setTitle("");
      setInput("");
      return;
    }
  };

  useEffect(() => {
    if (!selectedNoteId) {
      createNote().then((newId) => {
        if (!newId) return;
        if (!isSynced && selectedNoteId) {
          updateNote({
            id: selectedNoteId,
            title: title,
            content: input,
          });
          toast.success("Autosaved!");
          setIsSynced(true);
        }
        setSelectedNoteId(newId);
      });
    }
    if (!notes) return;

    const selectedNote = notes.find((note) => note.id === selectedNoteId);
    console.log("🚀 => file: index.tsx:40 => selectedNote:", selectedNote);
    if (!selectedNote) return;

    setInput(selectedNote.content);
    setTitle(selectedNote.title);
  }, [notes, selectedNoteId]);

  useEffect(() => {
    //CHECKING IF SELECTEDNOTEID HAS CHANGED ALONGSIDE TITLE AND INPUT
    if (
      selectedNoteId ===
        notes?.find((note) => input === note.content && title === note.title)
          ?.id ||
      !selectedNoteId ||
      !user
    )
      return;
    setIsSynced(false);
    const interval = setTimeout(() => {
      updateNote({
        id: selectedNoteId,
        title: title === "" ? "Untitled" : title,
        content: input,
      });
      toast.success("Autosaved!");
      setIsSynced(true);
    }, 3000);

    return () => clearInterval(interval);
  }, [title, input]);

  return (
    <div className="flex w-full flex-col items-center justify-start overflow-y-scroll">
      {/*BUTTONS AND OTHER STATUS ELEMENTS*/}
      <div
        className={`mt-52 flex w-full max-w-3xl select-none items-end justify-between gap-4 transition-transform duration-300 ${
          shiftRight ? "translate-x-52" : "translate-x-0"
        }`}
      >
        <div>Last Updated at NA</div>
        <div className="flex gap-4">
          <button
            id="del"
            type="button"
            className="rounded-full border-2 border-red-600 bg-red-100 p-2 font-bold text-red-600"
            onClick={deleteNoteHandler}
          >
            Delete Post
          </button>
          <button
            type="button"
            className="rounded-full border-2 border-indigo-600 bg-indigo-100 p-2 font-bold text-indigo-600"
            onClick={saveNoteHandler}
          >
            {isSyncing ? "Saving..." : isSynced ? "Saved" : "Save Note"}
          </button>
        </div>
      </div>

      {/*EDITOR BUTTONS AND THE EDITOR*/}
      <MilkdownProvider>
        <div
          className={`m-4 flex w-full max-w-3xl rounded-xl bg-white p-2 transition-transform duration-300 ${
            shiftRight ? "translate-x-52" : "translate-x-0"
          }`}
        >
          <EditorButtons />
        </div>

        <div
          className={`min-h-full w-full max-w-3xl rounded-xl bg-white p-5 transition-transform duration-300 ${
            shiftRight ? "translate-x-52" : "translate-x-0"
          }`}
        >
          <input
            type="text"
            className="w-full appearance-none border-none p-0 text-3xl font-bold leading-relaxed focus:outline-none"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            value={title}
          />

          <div className="mb-5 mt-3 h-0.5 w-full rounded-full bg-slate-200" />

          <MilkdownEditor
            input={input}
            setInput={setInput}
            className="markdown prose h-full min-w-full focus:outline-none"
            notes={notes}
          />
        </div>
      </MilkdownProvider>
    </div>
  );
};

export default TextArea;
