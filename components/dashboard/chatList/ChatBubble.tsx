import { IChannelData, IMessageData } from "@/types/utils/firebaseOperations";
import { deleteMessage, editMessage } from "@/utils/firebaseOperations";
import { serverTimestamp, Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import Tiptap from "@/components/Tiptap";
import Modal from "@/components/Modal";

interface ChatBubbleProps {
  messageData: IMessageData;
  channelData?: IChannelData;
}

const ChatBubble = ({ messageData, channelData }: ChatBubbleProps) => {
  const [edited, setEdited] = useState(messageData.updated);
  const [input, setInput] = useState(messageData.text);
  const getMessageTime = () => {
    const timestamp = messageData.createdAt;
    if (!timestamp) return null;

    const date = timestamp.toDate();
    const now = Date.now();
    const diff = now - date.getTime(); // in milliseconds

    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) {
      return "Just now";
    }
    const minutes = Math.floor(diff / (60 * 1000));
    if (minutes > 1 && minutes < 60) {
      return minutes + " minutes ago";
    } else if (minutes === 1) {
      return "A minute ago";
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

  useEffect(() => {
    setEdited(messageData.updated);
  }, [messageData.updated]);

  if (messageData.type === "info")
    return (
      <div className="my-5 h-fit w-fit self-center rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-gray-500">
        <p>{messageData.text}</p>
      </div>
    );

  return (
    <div
      key={messageData.id}
      className={`
          group relative w-full items-center rounded-xl bg-gray-100
        `}
    >
      <Modal
        title="Delete Message"
        saveButtonLabel="Delete"
        id={`delete-message-${messageData.id}`}
        saveHandler={() => {
          if (!channelData) return;

          deleteMessage(channelData?.id, channelData?.userId, messageData.id);
        }}
      >
        <p className="max-w-md font-medium">
          Are you sure you want to delete this message?This action is
          irreversible!
        </p>
      </Modal>

      <Modal
        title="Edit Message"
        customStyle="fixed inset-4"
        saveButtonLabel="Edit"
        id={`edit-message-${messageData.id}`}
        saveHandler={() => {
          if (!channelData) return;

          editMessage(channelData?.userId, {
            id: messageData.id,
            text: input,
            updated: true,
            type: "message",
            createdAt: messageData?.createdAt,
            channelId: channelData?.id,
          });
        }}
      >
        <Tiptap
          channelData={channelData as IChannelData}
          input={input}
          setInput={setInput}
        />
      </Modal>

      <div className="my-2 mx-2 flex flex-row gap-2">
        {/* MESSAGE TIME */}
        <p className="w-fit rounded-md bg-gray-200 py-1 px-2 text-xs font-medium text-gray-900">
          {getMessageTime() || <Skeleton />}
          <p className="inline text-gray-500"> - edited</p>
        </p>

        {/* EDIT BUTTON */}
        <button
          className="hidden w-fit rounded-md bg-green-200 py-1 px-2 text-xs font-medium text-green-900 group-hover:block"
          data-hs-overlay={`#edit-message-${messageData.id}`}
        >
          Edit
        </button>

        {/* DELETE BUTTON */}
        <button
          className="hidden w-fit rounded-md bg-red-200 py-1 px-2 text-xs font-medium text-red-900 group-hover:block"
          data-hs-overlay={`#delete-message-${messageData.id}`}
        >
          Delete
        </button>
      </div>

      {/* MESSAGE TEXT */}
      <p
        className="prose prose-sm m-3 max-w-none md:prose-base lg:prose-lg"
        dangerouslySetInnerHTML={{ __html: messageData.text }}
      ></p>
    </div>
  );
};

export default ChatBubble;
