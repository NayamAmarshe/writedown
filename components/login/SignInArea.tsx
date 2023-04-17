import {
  useSignInWithGithub,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { auth } from "@/pages/_app";
import Button from "../ui/Button";
import Link from "next/link";
import React from "react";

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

  return (
    <div className="flex h-full flex-col items-center justify-end gap-4 bg-slate-300 sm:w-1/2 sm:justify-center sm:bg-gray-50 ">
      <div className="top-0 left-5 px-4 pb-4 text-2xl font-semibold sm:absolute">
        <Link href="/" className="absolute top-4">
          writedown
        </Link>
        <p className="text-xl font-semibold sm:hidden">
          Simplicity starts here
        </p>
        <p className="pr-10 pt-4 text-sm  font-normal sm:hidden">
          A fast, easy and free way to write notes with offline support, cloud
          sync and real-time markdown preview.
        </p>
      </div>
      <div className="bottom-0 flex w-full flex-col items-center gap-4 rounded-t-3xl bg-gray-50 px-10 py-16 pb-20">
        <p className="mb-5 text-center text-sm font-medium">
          Login with your familiar services:
        </p>
        <Button
          extraClasses="flex gap-2 border-2 hover:!border-slate- !text-slate-900 !px-10"
          data-testid="google-login"
          onClick={() => login("google")}
        >
          <FcGoogle className="h-6 w-6" /> Sign in with Google
        </Button>
        <Button
          extraClasses="flex gap-2 border-2 hover:!border-slate-600 !bg-slate-900 !text-slate-50 !px-10 hover:!bg-slate-600 hover:!text-slate-50"
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
