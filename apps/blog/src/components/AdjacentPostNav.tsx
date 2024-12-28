import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';
import type { CollectionData } from '@/service/mdx';

import { Button } from './ui/button';

interface AdjacentPostNavProps extends HTMLAttributes<HTMLDivElement> {
  prev?: CollectionData;
  next?: CollectionData;
}

export const AdjacentPostNav = ({ prev, next, ...props }: AdjacentPostNavProps) => {
  return (
    <div {...props}>
      {prev && <NavigationButton post={prev} direction="prev" />}
      {next && <NavigationButton post={next} direction="next" />}
    </div>
  );
};

const NavigationButton = ({ post, direction }: { post: CollectionData; direction: 'prev' | 'next' }) => {
  return (
    <Button variant={'ghost'} className={cn(direction === 'prev' ? 'justify-normal' : 'justify-end')} asChild>
      <a className={cn('w-full', direction === 'prev' ? 'items-start text-left' : 'text-right')} href={post.href}>
        {direction === 'prev' && <span>{'이전 글'}</span>}
        <span className="w-4/5 truncate font-light">{post.data.title}</span>
        {direction === 'next' && <span>{'다음 글'}</span>}
      </a>
    </Button>
  );
};
