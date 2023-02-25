import { channelBackgroundColors } from "@/constants/channel-background-colors";
import { deleteChannel, editChannel } from "@/utils/firebaseOperations";
import { IChannelData } from "@/types/utils/firebaseOperations";
import EmojiSelector from "@/components/ui/EmojiSelector";
import Skeleton from "react-loading-skeleton";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import React, { useState } from "react";

const ChannelDetailsBar = ({
  userId,
  channel,
}: {
  userId: string;
  channel: IChannelData;
}) => {
  const [channelName, setChannelName] = useState(channel.name);
  const [showPicker, setShowPicker] = useState(false);
  const [selectEmoji, setSelectEmoji] = useState({
    native: channel.emoji,
  });
  const [emojiBackgroundIndex, setEmojiBackgroundIndex] = useState(
    channelBackgroundColors.indexOf(channel.emojiBackground)
  );

  const resetAddChannelForm = () => {
    setChannelName("");
    setSelectEmoji({
      native: "🙂",
    });
    setEmojiBackgroundIndex(0);
  };

  return (
    <>
      <div className="fixed z-10 flex h-16 w-full cursor-pointer items-center bg-gray-300 bg-opacity-60 px-2 backdrop-blur-lg">
        <div className="flex items-center gap-2">
          {/* CHANNEL PIC */}
          <div
            className={
              " flex h-10 w-10 shrink-0 grow-0 items-center justify-center rounded-full bg-gradient-to-b text-xl " +
              channel.emojiBackground
            }
          >
            {channel.emoji || <Skeleton />}
          </div>
          <div>
            <p className="text-xl font-medium text-gray-700">{channel.name}</p>
            <p className="text-sm text-gray-500">
              Created {channel.createdAt?.toDate().toDateString()}
            </p>
          </div>
          {/* DELETE BUTTON */}
          <button
            className="bg-red-500 text-white"
            onClick={() => deleteChannel(channel.id, userId)}
          >
            Delete
          </button>
          {/* EDIT BUTTON */}
          <button
            className="bg-blue-500 text-white"
            data-hs-overlay="#edit-channel"
          >
            Edit
          </button>
        </div>
      </div>
      {/* EDIT MODAL */}
      <Modal
        title="Edit Channel"
        saveButtonLabel="Save Changes"
        id="edit-channel"
        saveHandler={() => {
          editChannel(userId, channel.id, {
            name: channelName,
            emoji: selectEmoji.native,
            emojiBackground: channelBackgroundColors[emojiBackgroundIndex],
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
    </>
  );
};

export default ChannelDetailsBar;
