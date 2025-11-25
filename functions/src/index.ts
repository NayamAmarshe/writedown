import { getApps, initializeApp } from "firebase-admin/app";

if (!getApps().length) {
  initializeApp();
}

export { hello } from "./api/hello";
export { createUser } from "./auth/on-user-create";
export {
  checkUsernameAvailability,
  getUsernameStatus,
  setUsername,
} from "./api/usernames";
