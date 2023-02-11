// import React from 'react'

// const Input = () => {
//   return (
//     <input type="text" className="py-3 px-5 block w-full border rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" placeholder="Input text"></input>
//   )
// }

// export default Input

import React, { ButtonHTMLAttributes, InputHTMLAttributes } from "react";

const Input = ({ ...rest }: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className="block w-full rounded-md border py-3 px-5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400"
      {...rest}
    />
  );
};

export default Input;
