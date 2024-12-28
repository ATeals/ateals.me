import { FaExternalLinkAlt } from 'react-icons/fa';

import { cn } from '@/lib/utils';

export const OutLink = ({ href, children }: { href: string; children?: string }) => {
  return (
    <a
      href={href}
      target="_blank"
      className={cn(
        'inline-flex items-baseline gap-1',
        'no-underline transition-all duration-500 hover:text-primary-lg',
        'relative',
        'before:absolute before:bottom-0 before:left-0 before:h-[1px] before:w-0 before:bg-primary-lg before:transition-all before:duration-500',
        'hover:before:w-full'
      )}
    >
      <span>{children}</span> <FaExternalLinkAlt size={12} />
    </a>
  );
};
