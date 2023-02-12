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
  const [authUser] = useAuthState(auth, {});
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
