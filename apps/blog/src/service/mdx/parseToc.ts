export type TOCSection = {
  slug: string;
  text: string;
  link: string;
  level: 1 | 2 | 3;
};

export const parseToc = (source: string) => {
  return source
    .split("\n")
    .filter((line) => line.match(/(^#{1,3})\s/))
    .reduce<TOCSection[]>((ac, rawHeading) => {
      const removeMdx = rawHeading.replace(/^##*\s/, "").replaceAll("`", "");

      const level = rawHeading.match(/^#+/)?.[0].length ?? 0;

      const section = {
        slug: removeMdx
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣 -]/g, "")
          .replace(/\s/g, " "),
        text: removeMdx.replace(/\[(.*?)\]\(.*?\)/g, "$1"),
        link: removeMdx.replace(/\[(.*?)\]\(.*?\)/g, ""),
        level: level as 1 | 2 | 3,
      };

      return [...ac, section];
    }, []);
};
