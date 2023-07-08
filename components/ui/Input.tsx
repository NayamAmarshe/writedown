import { InputHTMLAttributes } from "react";
import React from "react";

const Input = ({
  label,
  id,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label?: string; id: string }) => {
  return (
    <>
      {label && (
        <label className="mb-2 block text-sm font-medium dark:text-white">
          {label}
        </label>
      )}
      <input
        id={id}
        className="w-full rounded-xl bg-slate-100 p-2 outline-none dark:bg-slate-900 dark:text-slate-200"
        {...rest}
      />
    </>
  );
};

export default Input;
