import { cn } from '@/lib/utils';

import { Badge } from './ui/badge';

export const TagList = ({ tags, className }: { tags?: string[]; className?: string }) => {
  const goToTag = (tag: string) => {
    window.location.href = `/tags/${tag}`;
  };

  return (
    <ul className={cn(className)}>
      {tags?.map((tag) => (
        <button
          key={tag}
          className="z-10 mr-1"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = `/tags/${tag}`;
          }}
        >
          <Badge className="text-[0.5rem]">{tag}</Badge>
        </button>
      ))}
    </ul>
  );
};
