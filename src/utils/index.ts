export const generateClassName = (...rest: Array<string | undefined | false>) =>
  rest.filter((i) => i).join(" ");
