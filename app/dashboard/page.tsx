"use client";

import SetUsernameDialog from "@/components/dashboard/set-username-dialog";
import { useAuthState } from "react-firebase-hooks/auth";
import TextArea from "@/components/dashboard/text-area";
import Sidebar from "@/components/dashboard/side-bar";
import HeadTags from "@/components/common/head-tags";
import { useEffect, useState } from "react";
import useUser from "@/components/hooks/useUser";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

const Dashboard = () => {
  // NEXT ROUTER
  const router = useRouter();

  const { user, hasUsername } = useUser();

  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    (async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const userHasUsername = await hasUsername(user);
        if (!userHasUsername) {
          setShowUsernameModal(true);
        }
      } catch (error) {
        console.log("Error checking username: ", error);
      }
    })();
  }, [user]);

  // AUTH STATE HOOK
  useAuthState(auth, {
    onUserChanged: async (user) => {
      console.log("🚀 => user:", user);

      if (!user) {
        router.push("/login");
        return;
      }
    },
  });

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
        <SetUsernameDialog
          show={showUsernameModal}
          onSetShow={(state) => {
            setShowUsernameModal(state);
          }}
        />
      </div>
    </>
  );
};

export default Dashboard;
