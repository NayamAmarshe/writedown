import React from "react";

type TextAreaProps = {
  shiftLeft?: boolean;
};

const TextArea = ({ shiftLeft }: TextAreaProps) => {
  return (
    <div className="w-full overflow-y-auto">
      <div
        className={`mt-52 h-full w-full max-w-3xl rounded-xl bg-white p-5 transition-transform duration-300 ${
          shiftLeft ? "translate-x-96" : "-translate-x-96"
        }`}
      >
        Text Area
      </div>
    </div>
  );
};

export default TextArea;
