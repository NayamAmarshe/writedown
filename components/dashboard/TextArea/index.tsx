import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { inputAtom, titleAtom } from "@/stores/editTextAreaAtom";
import { notesConverter } from "@/utils/firestoreDataConverter";
import { collection, orderBy, query } from "firebase/firestore";
import MilkdownEditor from "@/components/ui/MilkdownEditor";
import React, { useEffect, useMemo, useState } from "react";
import CloudArrowUp from "@/components/icons/CloudArrowUp";
import EditorButtons from "@/components/ui/EditorButtons";
import ArrowPath from "@/components/icons/ArrowPath";
import useNotes from "@/components/hooks/useNotes";
import { isSyncingAtom } from "@/stores/isSyncing";
import { MilkdownProvider } from "@milkdown/react";
import { isSyncedAtom } from "@/stores/isSynced";
import { useAtom, useAtomValue } from "jotai";
import Check from "@/components/icons/Check";
import Trash from "@/components/icons/Trash";
import { toast } from "react-hot-toast";
import PostButtons from "./PostButtons";
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
    if (notes.length > 0 && !selectedNoteId) {
      setSelectedNoteId(notes[0].id);
    }

    if (!notes) return;
    const selectedNote = notes.find((note) => note.id === selectedNoteId);
    if (!selectedNote) return;
    setInput(selectedNote.content);
    setTitle(selectedNote.title);
  }, [notes, selectedNoteId]);

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
          toast.success("Autosaved!");
          setIsSynced(true);
        }
        setSelectedNoteId(newId);
      });
    }
  }, [notes]);

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
          className={`h-fit w-full max-w-3xl rounded-xl bg-white p-5 transition-transform duration-300 ${
            shiftRight ? "translate-x-52" : "translate-x-0"
          }`}
        >
          {/* TITLE OF THE POST */}
          <input
            type="text"
            className="w-full appearance-none border-none p-0 text-3xl font-bold leading-relaxed focus:outline-none focus:ring-0"
            onChange={(e) => {
              if (title === "") {
                setTitle("Untitled");
              }
              setTitle(e.target.value);
            }}
            value={title}
          />

          {/* SEPARATOR */}
          <div className="mb-5 mt-3 h-0.5 w-full rounded-full bg-slate-200" />

          <MilkdownEditor
            input={input}
            setInput={setInput}
            className="prose focus:outline-none"
            notes={notes}
          />
        </div>
      </MilkdownProvider>
    </div>
  );
};

export default TextArea;
