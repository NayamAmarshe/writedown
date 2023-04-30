import { IDBObject } from "@/types/idbTypes";
import { get, set, del } from "idb-keyval";
import { useCallback } from "react";

export const useIDB = () => {
  const addToStore = async (key: string, value: IDBObject) => {
    await set(key, value);
  };

  const getFromStore = async (
    selectedNoteId: string
  ): Promise<IDBObject | null> => {
    if (!selectedNoteId) return null;

    const idbObject = await get(selectedNoteId);

    return (
      idbObject || {
        editorTitle: "Untitled",
        editorContent: "",
      }
    );
  };
  const deleteFromStore = async (selectedNoteId: string) => {
    if (!selectedNoteId) return;

    await del(selectedNoteId);
  };

  return { addToStore, getFromStore, deleteFromStore };
};
