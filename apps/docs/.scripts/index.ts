import { DocsManager } from "./DocsManager";
import { Utils } from "./utils";

const EXCLUDES_DIR = [".obsidian", "_template", "hello"];

const manager = new DocsManager({
  input: "../../documents/docs",
  output: "./pages",
  excludes: EXCLUDES_DIR,
  fileEvents: [
    {
      fileExt: "md",
      handler: (destFile: string): string => {
        destFile = Utils.convertToMdx(destFile);

        return destFile
          .split("/")
          .map((x) => encodeURIComponent(x))
          .join("/");
      },
    },
  ],
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
    fileEvents: [
      {
        fileExt: "md",
        handler: (destFile: string): string => {
          destFile = Utils.convertToMdx(destFile);

          return destFile
            .split("/")
            .map((x) => encodeURIComponent(x))
            .join("/");
        },
      },
    ],
  });
