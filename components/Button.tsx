import React from "react";

interface IProps {
  type: "primary" | "secondary" | "custom";
  children?: React.ReactNode;
}

const Button = ({ children }: IProps) => {
  return (
    <button
      type="button"
      className={`py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-gray-500 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all text-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800`}>
      {children}
    </button>
  );
};

export default Button;
