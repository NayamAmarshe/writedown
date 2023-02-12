import { channelBackgroundColors } from "@/constants/channel-background-colors";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import Button from "./Button";
import React from "react";

interface EmojiSelectorProps {
  showPicker: boolean;
  setShowPicker: React.Dispatch<React.SetStateAction<boolean>>;
  selectEmoji: {
    native: string;
  };
  setSelectEmoji: React.Dispatch<
    React.SetStateAction<{
      native: string;
    }>
  >;
  emojiBackgroundIndex: number;
  setEmojiBackgroundIndex: React.Dispatch<React.SetStateAction<number>>;
}

const EmojiSelector = ({
  selectEmoji,
  setSelectEmoji,
  showPicker,
  setShowPicker,
  emojiBackgroundIndex,
  setEmojiBackgroundIndex,
}: EmojiSelectorProps) => {
  return (
    <div className="bg-whtie flex flex-col gap-3 transition-all">
      <div
        className={`m-auto rounded-full border bg-gradient-to-b p-6 ${channelBackgroundColors[emojiBackgroundIndex]}`}
      >
        <span className="text-4xl">{selectEmoji.native}</span>
      </div>

      <div className="style-none flex justify-evenly gap-1 rounded-full bg-white py-2 shadow-md">
        {channelBackgroundColors.map((backgroundColor, index) => (
          <span
            key={index}
            className={`${backgroundColor} h-7 w-7 cursor-pointer rounded-full border bg-gradient-to-b`}
            onClick={() => setEmojiBackgroundIndex(index)}
          ></span>
        ))}
      </div>
      <Button variant="outline-gray" onClick={() => setShowPicker(!showPicker)}>
        Select Emoji {selectEmoji.native}
      </Button>
      {showPicker && (
        <Picker
          data={data}
          theme="light"
          onEmojiSelect={setSelectEmoji}
          previewPosition="none"
          navPosition="bottom"
          icons="outline"
        />
      )}
    </div>
  );
};

export default EmojiSelector;
