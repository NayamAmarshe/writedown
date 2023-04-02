import ChevronDoubleRight from "@/components/icons/ChevronDoubleRight";
import ChevronDoubleLeft from "@/components/icons/ChevronDoubleLeft";
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
import { db } from "@/lib/firebase";
import PostRow from "./PostRow";
import React from "react";

interface SidebarProps {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({
  user,
  showSidebar,
  setShowSidebar,
}: SidebarProps & IFirebaseAuth) => {
  const [notes] = useCollectionData(
    user &&
      query(
        collection(db, "notes"),
        orderBy("createdAt", "desc")
      ).withConverter(notesConverter)
  );

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

      <Button onClick={newPostClickHandler}>Create New Post</Button>

      {/* POSTS SECTION */}
      <div className="flex flex-col gap-3">
        {/* POSTS HEADING */}
        <h6 className="font-semibold">Posts</h6>
        {/* POSTS LIST */}
        <div className="flex flex-col gap-2">
          {/* {notes?.map((note) => (
              <div key={note.id}>{note.title}</div>
            ))} */}
          <PostRow />
          <PostRow />
          <PostRow />
          <PostRow />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
