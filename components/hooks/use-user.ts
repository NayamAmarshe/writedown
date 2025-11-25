import { FirebaseError } from "firebase/app";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  AuthProvider,
  User,
  UserCredential,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { userDocConverter } from "@/lib/firestoreDataConverter";
import { db, auth, functions } from "@/lib/firebase";
import { useCallback, useEffect, useState } from "react";
import type { UserDocument } from "../../lib/types/db";

type ProviderHookState = readonly [
  () => Promise<UserCredential | null>,
  UserCredential | null,
  boolean,
  FirebaseError | null,
];

export const useSignInWithProvider = (
  provider: AuthProvider
): ProviderHookState => {
  const [credential, setCredential] = useState<UserCredential | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirebaseError | null>(null);

  const signIn = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, provider);
      setCredential(result);
      return result;
    } catch (signInError) {
      setCredential(null);
      setError(signInError as FirebaseError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [auth, provider]);

  return [signIn, credential, loading, error];
};

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userDocument, setUserDocument] = useState<UserDocument | null>(null);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) return;
    const userDocumentRef = doc(db, "users", user.uid).withConverter(
      userDocConverter
    );
    const unsubscribe = onSnapshot(
      userDocumentRef,
      (snapshot) => {
        setUserDocument(snapshot.data() as UserDocument);
      },
      (error) => {
        console.error(error);
        setUserDocument(null);
      },
      () => {
        setIsUserLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    setIsUserLoading(true);
    const unsubscribe = onAuthStateChanged(
      auth,
      async (nextUser) => {
        setUser(nextUser);
        setIsUserLoading(false);
      },
      (authError) => {
        console.error(authError);
        setUser(null);
        setIsUserLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [auth]);

  /**
   * Set username for the authenticated user via Cloud Function.
   * @param userName
   */
  const setUsername = useCallback(
    async (userName: string) => {
      const trimmedUsername = userName.trim();
      if (!trimmedUsername) {
        throw new Error("Username not provided");
      }

      const callable = httpsCallable<
        { username: string },
        { username: string }
      >(functions, "setUsername");
      await callable({ username: trimmedUsername });
    },
    [functions]
  );

  /**
   * Check if a username is available
   * @param userName
   */
  const checkUsernameValidity = useCallback(
    async (userName: string) => {
      const trimmedUsername = userName.trim();
      if (!trimmedUsername) return false;

      const callable = httpsCallable<
        { username: string },
        { available: boolean }
      >(functions, "checkUsernameAvailability");

      const response = await callable({ username: trimmedUsername });
      return !!response.data.available;
    },
    [functions]
  );

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // Open popup immediately without async delay to prevent Safari blocking
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential === null) throw new Error("Credential is null");
      return {
        success: true,
        user: result.user,
      };
    } catch (error: any) {
      console.error("Error in Google sign in:", error);

      // Handle popup blocked error specifically
      if (error.code === "auth/popup-blocked") {
        return {
          success: false,
          error:
            "Popup was blocked by your browser. Please allow popups for this site or try again.",
        };
      }

      if (error.message.includes("auth/popup-closed-by-user")) {
        return {
          success: false,
          error: "Google sign in cancelled",
        };
      }

      return {
        success: false,
        error: error.message || "Google sign in failed",
      };
    }
  };

  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return {
        success: true,
        user: result.user,
      };
    } catch (error: any) {
      console.error("Error in Github sign in:", error);
      return {
        success: false,
        error: error.message || "Github sign in failed",
      };
    }
  };

  return {
    user,
    isUserLoading,
    /** The user document with public details */
    userDocument,
    setUsername,
    checkUsernameValidity,
    signInWithGoogle,
    signInWithGithub,
  };
};

export default useUser;
