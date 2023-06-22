import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Note } from "@/types/utils/firebaseOperations";
import UserMenu from "@/components/common/UserMenu";
import BetaBadge from "@/components/ui/BetaBadge";
import { doc, getDoc } from "firebase/firestore";
import Footer from "@/components/home/Footer";
import { GetServerSideProps } from "next";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import React from "react";

interface Props {
  note: Note;
  name: string;
  profilePicture: string;
}

export const PostPage = ({ note, name, profilePicture }: Props) => {
  return (
    <>
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
            <div className="flex flex-col items-center justify-center gap-4">
              <img src={profilePicture} alt="" className="w-24 rounded-full" />
              <h1 className="text-5xl font-bold">{note.title}</h1>
              <p className="text-xl dark:text-slate-200">
                <span className="font-light">By</span>{" "}
                <span className="font-medium">{name}</span>
              </p>
            </div>

            <div className="mb-40 flex items-center justify-center">
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

  // // Get public notes document
  // const publicNotesDoc = doc(db, "public_notes", postId as string);
  // const publicNotesSnapshot = await getDoc(publicNotesDoc);
  // const publicNotes = publicNotesSnapshot.data();
  // if (!publicNotes) {
  //   return {
  //     notFound: true,
  //   };
  // }
  // Get user notes document

  let user: User;
  let note: Note;

  try {
    const userDoc = doc(db, "users", username as string);
    const userSnapshot = await getDoc(userDoc);
    user = userSnapshot.data() as User;
  } catch (error) {
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
