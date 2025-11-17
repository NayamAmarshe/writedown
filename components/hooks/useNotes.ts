"use client";

import {
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { NoteDocument } from "@/types/utils/firebaseOperations";
import { notesConverter } from "@/lib/firestoreDataConverter";
import { selectedNoteAtom } from "@/lib/atoms/post-data-atom";

import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { useCallback } from "react";
import { useAtom } from "jotai";
import { generateSlug } from "random-word-slugs";

type UseNotesProps = {
  userId: string | undefined;
};

export const useNotes = ({ userId }: UseNotesProps) => {
  const [selectedNote, setSelectedNote] = useAtom(selectedNoteAtom);

  const [notes, loading, error, snapshot] = useCollectionData(
    userId
      ? query(
          collection(db, "users", userId, "notes"),
          orderBy("updatedAt", "desc")
        ).withConverter(notesConverter)
      : null
  );

  const createNote = useCallback(async () => {
    if (!userId) return;

    const currentTime = new Date().getTime();
    const title = generateSlug(2, { format: "title" });
    const slug = title.toLowerCase().replace(/ /g, "-");

    const noteData: NoteDocument = {
      id: slug,
      content: "",
      public: false,
      slug,
      title,
      userId,
      createdAt: currentTime,
      updatedAt: currentTime,
    };

    const notesRef = doc(db, "users", userId, "notes", slug);

    try {
      // Create a document inside channelsRef array
      setDoc(notesRef, noteData, { merge: true });
      return noteData;
    } catch (error) {
      toast.error("Failed to create post, please try again later.");
    }
  }, [userId]);

  const updateNote = useCallback(
    async (note: {
      id: string;
      title: string;
      content: string;
      public?: boolean;
    }) => {
      if (!userId || !note) return;

      const notesRef = doc(db, "users", userId, "notes", note.id);
      const currentTime = new Date().getTime();
      const updatedContent = note.public
        ? { ...note, updatedAt: currentTime, publishedAt: currentTime }
        : { ...note, updatedAt: currentTime };

      try {
        // Create a document inside channelsRef array
        await updateDoc(notesRef, updatedContent);
        setSelectedNote((prev) => ({
          ...prev,
          lastUpdated: currentTime,
        }));
      } catch (error) {
        toast.error("Failed to update post, please try again later.");
      }
    },
    [userId, setSelectedNote]
  );

  const deleteNote = useCallback(
    async (noteId: string) => {
      if (!userId || !noteId) return;

      const notesRef = doc(db, "users", userId, "notes", noteId);

      try {
        // Create a document inside channelsRef array
        await deleteDoc(notesRef);
      } catch (error) {
        toast.error("Failed to delete post, please try again later.");
      }
    },
    [userId]
  );

  return {
    notes,
    notesLoading: loading,
    notesError: error,
    notesSnapshot: snapshot,
    createNote,
    updateNote,
    deleteNote,
  };
};

export default useNotes;
