// Firebase v9 function to store data in users collection
import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { IMessageData } from "@/types/utils/firebaseOperations";
import { IChannelData } from "@/types/utils/firebaseOperations";
import { collection } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
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
        userId: userId,
      },
      { merge: true }
    );

    await createNewMessage(channelData.id, userId, {
      id: uuidv4(),
      text: "New Channel Created!",
      type: "info",
      createdAt: serverTimestamp() as Timestamp,
      channelId: channelData.id,
      updated: false,
    });
  } catch (error) {
    console.log("🚀 => file: operations.ts:37 => error", error);
  }
};

export const createNewMessage = async (
  channelId: string,
  userId: string,
  messageData: IMessageData
) => {
  if (!channelId || !userId) return;

  const messagesRef = doc(
    db,
    "users",
    userId,
    "channels",
    channelId,
    "messages",
    messageData.id
  );

  try {
    // Create a document inside channelsRef array
    await setDoc(messagesRef, messageData, { merge: true });
    // await getMessagesByChannelId(channelId, userId);
  } catch (error) {
    console.log("🚀 => file: operations.ts:37 => error", error);
  }
};

export const getMessagesByChannelId = async (
  channelId: string,
  userId: string
) => {
  if (!channelId || !userId) return;

  const messagesRef = collection(
    db,
    "users",
    userId,
    "channels",
    channelId,
    "messages"
  );

  const messagesSnap = await getDocs(
    query(messagesRef, where("channelId", "==", channelId), limit(10))
  );

  if (messagesSnap) {
    return messagesSnap.docs;
  } else {
    console.log("No such document!");
  }

  return [];
};

export const editMessage = async (userId: string, message: IMessageData) => {
  if (!userId || !message) return;

  const messageRef = doc(
    db,
    "users",
    userId,
    "channels",
    message.channelId,
    "messages",
    message.id
  );
  console.log(
    "🚀 => file: firebaseOperations.ts:159 => messageRef",
    messageRef
  );

  try {
    await setDoc(messageRef, message);
  } catch (error) {
    console.log("🚀 => file: operations.ts:37 => error", error);
  }
};

export const deleteMessage = async (
  channelId: string,
  userId: string,
  messageId: string
) => {
  if (!channelId || !userId || !messageId) return;

  const messageRef = doc(
    db,
    "users",
    userId,
    "channels",
    channelId,
    "messages",
    messageId
  );
  console.log(
    "🚀 => file: firebaseOperations.ts:159 => messageRef",
    messageRef
  );

  try {
    await deleteDoc(messageRef);
  } catch (error) {
    console.log("🚀 => file: operations.ts:37 => error", error);
  }
};
