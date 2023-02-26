import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  startAfter,
  Timestamp,
} from "firebase/firestore";
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IChannelData, IMessageData } from "@/types/utils/firebaseOperations";
import { selectedChannelIdAtom } from "@/stores/selectedChannelIdAtom";
import usePaginateQuery from "@/components/hooks/UsePaginateQuery";
import { IFirebaseAuth } from "@/types/components/firebase-hooks";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { createNewMessage } from "@/utils/firebaseOperations";
import MilkdownEditor from "@/components/ui/MilkdownEditor";
import { converter } from "@/utils/firestoreDataConverter";
import ChannelDetailsBar from "./ChannelDetailsBar";
import { MilkdownProvider } from "@milkdown/react";
import Skeleton from "react-loading-skeleton";
import Button from "@/components/ui/Button";
import { uuidv4 } from "@firebase/util";
import ChatBubble from "./ChatBubble";
import { db } from "@/lib/firebase";
import { nanoid } from "nanoid";
import { useAtom } from "jotai";

const channelConverter = converter<IChannelData>();
const messagesConverter = converter<IMessageData>();

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

        const messagesSnapshot = await getDocs(messagesQuery);

        setMessagesData([...messagesSnapshot.docs.map((doc) => doc.data())]);

        lastMessageRef.current =
          messagesSnapshot.docs[messagesSnapshot.docs.length - 1];

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

        setMessagesData([...messagesSnapshot.docs.map((doc) => doc.data())]);

        lastMessageRef.current =
          messagesSnapshot.docs[messagesSnapshot.docs.length - 1];

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

      setMessagesData([
        ...messagesData,
        ...moreMessagesSnapshot.docs.map((doc) => doc.data()),
      ]);

      lastMessageRef.current =
        moreMessagesSnapshot.docs[moreMessagesSnapshot.docs.length - 1];

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
  if (!channel) return <></>;
  return (
    <div className="flex h-full w-full flex-col justify-between">
      {user && <ChannelDetailsBar userId={user.uid} channel={channel} />}
      <div className="flex flex-col-reverse gap-y-1 overflow-y-auto px-2 pt-20">
        {selectedChannelId &&
          messages.map((message) => {
            return (
              <ChatBubble
                key={message.id}
                messageData={message}
                channelData={channel}
              />
            );
          })}
        <button onClick={loadMoreMessages}>Load More</button>
      </div>

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
            <Button variant="solid-black" type="submit">
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

export default ChatList;
