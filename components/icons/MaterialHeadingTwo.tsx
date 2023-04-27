import React from "react";

const MaterialHeadingTwo = ({ ...rest }: React.SVGProps<SVGSVGElement>) => {
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
        d="M4 17q-.425 0-.713-.288T3 16V8q0-.425.288-.713T4 7q.425 0 .713.288T5 8v3h4V8q0-.425.288-.713T10 7q.425 0 .713.288T11 8v8q0 .425-.288.713T10 17q-.425 0-.713-.288T9 16v-3H5v3q0 .425-.288.713T4 17Zm10 0q-.425 0-.713-.288T13 16v-3q0-.825.588-1.413T15 11h4V9h-5q-.425 0-.713-.288T13 8q0-.425.288-.713T14 7h5q.825 0 1.413.588T21 9v2q0 .825-.588 1.413T19 13h-4v2h5q.425 0 .713.288T21 16q0 .425-.288.713T20 17h-6Z"
      />
    </svg>
  );
};

export default MaterialHeadingTwo;
