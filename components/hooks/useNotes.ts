import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { TNotesData } from "@/types/utils/firebaseOperations";
import { isSyncingAtom } from "@/stores/isSyncing";
import { useCallback, useMemo } from "react";
import { db } from "@/lib/firebase";
import { useAtom } from "jotai";

type UseNotesProps = {
  userId: string | undefined;
};

export const useNotes = ({ userId }: UseNotesProps) => {
  const [isSyncing, setIsSyncing] = useAtom(isSyncingAtom);
  // const notes = useMemo(async () => {
  //   if (!userId) return;

  //   const notesRef = doc(db, "notes", userId);
  //   const notesSnap = await getDoc(notesRef);
  //   if (notesSnap.exists()) {
  //     return notesSnap.data();
  //   } else {
  //     // doc.data() will be undefined in this case
  //     await setDoc(notesRef, []);
  //   }
  //   // return channels.docs.map((channel) => channel.data() as IChannelData);
  //   return [];
  // }, [userId]);

  const createNote = useCallback(async () => {
    if (!userId) return;

    const id = crypto.randomUUID();
    const serverTime = serverTimestamp();

    const noteData: TNotesData = {
      id,
      content: "",
      public: false,
      slug: id,
      title: "Untitled",
      userId,
      createdAt: serverTime,
      updatedAt: serverTime,
    };

    const notesRef = doc(db, "users", userId, "notes", id);

    try {
      // Create a document inside channelsRef array
      setDoc(notesRef, noteData, { merge: true });
      return id;
    } catch (error) {
      console.log("🚀 => file: operations.ts:37 => error", error);
    }
  }, [userId]);

  const updateNote = useCallback(
    async (note: { id: string; title: string; content: string }) => {
      if (!userId || !note) return;
      setIsSyncing(true);

      const notesRef = doc(db, "users", userId, "notes", note.id);

      try {
        // Create a document inside channelsRef array
        updateDoc(notesRef, note);
        setIsSyncing(false);
      } catch (error) {
        console.log("🚀 => file: operations.ts:37 => error", error);
      }
    },
    [userId]
  );

  const deleteNote = useCallback(
    async (noteId: string) => {
      if (!userId || !noteId) return;

      const notesRef = doc(db, "users", userId, "notes", noteId);

      try {
        // Create a document inside channelsRef array
        await deleteDoc(notesRef);
      } catch (error) {
        console.log("🚀 => file: operations.ts:37 => error", error);
      }
    },
    [userId]
  );

  return { createNote, updateNote, deleteNote };
};

export default useNotes;
