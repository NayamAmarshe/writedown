import React from "react";

const MaterialUnorderedList = ({ ...rest }: React.SVGProps<SVGSVGElement>) => {
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
        d="M10 19q-.425 0-.713-.288T9 18q0-.425.288-.713T10 17h10q.425 0 .713.288T21 18q0 .425-.288.713T20 19H10Zm0-6q-.425 0-.713-.288T9 12q0-.425.288-.713T10 11h10q.425 0 .713.288T21 12q0 .425-.288.713T20 13H10Zm0-6q-.425 0-.713-.288T9 6q0-.425.288-.713T10 5h10q.425 0 .713.288T21 6q0 .425-.288.713T20 7H10ZM5 20q-.825 0-1.413-.588T3 18q0-.825.588-1.413T5 16q.825 0 1.413.588T7 18q0 .825-.588 1.413T5 20Zm0-6q-.825 0-1.413-.588T3 12q0-.825.588-1.413T5 10q.825 0 1.413.588T7 12q0 .825-.588 1.413T5 14Zm0-6q-.825 0-1.413-.588T3 6q0-.825.588-1.413T5 4q.825 0 1.413.588T7 6q0 .825-.588 1.413T5 8Z"
      />
    </svg>
  );
};

export default MaterialUnorderedList;
