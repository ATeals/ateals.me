import type { ReactNode } from 'react';

export interface PostType {
  title: string;
  icon: ReactNode;
  description: string;
  href: string;
}

export type PostTypeKey = Exclude<keyof typeof POSTS_TYPES_MAP, 'ALL'>;

export const POSTS_TYPES_MAP = {
  ALL: {
    title: 'ALL',
    icon: '📚',
    href: 'posts',
    description: '블로그의 모든 포스트 모음.'
  },
  dev: {
    title: 'DEV',
    icon: '👾',
    href: 'dev',
    description: '개발하면서 느낀 인사이트.'
  },
  docs: {
    title: 'DOCS',
    icon: '💻',
    href: 'docs',
    description: '보기 편한 형태의 유용한 자료.'
  },
  snippet: {
    title: 'SNIPPET',
    icon: '🧩',
    href: 'snippet',
    description: '코드 조각.'
  }
} as const;

export const POST_TYPES = Object.entries(POSTS_TYPES_MAP).flatMap(([type, value]) => ({
  type,
  ...value
}));
