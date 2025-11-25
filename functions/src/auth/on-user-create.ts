import {
  AuthBlockingEvent,
  HttpsError,
  beforeUserCreated,
} from "firebase-functions/v2/identity";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { logger } from "../utils/logger";

export const createUser = beforeUserCreated(
  async (event: AuthBlockingEvent) => {
    const user = event.data;
    logger.info("Creating user", { user });

    if (!user) {
      logger.warn("Auth blocking event missing user payload.");
      throw new HttpsError(
        "invalid-argument",
        "Missing user data in beforeUserCreated event."
      );
    }

    const db = getFirestore();
    const batch = db.batch();

    const userRef = db.collection("users").doc(user.uid);
    batch.set(
      userRef,
      {
        uid: user.uid,
        photoURL: user.photoURL ?? "",
        displayName: user.displayName ?? "",
        updatedAt: FieldValue.serverTimestamp(),
        email: user.email ?? "",
        createdAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    try {
      await batch.commit();
      logger.info("Created user profile", { uid: user.uid });
    } catch (error) {
      const err = error as Error;
      logger.error("Failed to create user profile", {
        uid: user.uid,
        error: err.message,
      });
      throw new HttpsError(
        "internal",
        "Failed to provision Firestore profile for new user."
      );
    }
  }
);
