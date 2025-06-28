import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAtom, useAtomValue } from "jotai";
import { IoMdAddCircle, IoMdRefreshCircle } from "react-icons/io";
import { BsChevronBarLeft } from "react-icons/bs";
import { IFirebaseAuth } from "@/types/components/firebase-hooks";
import { FEATURE_FLAGS } from "@/constants/feature-flags";
import { selectedNoteAtom } from "@/stores/postDataAtom";
import UserMenu from "@/components/common/user-menu";
import IconButton from "@/components/ui/IconButton";
import useNotes from "@/components/hooks/useNotes";
import { isSyncedAtom } from "@/stores/syncedAtom";
import BetaBadge from "@/components/ui/BetaBadge";
import useUser from "@/components/hooks/useUser";
import PostRow from "./PostRow";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({
  showSidebar,
  setShowSidebar,
}: SidebarProps & IFirebaseAuth) => {
  const router = useRouter();
  const { user, publicUserDetails } = useUser();
  const [mounted, setMounted] = useState(false);
  const [createPostLoading, setCreatePostLoading] = useState(false);

  const [selectedNote, setSelectedNote] = useAtom(selectedNoteAtom);

  const synced = useAtomValue(isSyncedAtom);

  const { notes, createNote, refreshNotes } = useNotes({ userId: user?.uid });

  useEffect(() => {
    if (!selectedNote.id) return;
    router.push(`/dashboard/?post=${selectedNote.id}`, undefined, {
      shallow: true,
    });
  }, [selectedNote.id]);

  useEffect(() => {
    if (!router.query.post) return;
    setSelectedNote((prev) => ({ ...prev, id: router.query.post as string }));
  }, [router.query.post]);

  useEffect(() => {
    refreshNotes();
  }, [synced, selectedNote.id]);

  const newPostClickHandler = async () => {
    setCreatePostLoading(true);
    const newId = await createNote();
    await refreshNotes();
    if (!newId) {
      toast.error("Failed to create new post");
      return;
    }
    setSelectedNote((prev) => ({ ...prev, id: newId }));
    setCreatePostLoading(false);
    window.innerWidth <= 768 && setShowSidebar(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`z-40 flex h-full flex-col gap-y-5 bg-white p-2 shadow-2xl shadow-slate-400 transition-transform duration-300 md:top-auto md:right-auto md:bottom-auto md:left-auto md:m-4 md:h-[calc(96%)] md:w-96 md:rounded-xl md:p-5 dark:bg-slate-900 dark:text-slate-50 dark:shadow-slate-950 ${
        showSidebar ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* MOBILE - SIDEBAR TOGGLE BUTTON */}
      <IconButton
        id="new"
        onClick={() => setShowSidebar(!showSidebar)}
        extraClasses={`fixed z-50 ml-auto top-[10px] right-[15px] md:hidden dark:bg-slate-800! bg-slate-100!`}
      >
        <BsChevronBarLeft
          className={`h-4 w-4 text-black transition-transform duration-400 dark:text-slate-100 ${
            showSidebar ? "rotate-0" : "rotate-180"
          }`}
        />
      </IconButton>

      {/* DESKTOP - SIDEBAR TOGGLE BUTTON */}
      <IconButton
        data-testid="sidebarToggle"
        onClick={() => setShowSidebar(!showSidebar)}
        extraClasses="absolute top-1/2 -right-5 z-10 hidden md:block"
      >
        <BsChevronBarLeft
          className={`h-5 w-5 translate-x-1 text-black transition-transform duration-400 dark:text-slate-100 ${
            showSidebar ? "" : "rotate-180"
          }`}
        />
      </IconButton>

      {/* USER GREETING SECTION */}
      <div className="relative min-w-fit flex items-center gap-2">
        <UserMenu
          home
          logout
          themeOption
          showImageAsButton
          avatarSrc={
            user?.photoURL ||
            `https://ui-avatars.com/api/?name=${user?.displayName}&rounded=true&format=svg&background=random`
          }
          avatarAlt="User Photo"
          avatarFallback={user?.displayName?.charAt(0) || "U"}
        />
        {user ? (
          <h4 className="truncate text-xl font-semibold text-slate-500 dark:text-slate-300">
            Hi there,{" "}
            <span className="text-slate-900 dark:text-slate-100">
              {user?.displayName}{" "}
            </span>
          </h4>
        ) : (
          <Skeleton className="w-32" />
        )}
      </div>

      {/* CREATE NEW POST BUTTON */}
      {notes ? (
        <Button
          data-testid="new-note"
          onClick={newPostClickHandler}
          disabled={createPostLoading}
          className="disabled:cursor-not-allowed"
          variant="outline"
          size="lg"
        >
          <span className="flex items-center justify-center gap-1">
            {createPostLoading ? (
              <IoMdRefreshCircle className="size-5 animate-spin" />
            ) : (
              <IoMdAddCircle className="size-5" />
            )}
            Create New Post
          </span>
        </Button>
      ) : (
        <Skeleton className="h-9 w-full" />
      )}

      {/* POSTS SECTION */}
      {/* POSTS HEADING */}
      <h6 className="font-semibold">Posts</h6>
      <div className="scrollbar flex h-full flex-col gap-3 overflow-y-auto">
        {/* POSTS LIST */}
        <div className="mb-64 flex flex-col gap-2 p-1">
          {notes ? (
            notes.map((note) => (
              <Link
                href={`/dashboard/?post=${note.slug}`}
                key={note.id}
                as={
                  note.public
                    ? `/${publicUserDetails?.username}/posts/${note.slug}`
                    : `/dashboard/?post=${note.slug}`
                }
              >
                <PostRow
                  userId={user?.uid}
                  title={note.title}
                  content={note.content}
                  noteId={note.id}
                  isPublic={
                    note.id === selectedNote.id
                      ? selectedNote.isPublic
                      : note.public
                  }
                  setShowSidebar={setShowSidebar}
                />
              </Link>
            ))
          ) : (
            <Skeleton className="mb-2 h-20 p-4" />
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center bg-linear-to-t from-white pt-32 pb-32 dark:from-slate-900"></div>
        </div>
      </div>

      <div className="mt-auto">
        <p className="text-center text-xs text-slate-400">
          © {new Date().getFullYear()} <b>writedown</b>. All rights reserved.
          {FEATURE_FLAGS.beta && <BetaBadge pulse />}
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
