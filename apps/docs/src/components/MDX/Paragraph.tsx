import { Backlink } from "./Backlink";
import React from "react";

export const splitByBrackets = (input: string) => {
  const regex = /\[\[.*?\]\]/g;
  const matches = input.match(regex) || [];
  const parts = input.split(regex);

  if (matches.length < 1) return [input];

  return parts.reduce((acc: string[], part, index) => {
    if (part) acc.push(part);
    if (matches[index]) acc.push(matches[index]);
    return acc;
  }, []);
};

export const Paragraph = ({ children }: React.HTMLProps<HTMLParagraphElement>) => {
  if (typeof children !== "string") return <>{children}</>;

  const parts = splitByBrackets(children);

  return (
    <p>
      {parts.map((p) => (
        <Backlink>{p}</Backlink>
      ))}
    </p>
  );
};
