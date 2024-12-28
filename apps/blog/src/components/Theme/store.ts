import { persistentAtom } from '@nanostores/persistent';
import { onMount } from 'nanostores';

export const THEME_MAP = {
  light: 'light',
  dark: 'dark',
  system: undefined
} as const;

export const applyNextTheme = (theme: ThemeValue) => {
  return theme ? (theme === 'light' ? 'dark' : undefined) : 'light';
};

export const NEXT_THEME_MAP = {
  light: 'dark',
  dark: 'system',
  system: 'light'
} as const;

export type ThemeKey = keyof typeof THEME_MAP;
export type ThemeValue = (typeof THEME_MAP)[ThemeKey];

export const STORAGE_THEME_KEY = 'theme' as const;

export const themeStore = persistentAtom<ThemeValue>(STORAGE_THEME_KEY, THEME_MAP.system);

export const initThemeStoreSubscribe = () => {
  const applyTheme = (theme: ThemeValue) => {
    if (theme === THEME_MAP.dark) {
      document.documentElement.classList.add('dark');

      return;
    }

    document.documentElement.classList.remove('dark');
  };

  const handleMediaQuery = (query: { matches: boolean }) => {
    applyTheme(query.matches ? 'dark' : 'light');
  };

  themeStore.subscribe((theme) => {
    if (theme !== THEME_MAP.system) {
      applyTheme(theme);
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    // EventListener가 중복 등록되지 않도록 제거 후 등록합니다.
    mediaQuery.removeEventListener('change', handleMediaQuery);
    mediaQuery.addEventListener('change', handleMediaQuery);
    handleMediaQuery(mediaQuery);
  });
};

if (typeof window !== 'undefined') {
  onMount(themeStore, initThemeStoreSubscribe);
}
