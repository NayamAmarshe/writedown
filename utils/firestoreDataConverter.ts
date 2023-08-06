import {
  NoteDocument,
  PublicNoteDocument,
  UserDocument,
} from "@/types/utils/firebaseOperations";
import { QueryDocumentSnapshot } from "firebase/firestore";

export const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});

export const userDocConverter = converter<UserDoc>();
export const notesConverter = converter<NoteDocument>();
export const publicNotesConverter = converter<PublicNoteDocument>();
