import { onCall, HttpsError } from "firebase-functions/v2/https";
import { FieldValue } from "firebase-admin/firestore";
import db from "../utils/db";
import { logger } from "../utils/logger";

const REGION = "us-central1";

const USERNAME_REGEX = /^[a-z][a-z0-9]*([._-][a-z0-9]+)*$/;

const sanitizeUsername = (username: string) => username.trim();

const isUsernameValid = (username: string) =>
  username.length >= 3 &&
  username.length <= 15 &&
  USERNAME_REGEX.test(username);

export const checkUsernameAvailability = onCall(
  { region: REGION },
  async (request) => {
    const requestedUsername = request.data?.username;

    if (typeof requestedUsername !== "string") {
      throw new HttpsError(
        "invalid-argument",
        "Expected a username string in request data."
      );
    }

    const username = sanitizeUsername(requestedUsername);

    if (!isUsernameValid(username)) {
      return { available: false };
    }

    const usernameRef = db.collection("usernames").doc(username);
    const usernameDoc = await usernameRef.get();

    return { available: !usernameDoc.exists };
  }
);

export const setUsername = onCall({ region: REGION }, async (request) => {
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

  const username = sanitizeUsername(requestedUsername);

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

      transaction.set(usernameRef, {
        uid,
        updatedAt: FieldValue.serverTimestamp(),
      });

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

export const getUsernameStatus = onCall({ region: REGION }, async (request) => {
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
