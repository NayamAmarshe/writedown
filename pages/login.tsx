import { useAuthState, useSignInWithGithub, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, getFirestore } from "firebase/firestore";
import { createUser } from "@/utils/operations";
import { AiFillGithub } from "react-icons/ai";
import { firebaseApp } from "@/lib/firebase";
import Button from "../components/Button";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";
import { auth } from "./_app";
import React from "react";

const LoginPage = () => {
  // NEXT ROUTER
  const router = useRouter();

  // GOOGLE SIGN IN HOOK
  const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth);
  // GITHUB SIGN IN HOOK
  const [signInWithGithub, githubUser, githubLoading, githubError] = useSignInWithGithub(auth);

  // FIRESTORE HOOK
  const [value, loading, error] = useCollection(collection(getFirestore(firebaseApp), "users"), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  // AUTH STATE HOOK
  const [authUser, authLoading, authError] = useAuthState(auth, {
    onUserChanged: async (user) => {
      if (!user) return;
      createUser(user);
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
    router.push("/dashboard");
  }
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="flex flex-col gap-10 rounded-xl border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:shadow-slate-700/[.7] md:p-5">
        <div>
          <h3 className="text-center text-xl font-semibold">Welcome to WriteDown</h3>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-center text-sm">Login with one of the following:</p>
          <Button variant="outline" onClick={() => login("google")}>
            <FcGoogle /> Sign in with Google
          </Button>
          <Button variant="solid-black" onClick={() => login("github")}>
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