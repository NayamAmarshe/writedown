import { User } from "firebase/auth";

export interface IFirebaseAuth {
  user?: User | null;
  userLoading?: boolean;
  userError?: Error;
}
