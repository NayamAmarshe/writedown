import {
  collection,
  collectionGroup,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { IChannelData, IMessageData } from "@/types/utils/firebaseOperations";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { converter } from "@/utils/firestoreDataConverter";
import React, { HTMLAttributes, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { db } from "@/lib/firebase";
import rMd from "remove-markdown";

const messagesConverter = converter<IMessageData>();

const ChannelCard = ({
  channel,
  highlight,
  ...rest
}: {
  channel: IChannelData;
  highlight: boolean;
} & HTMLAttributes<HTMLDivElement>) => {
  const [messages, messagesLoading, messagesError] = useCollectionData(
    query(
      collectionGroup(db, "messages"),
      where("channelId", "==", channel.id),
      orderBy("createdAt", "desc"),
      limit(1)
    ).withConverter(messagesConverter)
  );

  useEffect(() => {
    console.log("messages", messages);
    console.log("LOADING: ", messagesLoading);
    console.log("ERROR: ", messagesError);
  }, [messages, messagesLoading, messagesError]);

  return (
    <div
      key={channel.id}
      className={`flex cursor-pointer flex-row items-center justify-center gap-5 p-2 ${
        highlight && "rounded-full bg-gray-300"
      }`}
      {...rest}
    >
      {/* CHANNEL PIC */}
      <div
        className={
          " flex h-12 w-12 shrink-0 grow-0 items-center justify-center rounded-full bg-gradient-to-b text-xl " +
          channel.emojiBackground
        }
      >
        {channel.emoji || <Skeleton />}
      </div>
      {/* CHANNEL INFO */}
      <div className={`hidden w-full lg:flex lg:flex-col`}>
        {/* CHANNEL HEADING */}
        <div className="flex w-full flex-row items-center justify-between">
          {/* CHANNEL NAME */}
          <h4 className="font-medium text-gray-700">
            {channel.name || <Skeleton />}
          </h4>
        </div>
        {/* CHANNEL CHAT */}
        <p className="w-full truncate text-sm text-gray-400">
          {(messages && rMd(messages[0]?.text.slice(0, 20))) || (
            <Skeleton className="w-5/6" />
          )}
        </p>
      </div>
    </div>
  );
};

export default ChannelCard;
