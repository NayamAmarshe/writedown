import {
  useSignInWithGithub,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { authErrorCodes } from "@/constants/firebase-auth-error-codes";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import React, { useEffect } from "react";
import BetaBadge from "../ui/BetaBadge";
import toast from "react-hot-toast";
import { auth } from "@/lib/firebase";
import Button from "../ui/Button";
import Link from "next/link";

const SignInArea = () => {
  // GOOGLE SIGN IN HOOK
  const [signInWithGoogle, googleUser, googleLoading, googleError] =
    useSignInWithGoogle(auth);
  // GITHUB SIGN IN HOOK
  const [signInWithGithub, githubUser, githubLoading, githubError] =
    useSignInWithGithub(auth);

  const login = (type: "google" | "github") => {
    if (type === "google") {
      signInWithGoogle();
    } else if (type === "github") {
      signInWithGithub();
    }
  };

  useEffect(() => {
    const error = githubError || googleError;

    if (!error) return;
    toast.error(
      authErrorCodes[error.code as keyof typeof authErrorCodes] || error.message
    );
  }, [githubError, googleError]);

  return (
    <div className="flex h-1/2 w-full flex-col items-center justify-end gap-4 bg-slate-300 md:h-full md:w-1/2 dark:bg-slate-600 dark:text-slate-50">
      <div className="absolute top-0 left-5 px-4 pb-4 text-2xl font-semibold">
        <Link href="/" className="fixed top-4 z-10 flex items-center">
          writedown
        </Link>
      </div>
      <div className="bottom-0 flex h-full w-full flex-col items-center gap-4 bg-slate-50 px-10 py-16 pb-20 md:justify-center md:rounded-r-xl dark:bg-slate-900">
        <p className="mb-5 text-center text-sm font-medium">
          Login with your familiar services:
        </p>
        <Button
          className="hover:!border-slate- flex gap-2 border-2 px-10! text-slate-900! dark:text-slate-50!"
          data-testid="google-login"
          onClick={() => login("google")}
        >
          <FcGoogle className="h-6 w-6" /> Sign in with Google
        </Button>
        <Button
          className="flex gap-2 border-2 bg-slate-900! px-10! text-slate-50! hover:border-slate-600! hover:bg-slate-600! hover:text-slate-50! dark:text-slate-50! dark:hover:border-slate-300! dark:hover:bg-slate-300! dark:hover:text-slate-900!"
          data-testid="github-login"
          onClick={() => login("github")}
        >
          <AiFillGithub className="h-6 w-6" /> Sign in with GitHub
        </Button>
      </div>
    </div>
  );
};

export default SignInArea;
