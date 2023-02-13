import {
  collection,
  doc,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { IFirebaseAuth } from "@/types/components/firebase-hooks";
import { createNewMessage } from "@/utils/firebaseOperations";
import { selectedChannelIdAtom } from "@/atoms/state";
import React, { useEffect, useState } from "react";
import { uuidv4 } from "@firebase/util";
import { db } from "@/lib/firebase";
import { useAtom } from "jotai";
import Button from "./Button";

const ChatList = ({ user }: IFirebaseAuth) => {
  const [input, setInput] = useState("");
  const [selectedChannelId] = useAtom(selectedChannelIdAtom);

  const [channel] = useDocumentData(
    selectedChannelId && user
      ? doc(db, "users", user.uid, "channels", selectedChannelId)
      : null,
    {
      initialValue: {},
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
      : null,
    {
      initialValue: [],
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useEffect(() => {
    console.log("ChatList -> messages: ", messages);
    console.log("ChatList -> channel: ", channel);
    console.log("ChatList -> selectedChannelId: ", selectedChannelId);
  }, [messages, channel, selectedChannelId]);

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
            if (!user || !selectedChannelId) return;

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
