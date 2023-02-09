import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
const Signup: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2 bg-gradient-to-r from-purple-700 to-blue-500">
      <div className='bg-white bg-opacity-40 py-20 px-12 mx-5 rounded-xl'>
        <h1 className="flex text-center justify-center font-normal text-3xl pb-12">Sign Up</h1>
        <div className="pl-2">
          <input type="email" id="input-label" className="my-2 py-3 px-4 flex w-56 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-white dark:border-gray-700 dark:text-black" placeholder="Enter E-Mail" />

          <input type="password" id="input-label" className="my-2 py-3 px-4 flex w-56 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-white dark:border-gray-700 dark:text-black" placeholder="Enter Password" />

          <button type="button" className=" w-20 py-3 px-2 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-black text-white shadow-sm align-middle hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm">
            Sign Up
          </button>
          <button type="button" className="mx-2 w-50 py-3 px-2 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm">
            Have an account?
          </button>
        </div>


      </div>
    </div >
  );
};

export default Signup;
