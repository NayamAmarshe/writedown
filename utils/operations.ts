// Firebase v9 function to store data in users collection
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { IChannelData } from "@/types/utils/operations";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";

export const createUser = async (user: User) => {
  // Store user data in users collection
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    photoURL: user.photoURL,
    displayName: user.displayName,
    createdAt: new Date().toISOString(),
  });
};

export const getChannelsByUserId = async (userId: string) => {
  if (!userId) return;

  // Get channels with userId as id
  const channels = await getDocs(collection(db, "channels", userId));

  return channels.docs.map((channel) => channel.data() as IChannelData);
};

export const createChannel = async (
  userId: string,
  channelData: {
    name: string;
  }
) => {
  if (!userId) return;

  // Get channels
  const channels = await getChannelsByUserId(userId);
  console.log("🚀 => file: operations.ts:37 => channels", channels);

  // Store channel data in channels collection
  await setDoc(doc(db, "channels", userId), {
    ...channelData,
    createdAt: new Date().toISOString(),
  });
};
