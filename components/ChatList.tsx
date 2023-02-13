import {
  collection,
  doc,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import {
  getMessagesByChannelId,
  createNewMessage,
} from "@/utils/firebaseOperations";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { selectedChannelIndexAtom, selectedChannelIdAtom } from "@/atoms/state";
import { IFirebaseAuth } from "@/types/components/firebase-hooks";
import React, { useEffect, useState } from "react";
import { uuidv4 } from "@firebase/util";
import { db } from "@/lib/firebase";
import { useAtom } from "jotai";
import Button from "./Button";

const ChatList = ({ user }: IFirebaseAuth) => {
  const [input, setInput] = useState("");
  const [selectedChannelIndex, setSelectedChannelIndex] = useAtom(
    selectedChannelIndexAtom
  );
  const [selectedChannelId, setSelectedChannelId] = useAtom(
    selectedChannelIdAtom
  );

  const [channel] = useDocumentData(
    user && selectedChannelId
      ? doc(db, "users", user.uid, "channels", selectedChannelId)
      : null,
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

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
          orderBy("createdAt"),
          limit(10)
        )
      : null
  );

  useEffect(() => {
    console.log("messages: ", messages);
    console.log("channel: ", channel);
  }, [messages, channel]);

  return (
    <div className="flex h-full w-full flex-col p-5">
      <div className="m-5 flex flex-col gap-y-10">
        {messages?.map((messageObject) => {
          return (
            <div
              key={messageObject.id}
              className="h-fit w-fit rounded-xl bg-cyan-300 p-5"
            >
              <p>{messageObject.text}</p>
            </div>
          );
        })}
      </div>
      {/* BOTTOM BAR */}
      <div className="">
        <input
          type="text"
          value={input}
          className="w-full rounded-full bg-gray-200 p-5"
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          variant="solid-black"
          onClick={() => {
            if (!user) return;

            createNewMessage(selectedChannelId, user?.uid, {
              id: uuidv4(),
              text: input,
              type: "info",
              createdAt: serverTimestamp(),
              channelId: selectedChannelId,
            });
            setInput("");
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default ChatList;
