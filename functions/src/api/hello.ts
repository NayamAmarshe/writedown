import { onCall } from "firebase-functions/v2/https";

export const hello = onCall({ cors: true }, async () => {
  return { message: "Hello, world!" };
});
