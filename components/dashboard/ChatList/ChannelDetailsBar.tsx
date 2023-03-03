import { channelBackgroundColors } from "@/constants/channel-background-colors";
import { deleteChannel, editChannel } from "@/utils/firebaseOperations";
import { IChannelData } from "@/types/utils/firebaseOperations";
import EmojiSelector from "@/components/ui/EmojiSelector";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { toast } from "react-hot-toast";

const ChannelDetailsBar = ({
  userId,
  channel,
}: {
  userId?: string;
  channel?: IChannelData;
}) => {
  const [channelName, setChannelName] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [selectEmoji, setSelectEmoji] = useState({
    native: "",
  });
  const [emojiBackgroundIndex, setEmojiBackgroundIndex] = useState(0);

  const resetAddChannelForm = () => {
    setChannelName("");
    setSelectEmoji({
      native: "",
    });
    setEmojiBackgroundIndex(0);
  };

  const saveChannelHandler = async () => {
    if (!channelName || channelName?.length === 0) {
      toast.error("Please enter a channel name");
      return;
    }

    if (!userId || !channel) return;

    editChannel(userId, channel.id, {
      name: channelName,
      emoji: selectEmoji.native,
      emojiBackground: channelBackgroundColors[emojiBackgroundIndex],
    });

    resetAddChannelForm();
  };

  useEffect(() => {
    if (!channel) return;

    setChannelName(channel.name);
    setSelectEmoji({
      native: channel.emoji,
    });
    setEmojiBackgroundIndex(
      channelBackgroundColors.indexOf(channel.emojiBackground)
    );
  }, [channel]);

  return (
    <>
      <div className="left-auto z-10 flex h-16 cursor-pointer select-none items-center justify-between bg-gray-300 bg-opacity-60 px-2 backdrop-blur-lg">
        <div className="flex items-center justify-center gap-3">
          {/* CHANNEL PIC */}
          {channel ? (
            <div
              className={
                "flex h-10 w-10 shrink-0 grow-0 items-center justify-center rounded-full bg-gradient-to-b text-xl " +
                channel?.emojiBackground
              }
            >
              {channel?.emoji}
            </div>
          ) : (
            <Skeleton circle={true} className="h-10 w-10" />
          )}
          <div>
            <p className="text-xl font-semibold text-gray-700">
              {channel?.name || <Skeleton />}
            </p>
            <p className="text-sm text-gray-500">
              {channel ? (
                "Created " + channel.createdAt?.toDate().toDateString()
              ) : (
                <Skeleton className="w-full" />
              )}
            </p>
          </div>
        </div>
        {/* CHANNEL ACTIONS */}
        <div className="flex flex-row gap-2">
          {/* DELETE BUTTON */}
          <button
            className="rounded-md bg-red-200 py-1 px-2 text-xs font-medium text-red-900 group-hover:block"
            onClick={() => {
              if (!userId || !channel) return;
              deleteChannel(channel.id, userId);
            }}
          >
            Delete
          </button>
          {/* EDIT BUTTON */}
          <button
            className="rounded-md bg-green-200 py-1 px-2 text-xs font-medium text-green-900 group-hover:block"
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
        saveHandler={saveChannelHandler}
        disabled={channelName?.length === 0}
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
            value={channelName || ""}
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
