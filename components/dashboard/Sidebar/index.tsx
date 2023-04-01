import ChevronDoubleRight from "@/components/icons/ChevronDoubleRight";
import ChevronDoubleLeft from "@/components/icons/ChevronDoubleLeft";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { IFirebaseAuth } from "@/types/components/firebase-hooks";
import { notesConverter } from "@/utils/firestoreDataConverter";
import { collection, orderBy, query } from "firebase/firestore";
import XCircle from "@/components/icons/XCircle";
import Skeleton from "react-loading-skeleton";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { db } from "@/lib/firebase";
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

  const newPostClickHandler = () => {
    console.log("new post");
  };

  return (
    <aside
      className={`relative flex h-full max-h-full w-96 flex-col gap-5 rounded-xl bg-white p-4 transition-transform duration-300 ${
        showSidebar ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="absolute top-1/2 -right-5 z-10 rounded-full bg-white p-3 shadow-lg shadow-slate-400/40"
      >
        <ChevronDoubleLeft
          className={`h-5 w-5 transition-transform duration-300 ${
            showSidebar ? "" : "rotate-180"
          }`}
        />
      </button>

      {user ? (
        <h4 className="text-xl font-semibold text-slate-500">
          Hi there, <span className="text-slate-900">{user?.displayName}</span>
        </h4>
      ) : (
        <Skeleton className="h-6 w-2/3" />
      )}

      <Button onClick={newPostClickHandler}>Create New Post</Button>

      <div className="flex flex-col gap-3">
        <h6 className="font-semibold">Posts</h6>
        <div className="flex flex-col gap-2">
          {/* {notes?.map((note) => (
              <div key={note.id}>{note.title}</div>
            ))} */}
          <div className="flex flex-col gap-2 rounded-xl bg-slate-50 p-4">
            <h6 className="font-medium">My first post 🚀</h6>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-slate-600">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor,
                possimus...
              </p>
              <div className="flex flex-row flex-wrap gap-1">
                <Badge color="yellow">UI</Badge>
                <Badge color="green">Development</Badge>
                <Badge color="red">UX</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border-2 border-slate-300 bg-slate-200 p-4">
            <h6 className="font-medium">My first post 🚀</h6>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-slate-600">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor,
                possimus...
              </p>
              <div className="flex flex-row flex-wrap gap-1">
                <Badge color="yellow">UI</Badge>
                <Badge color="green">Development</Badge>
                <Badge color="red">UX</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-xl bg-slate-50 p-4">
            <h6 className="font-medium">My first post 🚀</h6>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-slate-600">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor,
                possimus...
              </p>
              <div className="flex flex-row flex-wrap gap-1">
                <Badge color="yellow">UI</Badge>
                <Badge color="green">Development</Badge>
                <Badge color="red">UX</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-xl bg-slate-50 p-4">
            <h6 className="font-medium">My first post 🚀</h6>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-slate-600">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor,
                possimus...
              </p>
              <div className="flex flex-row flex-wrap gap-1">
                <Badge color="yellow">UI</Badge>
                <Badge color="green">Development</Badge>
                <Badge color="red">UX</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
