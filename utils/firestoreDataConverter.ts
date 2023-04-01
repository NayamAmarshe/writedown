import { IChannelData, IMessageData } from "@/types/utils/firebaseOperations";
import { TNotesData } from "@/types/utils/firebaseOperations";
import { QueryDocumentSnapshot } from "firebase/firestore";

export const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});

export const channelConverter = converter<IChannelData>();
export const messagesConverter = converter<IMessageData>();
export const notesConverter = converter<TNotesData>();
