import { formatTimeStamp } from "@/components/dashboard/TextArea/PostButtons";
import { NoteDocument, UserDocument } from "@/types/utils/firebaseOperations";
import Markdown from "react-markdown";
import UserMenu from "@/components/common/UserMenu";
import HeadTags from "@/components/common/HeadTags";
import useUser from "@/components/hooks/useUser";
import { doc, getDoc } from "firebase/firestore";
import Footer from "@/components/home/Footer";
import { RiMenu5Fill } from "react-icons/ri";
import Button from "@/components/ui/Button";
import { GetServerSideProps } from "next";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "@/components/ui/Loading";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";

interface Props {}

export const PostPage = ({}: Props) => {
  const router = useRouter();

  const [note, setNote] = useState<NoteDocument | null>(null);
  const [name, setName] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { username, postId } = router.query;

  const fetchData = async () => {
    let user: UserDocument | null = null;
    let note: NoteDocument | null = null;

    try {
      const usernameDoc = doc(db, "usernames", username as string);
      const usernameSnapshot = await getDoc(usernameDoc);
      const usernameData = usernameSnapshot.data();
      if (usernameData) {
        const userDoc = doc(db, "users", usernameData.uid as string);
        const userSnapshot = await getDoc(userDoc);
        user = userSnapshot.data() as UserDocument;
      } else {
        const uid = username as string;
        const userDoc = doc(db, "users", uid);
        const userSnapshot = await getDoc(userDoc);
        user = userSnapshot.data() as UserDocument;
      }
    } catch (error) {
      toast.error("User not found");
      setLoading(false);
      return;
    }

    if (!user) return;

    try {
      const noteDoc = doc(db, "users", user.uid, "notes", postId as string);
      const noteSnapshot = await getDoc(noteDoc);
      note = noteSnapshot.data() as NoteDocument;
    } catch (error) {
      toast.error("User not found");
      setLoading(false);
      return;
    }

    if (!note || !user) {
      toast.error("Post not found");
      setLoading(false);
      return;
    }

    if (note && !note.public) {
      toast.error("Post not found");
      setLoading(false);
      return;
    }

    setNote(note);
    setName(user.displayName);
    setProfilePicture(user.photoURL);
    setLoading(false);
  };

  useEffect(() => {
    if (username && postId) {
      fetchData();
    }
  }, [username, postId]);

  const { user } = useUser();

  if (loading) return <Loading />;

  return (
    <>
      <HeadTags
        title={`${note?.title} by ${name} - writedown`}
        description={`Read this post by ${name} on writedown - A simple and beautiful notes app with cloud sync, markdown and offline support. Write, share, inspire.`}
        ogImage={`https://dynamic-og-image-generator.vercel.app/api/generate?title=${note?.title}&author=${name}&avatar=${profilePicture}&websiteUrl=https://writedown.app&theme=nightOwl`}
        // ogImage={`https://writedown.app/api/og?title=${
        //   note.title
        // }&content=${RemoveMarkdown(
        //   note.content.slice(0, 200)
        // )}&author=${name}&profilePicture=${profilePicture}`}
        ogUrl={`https://writedown.app/${note?.userId}/posts/${note?.id}`}
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
                  alt="an image"
                  src={profilePicture}
                  alt="User Profile Picture"
                  className="w-24 rounded-full"
                />
                <h1 className="max-w-4xl text-center text-5xl font-bold leading-tight">
                  {note?.title}
                </h1>
                <p className="text-xl dark:text-slate-200">
                  <span className="font-light">By</span>
                  <span className="font-medium">{name}</span>
                </p>
                <p className="text-sm dark:text-slate-400">
                  Published {formatTimeStamp(note?.publishedAt)}
                </p>

                {user?.uid === note?.userId && (
                  <Link href={`/dashboard?post=${note?.id}`}>
                    <Button variant="slate" size="sm">
                      Edit Post
                    </Button>
                  </Link>
                )}
              </div>

              <div className="mb-40 flex items-center justify-center px-4">
                <Markdown className="prose dark:prose-invert">
                  {note?.content}
                </Markdown>
              </div>
            </div>
          </div>

          <Footer className="absolute bottom-0 w-full" />
        </main>
      )}
    </>
  );
};

export default PostPage;
