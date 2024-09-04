import { allDocuments as defaultAllPosts, Blog, Docs, Link, Snapshot } from "contentlayer/generated";

export type Document = Blog | Docs | Link | Snapshot;

export type DocumentType = "Blog" | "Docs" | "Snapshot" | "Link";

export const DOCUMENT_TYPES = {
  BLOG: "Blog",
  DOCS: "Docs",
  SNAPSHOT: "Snapshot",
  LINK: "Link",
} as const;

export const allPosts = defaultAllPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const getPostNavigation = (post: Document) => {
  if (post.type === DOCUMENT_TYPES.LINK) return { next: undefined, prev: undefined };

  const posts = new DocumentBuilder().query({ src: post.src }).getDocuments();

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

  getDocuments({ filter }: { filter?: DocumentType[] } = {}) {
    if (filter) {
      return this.documents.filter((post) => filter.includes(post.type));
    }

    return this.documents.filter((post) => post.type !== "Link");
  }

  getPostByParams(params: string) {
    return this.documents.find((post) => post.url === params);
  }

  private getPostsFromType(type: DocumentType) {
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

  query({ tags, src, type, order }: { tags?: string[]; src?: string; type?: DocumentType; order?: "asc" | "desc" }) {
    if (tags) this.getPostsFromTag(tags);
    if (src) this.getPostsFromSourceFileDir(src);
    if (type) this.getPostsFromType(type);
    if (order) this.sortPostsByDate(order);

    return this;
  }

  sortPostsByDate(order: "asc" | "desc" = "desc") {
    this.documents = this.documents.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      return order === "asc" ? dateA - dateB : dateB - dateA;
    });

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
