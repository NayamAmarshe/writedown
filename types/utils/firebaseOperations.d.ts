import { FieldValue, Timestamp } from "firebase/firestore";

export type TNotesData = {
  id: string;
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
  title: string;
  content: string;
  userId: string;
  slug: string;
  public: boolean;
};
