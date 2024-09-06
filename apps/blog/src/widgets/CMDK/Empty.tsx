import { Command } from "cmdk";

export const Empty = () => {
  return (
    <Command.Empty className="w-full h-full flex justify-center items-center">
      <span className="text-gray-500">No results found</span>
    </Command.Empty>
  );
};
