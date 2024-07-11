import { cn } from "@repo/shadcn/utils";
import { usePostContext } from "./PostProvider";
import { format, parseISO } from "date-fns";

export const POST_DATE_LABEL_MAP = {
  YEAR: (date: string) => date.slice(0, 4),
  DOT_EXCUDE_YEAR: (date: string) => date.slice(5, 10).replace("-", ". "),
  DEFAULT: (date: string) => format(parseISO(date), "LLLL d, yyyy"),
  DOT: (date: string) => date.slice(0, 10).replaceAll("-", ". "),
};

export const PostDATELABLE = ({
  dateType = "DEFAULT",
  className,
  ...props
}: React.HTMLProps<HTMLHeadingElement> & {
  enableHover?: boolean;
  dateType?: keyof typeof POST_DATE_LABEL_MAP;
}) => {
  const post = usePostContext();

  const date = POST_DATE_LABEL_MAP[dateType](post.date);

  return (
    <span className={cn(className)} {...props}>
      {date}
    </span>
  );
};
