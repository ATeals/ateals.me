import { Post, allPosts as defaultAllPosts } from "contentlayer/generated";

export const allPosts = defaultAllPosts.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export const getPostByParams = (params: string) => allPosts.find((post) => post.url === params);

export const getPostsWithQuerys = ({
  tags,
  section,
}: { tags?: string[]; section?: string } = {}) => {
  let posts = allPosts;

  if (tags) {
    posts = getPostsFromTag(tags);
  }

  if (section) {
    posts = getPostsFromSection(section);
  }

  return posts;
};

const getPostsFromSection = (section: string) => {
  return allPosts.filter((post) => post._raw.sourceFileDir === section);
};

const getPostsFromTag = (tags: string[]) => {
  if (tags.length === 0) return allPosts;

  return allPosts.filter((post) => post.tags?.some((tag) => tags.includes(tag)));
};

export const getPostNavigation = (post: Post) => {
  const currentIndex = allPosts.findIndex((p) => p.title === post.title);

  const next = allPosts[currentIndex - 1];
  const prev = allPosts[currentIndex + 1];

  return {
    next,
    prev,
  };
};
