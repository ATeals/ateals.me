"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

export function Giscus({ classname }: { classname?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const current = theme === "dark" ? "dark" : "light";

  const setTheme = (theme: string) => {
    const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
    iframe?.contentWindow?.postMessage({ giscus: { setConfig: { theme } } }, "https://giscus.app");
  };

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const scriptElem = document.createElement("script");
    scriptElem.src = "https://giscus.app/client.js";
    scriptElem.async = true;
    scriptElem.crossOrigin = "anonymous";

    scriptElem.setAttribute("data-repo", "ATeals/comments");
    scriptElem.setAttribute("data-repo-id", "R_kgDOKEaPrQ");
    scriptElem.setAttribute("data-category", "General");
    scriptElem.setAttribute("data-category-id", "DIC_kwDOKEaPrc4CYaX_");
    scriptElem.setAttribute("data-mapping", "og:title");
    scriptElem.setAttribute("data-strict", "0");
    scriptElem.setAttribute("data-reactions-enabled", "1");
    scriptElem.setAttribute("data-emit-metadata", "0");
    scriptElem.setAttribute("data-input-position", "top");
    scriptElem.setAttribute("data-theme", current);
    scriptElem.setAttribute("data-lang", "ko");
    // scriptElem.setAttribute("data-loading", "lazy");
    scriptElem.setAttribute("async", "");
    ref.current.appendChild(scriptElem);
  }, []);

  useEffect(() => {
    setTheme(current);
  }, [current]);

  useEffect(() => {
    const root = document.querySelector("html");

    if (root?.classList.contains("dark")) setTheme(current);
  }, []);

  return <section className={classname} ref={ref} />;
}
