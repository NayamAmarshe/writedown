import ChevronDoubleRight from "@/components/icons/ChevronDoubleRight";
import ChevronDoubleLeft from "@/components/icons/ChevronDoubleLeft";
import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { IFirebaseAuth } from "@/types/components/firebase-hooks";
import { notesConverter } from "@/utils/firestoreDataConverter";
import { collection, orderBy, query } from "firebase/firestore";
import IconButton from "@/components/ui/IconButton";
import useNotes from "@/components/hooks/useNotes";
import XCircle from "@/components/icons/XCircle";
import Skeleton from "react-loading-skeleton";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import React, { useMemo } from "react";
import { db } from "@/lib/firebase";
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

  const notes = useMemo(() => {
    return firestoreNotes;
  }, [firestoreNotes]);

  console.log("🚀 => file: index.tsx:34 => notes:", notes);

  const { createNote } = useNotes({ userId: user?.uid });

  const newPostClickHandler = () => {
    createNote();
  };

  return (
    <aside
      className={`fixed z-50 flex h-full max-h-full w-96 flex-col gap-5 rounded-xl bg-white p-4 transition-transform duration-300 ${
        showSidebar ? "translate-x-0" : "ml-50 -translate-x-full"
      }`}
    >
      <IconButton onClick={() => setShowSidebar(!showSidebar)}>
        <ChevronDoubleLeft
          className={`duration-400 h-5 w-5 transition-transform ${
            showSidebar ? "" : "rotate-180"
          }`}
        />
      </IconButton>

      {user ? (
        <h4 className="text-xl font-semibold text-slate-500">
          Hi there, <span className="text-slate-900">{user?.displayName}</span>
        </h4>
      ) : (
        <Skeleton className="h-6 w-2/3" />
      )}

      {notes ? (
        <Button onClick={newPostClickHandler}>Create New Post</Button>
      ) : (
        <Skeleton className="h-10 w-full" borderRadius={50} />
      )}

      {/* POSTS SECTION */}
      <div className="flex flex-col gap-3">
        {/* POSTS HEADING */}
        <h6 className="font-semibold">Posts</h6>
        {/* POSTS LIST */}
        <div className="flex flex-col gap-2">
          {notes ? (
            notes.map((note) => (
              <PostRow
                key={note.id}
                title={note.title}
                content={note.content}
                noteId={note.id}
              />
            ))
          ) : (
            <Skeleton className="mb-2 h-16 p-4" count={4} />
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
