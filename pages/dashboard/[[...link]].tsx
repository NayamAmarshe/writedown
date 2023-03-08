import {
  channelConverter,
  messagesConverter,
} from "@/utils/firestoreDataConverter";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { IChatLinkData } from "@/types/utils/firebaseOperations";
import { collection, orderBy, query } from "firebase/firestore";
import ChatScreen from "@/components/dashboard/ChatScreen";
import { useAuthState } from "react-firebase-hooks/auth";
import { createUser } from "@/utils/firebaseOperations";
import ChatList from "@/components/dashboard/ChatList";
import Sidebar from "@/components/dashboard/Sidebar";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useRouter } from "next/router";
import { db } from "@/lib/firebase";
import { auth } from "../_app";

const Dashboard = () => {
  // NEXT ROUTER
  const router = useRouter();

  const [showChatScreen, setShowChatScreen] = useState(false);
  const [requestedChatLink, setRequestedChatLink] =
    useState<IChatLinkData | null>(null);

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

  useEffect(() => {
    if (!router.query.link) return;

    if (router.query.link.length > 2) {
      router.push("/dashboard");
      return;
    }

    setRequestedChatLink({
      userId: router.query.link[0],
      channelId: router.query.link[1],
    });
  }, [router]);

  return (
    <div className="flex h-screen w-screen flex-row">
      {showChatScreen ? (
        <ChatScreen
          channels={channels}
          messages={messages}
          user={user}
          chatLink={requestedChatLink}
        />
      ) : (
        <Skeleton className="h-screen w-screen" />
      )}
    </div>
  );
};

export default Dashboard;
