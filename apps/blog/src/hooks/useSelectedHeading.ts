import { useEffect, useState } from "react";

export const useSelectedHeading = ({
  intersectionObserverOptions = { rootMargin: "0px 0px -80% 0px" },
}: {
  intersectionObserverOptions?: IntersectionObserverInit;
} = {}) => {
  const [activeHeading, setActiveHeading] = useState({ value: "", level: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const headingElement = entry.target as HTMLHeadingElement;

          setActiveHeading({
            value: headingElement.innerText,
            level: Number(headingElement.tagName.replace("H", "")),
          });
        }
      });
    }, intersectionObserverOptions);

    const headingElements = document.querySelectorAll("h1, h2, h3");

    headingElements.forEach((element) => observer.observe(element));

    return () => {
      headingElements.forEach((element) => observer.unobserve(element));
    };
  }, []);

  return { activeHeading };
};
