import { atom } from "jotai";

export const postTitleAtom = atom<string>("");
export const postPublicAtom = atom<boolean>(false);
export const postPublishAtom = atom<boolean>(false);
export const postContentAtom = atom<string>("");
export const postLastUpdatedAtom = atom<number | null>(null);
