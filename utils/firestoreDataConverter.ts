import {
  NoteDocument,
  PublicNoteDocument,
} from "@/types/utils/firebaseOperations";
import { QueryDocumentSnapshot } from "firebase/firestore";

export const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});

export const notesConverter = converter<NoteDocument>();
export const publicNotesConverter = converter<PublicNoteDocument>();
