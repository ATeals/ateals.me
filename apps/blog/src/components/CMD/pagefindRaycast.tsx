import { useStore } from '@nanostores/react';
import { useEffect, useRef, useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { MdOutlineSettings } from 'react-icons/md';
import { MdLightMode } from 'react-icons/md';
import { MdDarkMode } from 'react-icons/md';

import { applyNextTheme, themeStore } from '@/components/Theme/store';
import { Badge } from '@/components/ui/badge';
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import { SITE } from '@/consts';
import { pagefindSearch, type PagefindSearchData } from '@/lib/pagefind';

export function PagefindRaycast() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [resultList, setResultList] = useState<PagefindSearchData[]>([]);

  useEffect(() => {
    const toggle = () => setOpen((open) => !open);
    document.addEventListener('openSearch', toggle);
    return () => document.removeEventListener('openSearch', toggle);
  }, []);

  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  async function search(value: string) {
    try {
      const searchDataList = await pagefindSearch(value);
      setResultList(searchDataList);
    } catch (e: unknown) {
      console.log(e);
    }
  }

  function navigateToResult(value: PagefindSearchData) {
    const location = new URL(value.url, window.location.toString());
    window.location.href = location.href;
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput ref={inputRef} placeholder="Type a command or search..." onValueChange={search} />
      <CommandList className="h-[400px] overflow-y-scroll">
        {resultList.length === 0 && (
          <>
            <ThemeCommandItem />
            <GithubCommandItem />
          </>
        )}
        {resultList.length === 0 && (
          <CommandEmpty className="py-2 text-center animate-in fade-in">No results found.</CommandEmpty>
        )}
        {resultList.map((result) => {
          return (
            <CommandItem key={result.id} onSelect={() => navigateToResult(result)} className="animate-in fade-in">
              <div>{result.meta.title}</div>
            </CommandItem>
          );
        })}
      </CommandList>
      <CommandSeparator />

      <div cmdk-raycast-open-trigger="" className="flex w-full items-center justify-end gap-2 p-2 text-sm">
        {resultList.length > 0 ? (
          <>
            Open Page
            <Badge>
              <kbd>↵</kbd>
            </Badge>
          </>
        ) : (
          <>
            Open Command
            <Badge>
              <kbd>↵</kbd>
            </Badge>
          </>
        )}
      </div>
    </CommandDialog>
  );
}

const GithubCommandItem = () => {
  return (
    <CommandItem className="justify-between" onSelect={() => window.open(SITE.author.github, '_blank')}>
      <span>Open Github</span> <FaGithub />
    </CommandItem>
  );
};

const ThemeCommandItem = () => {
  const theme = useStore(themeStore);

  const nextTheme = !applyNextTheme(theme) ? 'system' : applyNextTheme(theme);

  return (
    <CommandItem className="justify-between" onSelect={() => themeStore.set(applyNextTheme(theme))}>
      <span>
        Change Theme to <strong className="font-normal">{nextTheme}</strong>
      </span>

      {nextTheme === 'system' && <MdOutlineSettings />}
      {nextTheme === 'light' && <MdLightMode />}
      {nextTheme === 'dark' && <MdDarkMode />}
    </CommandItem>
  );
};
