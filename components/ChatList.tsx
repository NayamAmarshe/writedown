import {
  getMessagesByChannelId,
  createNewMessage,
} from "@/utils/firebaseOperations";
import { collection, query, serverTimestamp } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { IFirebaseAuth } from "@/types/components/firebase-hooks";
import { IMessageData } from "@/types/utils/firebaseOperations";
import React, { useEffect, useState } from "react";
import { uuidv4 } from "@firebase/util";
import { db } from "@/lib/firebase";

const ChatList = ({ user }: IFirebaseAuth) => {
  const [message, setMessage] = useState<IMessageData[]>([]);
  const [input, setInput] = useState("");
  const [channels] = useCollectionData(
    user && query(collection(db, "users", user.uid, "channels"))
  ); //SHOULD USE A GLOBAL STATE TO GET THE SELECTED CHANNEL
  const getMessages = async () => {
    if (!channels || !user) return;
    const allMessagesFromServer = await getMessagesByChannelId(
      channels[0].id, //USING ONLY THE FIRST CHANNEL
      user.uid
    );
    if (!allMessagesFromServer) return;
    setMessage(
      allMessagesFromServer
        .map((x) => x.data())
        .sort(
          (x, y) => x.createdAt?.seconds - y.createdAt?.seconds //SORTING DOESN'T PROPERLY WORK
        ) as IMessageData[]
    );
  };
  //USEEFFECT BEING USED AS SETSTATE FUNCTIONS DONT WORK PROPERLY IN ASYNC FUNCTION CALLS APPARENTLY
  useEffect(() => {
    getMessages();
  }, [user, channels]);

  return (
    <div className="flex h-full w-full flex-col p-5">
      <div className="m-5 flex flex-col gap-y-10" onLoad={getMessages}>
        {message.map((messageObject: IMessageData) => {
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
            getMessages();
          }}
        >
          submit
        </button>
      </div>
    </div>
  );
};

export default ChatList;
