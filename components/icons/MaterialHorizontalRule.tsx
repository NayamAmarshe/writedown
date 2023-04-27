import React from "react";

const MaterialHorizontalRule = ({ ...rest }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      {...rest}
    >
      <path
        fill="currentColor"
        d="M5 13q-.425 0-.713-.288T4 12q0-.425.288-.713T5 11h14q.425 0 .713.288T20 12q0 .425-.288.713T19 13H5Z"
      />
    </svg>
  );
};

export default MaterialHorizontalRule;
