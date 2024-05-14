import { atom } from "jotai";

type selectedNoteType = {
  id: string;
  title: string;
  isPublic: boolean;
  content: string;
  lastUpdated: number | null;
};

export const selectedNoteType = atom<selectedNoteType>({
  id: "",
  title: "",
  isPublic: false,
  content: "",
  lastUpdated: null,
});
