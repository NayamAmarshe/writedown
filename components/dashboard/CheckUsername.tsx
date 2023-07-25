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
      undismissable
      saveHandler={handleSaveUsername}
    >
      {invalidUsername && (
        <p className="mb-2 text-sm text-red-500">
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
    </Modal>
  );
};
export default CheckUsername;
