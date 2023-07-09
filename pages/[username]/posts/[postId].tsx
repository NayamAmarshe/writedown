import { formatTimeStamp } from "@/components/dashboard/TextArea/PostButtons";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useAuthState } from "react-firebase-hooks/auth";
import { Note } from "@/types/utils/firebaseOperations";
import UserMenu from "@/components/common/UserMenu";
import HeadTags from "@/components/common/HeadTags";
import BetaBadge from "@/components/ui/BetaBadge";
import { doc, getDoc } from "firebase/firestore";
import Footer from "@/components/home/Footer";
import RemoveMarkdown from "remove-markdown";
import { RiMenu5Fill } from "react-icons/ri";
import Button from "@/components/ui/Button";
import { GetServerSideProps } from "next";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { auth } from "@/pages/_app";
import Head from "next/head";
import Link from "next/link";
import React from "react";

interface Props {
  note: Note;
  name: string;
  profilePicture: string;
}

export const PostPage = ({ note, name, profilePicture }: Props) => {
  const [user] = useAuthState(auth);

  return (
    <>
      <HeadTags
        title={`${note.title} by ${name} - writedown`}
        description={`Read this post by ${name} on writedown - A simple and beautiful notes app with cloud sync, markdown and offline support. Write, share, inspire.`}
        ogImage={`https://dynamic-og-image-generator.vercel.app//api/generate?title=${note.title}&author=${name}&avatar=${profilePicture}&websiteUrl=https://writedown.app&theme=Night Owl`}
        // ogImage={`https://writedown.app/api/og?title=${
        //   note.title
        // }&content=${RemoveMarkdown(
        //   note.content.slice(0, 200)
        // )}&author=${name}&profilePicture=${profilePicture}`}
        ogUrl={`https://writedown.app/${note.userId}/posts/${note.id}`}
      />

      <main className="max-w-screen relative flex min-h-screen flex-row bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50">
        {/* NAVBAR */}
        <nav className="fixed top-0 z-20 flex w-full flex-row items-center justify-between border-b border-gray-300 bg-transparent p-4 backdrop-blur dark:border-gray-700">
          {/* LOGO */}
          <Link href="/">
            <h4 className="flex items-center text-2xl font-semibold">
              writedown
            </h4>
          </Link>
          {/* USER MENU */}
          <div className="flex flex-row items-center gap-4">
            <UserMenu dashboard home logout themeOption reverse>
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
                <RiMenu5Fill className="h-7 w-7" />
              )}
            </UserMenu>
          </div>
        </nav>

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
                <span className="font-medium">{name}</span>
              </p>
              <p className="text-sm dark:text-slate-400">
                Published {formatTimeStamp(note.publishedAt)}
              </p>

              {user?.uid === note.userId && (
                <Link href={`/dashboard?post=${note.id}`}>
                  <Button variant="slate" size="sm">
                    Edit Post
                  </Button>
                </Link>
              )}
            </div>

            <div className="mb-40 flex items-center justify-center px-4">
              <ReactMarkdown className="prose dark:prose-invert">
                {note.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        <Footer className="absolute bottom-0 w-full" />
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { postId, username } = context.query;

  let user: User;
  let note: Note;

  try {
    const userDoc = doc(db, "users", username as string);
    const userSnapshot = await getDoc(userDoc);
    user = userSnapshot.data() as User;
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }

  try {
    const noteDoc = doc(
      db,
      "users",
      username as string,
      "notes",
      postId as string
    );
    const noteSnapshot = await getDoc(noteDoc);
    note = noteSnapshot.data() as Note;
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }

  if (!note || !user) {
    return {
      notFound: true,
    };
  }

  if (note && !note.public) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      note,
      name: user.displayName,
      profilePicture: user.photoURL,
    },
  };
};

export default PostPage;
