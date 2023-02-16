import { IChannelData, IMessageData } from "@/types/utils/firebaseOperations";
import Skeleton from "react-loading-skeleton";
import React from "react";

interface ChatBubbleProps {
  messageData: IMessageData;
  channelData?: IChannelData;
}

const ChatBubble = ({ messageData, channelData }: ChatBubbleProps) => {
  const getMessageTime = () => {
    const timestamp = messageData.createdAt;
    if (!timestamp) return null;

    const date = timestamp.toDate();
    const now = Date.now();
    const diff = now - date.getTime(); // in milliseconds

    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) {
      return seconds + " seconds ago";
    }
    const minutes = Math.floor(diff / (60 * 1000));
    if (minutes < 60) {
      return minutes + " minutes ago";
    }
    const hours = Math.floor(diff / (60 * 60 * 1000));
    if (hours < 24) {
      return hours + " hours ago";
    }
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    if (days < 7) {
      return days + " days ago";
    }
    return new Date().toLocaleDateString(); // for more than a week, show the actual date
  };
  return (
    <div
      key={messageData.id}
      className={`${
        messageData.type === "info" &&
        "my-5 h-fit w-fit self-center rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-gray-500"
      } ${
        messageData.type === "message" &&
        (messageData.text.length > 50
          ? "w-full items-center rounded-xl bg-gray-100"
          : "w-fit items-center rounded-xl bg-gray-100")
      }`}
    >
      {messageData.type === "message" && (
        <p className="my-2 mx-2 w-fit rounded-md bg-gray-200 py-1 px-2 text-xs font-medium text-gray-900">
          {getMessageTime() || <Skeleton />}
        </p>
      )}
      <p
        className={
          messageData.type === "message"
            ? "prose prose-sm m-3 max-w-none md:prose-base lg:prose-lg"
            : ""
        }
        dangerouslySetInnerHTML={{ __html: messageData.text }}
      ></p>
    </div>
  );
};

export default ChatBubble;
