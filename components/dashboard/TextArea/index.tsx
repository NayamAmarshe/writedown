import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { notesConverter } from "@/utils/firestoreDataConverter";
import { collection, orderBy, query } from "firebase/firestore";
import MilkdownEditor from "@/components/ui/MilkdownEditor";
import React, { useEffect, useMemo, useState } from "react";
import useNotes from "@/components/hooks/useNotes";
import { MilkdownProvider } from "@milkdown/react";
import { useAtom, useAtomValue } from "jotai";
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
  const { updateNote } = useNotes({ userId: user?.uid });

  const [firestoreNotes] = useCollectionData(
    user &&
      query(
        collection(db, "users", user.uid, "notes"),
        orderBy("updatedAt", "desc")
      ).withConverter(notesConverter)
  );

  const notes = useMemo(() => {
    if (!firestoreNotes) return;
    if (firestoreNotes.length > 0) setSelectedNoteId(firestoreNotes[0].id);
    return firestoreNotes;
  }, [firestoreNotes]);

  useEffect(() => {
    if (!notes) return;

    const selectedNote = notes.find((note) => note.id === selectedNoteId);
    console.log("🚀 => file: index.tsx:40 => selectedNote:", selectedNote);

    setInput(selectedNote?.content || "");
    setTitle(selectedNote?.title || "");
  }, [notes, selectedNoteId]);

  useEffect(() => {
    if (!selectedNoteId || !user) return;
    updateNote({
      id: selectedNoteId,
      title: title === "" ? "Untitled" : title,
      content: input,
    });
  }, [title, input]);

  return (
    <div className="flex w-full items-start justify-center overflow-y-auto">
      <div
        key={selectedNoteId}
        className={`h-fit min-h-[75%] w-full max-w-3xl rounded-xl bg-white p-5 transition-transform duration-300 ${
          shiftRight ? "translate-x-52" : "translate-x-0"
        }`}
      >
        <input
          className="text-3xl font-bold focus:outline-none"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          value={title}
        />
        <div className="h-0.5 w-full bg-slate-300"></div>
        <MilkdownProvider>
          <MilkdownEditor
            input={input}
            setInput={setInput}
            className="markdown prose h-full min-w-full focus:outline-none"
          />
        </MilkdownProvider>
      </div>
    </div>
  );
};

export default TextArea;
