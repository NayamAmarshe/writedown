import ChevronDoubleRight from "@/components/icons/ChevronDoubleRight";
import ChevronDoubleLeft from "@/components/icons/ChevronDoubleLeft";
import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { IFirebaseAuth } from "@/types/components/firebase-hooks";
import { inputAtom, titleAtom } from "@/stores/editTextAreaAtom";
import { notesConverter } from "@/utils/firestoreDataConverter";
import { collection, orderBy, query } from "firebase/firestore";
import PlusCircle from "@/components/icons/PlusCircle";
import IconButton from "@/components/ui/IconButton";
import useNotes from "@/components/hooks/useNotes";
import React, { useEffect, useMemo } from "react";
import XCircle from "@/components/icons/XCircle";
import { isSyncedAtom } from "@/stores/isSynced";
import Skeleton from "react-loading-skeleton";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import toast from "react-hot-toast";
import { db } from "@/lib/firebase";
import { auth } from "@/pages/_app";
import PostRow from "./PostRow";
import { useAtom } from "jotai";

interface SidebarProps {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({
  user,
  showSidebar,
  setShowSidebar,
}: SidebarProps & IFirebaseAuth) => {
  const [firestoreNotes] = useCollectionData(
    user &&
      query(
        collection(db, "users", user.uid, "notes"),
        orderBy("createdAt", "desc")
      ).withConverter(notesConverter),
    {
      snapshotListenOptions: {
        includeMetadataChanges: true,
      },
    }
  );

  const [selectedNoteId, setSelectedNoteId] = useAtom(selectedNoteIdAtom);
  const [isSynced, setIsSynced] = useAtom(isSyncedAtom);
  const [title, setTitle] = useAtom(titleAtom);
  const [input, setInput] = useAtom(inputAtom);

  const notes = useMemo(() => {
    return firestoreNotes;
  }, [firestoreNotes]);

  console.log("🚀 => file: index.tsx:34 => notes:", notes);

  const { createNote, updateNote } = useNotes({ userId: user?.uid });

  const newPostClickHandler = async () => {
    const newId = await createNote();
    console.log("🚀 => file: index.tsx:60 => newId:", newId);

    if (!newId) return;

    setSelectedNoteId(newId);
  };

  return (
    <aside
      className={`absolute z-50 flex h-[calc(96%)] w-96 flex-col space-y-5 rounded-xl bg-white p-4 transition-transform duration-300 ${
        showSidebar ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* SIDEBAR TOGGLE BUTTON */}
      <IconButton onClick={() => setShowSidebar(!showSidebar)}>
        <ChevronDoubleLeft
          className={`duration-400 h-5 w-5 transition-transform ${
            showSidebar ? "" : "rotate-180"
          }`}
        />
      </IconButton>

      {/* USER  GREETING SECTION */}
      {user ? (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              auth.signOut();
            }}
          >
            <img
              src={
                user.photoURL ||
                `https://ui-avatars.com/api/?name=${user?.displayName}&rounded=true&format=svg&background=random`
              }
              alt="User Photo"
              className="h-8 w-8 rounded-full object-cover"
            />
          </button>
          <h4 className="flex items-center gap-1 text-xl font-semibold text-slate-500">
            Hi there,{" "}
            <span className="text-slate-900">{user?.displayName}</span>
          </h4>
        </div>
      ) : (
        <Skeleton className="h-6 w-2/3" />
      )}

      {/* CREATE NEW POST BUTTON */}
      {notes ? (
        <Button onLoad={newPostClickHandler} onClick={newPostClickHandler}>
          <span className="flex items-center justify-center gap-1">
            <PlusCircle className="h-5 w-5" />
            Create New Post
          </span>
        </Button>
      ) : (
        <Skeleton className="h-9 w-full" borderRadius={50} />
      )}

      {/* POSTS SECTION */}
      <div className="flex flex-col gap-3">
        {/* POSTS HEADING */}
        <h6 className="font-semibold">Posts</h6>
        {/* POSTS LIST */}
        <div className="flex flex-col gap-2 p-1">
          {notes ? (
            notes.map((note) => (
              <PostRow
                key={note.id}
                userId={user?.uid}
                title={note.title}
                content={note.content}
                noteId={note.id}
              />
            ))
          ) : (
            <Skeleton className="mb-2 h-20 p-4" count={4} />
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
