import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Note } from "@/types/utils/firebaseOperations";
import UserMenu from "@/components/common/UserMenu";
import HeadTags from "@/components/common/HeadTags";
import BetaBadge from "@/components/ui/BetaBadge";
import { doc, getDoc } from "firebase/firestore";
import Footer from "@/components/home/Footer";
import RemoveMarkdown from "remove-markdown";
import { GetServerSideProps } from "next";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import Head from "next/head";
import React from "react";

interface Props {
  note: Note;
  name: string;
  profilePicture: string;
}

export const PostPage = ({ note, name, profilePicture }: Props) => {
  return (
    <>
      <Head>
        <title>
          {note.title} by {name} - writedown
        </title>

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://writedown.app" />
        <meta
          name="twitter:title"
          content={`${note.title} by ${name} - writedown`}
          key="twitter-title"
        />
        <meta
          name="twitter:description"
          content={`Read this post by ${name} on writedown - a free markdown notes app that is simple and beautiful.`}
          key="twitter-description"
        />
        <meta
          name="twitter:image"
          content={`https://writedown.app/api/og?title=${note.title}&author=${name}&profilePicture=${profilePicture}&content=${note.content}`}
          key="twitter-image"
        />

        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`${note.title} by ${name} - writedown`}
          key="og-title"
        />
        <meta
          property="og:description"
          content={`Read this post by ${name} on writedown - a free markdown notes app that is simple and beautiful.`}
          key="og-description"
        />
        <meta property="og:site_name" content="writedown" />
        <meta property="og:url" content="https://writedown.app" />
        <meta
          property="og:image"
          content={`https://writedown.app/api/og?title=${
            note.title
          }&author=${encodeURI(
            name
          )}&profilePicture=${profilePicture}&content=${RemoveMarkdown(
            note.content
          )}`}
          key="og-image"
        />
      </Head>

      <HeadTags
        title={`${note.title} by ${name} - writedown`}
        description={`Read this post by ${name} on writedown - A simple and beautiful notes app with cloud sync, markdown and offline support. Write, share, inspire.`}
        ogImage={`https://writedown.app/api/og?title=${
          note.title
        }&author=${encodeURI(
          name
        )}&profilePicture=${profilePicture}&content=${RemoveMarkdown(
          note.content
        )}`}
        ogUrl={`https://writedown.app/${note.userId}/posts/${note.id}`}
      />

      <main className="max-w-screen relative flex min-h-screen flex-row bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50">
        {/* NAVBAR */}
        <nav className="fixed top-0 z-20 flex w-full flex-row items-center justify-between border-b border-gray-300 bg-transparent p-4 backdrop-blur dark:border-gray-700">
          {/* LOGO */}
          <h4 className="flex items-center text-2xl font-semibold">
            writedown <BetaBadge />
          </h4>
          {/* USER MENU */}
          <div className="flex flex-row items-center gap-4">
            <UserMenu displayName={name} photoURL={profilePicture} reverse />
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
              <h1 className="text-center text-5xl font-bold leading-tight">
                {note.title}
              </h1>
              <p className="text-xl dark:text-slate-200">
                <span className="font-light">By</span>{" "}
                <span className="font-medium">{name}</span>
              </p>
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
