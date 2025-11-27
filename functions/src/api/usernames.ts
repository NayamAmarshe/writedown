import { onCall, HttpsError } from "firebase-functions/v2/https";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { logger } from "../utils/logger";

const USERNAME_REGEX = /^[a-z][a-z0-9]*([._-][a-z0-9]+)*$/;

const isUsernameValid = (username: string) =>
  username.length >= 3 &&
  username.length <= 15 &&
  USERNAME_REGEX.test(username);

const db = getFirestore();

export const checkUsernameAvailability = onCall(
  { cors: true, timeoutSeconds: 60, region: ["us-central1"] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Authentication required.");
    }

    const requestedUsername = request.data?.username;
    logger.info("🚀 => requestedUsername:", requestedUsername);

    if (typeof requestedUsername !== "string") {
      throw new HttpsError(
        "invalid-argument",
        "Expected a username string in request data."
      );
    }

    const username = requestedUsername.trim();

    if (!isUsernameValid(username)) {
      return { available: false };
    }

    const usernameRef = db.collection("usernames").doc(username);
    const usernameDoc = await usernameRef.get();

    return { available: !usernameDoc.exists };
  }
);

export const setUsername = onCall({ cors: true }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required.");
  }

  const uid = request.auth.uid;
  const requestedUsername = request.data?.username;

  if (typeof requestedUsername !== "string") {
    throw new HttpsError(
      "invalid-argument",
      "Expected a username string in request data."
    );
  }

  const username = requestedUsername.trim();

  if (!isUsernameValid(username)) {
    throw new HttpsError("invalid-argument", "Username format is invalid.");
  }

  const usernameRef = db.collection("usernames").doc(username);
  const userRef = db.collection("users").doc(uid);

  try {
    await db.runTransaction(async (transaction) => {
      const usernameSnap = await transaction.get(usernameRef);
      const userSnap = await transaction.get(userRef);

      if (usernameSnap.exists && usernameSnap.data()?.uid !== uid) {
        throw new HttpsError(
          "already-exists",
          "Username is already taken by another user."
        );
      }

      let previousUsername: string | undefined;
      if (userSnap.exists) {
        previousUsername = userSnap.data()?.username;
      } else {
        transaction.set(userRef, { uid }, { merge: true });
      }

      if (previousUsername && previousUsername !== username) {
        const previousUsernameRef = db
          .collection("usernames")
          .doc(previousUsername);
        transaction.delete(previousUsernameRef);
      }

      const userData = userSnap.data() ?? {};
      const publicProfile = {
        uid,
        displayName:
          userData.displayName ?? request?.auth?.token?.name ?? "Anonymous",
        photoURL: userData.photoURL ?? request?.auth?.token?.picture ?? "",
        bio: userData.bio ?? "",
      };

      transaction.set(usernameRef, publicProfile);

      transaction.set(
        userRef,
        {
          username,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    });

    logger.info("Username set successfully", { uid, username });

    return { username };
  } catch (error) {
    if (error instanceof HttpsError) {
      logger.warn("Failed to set username", {
        uid,
        username,
        code: error.code,
      });
      throw error;
    }

    const err = error as Error;
    logger.error("Failed to set username", {
      uid,
      username,
      error: err.message,
    });

    throw new HttpsError(
      "internal",
      "Unexpected error while setting username."
    );
  }
});

export const getUsernameStatus = onCall({ cors: true }, async (request) => {
  const uid = request.data?.uid ?? request.auth?.uid;

  if (!uid) {
    throw new HttpsError("unauthenticated", "Authentication required.");
  }

  const userRef = db.collection("users").doc(uid);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    return { hasUsername: false, username: null };
  }

  const username = userSnap.data()?.username ?? null;

  return {
    hasUsername: Boolean(username),
    username,
  };
});
