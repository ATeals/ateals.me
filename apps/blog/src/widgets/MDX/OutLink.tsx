"use client";

import { FiExternalLink } from "react-icons/fi";

export const OutLink = ({ href, children }: { href?: string; children?: React.ReactNode }) => {
  return (
    <a href={href} target="_blank" className="text-primary-lg hover:underline inline-flex items-baseline">
      {children}
    </a>
  );
};
