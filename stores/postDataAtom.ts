import { atom } from "jotai";

type SelectedNote = {
  id: string;
  title: string;
  isPublic: boolean;
  content: string;
  lastUpdated: number | null;
};

export const selectedNoteAtom = atom<SelectedNote>({
  id: "",
  title: "",
  isPublic: false,
  content: "",
  lastUpdated: null,
});
