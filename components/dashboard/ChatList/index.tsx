import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  startAfter,
  Timestamp,
} from "firebase/firestore";
import {
  channelConverter,
  messagesConverter,
} from "@/utils/firestoreDataConverter";
import React, { FormEvent, memo, useEffect, useState } from "react";
import { IFirebaseAuth } from "@/types/components/firebase-hooks";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { IMessageData } from "@/types/utils/firebaseOperations";
import { createNewMessage } from "@/utils/firebaseOperations";
import MilkdownEditor from "@/components/ui/MilkdownEditor";
import { useInView } from "react-intersection-observer";
import InfiniteScroll from "react-infinite-scroller";
import ChannelDetailsBar from "./ChannelDetailsBar";
import { MilkdownProvider } from "@milkdown/react";
import { messagesAtom } from "@/stores/messages";
import Skeleton from "react-loading-skeleton";
import Button from "@/components/ui/Button";
import { uuidv4 } from "@firebase/util";
import ChatBubble from "./ChatBubble";
import { db } from "@/lib/firebase";
import { nanoid } from "nanoid";
import { useAtom } from "jotai";

interface ChatListProps {
  selectedChannelId: string | null;
  setSelectedChannelId: (id: string | null) => void;
}

const ChatList = ({
  user,
  selectedChannelId,
}: IFirebaseAuth & ChatListProps) => {
  const [input, setInput] = useState("");
  const [clear, setClear] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [messageCache, setMessageCache] = useAtom(messagesAtom);
  const [messages, setMessages] = useState<IMessageData[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [lastMessage, setLastMessage] =
    useState<QueryDocumentSnapshot<IMessageData> | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const { ref, inView, entry } = useInView({
    trackVisibility: true,
    delay: 100,
    threshold: 0,
  });

  // FETCH CHANNEL DETAILS
  const [channel] = useDocumentData(
    selectedChannelId && user
      ? doc(db, "users", user.uid, "channels", selectedChannelId).withConverter(
          channelConverter
        )
      : null,
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!selectedChannelId || !user) return;

    if (messageCache[selectedChannelId]) {
      setMessages(messageCache[selectedChannelId]);
    }

    // Fetch messages for selected channel ID from Firestore
    const messagesQuery = query(
      collection(
        db,
        "users",
        user?.uid,
        "channels",
        selectedChannelId,
        "messages"
      ),
      orderBy("createdAt", "desc"),
      limit(3)
    ).withConverter(messagesConverter);

    const messagesSubscription = onSnapshot(messagesQuery, (querySnapshot) => {
      const newMessages = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));

      if (!messageCache[selectedChannelId]) {
        setMessageCache((prev) => ({
          ...prev,
          [selectedChannelId]: newMessages,
        }));
      }

      // Update messages
      setMessages(newMessages);
      if (querySnapshot.docs.length > 0)
        setLastMessage(querySnapshot.docs[querySnapshot.docs.length - 1]);
    });

    // Cleanup subscription on unmount or channel change
    return () => messagesSubscription();
  }, [selectedChannelId, setMessageCache]);

  const handleLoadMore = () => {
    if (!selectedChannelId || !user) return;
    console.log("Loading more messages");
    if (!lastMessage) return;

    // Fetch messages for selected channel ID from Firestore
    const messagesQuery = query(
      collection(
        db,
        "users",
        user?.uid,
        "channels",
        selectedChannelId,
        "messages"
      ),
      orderBy("createdAt", "desc"),
      startAfter(lastMessage),
      limit(3)
    ).withConverter(messagesConverter);

    const messagesSubscription = onSnapshot(messagesQuery, (querySnapshot) => {
      const newMessages = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));

      if (!messageCache[selectedChannelId]) {
        setMessageCache((prev) => ({
          ...prev,
          [selectedChannelId]: newMessages,
        }));
      }

      // Update messages
      setMessages((prev) => [...prev, ...newMessages]);
      setLastMessage(querySnapshot.docs[querySnapshot.docs.length - 1]);
    });
  };

  useEffect(() => {
    if (selectedChannelId) setMessages(messageCache[selectedChannelId] || []);
  }, [messageCache, selectedChannelId]);

  useEffect(() => {
    if (inView) {
      handleLoadMore();
    }
  }, [inView, handleLoadMore]);

  const messageSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user || !selectedChannelId) return;

    createNewMessage(selectedChannelId, user?.uid, {
      id: uuidv4(),
      text: input,
      updated: false,
      type: "message",
      createdAt: serverTimestamp() as Timestamp,
      channelId: selectedChannelId,
      slug: nanoid(),
      userId: user.uid,
    });

    setClear(true);
    setInput("");
  };

  // RENDER
  // if (!channel) return <Skeleton className="h-full w-full" />;

  return (
    <div className="flex h-full w-full select-none flex-col justify-between">
      <ChannelDetailsBar userId={user?.uid} channel={channel} />

      <div
        className="m-4 mb-auto flex flex-col-reverse gap-4 overflow-y-auto p-2"
        id="scrollableDiv"
      >
        {selectedChannelId && messages.length > 0 ? (
          messages.map((message) => {
            if (messages.indexOf(message) === messages.length - 1)
              return (
                <div ref={ref}>
                  <ChatBubble
                    key={message.id}
                    messageData={message}
                    channelData={channel}
                  />
                </div>
              );
            return (
              <ChatBubble
                key={message.id}
                messageData={message}
                channelData={channel}
              />
            );
          })
        ) : (
          <Skeleton className="h-20 w-full" count={5} />
        )}
        {/* <Button variant="outline-gray" onClick={handleLoadMore}>
          Load More
        </Button> */}
      </div>

      {/* BOTTOM BAR */}
      <form
        className="flex flex-row items-end gap-2 p-2"
        onSubmit={messageSubmitHandler}
      >
        {isMounted && (
          <>
            <MilkdownProvider>
              <MilkdownEditor
                channelData={channel}
                input={input}
                setInput={setInput}
                clearSwitch={clear}
                setClearSwitch={setClear}
                className="prose prose-sm max-h-96 min-w-full flex-grow overflow-y-auto whitespace-pre-wrap rounded-xl border-2 border-gray-200 p-2 py-3 px-4 text-sm md:prose-base lg:prose-lg focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400"
              />
            </MilkdownProvider>
            <Button
              variant={input.trim() === "" ? "outline-black" : "solid-black"}
              type="submit"
              disabled={input.trim() === ""}
            >
              Submit
            </Button>
          </>
        )}
      </form>

      {/* BOTTOM BAR */}
    </div>
  );
};

export default memo(ChatList);
