import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { IFirebaseAuth } from "@/types/components/firebase-hooks";
import { IoMdAddCircle, IoMdRefreshCircle } from "react-icons/io";
import { FEATURE_FLAGS } from "@/constants/feature-flags";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useAuthState } from "react-firebase-hooks/auth";
import { selectedNoteType } from "@/stores/postDataAtom";
import UserMenu from "@/components/common/UserMenu";
import IconButton from "@/components/ui/IconButton";
import useNotes from "@/components/hooks/useNotes";
import { isSyncedAtom } from "@/stores/syncedAtom";
import React, { useEffect, useState } from "react";
import BetaBadge from "@/components/ui/BetaBadge";
import { BsChevronBarLeft } from "react-icons/bs";
import useUser from "@/components/hooks/useUser";
import Popover from "@/components/ui/Popover";
import Skeleton from "react-loading-skeleton";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { auth } from "@/lib/firebase";
import PostRow from "./PostRow";
import Link from "next/link";

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
  const [selectedNote, setSelectedNote] = useAtom(selectedNoteType);
  const setSelectedNoteId = useSetAtom(selectedNoteIdAtom);
  const selectedNoteId = useAtomValue(selectedNoteIdAtom);
  const synced = useAtomValue(isSyncedAtom);

  const { notes, createNote, refreshNotes } = useNotes({ userId: user?.uid });

  useEffect(() => {
    if (!selectedNoteId) return;
    router.push(`/dashboard/?post=${selectedNoteId}`, undefined, {
      shallow: true,
    });
  }, [selectedNoteId]);

  useEffect(() => {
    if (!router.query.post) return;
    setSelectedNoteId(router.query.post as string);
  }, [router.query.post]);

  useEffect(() => {
    refreshNotes();
  }, [synced, selectedNoteId]);

  const newPostClickHandler = async () => {
    setCreatePostLoading(true);
    const newId = await createNote();
    await refreshNotes();
    if (!newId) {
      toast.error("Failed to create new post");
      return;
    }
    setSelectedNoteId(newId);
    setCreatePostLoading(false);
    window.innerWidth <= 768 && setShowSidebar(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside
      className={`dark:slate-950 absolute bottom-0 left-0 right-0 top-0 z-50 flex h-full flex-col gap-y-5 bg-white p-2 shadow-2xl shadow-slate-400 transition-transform duration-300 dark:bg-slate-900 dark:text-slate-50 dark:shadow-slate-950 md:bottom-auto md:left-auto md:right-auto md:top-auto md:m-4 md:h-[calc(96%)] md:w-96 md:rounded-xl md:p-5 ${
        showSidebar ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* MOBILE - SIDEBAR TOGGLE BUTTON */}
      <IconButton
        id="new"
        onClick={() => setShowSidebar(!showSidebar)}
        extraClasses={`fixed z-10 ml-auto top-[10px] right-[15px] md:hidden dark:!bg-slate-800 !bg-slate-100`}
      >
        <BsChevronBarLeft
          className={`duration-400 h-4 w-4 text-black transition-transform dark:text-slate-100 ${
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
          className={`duration-400 h-5 w-5 translate-x-1 text-black transition-transform dark:text-slate-100 ${
            showSidebar ? "" : "rotate-180"
          }`}
        />
      </IconButton>

      {/* USER  GREETING SECTION */}
      <div className="relative min-w-fit">
        <UserMenu home logout themeOption showImageAsButton>
          <div className="flex flex-row items-center gap-2">
            {user ? (
              <img
                src={
                  user?.photoURL ||
                  `https://ui-avatars.com/api/?name=${user?.displayName}&rounded=true&format=svg&background=random`
                }
                alt="User Photo"
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <Skeleton className="h-10 w-10" circle={true} />
            )}
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
        </UserMenu>
      </div>

      {/* CREATE NEW POST BUTTON */}
      {notes ? (
        <Button
          data-testid="new-note"
          onClick={newPostClickHandler}
          disabled={createPostLoading}
          className="disabled:cursor-not-allowed"
        >
          <span className="flex items-center justify-center gap-1">
            {createPostLoading ? (
              <IoMdRefreshCircle className="h-5 w-5 animate-spin" />
            ) : (
              <IoMdAddCircle className="h-5 w-5" />
            )}
            Create New Post
          </span>
        </Button>
      ) : (
        <Skeleton className="h-9 w-full" borderRadius={50} />
      )}

      {/* POSTS SECTION */}
      {/* POSTS HEADING */}
      <h6 className="font-semibold">Posts</h6>
      <div className="scrollbar flex h-full flex-col  gap-3 overflow-y-auto">
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
                  isPublic={note.public}
                  noteId={note.id}
                  setShowSidebar={setShowSidebar}
                />
              </Link>
            ))
          ) : (
            <Skeleton className="mb-2 h-20 p-4" count={4} />
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center bg-gradient-to-t from-white pb-32 pt-32 dark:from-slate-900"></div>
        </div>
      </div>

      <div className="mt-auto">
        <p className="text-center text-xs text-slate-400">
          © {new Date().getFullYear()} <b>writedown</b>. All rights reserved.
          {FEATURE_FLAGS.beta && <BetaBadge pulse />}
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
