import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";

export const useQueryParams = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const path = usePathname();

  const getQueryParam = (key: string) => searchParams.get(key) || undefined;

  const generateQueryToString = useCallback(
    (...params: [string, string][]) => {
      const query = new URLSearchParams(searchParams.toString());

      for (let [key, value] of params) {
        query.set(key, value);

        if (value === "") query.delete(key);
      }

      return query.toString();
    },
    [searchParams]
  );

  const pushQueryParams = (...params: [string, string][]) => {
    const query = generateQueryToString(...params);

    router.push(`${path}?${query}`);
  };

  const clearQueryParams = () => {
    router.replace(path);
  };

  return [getQueryParam, generateQueryToString, pushQueryParams, clearQueryParams] as const;
};
