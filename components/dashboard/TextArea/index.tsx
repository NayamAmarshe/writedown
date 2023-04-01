import React from "react";

type TextAreaProps = {
  shiftRight?: boolean;
};

const TextArea = ({ shiftRight }: TextAreaProps) => {
  return (
    <div className="flex w-full items-start justify-center overflow-y-auto">
      <div className="mt-52 h-full w-full max-w-3xl rounded-xl bg-white p-5 transition-transform duration-300">
        Text Area
      </div>
    </div>
  );
};

export default TextArea;
