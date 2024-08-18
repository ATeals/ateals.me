import { HTMLProps } from "react";

export const HitBadge = (props: HTMLProps<HTMLImageElement>) => (
  <img
    src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fblog.ateals.me&count_bg=%235876A2&title_bg=%23555555&icon=&icon_color=%23C1B8B8&title=HITS&edge_flat=false"
    {...props}
  />
);
