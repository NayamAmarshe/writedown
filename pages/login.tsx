import React from "react";
import Button from "../components/Button";
import { AiFillGithub, AiFillGoogleCircle } from "react-icons/ai";

const login = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="flex flex-col gap-10 rounded-xl border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:shadow-slate-700/[.7] md:p-5">
        <p className="text-center">Login with one of the following:</p>
        <div className="flex flex-col gap-2">
          <Button type="primary">
            <AiFillGithub /> Sign in with GitHub
          </Button>
          <Button type="outline">
            <AiFillGoogleCircle /> Sign in with Google
          </Button>
        </div>
        <span className="flex justify-center gap-1">
          <p className="">No account yet?</p>
          <a href="/signup" className="font-bold hover:underline">
            Sign Up
          </a>
        </span>
      </div>
    </div>
  );
};

export default login;
