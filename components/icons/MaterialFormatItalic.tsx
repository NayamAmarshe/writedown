import React from "react";

const MaterialFormatItalic = ({ ...rest }: React.SVGProps<SVGSVGElement>) => {
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
        d="M6.25 19q-.525 0-.888-.363T5 17.75q0-.525.363-.888t.887-.362H9l3-9H9.25q-.525 0-.888-.363T8 6.25q0-.525.363-.888T9.25 5h7.5q.525 0 .888.363T18 6.25q0 .525-.363.888t-.887.362H14.5l-3 9h2.25q.525 0 .888.363t.362.887q0 .525-.363.888T13.75 19h-7.5Z"
      />
    </svg>
  );
};

export default MaterialFormatItalic;
