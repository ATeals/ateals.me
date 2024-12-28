export const IMG = ({ src, alt, title }: { src: string; alt: string; title?: string }) => {
  const caption = alt.includes('caption:') ? alt.split('caption:')[1] : null;

  return (
    <div className="mx-auto">
      <img src={src} alt={alt} title={title} className="my-0" />
      {caption && <p className="mt-0 text-center text-sm text-gray-400">{caption}</p>}
    </div>
  );
};
