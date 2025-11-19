"use client";

import InfoSidebar from "@/components/login/info-sidebar";
import SignInArea from "@/components/login/signin-area";
import HeadTags from "@/components/common/head-tags";
import useUser from "@/components/hooks/use-user";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  // NEXT ROUTER
  const router = useRouter();

  // AUTH STATE HOOK
  const { user, isUserLoading } = useUser();

  // if (isUserLoading || user) {
  //   user && router.push("/dashboard");
  //   return <Loading />;
  // }

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
