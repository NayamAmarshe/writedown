import React, { ButtonHTMLAttributes } from "react";

const Button = ({
  variant,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: "primary" | "outline" | "ghost";
  children: React.ReactNode;
}) => {
  const getButtonClass = () => {
    switch (variant) {
      case "primary":
        return "inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-blue-500 py-3 px-4 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800";
      case "outline":
        return "py-[.688rem] px-4 inline-flex justify-center items-center gap-2 rounded-md border-2 border-gray-200 font-semibold text-blue-500 hover:text-white hover:bg-blue-500 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:border-gray-700 dark:hover:border-blue-500";
      case "ghost":
        return "py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold text-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm";
      default:
        return "inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-blue-500 py-3 px-4 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800";
    }
  };

  return (
    <button type="button" className={getButtonClass()} {...rest}>
      {children}
    </button>
  );
};

export default Button;
