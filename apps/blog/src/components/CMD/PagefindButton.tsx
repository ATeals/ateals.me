import { Button } from '@/components/ui/button';

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
