import {
  useAuthState,
  useSignInWithGithub,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, getFirestore } from "firebase/firestore";
import useUser from "@/components/hooks/useUser";
import React, { useEffect, useRef } from "react";
import { AiFillGithub } from "react-icons/ai";
import { firebaseApp } from "@/lib/firebase";
import Button from "@/components/ui/Button";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";
import { auth } from "./_app";

const LoginPage = () => {
  // NEXT ROUTER
  const router = useRouter();
  const { createUser } = useUser();

  // GOOGLE SIGN IN HOOK
  const [signInWithGoogle, googleUser, googleLoading, googleError] =
    useSignInWithGoogle(auth);
  // GITHUB SIGN IN HOOK
  const [signInWithGithub, githubUser, githubLoading, githubError] =
    useSignInWithGithub(auth);

  // FIRESTORE HOOK
  const [value, loading, error] = useCollection(
    collection(getFirestore(firebaseApp), "users"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const hydratedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hydratedRef.current) {
      hydratedRef.current.classList.add("hydrated");
    }
  }, []);

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
    <div
      ref={hydratedRef}
      className="flex h-screen w-screen flex-col items-center justify-center"
    >
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
          <Button data-testid="google-login" onClick={() => login("google")}>
            <FcGoogle /> Sign in with Google
          </Button>
          <Button data-testid="github-login" onClick={() => login("github")}>
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
