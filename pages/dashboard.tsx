import SetUsernameModal from "@/components/dashboard/SetUsernamModal";
import { useAuthState } from "react-firebase-hooks/auth";
import TextArea from "@/components/dashboard/TextArea";
import Sidebar from "@/components/dashboard/Sidebar";
import HeadTags from "@/components/common/HeadTags";
import React, { useEffect, useState } from "react";
import useUser from "@/components/hooks/useUser";
import Modal from "@/components/ui/Modal";
import { useRouter } from "next/router";
import { auth } from "./_app";

const Dashboard = () => {
  // NEXT ROUTER
  const router = useRouter();
  const { hasUsername } = useUser();

  const [showUsernameModal, setShowUsernameModal] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);

  // AUTH STATE HOOK
  useAuthState(auth, {
    onUserChanged: async (user) => {
      console.log("has no username");
      if (!user) {
        router.push("/login");
        return;
      }
      if (await hasUsername(user)) {
        console.log("has username");
        setShowUsernameModal(false);
      }
    },
  });

  useEffect(() => {
    (async () => {
      const user = auth.currentUser;
      if (user && !(await hasUsername(user))) {
        setShowUsernameModal(false);
      }
    })();
  }, []);

  return (
    <>
      <div className="relative flex h-screen w-screen flex-row bg-slate-200 text-gray-900 dark:bg-slate-800">
        <HeadTags
          title="Dashboard - writedown"
          description="A simple and beautiful notes app with cloud sync, markdown and offline support. Write, share, inspire."
          ogImage="https://writedown.app/og-image.png"
          ogUrl="https://writedown.app"
        />
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <TextArea shiftRight={showSidebar} setShiftRight={setShowSidebar} />
        <Modal isOpen={showUsernameModal} setIsOpen={setShowSidebar} />
      </div>
    </>
  );
};

export default Dashboard;
