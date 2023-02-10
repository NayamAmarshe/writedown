import React from "react";
import Button from "../components/Button";
import { AiFillGithub, AiFillGoogleCircle } from "react-icons/ai";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  useAuthState,
  useSignInWithGithub,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { firebaseApp } from "@/lib/firebase";

const LoginPage = () => {
  const auth = getAuth(firebaseApp);
  const login = (type: "google" | "github") => {
    if (type === "google") {
      useSignInWithGoogle(auth);
    } else if (type === "github") {
      useSignInWithGithub(auth);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="flex flex-col gap-10 rounded-xl border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:shadow-slate-700/[.7] md:p-5">
        <div>
          <h3 className="text-center text-xl font-semibold">
            Welcome to WriteDown
          </h3>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-center text-sm">
            Login with one of the following:
          </p>
          <Button variant="primary">
            <AiFillGithub /> Sign in with GitHub
          </Button>
          <Button variant="outline">
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

export default LoginPage;
