import { useAuthState } from "react-firebase-hooks/auth";
import { createUser } from "@/utils/operations";
import ChatList from "@/components/ChatList";
import { firebaseApp } from "@/lib/firebase";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { getAuth } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./_app";

const Dashboard = () => {
  // AUTH STATE HOOK
  const [authUser, authLoading, authError] = useAuthState(auth, {});
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex h-screen w-screen flex-row">
      <Sidebar
        id="sidebar"
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        user={authUser}
        userError={authError}
        userLoading={authLoading}
      />
      <ChatList />
    </div>
  );
};

export default Dashboard;
