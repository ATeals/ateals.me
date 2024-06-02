import { HTMLProps } from "react";

export const IMGComponenets = (props: HTMLProps<HTMLImageElement>) => (
  <span className="w-full mb-10 flex flex-col items-center">
    <img
      src={props.src}
      alt={props.alt}
      className="shadow-lg object-contain object-center w-2/3 mb-2"
    />
    <span className="text-center text-sm text-gray-500">{props.alt}</span>
  </span>
);
