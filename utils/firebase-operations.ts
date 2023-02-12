// Firebase v9 function to store data in users collection
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { IMessageData } from "@/types/utils/firebase-operations.d";
import { IChannelData } from "@/types/utils/firebase-operations";
import { uuidv4 } from "@firebase/util";
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

  const channelsRef = doc(db, "channels", userId);
  const channelsSnap = await getDoc(channelsRef);

  if (channelsSnap.exists()) {
    console.log("Document data:", channelsSnap.data());
    return channelsSnap.data();
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
    await setDoc(channelsRef, []);
  }

  // return channels.docs.map((channel) => channel.data() as IChannelData);
  return [];
};

export const createChannel = async (
  userId: string,
  channelData: IChannelData
) => {
  if (!userId) return;

  const channelsRef = doc(db, "users", userId, "channels", channelData.id);
  const channelsSnap = await getDoc(channelsRef);
  console.log("🚀 => file: operations.ts:54 => channelsSnap", channelsSnap);

  try {
    // Create a document inside channelsRef array
    await setDoc(
      channelsRef,
      {
        id: channelData.id,
        createdAt: serverTimestamp(),
        name: channelData.name,
        emoji: channelData.emoji,
        emojiBackground: channelData.emojiBackground,
      },
      { merge: true }
    );

    await createNewMessage(channelData.id, userId, {
      id: uuidv4(),
      text: "New Channel Created!",
      type: "info",
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.log("🚀 => file: operations.ts:37 => error", error);
  }
};

const createNewMessage = async (
  channelId: string,
  userId: string,
  messageData: IMessageData
) => {
  const messagesRef = doc(
    db,
    "users",
    userId,
    "channels",
    channelId,
    "messages",
    uuidv4()
  );

  try {
    // Create a document inside channelsRef array
    await setDoc(messagesRef, messageData, { merge: true });
  } catch (error) {
    console.log("🚀 => file: operations.ts:37 => error", error);
  }
};
