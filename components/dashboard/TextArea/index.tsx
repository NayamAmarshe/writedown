import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { notesConverter } from "@/utils/firestoreDataConverter";
import { collection, orderBy, query } from "firebase/firestore";
import MilkdownEditor from "@/components/ui/MilkdownEditor";
import React, { useEffect, useMemo, useState } from "react";
import { MilkdownProvider } from "@milkdown/react";
import { useAtom, useAtomValue } from "jotai";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";
type TextAreaProps = {
  user?: User | null;
  shiftRight?: boolean;
};

const TextArea = ({ user, shiftRight }: TextAreaProps) => {
  const [selectedNoteId, setSelectedNoteId] = useAtom(selectedNoteIdAtom);

  const [input, setInput] = useState("");

  const [firestoreNotes] = useCollectionData(
    user &&
      query(
        collection(db, "users", user.uid, "notes"),
        orderBy("createdAt", "desc")
      ).withConverter(notesConverter)
  );

  const notes = useMemo(() => {
    if (!firestoreNotes) return;
    setSelectedNoteId(firestoreNotes[0].id);
    return firestoreNotes;
  }, [firestoreNotes]);

  useEffect(() => {
    if (!notes) return;

    const selectedNoteContent = notes.find(
      (note) => note.id === selectedNoteId
    )?.content;

    setInput(selectedNoteContent || "");
  }, [notes]);

  return (
    <div className="flex w-full items-start justify-center overflow-y-auto">
      <div
        className={`mt-52 h-full w-full max-w-3xl rounded-xl bg-white p-5 transition-transform duration-300 ${
          shiftRight ? "translate-x-52" : "translate-x-0"
        }`}
      >
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
