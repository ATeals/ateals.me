import { Button } from '@repo/shadcn/components';

export function PagefindButton() {
  const handleClick = () => {
    const openSearchEvent = new Event('openSearch');

    document.dispatchEvent(openSearchEvent);
  };

  return (
    <Button variant={'ghost'} onClick={handleClick}>
      ⌘K
    </Button>
  );
}
