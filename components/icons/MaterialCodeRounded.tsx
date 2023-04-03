import React from "react";

const MaterialCodeRounded = ({ ...rest }: React.SVGProps<SVGSVGElement>) => {
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
        d="M16.7 17.3q-.275.275-.688.275t-.712-.3q-.3-.3-.3-.712t.3-.713l3.875-3.875l-3.9-3.9Q15 7.8 15.012 7.388T15.3 6.7q.275-.275.7-.275t.7.275l4.6 4.6q.3.3.3.7t-.3.7l-4.6 4.6Zm-9.4 0l-4.6-4.6q-.3-.3-.3-.7t.3-.7l4.6-4.6q.275-.275.7-.287t.725.287q.3.3.3.713t-.3.712l-3.9 3.9l3.9 3.9q.275.275.263.688T8.7 17.3q-.275.275-.7.275t-.7-.275Z"
      />
    </svg>
  );
};

export default MaterialCodeRounded;
