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
      className={"rounded-full bg-white p-3 dark:bg-slate-900 " + extraClasses}
      {...rest}
    >
      {children}
    </button>
  );
};

export default IconButton;
