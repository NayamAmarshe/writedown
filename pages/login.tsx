import loadingAnimation from "@/animations/pencil-write.json";
import InfoSidebar from "@/components/login/InfoSidebar";
import { useAuthState } from "react-firebase-hooks/auth";
import SignInArea from "@/components/login/SignInArea";
import useUser from "@/components/hooks/useUser";
import { useRouter } from "next/router";
import Lottie from "lottie-react";
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
    return (
      <div className="flex min-h-screen flex-col overflow-y-auto bg-slate-50 text-slate-900">
        <div className="flex h-screen w-full items-center justify-center">
          <Lottie
            className="h-1/2 w-1/2"
            animationData={loadingAnimation}
            loop={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col overflow-y-auto bg-slate-200 text-slate-900 sm:bg-slate-50">
      <div className="flex h-screen w-full flex-col-reverse items-center justify-center md:flex-row">
        <SignInArea />
        <InfoSidebar />
      </div>
    </div>
  );
};

export default LoginPage;
