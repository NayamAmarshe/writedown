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
  updateDoc,
  where,
} from "firebase/firestore";
import {
  IChannelEditData,
  IMessageData,
} from "@/types/utils/firebaseOperations";
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

  if (channelData.type === "public") {
    const publicRef = doc(db, "public", channelData.slug);
    await setDoc(publicRef, {
      channelId: channelData.id,
      userId: channelData.userId,
    });
  }

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
        updatedAt: serverTimestamp(),
        name: channelData.name,
        emoji: channelData.emoji,
        emojiBackground: channelData.emojiBackground,
        userId: userId,
        type: channelData.type,
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
      slug: channelData.slug,
      userId: userId,
    });
  } catch (error) {
    console.log("🚀 => file: operations.ts:37 => error", error);
  }
};

export const joinChannel = async (userId: string, channelId: string) => {
  if (!userId) return;

  const publicRef = doc(db, "public", channelId);
  const publicSnap = await getDoc(publicRef);

  const publicData = publicSnap.data();

  if (!publicData) return;

  const channelsRef = doc(
    db,
    "users",
    publicData.userId,
    "channels",
    publicData.channelId
  );
  const channelsSnap = await getDoc(channelsRef);

  const channelData = channelsSnap.data();

  if (!channelData) return;

  const selfChannelRef = doc(
    db,
    "users",
    userId,
    "channels",
    publicData.channelId
  );
  const selfChannelSnap = getDoc(selfChannelRef);

  try {
    // Create a document inside channelsRef array
    await setDoc(
      selfChannelRef,
      {
        id: channelData.id,
        createdAt: channelData.createdAt,
        updatedAt: channelData.updatedAt,
        name: channelData.name,
        emoji: channelData.emoji,
        emojiBackground: channelData.emojiBackground,
        userId: channelData.userId,
        type: channelData.type,
      },
      { merge: true }
    );

    await createNewMessage(channelData.id, userId, {
      id: uuidv4(),
      text: userId + " has joined!",
      type: "info",
      createdAt: serverTimestamp() as Timestamp,
      channelId: channelData.id,
      updated: false,
      slug: channelData.slug,
      userId: channelData.userId,
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

  const channelRef = doc(db, "users", userId, "channels", channelId);

  try {
    // Create a document inside channelsRef array
    await setDoc(messagesRef, messageData, { merge: true });
    await updateDoc(channelRef, {
      updatedAt: messageData.createdAt,
    });
    // await getMessagesByChannelId(channelId, userId);
  } catch (error) {
    console.log("🚀 => file: operations.ts:37 => error", error);
  }
};

export const editChannel = async (
  userId: string,
  channelId: string,
  updatedData: IChannelEditData
) => {
  if (!userId || !updatedData) return;

  const channelRef = doc(db, "users", userId, "channels", channelId);
  console.log(
    "🚀 => file: firebaseOperations.ts:159 => messageRef",
    channelRef
  );

  try {
    await updateDoc(channelRef, {
      name: updatedData.name,
      emoji: updatedData.emoji,
      emojiBackground: updatedData.emojiBackground,
      updatedAt: serverTimestamp() as Timestamp,
    });
  } catch (error) {
    console.log("🚀 => file: operations.ts:37 => error", error);
  }
};

export const deleteChannel = async (channelId: string, userId: string) => {
  if (!channelId || !userId) return;

  const channelRef = doc(db, "users", userId, "channels", channelId);
  console.log(
    "🚀 => file: firebaseOperations.ts:159 => messageRef",
    channelRef
  );

  try {
    await deleteDoc(channelRef);
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

export const editMessage = async (
  userId: string,
  channelId: string,
  messageId: string,
  updatedText: string
) => {
  if (!userId || !updatedText) return;

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
    await updateDoc(messageRef, {
      text: updatedText,
      updated: true,
    });
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
