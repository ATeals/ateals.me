import { Post } from "contentlayer/generated";

export interface PostsGroupedByYear {
  year: number;
  posts: Post[];
}

export const groupPostsByYear = (posts: Post[]) => {
  const grouped = posts.reduce<{ [key: number]: PostsGroupedByYear }>((acc, post) => {
    const year = new Date(post.date).getFullYear();

    if (!acc[year]) {
      acc[year] = { year, posts: [] };
    }
    acc[year].posts.push(post);

    return acc;
  }, {});

  const result: PostsGroupedByYear[] = Object.values(grouped);

  result.sort((a, b) => b.year - a.year);

  return result;
};
