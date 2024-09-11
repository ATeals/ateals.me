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
import { MouseEvent, useState } from "react";
import { DocumentBuilder } from "@/service/mdx";
import { CommandItem } from "@/components/Command/CommandItem";
import { useQueryParams } from "@/hooks/useQueryParams";

import { FaCheck } from "react-icons/fa6";
import { GrClearOption } from "react-icons/gr";
import { IoFilter } from "react-icons/io5";

export const CMDK = () => {
  const { isOpen, setOpen } = useOpenCmd();
  const { search, setSearch, results } = useSearchDocuments();

  const [mode, setMode] = useState<"default" | "tag">("default");

  useCmdK(() => setOpen((isOpen) => !isOpen));

  const handleExit = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  const handleESC = () => {
    if (mode === "default") setOpen(false);
    else setMode("default");
  };

  return (
    <Command.Dialog
      className="fixed top-0 left-0 w-full h-full justify-center items-center"
      open={isOpen}
      shouldFilter={false}
      onOpenChange={handleESC}
      label="Global Command Menu"
      onClick={handleExit}
    >
      <div className="shadow-lg m-auto md:max-w-[800px] md:w-2/3 mt-10 md:mt-20 h-full md:h-2/3 rounded-lg border p-2 bg-white dark:bg-dark-bg dark:border-black">
        <div className="flex relative justify-between gap-2">
          <Command.Input
            className="w-full p-2 focus:outline-none bg-inherit"
            placeholder="search"
            value={search}
            onValueChange={setSearch}
          />
          <Button className="" size={"sm"} variant={"ghost"} onClick={handleESC}>
            {mode === "default" ? "ESC" : "BACK"}
          </Button>
        </div>

        <Separator className="mb-2" />

        <Command.List className="overflow-scroll h-[90%]">
          <Empty />

          {mode === "default" && search === "" && (
            <>
              <Command.Group heading="Commands">
                <ThemeItem onSelect={() => setOpen(false)} />
                <FilterItem onSelect={() => setMode("tag")} />
                <GitHubItem />
              </Command.Group>
              <RecentPostGroup onSelect={() => setOpen(false)} />
            </>
          )}

          {mode === "default" && <PostItemList results={results} search={search} onSelect={() => setOpen(false)} />}
          {mode === "tag" && <TagItemList matcher={search} />}
        </Command.List>
      </div>
    </Command.Dialog>
  );
};

const FilterItem = ({ onSelect }: { onSelect: () => void }) => {
  return (
    <CommandItem className="flex justify-between items-center" onSelect={onSelect}>
      <span className="font-normal">Filter Tags</span>
      <IoFilter className="text-lg font-bold" />
    </CommandItem>
  );
};

const TagItemList = ({ matcher }: { matcher: string }) => {
  const tags = new DocumentBuilder().getAllTags();
  const query = useQueryParams();

  const current = query.get<string[]>("tags") || [];

  return (
    <div>
      {current.length > 0 && (
        <CommandItem onSelect={() => query.route("replace", query.stringify(["tags", ""]))} asChild>
          <div className="font-medium flex justify-between items-center">
            <span>Clear Tags</span>
            <GrClearOption className="text-lg font-bold" />
          </div>
        </CommandItem>
      )}
      <ul className="grid grid-cols-2 gap-2">
        {tags
          .filter((tag) => tag.toLocaleLowerCase().includes(matcher.toLocaleLowerCase()))
          .map((tag) => (
            <CommandItem
              key={tag}
              className={current.includes(tag) ? "bg-secondary-md bg-opacity-20 flex justify-between items-center" : ""}
              onSelect={() => {
                console.log(tag);
                query.route("replace", query.set("tags", tag));
              }}
              asChild
            >
              <li>
                <span className="font-medium"># {tag} </span>{" "}
                {current.includes(tag) && <FaCheck className="text-lg font-bold" />}
              </li>
            </CommandItem>
          ))}
      </ul>
    </div>
  );
};
