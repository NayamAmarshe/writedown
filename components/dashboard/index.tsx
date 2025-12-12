"use client";

import SetUsernameDialog from "@/components/dashboard/set-username-dialog";
import TextArea from "@/components/dashboard/text-area";
import Sidebar from "@/components/dashboard/side-bar";
import { useEffect, useState } from "react";
import useUser from "@/components/hooks/use-user";
import { showSidebarAtom } from "@/lib/atoms/user-data-atom";
import { useAtom } from "jotai";

const Dashboard = () => {
  const { user, userDocument } = useUser();

  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showSidebar, setShowSidebar] = useAtom(showSidebarAtom);

  useEffect(() => {
    if (!user) return;
    try {
      const userHasUsername = userDocument?.username;
      if (!userHasUsername) {
        setShowUsernameModal(true);
      }
    } catch (error) {
      console.log("Error checking username: ", error);
    }
  }, [userDocument]);

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
