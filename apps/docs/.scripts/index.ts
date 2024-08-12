import { writeFileSync } from "fs";
import { DocsManager, FileEvent } from "./DocsManager";
import { Utils } from "./utils";

const EXCLUDES_DIR = [".obsidian", "_template", "hello"];

const fileEvents: FileEvent[] = [
  {
    fileExt: "md",
    handler: (destFile: string): string => {
      destFile = Utils.convertToMdx(destFile);

      const arr = destFile.split("/");

      if (arr.length < 1) return encodeURI(destFile);

      const last = encodeURIComponent(arr.at(-1) as string);

      return destFile
        .split("/")
        .map((x) => encodeURIComponent(x))
        .join("/");
    },
  },
];

const manager = new DocsManager({
  input: "../../documents/docs",
  output: "./pages",
  excludes: EXCLUDES_DIR,
  fileEvents,
});

manager
  .cleanOutput()
  .makeDocs()
  .makeDocs({
    options: {
      input: "../../documents/snapshots",
      output: "./pages",
      excludes: EXCLUDES_DIR,
    },
    fileEvents,
  });
