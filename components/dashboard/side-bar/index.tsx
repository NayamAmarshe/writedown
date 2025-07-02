import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAtom, useAtomValue } from "jotai";
import { IoMdAddCircle, IoMdRefreshCircle } from "react-icons/io";
import { BsChevronBarLeft } from "react-icons/bs";
import { IFirebaseAuth } from "@/types/components/firebase-hooks";
import { FEATURE_FLAGS } from "@/constants/feature-flags";
import { selectedNoteAtom } from "@/lib/atoms/post-data-atom";
import UserMenu from "@/components/common/user-menu";
import useNotes from "@/components/hooks/useNotes";
import { isSyncedAtom } from "@/lib/atoms/sync-atom";
import BetaBadge from "@/components/ui/BetaBadge";
import useUser from "@/components/hooks/useUser";
import PostRow from "./post-row";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import CollapseSidebarButton from "./collapse-sidebar-button";

interface SidebarProps {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({
  showSidebar,
  setShowSidebar,
}: SidebarProps & IFirebaseAuth) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const post = searchParams.get("post");

  const { user, publicUserDetails } = useUser();
  const [mounted, setMounted] = useState(false);
  const [createPostLoading, setCreatePostLoading] = useState(false);
  const [isFadeVisible, setIsFadeVisible] = useState({
    top: false,
    bottom: false,
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [selectedNote, setSelectedNote] = useAtom(selectedNoteAtom);

  const synced = useAtomValue(isSyncedAtom);

  const { notes, createNote, refreshNotes } = useNotes({ userId: user?.uid });

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isScrolledToBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
    setIsFadeVisible({
      top: scrollTop > 10,
      bottom: !isScrolledToBottom && scrollHeight > clientHeight,
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Check initial state
    handleScroll();

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [notes]);

  useEffect(() => {
    if (!selectedNote.id) return;
    router.push(`/dashboard/?post=${selectedNote.id}`, {
      scroll: false,
    });
  }, [selectedNote.id]);

  useEffect(() => {
    if (!post) return;
    setSelectedNote((prev) => ({ ...prev, id: post as string }));
  }, [post]);

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
      className={`z-40 absolute max-w-screen flex h-full flex-col gap-y-5 bg-white p-2 shadow-2xl shadow-slate-400 transition-transform duration-300 sm:top-auto sm:right-auto sm:bottom-auto sm:left-auto sm:m-4 sm:h-[calc(96%)] sm:w-96 sm:rounded-xl sm:p-5 dark:bg-slate-900 dark:text-slate-50 dark:shadow-slate-950 ${
        showSidebar ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <CollapseSidebarButton />

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
      <div className="relative flex flex-1 flex-col min-h-0">
        <div
          ref={scrollContainerRef}
          className="scrollbar flex flex-1 flex-col gap-3 overflow-y-auto z-10"
        >
          {isFadeVisible.top && (
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-white to-transparent dark:from-slate-900 z-20"></div>
          )}

          {/* POSTS LIST */}
          <div className="flex flex-col gap-2 p-1">
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
          </div>
        </div>

        {/** BOTTOM FADE EFFECT - Only show when not scrolled to bottom */}
        {isFadeVisible.bottom && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-white to-transparent dark:from-slate-900 z-20"></div>
        )}
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
