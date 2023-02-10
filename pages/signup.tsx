import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Button from "../components/Button";
import { AiFillGithub, AiFillGoogleCircle } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc"
const Signup: NextPage = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      {/*Main div*/}
      
      <div className="flex flex-col gap-10 rounded-xl border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:shadow-slate-700/[.7] md:p-5">
        {/*Border div*/}
        <div>
          <h3 className="text-center text-xl font-semibold">
            Welcome to WriteDown
          </h3>
        </div>
        <div className="flex flex-col gap-2">
        {/*Buttons div*/}
          <p className="text-center text-sm font-semibold mb-2">
            Sign Up with one of the following:
          </p>
          <Button variant="white" >
            <FcGoogle /> Sign Up with Google
          </Button>
          <Button variant="black" >
            <AiFillGithub /> Sign Up with GitHub
          </Button>
        </div>
        <span className="flex justify-center gap-1">
          <p className="">Already have an account?</p>
          <a href="login" className="font-bold hover:underline">
            Sign In
          </a>
        </span>
      </div>
    </div>
  );
};

export default Signup;
