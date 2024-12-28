import type { CollectionData } from '@/service/mdx';

type PostIconProps = {
  post: CollectionData;
};

export function PostIcon({ post }: PostIconProps) {
  return (
    post.data.icon && (
      <div className="absolute -top-10 left-1/2 flex h-20 w-20 -translate-x-1/2 transform items-center justify-center overflow-hidden rounded-full bg-zinc-100 text-5xl shadow-md">
        {post.iconType !== 'url' ? (
          post.data.icon
        ) : (
          <img src={post.data.icon} alt={post.data.description} className="h-15 w-16 rounded-full" />
        )}
      </div>
    )
  );
}
