export type TOCSection = {
  slug: string;
  text: string;
  level: 1 | 2 | 3;
};

export const parseToc = (source: string) => {
  return source
    .split("\n")
    .filter((line) => line.match(/(^#{1,3})\s/))
    .reduce<TOCSection[]>((ac, rawHeading) => {
      const removeMdx = rawHeading
        .replace(/^##*\s/, "")
        .replace(/[\*,\~]{2,}/g, "")
        .replace(/(?<=\])\((.*?)\)/g, "")
        .replace(/(?<!\S)((http)(s?):\/\/|www\.).+?(?=\s)/g, "");

      const section = {
        slug: removeMdx
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣 -]/g, "")
          .replace(/\s/g, "-"),
        text: removeMdx,
        level: (rawHeading.split("#").length - 1) as 1 | 2 | 3,
      };

      return [...ac, section];
    }, []);
};
