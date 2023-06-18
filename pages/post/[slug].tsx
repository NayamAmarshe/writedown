import usePublicNotes from "@/components/hooks/usePublicNotes";
import { useRouter } from "next/router";
import React from "react";

export const PostPage = () => {
  const router = useRouter();

  const { note, publicError } = usePublicNotes({
    noteId: router.query.slug as string,
  });

  return (
    <>
      {!note || publicError ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>Title: {note.title}</p>
          <p>Content: {note.content}</p>
        </>
      )}
    </>
  );
};

export default PostPage;
