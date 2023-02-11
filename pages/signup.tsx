import { AiFillGithub, AiOutlineMail } from "react-icons/ai";
import Button from "../components/Button";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import Link from "next/link";
const Signup: NextPage = () => {
  const router = useRouter();
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      {/*Main div*/}

      <div className="flex flex-col gap-10 rounded-xl border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:shadow-slate-700/[.7] md:p-5">
        {/*Border div*/}
        <div>
          <h3 className="text-center text-xl font-semibold">Welcome to WriteDown</h3>
        </div>
        <div className="flex flex-col gap-2">
          {/*Buttons div*/}
          <p className="mb-2 text-center text-sm font-semibold">
            Sign Up with one of the following:
          </p>
          <Button variant="outline">
            <FcGoogle /> Sign Up with Google
          </Button>
          <Button variant="solid-black">
            <AiFillGithub /> Sign Up with GitHub
          </Button>
          <Button variant="solid-gray" onClick={() => router.push("emailsignup")}>
            <AiOutlineMail /> Sign Up with E-Mail
          </Button>
        </div>
        <span className="flex justify-center gap-1">
          <p className="">Already have an account?</p>
          <Link href="login" className="font-bold hover:underline">
            Sign In
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Signup;
