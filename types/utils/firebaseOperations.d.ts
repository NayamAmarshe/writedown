export type NoteDocument = {
  id: string;
  createdAt?: number;
  updatedAt: number;
  publishedAt?: number;
  title: string;
  content: string;
  userId: string;
  slug: string;
  public: boolean;
};

export type PublicNoteDocument = {
  userId: string;
};

export type UserDocument = {
  displayName: string;
  photoURL: string;
  uid: string;
  username?: string;
};

export type UserPrivateDocument = {
  createdAt: number;
  email: string;
};
