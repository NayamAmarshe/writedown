import {
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";

export const dataConverter = <T>(dataType: T): FirestoreDataConverter<T> => {
  return {
    toFirestore: (data: T): DocumentData => {
      return data as DocumentData;
    },
    fromFirestore: (
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
    ): T => {
      const data = snapshot.data(options) as T;
      return { ...data, id: snapshot.id };
    },
  };
};
