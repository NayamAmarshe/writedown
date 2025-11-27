"use client";

import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { NoteDocument } from "@/lib/types/db";
import { notesConverter } from "@/lib/firestoreDataConverter";
import { selectedNoteAtom } from "@/lib/atoms/post-data-atom";

import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { useCallback, useMemo } from "react";
import { useAtom } from "jotai";
import { generateSlug } from "random-word-slugs";
import { useCollectionData } from "@/components/hooks/firebase-hooks";

type UseNotesProps = {
  userId: string | undefined;
};

export const useNotes = ({ userId }: UseNotesProps) => {
  const [selectedNote, setSelectedNote] = useAtom(selectedNoteAtom);

  const notesQuery = useMemo(() => {
    if (!userId) return null;
    return query(
      collection(db, "users", userId, "notes"),
      orderBy("updatedAt", "desc")
    ).withConverter(notesConverter);
  }, [userId]);

  const [notes, loading, error, snapshot] = useCollectionData(notesQuery);

  const createNote = useCallback(async () => {
    if (!userId) return;

    const currentTime = new Date().getTime();
    const title = generateSlug(2, { format: "title" });
    const slug = title.toLowerCase().replace(/ /g, "-");

    const noteData: NoteDocument = {
      id: slug,
      content: "",
      isPublic: false,
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
      isPublic?: boolean;
      publishedAt?: number;
    }) => {
      if (!userId || !note) return;

      const notesRef = doc(db, "users", userId, "notes", note.id);
      const currentTime = new Date().getTime();
      const shouldBePublic = !!note.isPublic;
      const publishedAtTimestamp = shouldBePublic
        ? (note.publishedAt ?? currentTime)
        : undefined;
      const updatedContent: Record<string, unknown> = {
        ...note,
        isPublic: shouldBePublic,
        updatedAt: currentTime,
      };

      updatedContent.publishedAt = shouldBePublic
        ? publishedAtTimestamp
        : deleteField();

      try {
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
        await deleteDoc(notesRef);
      } catch (error) {
        toast.error("Failed to delete post, please try again later.");
      }
    },
    [userId]
  );

  const toggleNoteVisibility = useCallback(
    async (noteId: string, makePublic: boolean) => {
      if (!userId || !noteId) return;

      const notesRef = doc(db, "users", userId, "notes", noteId);
      const currentTime = new Date().getTime();
      const visibilityPayload: Record<string, unknown> = makePublic
        ? {
            isPublic: true,
            publishedAt: currentTime,
            updatedAt: currentTime,
          }
        : {
            isPublic: false,
            updatedAt: currentTime,
            publishedAt: deleteField(),
          };

      try {
        await updateDoc(notesRef, visibilityPayload);

        setSelectedNote((prev) =>
          prev.id === noteId
            ? { ...prev, isPublic: makePublic, lastUpdated: currentTime }
            : prev
        );
      } catch (error) {
        toast.error(
          "Failed to update post visibility, please try again later."
        );
      }
    },
    [userId, setSelectedNote]
  );

  return {
    notes,
    notesLoading: loading,
    notesError: error,
    notesSnapshot: snapshot,
    createNote,
    updateNote,
    deleteNote,
    toggleNoteVisibility,
  };
};

export default useNotes;
