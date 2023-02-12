import React, { useState } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import Input from "./Input";

const EmojiSelector = () => {
  const defaultEmoji = {
    native: "🙂",
  };
  const emojiBackgroundVariant = [
    "bg-gradient-to-l from-teal-400 to-blue-500",
    "bg-gradient-to-tl from-sky-500 to-indigo-600",
    "bg-gradient-to-bl from-violet-500 to-fuchsia-500",
    "bg-gradient-to-bl from-purple-500 to-pink-500",
    "bg-gradient-to-tr from-green-700 to-green-400",
    "bg-gradient-to-bl from-orange-400 to-yellow-200 ",
  ];

  const [showPicker, setShowPicker] = useState(false);
  const [selectEmoji, setSelectEmoji] = useState(defaultEmoji);
  const [emojiBackground, setEmojiBackground] = useState(
    emojiBackgroundVariant[0]
  );

  const EmojiBackground = `m-auto rounded-full p-6 border  ${emojiBackground}`;
  const PickerColors = (color: string) => {
    return `h-7 w-7 rounded-full border cursor-pointer ${color}`;
  };

  return (
    <div className="bg-whtie flex flex-col gap-3 transition-all">
      {showPicker && (
        <>
          <div className={EmojiBackground}>
            <span className="text-4xl">{selectEmoji.native}</span>
          </div>

          <div className="style-none flex justify-evenly gap-1 rounded-full bg-white py-2 shadow-md">
            <span
              className={PickerColors(emojiBackgroundVariant[0])}
              onClick={() => setEmojiBackground(emojiBackgroundVariant[0])}
            ></span>
            <span
              className={PickerColors(emojiBackgroundVariant[1])}
              onClick={() => setEmojiBackground(emojiBackgroundVariant[1])}
            ></span>
            <span
              className={PickerColors(emojiBackgroundVariant[2])}
              onClick={() => setEmojiBackground(emojiBackgroundVariant[2])}
            ></span>
            <span
              className={PickerColors(emojiBackgroundVariant[3])}
              onClick={() => setEmojiBackground(emojiBackgroundVariant[3])}
            ></span>
            <span
              className={PickerColors(emojiBackgroundVariant[4])}
              onClick={() => setEmojiBackground(emojiBackgroundVariant[4])}
            ></span>
            <span
              className={PickerColors(emojiBackgroundVariant[5])}
              onClick={() => setEmojiBackground(emojiBackgroundVariant[5])}
            ></span>
          </div>
        </>
      )}
      <div className="flex gap-2 ">
        <Input id="emoji-selector" placeholder="Enter your channel name" />
        <span
          className="m-auto cursor-pointer rounded-md bg-white p-[.8rem] hover:bg-gray-100"
          onClick={() => setShowPicker(!showPicker)}
        >
          🙂
        </span>
      </div>
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
