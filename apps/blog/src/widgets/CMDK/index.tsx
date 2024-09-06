"use client";

import { Button, Separator } from "@/components/ui";
import { useCmdK, useOpenCmd } from "@/hooks/useCmdK";
import { useSearchDocuments } from "@/hooks/useSearchDocuments";
import { Command } from "cmdk";
import { Empty } from "./Empty";
import { GitHubItem } from "./GitHubItem";
import { ThemeItem } from "./ThemeItem";
import { PostItemList } from "./PostItemList";
import { RecentPostGroup } from "./RecentPostGroup";
import { MouseEvent } from "react";

export const CMDK = () => {
  const { isOpen, setOpen } = useOpenCmd();
  const { search, setSearch, results } = useSearchDocuments();

  useCmdK(() => setOpen((isOpen) => !isOpen));

  const handleExit = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  return (
    <Command.Dialog
      className="fixed top-0 left-0 w-full h-full justify-center items-center"
      open={isOpen}
      shouldFilter={false}
      onOpenChange={setOpen}
      label="Global Command Menu"
      onClick={handleExit}
    >
      <div className="shadow-lg m-auto lg:max-w-[800px] lg:w-2/3 mt-10 lg:mt-20 h-full lg:h-2/3 rounded-lg border p-2 bg-white dark:bg-dark-bg">
        <div className="flex relative justify-between gap-2">
          <Command.Input
            className="w-full p-2 focus:outline-none bg-inherit"
            placeholder="search"
            value={search}
            onValueChange={setSearch}
          />
          <Button className="" size={"sm"} variant={"ghost"} onClick={() => setOpen(false)}>
            ESC
          </Button>
        </div>

        <Separator className="mb-2" />

        <Command.List className="overflow-scroll h-[90%]">
          <Empty />

          {search === "" && (
            <>
              <Command.Group heading="Commands">
                <ThemeItem onSelect={() => setOpen(false)} />
                <GitHubItem />
              </Command.Group>
              <RecentPostGroup onSelect={() => setOpen(false)} />
            </>
          )}

          <PostItemList results={results} search={search} onSelect={() => setOpen(false)} />
        </Command.List>
      </div>
    </Command.Dialog>
  );
};
