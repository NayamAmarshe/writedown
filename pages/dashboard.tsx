import { createUser } from "@/utils/firebase-operations";
import { useAuthState } from "react-firebase-hooks/auth";
import ChatList from "@/components/ChatList";
import { firebaseApp } from "@/lib/firebase";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { auth } from "./_app";

const Dashboard = () => {
  // NEXT ROUTER
  const router = useRouter();

  // AUTH STATE HOOK
  const [authUser] = useAuthState(auth, {
    onUserChanged: async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      createUser(user);
    },
  });

  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex h-screen w-screen flex-row">
      {authUser && (
        <Sidebar
          id="sidebar"
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          user={authUser}
        />
      )}
      <ChatList />
    </div>
  );
};

export default Dashboard;
