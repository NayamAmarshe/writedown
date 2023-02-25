import {
  AiFillPlusCircle,
  AiOutlineLogout,
  AiOutlineSetting,
} from "react-icons/ai";
import { channelBackgroundColors } from "@/constants/channel-background-colors";
import { selectedChannelIdAtom } from "@/stores/selectedChannelIdAtom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { IFirebaseAuth } from "@/types/components/firebase-hooks";
import { IChannelData } from "@/types/utils/firebaseOperations";
import { collection, orderBy, query } from "firebase/firestore";
import { createChannel } from "@/utils/firebaseOperations";
import EmojiSelector from "@/components/ui/EmojiSelector";
import { useAuthState } from "react-firebase-hooks/auth";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { uuidv4 } from "@firebase/util";
import ChannelCard from "./ChannelCard";
import { db } from "@/lib/firebase";
import { auth } from "@/pages/_app";
import { nanoid } from "nanoid";
import { useAtom } from "jotai";

interface SidebarProps {
  id: string;
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ user }: SidebarProps & IFirebaseAuth) => {
  const [channelName, setChannelName] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [selectEmoji, setSelectEmoji] = useState({
    native: "🙂",
  });
  const [emojiBackgroundIndex, setEmojiBackgroundIndex] = useState(0);

  const [selectedChannelId, setSelectedChannelId] = useAtom(
    selectedChannelIdAtom
  );

  const [channels, channelsLoading] = useCollectionData(
    user &&
      query(
        collection(db, "users", user.uid, "channels"),
        orderBy("updatedAt", "desc")
      )
      ? query(
          collection(db, "users", user.uid, "channels"),
          orderBy("updatedAt", "desc")
        )
      : query(
          collection(db, "users", user.uid, "channels"),
          orderBy("createdAt", "desc")
        )
  );

  const [messages, messagesLoading] = useCollectionData(
    user && query(collection(db, "messages"), orderBy("createdAt"))
  );

  useEffect(() => {
    if (channels && channels.length > 0) {
      setSelectedChannelId(channels[0].id);
    }
  }, [channels, messages]);

  const resetAddChannelForm = () => {
    setChannelName("");
    setSelectEmoji({
      native: "🙂",
    });
    setEmojiBackgroundIndex(0);
  };

  if (!selectedChannelId) {
    return <></>;
  }

  return (
    <div className="flex h-full flex-col justify-between overflow-hidden bg-gray-100 py-4">
      <Modal
        title="Add New Channel"
        saveButtonLabel="Add"
        id="add-new-channel"
        saveHandler={() => {
          if (!user) return;

          createChannel(user.uid, {
            name: channelName,
            emoji: selectEmoji.native,
            emojiBackground: channelBackgroundColors[emojiBackgroundIndex],
            id: uuidv4(),
            messages: [],
            userId: user.uid,
            slug: nanoid(),
            type: "private",
          });
          resetAddChannelForm();
        }}
      >
        <div className="flex flex-col gap-5">
          <EmojiSelector
            showPicker={showPicker}
            setShowPicker={setShowPicker}
            selectEmoji={selectEmoji}
            setSelectEmoji={setSelectEmoji}
            emojiBackgroundIndex={emojiBackgroundIndex}
            setEmojiBackgroundIndex={setEmojiBackgroundIndex}
          />
          <Input
            id="channel-name"
            label="Channel Name"
            type="text"
            value={channelName}
            placeholder="Enter Channel Name"
            onChange={(e) => {
              setChannelName(e.target.value);
            }}
          />
        </div>
      </Modal>
      {/* TOP BAR */}
      <div className="flex w-full flex-row items-center justify-center px-2 lg:justify-between">
        {/* LOGO */}
        <h4 className="flex flex-row items-center gap-2  pb-4 text-xl font-semibold lg:border-none lg:pb-0">
          <img src="/logo.svg" alt="Logo" className="w-12 lg:w-8" />
          <span className="hidden lg:block">WriteDown</span>
        </h4>
      </div>

      {/* CHANNELS SECTION */}
      <div className="flex h-2 basis-full flex-col gap-3 p-2">
        {/* CHANNELS HEADING */}
        <h4 className="mt-4 hidden text-sm font-medium text-gray-600 lg:block">
          CHANNELS
        </h4>
        {/* NEW CHANNEL BUTTON */}
        <button
          className="flex flex-row items-center justify-center rounded-full bg-gray-200 p-5 md:w-full md:gap-2 lg:h-16 lg:p-2"
          data-hs-overlay="#add-new-channel"
        >
          <AiFillPlusCircle className="text-3xl lg:text-xl" />
          <span className="hidden lg:block">New Channel</span>
        </button>

        {/* CHANNEL LIST */}
        <div className="flex h-full flex-col gap-5 overflow-auto">
          {selectedChannelId &&
            channels?.map((item) => {
              return (
                <ChannelCard
                  key={item.id}
                  highlight={selectedChannelId === item.id}
                  channel={item as IChannelData}
                  onClick={() => {
                    setSelectedChannelId(item.id);
                  }}
                />
              );
            })}
          {selectedChannelId && channels && channels.length === 0 && (
            <p className="text-center text-gray-500">
              No Channels to show. Start by creating one 🤓
            </p>
          )}
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="flex flex-row items-center justify-center gap-2">
        <Button variant="outline-gray" onClick={() => auth.signOut()}>
          <AiOutlineLogout className="text-xl" />
          <span className="hidden lg:inline"> Logout</span>
        </Button>
        {/* <AiOutlineSetting className="text-2xl" />
        <AiOutlineLogout className="text-2xl" /> */}
      </div>
    </div>
  );
};

export default Sidebar;
