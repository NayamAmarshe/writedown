import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { notesConverter } from "@/utils/firestoreDataConverter";
import { collection, orderBy, query } from "firebase/firestore";
import MilkdownEditor from "@/components/ui/MilkdownEditor";
import React, { useEffect, useMemo, useState } from "react";
import useNotes from "@/components/hooks/useNotes";
import { MilkdownProvider } from "@milkdown/react";
import { useAtom, useAtomValue } from "jotai";
import { toast } from "react-hot-toast";
import { stringify } from "querystring";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";
type TextAreaProps = {
  user?: User | null;
  shiftRight?: boolean;
};

const TextArea = ({ user, shiftRight }: TextAreaProps) => {
  const [selectedNoteId, setSelectedNoteId] = useAtom(selectedNoteIdAtom);
  const [title, setTitle] = useState("");
  const [input, setInput] = useState("");
  const { updateNote, deleteNote } = useNotes({ userId: user?.uid });

  const [firestoreNotes] = useCollectionData(
    user &&
      query(
        collection(db, "users", user.uid, "notes"),
        orderBy("updatedAt", "desc")
      ).withConverter(notesConverter)
  );

  const notes = useMemo(() => {
    if (!firestoreNotes) return;
    if (firestoreNotes.length > 0 && !selectedNoteId)
      setSelectedNoteId(firestoreNotes[0].id);
    return firestoreNotes;
  }, [firestoreNotes]);

  useEffect(() => {
    if (!notes) return;

    const selectedNote = notes.find((note) => note.id === selectedNoteId);
    console.log("🚀 => file: index.tsx:40 => selectedNote:", selectedNote);

    if (!selectedNote) return;
    setInput(selectedNote.content);
    setTitle(selectedNote.title);
  }, [notes, selectedNoteId]);

  useEffect(() => {
    if (!selectedNoteId || !user) return;
    const interval = setTimeout(() => {
      updateNote({
        id: selectedNoteId,
        title: title === "" ? "Untitled" : title,
        content: input,
      });
      toast.success("Autosaved!");
    }, 3000);

    return () => clearInterval(interval);
  }, [title, input]);

  return (
    <div className="flex w-full items-start justify-center overflow-y-scroll">
      <div
        className={`mt-52 h-fit min-h-full w-full max-w-3xl rounded-xl bg-white p-5 transition-transform duration-300 ${
          shiftRight ? "translate-x-52" : "translate-x-0"
        }`}
      >
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => {
              if (!selectedNoteId) return;
              updateNote({
                id: selectedNoteId,
                title: title === "" ? "Untitled" : title,
                content: input,
              });
              toast.success("Saved!");
            }}
          >
            Save
          </button>
          <button
            type="button"
            onClick={(e) => {
              if (!firestoreNotes || !selectedNoteId) return;
              deleteNote(selectedNoteId);
              toast.success("Deleted!");
              setSelectedNoteId(firestoreNotes[0].id);
            }}
          >
            Delete
          </button>
        </div>
        <input
          type="text"
          className="w-full appearance-none border-none p-0 text-3xl font-bold leading-relaxed focus:outline-none"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          value={title}
        />

        <div className="mb-5 mt-3 h-0.5 w-full rounded-full bg-slate-200" />

        <MilkdownProvider>
          <MilkdownEditor
            input={input}
            setInput={setInput}
            className="markdown prose h-max min-w-full focus:outline-none"
            notes={notes}
          />
        </MilkdownProvider>
      </div>
    </div>
  );
};

export default TextArea;
