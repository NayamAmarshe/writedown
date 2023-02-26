import { IChannelData, IMessageData } from "@/types/utils/firebaseOperations";
import { deleteMessage, editMessage } from "@/utils/firebaseOperations";
import MilkdownEditor from "@/components/ui/MilkdownEditor";
import { MilkdownProvider } from "@milkdown/react";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import ReactMarkdown from "react-markdown";
import Modal from "@/components/ui/Modal";

interface ChatBubbleProps {
  messageData: IMessageData;
  channelData?: IChannelData;
}

const ChatBubble = ({ messageData, channelData }: ChatBubbleProps) => {
  const [edited, setEdited] = useState(messageData.updated);
  const [input, setInput] = useState(messageData.text);
  const [clearInput, setClearInput] = useState(false);
  const [isClient, setIsClient] = useState(false);

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

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (messageData.type === "info")
    return (
      <div className="mb-5 h-fit w-fit select-text self-center rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-gray-500">
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
      {/* MESSAGE BUBBLE */}
      <>
        <div className="my-2 mx-2 flex flex-row gap-2">
          {/* MESSAGE TIME */}
          <p className="group/item w-fit rounded-md bg-gray-200 py-1 px-2 text-xs font-medium text-gray-900">
            {/* DEFAULT AGO TIME */}
            <span className="group-hover/item:hidden">
              {getMessageTime() || <Skeleton />}
            </span>
            {/* HOVER TIME */}
            <span className="hidden group-hover/item:inline">
              {messageData.createdAt?.toDate().toDateString() +
                " at " +
                messageData.createdAt
                  ?.toDate()
                  .toLocaleTimeString()
                  .slice(0, -3) || <Skeleton />}
            </span>
            {/* EDITED INDICATOR */}
            {edited && <span className="inline text-gray-500"> - edited</span>}
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
        <ReactMarkdown className="prose prose-sm m-3 max-w-none select-text break-all md:prose-base lg:prose-lg">
          {messageData.text}
        </ReactMarkdown>
      </>

      {/* DELETE MESSAGE MODAL */}
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

      {/* MESSAGE EDIT MODAL */}
      <Modal
        title="Edit Message"
        fullscreen={true}
        saveButtonLabel="Save"
        id={`edit-message-${messageData.id}`}
        saveHandler={() => {
          if (!channelData || !messageData) return;
          if (input.length === 0 || input === "<p></p>") {
            // TODO: SHOW TOAST/MODAL IF THEY WANNA DELETE THEIR MESSAGE INSTEAD
            setInput(messageData.text);
            return;
          }

          editMessage(
            channelData.userId,
            channelData.id,
            messageData.id,
            input
          );
          setInput(messageData.text);
        }}
      >
        {isClient && channelData && (
          <MilkdownProvider>
            <MilkdownEditor
              input={input}
              setInput={setInput}
              clearSwitch={clearInput}
              setClearSwitch={setClearInput}
              className="prose prose-sm h-full min-w-full flex-grow overflow-y-auto whitespace-pre-wrap rounded-xl border-2 border-gray-200 p-2 py-3 px-4 text-sm md:prose-base lg:prose-lg focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400"
            />
          </MilkdownProvider>
        )}
      </Modal>
    </div>
  );
};

export default ChatBubble;
