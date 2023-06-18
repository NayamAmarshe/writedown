import { TNotesData, TPublicNotes } from "@/types/utils/firebaseOperations";
import { QueryDocumentSnapshot } from "firebase/firestore";

export const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});

export const notesConverter = converter<TNotesData>();
export const publicNotesConverter = converter<TPublicNotes>();
