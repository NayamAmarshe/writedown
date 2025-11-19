import { initializeApp } from "firebase-admin/app";

initializeApp();

export { handleAuthUserCreate } from "./auth/onUserCreate";
export { checkUsernameAvailability, setUsername } from "./https/usernames";
