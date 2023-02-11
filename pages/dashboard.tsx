import { useAuthState } from "react-firebase-hooks/auth";
import { createUser } from "@/utils/operations";
import ChatList from "@/components/ChatList";
import { firebaseApp } from "@/lib/firebase";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { getAuth } from "firebase/auth";
import { auth } from "./_app";
import React from "react";

const Dashboard = () => {
  // AUTH STATE HOOK
  const [authUser, authLoading, authError] = useAuthState(auth, {});

  return (
    <div className="flex h-screen w-screen flex-row">
      <Sidebar />
      <ChatList />
    </div>
  );
};

export default Dashboard;
