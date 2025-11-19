import { initializeApp } from "firebase-admin/app";

initializeApp();

export { createUser as handleAuthUserCreate } from "./auth/on-user-create";
export {
  checkUsernameAvailability,
  setUsername,
  getUsernameStatus,
} from "./api/usernames";
