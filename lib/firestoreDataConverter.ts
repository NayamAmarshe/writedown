import { NoteDocument, UserDocument, UsernameDocument } from "@/lib/types/db";
import { QueryDocumentSnapshot } from "firebase/firestore";

export const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});

export const userDocConverter = converter<UserDocument>();

export const notesConverter = {
  toFirestore: (data: NoteDocument) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const data = snap.data() as NoteDocument & { public?: boolean };
    return {
      ...data,
      isPublic: data.isPublic ?? data.public ?? false,
    };
  },
};

export const usernameDocConverter = converter<UsernameDocument>();
