import React from "react";

const MaterialLink = ({ ...rest }: React.SVGProps<SVGSVGElement>) => {
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
        d="M7 17q-2.075 0-3.538-1.463T2 12q0-2.075 1.463-3.538T7 7h3q.425 0 .713.288T11 8q0 .425-.288.713T10 9H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h3q.425 0 .713.288T11 16q0 .425-.288.713T10 17H7Zm2-4q-.425 0-.713-.288T8 12q0-.425.288-.713T9 11h6q.425 0 .713.288T16 12q0 .425-.288.713T15 13H9Zm13-1h-2q0-1.25-.875-2.125T17 9h-3q-.425 0-.713-.288T13 8q0-.425.288-.713T14 7h3q2.075 0 3.538 1.463T22 12Zm-4 8q-.425 0-.713-.288T17 19v-2h-2q-.425 0-.713-.288T14 16q0-.425.288-.713T15 15h2v-2q0-.425.288-.713T18 12q.425 0 .713.288T19 13v2h2q.425 0 .713.288T22 16q0 .425-.288.713T21 17h-2v2q0 .425-.288.713T18 20Z"
      />
    </svg>
  );
};

export default MaterialLink;
