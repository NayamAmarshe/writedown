export type Note = {
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

export type PublicNote = {
  userId: string;
};

export type UserDoc = {
  uid: string;
  email: string;
  username: string | undefined;
  photoURL: string;
  displayName: string;
  createdAt: string;
};
