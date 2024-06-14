import { docs, post, allDocuments as defaultAllPosts } from "contentlayer/generated";

export type Document = post | docs;

export const allPosts = defaultAllPosts.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export const getPostNavigation = (post: Document) => {
  const currentIndex = allPosts.findIndex((p) => p.title === post.title);

  const next = allPosts[currentIndex - 1];
  const prev = allPosts[currentIndex + 1];

  return {
    next,
    prev,
  };
};

export class DocumentBuilder {
  private documents = allPosts.filter((post) => post.draft !== true);

  getDocuments() {
    return this.documents;
  }

  getPostByParams(params: string) {
    return this.documents.find((post) => post.url === params);
  }

  private getPostsFromType(type: "post" | "docs") {
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

  query({ tags, src, type }: { tags?: string[]; src?: string; type?: "post" | "docs" }) {
    if (tags) this.getPostsFromTag(tags);
    if (src) this.getPostsFromSourceFileDir(src);
    if (type) this.getPostsFromType(type);

    return this;
  }
}

export const documentBuilder = new DocumentBuilder();
