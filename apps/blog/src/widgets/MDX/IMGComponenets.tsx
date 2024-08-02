import { HTMLProps } from "react";

export const IMGComponenets = (props: HTMLProps<HTMLImageElement>) => (
  <span className="w-full mb-10 flex flex-col items-center">
    <img
      src={props.src}
      alt={props.alt}
      className="shadow-lg object-contain object-center mx-10 max-h-dvh mb-2"
    />
    <span className="text-center text-sm text-gray-500">{props.alt}</span>
  </span>
);
