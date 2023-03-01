import {
  channelConverter,
  messagesConverter,
} from "@/utils/firestoreDataConverter";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import ChatScreen from "@/components/dashboard/ChatScreen";
import { useAuthState } from "react-firebase-hooks/auth";
import { createUser } from "@/utils/firebaseOperations";
import ChatList from "@/components/dashboard/ChatList";
import Sidebar from "@/components/dashboard/Sidebar";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "@/lib/firebase";
import { auth } from "./_app";

const Dashboard = () => {
  // NEXT ROUTER
  const router = useRouter();

  const [showChatScreen, setShowChatScreen] = useState(false);

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

  const [channels] = useCollectionData(
    user &&
      query(
        collection(db, "users", user.uid, "channels"),
        orderBy("updatedAt", "desc")
      ).withConverter(channelConverter)
  );

  const [messages] = useCollectionData(
    user &&
      query(
        collection(db, "messages"),
        orderBy("createdAt", "desc")
      ).withConverter(messagesConverter)
  );

  useEffect(() => {
    if (user) {
      setShowChatScreen(true);
    }
  }, [user]);

  return (
    <div className="flex h-screen w-screen flex-row">
      {showChatScreen && (
        <ChatScreen channels={channels} messages={messages} user={user} />
      )}
    </div>
  );
};

export default Dashboard;
