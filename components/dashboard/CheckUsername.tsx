import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useUser from "../hooks/useUser";
import { auth } from "@/pages/_app";
import Modal from "../ui/Modal";
import Input from "../ui/Input";

const CheckUsername = () => {
  const { user, hasUsername, setUsername, checkUsernameValidity } = useUser();
  const [showUsernameModal, setShowUsernameModal] = useState(true);
  const [input, setInput] = useState("");
  const [invalidUsername, setInvalidUsername] = useState(false);

  useEffect(() => {
    (async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const userHasUsername = await hasUsername(user);
        if (userHasUsername) {
          setShowUsernameModal(false);
        }
      } catch (error) {
        console.log("Error checking username: ", error);
      }
    })();
  }, []);

  const onUsernameSet = async (username: string) => {
    if (!user) return;
    try {
      await setUsername(user.uid, username);
      setShowUsernameModal(false);
    } catch (error) {
      toast.error("Error setting username");
      setInvalidUsername(true);
    }
  };

  const handleSaveUsername = async () => {
    try {
      const isValid = await checkUsernameValidity(input);
      if (!isValid) {
        toast.error("Username is not valid");
        setInvalidUsername(true);
        return;
      }
      await onUsernameSet(input);
    } catch (error) {
      toast.error("Error checking username");
    }
  };

  return (
    <Modal
      isOpen={showUsernameModal}
      setIsOpen={setShowUsernameModal}
      saveText="Save"
      title="Set Username"
      description="Set a username to create your personal writedown space."
      saveHandler={handleSaveUsername}
      undismissable
    >
      {invalidUsername && (
        <p className="mb-2 text-sm text-red-400">
          Username is not valid or already taken
        </p>
      )}
      <Input
        id="username"
        placeholder="Username"
        value={input}
        small
        onChange={(e) => setInput(e.target.value)}
      />
      <p className="mt-4">Username must:</p>
      <ul className="m-4 list-disc text-xs leading-relaxed text-slate-300">
        <li>Begin with a lowercase letter (a-z).</li>
        <li>Combine lowercase letters (a-z) and digits (0-9).</li>
        <li className="leading-normal">
          Enhance with periods (.), underscores (_), or hyphens (-) between
          groups.
        </li>
      </ul>
    </Modal>
  );
};
export default CheckUsername;
