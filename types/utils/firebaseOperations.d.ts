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
