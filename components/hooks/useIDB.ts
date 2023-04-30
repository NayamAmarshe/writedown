import { IDBObject } from "@/types/idbTypes";
import { get, set, del } from "idb-keyval";
import { useCallback } from "react";

type useIDBProps = {
  selectedNoteId: string | null;
  title: string;
  input: string;
};

export const useIDB = ({ selectedNoteId, title, input }: useIDBProps) => {
  const addToStore = useCallback(
    async (key: string, value: IDBObject) => {
      await set(key, value);
    },
    [title, input]
  );

  const getFromStore = useCallback(
    async (selectedNoteId: string): Promise<IDBObject | null> => {
      if (!selectedNoteId) return null;

      const idbObject = await get(selectedNoteId);

      return (
        idbObject || {
          editorTitle: "Untitled",
          editorContent: "",
        }
      );
    },
    [selectedNoteId]
  );
  const deleteFromStore = useCallback(
    async (selectedNoteId: string) => {
      if (!selectedNoteId) return;

      await del(selectedNoteId);
    },
    [selectedNoteId]
  );

  return { addToStore, getFromStore, deleteFromStore };
};
