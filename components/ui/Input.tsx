import { InputHTMLAttributes } from "react";
import React from "react";

const Input = ({
  label,
  id,
  small,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label?: string;
  small?: boolean;
}) => {
  return (
    <>
      {label && (
        <label className="mb-2 block text-sm font-medium dark:text-white">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-xl bg-slate-200 p-2 outline-hidden dark:bg-slate-900 dark:text-slate-200 ${
          small && "text-sm"
        }`}
        {...rest}
      />
    </>
  );
};

export default Input;
