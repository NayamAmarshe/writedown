import {
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { notesConverter } from "@/utils/firestoreDataConverter";
import { TNotesData } from "@/types/utils/firebaseOperations";
import { useCallback, useEffect, useState } from "react";
import { isSyncingAtom } from "@/stores/isSyncing";
import { toast } from "react-hot-toast";
import localForage from "localforage";
import { db } from "@/lib/firebase";
import { useSetAtom } from "jotai";

type UseNotesProps = {
  userId?: string;
};

export const useNotes = ({ userId }: UseNotesProps) => {
  const setIsSyncing = useSetAtom(isSyncingAtom);

  const [notes, setNotes] = useState<TNotesData[]>([]);
  const [localNotes, setLocalNotes] = useState<TNotesData[]>([]);
  const [cloudNotes] = useCollectionData(
    userId
      ? query(
          collection(db, "users", userId, "notes"),
          orderBy("updatedAt", "desc")
        ).withConverter(notesConverter)
      : null,
    {
      snapshotListenOptions: {
        includeMetadataChanges: true,
      },
      initialValue: [],
    }
  );

  /**
   * Fetch local notes from localForage on first render
   */
  useEffect(() => {
    localForage.getItem<TNotesData[]>("notes").then((notes) => {
      if (!notes) {
        localForage.setItem("notes", []).then(() => {
          setLocalNotes([]);
        });
        return;
      }
      setLocalNotes(notes || []);
    });
  }, []);

  /**
   * Merge local notes with cloud notes everytime they change
   */
  useEffect(() => {
    const mergedNotes = localNotes.map((localNote) => {
      const cloudNote = cloudNotes?.find(
        (cloudNote) => localNote.id === cloudNote.id
      );
      if (!cloudNote) {
        return localNote;
      }
      return cloudNote;
      // /**
      //  * If cloud note and local note are the same
      //  * then delete local note from localforage
      //  */
      // if (
      //   localNote.title === cloudNote.title &&
      //   localNote.content === cloudNote.content
      // ) {
      //   updateLocalNotes(localNote.id);
      // }
    });
    setNotes(mergedNotes);
  }, [cloudNotes, localNotes]);

  useEffect(() => {
    if (localNotes.length === 0) {
      createNote();
    }
  }, [localNotes]);

  const createNote = useCallback(async () => {
    if (!userId) return;
    const id = crypto.randomUUID();
    const currentTime = new Date().getTime();
    const noteData: TNotesData = {
      id,
      content: "",
      public: false,
      slug: id,
      title: "Untitled",
      userId,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
    try {
      await localForage.setItem("notes", [...localNotes, noteData]);
      setLocalNotes([...localNotes, noteData]);
      return id;
    } catch (error) {
      toast.error("Failed to create post, please try again later.");
    }
  }, [userId, new Date().getTime()]);

  const updateNote = useCallback(
    async (note: { id: string; title: string; content: string }) => {
      if (!userId || !note) return;
      setIsSyncing(true);
      const notesRef = doc(db, "users", userId, "notes", note.id);
      const serverTime = new Date().getTime();
      try {
        if (cloudNotes?.find((cloudNote) => cloudNote.id === note.id)) {
          await updateDoc(notesRef, { ...note, updatedAt: serverTime });
        }
        setIsSyncing(false);
      } catch (error) {
        toast.error("Failed to update post, please try again later.");
      }
    },
    [userId]
  );

  const updateLocalNote = useCallback(
    async (note: { id: string; title: string; content: string }) => {
      if (!userId || !note) return;
      const currentTime = new Date().getTime();
      try {
        const updatedLocalNotes = localNotes.map((localNote) => {
          if (localNote.id === note.id) {
            return {
              ...note,
              updatedAt: currentTime,
              title: note.title,
              content: note.content,
            } as TNotesData;
          }
          return localNote;
        });
        await localForage.setItem("notes", updatedLocalNotes);
        setLocalNotes(updatedLocalNotes);
      } catch (error) {
        toast.error("Failed to update post, please try again later.");
      }
    },
    [userId]
  );

  const deleteNote = useCallback(
    async (noteId: string) => {
      if (!userId || !noteId) return;
      const notesRef = doc(db, "users", userId, "notes", noteId);
      try {
        if (cloudNotes?.find((note) => note.id === noteId)) {
          await deleteDoc(notesRef);
        }
        const updatedLocalNotes = localNotes.filter(
          (localNote) => localNote.id !== noteId
        );
        setLocalNotes(updatedLocalNotes);
        await localForage.setItem("notes", updatedLocalNotes);
      } catch (error) {
        toast.error("Failed to delete post, please try again later.");
      }
    },
    [userId]
  );

  return {
    localNotes,
    cloudNotes,
    /**
     * Notes from firestore and localforage combined
     */
    notes,
    /**
     * Create a new note
     */
    createNote,
    updateNote,
    updateLocalNote,
    deleteNote,
  };
};

export default useNotes;
