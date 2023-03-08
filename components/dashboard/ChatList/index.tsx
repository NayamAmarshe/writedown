import {
  collection,
  doc,
  getCountFromServer,
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
  IChannelData,
  IChatLinkData,
  IMessageData,
} from "@/types/utils/firebaseOperations";
import React, {
  FormEvent,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  channelConverter,
  messagesConverter,
} from "@/utils/firestoreDataConverter";
import { IFirebaseAuth } from "@/types/components/firebase-hooks";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { createNewMessage } from "@/utils/firebaseOperations";
import MilkdownEditor from "@/components/ui/MilkdownEditor";
import { useInView } from "react-intersection-observer";
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
  channels?: IChannelData[];
  chatLink?: IChatLinkData | null;
}

const ChatList = ({
  user,
  selectedChannelId,
  chatLink,
  channels,
}: IFirebaseAuth & ChatListProps) => {
  const [input, setInput] = useState("");
  const [clear, setClear] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [messageCache, setMessageCache] = useAtom(messagesAtom);
  const [messages, setMessages] = useState<IMessageData[]>([]);
  const [lastMessage, setLastMessage] =
    useState<QueryDocumentSnapshot<IMessageData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const { ref, inView, entry } = useInView({
    trackVisibility: true,
    delay: 100,
    threshold: 1,
  });

  // FETCH CHANNEL DETAILS
  const [channel] = useDocumentData(
    selectedChannelId && user
      ? doc(
          db,
          "users",
          chatLink ? chatLink.userId : user.uid,
          "channels",
          chatLink ? chatLink.channelId : selectedChannelId
        ).withConverter(channelConverter)
      : null,
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!selectedChannelId || !user || !channel) return;

    if (messageCache[selectedChannelId]) {
      setMessages(messageCache[selectedChannelId]);
    }

    console.log("New Message! ");

    // Fetch messages for selected channel ID from Firestore
    const messagesQuery = query(
      collection(
        db,
        "users",
        chatLink ? chatLink.userId : channel.userId,
        "channels",
        chatLink ? chatLink.channelId : selectedChannelId,
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

    // Fetch one more message to check if there are more messages
    // const moreMessagesQuery = query(
    //   collection(
    //     db,
    //     "users",
    //     user?.uid,
    //     "channels",
    //     selectedChannelId,
    //     "messages"
    //   ),
    //   orderBy("createdAt", "desc"),
    //   startAfter(lastMessage),
    //   limit(1)
    // ).withConverter(messagesConverter);

    // const moreMessagesCount = await getCountFromServer(messagesQuery);

    // Cleanup subscription on unmount or channel change
    return () => {
      messagesSubscription();
      // moreMessagesSubscription();
    };
  }, [selectedChannelId, channel]);

  const handleLoadMore = useCallback(async () => {
    if (!selectedChannelId || !user || !channel) return;
    if (!lastMessage || !hasMore) return;

    console.log("Loading more messages");

    // Fetch messages for selected channel ID from Firestore
    const messagesQuery = query(
      collection(
        db,
        "users",
        chatLink ? chatLink.userId : channel.userId,
        "channels",
        chatLink ? chatLink.channelId : selectedChannelId,
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
      if (newMessages.length < 3) setHasMore(false);

      if (!messageCache[selectedChannelId]) {
        setMessageCache((prev) => ({
          ...prev,
          [selectedChannelId]: newMessages,
        }));
      }

      // Update messages
      setMessages((prev) => Array.from(new Set([...prev, ...newMessages])));
      setLastMessage(querySnapshot.docs[querySnapshot.docs.length - 1]);
    });

    return () => messagesSubscription();
  }, [lastMessage, selectedChannelId, channel]);

  useEffect(() => {
    if (selectedChannelId) {
      setMessages(messageCache[selectedChannelId] || []);
      setHasMore(true);
    }
  }, [messageCache, selectedChannelId]);

  useEffect(() => {
    if (inView) {
      handleLoadMore();
    }
  }, [inView, handleLoadMore]);

  const messageSubmitHandler = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
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
    },
    [input, selectedChannelId, user]
  );

  // RENDER
  // if (!channel) return <Skeleton className="h-full w-full" />;

  return (
    <div className="flex h-full w-full select-none flex-col justify-between">
      <ChannelDetailsBar
        userId={user?.uid}
        channel={channel}
        homeChannel={channels?.some((x) => x.id === chatLink?.channelId)}
      />

      <div className="m-4 mb-auto flex flex-col-reverse gap-4 overflow-y-auto p-2">
        {selectedChannelId && messages.length > 0 ? (
          messages.map((message, index) => {
            return (
              <div
                ref={index === messages.length - 1 ? ref : null}
                key={message.id}
                className="flex flex-col gap-2"
              >
                <ChatBubble messageData={message} channelData={channel} />
              </div>
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
