import InfoSidebar from "@/components/login/InfoSidebar";
import { useAuthState } from "react-firebase-hooks/auth";
import SignInArea from "@/components/login/SignInArea";
import useUser from "@/components/hooks/useUser";
import { Puff } from "react-loader-spinner";
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
          <Puff
            height="80"
            width="80"
            radius={1}
            color="#1f9aca"
            ariaLabel="puff-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col overflow-y-auto bg-slate-50 text-slate-900">
      <div className="flex h-screen w-full items-center justify-center">
        <SignInArea />
        <InfoSidebar />
      </div>
    </div>
  );
};

export default LoginPage;
