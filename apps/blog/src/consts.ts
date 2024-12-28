import type { IconType } from 'react-icons';
import { IoLogoGithub } from 'react-icons/io';
import { IoMdMail } from 'react-icons/io';

export const SITE = {
  title: 'Ateals Blog',
  description: '개발자 Ateals의 블로그입니다.',
  img: '/main.jpg',
  logo: '/logo.png',
  domain: import.meta.env.DEV ? 'http://localhost:4321/' : 'https://blog.ateals.site/',
  author: {
    name: 'Ateals',
    logo: '/logo.png',
    github: 'https://github.com/ATeals'
  }
};

export interface LinkIcon {
  name: string;
  href: string;
  Icon: string | IconType;
}

export const SOCIAL_LINKS: LinkIcon[] = [
  {
    name: 'Github',
    href: 'https://github.com/ATeals',
    Icon: IoLogoGithub
  },
  {
    name: 'Mail',
    href: 'mailto:ateals@icloud.com',
    Icon: IoMdMail
  }
];
