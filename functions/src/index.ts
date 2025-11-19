import { initializeApp } from "firebase-admin/app";

initializeApp();

export { handleAuthUserCreate } from "./auth/on-user-create";
export { checkUsernameAvailability, setUsername } from "./api/usernames";
