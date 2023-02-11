import { AiOutlineArrowRight } from "react-icons/ai";
import Button from "../components/Button";
import { useRouter } from "next/router";
import { Router } from "next/router";
import type { NextPage } from "next";
import Link from "next/link";
const Signup: NextPage = () => {
  const router = useRouter();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      {/*Main div*/}

      <div className="p- flex flex-col gap-10 rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:shadow-slate-700/[.7] md:p-5">
        {/*Border div*/}
        <div>
          <h3 className="text-center text-xl font-semibold">Welcome to WriteDown</h3>
        </div>
        <div className="flex flex-col gap-2">
          {/*Buttons div*/}
          <p className="mb-2 text-center text-sm font-semibold">Sign Up with E-Mail:</p>
          <input
            type="email"
            id="email"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Enter e-mail"
            required
          />
          <input
            type="password"
            id="password"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Enter a password"
            required
          />
          <div className="mt-2 flex justify-center">
            <div className="flex flex-row gap-3">
              <Button variant="solid-black">Sign Up</Button>
              <Button variant="outline" onClick={() => router.push("signup")}>
                Other sign up options
                <AiOutlineArrowRight />
              </Button>
            </div>
          </div>
        </div>

        <span className="mx-5 flex justify-center">
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
