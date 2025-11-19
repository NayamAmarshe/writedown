import {
  DocumentReference,
  DocumentSnapshot,
  FirestoreError,
  Query,
  QuerySnapshot,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";

type DocumentDataState<T> = readonly [
  T | undefined,
  boolean,
  FirestoreError | null,
  DocumentSnapshot<T> | null,
];

type CollectionDataState<T> = readonly [
  T[] | undefined,
  boolean,
  FirestoreError | null,
  QuerySnapshot<T> | null,
];

export const useDocumentData = <T>(
  reference: DocumentReference<T> | null
): DocumentDataState<T> => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(Boolean(reference));
  const [error, setError] = useState<FirestoreError | null>(null);
  const [snapshot, setSnapshot] = useState<DocumentSnapshot<T> | null>(null);

  useEffect(() => {
    if (!reference) {
      setData(undefined);
      setSnapshot(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      reference,
      (snapshot) => {
        setData(snapshot.data());
        setSnapshot(snapshot);
        setError(null);
        setLoading(false);
      },
      (snapshotError: FirestoreError) => {
        setError(snapshotError);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [reference]);

  return [data, loading, error, snapshot];
};

export const useCollectionData = <T>(
  queryRef: Query<T> | null
): CollectionDataState<T> => {
  const [data, setData] = useState<T[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(Boolean(queryRef));
  const [error, setError] = useState<FirestoreError | null>(null);
  const [snapshot, setSnapshot] = useState<QuerySnapshot<T> | null>(null);

  useEffect(() => {
    if (!queryRef) {
      setData(undefined);
      setSnapshot(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      queryRef,
      (snapshot) => {
        setData(snapshot.docs.map((docSnapshot) => docSnapshot.data()));
        setSnapshot(snapshot);
        setError(null);
        setLoading(false);
      },
      (snapshotError: FirestoreError) => {
        setError(snapshotError);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [queryRef]);

  return [data, loading, error, snapshot];
};
