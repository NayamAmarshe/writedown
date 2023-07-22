import InfoSidebar from "@/components/login/InfoSidebar";
import { useAuthState } from "react-firebase-hooks/auth";
import SignInArea from "@/components/login/SignInArea";
import HeadTags from "@/components/common/HeadTags";
import useUser from "@/components/hooks/useUser";
import Loading from "@/components/ui/Loading";
import { useRouter } from "next/router";
import { auth } from "./_app";
import React from "react";

const LoginPage = () => {
  // NEXT ROUTER
  const router = useRouter();
  const { createUser } = useUser();

  // AUTH STATE HOOK
  const [authUser, authLoading, authError] = useAuthState(auth, {
    onUserChanged: async (user) => {
      if (!user) return;
      // createUser(user, "TGS963");
      createUser(user);
    },
  });

  if (authError) {
    return (
      <div>
        <p>Error: {authError.message}</p>
      </div>
    );
  }

  if (authLoading || authUser) {
    authUser && router.push("/dashboard");
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen flex-col overflow-y-auto bg-slate-200 text-slate-900 sm:bg-slate-50">
      <HeadTags
        title="Login - writedown"
        description="A simple and beautiful notes app with cloud sync, markdown and offline support. Write, share, inspire."
        ogImage="https://writedown.app/og-image.png"
        ogUrl="https://writedown.app"
      />
      <div className="flex h-screen w-full flex-col-reverse items-center justify-center md:flex-row">
        <SignInArea />
        <InfoSidebar />
      </div>
    </div>
  );
};

export default LoginPage;
