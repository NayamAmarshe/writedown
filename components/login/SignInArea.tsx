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
    <div className="flex h-full w-1/2 flex-col items-center justify-center gap-4">
      <Link href="/" className="absolute top-5 left-5 text-2xl font-semibold">
        writedown
      </Link>
      <p className="mb-5 text-center font-medium">
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
  );
};

export default SignInArea;
