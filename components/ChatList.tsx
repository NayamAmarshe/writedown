import {
  collection,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import {
  getMessagesByChannelId,
  createNewMessage,
} from "@/utils/firebaseOperations";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { IFirebaseAuth } from "@/types/components/firebase-hooks";
import { IMessageData } from "@/types/utils/firebaseOperations";
import React, { useEffect, useState } from "react";
import { uuidv4 } from "@firebase/util";
import { db } from "@/lib/firebase";

const ChatList = ({ user }: IFirebaseAuth) => {
  const [input, setInput] = useState("");
  const [channels] = useCollectionData(
    user && query(collection(db, "users", user.uid, "channels"))
  ); //SHOULD USE A GLOBAL STATE TO GET THE SELECTED CHANNEL
  const [messages] = useCollectionData(
    user &&
      channels &&
      query(
        collection(
          db,
          "users",
          user.uid,
          "channels",
          channels[0].id,
          "messages"
        ),
        orderBy("createdAt"),
        limit(10)
      )
  );

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
        <button
          onClick={() => {
            if (!channels || !user) return;
            createNewMessage(channels[0].id, user?.uid, {
              id: uuidv4(),
              text: input,
              type: "info",
              createdAt: serverTimestamp(),
              channelId: channels[0].id,
            });
            setInput("");
          }}
        >
          submit
        </button>
      </div>
    </div>
  );
};

export default ChatList;
