import { docs, post, allDocuments as defaultAllPosts, link, snapshot } from "contentlayer/generated";

export type Document = post | docs | link | snapshot;

export type PostType = "post" | "docs" | "snapshot" | "link";

export const allPosts = defaultAllPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const getPostNavigation = (post: Document) => {
  const posts = new DocumentBuilder().getDocuments();

  const currentIndex = posts.findIndex((p) => p.title === post.title);

  const next = posts[currentIndex - 1];
  const prev = posts[currentIndex + 1];

  return {
    next,
    prev,
  };
};

export class DocumentBuilder {
  private documents = allPosts.filter((post) => post.draft !== true);

  getDocuments({ filter }: { filter?: PostType[] } = {}) {
    if (filter) {
      return this.documents.filter((post) => filter.includes(post.type));
    }

    return this.documents.filter((post) => post.type !== "link");
  }

  getPostByParams(params: string) {
    return this.documents.find((post) => post.url === params);
  }

  private getPostsFromType(type: PostType) {
    this.documents = this.documents.filter((post) => post.type === type);

    return this;
  }

  private getPostsFromSourceFileDir(section: string) {
    this.documents = this.documents.filter((post) =>
      post._raw.sourceFileDir
        .split("/")
        .slice(1)
        .some((dir) => section.split("/").includes(dir))
    );

    return this;
  }

  private getPostsFromTag(tags: string[]) {
    if (tags.length === 0) return allPosts;

    this.documents = this.documents.filter((post) => post.tags?.some((tag) => tags.includes(tag)));

    return this;
  }

  query({ tags, src, type }: { tags?: string[]; src?: string; type?: PostType }) {
    if (tags) this.getPostsFromTag(tags);
    if (src) this.getPostsFromSourceFileDir(src);
    if (type) this.getPostsFromType(type);

    return this;
  }

  getAllTags() {
    return allPosts.reduce((tags: string[], post) => {
      if (!post.tags) return tags;

      for (const tag of post.tags) {
        if (tags.some((t) => t === tag)) continue;

        tags.push(tag);
      }

      return tags;
    }, []);
  }
}

export const documentBuilder = new DocumentBuilder();
