"use client";

import SetUsernameDialog from "@/components/dashboard/set-username-dialog";
import TextArea from "@/components/dashboard/text-area";
import Sidebar from "@/components/dashboard/side-bar";
import { useEffect, useState } from "react";
import useUser from "@/components/hooks/useUser";
import { auth } from "@/lib/firebase";
import { showSidebarAtom } from "@/lib/atoms/user-data-atom";
import { useAtom } from "jotai";

const Dashboard = () => {
  const { user, hasUsername } = useUser();

  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showSidebar, setShowSidebar] = useAtom(showSidebarAtom);

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

  return (
    <>
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <TextArea shiftRight={showSidebar} setShiftRight={setShowSidebar} />
      <SetUsernameDialog
        show={showUsernameModal}
        onSetShow={(state) => {
          setShowUsernameModal(state);
        }}
      />
    </>
  );
};

export default Dashboard;
