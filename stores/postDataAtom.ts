import { atom } from "jotai";

export const postTitleAtom = atom<string>("");
export const postContentAtom = atom<string>("");
export const postLastUpdatedAtom = atom<number | null>(null);
