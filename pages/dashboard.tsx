import { useAuthState } from "react-firebase-hooks/auth";
import TextArea from "@/components/dashboard/TextArea";
import Sidebar from "@/components/dashboard/Sidebar";
import useUser from "@/components/hooks/useUser";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { auth } from "./_app";

const Dashboard = () => {
  // NEXT ROUTER
  const router = useRouter();
  const { createUser } = useUser();

  const [showSidebar, setShowSidebar] = useState(true);

  // AUTH STATE HOOK
  useAuthState(auth, {
    onUserChanged: async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      createUser(user);
    },
  });

  return (
    <>
      <div className="relative flex h-screen w-screen flex-row bg-slate-200 text-gray-900 dark:bg-slate-800">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <TextArea shiftRight={showSidebar} setShiftRight={setShowSidebar} />
      </div>
    </>
  );
};

export default Dashboard;
