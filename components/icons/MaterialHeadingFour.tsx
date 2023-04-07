import React from "react";

const MaterialHeadingFour = ({ ...rest }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 24 24"
      {...rest}
    >
      <path
        fill="currentColor"
        d="M4 17q-.425 0-.713-.288T3 16V8q0-.425.288-.713T4 7q.425 0 .713.288T5 8v3h4V8q0-.425.288-.713T10 7q.425 0 .713.288T11 8v8q0 .425-.288.713T10 17q-.425 0-.713-.288T9 16v-3H5v3q0 .425-.288.713T4 17Zm15 0q-.425 0-.713-.288T18 16v-2h-4q-.425 0-.713-.288T13 13V8q0-.425.288-.713T14 7q.425 0 .713.288T15 8v4h3V8q0-.425.288-.713T19 7q.425 0 .713.288T20 8v4h1q.425 0 .713.288T22 13q0 .425-.288.713T21 14h-1v2q0 .425-.288.713T19 17Z"
      />
    </svg>
  );
};

export default MaterialHeadingFour;
