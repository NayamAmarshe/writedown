import { InputHTMLAttributes } from "react";
import React from "react";

const Input = ({
  label,
  id,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label?: string; id: string }) => {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium dark:text-white">
          {label}
        </label>
      )}
      <input
        id={id}
        className="block w-full rounded-full border-gray-200 py-3 px-4 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400"
        {...rest}
      />
    </div>
  );
};

export default Input;
