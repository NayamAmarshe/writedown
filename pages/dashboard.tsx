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
  const [user] = useAuthState(auth, {
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
      <div className="max-w-screen relative flex h-screen flex-row bg-slate-200 p-5 text-gray-900">
        <Sidebar
          user={user}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />

        <TextArea shiftRight={showSidebar} user={user} />
      </div>
    </>
  );
};

export default Dashboard;
