import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps {
  extraClasses?: string;
}

const Button = ({
  variant,
  children,
  extraClasses,
  ...rest
}: ButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant:
      | "primary"
      | "outline"
      | "solid"
      | "ghost"
      | "solid-black"
      | "solid-gray"
      | "solid-red"
      | "outline-black"
      | "outline-gray"
      | "outline-red";

    children: React.ReactNode;
  }) => {
  const getButtonClass = () => {
    switch (variant) {
      case "primary":
        return "inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-blue-500 py-4 px-4 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800";
      case "solid":
        return "py-4 px-4 inline-flex justify-center items-center gap-2 rounded-full border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800";
      case "outline":
        return "py-4 px-4 inline-flex justify-center items-center gap-2 rounded-full border-2 border-gray-200 font-semibold text-blue-500 hover:text-white hover:bg-blue-500 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:border-gray-700 dark:hover:border-blue-500";
      case "ghost":
        return "py-4 px-4 inline-flex justify-center items-center gap-2 rounded-full border border-transparent font-semibold text-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm";
      case "solid-black":
        return "py-4 px-4 inline-flex justify-center items-center gap-2 rounded-full border border-transparent font-semibold bg-black text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-all text-sm dark:focus:ring-gray-900 dark:focus:ring-offset-gray-800";
      case "solid-gray":
        return "py-4 px-4 inline-flex justify-center items-center gap-2 rounded-full border border-transparent font-semibold bg-gray-500 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all text-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800";
      case "solid-red":
        return "py-4 px-4 inline-flex justify-center items-center gap-2 rounded-full border border-transparent font-semibold bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800";
      case "outline-black":
        return "py-4 px-4 inline-flex justify-center items-center gap-2 rounded-full border-2 border-gray-900 font-semibold text-gray-800 hover:text-white hover:bg-gray-800 hover:border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-all text-sm dark:hover:bg-gray-900 dark:border-gray-900 dark:hover:border-gray-900 dark:text-white dark:focus:ring-gray-900 dark:focus:ring-offset-gray-800";
      case "outline-gray":
        return "py-4 px-4 inline-flex justify-center items-center gap-2 rounded-full border-2 border-gray-200 font-semibold text-gray-500 hover:text-white hover:bg-gray-500 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-all text-sm  dark:hover:bg-gray-600 dark:border-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-600 dark:focus:ring-offset-gray-800";
      case "outline-red":
        return "py-4 px-4 inline-flex justify-center items-center gap-2 rounded-full border-2 border-red-200 font-semibold text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800";
      default:
        return "inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-blue-500 py-4 px-4 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800";
    }
  };

  return (
    <button
      type="button"
      className={getButtonClass() + " " + extraClasses}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
