import {
  useCollection,
  useCollectionData,
  useDocument,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import {
  collection,
  doc,
  documentId,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import {
  AiFillPlusCircle,
  AiOutlineLogout,
  AiOutlineSetting,
} from "react-icons/ai";
import { channelBackgroundColors } from "@/constants/channel-background-colors";
import { createChannel, getChannelsByUserId } from "@/utils/operations";
import { IFirebaseAuth } from "@/types/components/firebase-hooks";
import { IChannelData } from "@/types/utils/operations";
import React, { useEffect, useState } from "react";
import { firebaseApp } from "@/lib/firebase";
import EmojiSelector from "./EmojiSelector";
import { uuidv4 } from "@firebase/util";
import { db } from "@/lib/firebase";
import Modal from "./Modal";
import Input from "./Input";

interface SidebarProps {
  id: string;
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({
  id,
  setShowSidebar,
  user,
}: SidebarProps & IFirebaseAuth) => {
  const [channelName, setChannelName] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [selectEmoji, setSelectEmoji] = useState({
    native: "🙂",
  });
  const [emojiBackgroundIndex, setEmojiBackgroundIndex] = useState(0);

  // const [channels] = useDocumentData(doc(db, "channels/" + userId), {
  //   initialValue: [],
  // });

  const [channels] = useCollectionData(
    user && query(collection(db, "users", user.uid, "channels"))
  );

  useEffect(() => {
    if (channels) {
      console.log("🚀 => file: Sidebar.tsx:60 => channels[0]", channels);
    }
  }, [channels]);

  const resetAddChannelForm = () => {
    setChannelName("");
    setSelectEmoji({
      native: "🙂",
    });
    setEmojiBackgroundIndex(0);
  };

  return (
    <div className="flex max-h-screen flex-col justify-between overflow-hidden bg-gray-100 p-4 md:w-6/12 lg:w-4/12">
      <Modal
        id="add-new-channel"
        saveHandler={() => {
          if (!user) return;

          createChannel(user?.uid, {
            name: channelName,
            emoji: selectEmoji.native,
            emojiBackground: channelBackgroundColors[emojiBackgroundIndex],
            id: uuidv4(),
            messages: [],
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
      <div className="flex w-full flex-row items-center justify-between">
        {/* LOGO */}
        <h4 className="flex flex-row items-center gap-2 text-xl font-semibold">
          <img src="/logo.svg" alt="Logo" className="w-8" />
          WriteDown
        </h4>
      </div>

      {/* CHANNELS SECTION */}
      <div className="flex h-2 basis-full flex-col gap-3 p-3">
        {/* CHANNELS HEADING */}
        <h4 className="mt-4 text-sm font-medium text-gray-600">CHANNELS</h4>
        {/* NEW CHANNEL BUTTON */}
        <button
          className="flex w-full flex-row items-center justify-center gap-2 rounded-full bg-gray-200 p-2"
          data-hs-overlay="#add-new-channel"
        >
          <AiFillPlusCircle className="text-xl" />
          New Channel
        </button>

        {/* CHANNEL LIST */}
        <div className="flex flex-col gap-5 overflow-auto p-2">
          {channels?.map((item) => {
            return (
              <div
                key={item.id}
                className="flex flex-row items-center justify-center gap-5"
              >
                {/* CHANNEL PIC */}
                <div
                  className={
                    "flex h-12 w-12 shrink-0 grow-0 items-center justify-center rounded-full bg-gradient-to-b text-xl " +
                    item.emojiBackground
                  }
                >
                  {item.emoji}
                </div>
                {/* CHANNEL INFO */}
                <div className="flex w-full flex-col">
                  {/* CHANNEL HEADING */}
                  <div className="flex w-full flex-row justify-between">
                    {/* CHANNEL NAME */}
                    <h4 className="font-medium text-gray-700">{item.name}</h4>
                    {/* CHANNEL TIME */}
                    <h4 className="text-xs text-gray-400">9:43 PM</h4>
                  </div>
                  {/* CHANNEL CHAT */}
                  <p className="text-sm text-gray-400">
                    Lorem ipsum dolor sit amet...
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="flex w-full flex-row justify-around p-5">
        <AiOutlineSetting className="text-2xl" />
        <AiOutlineLogout className="text-2xl" />
      </div>
    </div>
  );
};

export default Sidebar;
