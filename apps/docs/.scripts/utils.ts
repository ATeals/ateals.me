import { parse, format, ParsedPath } from "path";
import { createHash, Hash } from "crypto";

export class Utils {
  static convertToMdx(destFile: string): string {
    const parsedPath: ParsedPath = parse(destFile);

    parsedPath.ext = ".mdx";
    parsedPath.base = `${parsedPath.name}${parsedPath.ext}`;

    return format(parsedPath);
  }

  static hashFileName(destFile: string): string {
    const parsedPath: ParsedPath = parse(destFile);
    const hash: Hash = createHash("sha256");
    hash.update(parsedPath.base);
    const hashedName: string = hash.digest("hex");
    parsedPath.name = hashedName;
    parsedPath.base = `${hashedName}${parsedPath.ext}`;
    return format(parsedPath);
  }
}
