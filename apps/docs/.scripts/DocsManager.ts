import { existsSync, rmSync, mkdirSync, readdirSync, lstatSync, copyFileSync, writeFileSync } from "fs";
import { join, extname } from "path";

interface DocsManagerOptions {
  input: string;
  output: string;
  excludes?: string[];
  fileEvents?: FileEvent[];
}

export interface FileEvent {
  fileExt: string;
  handler: (destFile: string, manager: DocsManager) => string;
}
export class DocsManager {
  input: string;
  output: string;
  excludes: string[];
  fileEvents: FileEvent[];

  constructor(options: DocsManagerOptions) {
    const { input, output, excludes = [], fileEvents = [] } = options;
    this.input = input;
    this.output = output;
    this.excludes = excludes;
    this.fileEvents = fileEvents;
  }

  cleanOutput() {
    if (existsSync(this.output)) {
      rmSync(this.output, { recursive: true, force: true });
    }

    mkdirSync(this.output);
    return this;
  }

  isFolder(file: string) {
    return lstatSync(file).isDirectory();
  }

  setFileEvent(fileEvents: FileEvent[]) {
    this.fileEvents = fileEvents;

    return this;
  }

  makeDocs({ fileEvents, options }: { fileEvents?: FileEvent[]; options?: DocsManagerOptions } = {}) {
    if (fileEvents) this.setFileEvent(fileEvents);

    const { input, output } = options || this;

    this.copyDirectory(input, output);

    return this;
  }

  private copyDirectory(input: string, output: string) {
    readdirSync(input).forEach((file: string) => {
      if (this.excludes.includes(file)) return;

      const srcFile: string = join(input, file);
      const destFile: string = join(output, file);

      if (this.isFolder(srcFile)) {
        this.copyFolder(srcFile, destFile);
      } else {
        this.copyFile(srcFile, destFile);
      }
    });
  }

  private copyFolder(src: string, dest: string) {
    const encoded = encodeURI(dest);

    mkdirSync(encoded, { recursive: true });

    const folderName = dest.split("/").at(-1)!;

    const parent = encoded.split("/").slice(0, -1).join("/");

    const md = `${encoded.split("/").at(-1)}.mdx`;

    const meta = `---\ntitle: ${folderName}\n---`;

    if (!existsSync(`${parent}/${md}`)) writeFileSync(`${parent}/${md}`, meta);

    this.copyDirectory(src, dest);
  }

  private copyFile(src: string, dest: string) {
    if (this.fileEvents) {
      for (const { fileExt, handler } of this.fileEvents) {
        if (extname(src) === `.${fileExt}`) {
          dest = handler(dest, this);
        }
      }
    }
    copyFileSync(src, dest);
  }
}
