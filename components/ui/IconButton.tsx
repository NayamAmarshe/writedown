import React from "react";

type IconButtonProps = {
  children: React.ReactNode;
  extraClasses?: HTMLButtonElement["className"];
};

const IconButton = ({
  children,
  extraClasses,
  ...rest
}: IconButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={
        "absolute top-1/2 -right-5 z-10 rounded-full bg-white p-3 shadow-lg shadow-slate-400/40 " +
        extraClasses
      }
      {...rest}
    >
      {children}
    </button>
  );
};

export default IconButton;
