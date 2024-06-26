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
        return Utils.hashFileName(destFile);
      },
    },
  ],
});

manager.cleanOutput().makeDocs();
