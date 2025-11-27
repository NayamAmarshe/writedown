"use client";

import { useCollectionData } from "@/components/hooks/firebase-hooks";
import { useMemo } from "react";
import { collection, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { notesConverter } from "@/lib/firestoreDataConverter";

type UsePublicNotesProps = {
  ownerUid?: string;
};

export const usePublicNotes = ({ ownerUid }: UsePublicNotesProps) => {
  const publicNotesQuery = useMemo(() => {
    if (!ownerUid) return null;
    return query(
      collection(db, "users", ownerUid, "notes"),
      where("isPublic", "==", true),
      orderBy("updatedAt", "desc")
    ).withConverter(notesConverter);
  }, [ownerUid]);

  const [notes, loading, error, snapshot] = useCollectionData(publicNotesQuery);

  return {
    notes,
    loading,
    error,
    snapshot,
  };
};

export default usePublicNotes;
