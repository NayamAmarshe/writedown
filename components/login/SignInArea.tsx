import {
  useSignInWithGithub,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { GithubLogo, GoogleLogo } from "@phosphor-icons/react";
import BetaBadge from "../ui/BetaBadge";
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
    <div className="flex h-1/2 w-full flex-col items-center justify-end gap-4 bg-slate-300 md:h-full md:w-1/2">
      <div className="absolute top-0 left-5 px-4 pb-4 text-2xl font-semibold">
        <Link href="/" className="fixed top-4 z-10 flex items-center">
          writedown <BetaBadge />
        </Link>
      </div>
      <div className="bottom-0 flex h-full w-full flex-col items-center gap-4 bg-gray-50 px-10 py-16 pb-20 md:justify-center md:rounded-r-xl">
        <p className="mb-5 text-center text-sm font-medium">
          Login with your familiar services:
        </p>
        <Button
          extraClasses="flex gap-2 border-2 hover:!border-slate- !text-slate-900 !px-10"
          data-testid="google-login"
          onClick={() => login("google")}
        >
          <GoogleLogo className="h-6 w-6" /> Sign in with Google
        </Button>
        <Button
          extraClasses="flex gap-2 border-2 hover:!border-slate-600 !bg-slate-900 !text-slate-50 !px-10 hover:!bg-slate-600 hover:!text-slate-50"
          data-testid="github-login"
          onClick={() => login("github")}
        >
          <GithubLogo className="h-6 w-6" /> Sign in with GitHub
        </Button>
      </div>
    </div>
  );
};

export default SignInArea;
