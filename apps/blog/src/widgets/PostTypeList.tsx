import { POST_TYPES } from "@/config";
import Link from "next/link";

export const PostTypeList = () => {
  return (
    <section>
      <article className="space-y-2.5">
        <Link href="/posts" className="flex gap-2 hover:underline hover:text-secondary-md">
          <h1 className="w-1/5">{"ALL"}</h1>
          <p className="font-light ">{"블로그의 모든 글"}</p>
        </Link>
        {POST_TYPES.map(({ description, type, url, title }) => (
          <Link key={type} href={url} className="flex gap-2 hover:underline hover:text-secondary-md">
            <h1 className="w-1/5">{title}</h1>
            <p className="font-light ">{description}</p>
          </Link>
        ))}
      </article>
    </section>
  );
};
