import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  startAfter,
  Timestamp,
} from "firebase/firestore";
import React, {
  FormEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  channelConverter,
  converter,
  messagesConverter,
} from "@/utils/firestoreDataConverter";
import { IChannelData, IMessageData } from "@/types/utils/firebaseOperations";
import { selectedChannelIdAtom } from "@/stores/selectedChannelIdAtom";
import usePaginateQuery from "@/components/hooks/UsePaginateQuery";
import { IFirebaseAuth } from "@/types/components/firebase-hooks";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { createNewMessage } from "@/utils/firebaseOperations";
import InfiniteScroll from "react-infinite-scroll-component";
import MilkdownEditor from "@/components/ui/MilkdownEditor";
import ChannelDetailsBar from "./ChannelDetailsBar";
import { MilkdownProvider } from "@milkdown/react";
import Skeleton from "react-loading-skeleton";
import Button from "@/components/ui/Button";
import { uuidv4 } from "@firebase/util";
import ChatBubble from "./ChatBubble";
import { db } from "@/lib/firebase";
import { nanoid } from "nanoid";
import { useAtom } from "jotai";

const ChatList = ({ user }: IFirebaseAuth) => {
  const [input, setInput] = useState("");
  const [clear, setClear] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedChannelId] = useAtom(selectedChannelIdAtom);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  // FETCH MESSAGES
  const fetchMessagesQuery = useCallback(() => {
    if (!selectedChannelId || !user) return;

    return query(
      collection(
        db,
        "users",
        user.uid,
        "channels",
        selectedChannelId,
        "messages"
      ),
      limit(5),
      orderBy("createdAt", "desc")
    );
  }, [selectedChannelId, user]);

  // MESSAGES VARIABLES
  const [messagesData, setMessagesData] = useState<IMessageData[]>([]);
  const [messagesDataLoading, setMessagesDataLoading] = useState(false);
  const lastMessageRef = useRef<QueryDocumentSnapshot<IMessageData> | null>(
    null
  );
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  const resetMessages = () => {
    setMessagesData([]);
    setMessagesDataLoading(false);
  };

  useEffect(() => {
    if (!isMounted) return;

    async function fetchMessages() {
      try {
        setMessagesDataLoading(true);

        const fetchMessagesQueryFunction = fetchMessagesQuery();
        if (!fetchMessagesQueryFunction) return;

        const messagesQuery = query(fetchMessagesQueryFunction).withConverter(
          messagesConverter
        );

        const messagesListener = onSnapshot(
          messagesQuery,
          (messagesSnapshot) => {
            console.log(messagesSnapshot);
          }
        );

        const messagesSnapshot = await getDocs(messagesQuery);

        console.log(
          "🚀 => file: index.tsx:113 => messagesSnapshot.docs.length:",
          messagesSnapshot.docs.length
        );
        if (messagesSnapshot.docs.length > 0) {
          console.log("fetchMessagesQuery useEffect, more messages available");
          setMessagesData([...messagesSnapshot.docs.map((doc) => doc.data())]);

          lastMessageRef.current =
            messagesSnapshot.docs[messagesSnapshot.docs.length - 1];

          setHasMoreMessages(true);
        } else {
          console.log(
            "fetchMessagesQuery useEffect, more messages NOT available"
          );
          setHasMoreMessages(false);
        }

        setMessagesDataLoading(false);
      } catch (error) {
        resetMessages();
        console.log(error);
      }
    }

    fetchMessages();
  }, [fetchMessagesQuery, isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    async function fetchMessages() {
      try {
        setMessagesDataLoading(true);

        const fetchMessagesQueryFunction = fetchMessagesQuery();
        if (!fetchMessagesQueryFunction) return;

        const messagesQuery = query(fetchMessagesQueryFunction).withConverter(
          messagesConverter
        );

        const messagesSnapshot = await getDocs(messagesQuery);

        console.log(
          "🚀 => file: index.tsx:156 => messagesSnapshot.docs.length:",
          messagesSnapshot.docs.length
        );
        if (messagesSnapshot.docs.length > 0) {
          console.log("MOUNT useEffect, more messages available");
          setMessagesData([...messagesSnapshot.docs.map((doc) => doc.data())]);

          lastMessageRef.current =
            messagesSnapshot.docs[messagesSnapshot.docs.length - 1];

          setHasMoreMessages(true);
        } else {
          console.log("MOUNT useEffect, more messages NOT available");
          setHasMoreMessages(false);
        }

        setMessagesDataLoading(false);
      } catch (error) {
        resetMessages();
        console.log(error);
      }
    }

    fetchMessages();
  }, [isMounted]);

  const fetchMoreMessages = useCallback(async () => {
    if (!isMounted) return;

    try {
      setMessagesDataLoading(true);

      const fetchMessagesQueryFunction = fetchMessagesQuery();
      if (!fetchMessagesQueryFunction) return;

      const moreMessagesQuery = query(
        fetchMessagesQueryFunction,
        startAfter(lastMessageRef.current)
      ).withConverter(messagesConverter);

      const moreMessagesSnapshot = await getDocs(moreMessagesQuery);

      if (moreMessagesSnapshot.docs.length > 0) {
        setHasMoreMessages(true);

        setMessagesData([
          ...messagesData,
          ...moreMessagesSnapshot.docs.map((doc) => doc.data()),
        ]);

        lastMessageRef.current =
          moreMessagesSnapshot.docs[moreMessagesSnapshot.docs.length - 1];
      } else {
        setHasMoreMessages(false);
      }

      setMessagesDataLoading(false);
    } catch (error) {
      console.log("🚀 => file: index.tsx:143 => error:", error);
      resetMessages();
    }
  }, [isMounted, messagesData, fetchMessagesQuery]);

  const { loadMoreMessages, messagesLoading, messages } = useMemo(() => {
    return {
      loadMoreMessages: fetchMoreMessages,
      messagesLoading: messagesDataLoading,
      messages: messagesData ? messagesData : [],
    };
  }, [fetchMoreMessages, messagesData, messagesDataLoading]);

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

      <InfiniteScroll
        dataLength={messages.length} //This is important field to render the next data
        next={fetchMoreMessages}
        hasMore={hasMoreMessages}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        className="flex max-h-full flex-col-reverse overflow-y-auto"
        inverse={true}
      >
        {selectedChannelId && messages.length > 0 ? (
          messages.map((message) => {
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
      </InfiniteScroll>
      {/* {hasMoreMessages && messages.length >= 5 && (
          <Button variant="outline-gray" onClick={loadMoreMessages}>
            Load More
          </Button>
        )} */}

      {/* BOTTOM BAR */}
      <form
        className="flex flex-row items-end gap-2 p-2"
        onSubmit={messageSubmitHandler}
      >
        {isMounted && selectedChannelId && channel ? (
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
        ) : (
          <Skeleton className="h-full w-full" />
        )}
      </form>

      {/* BOTTOM BAR */}
    </div>
  );
};

export default memo(ChatList);
