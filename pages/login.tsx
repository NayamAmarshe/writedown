import React from "react";
import Button from "../components/Button";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  useAuthState,
  useSignInWithGithub,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { firebaseApp } from "@/lib/firebase";

const auth = getAuth(firebaseApp);

const LoginPage = () => {
  // GOOGLE SIGN IN HOOK
  const [signInWithGoogle, googleUser, googleLoading, googleError] =
    useSignInWithGoogle(auth);
  // GITHUB SIGN IN HOOK
  const [signInWithGithub, githubUser, githubLoading, githubError] =
    useSignInWithGithub(auth);

  // AUTH STATE HOOK
  const [authUser, authLoading, authError] = useAuthState(auth, {
    onUserChanged: async (user) => {
      console.log(user);
    },
  });

  const login = (type: "google" | "github") => {
    if (type === "google") {
      signInWithGoogle();
    } else if (type === "github") {
      signInWithGithub();
    }
  };

  if (authError) {
    return (
      <div>
        <p>Error: {authError.message}</p>
      </div>
    );
  }
  if (authLoading) {
    return <p>Loading...</p>;
  }
  if (authUser) {
    return (
      <div>
        <p>Signed In User: {authUser.email}</p>
      </div>
    );
  }
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
          <Button variant="white" onClick={() => login("google")}>
            <FcGoogle /> Sign in with Google
          </Button>
          <Button variant="black" onClick={() => login("github")}>
            <AiFillGithub /> Sign in with GitHub
          </Button>
        </div>
        <span className="flex justify-center gap-1">
          <p className="text-sm">No account yet?</p>
          <a href="/signup" className="text-sm font-bold hover:underline">
            Sign Up
          </a>
        </span>
      </div>
    </div>
  );
};

export default LoginPage;
