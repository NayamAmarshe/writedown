import { useAuthState } from "react-firebase-hooks/auth";
import React, { useState } from "react";
import useUser from "../hooks/useUser";
import { auth } from "@/pages/_app";

const SetUsernameModal = ({
  setShowDashboard,
}: {
  showDashboard: boolean;
  setShowDashboard: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { setUsername, checkUsernameValidity } = useUser();
  const [text, setText] = useState<string>("");
  const [error, serError] = useState<boolean>(true);
  const [user] = useAuthState(auth);

  const onUsernameSet = async (username: string) => {
    if (!user) return;
    await setUsername(user, username);
    setShowDashboard(true);
  };
  const handleCheck = async () => {
    serError(!(await checkUsernameValidity(text)));
  };
  return (
    <div>
      <input
        type="text"
        className="text-black"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleCheck}>Check</button>
      {error && <p className="text-red-500">ERROR</p>}
      <button disabled={error} onClick={() => onUsernameSet(text)}>
        Set username
      </button>
    </div>
  );
};
export default SetUsernameModal;
