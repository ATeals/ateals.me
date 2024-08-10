import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";

export const useQueryParams = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const path = usePathname();

  const get = (key: string) => searchParams.get(key) || undefined;

  const stringify = useCallback(
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

  const set = (modifier: keyof typeof router, query: string) => {
    router[modifier](`${path}?${query}`);
  };

  const clear = () => {
    router.replace(path);
  };

  return {
    get,
    stringify,
    set,
    clear,
  } as const;
};
