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
  const [lastMessage, setLastMessage] =
    useState<QueryDocumentSnapshot<IMessageData> | null>(null);
  const [isFetching, setIsFetching] = useState(false);

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

    setIsFetching(true);

    const messagesRef = query(
      collection(
        db,
        "users",
        user?.uid,
        "channels",
        selectedChannelId,
        "messages"
      ),
      orderBy("createdAt", "desc"),
      limit(2)
    ).withConverter(messagesConverter);

    const unsubscribeSnapshot = onSnapshot(messagesRef, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => doc.data());

      if (!lastMessage) {
        messageCache[selectedChannelId] = fetchedMessages;
        setLastMessage(snapshot.docs[snapshot.docs.length - 1]);
      }

      setMessages(fetchedMessages);
    });

    // SUBSCRIBE TO CHANGES
    const unsubscribeChanges = onSnapshot(messagesRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        // WHEN NEW MESSAGE IS DETECTED
        if (change.type === "modified") {
          // GET THE NEW MESSAGE
          const message = change.doc.data();

          // LOOP THROUGH THE PRE-EXISTING MESSAGES
          const updatedMessages = messages.map((m) => {
            // IF THE NEW MESSAGE'S ID MATCHES THE OLD MESSAGE ID
            // PICK THE NEWER ONE
            if (m.id === message.id) {
              return message;
            }
            // OTHERWISE, RETURN THE OLD MESSAGE
            return m;
          });

          // REPLACE THE CACHE WITH THE UPDATED MESSAGES LIST
          messageCache[selectedChannelId] = updatedMessages;

          // REPLACE THE MESSAGES STATE WITH THE UPDATED MESSAGES LIST
          setMessages(updatedMessages);
        }
      });

      // SET THE LAST MESSAGE
      if (messageCache[selectedChannelId]) {
        setMessages(messageCache[selectedChannelId]);
      }

      setIsFetching(false);

      return () => {
        unsubscribeSnapshot();
        unsubscribeChanges();
      };
    });
  }, [selectedChannelId, lastMessage]);

  const handleLoadMore = () => {
    if (!selectedChannelId || !user || isFetching) return;

    setIsFetching(true);

    const messagesRef = query(
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
      limit(10)
    ).withConverter(messagesConverter);

    onSnapshot(messagesRef, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => doc.data());
      console.log("🚀 => file: index.tsx:171 => messages:", messages);

      setMessages((prevMessages) => [...prevMessages, ...newMessages]);

      setMessageCache((prevCache) => {
        const updatedCache = { ...prevCache };
        const updatedCacheMessages = updatedCache[selectedChannelId] || [];

        updatedCache[selectedChannelId] = [
          ...updatedCacheMessages,
          ...newMessages,
        ];

        return updatedCache;
      });

      if (snapshot.docs.length > 0)
        setLastMessage(snapshot.docs[snapshot.docs.length - 1]);
    });

    setIsFetching(false);
  };

  useEffect(() => {
    console.log("MESSAGES", messages);
    console.log("CACHE", messageCache);
    console.log("LAST MESSAGE", lastMessage?.data().id);
  }, [messages, lastMessage, selectedChannelId]);

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

      <div className="mb-auto overflow-y-auto p-2">
        <InfiniteScroll
          dataLength={messages.length}
          next={handleLoadMore}
          hasMore={true}
          loader={<h4>Loading...</h4>}
          className="flex flex-col-reverse gap-y-2"
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
        <Button variant="outline-gray" onClick={handleLoadMore}>
          Load More
        </Button>
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
