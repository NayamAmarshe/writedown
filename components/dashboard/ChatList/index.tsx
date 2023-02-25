import {
  collection,
  doc,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { IChannelData, IMessageData } from "@/types/utils/firebaseOperations";
import { selectedChannelIdAtom } from "@/stores/selectedChannelIdAtom";
import { IFirebaseAuth } from "@/types/components/firebase-hooks";
import { createNewMessage } from "@/utils/firebaseOperations";
import React, { FormEvent, useEffect, useState } from "react";
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
  const [selectedChannelId] = useAtom(selectedChannelIdAtom);
  const [isClient, setIsClient] = useState(false);

  const [channel] = useDocumentData(
    selectedChannelId && user
      ? doc(db, "users", user.uid, "channels", selectedChannelId)
          .withConverter(channelConverter)
          .withConverter(channelConverter)
      : null,
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useEffect(() => {
    console.log(input);
  }, [input]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [messages] = useCollectionData(
    user && selectedChannelId
      ? query(
          collection(
            db,
            "users",
            user.uid,
            "channels",
            selectedChannelId,
            "messages"
          ),
          orderBy("createdAt", "desc"),
          limit(10)
        ).withConverter(messagesConverter)
      : null,
    {
      initialValue: [],
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

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
    console.log("MESSAGE SENT");
  };

  if (!channel) return <></>;

  return (
    <div className="flex h-full w-full flex-col justify-between">
      {user && <ChannelDetailsBar userId={user.uid} channel={channel} />}
      <div className="flex flex-col gap-y-1 overflow-y-auto px-2 pt-20">
        {selectedChannelId &&
          messages?.map((message) => {
            return (
              <ChatBubble
                key={message.id}
                messageData={message}
                channelData={channel}
              />
            );
          })}
      </div>

      {/* BOTTOM BAR */}
      <form
        className="flex flex-row items-end gap-2 p-2"
        onSubmit={messageSubmitHandler}
      >
        {isClient && selectedChannelId && channel ? (
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
