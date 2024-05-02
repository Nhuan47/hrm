import { useEffect, useState } from "react";
import axios from "@/shared/services/axios-instance";

export const useFetch = (url, options) => {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const listDependencies = options?.dependencies || [];

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      try {
        setIsFetching(true);
        const { data: response } = await axios.get(url, { signal });

        if (response?.status === 200) {
          setData(response?.data);
        } else {
          setError(
            `HTTP error! Status: ${response?.status} - ${response?.message}`
          );
        }
      } catch (err) {
        if (!err?.code === "ERR_CANCELED") {
          setError(err);
        }
      } finally {
        setIsFetching(false);
      }
    })();

    return () => {
      // Cancel the request when the component unmounts
      controller.abort();
    };
  }, listDependencies);

  return { isFetching, error, data };
};
