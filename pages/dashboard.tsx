import { useCollectionData } from "react-firebase-hooks/firestore";
import { notesConverter } from "@/utils/firestoreDataConverter";
import { collection, orderBy, query } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { createUser } from "@/utils/firebaseOperations";
import Button from "@/components/ui/Button";
import { useRouter } from "next/router";
import { db } from "@/lib/firebase";
import { auth } from "./_app";
import React from "react";

const Dashboard = () => {
  // NEXT ROUTER
  const router = useRouter();

  // AUTH STATE HOOK
  const [user] = useAuthState(auth, {
    onUserChanged: async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      createUser(user);
    },
  });

  const [notes] = useCollectionData(
    user &&
      query(
        collection(db, "notes"),
        orderBy("createdAt", "desc")
      ).withConverter(notesConverter)
  );

  return (
    <div className="flex h-screen w-screen flex-row bg-slate-200 text-gray-900">
      <aside className="m-10 flex w-96 flex-col gap-10 rounded-xl bg-white p-5">
        {user && (
          <h4 className="text-xl font-semibold text-slate-500">
            Hi there,{" "}
            <span className="text-slate-900">{user?.displayName}</span>
          </h4>
        )}

        <div className="">
          <Button variant="primary">New Post</Button>
          <div>
            {notes?.map((note) => (
              <div key={note.id}>{note.title}</div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Dashboard;
