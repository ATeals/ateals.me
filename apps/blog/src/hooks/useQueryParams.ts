import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";

export const useQueryParams = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const path = usePathname();

  const get = <T extends string | string[] = string>(key: string): T | undefined => {
    const current = searchParams.get(key);
    if (!current) return undefined;

    const array = current.split(",");
    return (array.length > 1 ? array : array[0]) as T;
  };

  const stringify = useCallback(
    (...params: [string, string | string[]][]) => {
      const query = new URLSearchParams(searchParams.toString());

      return updateQuery(query, params);
    },
    [searchParams]
  );

  const set = (target: string, value: string | string[]) => {
    const query = new URLSearchParams(searchParams.toString());

    const current = query.get(target)?.split(",") || [];

    const updated = Array.isArray(value)
      ? value
      : current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

    return updateQuery(query, [[target, updated]]);
  };

  const route = (modifier: keyof typeof router, query: string) => {
    router[modifier](`${path}?${query}`);
  };

  const clear = () => {
    router.replace(path);
  };

  return {
    get,
    stringify,
    route,
    set,
    clear,
  } as const;
};

const updateQuery = (query: URLSearchParams, params: [string, string | string[]][]) => {
  for (const [key, value] of params) {
    if (value === "" || (Array.isArray(value) && value.length === 0)) {
      query.delete(key);
      continue;
    }

    const string = Array.isArray(value) ? value.join(",") : value;
    query.set(key, string);
  }

  return query.toString();
};
