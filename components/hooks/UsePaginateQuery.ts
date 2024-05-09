import {
  startAfter,
  query,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Query } from "firebase/firestore";

const usePaginateQuery = (queryFn: () => Query, pageLoaded: boolean) => {
  const [data, setData] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const isMountedRef = useRef(false);
  const lastItemRef = useRef<any>(null);
  const [isLoading, setisLoading] = useState<boolean>();
  const [errorMsg, setErrorMsg] = useState();

  const resetStates = () => {
    setData([]);
    setisLoading(false);
  };

  useEffect(() => {
    if (isMountedRef.current === true) return;

    async function fetchQuery() {
      try {
        isMountedRef.current = true;
        setisLoading(true);
        const q = query(queryFn());
        const querySnapshot = await getDocs(q);
        setData([...querySnapshot.docs]);
        lastItemRef.current = querySnapshot.docs[querySnapshot.docs.length - 1];
        setisLoading(false);
      } catch (error: any) {
        resetStates();
        setErrorMsg(error.code);
      }
    }
    fetchQuery();
  }, [queryFn]);

  const more = useCallback(async () => {
    try {
      setisLoading(true);
      const next = query(queryFn(), startAfter(lastItemRef.current));
      const querySnapshot = await getDocs(next);
      setData([...data, ...querySnapshot.docs]);
      lastItemRef.current = querySnapshot.docs[querySnapshot.docs.length - 1];
      setisLoading(false);
    } catch (error: any) {
      resetStates();
      setErrorMsg(error.code);
    }
  }, [data, queryFn]);

  return useMemo(() => {
    return {
      more,
      isLoading,
      data: data ? data : [],
      errorMsg,
    };
  }, [more, isLoading, data, errorMsg]);
};

export default usePaginateQuery;
