import ChevronDoubleLeft from "@/components/icons/ChevronDoubleLeft";
import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { IFirebaseAuth } from "@/types/components/firebase-hooks";
import { notesConverter } from "@/utils/firestoreDataConverter";
import { collection, orderBy, query } from "firebase/firestore";
import PlusCircle from "@/components/icons/PlusCircle";
import IconButton from "@/components/ui/IconButton";
import useNotes from "@/components/hooks/useNotes";
import Skeleton from "react-loading-skeleton";
import Button from "@/components/ui/Button";
import React, { useMemo } from "react";
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
        orderBy("updatedAt", "desc")
      ).withConverter(notesConverter),
    {
      snapshotListenOptions: {
        includeMetadataChanges: true,
      },
    }
  );

  const [selectedNoteId, setSelectedNoteId] = useAtom(selectedNoteIdAtom);

  const notes = useMemo(() => {
    return firestoreNotes;
  }, [firestoreNotes]);

  const { createNote } = useNotes({ userId: user?.uid });

  const newPostClickHandler = async () => {
    const newId = await createNote();

    if (!newId) return;

    setSelectedNoteId(newId);
  };

  return (
    <aside
      className={`absolute top-0 left-0 right-0 bottom-0 z-50 flex h-full flex-col space-y-5 bg-white p-2 shadow-2xl shadow-slate-400 transition-transform duration-300 md:right-auto md:top-auto md:bottom-auto md:left-auto md:m-4 md:h-[calc(96%)] md:w-96 md:rounded-xl md:p-5 ${
        showSidebar ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <IconButton
        onClick={() => setShowSidebar(!showSidebar)}
        extraClasses="ml-auto md:hidden"
      >
        <ChevronDoubleLeft
          className={`duration-400 h-5 w-5 transition-transform ${
            showSidebar ? "" : "rotate-180"
          }`}
        />
      </IconButton>

      {/* SIDEBAR TOGGLE BUTTON */}
      <IconButton
        data-testid="sidebarToggle"
        onClick={() => setShowSidebar(!showSidebar)}
        extraClasses="absolute top-1/2 -right-5 z-10 hidden md:block"
      >
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
            data-testid="logout"
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
        <Button
          data-testid="new-note"
          onLoad={newPostClickHandler}
          onClick={newPostClickHandler}
        >
          <span className="flex items-center justify-center gap-1">
            <PlusCircle className="h-5 w-5" />
            Create New Post
          </span>
        </Button>
      ) : (
        <Skeleton className="h-9 w-full" borderRadius={50} />
      )}

      {/* POSTS SECTION */}
      <div className="flex h-full flex-col gap-3 overflow-y-auto">
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

      <div className="mt-auto">
        <p className="text-center text-xs text-slate-400">
          Copyright © {new Date().getFullYear()}{" "}
          <span className="font-bold">WriteDown</span>
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
