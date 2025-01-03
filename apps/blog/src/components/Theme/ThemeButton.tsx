import { useStore } from '@nanostores/react';
import { Button } from '@repo/shadcn/components';
import { FaRegLightbulb } from 'react-icons/fa';
import { FaLightbulb } from 'react-icons/fa';

import { themeStore } from './store';

export const ThemeButton = () => {
  const theme = useStore(themeStore);

  const handleClick = () => {
    themeStore.set(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button className="btn" variant={'ghost'} onClick={handleClick}>
      {theme === 'dark' ? <FaRegLightbulb /> : <FaLightbulb />}
    </Button>
  );
};
