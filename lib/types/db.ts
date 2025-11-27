export type NoteDocument = {
  id: string;
  createdAt?: number;
  updatedAt: number;
  publishedAt?: number;
  title: string;
  content: string;
  userId: string;
  slug: string;
  isPublic: boolean;
};

export type UserDocument = {
  displayName: string;
  photoURL: string;
  uid: string;
  username?: string;
  createdAt: number;
  updatedAt: number;
  email: string;
  bio?: string;
};

export type UserPrivateDocument = {
  createdAt: number;
  email: string;
};

export type UsernameDocument = {
  uid: string;
  displayName: string;
  photoURL: string;
  bio: string;
};
