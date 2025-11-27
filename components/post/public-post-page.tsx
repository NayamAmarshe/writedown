"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { toast } from "sonner";

import { formatTimeStamp } from "@/components/dashboard/text-area/post-buttons";
import HeadTags from "@/components/common/head-tags";
import Footer from "@/components/home/footer-component";
import Navbar from "@/components/nav-bar";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import useUser from "@/components/hooks/use-user";
import { db } from "@/lib/firebase";
import { notesConverter } from "@/lib/firestoreDataConverter";
import type { NoteDocument, UsernameDocument } from "@/lib/types/db";

type PublicProfile = UsernameDocument & { username: string };

const mapProfile = (
  username: string,
  data: UsernameDocument | undefined
): PublicProfile | null => {
  if (!data) return null;
  return {
    username,
    ...data,
  };
};

const getProfileByUsername = async (
  username: string
): Promise<PublicProfile | null> => {
  const usernameRef = doc(db, "usernames", username);
  const snapshot = await getDoc(usernameRef);
  if (!snapshot.exists()) return null;
  return mapProfile(snapshot.id, snapshot.data() as UsernameDocument);
};

const getProfileByUid = async (uid: string): Promise<PublicProfile | null> => {
  const profilesQuery = query(
    collection(db, "usernames"),
    where("uid", "==", uid),
    limit(1)
  );
  const snapshot = await getDocs(profilesQuery);
  if (snapshot.empty) return null;
  const docSnapshot = snapshot.docs[0];
  return mapProfile(docSnapshot.id, docSnapshot.data() as UsernameDocument);
};

const buildAvatarFallback = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&rounded=true&background=random`;

const PublicPostPage = () => {
  const params = useParams<Record<string, string>>();
  const usernameParam = params?.username;
  const slugParam = params?.postId ?? params?.slug;

  const [note, setNote] = useState<NoteDocument | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [shareHandle, setShareHandle] = useState<string>("");

  useEffect(() => {
    if (!slugParam) return;

    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setNote(null);

      try {
        let publicProfile: PublicProfile | null = null;
        let resolvedUid: string | null = null;

        if (usernameParam) {
          publicProfile = await getProfileByUsername(usernameParam);
          resolvedUid = publicProfile?.uid ?? null;

          if (!publicProfile) {
            const fallbackProfile = await getProfileByUid(usernameParam);
            if (fallbackProfile) {
              publicProfile = fallbackProfile;
              resolvedUid = fallbackProfile.uid;
            }
          }
        }

        if (!resolvedUid && usernameParam) {
          resolvedUid = usernameParam;
        }

        if (!resolvedUid) {
          toast.error("User not found");
          return;
        }

        const noteRef = doc(
          db,
          "users",
          resolvedUid,
          "notes",
          slugParam
        ).withConverter(notesConverter);
        const noteSnapshot = await getDoc(noteRef);
        const fetchedNote = noteSnapshot.data();

        if (!fetchedNote || !fetchedNote.isPublic) {
          toast.error("Post not found");
          return;
        }

        if (cancelled) return;

        const fallbackName = publicProfile?.displayName ?? "Anonymous";
        const fallbackPhoto =
          publicProfile?.photoURL || buildAvatarFallback(fallbackName);

        setNote(fetchedNote);
        setDisplayName(fallbackName);
        setProfilePicture(fallbackPhoto);
        setShareHandle(publicProfile?.username ?? usernameParam ?? "");
      } catch (_error) {
        if (!cancelled) {
          toast.error("Post not found");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [usernameParam, slugParam]);

  const { user } = useUser();

  if (loading) return <Loading />;

  return (
    <>
      <HeadTags
        title={`${note?.title ?? "Post"} by ${displayName} - writedown`}
        description={`Read this post by ${displayName} on writedown - A simple and beautiful notes app with cloud sync, markdown and offline support. Write, share, inspire.`}
        ogImage={`https://dynamic-og-image-generator.vercel.app/api/generate?title=${note?.title}&author=${displayName}&avatar=${profilePicture}&websiteUrl=https://writedown.app&theme=nightOwl`}
        ogUrl={
          note
            ? `https://writedown.app/post/${shareHandle || note.userId}/${note.id}`
            : "https://writedown.app"
        }
      />

      <Navbar />

      {!note && (
        <main className="max-w-screen relative flex min-h-screen flex-row items-center justify-center bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50">
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <h1 className="text-2xl font-medium">
              Oops, couldn&apos;t find that post!
            </h1>
            <p className="max-w-96 text-center text-slate-500 dark:text-slate-400">
              The post you are looking for might have been removed or the link
              is broken.
            </p>
          </div>
        </main>
      )}

      {note && (
        <main className="max-w-screen relative flex min-h-screen flex-row bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50">
          <div className="flex h-full w-full flex-col items-center justify-center">
            <div className="mt-52 flex flex-col items-center justify-center gap-20">
              <div className="flex flex-col items-center justify-center gap-4 px-2">
                <img
                  src={profilePicture}
                  alt="User Profile Picture"
                  className="w-24 rounded-full"
                />
                <h1 className="max-w-4xl text-center text-5xl font-bold leading-tight">
                  {note.title}
                </h1>
                <p className="text-xl dark:text-slate-200">
                  <span className="font-light">By</span>{" "}
                  <span className="font-medium">{displayName}</span>
                </p>
                <p className="text-sm dark:text-slate-400">
                  Published {formatTimeStamp(note.publishedAt)}
                </p>

                {user?.uid === note.userId && (
                  <Link href={`/dashboard?post=${note.id}`}>
                    <Button variant="outline" size="sm">
                      Edit Post
                    </Button>
                  </Link>
                )}
              </div>

              <div className="mb-40 flex items-center justify-center px-4">
                <Markdown remarkPlugins={[remarkGfm]}>{note.content}</Markdown>
              </div>
            </div>
          </div>

          <Footer className="absolute bottom-0 w-full" />
        </main>
      )}
    </>
  );
};

export default PublicPostPage;
