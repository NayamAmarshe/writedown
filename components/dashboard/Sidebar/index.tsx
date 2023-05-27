import ChevronDoubleLeft from "@/components/icons/ChevronDoubleLeft";
import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { IFirebaseAuth } from "@/types/components/firebase-hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import PlusCircle from "@/components/icons/PlusCircle";
import IconButton from "@/components/ui/IconButton";
import useNotes from "@/components/hooks/useNotes";
import Popover from "@/components/ui/Popover";
import Skeleton from "react-loading-skeleton";
import Button from "@/components/ui/Button";
import { auth } from "@/pages/_app";
import { useSetAtom } from "jotai";
import PostRow from "./PostRow";
import Link from "next/link";
import React from "react";

interface SidebarProps {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({
  showSidebar,
  setShowSidebar,
}: SidebarProps & IFirebaseAuth) => {
  const [user] = useAuthState(auth);
  const { notes, createNote } = useNotes({ userId: user?.uid });
  const setSelectedNoteId = useSetAtom(selectedNoteIdAtom);

  const newPostClickHandler = async () => {
    const newId = await createNote();
    if (!newId) return;
    setSelectedNoteId(newId);
  };

  return (
    <aside
      className={`absolute top-0 left-0 right-0 bottom-0 z-50 flex h-full flex-col gap-y-5 bg-white p-2 shadow-2xl shadow-slate-400 transition-transform duration-300 md:right-auto md:top-auto md:bottom-auto md:left-auto md:m-4 md:h-[calc(96%)] md:w-96 md:rounded-xl md:p-5 ${
        showSidebar ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* MOBILE - SIDEBAR TOGGLE BUTTON */}
      <IconButton
        id="new"
        onClick={() => setShowSidebar(!showSidebar)}
        extraClasses="ml-auto md:hidden absolute right-3 z-10 !bg-slate-100"
      >
        <ChevronDoubleLeft
          className={`duration-400 h-4 w-4 transition-transform ${
            showSidebar ? "" : "rotate-180"
          }`}
        />
      </IconButton>

      {/* DESKTOP - SIDEBAR TOGGLE BUTTON */}
      <IconButton
        data-testid="sidebarToggle"
        onClick={() => setShowSidebar(!showSidebar)}
        extraClasses="absolute top-1/2 -right-5 z-10 hidden md:block"
      >
        <ChevronDoubleLeft
          className={`duration-400 h-5 w-5 translate-x-1 transition-transform ${
            showSidebar ? "" : "rotate-180"
          }`}
        />
      </IconButton>

      <div className="flex flex-row items-center gap-2">
        {/* USER  GREETING SECTION */}
        {user ? (
          <div className="relative min-w-fit">
            <Popover
              data-testid="logout"
              buttonStyle="outline-none"
              button={
                user && (
                  <img
                    src={
                      user.photoURL ||
                      `https://ui-avatars.com/api/?name=${user?.displayName}&rounded=true&format=svg&background=random`
                    }
                    alt="User Photo"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                )
              }
            >
              <Link
                href="/"
                className="rounded-xl bg-slate-100 p-4 text-left text-sm font-medium hover:bg-slate-300"
              >
                Home
              </Link>
              <button
                onClick={() => auth.signOut()}
                className="rounded-xl bg-slate-100 p-4 text-left text-sm font-medium hover:bg-slate-300"
              >
                Logout
              </button>
            </Popover>
          </div>
        ) : (
          <Skeleton className="h-10 w-10" circle={true} />
        )}

        {user ? (
          <h4 className="truncate text-xl font-semibold text-slate-500">
            Hi there,{" "}
            <span className="text-slate-900">{user?.displayName} </span>
          </h4>
        ) : (
          <Skeleton className="w-32" />
        )}
      </div>

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
          © {new Date().getFullYear()} <b>writedown</b>. All rights reserved.
          <span className="ml-2 animate-pulse rounded-full bg-violet-500 px-3 text-violet-100">
            BETA
          </span>
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
