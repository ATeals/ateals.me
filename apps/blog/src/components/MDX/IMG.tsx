import { cn } from '@repo/shadcn/utils';

export const IMG = ({
  src,
  alt,
  title,
  ...props
}: {
  src: string;
  alt: string;
  title?: string;
  className?: string;
}) => {
  const caption = alt.includes('caption:') ? alt.split('caption:')[1] : null;

  return caption ? (
    <div {...props} className={cn('mx-auto', props.className)}>
      <img src={src} alt={alt} title={title} className="my-0" />
      <p className="mt-0 text-center text-sm text-gray-400">{caption}</p>
    </div>
  ) : (
    <img src={src} alt={alt} title={title} {...props} className={cn(props.className)} />
  );
};
